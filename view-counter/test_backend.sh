#!/bin/bash

# This script tests the Rust Backend locally.
# It assumes the backend is running at http://localhost:3001

echo "--- 1. Testing View Counting & IP Locking ---"
# Simulate 3 pings for the same match_id from "this IP"
# The backend uses ConnectInfo which reflects your real local IP or 127.0.0.1
# Since we are running on the same machine, we expect count to max at 2.
curl -s -X POST http://localhost:3001/ping -H "Content-Type: application/json" -d '{"match_id":"test-match"}' > /dev/null
curl -s -X POST http://localhost:3001/ping -H "Content-Type: application/json" -d '{"match_id":"test-match"}' > /dev/null
curl -s -X POST http://localhost:3001/ping -H "Content-Type: application/json" -d '{"match_id":"test-match"}' > /dev/null

VIEWS=$(curl -s http://localhost:3001/views/test-match | grep -o '"current_views":[0-9]*' | cut -d: -f2)
echo "Views for 'test-match' (expected 2): $VIEWS"

echo -e "\n--- 2. Testing Chat Messaging ---"
# Send a message
MSG_JSON=$(curl -s -X POST http://localhost:3001/chat/send -H "Content-Type: application/json" -d '{"match_id":"test-match", "username":"Boss", "content":"Testing the new chat!"}')
echo "Sent Message Response: $MSG_JSON"

# Extract ID for deletion test
MSG_ID=$(echo $MSG_JSON | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "Message ID created: $MSG_ID"

# Get messages
MESSAGES=$(curl -s "http://localhost:3001/chat/messages?match_id=test-match")
echo "All messages for match: $MESSAGES"

echo -e "\n--- 3. Testing Admin Deletion ---"
# Attempt delete with WRONG key
echo "Deleting with wrong key (expected 401):"
curl -s -o /dev/null -w "%{http_code}\n" -X DELETE "http://localhost:3001/chat/message/$MSG_ID" -H "Content-Type: application/json" -d '{"admin_key":"wrong_key"}'

# Attempt delete with CORRECT key
echo "Deleting with correct key (expected 200):"
curl -s -o /dev/null -w "%{http_code}\n" -X DELETE "http://localhost:3001/chat/message/$MSG_ID" -H "Content-Type: application/json" -d '{"admin_key":"obsessed_boss_2026"}'

# Verify message is gone
VERIFY=$(curl -s "http://localhost:3001/chat/messages?match_id=test-match")
echo "Messages after deletion (expected empty): $VERIFY"
