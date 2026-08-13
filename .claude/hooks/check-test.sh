#!/bin/bash
# PostToolUse(Edit|Write) — src/ 하위 .ts/.tsx 파일을 수정했는데
# 대응 테스트 파일이 없으면 경고만 남긴다 (exit 0, 차단하지 않음).
input=$(cat)
file=$(node -e "
  const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
  process.stdout.write((data.tool_input && data.tool_input.file_path) || '');
" <<< "$input")

[ -z "$file" ] && exit 0

# Windows에서는 tool_input.file_path가 백슬래시 경로로 온다 (예: C:\...\src\App.tsx).
# 아래 패턴 매칭이 슬래시를 가정하므로 먼저 정규화한다.
file="${file//\\//}"

case "$file" in
  *src/*.ts|*src/*.tsx) ;;
  *) exit 0 ;;
esac

case "$file" in
  *.test.ts|*.test.tsx) exit 0 ;;
esac

ext="${file##*.}"
testfile="${file%.*}.test.${ext}"

if [ ! -f "$testfile" ]; then
  echo "테스트 파일 없음: $file" >&2
fi

exit 0
