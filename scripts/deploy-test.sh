#!/bin/bash
# deploy-test.sh — 部署 Docusaurus build 产物到测试服务器
# 用法: ./scripts/deploy-test.sh [远程路径]
#       不传路径则读 .deployrc

set -e

REMOTE_HOST="paka@10.64.66.11"

if [ -n "$1" ]; then
  REMOTE_PATH="$1"
elif [ -f ".deployrc" ]; then
  REMOTE_PATH=$(head -1 .deployrc)
else
  echo "Usage: $0 <remote-path>  或创建 .deployrc 写上远程路径"
  exit 1
fi

echo "=== 1. Build ==="
npm run build

echo "=== 2. 打包 ==="
cd build && tar -czf ../build.tar.gz .
cd ..

echo "=== 3. 清服务器 + 上传 ==="
ssh "$REMOTE_HOST" "rm -rf $REMOTE_PATH/*"
scp build.tar.gz "$REMOTE_HOST:$REMOTE_PATH/"

echo "=== 4. 解压 ==="
ssh "$REMOTE_HOST" "cd $REMOTE_PATH && tar -xzf build.tar.gz && rm build.tar.gz"

echo "=== 完成 ==="