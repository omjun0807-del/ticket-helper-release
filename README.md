# Ticket Helper

Personal escape-room / reservation helper.

## Recommended setup
- PC Chrome/Edge: Violentmonkey + Ticket Helper Userscript
- iPhone Safari: Userscripts + the same Ticket Helper Userscript

Both platforms use the same public `ticket-helper.user.js` and the same GitHub sync format.

## Current releases
- Userscript core v0.1.39
- PC Violentmonkey userscript: recommended
- iPhone Safari + Userscripts
- Legacy unpacked PC extension v0.1.23
- Chrome Web Store package v0.1.23 (not required for the recommended PC setup)
- Keyescape / Naver Booking adapters + five new partner sites (manual final confirmation)
- configurable session priority and theme fallback
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

## PC Violentmonkey
Open the public Userscript URL after installing Violentmonkey:

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

### v0.1.39

선택창 재클릭과 느린 저장 뒤 화면 갱신을 수정했습니다. 네이버 재고 표시가 포함된 회차를 인식하고, 예약 준비 상태와 카운트다운을 표시합니다. 요청한 사이트 테마 120개 중 포스터 117개와 공식 오픈 규칙 75개를 등록했습니다. 자세한 출처와 미확인 항목은 [카탈로그 검토 결과](PARTNER_CATALOG.md)를 확인하세요.

### v0.1.39 수정

회차 미리보기의 generation 참조 오류를 수정했습니다. 제로월드는 달력 로딩과 날짜 변경 후 회차 갱신을 기다립니다. 참여 인원 설정을 추가하고 최종 결제 상한 입력을 제거했습니다. 전체 UI 재설계는 기능 수정 후 실기기 결과를 기준으로 진행합니다.
