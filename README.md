# Ticket Helper

Personal escape-room / reservation helper.

## Recommended setup
- PC Chrome/Edge: Tampermonkey + Ticket Helper Userscript
- iPhone Safari: Userscripts + the same Ticket Helper Userscript

Both platforms use the same public `ticket-helper.user.js` and the same GitHub sync format.

## Current releases
- Userscript core v0.1.64
- PC Tampermonkey userscript: recommended
- iPhone Safari + Userscripts
- Legacy unpacked PC extension v0.1.24
- Chrome Web Store package v0.1.24 (not required for the recommended PC setup)
- Keyescape / Naver Booking adapters + five new partner sites (manual final confirmation)
- configurable session priority and hour priorities
- Keyescape branch/theme selection now waits for dynamic options and has a jQuery-change fallback
- Keyescape profiles can use a direct theme reservation URL; WANNA GO HOME now opens its theme-specific reservation URL before loading the target date
- Keyescape target scans include a navigation-loop guard so a canonicalized URL cannot trigger infinite reloads
- booking URL comparison ignores the internal `_th_reset` cache-busting parameter
- automatic local backup for themes/session preferences/settings
- practice / live / confirm modes
- Session preview is optional; live opening does not depend on preloading future-date sessions
- Keyescape prefire forces the canonical calendar reservation page, then waits until the exact opening instant before clicking the target date
- Keyescape empty-session opening retries stay on the same page; stale/disabled calendars still reopen the calendar
- Opening attempts wait 70–420 ms for session buttons instead of up to 3.2 seconds
- Stop cancels follow-up adapter actions and CAPTCHA continuation; repeated execution clicks are ignored
- 120 additional branch/theme entries across the ten requested sites, with official booking links
- Unverified opening rules stay unset and must be configured before scheduled runs
- New partner navigation checkpoints resume on the input page after DOMContentLoaded
- See PARTNER_CATALOG.md for coverage and remaining device checks
- Mobile 10-second timing test reuses currently loaded sessions instead of pretending the server has opened a future date
- Mobile practice reuses the already scanned Keyescape page, trusts the already selected theme/date, and starts directly from session selection
- optional private GitHub device sync for theme/session settings (PII excluded)

## PC Tampermonkey
Open the public Userscript URL after installing Tampermonkey:

`https://raw.githubusercontent.com/omjun0807-del/ticket-helper-release/main/ticket-helper.user.js`

Automatic updates use:
- `@version`
- `@updateURL`
- `@downloadURL`

Desktop runtime detection enables the PC calendar/time-grid UI and contained mouse-wheel scrolling without requiring the native extension. Date/time pickers expand inline inside the helper panel so later sections cannot cover or clip them. The compact time picker shows a live selected-time preview, 8-column hour chips, 6-column minute chips, and highlights only the active choices.

See `PC_VIOLENTMONKEY.md` for installation details.

## Legacy PC extension
The unpacked extension under `extension/` is kept for compatibility/testing.
It is no longer the recommended PC install path because Chrome cannot let an unpacked extension replace its own installed files.

## Repository layout
- `release/ticket-helper.user.js`: current PC/iPhone Userscript core
- `release/ticket-helper.meta.js`: Userscript update metadata
- `PC_VIOLENTMONKEY.md`: PC installation guide
- `extension/`: legacy unpacked Chrome/Edge extension
- `store-extension/`: optional Chrome Web Store package
- `packages/sync/src/github-sync.js`: GitHub sync core
- `tests/`: sync, UI, extension, and PC Userscript acceptance tests
- `.github/workflows/test.yml`: CI tests
- `.github/workflows/publish-release.yml`: public release publishing

Personal booking data such as name, phone, cookies, or credentials must never be committed here.

### v0.1.41

키이스케이프 참여 인원 선택을 연결하고, 중지 후 늦게 나타난 인원 컨트롤을 클릭하지 않도록 보완했습니다. 이미 선택된 인원은 다시 변경하지 않고, 숨겨진 목록은 연 다음 선택합니다. PC 안내는 Tampermonkey 기준입니다. 방탈출 테스트 26개 통과와 실사이트 미검증 범위는 [검증 기록](ESCAPE-VALIDATION.md)에 정리했습니다.

### v0.1.40

선택창 재클릭과 느린 저장 뒤 화면 갱신을 수정했습니다. 네이버 재고 표시가 포함된 회차를 인식하고, 예약 준비 상태와 카운트다운을 표시합니다. 요청한 사이트 테마 120개 중 포스터 117개와 공식 오픈 규칙 75개를 등록했습니다. 자세한 출처와 미확인 항목은 [카탈로그 검토 결과](PARTNER_CATALOG.md)를 확인하세요.

