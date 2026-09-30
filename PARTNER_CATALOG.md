# Ticket Helper v0.1.35 검토 결과와 추가 카탈로그

확인일: 2026-10-01 (한국 시간). 요청한 10개 사이트의 테마 120개를 추가했습니다. 기존 키이스케이프 카탈로그와 사용자 우선순위·즐겨찾기·오픈 규칙은 유지합니다.

## 지원 범위

| 사이트 | 지점 수 | 테마 수 | 이번 버전 지원 |
|---|---:|---:|---|
| 래빗홀 | 1 | 2 | 회차 선택·입력 연습 / 마지막 예약 확정 수동 |
| 플레이33 | 4 | 10 | 회차 선택·입력 연습 / 마지막 예약 확정 수동 |
| 지구별 | 3 | 21 | 회차 선택·입력 연습 / 마지막 예약 확정 수동 |
| 제로월드 | 4 | 27 | 회차 선택·입력 연습 / 마지막 예약 확정 수동 |
| 둠이스케이프 | 4 | 15 | 회차 선택·입력 연습 / 마지막 예약 확정 수동 |
| 넥스트에디션 | 7 | 33 | 목록·예약 링크 (자동 예약 미지원) |
| 찰리이스케이프 | 1 | 1 | 네이버 예약 기존 어댑터 |
| 오늘의 한 페이지 | 1 | 2 | 네이버 예약 기존 어댑터 |
| 채널27 | 1 | 2 | 네이버 예약 기존 어댑터 |
| 나비잠 | 2 | 7 | 1호점 네이버 예약 / 2호점 목록·링크, 최신 화면 확인 보류 |

## 수정 사항

- 키이스케이프 오픈 실행의 빈 회차 대기를 최대 3.2초에서 70–420ms로 줄이고, 남은 재시도 시각에 맞춰 제한합니다. 빈 회차 실패는 페이지 안에서 다시 실행하고, 비활성 달력은 기존 달력 새로 열기를 유지합니다.
- 지나간 재시도 슬롯을 한 번으로 합쳐 지연 후 연속 클릭을 방지합니다.
- 이미 체크된 동의를 다시 눌러 해제하지 않습니다.
- 중지 후 후속 클릭·CAPTCHA 대기 재개를 취소합니다.
- 새 사이트는 회차 클릭 전 입력 단계 체크포인트를 저장하고, 이동 후 DOM 파싱이 끝난 입력 화면에서 재개합니다.
- 회차는 테마별로 제한하고 마감·비활성 회차를 제외합니다.
- 미확인 오픈 규칙은 null로 보관합니다. 빈 일수는 D-0으로 바꾸지 않으며, 규칙 입력 전 예약 준비를 차단하고 지금 연습을 안내합니다.
- URL은 실제 호스트를 검사하고, 공식 예약 링크 및 지원 상태를 패널에 표시합니다.
- iPhone Userscripts 및 PC 확장판에 사이트 허용 범위를 추가했습니다.

## 검증 및 남은 확인

- npm test: 기존 16개 + 새 동작·DOM·패널 테스트 3개, 총 19개 테스트 파일.
- 새 테스트는 실제 배포 번들을 실행합니다. 사이트별 DOM 샘플로 테마/날짜 확인, 회차 선택, 페이지 이동 전 저장, 입력 화면 재개, 동의 유지, CAPTCHA 대기, 마지막 확정 미실행, 설정 보존 및 중지를 확인했습니다.
- 원격 브라우저에서 플레이33·둠의 회차 선택 후 입력 화면 이동을 확인했으며, 예약 확정이나 결제는 실행하지 않았습니다.
- 실제 iPhone Safari의 정각 실행, 서버 시각 차이, 네이티브 오픈 전 alert는 아직 재현 검증하지 못했습니다. 키이스케이프와 넥스트에디션은 원격 브라우저의 개발자 도구 감지를 표시했습니다. 네이티브 alert를 억제하거나 사이트 보호를 변경하지 않습니다.
- 넥스트에디션 7개 지점 33개 테마는 공식 공개 데이터로 정리했으며, 자동 예약은 미지원입니다.
- 나비잠 1호점은 현재 공식 네이버 예약에 공개된 4개 테마를 등록했습니다. 2호점의 3개 테마는 공식 검색 색인 기준이고, 홈페이지 인증서 오류로 현재 회차·예약 가능 여부를 확인하지 못했습니다. 전체 신규/휴업 테마의 완전성은 보장하지 않습니다.
- 새 테마의 정각 오픈 규칙은 확인하지 못했으므로 사용자가 공식 안내를 확인해 입력해야 합니다.

## 지점별 테마와 공식 링크

### 래빗홀

**홍대점**

