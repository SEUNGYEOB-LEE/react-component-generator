---
name: create-pr
description: 현재 브랜치의 커밋을 기반으로 GitHub PR을 생성하는 스킬. "PR 만들어줘", "PR 생성해줘", "PR 열어줘" 같은 요청 시 사용한다.
context: fork
allowed-tools: Read, Glob, Grep, Bash
---

# Create PR

## 목적

현재 브랜치의 커밋 이력을 분석하여 PR 제목과 본문을 자동으로 작성하고, GitHub에 PR을 생성한다.
`context: fork`로 실행되어 diff/로그 분석 같은 무거운 작업이 메인 대화 컨텍스트를 오염시키지 않는다.

## 트리거

- "PR 만들어줘"
- "PR 생성해줘"
- "PR 열어줘"

## 절차

1. `git branch --show-current`으로 현재 브랜치를 확인한다. `main`/`master`면 중단하고 사용자에게 알린다 (base 브랜치에서는 PR을 만들 수 없다).
2. `git log <base>..HEAD --oneline`으로 base 브랜치 대비 커밋 목록을 확인한다. 커밋이 없으면 중단한다.
3. `git diff <base>...HEAD`로 전체 변경사항을 분석한다.
4. `references/pr-template.md` 형식에 맞춰 PR 제목과 본문을 작성한다.
   - 제목: 커밋 메시지들을 요약한 한 줄 (컨벤션과 동일하게 `feat/fix/refactor/chore: 요약` 형식)
   - 본문: 템플릿의 각 섹션을 실제 diff 내용에 맞게 채운다. 해당 없는 섹션은 생략한다.
5. 현재 브랜치가 원격에 없으면 `git push -u origin <branch>`로 먼저 push한다.
6. `gh pr create --title "..." --body "..."`로 PR을 생성한다.
7. 생성된 PR URL을 사용자에게 보여준다.

## 주의사항

- `gh auth status`로 인증 여부를 먼저 확인한다. 인증되어 있지 않으면 PR 생성을 시도하지 말고 `gh auth login`이 필요하다고 사용자에게 알린다 (이 스킬이 대신 로그인할 수 없다).
- base 브랜치로 직접 push하거나 PR 없이 병합하지 않는다.
- PR 제목/본문은 자동 작성하되, `gh pr create`를 실행하기 전에 사용자에게 내용을 보여주고 승인을 받는다.