### v0.1.40 수정

회차 미리보기의 generation 참조 오류를 수정했습니다. 제로월드는 달력 로딩과 날짜 변경 후 회차 갱신을 기다립니다. 참여 인원 설정을 추가하고 최종 결제 상한 입력을 제거했습니다. 전체 UI 재설계는 기능 수정 후 실기기 결과를 기준으로 진행합니다.



## 0.1.55 예약 계획 화면

회차 미오픈 상태에서도 정확한 시간·선택 방식·허용 범위를 입력할 수 있습니다. 일회성 오픈 시각은 현재 이용일에만 적용합니다. 준비 후 설정을 바꾸면 기존 대기를 해제합니다. 취소표 확인은 네이버 예약·비트포비아에서 알림만 제공하며 기본30초/30분입니다. 브라우저를 열어둬야 하며 Safari가 정지한 동안의 작동은 보장하지 않습니다. 실행 기록 복사에는 이름·전화·주소·토큰을 넣지 않습니다.

### v0.1.56
네이버 참여 인원의 `2인`/`2명` 표기를 모두 지원합니다. 테마 안내·회차 미리보기·복사 도구는 접어서 표시하며 날짜·희망 시간·예약자·실행 설정은 기본 화면에 둡니다.


### v0.1.58
Charcoal header, flat white sections and teal accents. Saved reservation-user details collapse when complete; missing details stay open. Existing settings and booking hooks are preserved. Escape tests39/39 and Chromium1280/390/320px layout checks pass; iPhone Safari and live opening remain unverified.

### v0.1.59
준비·중지와 현재 상태를 하단에 고정하고, 준비 완료 후에는 대기 요약만 표시합니다. 설정을 수정하면 기존 대기를 해제합니다. 화면 갱신 직후 접기·스크롤이 되돌아가던 문제와 자동 재개 완료 후 실행 중 표시가 남던 문제를 수정했습니다. 방탈출 검사40개와 Chromium 화면 검증을 통과했습니다. iPhone Safari 실기기·실제 정각 예약은 미검증입니다.

### v0.1.60
네이버의 ‘동의하고 예약하기’와 ‘동의하고 결제하기’를 모두 인식합니다. 띄어쓰기·줄바꿈 변형도 지원합니다. 직접 최종 예약은 예약 확정 모드에서만 한 번 누르며, 마케팅 동의 제외·중지·중복 버튼 차단을 유지합니다. 버튼 클릭 후 실제 예약 완료 여부는 네이버 화면에서 확인해 주세요. 방탈출 검사41개 통과, 실제 예약/결제 미실행.

### v0.1.61
네이버 최종 버튼의 지연 표시/활성화를 최대1.5초 기다리고, 한 버튼의 중첩 요소를 중복 집계하지 않습니다. 동의 처리 후 현재 버튼을 다시 찾으며 비활성·중지·마케팅 제외 규칙을 유지합니다. 중단 시 버튼 없음/중복/모드/최종 결제 버튼을 구분해 표시합니다. 방탈출 검사42개 통과. 사용자 아이폰에서 재발한 정확한 원인과 업데이트 후 해결 여부는 아직 미확인입니다.

### v0.1.62
네이버 최종 예약 후 완료 표시·매진·필수 입력·추가 인증을 구분합니다. 불명확하면 직접 확인 상태를 유지합니다. 최종 처리 기록은 새로고침/탭 복귀로 재실행하지 않고, 다시 준비하려면 중지 또는 설정 변경으로 초기화합니다. 로그는 고정 상태/이유 코드만 남깁니다. 방탈출 검사44개 통과. 이번 결과 감지는 합성 화면 검사이며, 실제 예약/결제는 실행하지 않았습니다.

### v0.1.64

회차 미리보기 중 중지·조건 변경 시 지연 조회·달력 이동·페이지 이동·오류 안내를 취소합니다. 새로고침 후 이어지는 조회에도 같은 검사를 적용합니다. 설정 저장은 호출 시점의 값을 순서대로 기록해 오래된 미리보기 상태가 중지 상태를 덮어쓰지 않게 했습니다. 키이스케이프 달력 복귀/월 이동과 제로월드 목록 대기 내부의 후속 클릭도 차단합니다.

### v0.1.63
키이스케이프 STATION 세 테마의 직접 주소를 반영했습니다. 새로고침 후 테마 목록이 비거나 지점 주소만 있는 상태를 선택 완료로 오인하지 않고 테마를 다시 불러옵니다. 기존 설정은 유지합니다. 방탈출 검사45개 통과. 실제 예약/결제는 실행하지 않았으며 아이폰에서 새 버전 확인이 필요합니다.
