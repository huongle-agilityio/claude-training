#!/bin/bash
# Đọc JSON từ stdin, lấy ra lệnh Claude định chạy
cmd=$(jq -r '.tool_input.command')

# Danh sách lệnh cấm (regex)
if echo "$cmd" | grep -qE 'rm -rf|git push (-f|--force)|git reset --hard'; then
  echo "Blocked: '$cmd' bị cấm theo luật team. Hãy hỏi người dùng trước." >&2
  exit 2
fi

exit 0