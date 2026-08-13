#!/bin/bash
# PreToolUse(Bash) — git commit 전에 테스트를 강제한다.
# 실패 시 exit 2로 도구 호출 자체를 차단한다 (Protection Hook).
input=$(cat)
command=$(node -e "
  const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
  process.stdout.write((data.tool_input && data.tool_input.command) || '');
" <<< "$input")

case "$command" in
  *"git commit"*)
    bun run test || { echo "Tests failed" >&2; exit 2; }
    ;;
esac

exit 0
