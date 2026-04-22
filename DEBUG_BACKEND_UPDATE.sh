#!/bin/bash
# 1. Stop service
systemctl stop view-counter
pkill -9 view-counter

# 2. Write Debug Code
mkdir -p /root/view-counter/src
cat > /root/view-counter/src/main.rs << 'EOF'
use axum::{
    extract::{Path, State, Query},
    http::StatusCode,
    routing::{get, post, delete},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::net::SocketAddr;
use std::sync::{Arc, RwLock};
use std::time::{Duration, Instant};
use tokio::time::interval;
use tower_http::cors::{Any, CorsLayer};
use uuid::Uuid;
use chrono::{DateTime, Utc};

const VIEW_TIMEOUT: Duration = Duration::from_secs(150);
const CLEANUP_INTERVAL: Duration = Duration::from_secs(60);
const MAX_VIEWS_PER_IP: usize = 2;
const MAX_MESSAGES: usize = 100;
const ADMIN_KEY: &str = "obsessed_boss_2026"; 

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

struct AppState { view_matches: RwLock<HashMap<String, MatchState>>, chat_messages: RwLock<Vec<ChatMessage>> }
type MatchState = HashMap<String, Vec<Viewer>>;

#[tokio::main]
async fn main() {
    let state = Arc::new(AppState { view_matches: RwLock::new(HashMap::new()), chat_messages: RwLock::new(Vec::new()) });
    let app = Router::new()
        .route("/ping", post(handle_ping))
        .route("/views/all", get(get_all_views))
        .route("/chat/messages", get(get_messages))
        .route("/chat/send", post(send_message))
        .route("/chat/message/:id", delete(delete_message))
        .layer(CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any))
        .with_state(state);
    let addr = SocketAddr::from(([0, 0, 0, 0], 3001));
    println!("DEBUG SERVER STARTING ON {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app.into_make_service_with_connect_info::<SocketAddr>()).await.unwrap();
}

async fn handle_ping(State(state): State<Arc<AppState>>, axum::extract::ConnectInfo(addr): axum::extract::ConnectInfo<SocketAddr>, Json(payload): Json<PingRequest>) -> Json<ViewResponse> {
    let mut matches = state.view_matches.write().unwrap();
    let match_state = matches.entry(payload.match_id.clone()).or_insert_with(HashMap::new);
    let ip_viewers = match_state.entry(addr.ip().to_string()).or_insert_with(Vec::new);
    ip_viewers.retain(|v| v.last_ping.elapsed() < VIEW_TIMEOUT);
    if ip_viewers.len() < MAX_VIEWS_PER_IP { ip_viewers.push(Viewer { last_ping: Instant::now() }); }
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
    let expected = ADMIN_KEY.to_lowercase();
    
    if received != expected {
        println!("!!! FAILED DELETE ATTEMPT !!!");
        println!("Received: '{}' (len: {})", received, received.len());
        println!("Expected: '{}' (len: {})", expected, expected.len());
        return StatusCode::UNAUTHORIZED;
    }

    let mut messages = state.chat_messages.write().unwrap();
    messages.retain(|m| m.id != id);
    println!("SUCCESS: Message {} deleted", id);
    StatusCode::OK
}
EOF

# 3. Build & Restart
cd /root/view-counter
cargo build --release
systemctl restart view-counter
echo "DEBUG BACKEND READY. Check logs with: journalctl -u view-counter -f"
