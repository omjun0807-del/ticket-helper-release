# Ticket Helper v0.1.47 검토 결과와 추가 카탈로그

## v0.1.47 · 비트포비아 선택·입력 연동 · 2026-10-02

기존 비트포비아32개를 공통 partner adapter의 beatphobia 분기에 연결. 지점 s_zizum·테마 썸네일 _fun_theme_view ID·표시 이름 모두 확인하며, 해당 카드 .time_box a만 읽는다. dead 회차·href 없음·다른 origin/경로·rev.make/crypt_data가 아닌 링크는 선택 불가. 같은 시각 중복은 중단. 선택 이후 링크 마감/DOM 교체/중지 시 후속 클릭 취소. 암호화된 회차 링크는 사이트가 제공한 현재 href를 그대로 클릭하며 해독·생성하지 않는다.

목표 날짜 URL에 rev_days를 지정. 실제 달력에서는 입력 value가 먼저 바뀌고 서버 페이지/회차가 뒤늦게 갱신됨을 확인하여 URL 날짜+HTML 초기 value+현재 value가 일치할 때만 회차 사용. 첫 방문에 URL 날짜가 없으면 서버 초기 value를 기준으로 검사. 이 방식은 서버가 반환한 현재 페이지를 읽는 것이며 향후 오픈/잔여석을 보장하지 않음. 긴 고정 대기 추가 없음.

실제 사이트 홍대던전에서 달력10/7 → 사라진 보물12:00 → 예약정보 화면 이동 확인(브라우저 수동 클릭). 인원2~6 native select, 성함·전화3칸·CAPTCHA·필수 agree_a/agree_b·선택 마케팅 agree_c 식별. 코드에서 인원/분리 연락처 입력·필수 동의 선택과 마케팅 제외를 DOM 재현 검사. 최종 예약/결제는 공통 confirmation-blocked 유지. 실사이트에서 연락처·동의·CAPTCHA·예약 제출은 실행하지 않음. 설치 Userscript 자동 동작, 다른8개 지점 실기기 및 iPhone 검증은 남음.

공식 예약 안내 이미지에서 지점별 오픈 시각13~21시를 확인해 partial-verified 힌트 추가. 홍대13/던전101 14/홍대3 15/강남16/강남2 17/루나18/스텔라19/서면20/서면레드21시. 안내문은 매일 일주일 치라고만 표현하여 정확한 D-n 규칙은 null 유지. 사용자 지정 오픈규칙과 링크·인원·우선순위·즐겨찾기는 보존하고, 이전 기본 manual 링크만 새 adapter로 이관.

방탈출29개 테스트 파일 통과. 테마/지점 일치, 매진·다른사이트 링크 제외, 날짜 미갱신/입력만 변경, 중복 회차, 중지/후속 클릭, 인원·전화·마케팅·최종 확정 중단·설정 이관 포함. npm test는 방탈출 통과 후 기존 tests/baseball-screen.test.js:18의 hanwha119-visible.json JSON 오류(Warning: truncated output)로 실패. 야구 파일은 변경하지 않음. 세 배포 번들 동일·문법 검사 확인. 증빙 verification/beatphobia-reservation-2026-10-02.json 및 입력화면 JPG. 총152/이미지URL149/공식 규칙76/사용자 규칙33 유지.

## v0.1.46 · 네이버 연결 확대 / 비트포비아 추가 · 2026-10-02

넥스트에디션 기존33개 전부 네이버 상품에 연결. 건대1호점6·보네르관1은 이전 UI 조사 기록, 부천4·분당서현6·신림5·잠실4는 이번 실제 화면의 상품명과 이동 URL 확인. 기존 건대2호점7 유지. 나비잠 공식 범계2호점 HTML의 네이버 바로가기3개를 확인해 하피스 캔디샵/블라인드 저스티스/로스트 앤 파운드 연결. 기본 manual 홈페이지 URL과 정확히 일치할 때만 이전하며 ID·지점·사용자 지정 링크·오픈규칙·우선순위·즐겨찾기를 보존한다. 네이버 무료 신청 상품은 업체 확인 후 확정으로, 결제형 최종버튼 자동 실행 지원과 구분. 패널에 확정 방식 안내 표시. 넥스트 D-7 자정은 기존 사용자 설정이며 네이버 달력 일부는10/29까지 활성화, 공식 규칙/홈페이지와 동일 재고라고 확정하지 않음.

비트포비아 공식 직영 던전9개 매장32개 테마와 포스터 URL·지점 예약 링크 추가. xdungeon.net Userscript match와 확장 host 등록. manual 목록/링크 지원이며 자동 날짜·회차 선택과 정확한 반복 오픈규칙은 미검증, 임의 규칙 없음. 정확한 네이버 상품은 확인못하여 자체 공식 링크 유지. 다른 브랜드 검색에서 기존 테마와 정확히 일치하는 신규 상품을 확인못한 항목도 기존 경로 유지. '네이버 예약 없음'으로 단정하지 않음. 비트포비아 구 가맹점/별도 체험 브랜드는 공식 던전 목록에 포함하지 않음.

방탈출28개 테스트 파일 통과: 전체33+나비잠3 링크 migration·사용자 설정 보존,9/32 목록·manual 분류·host 매핑, 안내 렌더 포함. 전체 파트너152개, 포스터 URL149개. 나비잠2 포스터3개는 HTTPS 이미지 검증 전 미등록 유지. 공식 규칙76개·넥스트 사용자 설정33개 유지. 실제 설치 Userscript/iPhone·정각 혼잡·예약 확정 미검증. 실제 예약/결제/동의 제출 미실행. 야구 코드/배포파일 미변경; 기존 야구 fixture 실패는 별도.

증빙: verification/beatphobia-catalog-2026-10-02.json, naver-expansion-2026-10-02.json, nextedition-naver-remaining-2026-10-02.json. 공식 출처 https://xdungeon.net/layout/res/home.php?go=theme.list 및 http://nabijam.com/layout/res/home.php?go=theme.list&zizum=B.

## v0.1.45 · 네이버 경로 우선 검토 / 마케팅 제외 · 2026-10-02

