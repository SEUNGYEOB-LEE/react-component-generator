#!/bin/bash
# PreToolUse(Bash) — git commit 전에 테스트를 강제한다.
# 실패 시 exit 2로 도구 호출 자체를 차단한다 (Protection Hook).
input=$(cat)
command=$(node -e "
  const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
  process.stdout.write((data.tool_input && data.tool_input.command) || '');
" <<< "$input")

# 명령어 어디에나 "git commit" 문자열이 있으면 매칭하지 않는다 (예: git log --grep "git commit").
# 실제 git commit 호출만 매칭: 명령어 시작이거나, ; & | 로 연결된 다음 세그먼트 시작일 때만.
if echo "$command" | grep -qE '(^|[;&|]+[[:space:]]*)git[[:space:]]+commit([[:space:]]|$)'; then
  bun run test || { echo "Tests failed" >&2; exit 2; }
fi

exit 0
