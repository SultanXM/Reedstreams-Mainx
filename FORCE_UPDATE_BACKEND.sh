#!/bin/bash

echo "--- 1. Killing old backend processes ---"
systemctl stop view-counter
pkill -9 view-counter

echo "--- 2. Wiping old build cache ---"
rm -rf /root/view-counter/target

echo "--- 3. Writing fresh source code ---"
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
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
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
struct ChatMessage {
    id: Uuid,
    match_id: String,
    username: String,
    content: String,
    timestamp: DateTime<Utc>,
}
#[derive(Deserialize)]
struct SendMessageRequest { match_id: String, username: String, content: String }
#[derive(Deserialize)]
struct DeleteMessageRequest { admin_key: String }
#[derive(Deserialize)]
struct GetMessagesQuery { match_id: String }

type MatchState = HashMap<String, Vec<Viewer>>;
struct AppState {
    view_matches: RwLock<HashMap<String, MatchState>>,
    chat_messages: RwLock<Vec<ChatMessage>>,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::registry().with(tracing_subscriber::fmt::layer()).init();
    let state = Arc::new(AppState {
        view_matches: RwLock::new(HashMap::new()),
        chat_messages: RwLock::new(Vec::new()),
    });
    let state_for_cleanup = state.clone();
    tokio::spawn(async move {
        let mut reaper = interval(CLEANUP_INTERVAL);
        loop {
            reaper.tick().await;
            let mut matches = state_for_cleanup.view_matches.write().unwrap();
            for match_state in matches.values_mut() {
                for viewers in match_state.values_mut() {
                    viewers.retain(|v| v.last_ping.elapsed() < VIEW_TIMEOUT);
                }
                match_state.retain(|_, viewers| !viewers.is_empty());
            }
            matches.retain(|_, match_state| !match_state.is_empty());
        }
    });
    let cors = CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any);
    let app = Router::new()
        .route("/ping", post(handle_ping))
        .route("/views/all", get(get_all_views))
        .route("/views/:match_id", get(get_views))
        .route("/chat/messages", get(get_messages))
        .route("/chat/send", post(send_message))
        .route("/chat/message/:id", delete(delete_message))
        .layer(cors)
        .with_state(state);
    let addr = SocketAddr::from(([0, 0, 0, 0], 3001));
    println!("Server running on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app.into_make_service_with_connect_info::<SocketAddr>()).await.unwrap();
}

async fn handle_ping(State(state): State<Arc<AppState>>, axum::extract::ConnectInfo(addr): axum::extract::ConnectInfo<SocketAddr>, Json(payload): Json<PingRequest>) -> Json<ViewResponse> {
    let ip = addr.ip().to_string();
    let mut matches = state.view_matches.write().unwrap();
    let match_state = matches.entry(payload.match_id.clone()).or_insert_with(HashMap::new);
    let ip_viewers = match_state.entry(ip).or_insert_with(Vec::new);
    ip_viewers.retain(|v| v.last_ping.elapsed() < VIEW_TIMEOUT);
    if ip_viewers.len() < MAX_VIEWS_PER_IP {
        ip_viewers.push(Viewer { last_ping: Instant::now() });
    } else if let Some(oldest) = ip_viewers.iter_mut().min_by_key(|v| v.last_ping) {
        oldest.last_ping = Instant::now();
    }
    let current_views = match_state.values().map(|v| v.len()).sum();
    Json(ViewResponse { match_id: payload.match_id, current_views })
}

async fn get_views(Path(match_id): Path<String>, State(state): State<Arc<AppState>>) -> Json<ViewResponse> {
    let matches = state.view_matches.read().unwrap();
    let count = matches.get(&match_id).map(|m| m.values().map(|v| v.len()).sum()).unwrap_or(0);
    Json(ViewResponse { match_id, current_views: count })
}

async fn get_all_views(State(state): State<Arc<AppState>>) -> Json<AllViewsResponse> {
    let matches = state.view_matches.read().unwrap();
    let views = matches.iter().map(|(id, m)| (id.clone(), m.values().map(|v| v.len()).sum())).collect();
    Json(AllViewsResponse { views })
}

async fn get_messages(State(state): State<Arc<AppState>>, Query(query): Query<GetMessagesQuery>) -> Json<Vec<ChatMessage>> {
    let messages = state.chat_messages.read().unwrap();
    let filtered: Vec<ChatMessage> = messages.iter().filter(|m| m.match_id == query.match_id).cloned().collect();
    Json(filtered)
}

async fn send_message(State(state): State<Arc<AppState>>, Json(payload): Json<SendMessageRequest>) -> (StatusCode, Json<ChatMessage>) {
    let mut messages = state.chat_messages.write().unwrap();
    let new_msg = ChatMessage { id: Uuid::new_v4(), match_id: payload.match_id, username: payload.username, content: payload.content, timestamp: Utc::now() };
    messages.push(new_msg.clone());
    if messages.len() > MAX_MESSAGES { messages.remove(0); }
    (StatusCode::CREATED, Json(new_msg))
}

async fn delete_message(Path(id): Path<Uuid>, State(state): State<Arc<AppState>>, Json(payload): Json<DeleteMessageRequest>) -> StatusCode {
    if payload.admin_key.to_lowercase() != ADMIN_KEY.to_lowercase() { return StatusCode::UNAUTHORIZED; }
    let mut messages = state.chat_messages.write().unwrap();
    let original_len = messages.len();
    messages.retain(|m| m.id != id);
    if messages.len() < original_len { StatusCode::OK } else { StatusCode::NOT_FOUND }
}
EOF

echo "--- 4. Rebuilding Backend (Release Mode) ---"
cd /root/view-counter
cargo build --release

echo "--- 5. Restarting Service ---"
systemctl daemon-reload
systemctl restart view-counter

echo "--- 6. Status Check ---"
systemctl status view-counter --no-pager

echo "✅ Backend FORCE-UPDATED and running on port 3001!"
