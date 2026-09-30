# Ticket Helper PC — Violentmonkey 설치

## 권장 구성
- Chrome 또는 Edge
- Violentmonkey
- Ticket Helper Userscript

## 설치
1. Chrome Web Store에서 Violentmonkey를 설치합니다.
2. 아래 Ticket Helper 설치 URL을 엽니다.
   - https://raw.githubusercontent.com/omjun0807-del/ticket-helper-release/main/ticket-helper.user.js
3. Violentmonkey의 설치 화면에서 설치를 승인합니다.
4. 키이스케이프 또는 네이버 예약 페이지를 새로고침합니다.

## 자동 업데이트
Ticket Helper에는 아래 메타데이터가 포함되어 있습니다.
- @version
- @updateURL
- @downloadURL

Violentmonkey는 이 정보를 사용해 새 버전을 확인하고 업데이트합니다.
PC에서는 별도의 ZIP 교체나 chrome://extensions 새로고침이 필요하지 않습니다.

## PC / iPhone 공용
동일한 Ticket Helper 코어를 사용합니다.
- PC: 마우스/데스크톱 환경을 감지해 달력, 시간 버튼 그리드, 패널 휠 스크롤 UI 사용
- iPhone: 터치 환경을 감지해 기존 모바일 날짜/시간 UI 사용

## GitHub 동기화
기존과 동일하게 개인 GitHub 저장소 동기화를 사용할 수 있습니다.
테마/지점/오픈 규칙/회차 및 시간 우선순위만 동기화하며 예약자 이름, 전화번호, 결제 상한, 실행 모드, 토큰은 동기화 대상에서 제외됩니다.
