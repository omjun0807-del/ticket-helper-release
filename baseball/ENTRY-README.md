# Ticketlink·NOL 경기 진입 헬퍼 0.1.19

0.1.19는 실제 상품 페이지 로딩 중 사라진 패널을 기존 타이머에서 복원합니다. 새 타이머나 실행을 추가하지 않습니다.

한국시리즈 오픈 준비 페이지의 실제 상품명과 현재 안내 제목을 지원합니다. 상품 번호·상품명·차전·팀이 바뀌면 중지합니다. 카운트다운 기준 대기, 활성 단일 버튼 1회 클릭, 직접 클릭 시 자동 취소, 30초 만료, 클릭 기록과 CSP 표시 보완을 유지합니다.

설치 이름·namespace·업데이트 주소는 그대로입니다. 구형 NOL 별도 스크립트는 끄고 기존 야구 헬퍼를 업데이트하세요.

- 설치: https://raw.githubusercontent.com/omjun0807-del/ticket-helper-release/main/baseball/ticketlink-entry.user.js
- 메타: https://raw.githubusercontent.com/omjun0807-del/ticket-helper-release/main/baseball/ticketlink-entry.meta.js
- NOL 사용 순서와 실기 한계: NOL-README.md
- Ticketlink 과거 안내 비교 진단: ../../docs/baseball/notice-confirm-investigation-2026-10-02.md
- 실기 및 검증 기록: ../../docs/baseball/TICKETING-LOG.md

Ticketlink의 기존 오픈 1회 새로고침·예매 버튼 클릭·안내 직접 확인/선택 진단을 유지합니다. NOL에는 Ticketlink 안내 진단을 연결하지 않습니다. 차단 기록과 설정도 보존합니다. 좌석·인증·보안문자·대기열·결제는 자동화하지 않습니다.

배포 파일은 scripts/build-baseball-experiment.py로 생성합니다. 소스·userscript·meta·코드 사본 버전은 0.1.19입니다. 방탈출 버전과 파일은 변경하지 않습니다. 전체 검사는 npm test, 야구 검사는 npm run test:baseball입니다. 현재 실행 결과와 PC 적용 여부는 최신 실기 기록을 확인하세요.
