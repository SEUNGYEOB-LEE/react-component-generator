# AGENTS.md

## Operational Commands

- 의존성 설치: `bun install`
- API 서버와 Vite 실행: `bun run dev`
- 전체 테스트 실행: `bun run test`
- 프로덕션 빌드: `bun run build`
- 린트 검사: `bun run lint`
- 의존성과 프로젝트 스크립트는 Bun으로만 관리한다.

## Golden Rules

### Immutable

- 테스트, 프롬프트, 로그, 스크린샷, 브라우저 검증에 실제 API Key를 사용하지
  않는다. 검증에는 `test-key-not-a-secret`만 사용한다.
- 브라우저 검증 중 Anthropic, Google 등 외부 모델 API를 호출하지 않는다.
- 브라우저 검증자는 독립적인 읽기 전용 관찰자다. 코드를 수정하거나 개발
  서버를 직접 실행해서는 안 된다.
- `.env`, 인증 정보, 빌드 결과물, 브라우저 프로필은 커밋하지 않는다.

### Do

- 다음 중 하나를 변경했다면 `bun run dev`로 애플리케이션에 접속할 수 있는지
  확인하고 `browser-verifier`에 검증을 능동적으로 위임한다.
  - 폼 제출, 입력 검증, 포커스 이동
  - Cookie, `localStorage`, `sessionStorage`, 로그인 상태
  - 화면 이동, URL, 뒤로 가기
  - 로딩, 오류, 재시도 등 네트워크 결과에 따른 화면
  - 권한, 결제, 삭제처럼 실패 비용이 큰 사용자 흐름
  - 완료 기준에 포함된 반응형 레이아웃과 접근성
- 문구만 수정했거나, 동작에 영향이 없는 단순 스타일, 내부 리팩터링, 타입,
  테스트, 문서, 백엔드만 변경했다면 브라우저 검증을 생략하고 그 이유를
  밝힌다.
- 검증 결과가 `PASS`면 구현을 완료한다.
- 검증 결과가 `FAIL`이면 관찰된 문제만 수정하고 새 검증자에게 다시 맡긴다.
- 검증 결과가 `BLOCKED`면 완료로 처리하지 않고 차단 사유를 보고한다.
- 같은 원인으로 두 번 연속 실패하면 추가 수정을 멈추고 원인을 보고한다.
- 검증자에게는 URL, 완료 기준, 재현에 필요한 시작 상태, 안전 경계만 전달한다.
  전체 구현 대화나 관련 없는 코드 설명을 함께 넘기지 않는다.

### Don't

- 실제 인증 정보, 비용 발생, 외부 상태 변경을 유발하는 동작은 명시적인 승인과
  안전한 테스트 데이터 없이 실행하지 않는다.
- 검증자를 실행할 수 없는 상태를 PASS로 보고하지 않는다. 차단 사유를
  명시한다.

## Project Context

- 목표: 프롬프트로 React 컴포넌트를 생성하고 결과를 즉시 미리본다.
- Tech Stack: React 19, TypeScript, Vite, Bun, Vitest

## Standards & References

### Code

- 관찰 가능한 동작을 수정하기 전에 실패하는 테스트를 추가하거나 수정한다.
- Provider 값은 `src/types/index.ts`의 `Provider` 타입과 일치시킨다.
- 브라우저 저장소 동작은 코드에서 명시적으로 표현하고 테스트로 보호한다.
- 검증된 요구사항을 만족하는 최소 범위만 변경한다.

### Git

- 커밋 메시지는 영어 명령형으로 작성한다.
- 하나의 커밋에는 하나의 목적만 담는다.

### References

- 기능과 실행 방법: [README.md](./README.md)
- 브라우저 검증 절차와 출력 형식:
  [browser-verifier.md](./.claude/agents/browser-verifier.md)

### Maintenance

- 프로젝트 명령, 검증 조건, 보안 경계가 코드와 달라지면 이 규칙의 갱신을
  함께 제안한다.
