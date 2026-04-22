#!/bin/bash
export SSHPASS='5474sultaN--'
SSH_OPT="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o LogLevel=ERROR"

echo "--- 1. Preparing VPS directory ---"
sshpass -e ssh $SSH_OPT root@187.127.106.231 "mkdir -p /root/view-counter"

echo "--- 2. Transferring files ---"
sshpass -e scp $SSH_OPT -r view-counter/* root@187.127.106.231:/root/view-counter/

echo "--- 3. Installing Rust & Building (This takes ~3-5 minutes) ---"
sshpass -e ssh $SSH_OPT root@187.127.106.231 "
  if ! command -v cargo &> /dev/null; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
  fi
  source \$HOME/.cargo/env
  cd /root/view-counter
  cargo build --release

  echo '--- 4. Setting up Systemd Service ---'
  cat > /etc/systemd/system/view-counter.service <<EOF
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

  systemctl daemon-reload
  systemctl enable view-counter
  systemctl restart view-counter
  echo '--- Deployment Complete! ---'
"
