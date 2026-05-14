use axum::{
    body::Body,
    extract::{Path, State, ConnectInfo},
    http::{header, HeaderMap, HeaderValue, StatusCode},
    response::Response,
    routing::{get, post, delete},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;
use std::net::SocketAddr;
use std::sync::{Arc, RwLock};
use std::time::{Duration, Instant};
use tower_http::cors::{Any, CorsLayer};
use uuid::Uuid;
use chrono::{DateTime, Utc};

use redis::AsyncCommands;

const MAX_VIEWS_PER_IP: usize = 1; // 1-to-1 counting
const MAX_MESSAGES: isize = 500;
const REDIS_CHAT_KEY: &str = "chat:messages";
const PING_EXPIRY_SECS: u64 = 60; // Viewers expire after 1 minute of inactivity
const REDIS_MATCH_KEY_PREFIX: &str = "match:data:";
const SOURCE_CACHE_EXPIRY_SECS: u64 = 86400; // 24 hours grace period for matches
const REDIS_API_CACHE_KEY_PREFIX: &str = "api:cache:";
const REDIS_IMAGE_CACHE_KEY_PREFIX: &str = "image:cache:";
const REDIS_IMAGE_CONTENT_TYPE_KEY_PREFIX: &str = "image:type:";
const API_CACHE_EXPIRY_SECS: u64 = 900; // 15 minutes
const API_CACHE_REFRESH_THRESHOLD_SECS: i64 = 300; // refresh when <= 5 minutes remain
const IMAGE_CACHE_EXPIRY_SECS: u64 = 86400; // 24 hours
const IMAGE_CACHE_REFRESH_THRESHOLD_SECS: i64 = 3600; // refresh when <= 1 hour remains
const UPSTREAM_API_BASE: &str = "https://streamed.pk/api";
const IMAGE_CACHE_CONTROL: &str = "public, max-age=86400, stale-while-revalidate=3600";

struct AppState { 
    view_matches: RwLock<HashMap<String, MatchState>>, 
    redis: redis::Client,
    http: reqwest::Client,
}
type MatchState = HashMap<String, Vec<Viewer>>;

#[derive(Serialize, Deserialize, Clone, Debug)]
struct Source {
    source: String,
    id: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct APIMatch {
    id: String,
    title: String,
    category: String,
    #[serde(default)]
    date: i64,
    #[serde(default)]
    poster: Option<String>,
    #[serde(default)]
    popular: bool,
    sources: Vec<Source>,
}

#[derive(Serialize, Deserialize, Clone)]
struct PingRequest { match_id: String }
#[derive(Serialize)]
struct ViewResponse { match_id: String, current_views: usize }
#[derive(Serialize)]
struct AllViewsResponse { views: HashMap<String, usize> }
struct Viewer { last_ping: Instant }

#[derive(Serialize, Deserialize, Clone)]
struct ChatMessage { 
    id: Uuid, 
    username: String, 
    content: String, 
    timestamp: DateTime<Utc> 
}

#[derive(Deserialize)]
struct SendMessageRequest { username: String, content: String }
#[derive(Deserialize)]
struct DeleteMessageRequest { admin_key: String }

#[tokio::main]
async fn main() {
    let redis_url = std::env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1:6379".to_string());
    let client = redis::Client::open(redis_url.clone()).expect("Invalid Redis URL");
    let http = reqwest::Client::builder()
        .timeout(Duration::from_secs(20))
        .user_agent("Reedstreams-Backend/1.0")
        .build()
        .expect("Failed to build HTTP client");

    let state = Arc::new(AppState { 
        view_matches: RwLock::new(HashMap::new()), 
        redis: client,
        http,
    });

    // Start background source sync
    let sync_state = state.clone();
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(Duration::from_secs(300)); // Every 5 mins
        loop {
            interval.tick().await;
            if let Err(e) = sync_sources(&sync_state).await {
                eprintln!("Source sync error: {}", e);
            }
        }
    });

    let app = Router::new()
        .route("/", get(health_check))
        .route("/ping", post(handle_ping))
        .route("/views/all", get(get_all_views))
        .route("/match/:id", get(get_match_data))
        .route("/sports", get(get_sports))
        .route("/matches/all", get(get_all_matches))
        .route("/matches/live", get(get_live_matches))
        .route("/matches/:sport", get(get_matches_by_sport))
        .route("/stream/:source/:id", get(get_streams))
        .route("/images/*path", get(get_image))
        .route("/chat/messages", get(get_messages))
        .route("/chat/send", post(send_message))
        .route("/chat/message/:id", delete(delete_message))
        .layer(CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any))
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3001));
    println!("REDIS CHAT, VIEW & SOURCE SERVER STARTING ON {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app.into_make_service_with_connect_info::<SocketAddr>()).await.unwrap();
}

