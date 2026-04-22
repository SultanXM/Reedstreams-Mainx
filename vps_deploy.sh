# 1. Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env

# 2. Create the directory
mkdir -p /root/view-counter/src
cd /root/view-counter

# 3. Create Cargo.toml
cat > Cargo.toml << 'EOF'
[package]
name = "view-counter"
version = "0.1.0"
edition = "2021"

[dependencies]
axum = { version = "0.7", features = ["macros", "tokio"] }
tokio = { version = "1.0", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tower-http = { version = "0.5", features = ["cors"] }
tracing = "0.1"
tracing-subscriber = "0.3"
uuid = { version = "1.0", features = ["v4", "serde"] }
chrono = { version = "0.4", features = ["serde"] }
reqwest = { version = "0.12", features = ["json"] }

[profile.release]
lto = true
opt-level = 'z'
codegen-units = 1
EOF

# 4. Create main.rs
cat > src/main.rs << 'EOF'
use axum::{
    extract::{Path, State, Query},
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
use reqwest::Client;

const MAX_VIEWS_PER_IP: usize = 2;
const MAX_MESSAGES: usize = 100;

#[derive(Serialize, Deserialize, Clone)]
struct PingRequest { match_id: String }
#[derive(Serialize)]
struct ViewResponse { match_id: String, current_views: usize }
#[derive(Serialize)]
struct AllViewsResponse { views: HashMap<String, usize> }
struct Viewer { last_ping: Instant }
#[derive(Serialize, Deserialize, Clone)]
struct ChatMessage { id: Uuid, match_id: String, username: String, content: String, timestamp: DateTime<Utc> }
#[derive(Deserialize)]
struct SendMessageRequest { match_id: String, username: String, content: String }
#[derive(Deserialize)]
struct DeleteMessageRequest { admin_key: String }
#[derive(Deserialize)]
struct GetMessagesQuery { match_id: String }

struct AppState { 
    view_matches: RwLock<HashMap<String, MatchState>>, 
    chat_messages: RwLock<Vec<ChatMessage>>,
    http_client: Client,
}
type MatchState = HashMap<String, Vec<Viewer>>;

#[tokio::main]
async fn main() {
    let state = Arc::new(AppState { 
        view_matches: RwLock::new(HashMap::new()), 
        chat_messages: RwLock::new(Vec::new()),
        http_client: Client::new(),
    });

    let app = Router::new()
        .route("/", get(health_check))
        .route("/ping", post(handle_ping))
        .route("/views/all", get(get_all_views))
        .route("/chat/messages", get(get_messages))
        .route("/chat/send", post(send_message))
        .route("/chat/message/:id", delete(delete_message))
        .fallback(proxy_handler)
        .layer(CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any))
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 3001));
    println!("ROBUST PROXY SERVER STARTING ON {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app.into_make_service_with_connect_info::<SocketAddr>()).await.unwrap();
}

async fn health_check() -> &'static str {
    "Reedstreams Integrated API is running!"
}

async fn proxy_handler(
    State(state): State<Arc<AppState>>,
    req: axum::extract::Request,
) -> Result<axum::response::Response, StatusCode> {
    let path = req.uri().path();
    let query = req.uri().query().map(|q| format!("?{}", q)).unwrap_or_default();
    let url = format!("https://streamed.pk/api{}{}", path, query);
    
    let res = state.http_client
        .get(&url)
        .header("User-Agent", "ReedstreamsProxy/1.0")
        .send()
        .await
        .map_err(|e| {
            eprintln!("Proxy Error: {}", e);
            StatusCode::BAD_GATEWAY
        })?;

    let mut builder = axum::response::Response::builder().status(res.status());
    
    // Copy headers
    if let Some(content_type) = res.headers().get("content-type") {
        builder = builder.header("content-type", content_type);
    }

    let body = res.bytes().await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(builder.body(axum::body::Body::from(body)).unwrap())
}

async fn handle_ping(State(state): State<Arc<AppState>>, axum::extract::ConnectInfo(addr): axum::extract::ConnectInfo<SocketAddr>, Json(payload): Json<PingRequest>) -> Json<ViewResponse> {
    let mut matches = state.view_matches.write().unwrap();
    let match_state = matches.entry(payload.match_id.clone()).or_insert_with(HashMap::new);
    let ip_viewers = match_state.entry(addr.ip().to_string()).or_insert_with(Vec::new);
    let now = Instant::now();
    ip_viewers.retain(|v| now.duration_since(v.last_ping) < Duration::from_secs(150));
    if ip_viewers.len() < MAX_VIEWS_PER_IP { ip_viewers.push(Viewer { last_ping: now }); }
    let current_views = match_state.values().map(|v| v.len()).sum();
    Json(ViewResponse { match_id: payload.match_id, current_views })
}

async fn get_all_views(State(state): State<Arc<AppState>>) -> Json<AllViewsResponse> {
    let matches = state.view_matches.read().unwrap();
    let views = matches.iter().map(|(id, m)| (id.clone(), m.values().map(|v| v.len()).sum())).collect();
    Json(AllViewsResponse { views })
}

async fn get_messages(State(state): State<Arc<AppState>>, Query(query): Query<GetMessagesQuery>) -> Json<Vec<ChatMessage>> {
    let messages = state.chat_messages.read().unwrap();
    Json(messages.iter().filter(|m| m.match_id == query.match_id).cloned().collect())
}

async fn send_message(State(state): State<Arc<AppState>>, Json(payload): Json<SendMessageRequest>) -> (StatusCode, Json<ChatMessage>) {
    let mut messages = state.chat_messages.write().unwrap();
    let new_msg = ChatMessage { id: Uuid::new_v4(), match_id: payload.match_id, username: payload.username, content: payload.content, timestamp: Utc::now() };
    messages.push(new_msg.clone());
    if messages.len() > MAX_MESSAGES { messages.remove(0); }
    (StatusCode::CREATED, Json(new_msg))
}

async fn delete_message(Path(id): Path<Uuid>, State(state): State<Arc<AppState>>, Json(payload): Json<DeleteMessageRequest>) -> StatusCode {
    let received = payload.admin_key.trim().to_lowercase();
    if received != "obsessed_boss_2026" && received != "obsessed_boss" { return StatusCode::UNAUTHORIZED; }
    let mut messages = state.chat_messages.write().unwrap();
    messages.retain(|m| m.id != id);
    StatusCode::OK
}
EOF

# 5. Build the project
cargo build --release

# 6. Setup Background Service
cat > /etc/systemd/system/view-counter.service << 'EOF'
[Unit]
Description=Rust View Counter & Chat
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/view-counter
ExecStart=/root/view-counter/target/release/view-counter
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# 7. Start the service
systemctl daemon-reload
systemctl enable view-counter
systemctl restart view-counter

echo "✅ Backend successfully deployed on port 3001!"