- [행운만물상](https://www.rabbitholeescape.co.kr/reservation?branch=1&theme=5)
- [두껍아 두껍아 헌집줄게 새집다오](https://www.rabbitholeescape.co.kr/reservation?branch=1&theme=4)

### 플레이33

**건대점**

- [목격자](https://play33.kr/reservation?branch=1&theme=18)
- [다이얼](https://play33.kr/reservation?branch=1&theme=15)
- [그 날](https://play33.kr/reservation?branch=1&theme=16)

**홍대점**

- [피안화](https://play33.kr/reservation?branch=4&theme=26)

**대전점**

- [I am Still Here, ELLEN](https://play33.kr/reservation?branch=5&theme=39)
- [강천여자고등학교](https://play33.kr/reservation?branch=5&theme=31)
- [자각몽(自覺夢)](https://play33.kr/reservation?branch=5&theme=32)
- [좌충우돌 꼬마마법사](https://play33.kr/reservation?branch=5&theme=33)
- [우울해서 빵 샀어](https://play33.kr/reservation?branch=5&theme=34)

**수원점**

- [기억 : 끝나지 않을 꿈](https://play33.kr/reservation?branch=7&theme=40)

### 지구별

**홍대 어드벤처점**

- [PINOCCHIO(피노키오)](https://xn--2e0b040a4xj.com/reservation?branch=2&theme=25)
- [잔향](https://xn--2e0b040a4xj.com/reservation?branch=2&theme=23)
- [아몬 : 새벽을 여는 소년](https://xn--2e0b040a4xj.com/reservation?branch=2&theme=18)
- [퀘스트 : 여정의 시작](https://xn--2e0b040a4xj.com/reservation?branch=2&theme=17)
- [지난날을 잊었다](https://xn--2e0b040a4xj.com/reservation?branch=2&theme=9)
- [미스터리](https://xn--2e0b040a4xj.com/reservation?branch=2&theme=8)

**홍대 라스트시티점**

- [스텔라](https://xn--2e0b040a4xj.com/reservation?branch=4&theme=24)
- [카부트](https://xn--2e0b040a4xj.com/reservation?branch=4&theme=22)
- [alone(얼론)](https://xn--2e0b040a4xj.com/reservation?branch=4&theme=21)
- [라스트코어](https://xn--2e0b040a4xj.com/reservation?branch=4&theme=19)
- [纹身(문신)](https://xn--2e0b040a4xj.com/reservation?branch=4&theme=15)
- [멸종위기종 탐사대](https://xn--2e0b040a4xj.com/reservation?branch=4&theme=14)
- [스위티](https://xn--2e0b040a4xj.com/reservation?branch=4&theme=13)
- [섀도우](https://xn--2e0b040a4xj.com/reservation?branch=4&theme=12)

**대구점**

- [잉카](https://xn--2e0b040a4xj.com/reservation?branch=1&theme=20)
- [우리 아빠](https://xn--2e0b040a4xj.com/reservation?branch=1&theme=11)
- [사명 : 투쟁의 노래](https://xn--2e0b040a4xj.com/reservation?branch=1&theme=6)
- [펭귄키우기](https://xn--2e0b040a4xj.com/reservation?branch=1&theme=5)
- [너의 겨울은 가고, 봄은 온다](https://xn--2e0b040a4xj.com/reservation?branch=1&theme=3)
- [만월 <<꿈을 훔치는 요괴>>](https://xn--2e0b040a4xj.com/reservation?branch=1&theme=2)
- [단디해라](https://xn--2e0b040a4xj.com/reservation?branch=1&theme=1)

### 제로월드

**김포본점**

- [FEAR](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=14)
- [해리포터의 모험 SE : 마법모자의 위기](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=15)
- [검은사원 SE](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=16)
- [피노키오 대탈출](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=17)
- [복희네 사진관 SE](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=18)
- [최면](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=7)
- [성역전설](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=19)
- [인형괴담](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=20)
- [어느 겨울밤](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=21)
- [탈옥 : 특별수용소](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=22)
- [제로호텔](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=23)

**강남점**

- [아이엠](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=28)
- [어느겨울밤2](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=29)
- [콜러](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=30)
- [나비효과](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=31)
- [링](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=32)
- [제로호텔L](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=27)
- [DONE](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=26)
- [포레스트 (FORREST)](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=25)
- [헐!](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=24)

**홍대점**

- [사랑...하는...감?](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=36)
- [깜방탈출](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=35)
- [ALIVE](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=34)
- [NOX](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=33)
- [층간소음](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=9)

**다이브 건대점**

- [인터뷰 (INTERVIEW)](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=B&zizum_num=2&theme_num=39)
- [오르골 (ORGEL)](https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=B&zizum_num=2&theme_num=38)

### 둠이스케이프

**1호점**

- [나폴리탄](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1)
- [Rendering](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1)
- [기담정](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1)
- [인앤아웃](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1)

**2호점**

- [운명](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2)
- [디스토피아](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2)
- [죄](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2)
- [인바이트](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2)

**DTH점 (부평)**

- [슬래셔](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3)
- [트리거](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3)
- [언리얼](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3)
- [스네어](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3)

**FEAR점 (수원)**

- [허수아비](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=4)
- [옵스큐라](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=4)
- [데이투어](https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=4)

### 넥스트에디션

**건대1호점**

- [다시봄](https://nextedition.co.kr/reservation/geondae-1/?theme=62)
- [이불 밖은 위험해](https://nextedition.co.kr/reservation/geondae-1/?theme=64)
- [B아파트 13동 1313호](https://nextedition.co.kr/reservation/geondae-1/?theme=63)
- [MONSTER:10800](https://nextedition.co.kr/reservation/geondae-1/?theme=61)
- [썸](https://nextedition.co.kr/reservation/geondae-1/?theme=60)
- [SOUL CHASER - 실종](https://nextedition.co.kr/reservation/geondae-1/?theme=114)

**건대2호점**

- [생존자](https://nextedition.co.kr/reservation/geondae-2/?theme=327)
- [동화나라 수비대](https://nextedition.co.kr/reservation/geondae-2/?theme=67)
- [빛을 구해줘](https://nextedition.co.kr/reservation/geondae-2/?theme=68)
- [Make-up](https://nextedition.co.kr/reservation/geondae-2/?theme=66)
- [커튼콜](https://nextedition.co.kr/reservation/geondae-2/?theme=70)
- [방탈출 아카데미](https://nextedition.co.kr/reservation/geondae-2/?theme=69)
- [어제, 그리고 오늘](https://nextedition.co.kr/reservation/geondae-2/?theme=65)

**건대 보네르관**

- [세렌디피티(SERENDIPITY)](https://nextedition.co.kr/reservation/geondae-bonheur/?theme=41)

**부천점**

- [진시황](https://nextedition.co.kr/reservation/bucheon/?theme=55)
- [쌩얼](https://nextedition.co.kr/reservation/bucheon/?theme=53)
- [집으로](https://nextedition.co.kr/reservation/bucheon/?theme=54)
- [주르륵](https://nextedition.co.kr/reservation/bucheon/?theme=52)

**분당서현점**

- [평범한 하루](https://nextedition.co.kr/reservation/bundang-seohyeon/?theme=97)
- [몽중몽](https://nextedition.co.kr/reservation/bundang-seohyeon/?theme=99)
- [테마명을 뭐로할지 못정하겠어요ㅠㅠ](https://nextedition.co.kr/reservation/bundang-seohyeon/?theme=100)
- [너에게 가는 길](https://nextedition.co.kr/reservation/bundang-seohyeon/?theme=96)
- [짠해](https://nextedition.co.kr/reservation/bundang-seohyeon/?theme=98)
- [익명의 여자](https://nextedition.co.kr/reservation/bundang-seohyeon/?theme=101)

**신림점**

- [극](https://nextedition.co.kr/reservation/sillim/?theme=42)
- [씨프?? XX!!](https://nextedition.co.kr/reservation/sillim/?theme=43)
- [Tester](https://nextedition.co.kr/reservation/sillim/?theme=44)
- [LOVER](https://nextedition.co.kr/reservation/sillim/?theme=45)
- [옛날옛날에](https://nextedition.co.kr/reservation/sillim/?theme=46)

**잠실점**

- [카페라떼](https://nextedition.co.kr/reservation/jamsil/?theme=59)
- [작은 악마들](https://nextedition.co.kr/reservation/jamsil/?theme=58)
- [락 페스티벌](https://nextedition.co.kr/reservation/jamsil/?theme=57)
- [데.코.연 (데이트 코스 연구회)](https://nextedition.co.kr/reservation/jamsil/?theme=56)

### 찰리이스케이프

**2호점**

- [퀴즈카페2](https://booking.naver.com/booking/12/bizes/1585385/items/7411891)

### 오늘의 한 페이지

**강남점**

- [버디](https://booking.naver.com/booking/12/bizes/1325520/items/6446475)
- [용하다 용해!! 용팔도령](https://booking.naver.com/booking/12/bizes/1325520/items/6738581)

### 채널27

**버터플라이점**

- [사요나라, 세이코!](https://booking.naver.com/booking/12/bizes/1498729/items/7094790)
- [붐붐박사의 폭죽놀이 유토피아](https://booking.naver.com/booking/12/bizes/1498729/items/7193259)

### 나비잠

**범계 1호점**

- [범계: 산군토벌기](https://booking.naver.com/booking/12/bizes/1564927/items/7525534)
- [트러블](https://booking.naver.com/booking/12/bizes/1564927/items/7306876)
- [몽(蒙)](https://booking.naver.com/booking/12/bizes/1564927/items/7307064)
- [왓 어 트립! What a Trip!](https://booking.naver.com/booking/12/bizes/1564927/items/7881326)

**범계 2호점**

- [Harpy’s Candy Shop 하피스 캔디샵](https://nabijam.com/layout/res/home.php?go=rev.make&zizum=B)
- [Lost & Found 로스트 앤 파운드](https://nabijam.com/layout/res/home.php?go=rev.make&zizum=B)
- [Blind Justice 블라인드 저스티스](https://nabijam.com/layout/res/home.php?go=rev.make&zizum=B)