async fn sync_sources(state: &Arc<AppState>) -> Result<(), Box<dyn std::error::Error>> {
    let res = upstream_request(&state.http, "/matches/all").await?;
    let matches: Vec<APIMatch> = res.json().await?;

    let mut conn = state.redis.get_multiplexed_async_connection().await?;

    for m in matches {
        let key = format!("{}{}", REDIS_MATCH_KEY_PREFIX, m.id);
        
        // 1. Get existing data from Redis to merge sources
        let existing_json: Option<String> = conn.get(&key).await?;
        let mut final_match = m;

        if let Some(json) = existing_json {
            if let Ok(existing_match) = serde_json::from_str::<APIMatch>(&json) {
                // Merge sources, avoiding duplicates
                for ext in existing_match.sources {
                    if !final_match.sources.iter().any(|s| s.source == ext.source && s.id == ext.id) {
                        final_match.sources.push(ext);
                    }
                }
            }
        }

        // 2. Save merged match with expiry (grace period)
        let json = serde_json::to_string(&final_match)?;
        let _: () = conn.set_ex(&key, json, SOURCE_CACHE_EXPIRY_SECS).await?;
    }

    println!("Synced matches and sources at {}", Utc::now());
    Ok(())
}

async fn get_match_data(
    Path(id): Path<String>,
    State(state): State<Arc<AppState>>
) -> Result<Json<APIMatch>, StatusCode> {
    let mut conn = state.redis.get_multiplexed_async_connection().await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let key = format!("{}{}", REDIS_MATCH_KEY_PREFIX, id);
    
    let json: Option<String> = conn.get(&key).await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    
    if let Some(s) = json {
        let match_data: APIMatch = serde_json::from_str(&s).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        Ok(Json(match_data))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

async fn get_sports(State(state): State<Arc<AppState>>) -> Result<Json<Value>, StatusCode> {
    get_cached_json(state, "/sports").await
}

async fn get_all_matches(State(state): State<Arc<AppState>>) -> Result<Json<Value>, StatusCode> {
    get_cached_json(state, "/matches/all").await
}

async fn get_live_matches(State(state): State<Arc<AppState>>) -> Result<Json<Value>, StatusCode> {
    get_cached_json(state, "/matches/live").await
}

async fn get_matches_by_sport(
    Path(sport): Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<Json<Value>, StatusCode> {
    get_cached_json(state, &format!("/matches/{sport}")).await
}

async fn get_streams(
    Path((source, id)): Path<(String, String)>,
    State(state): State<Arc<AppState>>,
) -> Result<Json<Value>, StatusCode> {
    get_cached_json(state, &format!("/stream/{source}/{id}")).await
}

async fn get_image(
    Path(path): Path<String>,
    State(state): State<Arc<AppState>>,
) -> Result<Response, StatusCode> {
    get_cached_image(state, &format!("/images/{path}")).await
}

async fn health_check() -> &'static str { "Reedstreams Global API (Redis & Source Mode) is running!" }

async fn handle_ping(
    State(state): State<Arc<AppState>>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    headers: HeaderMap,
    Json(payload): Json<PingRequest>
) -> Json<ViewResponse> {
    let client_ip = get_client_ip(&headers, &addr);
    let now = Instant::now();
    let mut matches = state.view_matches.write().unwrap();
    let match_state = matches.entry(payload.match_id.clone()).or_insert_with(HashMap::new);

    // 1. Update/Add the current viewer
    let ip_viewers = match_state.entry(client_ip).or_insert_with(Vec::new);
    ip_viewers.push(Viewer { last_ping: now });
    if ip_viewers.len() > MAX_VIEWS_PER_IP {
        ip_viewers.remove(0);
    }

    // 2. GLOBAL CLEANUP
    clean_expired_viewers(match_state, now);

    let current_views = match_state.values().map(|v| v.len()).sum();
    Json(ViewResponse { match_id: payload.match_id, current_views })
}

async fn get_all_views(State(state): State<Arc<AppState>>) -> Json<AllViewsResponse> {
    let now = Instant::now();
    let mut matches = state.view_matches.write().unwrap();
    let mut views = HashMap::new();

    for (match_id, match_state) in matches.iter_mut() {
        clean_expired_viewers(match_state, now);
        let count = match_state.values().map(|v| v.len()).sum();
        if count > 0 {
            views.insert(match_id.clone(), count);
        }
    }
    
    Json(AllViewsResponse { views })
}

fn clean_expired_viewers(match_state: &mut MatchState, now: Instant) {
    match_state.retain(|_, viewers| {
        viewers.retain(|v| now.duration_since(v.last_ping) < Duration::from_secs(PING_EXPIRY_SECS));
        !viewers.is_empty()
    });
}

fn get_client_ip(headers: &HeaderMap, addr: &SocketAddr) -> String {
    headers
        .get("cf-connecting-ip")
        .and_then(|v| v.to_str().ok())
        .or_else(|| {
            headers
                .get("x-forwarded-for")
                .and_then(|v| v.to_str().ok())
                .and_then(|v| v.split(',').next())
                .map(|v| v.trim())
        })
        .map(|v| v.to_string())
        .unwrap_or_else(|| addr.ip().to_string())
}

async fn get_messages(State(state): State<Arc<AppState>>) -> Json<Vec<ChatMessage>> {
    let mut conn = state.redis.get_multiplexed_async_connection().await.expect("Redis connect fail");
    let raw_messages: Vec<String> = conn.lrange(REDIS_CHAT_KEY, 0, -1).await.unwrap_or_default();
    let messages: Vec<ChatMessage> = raw_messages.iter().filter_map(|s| serde_json::from_str(s).ok()).collect();
    Json(messages)
}

async fn send_message(State(state): State<Arc<AppState>>, Json(payload): Json<SendMessageRequest>) -> (StatusCode, Json<ChatMessage>) {
    let new_msg = ChatMessage { id: Uuid::new_v4(), username: payload.username, content: payload.content, timestamp: Utc::now() };
    let mut conn = state.redis.get_multiplexed_async_connection().await.expect("Redis connect fail");
    let message_json = serde_json::to_string(&new_msg).unwrap();
    let _: () = conn.rpush(REDIS_CHAT_KEY, message_json).await.unwrap();
    let _: () = conn.ltrim(REDIS_CHAT_KEY, -MAX_MESSAGES, -1).await.unwrap();
    (StatusCode::CREATED, Json(new_msg))
}

async fn delete_message(Path(id): Path<Uuid>, State(state): State<Arc<AppState>>, Json(payload): Json<DeleteMessageRequest>) -> StatusCode {
    let received = payload.admin_key.trim().to_lowercase();
    if received != "obsessed_boss_2026" && received != "obsessed_boss" { return StatusCode::UNAUTHORIZED; }
    
    let mut conn = state.redis.get_multiplexed_async_connection().await.expect("Redis connect fail");
    
    // We need to find the message string to delete it from the list
    let raw_messages: Vec<String> = conn.lrange(REDIS_CHAT_KEY, 0, -1).await.unwrap_or_default();
    let target_json = raw_messages.iter().find(|s| {
        if let Ok(msg) = serde_json::from_str::<ChatMessage>(s) {
            msg.id == id
        } else {
            false
        }
    }).cloned();

    if let Some(json) = target_json {
        let _: () = conn.lrem(REDIS_CHAT_KEY, 1, json).await.unwrap_or_default();
        StatusCode::OK
    } else {
        StatusCode::NOT_FOUND
    }
}

async fn get_cached_json(state: Arc<AppState>, api_path: &str) -> Result<Json<Value>, StatusCode> {
    let cache_key = api_cache_key(api_path);

    if let Some(cached) = get_cached_value(&state, &cache_key).await? {
        if should_refresh_cache(&state, &cache_key, API_CACHE_REFRESH_THRESHOLD_SECS).await {
            let refresh_state = state.clone();
            let refresh_path = api_path.to_string();
            tokio::spawn(async move {
                if let Err(err) = refresh_cached_json(refresh_state, refresh_path).await {
                    eprintln!("Background API refresh failed: {}", err);
                }
            });
        }

        return Ok(Json(cached));
    }

    let payload = fetch_and_cache_json(&state, api_path).await?;
    Ok(Json(payload))
}

async fn get_cached_value(state: &Arc<AppState>, cache_key: &str) -> Result<Option<Value>, StatusCode> {
    let mut conn = state
        .redis
        .get_multiplexed_async_connection()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let cached: Option<String> = conn
        .get(cache_key)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    match cached {
        Some(json) => serde_json::from_str(&json)
            .map(Some)
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR),
        None => Ok(None),
    }
}

async fn should_refresh_cache(state: &Arc<AppState>, cache_key: &str, threshold_secs: i64) -> bool {
    let mut conn = match state.redis.get_multiplexed_async_connection().await {
        Ok(conn) => conn,
        Err(_) => return false,
    };

    match conn.ttl::<_, i64>(cache_key).await {
        Ok(ttl) => ttl > 0 && ttl <= threshold_secs,
        Err(_) => false,
    }
}

async fn refresh_cached_json(state: Arc<AppState>, api_path: String) -> Result<(), StatusCode> {
    fetch_and_cache_json(&state, &api_path).await.map(|_| ())
}

async fn fetch_and_cache_json(state: &Arc<AppState>, api_path: &str) -> Result<Value, StatusCode> {
    let response = upstream_request(&state.http, api_path).await.map_err(map_reqwest_error)?;
    let payload: Value = response.json().await.map_err(|_| StatusCode::BAD_GATEWAY)?;

    let cache_key = api_cache_key(api_path);
    let serialized = serde_json::to_string(&payload).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let mut conn = state
        .redis
        .get_multiplexed_async_connection()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let _: () = conn
        .set_ex(&cache_key, serialized, API_CACHE_EXPIRY_SECS)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(payload)
}

async fn get_cached_image(state: Arc<AppState>, image_path: &str) -> Result<Response, StatusCode> {
    let data_key = image_cache_key(image_path);
    let content_type_key = image_content_type_cache_key(image_path);

    if let Some((bytes, content_type)) = get_cached_image_value(&state, &data_key, &content_type_key).await? {
        if should_refresh_cache(&state, &data_key, IMAGE_CACHE_REFRESH_THRESHOLD_SECS).await {
            let refresh_state = state.clone();
            let refresh_path = image_path.to_string();
            tokio::spawn(async move {
                if let Err(err) = refresh_cached_image(refresh_state, refresh_path).await {
                    eprintln!("Background image refresh failed: {}", err);
                }
            });
        }

        return Ok(build_image_response(bytes, &content_type));
    }

    let (bytes, content_type) = fetch_and_cache_image(&state, image_path).await?;
    Ok(build_image_response(bytes, &content_type))
}

async fn get_cached_image_value(
    state: &Arc<AppState>,
    data_key: &str,
    content_type_key: &str,
) -> Result<Option<(Vec<u8>, String)>, StatusCode> {
    let mut conn = state
        .redis
        .get_multiplexed_async_connection()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let bytes: Option<Vec<u8>> = conn
        .get(data_key)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let content_type: Option<String> = conn
        .get(content_type_key)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    match (bytes, content_type) {
        (Some(bytes), Some(content_type)) => Ok(Some((bytes, content_type))),
        _ => Ok(None),
    }
}

async fn refresh_cached_image(state: Arc<AppState>, image_path: String) -> Result<(), StatusCode> {
    fetch_and_cache_image(&state, &image_path).await.map(|_| ())
}

async fn fetch_and_cache_image(state: &Arc<AppState>, image_path: &str) -> Result<(Vec<u8>, String), StatusCode> {
    let response = upstream_request(&state.http, image_path).await.map_err(map_reqwest_error)?;
    let content_type = response
        .headers()
        .get("content-type")
        .and_then(|value| value.to_str().ok())
        .unwrap_or("application/octet-stream")
        .to_string();
    let bytes = response
        .bytes()
        .await
        .map_err(|_| StatusCode::BAD_GATEWAY)?
        .to_vec();

    let data_key = image_cache_key(image_path);
    let content_type_key = image_content_type_cache_key(image_path);
    let mut conn = state
        .redis
        .get_multiplexed_async_connection()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let _: () = conn
        .set_ex(&data_key, bytes.clone(), IMAGE_CACHE_EXPIRY_SECS)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let _: () = conn
        .set_ex(&content_type_key, content_type.clone(), IMAGE_CACHE_EXPIRY_SECS)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok((bytes, content_type))
}

async fn upstream_request(client: &reqwest::Client, api_path: &str) -> Result<reqwest::Response, reqwest::Error> {
    client
        .get(format!("{UPSTREAM_API_BASE}{api_path}"))
        .header("Origin", "https://streamed.pk")
        .header("Referer", "https://streamed.pk/")
        .send()
        .await?
        .error_for_status()
}

fn api_cache_key(api_path: &str) -> String {
    format!(
        "{}{}",
        REDIS_API_CACHE_KEY_PREFIX,
        api_path.trim_start_matches('/').replace('/', ":")
    )
}

fn image_cache_key(image_path: &str) -> String {
    format!(
        "{}{}",
        REDIS_IMAGE_CACHE_KEY_PREFIX,
        image_path.trim_start_matches('/').replace('/', ":")
    )
}

fn image_content_type_cache_key(image_path: &str) -> String {
    format!(
        "{}{}",
        REDIS_IMAGE_CONTENT_TYPE_KEY_PREFIX,
        image_path.trim_start_matches('/').replace('/', ":")
    )
}

fn build_image_response(bytes: Vec<u8>, content_type: &str) -> Response {
    let mut response = Response::new(Body::from(bytes));
    response.headers_mut().insert(
        header::CONTENT_TYPE,
        HeaderValue::from_str(content_type)
            .unwrap_or_else(|_| HeaderValue::from_static("application/octet-stream")),
    );
    response.headers_mut().insert(
        header::CACHE_CONTROL,
        HeaderValue::from_static(IMAGE_CACHE_CONTROL),
    );
    response
}

fn map_reqwest_error(error: reqwest::Error) -> StatusCode {
    if let Some(status) = error.status() {
        return StatusCode::from_u16(status.as_u16()).unwrap_or(StatusCode::BAD_GATEWAY);
    }

    if error.is_timeout() {
        StatusCode::GATEWAY_TIMEOUT
    } else {
        StatusCode::BAD_GATEWAY
    }
}
