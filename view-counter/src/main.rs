use axum::{
    extract::{Path, State, ConnectInfo},
    http::{StatusCode, HeaderMap},
    routing::{get, post, delete},
    Json, Router,
};
use serde::{Deserialize, Serialize};
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

struct AppState { 
    view_matches: RwLock<HashMap<String, MatchState>>, 
    redis: redis::Client,
}
type MatchState = HashMap<String, Vec<Viewer>>;

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
    let client = redis::Client::open(redis_url).expect("Invalid Redis URL");

    let state = Arc::new(AppState { 
        view_matches: RwLock::new(HashMap::new()), 
        redis: client,
    });

    let app = Router::new()
        .route("/", get(health_check))
        .route("/ping", post(handle_ping))
        .route("/views/all", get(get_all_views))
        .route("/chat/messages", get(get_messages))
        .route("/chat/send", post(send_message))
        .route("/chat/message/:id", delete(delete_message))
        .layer(CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any))
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3001));
    println!("REDIS CHAT & VIEW SERVER STARTING ON {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app.into_make_service_with_connect_info::<SocketAddr>()).await.unwrap();
}

async fn health_check() -> &'static str { "Reedstreams Global API (Redis Mode) is running!" }

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