넥스트에디션 건대2호점 네이버 업체1060776의 7개 테마를 화면 제목과 실제 이동 URL로 확인하여 기존 카탈로그 ID/지점 ID를 유지하고 네이버 adapter로 연결했다. 이전 기본 홈페이지 링크를 사용하던 manual 프로필만 업데이트 시 이동하며 사용자 지정 URL·오픈 시각·우선순위·즐겨찾기는 보존한다. 목록: 어제, 그리고 오늘5585572 / Make-up5585578 / 동화나라 수비대5585582 / 빛을 구해줘5585584 / 방탈출 아카데미5585585 / 커튼콜5585586 / 생존자6338561. 증빙 verification/nextedition-naver-geondae2-2026-10-02.json.

사용자가 이용일 7일 전 자정이라고 확인하여 넥스트33개에 D-7 00:00 Asia/Seoul 규칙을 configured로 적용. 공식 검증과 구분하는 사용자 확인(2026-10-02) 표시. 10/10 이용 → 10/3 00:00 KST, 월 경계10/3 이용 → 9/26 00:00 KST 계산 검사. 공식 규칙76개는 그대로, 사용자 설정33개 추가. 전체120개/이미지117개 유지.

네이버 검색에서 건대1호점(플레이스1964749945) 예약도 확인. 썸 상품1060662/5585774는 신청 후 업체 확인으로 확정, 10월29일까지 활성 달력으로 건대2호 생존자의 D-7 범위와 달랐다. 해당 지점의 회차·확정 방식·오픈 규칙은 추가 확인 필요하며 건대2와 동일하다고 가정하지 않는다. 나머지 넥스트26개와 다른 사이트의 네이버 경로도 공식 업체/테마 일치·판매 회차·인원/확정 방식을 확인한 뒤 우선 연결하는 요청을 다음 작업에 포함. 홈페이지 접근 제한은 우회하지 않음.

키이스케이프 전체 동의가 광고 수신까지 선택하는 현상을 실패 테스트로 재현. 명시적인 checkbox 라벨/ARIA 이름으로 마케팅·광고 수신만 해제하고 필수 동의는 유지. 네이버/공통 adapter에도 제외 검사 추가. 이미 해제된 컨트롤 재클릭 없음. 중지·disabled·해제 실패는 진행 중단/수동 확인. 합성 DOM 검사이며 실제 결제/동의 제출은 실행하지 않음.

방탈출27개 테스트 파일 통과. 건대2의 빈 stock span/unselectable 회차 DOM 재현, URL 날짜 구성, 7개 링크 및 이전 프로필 이관/사용자 설정 보존 검사 포함. 실제 페이지에서는 상품 이동과 10/7 날짜 선택만 확인; 설치된 Userscript 자동 선택 성공·정각 서버 혼잡·iPhone UI는 미검증. 전체 npm test는 기존 야구 hanwha119-visible.json의 Warning: truncated output으로 실패한 상태이며 야구 파일은 변경하지 않음. 공개 user/meta 버전0.1.45 확인 및 설정 패널에서 실제 설치 버전 확인.


## 공식 카탈로그 재점검 · 2026-10-02 · v0.1.44 유지

넥스트에디션 공식 https://nextedition.co.kr/themes 의33개 테마를 HTML에서 지점·테마명·포스터 주소로 추출해 기존33개와 공백/대소문자 정규화 비교. 누락0·이미지주소 불일치0. 이는 공식 목록과 URL의 일치이며 포스터 이미지의 렌더 성공·판매가능·자동예약 검증은 아니다. JSON증빙 release/verification/nextedition-catalog-2026-10-02.json. 공식 공지/예약 안내에서 반복 오픈규칙을 확인하지 못함. 실제 건대1호 예약 화면은 개발자 도구 사용 제한 dialog가 나타나 추가검사 중단·우회 안 함. 넥스트에디션은 manual지원 유지.

이미지 미등록3개는 나비잠 범계2호점 하피스캔디샵·로스트앤파운드·블라인드저스티스. 나비잠공식페이지는 이번 조회502/시간초과. 검색색인에는 네이버 이전 안내가 있으나 최신 예약링크·이미지 원본을 확인못해 임의등록하지 않음. 기존2023 D-6 자정은 historical-official 힌트 유지. 오픈규칙 미확인44개: 넥스트33·나비잠7·페이지투데이2·채널27 2. 공식반복규칙이 확인되기 전 자동실행 규칙으로 승격하지 않음. 총120·이미지117·공식규칙76 유지. 제품코드/버전 변경 없음. PARTNER_CATALOG의 오래된 v0.1.40/75개 안내를 현재v0.1.44/76개로 바로잡음.

확인일: 2026-10-01 (한국 시간). 요청한 10개 사이트의 120개 테마 중 이미지 117개와 공식 오픈 규칙 76개를 등록했습니다. 사용자가 설정한 오픈 규칙과 시간 우선순위는 보존합니다.

## 수정 및 추가 기능

- 선택 값을 즉시 반영하고, 비동기 저장이 끝난 뒤 화면을 다시 교체하지 않습니다. 선택창이 열렸거나 버튼을 누르는 동안 백그라운드 갱신을 보류합니다.
- 네이버 회차 버튼의 시간과 재고 문구를 분리합니다. 용팔도령에서 확인한 `btn_time`, `stock`, `unselectable` 구조를 지원하며 매진 회차를 제외합니다. 상세 탭은 회차가 로드된 화면으로 오인하지 않습니다.
- 회차 미리보기 로드 대기는 최대 8초입니다. 실제 오픈 실행 대기를 늘리지는 않습니다.
- 예약 준비 상태와 오픈 시각까지 남은 시간을 표시합니다. 카운트다운은 화면을 다시 만들지 않고 텍스트만 갱신합니다.
- 실제 실행 중에는 회차 참고 기록 저장 완료를 기다리지 않습니다. 페이지 이동에 필요한 체크포인트는 계속 저장 후 이동합니다.
- 준비·실행 중 자동 동기화를 미룹니다. 종료 후 동기화를 재시도합니다.
- 포스터와 공식/참고 오픈 정보 및 출처를 패널에 표시합니다. 미확인 정보는 자동 실행 규칙으로 사용하지 않습니다.

## 공식 오픈 규칙

아래 D 값은 이용일에서 뺀 날짜의 한국 시각입니다. 공식 안내가 변경될 수 있으므로 예약 전 출처를 확인하세요.

| 사이트 | 지점 | 오픈 | 출처 |
|---|---|---|---|
| 래빗홀 | 홍대점 | D-7 23:00 | [공식 안내](https://www.rabbitholeescape.co.kr/notice/1) |
| 플레이33 | 건대점 | D-7 20:00 | [공식 안내](https://play33.kr/reservation?branch=1&theme=18) |
| 플레이33 | 홍대점 | D-7 20:00 | [공식 안내](https://play33.kr/reservation?branch=4&theme=26) |
| 플레이33 | 대전점 | D-7 10:00 | [공식 안내](https://play33.kr/reservation?branch=5&theme=39) |
| 플레이33 | 수원점 | D-7 22:00 | [공식 안내](https://play33.kr/reservation?branch=7&theme=40) |
| 지구별 | 홍대 어드벤처점 | D-7 22:00 | [공식 안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 | 홍대 라스트시티점 | D-7 22:00 | [공식 안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 | 대구점 | D-14 00:00 | [공식 안내](https://xn--2e0b040a4xj.com/FAQ) |
| 제로월드 | 김포본점 | D-14 11:00 | [공식 안내](https://zeroworldkorea.com/file/zizum/1_9989297162.png) |
| 제로월드 | 강남점 | D-14 11:30 | [공식 안내](https://zeroworldkorea.com/file/zizum/4_9111989617.png) |
| 제로월드 | 홍대점 | D-14 12:00 | [공식 안내](https://zeroworldkorea.com/file/zizum/5_7643508679.png) |
| 제로월드 | 다이브 건대점 | D-14 12:30 | [공식 안내](https://zeroworldkorea.com/file/zizum/2_3151946323.png) |
| 둠이스케이프 | 1호점 | D-14 00:00 | [공식 안내](https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png) |
| 둠이스케이프 | 2호점 | D-14 23:00 | [공식 안내](https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png) |
| 둠이스케이프 | DTH점 (부평) | D-7 23:30 | [공식 안내](https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png) |
| 둠이스케이프 | FEAR점 (수원) | D-5 23:45 | [공식 안내](https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png) |

## 확인 범위와 남은 확인

- 전체 24개 테스트 파일: 선택창 재클릭/포인터 동작, 느린 저장 중 선택 유지, 네이버 시간·매진 파싱, 준비 상태, 카운트다운, 참고 기록 저장 대기 제거, 이동 전 체크포인트, 기존 예약 흐름 회귀 검증.
- 용팔도령 네이버 예약 화면에서 실제 시간 버튼 구조와 매진 표시를 읽기 전용으로 확인했습니다. 예약 확정·결제는 실행하지 않았습니다.
- 나비잠 7개, 넥스트에디션 33개, 오늘의 한 페이지 2개, 찰리 1개, 채널27 2개 등 총 45개 테마의 반복 오픈 규칙은 현재 확정하지 않았습니다.
- 오늘의 한 페이지 22:00은 후기 참고 정보이며 이용일 기준 며칠 전인지 미확인입니다. 찰리 22:00과 채널27 00:00은 조회 당시 네이버 표시를 참고 기록한 것이며 반복 규칙이 아닙니다.
- 나비잠 D-6 00:00은 2023년 공식 공지입니다. 2026년 네이버 이전 후 동일한 규칙인지 재확인할 때까지 참고 정보만 표시합니다.
- 나비잠 2호점 하피스 캔디샵·로스트 앤 파운드·블라인드 저스티스 이미지 3개는 최신 공식 자료를 확인하지 못했습니다.
- 넥스트에디션과 나비잠 2호점은 목록·링크를 제공합니다. 자동 예약 지원은 기존과 동일하게 미확인 상태입니다.
- 오늘의 한 페이지 홈페이지는 원격 브라우저 접근 제한으로 직접 검증하지 못했습니다. 보호 우회 없이 네이버 예약 페이지를 확인했습니다.
- 실제 iPhone Safari의 네이티브 선택창, 정각 실행과 서버/기기 시각 차이는 실기기 검증이 남아 있습니다. 모든 사이트의 실제 오픈·마지막 확정을 통과했다고 주장하지 않습니다.

## 테마별 이미지와 오픈 정보

| 사이트·지점 | 테마 | 이미지 | 오픈 정보 | 출처 |
|---|---|---|---|---|
| 래빗홀 · 홍대점 | [행운만물상](https://www.rabbitholeescape.co.kr/reservation?branch=1&theme=5) | [포스터](https://www.rabbitholeescape.co.kr/storage/theme/2026_06/19/1aRKtqXrj8100GDFJUTLQ8coWn5baDZ3NtRwCTKw.png) | D-7 23:00 · 공식 | [안내](https://www.rabbitholeescape.co.kr/notice/1) |
| 래빗홀 · 홍대점 | [두껍아 두껍아 헌집줄게 새집다오](https://www.rabbitholeescape.co.kr/reservation?branch=1&theme=4) | [포스터](https://www.rabbitholeescape.co.kr/storage/theme/2026_06/19/A672ShZdrFSut0b8O8vpiaXtcPqfoAWHeaxzBXjS.png) | D-7 23:00 · 공식 | [안내](https://www.rabbitholeescape.co.kr/notice/1) |
| 플레이33 · 건대점 | [목격자](https://play33.kr/reservation?branch=1&theme=18) | [포스터](https://play33.kr/storage/theme/2026_03/16/4nFhOmFet1VRIH5mhkF2YjWpK6A6ER81jQdCE4eH.jpg) | D-7 20:00 · 공식 | [안내](https://play33.kr/reservation?branch=1&theme=18) |
| 플레이33 · 건대점 | [다이얼](https://play33.kr/reservation?branch=1&theme=15) | [포스터](https://play33.kr/storage/theme/2026_03/09/FfLx3twF3C8rleoUvXbEn5qtu6W1Mxc34Ak38R5A.jpg) | D-7 20:00 · 공식 | [안내](https://play33.kr/reservation?branch=1&theme=15) |
| 플레이33 · 건대점 | [그 날](https://play33.kr/reservation?branch=1&theme=16) | [포스터](https://play33.kr/storage/theme/2026_03/09/VDrFcLv2NQ1wVKzE9Jkdkp72BZPnGI285861JQbT.png) | D-7 20:00 · 공식 | [안내](https://play33.kr/reservation?branch=1&theme=16) |
| 플레이33 · 홍대점 | [피안화](https://play33.kr/reservation?branch=4&theme=26) | [포스터](https://play33.kr/storage/theme/2026_04/08/zLbaL5XoQXS0iPpYNjAdvI1UDIjCAICv9Vkx1VmE.jpg) | D-7 20:00 · 공식 | [안내](https://play33.kr/reservation?branch=4&theme=26) |
| 플레이33 · 대전점 | [I am Still Here, ELLEN](https://play33.kr/reservation?branch=5&theme=39) | [포스터](https://play33.kr/storage/theme/2026_09/02/mD01cANOMsmTB1GNfDGOTI3zsoIb2S4jh8UkC2DN.jpg) | D-7 10:00 · 공식 | [안내](https://play33.kr/reservation?branch=5&theme=39) |
| 플레이33 · 대전점 | [강천여자고등학교](https://play33.kr/reservation?branch=5&theme=31) | [포스터](https://play33.kr/storage/theme/2026_07/02/3ltkfWs9YAye96IkbJkOlYPPr8FtfZgz3NIWcjgq.png) | D-7 10:00 · 공식 | [안내](https://play33.kr/reservation?branch=5&theme=31) |
| 플레이33 · 대전점 | [자각몽(自覺夢)](https://play33.kr/reservation?branch=5&theme=32) | [포스터](https://play33.kr/storage/theme/2026_07/02/vQNrseKEPGV5fPzVtgpWYRMrl1IHoJTgpcOSZX5d.png) | D-7 10:00 · 공식 | [안내](https://play33.kr/reservation?branch=5&theme=32) |
| 플레이33 · 대전점 | [좌충우돌 꼬마마법사](https://play33.kr/reservation?branch=5&theme=33) | [포스터](https://play33.kr/storage/theme/2026_07/02/cjgbsZ0DKYFSK01Ai2bBt57KE0sixJ8DvI5vrGOk.jpg) | D-7 10:00 · 공식 | [안내](https://play33.kr/reservation?branch=5&theme=33) |
| 플레이33 · 대전점 | [우울해서 빵 샀어](https://play33.kr/reservation?branch=5&theme=34) | [포스터](https://play33.kr/storage/theme/2026_07/02/aczcDsvEr56CFZLyIk9Lvufn1oE1wjAaLiEoU515.png) | D-7 10:00 · 공식 | [안내](https://play33.kr/reservation?branch=5&theme=34) |
| 플레이33 · 수원점 | [기억 : 끝나지 않을 꿈](https://play33.kr/reservation?branch=7&theme=40) | [포스터](https://play33.kr/storage/theme/2026_08/31/Ed9RifmKCINrkCWSDuPt1V5d6D6J9rhnl6lkReA9.png) | D-7 22:00 · 공식 | [안내](https://play33.kr/reservation?branch=7&theme=40) |
| 지구별 · 홍대 어드벤처점 | [PINOCCHIO(피노키오)](https://xn--2e0b040a4xj.com/reservation?branch=2&theme=25) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2025_10/30/I6fkjF81lKgNkyvJaS1d4hoJNEluJWisJsrhg6de.png) | D-7 22:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 홍대 어드벤처점 | [잔향](https://xn--2e0b040a4xj.com/reservation?branch=2&theme=23) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2025_06/15/AoGCOqlcspfLAvs40bN58BqXNomzMcl8eCLlkZdN.png) | D-7 22:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 홍대 어드벤처점 | [아몬 : 새벽을 여는 소년](https://xn--2e0b040a4xj.com/reservation?branch=2&theme=18) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2024_08/12/lVhIuQZQ68PyVZ2T5noQXdj26rtXVYGpH0OUtNk2.jpg) | D-7 22:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 홍대 어드벤처점 | [퀘스트 : 여정의 시작](https://xn--2e0b040a4xj.com/reservation?branch=2&theme=17) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2024_08/12/WwP3c6jOOOXBRBrwUs1JXepMo4WThUGlCfbHqR5C.jpg) | D-7 22:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 홍대 어드벤처점 | [지난날을 잊었다](https://xn--2e0b040a4xj.com/reservation?branch=2&theme=9) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2024_04/01/Zf0pAzWuiBTsYHkh1TnkC7D9yyILgvNuY3HZG4Li.jpg) | D-7 22:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 홍대 어드벤처점 | [미스터리](https://xn--2e0b040a4xj.com/reservation?branch=2&theme=8) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2024_04/01/AsCzKuMAO80qWVWpYcFOW0HF395mOMnuOH6LSntM.jpg) | D-7 22:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 홍대 라스트시티점 | [스텔라](https://xn--2e0b040a4xj.com/reservation?branch=4&theme=24) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2025_07/16/unjF9iWggG6wE2Vta0LiV9rXKRrXMBzSxz7846fY.jpg) | D-7 22:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 홍대 라스트시티점 | [카부트](https://xn--2e0b040a4xj.com/reservation?branch=4&theme=22) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2025_04/29/7269vf7tqHKUQiEVYWVo1TkvQibHm7b5ynaZZeGb.jpg) | D-7 22:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 홍대 라스트시티점 | [alone(얼론)](https://xn--2e0b040a4xj.com/reservation?branch=4&theme=21) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2025_04/02/sgprZf5XPQI7ijuV6wX55sluxeIzUBGBxTRYOOZA.png) | D-7 22:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 홍대 라스트시티점 | [라스트코어](https://xn--2e0b040a4xj.com/reservation?branch=4&theme=19) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2024_08/12/sMcnvmowtWKavYYLrJsyXlQqD6iRBr9aIcZyUUYH.jpg) | D-7 22:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 홍대 라스트시티점 | [纹身(문신)](https://xn--2e0b040a4xj.com/reservation?branch=4&theme=15) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2024_08/12/AxjIbWiNl8qQURm4R7rGYJj9ZhawGeq4BxTZrgNe.jpg) | D-7 22:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 홍대 라스트시티점 | [멸종위기종 탐사대](https://xn--2e0b040a4xj.com/reservation?branch=4&theme=14) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2024_08/12/wwRUAFB6wzTNHW1iUEceA8wXQvgjK2KC6jClLKfk.jpg) | D-7 22:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 홍대 라스트시티점 | [스위티](https://xn--2e0b040a4xj.com/reservation?branch=4&theme=13) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2024_08/12/ICHNrAp5AMEU85LpG30oGIzMPUUGT2FafHFqvQ1W.jpg) | D-7 22:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 홍대 라스트시티점 | [섀도우](https://xn--2e0b040a4xj.com/reservation?branch=4&theme=12) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2024_08/12/qCPKAN30TpPvsCU68SUOtj2QynGOczf08qeI633O.jpg) | D-7 22:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 대구점 | [잉카](https://xn--2e0b040a4xj.com/reservation?branch=1&theme=20) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2024_10/15/yu2Zmry2A4AZoa5WBJHLyZKj66OyHdpDQweMYg7l.jpg) | D-14 00:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 대구점 | [우리 아빠](https://xn--2e0b040a4xj.com/reservation?branch=1&theme=11) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2024_04/01/KU0kWKNK32nIQLh4krEF9WuSCYz0UiYbrNYwm8ig.jpg) | D-14 00:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 대구점 | [사명 : 투쟁의 노래](https://xn--2e0b040a4xj.com/reservation?branch=1&theme=6) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2024_04/01/RV7LPtk2N1nKCumHHaHMBDIIVcW2V7a6wFziHui7.jpg) | D-14 00:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 대구점 | [펭귄키우기](https://xn--2e0b040a4xj.com/reservation?branch=1&theme=5) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2024_04/01/Ns7hO7iDe6P36Vaj78MlKcbq3kZ3wAcaBUnTBNCo.jpg) | D-14 00:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 대구점 | [너의 겨울은 가고, 봄은 온다](https://xn--2e0b040a4xj.com/reservation?branch=1&theme=3) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2024_04/01/4JXmZzaQzbqfz0s348NErqFplKeokgGJgUguNz6k.jpg) | D-14 00:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 대구점 | [만월 <<꿈을 훔치는 요괴>>](https://xn--2e0b040a4xj.com/reservation?branch=1&theme=2) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2024_04/01/3Nl3qjxlqpWsrTamEURAISKnY69hdAJm35eSJBvx.jpg) | D-14 00:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 지구별 · 대구점 | [단디해라](https://xn--2e0b040a4xj.com/reservation?branch=1&theme=1) | [포스터](https://xn--2e0b040a4xj.com/storage/theme/2024_04/01/KlzWazJ8ChIKcVquKRon5Mgzi0FXGCdx0IO4eIoc.jpg) | D-14 00:00 · 공식 | [안내](https://xn--2e0b040a4xj.com/FAQ) |
| 제로월드 · 김포본점 | [FEAR](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=14) | [포스터](https://zeroworldkorea.com/file/theme/14_7610250240.png) | D-14 11:00 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/1_9989297162.png) |
| 제로월드 · 김포본점 | [해리포터의 모험 SE : 마법모자의 위기](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=15) | [포스터](https://zeroworldkorea.com/file/theme/15_1026594960.png) | D-14 11:00 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/1_9989297162.png) |
| 제로월드 · 김포본점 | [검은사원 SE](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=16) | [포스터](https://zeroworldkorea.com/file/theme/16_1333210546.png) | D-14 11:00 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/1_9989297162.png) |
| 제로월드 · 김포본점 | [피노키오 대탈출](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=17) | [포스터](https://zeroworldkorea.com/file/theme/17_2977611217.png) | D-14 11:00 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/1_9989297162.png) |
| 제로월드 · 김포본점 | [복희네 사진관 SE](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=18) | [포스터](https://zeroworldkorea.com/file/theme/18_5469103021.png) | D-14 11:00 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/1_9989297162.png) |
| 제로월드 · 김포본점 | [최면](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=7) | [포스터](https://zeroworldkorea.com/file/theme/7_2665347392.png) | D-14 11:00 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/1_9989297162.png) |
| 제로월드 · 김포본점 | [성역전설](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=19) | [포스터](https://zeroworldkorea.com/file/theme/19_4497358408.png) | D-14 11:00 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/1_9989297162.png) |
| 제로월드 · 김포본점 | [인형괴담](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=20) | [포스터](https://zeroworldkorea.com/file/theme/20_2877913590.png) | D-14 11:00 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/1_9989297162.png) |
| 제로월드 · 김포본점 | [어느 겨울밤](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=21) | [포스터](https://zeroworldkorea.com/file/theme/21_1699400147.png) | D-14 11:00 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/1_9989297162.png) |
| 제로월드 · 김포본점 | [탈옥 : 특별수용소](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=22) | [포스터](https://zeroworldkorea.com/file/theme/22_1353635518.png) | D-14 11:00 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/1_9989297162.png) |
| 제로월드 · 김포본점 | [제로호텔](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=23) | [포스터](https://zeroworldkorea.com/file/theme/23_2569171480.png) | D-14 11:00 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/1_9989297162.png) |
| 제로월드 · 강남점 | [아이엠](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=28) | [포스터](https://zeroworldkorea.com/file/theme/28_6019351846.png) | D-14 11:30 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/4_9111989617.png) |
| 제로월드 · 강남점 | [어느겨울밤2](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=29) | [포스터](https://zeroworldkorea.com/file/theme/29_9011501549.png) | D-14 11:30 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/4_9111989617.png) |
| 제로월드 · 강남점 | [콜러](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=30) | [포스터](https://zeroworldkorea.com/file/theme/30_4361012266.png) | D-14 11:30 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/4_9111989617.png) |
| 제로월드 · 강남점 | [나비효과](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=31) | [포스터](https://zeroworldkorea.com/file/theme/31_1413439783.png) | D-14 11:30 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/4_9111989617.png) |
| 제로월드 · 강남점 | [링](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=32) | [포스터](https://zeroworldkorea.com/file/theme/32_8119401658.png) | D-14 11:30 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/4_9111989617.png) |
| 제로월드 · 강남점 | [제로호텔L](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=27) | [포스터](https://zeroworldkorea.com/file/theme/27_5174624165.png) | D-14 11:30 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/4_9111989617.png) |
| 제로월드 · 강남점 | [DONE](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=26) | [포스터](https://zeroworldkorea.com/file/theme/26_6862357033.png) | D-14 11:30 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/4_9111989617.png) |
| 제로월드 · 강남점 | [포레스트 (FORREST)](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=25) | [포스터](https://zeroworldkorea.com/file/theme/25_5764603364.png) | D-14 11:30 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/4_9111989617.png) |
| 제로월드 · 강남점 | [헐!](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=24) | [포스터](https://zeroworldkorea.com/file/theme/24_6795775423.png) | D-14 11:30 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/4_9111989617.png) |
| 제로월드 · 홍대점 | [사랑...하는...감?](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=36) | [포스터](https://zeroworldkorea.com/file/theme/36_9683914137.png) | D-14 12:00 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/5_7643508679.png) |
| 제로월드 · 홍대점 | [깜방탈출](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=35) | [포스터](https://zeroworldkorea.com/file/theme/35_6138739909.png) | D-14 12:00 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/5_7643508679.png) |
| 제로월드 · 홍대점 | [ALIVE](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=34) | [포스터](https://zeroworldkorea.com/file/theme/34_3417622171.png) | D-14 12:00 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/5_7643508679.png) |
| 제로월드 · 홍대점 | [NOX](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=33) | [포스터](https://zeroworldkorea.com/file/theme/33_5401205142.png) | D-14 12:00 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/5_7643508679.png) |
| 제로월드 · 홍대점 | [층간소음](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=9) | [포스터](https://zeroworldkorea.com/file/theme/9_8294038556.png) | D-14 12:00 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/5_7643508679.png) |
| 제로월드 · 다이브 건대점 | [인터뷰 (INTERVIEW)](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=B&zizum_num=2&theme_num=39) | [포스터](https://zeroworldkorea.com/file/theme/39_3983305796.png) | D-14 12:30 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/2_3151946323.png) |
| 제로월드 · 다이브 건대점 | [오르골 (ORGEL)](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=B&zizum_num=2&theme_num=38) | [포스터](https://zeroworldkorea.com/file/theme/38_9168570557.png) | D-14 12:30 · 공식 | [안내](https://zeroworldkorea.com/file/zizum/2_3151946323.png) |
| 둠이스케이프 · 1호점 | [나폴리탄](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1) | [포스터](https://doomescape.com/file/theme/29_3290704845.png) | D-14 00:00 · 공식 | [안내](https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png) |
| 둠이스케이프 · 1호점 | [Rendering](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1) | [포스터](https://doomescape.com/file/theme/8_9783995423.gif) | D-14 00:00 · 공식 | [안내](https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png) |
| 둠이스케이프 · 1호점 | [기담정](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1) | [포스터](https://doomescape.com/file/theme/27_1252036177.gif) | D-14 00:00 · 공식 | [안내](https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png) |
| 둠이스케이프 · 1호점 | [인앤아웃](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1) | [포스터](https://doomescape.com/file/theme/28_6918521244.gif) | D-14 00:00 · 공식 | [안내](https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png) |
| 둠이스케이프 · 2호점 | [운명](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2) | [포스터](https://doomescape.com/file/theme/30_1050141195.gif) | D-14 23:00 · 공식 | [안내](https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png) |
| 둠이스케이프 · 2호점 | [디스토피아](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2) | [포스터](https://doomescape.com/file/theme/31_1878173996.gif) | D-14 23:00 · 공식 | [안내](https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png) |
| 둠이스케이프 · 2호점 | [죄](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2) | [포스터](https://doomescape.com/file/theme/32_1490545499.gif) | D-14 23:00 · 공식 | [안내](https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png) |
| 둠이스케이프 · 2호점 | [인바이트](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2) | [포스터](https://doomescape.com/file/theme/33_8813716089.gif) | D-14 23:00 · 공식 | [안내](https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png) |
| 둠이스케이프 · DTH점 (부평) | [슬래셔](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3) | [포스터](https://doomescape.com/file/theme/19_5166969671.com-resize) | D-7 23:30 · 공식 | [안내](https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png) |
| 둠이스케이프 · DTH점 (부평) | [트리거](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3) | [포스터](https://doomescape.com/file/theme/22_3601104894.gif) | D-7 23:30 · 공식 | [안내](https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png) |
| 둠이스케이프 · DTH점 (부평) | [언리얼](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3) | [포스터](https://doomescape.com/file/theme/24_1971649662.jpg) | D-7 23:30 · 공식 | [안내](https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png) |
| 둠이스케이프 · DTH점 (부평) | [스네어](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3) | [포스터](https://doomescape.com/file/theme/25_5304512153.gif) | D-7 23:30 · 공식 | [안내](https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png) |
| 둠이스케이프 · FEAR점 (수원) | [허수아비](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=4) | [포스터](https://doomescape.com/file/theme/34_4437239922.png) | D-5 23:45 · 공식 | [안내](https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png) |
| 둠이스케이프 · FEAR점 (수원) | [옵스큐라](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=4) | [포스터](https://doomescape.com/file/theme/35_1355284173.png) | D-5 23:45 · 공식 | [안내](https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png) |
| 둠이스케이프 · FEAR점 (수원) | [데이투어](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=4) | [포스터](https://doomescape.com/file/theme/36_5389952639.png) | D-5 23:45 · 공식 | [안내](https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png) |
| 넥스트에디션 · 건대1호점 | [다시봄](https://nextedition.co.kr/reservation/geondae-1/?theme=62) | [포스터](https://img.reserv.company/nextedition/konkuk-1/spring-again.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 건대1호점 | [이불 밖은 위험해](https://nextedition.co.kr/reservation/geondae-1/?theme=64) | [포스터](https://img.reserv.company/nextedition/konkuk-1/outside-the-blanket-is-dangerous.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 건대1호점 | [B아파트 13동 1313호](https://nextedition.co.kr/reservation/geondae-1/?theme=63) | [포스터](https://img.reserv.company/nextedition/konkuk-1/b-apartment-building-13-unit-1313.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 건대1호점 | [MONSTER:10800](https://nextedition.co.kr/reservation/geondae-1/?theme=61) | [포스터](https://img.reserv.company/nextedition/konkuk-1/monster-10800.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 건대1호점 | [썸](https://nextedition.co.kr/reservation/geondae-1/?theme=60) | [포스터](https://img.reserv.company/nextedition/konkuk-1/fling.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 건대1호점 | [SOUL CHASER - 실종](https://nextedition.co.kr/reservation/geondae-1/?theme=114) | [포스터](https://img.reserv.company/nextedition/konkuk-1/soul-chaser-missing.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 건대2호점 | [생존자](https://m.booking.naver.com/booking/12/bizes/1060776/items/6338561?theme=place&entry=pll&lang=ko&isProgramBizItem=false) | [포스터](https://img.reserv.company/nextedition/konkuk-2/survivor.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 건대2호점 | [동화나라 수비대](https://m.booking.naver.com/booking/12/bizes/1060776/items/5585582?theme=place&entry=pll&lang=ko&isProgramBizItem=false) | [포스터](https://img.reserv.company/nextedition/konkuk-2/fairy-tale-land-guardians.png) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 건대2호점 | [빛을 구해줘](https://m.booking.naver.com/booking/12/bizes/1060776/items/5585584?theme=place&entry=pll&lang=ko&isProgramBizItem=false) | [포스터](https://img.reserv.company/nextedition/konkuk-2/save-the-light.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 건대2호점 | [Make-up](https://m.booking.naver.com/booking/12/bizes/1060776/items/5585578?theme=place&entry=pll&lang=ko&isProgramBizItem=false) | [포스터](https://img.reserv.company/nextedition/konkuk-2/make-up.png) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 건대2호점 | [커튼콜](https://m.booking.naver.com/booking/12/bizes/1060776/items/5585586?theme=place&entry=pll&lang=ko&isProgramBizItem=false) | [포스터](https://img.reserv.company/nextedition/konkuk-2/curtain-call.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 건대2호점 | [방탈출 아카데미](https://m.booking.naver.com/booking/12/bizes/1060776/items/5585585?theme=place&entry=pll&lang=ko&isProgramBizItem=false) | [포스터](https://img.reserv.company/nextedition/konkuk-2/escape-room-academy.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 건대2호점 | [어제, 그리고 오늘](https://m.booking.naver.com/booking/12/bizes/1060776/items/5585572?theme=place&entry=pll&lang=ko&isProgramBizItem=false) | [포스터](https://img.reserv.company/nextedition/konkuk-2/yesterday-and-today.png) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 건대 보네르관 | [세렌디피티(SERENDIPITY)](https://nextedition.co.kr/reservation/geondae-bonheur/?theme=41) | [포스터](https://img.reserv.company/nextedition/konkuk-bonheur/serendipity.png) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 부천점 | [진시황](https://nextedition.co.kr/reservation/bucheon/?theme=55) | [포스터](https://img.reserv.company/nextedition/bucheon/qin-shi-huang.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 부천점 | [쌩얼](https://nextedition.co.kr/reservation/bucheon/?theme=53) | [포스터](https://img.reserv.company/nextedition/bucheon/bare-face.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 부천점 | [집으로](https://nextedition.co.kr/reservation/bucheon/?theme=54) | [포스터](https://img.reserv.company/nextedition/bucheon/homeward.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 부천점 | [주르륵](https://nextedition.co.kr/reservation/bucheon/?theme=52) | [포스터](https://img.reserv.company/nextedition/bucheon/drip-drop.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 분당서현점 | [평범한 하루](https://nextedition.co.kr/reservation/bundang-seohyeon/?theme=97) | [포스터](https://img.reserv.company/nextedition/bundang-seohyeon/an-ordinary-day.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 분당서현점 | [몽중몽](https://nextedition.co.kr/reservation/bundang-seohyeon/?theme=99) | [포스터](https://img.reserv.company/nextedition/bundang-seohyeon/dream-within-a-dream.png) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 분당서현점 | [테마명을 뭐로할지 못정하겠어요ㅠㅠ](https://nextedition.co.kr/reservation/bundang-seohyeon/?theme=100) | [포스터](https://img.reserv.company/nextedition/bundang-seohyeon/i-cant-decide-on-a-theme-name.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 분당서현점 | [너에게 가는 길](https://nextedition.co.kr/reservation/bundang-seohyeon/?theme=96) | [포스터](https://img.reserv.company/nextedition/bundang-seohyeon/the-road-to-you.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 분당서현점 | [짠해](https://nextedition.co.kr/reservation/bundang-seohyeon/?theme=98) | [포스터](https://img.reserv.company/nextedition/bundang-seohyeon/cheers.png) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 분당서현점 | [익명의 여자](https://nextedition.co.kr/reservation/bundang-seohyeon/?theme=101) | [포스터](https://img.reserv.company/nextedition/bundang-seohyeon/anonymous-woman.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 신림점 | [극](https://nextedition.co.kr/reservation/sillim/?theme=42) | [포스터](https://img.reserv.company/nextedition/sillim/the-play.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 신림점 | [씨프?? XX!!](https://nextedition.co.kr/reservation/sillim/?theme=43) | [포스터](https://img.reserv.company/nextedition/sillim/thief-xx.png) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 신림점 | [Tester](https://nextedition.co.kr/reservation/sillim/?theme=44) | [포스터](https://img.reserv.company/nextedition/sillim/tester.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 신림점 | [LOVER](https://nextedition.co.kr/reservation/sillim/?theme=45) | [포스터](https://img.reserv.company/nextedition/sillim/lover.png) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 신림점 | [옛날옛날에](https://nextedition.co.kr/reservation/sillim/?theme=46) | [포스터](https://img.reserv.company/nextedition/sillim/once-upon-a-time.png) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 잠실점 | [카페라떼](https://nextedition.co.kr/reservation/jamsil/?theme=59) | [포스터](https://img.reserv.company/nextedition/jamsil/cafe-latte.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 잠실점 | [작은 악마들](https://nextedition.co.kr/reservation/jamsil/?theme=58) | [포스터](https://img.reserv.company/nextedition/jamsil/little-devils.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 잠실점 | [락 페스티벌](https://nextedition.co.kr/reservation/jamsil/?theme=57) | [포스터](https://img.reserv.company/nextedition/jamsil/rock-festival.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 넥스트에디션 · 잠실점 | [데.코.연 (데이트 코스 연구회)](https://nextedition.co.kr/reservation/jamsil/?theme=56) | [포스터](https://img.reserv.company/nextedition/jamsil/date-course-research-society.jpg) | D-7 00:00 · 사용자 확인 | [안내](https://nextedition.co.kr/themes) |
| 찰리이스케이프 · 2호점 | [퀴즈카페2](https://booking.naver.com/booking/12/bizes/1585385/items/7411891) | [포스터](https://naverbooking-phinf.pstatic.net/20260204_105/1770176357010xb9Py_PNG/%C6%F7%BD%BA%C5%CD_%C3%D6%C1%BE.png?type=f804_408_60_sharpen) | 22:00 · 참고/재확인 | [안내](https://booking.naver.com/booking/12/bizes/1585385/items/7411891) |
| 오늘의 한 페이지 · 강남점 | [버디](https://booking.naver.com/booking/12/bizes/1325520/items/6446475) | [포스터](https://naverbooking-phinf.pstatic.net/20250222_156/174019050685216P8e_JPEG/poster.jpeg?type=f804_408_60_sharpen) | 22:00 · 참고/재확인 | [안내](https://93yjm93.tistory.com/170?category=1182756) |
| 오늘의 한 페이지 · 강남점 | [용하다 용해!! 용팔도령](https://booking.naver.com/booking/12/bizes/1325520/items/6738581) | [포스터](https://naverbooking-phinf.pstatic.net/20250507_88/1746589748143AOUEE_JPEG/yp.jpeg?type=a1000_60_sharpen) | 22:00 · 참고/재확인 | [안내](https://93yjm93.tistory.com/170?category=1182756) |
| 채널27 · 버터플라이점 | [사요나라, 세이코!](https://booking.naver.com/booking/12/bizes/1498729/items/7094790) | [포스터](https://naverbooking-phinf.pstatic.net/20251024_144/1761269143690pNgDy_JPEG/%BC%BC%C0%CC%C4%DA_%C6%F7%BD%BA%C5%CD.jpg?type=f804_408_60_sharpen) | 00:00 · 참고/재확인 | [안내](https://booking.naver.com/booking/12/bizes/1498729/items/7094790) |
| 채널27 · 버터플라이점 | [붐붐박사의 폭죽놀이 유토피아](https://booking.naver.com/booking/12/bizes/1498729/items/7193259) | [포스터](https://naverbooking-phinf.pstatic.net/20260120_154/17688922057571i4wt_PNG/%BA%D5%BA%D5%C6%F7%BD%BA%C5%CD.png?type=f804_408_60_sharpen) | 00:00 · 참고/재확인 | [안내](https://booking.naver.com/booking/12/bizes/1498729/items/7193259) |
| 나비잠 · 범계 1호점 | [범계: 산군토벌기](https://booking.naver.com/booking/12/bizes/1564927/items/7525534) | [포스터](https://naverbooking-phinf.pstatic.net/20260319_135/1773907755593PoLNI_JPEG/image.jpg?type=f804_408_60_sharpen) | 00:00 · 참고/재확인 | [안내](https://nabijam.com/layout/res/home.php?go=pds.list&num=112&pds_type=2) |
| 나비잠 · 범계 1호점 | [트러블](https://booking.naver.com/booking/12/bizes/1564927/items/7306876) | [포스터](https://naverbooking-phinf.pstatic.net/20251223_148/17664811899477ToSf_PNG/KakaoTalk_20251223_175511689.png?type=f804_408_60_sharpen) | 00:00 · 참고/재확인 | [안내](https://nabijam.com/layout/res/home.php?go=pds.list&num=112&pds_type=2) |
| 나비잠 · 범계 1호점 | [몽(蒙)](https://booking.naver.com/booking/12/bizes/1564927/items/7307064) | [포스터](https://naverbooking-phinf.pstatic.net/20251223_249/1766484571628EjKpA_JPEG/KakaoTalk_20251223_175521761.jpg?type=f804_408_60_sharpen) | 00:00 · 참고/재확인 | [안내](https://nabijam.com/layout/res/home.php?go=pds.list&num=112&pds_type=2) |
| 나비잠 · 범계 1호점 | [왓 어 트립! What a Trip!](https://booking.naver.com/booking/12/bizes/1564927/items/7881326) | [포스터](https://naverbooking-phinf.pstatic.net/20260718_154/1784379045421uqPqJ_JPEG/image.jpg?type=f804_408_60_sharpen) | 00:00 · 참고/재확인 | [안내](https://nabijam.com/layout/res/home.php?go=pds.list&num=112&pds_type=2) |
| 나비잠 · 범계 2호점 | [Harpy’s Candy Shop 하피스 캔디샵](https://nabijam.com/layout/res/home.php?go=rev.make&zizum=B) | 미확인 | 00:00 · 참고/재확인 | [안내](https://nabijam.com/layout/res/home.php?go=pds.list&num=112&pds_type=2) |
| 나비잠 · 범계 2호점 | [Lost & Found 로스트 앤 파운드](https://nabijam.com/layout/res/home.php?go=rev.make&zizum=B) | 미확인 | 00:00 · 참고/재확인 | [안내](https://nabijam.com/layout/res/home.php?go=pds.list&num=112&pds_type=2) |
| 나비잠 · 범계 2호점 | [Blind Justice 블라인드 저스티스](https://nabijam.com/layout/res/home.php?go=rev.make&zizum=B) | 미확인 | 00:00 · 참고/재확인 | [안내](https://nabijam.com/layout/res/home.php?go=pds.list&num=112&pds_type=2) |

## v0.1.40 실기기 보고 후 수정

- 실제 패널 미리보기 버튼 테스트로 generation 참조 오류를 재현/수정했습니다. 현재 페이지 인식과 이동 후 자동 미리보기의 같은 오류도 수정했습니다.
- 제로월드 비동기 달력·날짜 변경 후 회차 DOM 갱신을 기다립니다. 갱신 실패 시 이전 날짜 회차를 반환하지 않습니다. 준비/연습의 초기 로딩은 최대 8초, 오픈 시도는 설정된 짧은 대기 한도를 유지합니다.
- 참여 인원을 기기에 저장해 네이버 및 새 파트너 사이트의 인원 선택을 보조합니다. native select와 참여인원 라벨의 custom dropdown 샘플 검증. 실제 네이버 추가정보 DOM과 아이폰 재확인은 남아 있습니다. 키이스케이프 인원 선택 연동은 아직 추가하지 않았습니다.
- 최종 결제 상한 입력은 제거했습니다. 실전/확정 모드의 기존 결제 단계는 유지합니다. 실결제 테스트는 수행하지 않았습니다.
- 전체 UI 재설계보다 보고된 오류와 필수 입력을 먼저 수정했습니다. 이어가기 상태는 private 저장소 release/CONTINUATION.md에 기록합니다.

## v0.1.40 네이버 인원 선택 보완

공개 네이버 ExtraInputForm 코드의 실제 클래스에 맞춰 탐지하고, 입력 화면의 늦은 로딩을 최대 8초 기다립니다. 페이지 이동 후 저장한 인원 설정 및 filling-form 체크포인트를 이용한 재개 테스트, 이미 열린 드롭다운, 선택 완료 확인, 중지 취소를 검증했습니다. 실제 브라우저는 입력 화면 앞 로그인 요구로 도달하지 못했으며 아이폰 확인이 남습니다. 제로월드는 사용자 실기기 정상 확인을 받았습니다.
