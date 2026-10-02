// ==UserScript==
// @name         Ticket Helper
// @namespace    ticket-helper.private
// @version      0.1.51
// @description  Personal escape-room booking helper
// @match        https://keyescape.com/*
// @match        https://www.keyescape.com/*
// @match        https://m.booking.naver.com/*
// @match        https://booking.naver.com/*
// @match        https://rabbitholeescape.co.kr/*
// @match        https://www.rabbitholeescape.co.kr/*
// @match        https://play33.kr/*
// @match        https://www.play33.kr/*
// @match        https://xn--2e0b040a4xj.com/*
// @match        https://www.xn--2e0b040a4xj.com/*
// @match        https://zeroworldkorea.com/*
// @match        https://www.zeroworldkorea.com/*
// @match        https://doomescape.com/*
// @match        https://www.doomescape.com/*
// @match        https://nextedition.co.kr/*
// @match        https://www.nextedition.co.kr/*
// @match        https://page-today.co.kr/*
// @match        https://www.page-today.co.kr/*
// @match        https://nabijam.com/*
// @match        https://www.nabijam.com/*
// @match        https://xdungeon.net/*
// @match        https://www.xdungeon.net/*
// @match        https://m.place.naver.com/*
// @updateURL    https://raw.githubusercontent.com/omjun0807-del/ticket-helper-release/main/ticket-helper.meta.js
// @downloadURL  https://raw.githubusercontent.com/omjun0807-del/ticket-helper-release/main/ticket-helper.user.js
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.xmlHttpRequest
// @connect      api.github.com
// @inject-into  content
// @run-at       document-start
// ==/UserScript==

globalThis.TICKET_HELPER_VERSION="0.1.51";
globalThis.TICKET_HELPER_DESKTOP_RUNTIME=(()=>{
  if(globalThis.TICKET_HELPER_EXTENSION)return true;
  try{
    const fine=!!globalThis.matchMedia?.('(pointer:fine)')?.matches;
    const coarse=!!globalThis.matchMedia?.('(pointer:coarse)')?.matches;
    if(fine)return true;
    if(coarse)return false;
  }catch{}
  try{
    if(typeof globalThis.navigator?.userAgentData?.mobile==='boolean')return !globalThis.navigator.userAgentData.mobile;
  }catch{}
  const ua=String(globalThis.navigator?.userAgent||'');
  return !/Android|iPhone|iPad|iPod|Mobile/i.test(ua);
})();
globalThis.TICKET_HELPER_CSS=":root{--th-bg:#f6f7fb;--th-surface:#fff;--th-surface2:#f0f2f8;--th-text:#161b2c;--th-muted:#667085;--th-border:#e3e6ef;--th-primary:#5b5ce2;--th-primary2:#ececff;--th-success:#159b6c;--th-danger:#e5484d;--th-dark:#20263a;--th-radius:18px;font-family:\"Noto Sans KR\",\"Apple SD Gothic Neo\",system-ui,sans-serif}.th-app{box-sizing:border-box;background:var(--th-bg);color:var(--th-text);padding:16px;border-radius:24px;max-width:420px;line-height:1.45}.th-app *{box-sizing:border-box}.th-header{display:flex;justify-content:space-between;align-items:flex-start;padding:4px 2px 14px}.th-header h1{font-size:20px;margin:2px 0}.th-header p,.th-help{color:var(--th-muted);font-size:12px;margin:3px 0}.th-kicker{font-size:11px;font-weight:700;color:var(--th-primary)}.th-mode,.th-source,.th-health{font-size:11px;padding:6px 9px;border-radius:999px;background:var(--th-primary2);color:var(--th-primary);font-weight:700}.is-live .th-mode{background:#fff0f1;color:var(--th-danger)}.th-card{background:var(--th-surface);border:1px solid var(--th-border);border-radius:var(--th-radius);padding:16px;margin-bottom:12px}.th-row,.th-section-head,.th-status{display:flex;justify-content:space-between;gap:12px;align-items:center}.th-label{display:block;color:var(--th-muted);font-size:10px;margin-bottom:3px}.th-countdown{margin-top:14px;border-radius:12px;background:var(--th-dark);color:#fff;padding:12px;display:flex;justify-content:space-between;align-items:center}.th-countdown b{font-size:20px}.th-section-head h2{font-size:15px;margin:0}.th-chips{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0}.th-chip{font-size:11px;background:var(--th-surface2);padding:7px 9px;border-radius:999px}.th-chip-session{background:var(--th-primary2);color:var(--th-primary)}.th-subtitle{font-size:11px;color:var(--th-muted);font-weight:700;margin-top:10px}.th-muted{color:var(--th-muted);font-size:11px}.th-fallback{padding:0;margin:10px 0 0;list-style:none}.th-fallback li{display:flex;gap:9px;align-items:center;padding:7px 0;font-size:12px}.th-fallback li span{width:22px;height:22px;border-radius:7px;display:inline-flex;align-items:center;justify-content:center;background:var(--th-surface2);font-weight:700}.th-status button{border:0;border-radius:12px;background:var(--th-primary);color:#fff;font-weight:800;padding:12px 16px;cursor:pointer}\n";

/* packages/catalog/src/builtin-catalog.js */
(function (root, factory) {
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.TicketHelper=Object.assign(root.TicketHelper||{},api);
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const BUILTIN_CATALOG_VERSION='2026-10-02-partners-7';
  const VERIFIED_AT='2026-09-30';

  function normalizedName(value){
    return String(value||'').normalize('NFKC').toLowerCase().replace(/[^0-9a-z가-힣]+/g,'');
  }
  function semanticProfileKey(profile={}){
    return `${String(profile.siteId||profile.adapterId||'')}|${String(profile.branchId||profile.branchName||'')}|${normalizedName(profile.themeName)}`;
  }
  function slug(value){
    const text=normalizedName(value);
    if(text) return encodeURIComponent(text).replace(/%/g,'').slice(0,64);
    return 'theme';
  }
  const POSTERS={
    '후즈데어|AYAKO':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%EC%95%84%EC%95%BC%EC%BD%94_size%20down.png',
    '후즈데어|투투 어드벤쳐':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%ED%88%AC%ED%88%AC%20%EC%96%B4%EB%93%9C%EB%B2%A4%EC%B3%90_size%20down.png',
    '후즈데어|괴록':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%EA%B4%B4%EB%A1%9D_size%20down.png',
    'STATION|머니머니부동산':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/KakaoTalk_Photo_2025-02-19-11-49-01.png',
    'STATION|내 방':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%EB%82%B4%EB%B0%A9_down%20size.png',
    'STATION|NOSTALGIA VISTA':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/nostalgia_sizedown.png',
    'LOG_IN 1|FOR FREE':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/FORFREE__sizedown.png',
    'LOG_IN 1|머니머니패키지':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%EB%A8%B8%EB%8B%88%EB%A8%B8%EB%8B%88%ED%8C%A8%ED%82%A4%EC%A7%80_sizedown.png',
    'LOG_IN 2|NOT MONKEY PROJECT':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/KakaoTalk_20260714_151715221.png',
    'LOG_IN 2|A GENTLE MONDAY':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/AGENTLE__sizedown.png',
    'LOG_IN 2|BACK TO THE SCENE+':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/BACKTO__sizedown.png',
    '메모리컴퍼니|FILM BY EDDY':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/EDDY__sizedown.png',
    '메모리컴퍼니|FILM BY STEVE':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/STEVE__sizedown.png',
    '메모리컴퍼니|FILM BY BOB':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/BOB__sizedown.png',
    '우주라이크|WANNA GO HOME':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/WANNA__sizedown.png',
    '우주라이크|US':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/US__sizedown.png',
    '더오름|엔제리오':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%EC%97%94%EC%A0%9C%EB%A6%AC%EC%98%A4_size%20down.png',
    '더오름|네드':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%EB%84%A4%EB%93%9C__sizedown.png',
    '강남점|그카지말라캤자나':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%EA%B7%B8%EC%B9%B4%EC%A7%80__sizedown.png',
    '강남점|살랑살랑연구소':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%EC%82%B4%EB%9E%91__sizedown.png',
    '강남점|월야애담-영문병행표기':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%EC%9B%94%EC%95%BC__sizedown.png',
    '홍대점|삐릿-뽀':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%EC%82%90%EB%A6%BF%EB%BD%80__sizedown.png',
    '홍대점|홀리데이':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%ED%99%80%EB%A6%AC%EB%8D%B0%EC%9D%B4_sizedown.png',
    '홍대점|고백':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%EA%B3%A0%EB%B0%B1__sizedown.png',
    '부산점|난쟁이의 장난-영문병행표기':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%EB%82%9C%EC%9F%81%EC%9D%B4_sizedown.png',
    '부산점|신비의숲 고대마법의 비밀':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%EC%8B%A0%EB%B9%84%EC%9D%98%EC%88%B2__size%20down.png',
    '부산점|셜록 죽음의 전화':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%EC%85%9C%EB%A1%9D%EC%A0%84%ED%99%94__size%20down.png',
    '부산점|정신병동':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%EC%A0%95%EC%8B%A0%EB%B3%91%EB%8F%99_size%20down.png',
    '부산점|파파라치':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%ED%8C%8C%ED%8C%8C%EB%9D%BC%EC%B9%98_size%20down.png',
    '전주점|살랑살랑연구소':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%EC%82%B4%EB%9E%91__sizedown.png',
    '전주점|월야애담-영문병행표기':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%EC%9B%94%EC%95%BC__sizedown.png',
    '전주점|혜화잡화점':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%ED%98%9C%ED%99%94%EC%9E%A1%ED%99%94%EC%A0%90__sizedown.png',
    '전주점|사라진 목격자':'https://d1kqa23lh2nxjx.cloudfront.net/file/theme_info/%EC%82%B0%EC%9E%A5_size%20down.png'
  };
  const KEYESCAPE_THEME_URLS={
    '우주라이크|WANNA GO HOME':'https://www.keyescape.com/reservation1.php?theme_info_num=33&theme_num=56&zizum_num=16'
  };
  const BRANCHES=[
    {id:'23',name:'후즈데어',daysBefore:6,openTime:'11:00',themes:['AYAKO','투투 어드벤쳐','괴록']},
    {id:'22',name:'STATION',daysBefore:6,openTime:'11:30',themes:['머니머니부동산','내 방','NOSTALGIA VISTA']},
    {id:'19',name:'LOG_IN 1',daysBefore:6,openTime:'10:00',themes:['FOR FREE','머니머니패키지']},
    {id:'20',name:'LOG_IN 2',daysBefore:6,openTime:'10:00',themes:['NOT MONKEY PROJECT','A GENTLE MONDAY','BACK TO THE SCENE+']},
    {id:'18',name:'메모리컴퍼니',daysBefore:6,openTime:'10:30',themes:['FILM BY EDDY','FILM BY STEVE','FILM BY BOB']},
    {id:'16',name:'우주라이크',daysBefore:6,openTime:'10:00',themes:['WANNA GO HOME','US']},
    {id:'14',name:'더오름',daysBefore:6,openTime:'10:00',themes:['엔제리오','네드']},
    {id:'3',name:'강남점',daysBefore:13,openTime:'18:00',themes:['그카지말라캤자나','살랑살랑연구소','월야애담-영문병행표기']},
    {id:'10',name:'홍대점',daysBefore:13,openTime:'20:00',themes:['삐릿-뽀','홀리데이','고백']},
    {id:'9',name:'부산점',daysBefore:13,openTime:'18:00',themes:['난쟁이의 장난-영문병행표기','신비의숲 고대마법의 비밀','셜록 죽음의 전화','정신병동','파파라치']},
    {id:'7',name:'전주점',daysBefore:13,openTime:'18:00',themes:['살랑살랑연구소','월야애담-영문병행표기','혜화잡화점','사라진 목격자']}
  ];

  function makeKeyescapeProfile(branch,theme){
    return {
      id:`catalog-keyescape-${branch.id}-${slug(theme)}`,
      siteId:'keyescape',siteName:'키이스케이프',branchId:branch.id,branchName:branch.name,themeName:theme,
      bookingUrl:`https://www.keyescape.com/reservation1.php?zizum_num=${branch.id}`,
      themeBookingUrl:KEYESCAPE_THEME_URLS[`${branch.name}|${theme}`]||'',
      adapterId:'keyescape',
      openingRule:{daysBefore:branch.daysBefore,openTime:branch.openTime,timezone:'Asia/Seoul',prefireMs:350,retryOffsetsMs:[120,420]},
      timePriorities:[],allowAnyFallback:true,fallbackThemeIds:[],favorite:false,sessionTemplates:{},
      imageUrl:POSTERS[`${branch.name}|${theme}`]||'',
      catalogSource:'KEYESCAPE official + reservation-opening reference',catalogVerifiedAt:VERIFIED_AT,
      sourceUrl:'https://keyescape.com/works.php',
      sourceNote:'기본 카탈로그 — 오픈 시각/예약 범위를 검증했으며 실제 회차는 목표 날짜에서 자동 학습'
    };
  }
  const PARTNER_CATALOG=[{"id":"catalog-rabbithole-1-5","siteId":"rabbithole","siteName":"래빗홀","branchId":"1","branchName":"홍대점","themeId":"5","themeName":"행운만물상","bookingUrl":"https://www.rabbitholeescape.co.kr/reservation?branch=1&theme=5","themeBookingUrl":"https://www.rabbitholeescape.co.kr/reservation?branch=1&theme=5","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"23:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://www.rabbitholeescape.co.kr/storage/theme/2026_06/19/1aRKtqXrj8100GDFJUTLQ8coWn5baDZ3NtRwCTKw.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://www.rabbitholeescape.co.kr/reservation?branch=1&theme=5","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://www.rabbitholeescape.co.kr/reservation","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://www.rabbitholeescape.co.kr/notice/1","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-rabbithole-1-4","siteId":"rabbithole","siteName":"래빗홀","branchId":"1","branchName":"홍대점","themeId":"4","themeName":"두껍아 두껍아 헌집줄게 새집다오","bookingUrl":"https://www.rabbitholeescape.co.kr/reservation?branch=1&theme=4","themeBookingUrl":"https://www.rabbitholeescape.co.kr/reservation?branch=1&theme=4","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"23:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://www.rabbitholeescape.co.kr/storage/theme/2026_06/19/A672ShZdrFSut0b8O8vpiaXtcPqfoAWHeaxzBXjS.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://www.rabbitholeescape.co.kr/reservation?branch=1&theme=4","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://www.rabbitholeescape.co.kr/reservation","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://www.rabbitholeescape.co.kr/notice/1","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-play33-1-18","siteId":"play33","siteName":"플레이33","branchId":"1","branchName":"건대점","themeId":"18","themeName":"목격자","bookingUrl":"https://play33.kr/reservation?branch=1&theme=18","themeBookingUrl":"https://play33.kr/reservation?branch=1&theme=18","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"20:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://play33.kr/storage/theme/2026_03/16/4nFhOmFet1VRIH5mhkF2YjWpK6A6ER81jQdCE4eH.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://play33.kr/reservation?branch=1&theme=18","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://play33.kr/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://play33.kr/reservation?branch=1&theme=18","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-play33-1-15","siteId":"play33","siteName":"플레이33","branchId":"1","branchName":"건대점","themeId":"15","themeName":"다이얼","bookingUrl":"https://play33.kr/reservation?branch=1&theme=15","themeBookingUrl":"https://play33.kr/reservation?branch=1&theme=15","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"20:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://play33.kr/storage/theme/2026_03/09/FfLx3twF3C8rleoUvXbEn5qtu6W1Mxc34Ak38R5A.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://play33.kr/reservation?branch=1&theme=15","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://play33.kr/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://play33.kr/reservation?branch=1&theme=15","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-play33-1-16","siteId":"play33","siteName":"플레이33","branchId":"1","branchName":"건대점","themeId":"16","themeName":"그 날","bookingUrl":"https://play33.kr/reservation?branch=1&theme=16","themeBookingUrl":"https://play33.kr/reservation?branch=1&theme=16","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"20:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://play33.kr/storage/theme/2026_03/09/VDrFcLv2NQ1wVKzE9Jkdkp72BZPnGI285861JQbT.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://play33.kr/reservation?branch=1&theme=16","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://play33.kr/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://play33.kr/reservation?branch=1&theme=16","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-play33-4-26","siteId":"play33","siteName":"플레이33","branchId":"4","branchName":"홍대점","themeId":"26","themeName":"피안화","bookingUrl":"https://play33.kr/reservation?branch=4&theme=26","themeBookingUrl":"https://play33.kr/reservation?branch=4&theme=26","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"20:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://play33.kr/storage/theme/2026_04/08/zLbaL5XoQXS0iPpYNjAdvI1UDIjCAICv9Vkx1VmE.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://play33.kr/reservation?branch=4&theme=26","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://play33.kr/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://play33.kr/reservation?branch=4&theme=26","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-play33-5-39","siteId":"play33","siteName":"플레이33","branchId":"5","branchName":"대전점","themeId":"39","themeName":"I am Still Here, ELLEN","bookingUrl":"https://play33.kr/reservation?branch=5&theme=39","themeBookingUrl":"https://play33.kr/reservation?branch=5&theme=39","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"10:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://play33.kr/storage/theme/2026_09/02/mD01cANOMsmTB1GNfDGOTI3zsoIb2S4jh8UkC2DN.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://play33.kr/reservation?branch=5&theme=39","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://play33.kr/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://play33.kr/reservation?branch=5&theme=39","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-play33-5-31","siteId":"play33","siteName":"플레이33","branchId":"5","branchName":"대전점","themeId":"31","themeName":"강천여자고등학교","bookingUrl":"https://play33.kr/reservation?branch=5&theme=31","themeBookingUrl":"https://play33.kr/reservation?branch=5&theme=31","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"10:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://play33.kr/storage/theme/2026_07/02/3ltkfWs9YAye96IkbJkOlYPPr8FtfZgz3NIWcjgq.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://play33.kr/reservation?branch=5&theme=31","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://play33.kr/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://play33.kr/reservation?branch=5&theme=31","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-play33-5-32","siteId":"play33","siteName":"플레이33","branchId":"5","branchName":"대전점","themeId":"32","themeName":"자각몽(自覺夢)","bookingUrl":"https://play33.kr/reservation?branch=5&theme=32","themeBookingUrl":"https://play33.kr/reservation?branch=5&theme=32","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"10:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://play33.kr/storage/theme/2026_07/02/vQNrseKEPGV5fPzVtgpWYRMrl1IHoJTgpcOSZX5d.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://play33.kr/reservation?branch=5&theme=32","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://play33.kr/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://play33.kr/reservation?branch=5&theme=32","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-play33-5-33","siteId":"play33","siteName":"플레이33","branchId":"5","branchName":"대전점","themeId":"33","themeName":"좌충우돌 꼬마마법사","bookingUrl":"https://play33.kr/reservation?branch=5&theme=33","themeBookingUrl":"https://play33.kr/reservation?branch=5&theme=33","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"10:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://play33.kr/storage/theme/2026_07/02/cjgbsZ0DKYFSK01Ai2bBt57KE0sixJ8DvI5vrGOk.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://play33.kr/reservation?branch=5&theme=33","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://play33.kr/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://play33.kr/reservation?branch=5&theme=33","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-play33-5-34","siteId":"play33","siteName":"플레이33","branchId":"5","branchName":"대전점","themeId":"34","themeName":"우울해서 빵 샀어","bookingUrl":"https://play33.kr/reservation?branch=5&theme=34","themeBookingUrl":"https://play33.kr/reservation?branch=5&theme=34","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"10:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://play33.kr/storage/theme/2026_07/02/aczcDsvEr56CFZLyIk9Lvufn1oE1wjAaLiEoU515.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://play33.kr/reservation?branch=5&theme=34","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://play33.kr/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://play33.kr/reservation?branch=5&theme=34","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-play33-7-40","siteId":"play33","siteName":"플레이33","branchId":"7","branchName":"수원점","themeId":"40","themeName":"기억 : 끝나지 않을 꿈","bookingUrl":"https://play33.kr/reservation?branch=7&theme=40","themeBookingUrl":"https://play33.kr/reservation?branch=7&theme=40","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"22:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://play33.kr/storage/theme/2026_08/31/Ed9RifmKCINrkCWSDuPt1V5d6D6J9rhnl6lkReA9.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://play33.kr/reservation?branch=7&theme=40","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://play33.kr/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://play33.kr/reservation?branch=7&theme=40","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-2-25","siteId":"earth","siteName":"지구별","branchId":"2","branchName":"홍대 어드벤처점","themeId":"25","themeName":"PINOCCHIO(피노키오)","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=2&theme=25","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=2&theme=25","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"22:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2025_10/30/I6fkjF81lKgNkyvJaS1d4hoJNEluJWisJsrhg6de.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=2&theme=25","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-2-23","siteId":"earth","siteName":"지구별","branchId":"2","branchName":"홍대 어드벤처점","themeId":"23","themeName":"잔향","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=2&theme=23","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=2&theme=23","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"22:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2025_06/15/AoGCOqlcspfLAvs40bN58BqXNomzMcl8eCLlkZdN.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=2&theme=23","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-2-18","siteId":"earth","siteName":"지구별","branchId":"2","branchName":"홍대 어드벤처점","themeId":"18","themeName":"아몬 : 새벽을 여는 소년","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=2&theme=18","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=2&theme=18","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"22:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2024_08/12/lVhIuQZQ68PyVZ2T5noQXdj26rtXVYGpH0OUtNk2.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=2&theme=18","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-2-17","siteId":"earth","siteName":"지구별","branchId":"2","branchName":"홍대 어드벤처점","themeId":"17","themeName":"퀘스트 : 여정의 시작","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=2&theme=17","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=2&theme=17","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"22:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2024_08/12/WwP3c6jOOOXBRBrwUs1JXepMo4WThUGlCfbHqR5C.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=2&theme=17","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-2-9","siteId":"earth","siteName":"지구별","branchId":"2","branchName":"홍대 어드벤처점","themeId":"9","themeName":"지난날을 잊었다","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=2&theme=9","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=2&theme=9","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"22:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2024_04/01/Zf0pAzWuiBTsYHkh1TnkC7D9yyILgvNuY3HZG4Li.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=2&theme=9","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-2-8","siteId":"earth","siteName":"지구별","branchId":"2","branchName":"홍대 어드벤처점","themeId":"8","themeName":"미스터리","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=2&theme=8","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=2&theme=8","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"22:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2024_04/01/AsCzKuMAO80qWVWpYcFOW0HF395mOMnuOH6LSntM.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=2&theme=8","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-4-24","siteId":"earth","siteName":"지구별","branchId":"4","branchName":"홍대 라스트시티점","themeId":"24","themeName":"스텔라","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=24","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=24","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"22:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2025_07/16/unjF9iWggG6wE2Vta0LiV9rXKRrXMBzSxz7846fY.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=24","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-4-22","siteId":"earth","siteName":"지구별","branchId":"4","branchName":"홍대 라스트시티점","themeId":"22","themeName":"카부트","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=22","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=22","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"22:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2025_04/29/7269vf7tqHKUQiEVYWVo1TkvQibHm7b5ynaZZeGb.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=22","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-4-21","siteId":"earth","siteName":"지구별","branchId":"4","branchName":"홍대 라스트시티점","themeId":"21","themeName":"alone(얼론)","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=21","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=21","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"22:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2025_04/02/sgprZf5XPQI7ijuV6wX55sluxeIzUBGBxTRYOOZA.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=21","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-4-19","siteId":"earth","siteName":"지구별","branchId":"4","branchName":"홍대 라스트시티점","themeId":"19","themeName":"라스트코어","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=19","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=19","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"22:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2024_08/12/sMcnvmowtWKavYYLrJsyXlQqD6iRBr9aIcZyUUYH.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=19","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-4-15","siteId":"earth","siteName":"지구별","branchId":"4","branchName":"홍대 라스트시티점","themeId":"15","themeName":"纹身(문신)","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=15","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=15","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"22:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2024_08/12/AxjIbWiNl8qQURm4R7rGYJj9ZhawGeq4BxTZrgNe.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=15","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-4-14","siteId":"earth","siteName":"지구별","branchId":"4","branchName":"홍대 라스트시티점","themeId":"14","themeName":"멸종위기종 탐사대","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=14","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=14","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"22:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2024_08/12/wwRUAFB6wzTNHW1iUEceA8wXQvgjK2KC6jClLKfk.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=14","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-4-13","siteId":"earth","siteName":"지구별","branchId":"4","branchName":"홍대 라스트시티점","themeId":"13","themeName":"스위티","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=13","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=13","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"22:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2024_08/12/ICHNrAp5AMEU85LpG30oGIzMPUUGT2FafHFqvQ1W.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=13","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-4-12","siteId":"earth","siteName":"지구별","branchId":"4","branchName":"홍대 라스트시티점","themeId":"12","themeName":"섀도우","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=12","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=12","adapterId":"tonybilly","openingRule":{"daysBefore":7,"openTime":"22:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2024_08/12/qCPKAN30TpPvsCU68SUOtj2QynGOczf08qeI633O.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=4&theme=12","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-1-20","siteId":"earth","siteName":"지구별","branchId":"1","branchName":"대구점","themeId":"20","themeName":"잉카","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=20","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=20","adapterId":"tonybilly","openingRule":{"daysBefore":14,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2024_10/15/yu2Zmry2A4AZoa5WBJHLyZKj66OyHdpDQweMYg7l.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=20","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-1-11","siteId":"earth","siteName":"지구별","branchId":"1","branchName":"대구점","themeId":"11","themeName":"우리 아빠","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=11","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=11","adapterId":"tonybilly","openingRule":{"daysBefore":14,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2024_04/01/KU0kWKNK32nIQLh4krEF9WuSCYz0UiYbrNYwm8ig.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=11","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-1-6","siteId":"earth","siteName":"지구별","branchId":"1","branchName":"대구점","themeId":"6","themeName":"사명 : 투쟁의 노래","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=6","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=6","adapterId":"tonybilly","openingRule":{"daysBefore":14,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2024_04/01/RV7LPtk2N1nKCumHHaHMBDIIVcW2V7a6wFziHui7.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=6","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-1-5","siteId":"earth","siteName":"지구별","branchId":"1","branchName":"대구점","themeId":"5","themeName":"펭귄키우기","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=5","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=5","adapterId":"tonybilly","openingRule":{"daysBefore":14,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2024_04/01/Ns7hO7iDe6P36Vaj78MlKcbq3kZ3wAcaBUnTBNCo.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=5","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-1-3","siteId":"earth","siteName":"지구별","branchId":"1","branchName":"대구점","themeId":"3","themeName":"너의 겨울은 가고, 봄은 온다","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=3","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=3","adapterId":"tonybilly","openingRule":{"daysBefore":14,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2024_04/01/4JXmZzaQzbqfz0s348NErqFplKeokgGJgUguNz6k.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=3","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-1-2","siteId":"earth","siteName":"지구별","branchId":"1","branchName":"대구점","themeId":"2","themeName":"만월 <<꿈을 훔치는 요괴>>","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=2","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=2","adapterId":"tonybilly","openingRule":{"daysBefore":14,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2024_04/01/3Nl3qjxlqpWsrTamEURAISKnY69hdAJm35eSJBvx.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=2","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-earth-1-1","siteId":"earth","siteName":"지구별","branchId":"1","branchName":"대구점","themeId":"1","themeName":"단디해라","bookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=1","themeBookingUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=1","adapterId":"tonybilly","openingRule":{"daysBefore":14,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://xn--2e0b040a4xj.com/storage/theme/2024_04/01/KlzWazJ8ChIKcVquKRon5Mgzi0FXGCdx0IO4eIoc.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://xn--2e0b040a4xj.com/reservation?branch=1&theme=1","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://xn--2e0b040a4xj.com/theme","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://xn--2e0b040a4xj.com/FAQ","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-1-14","siteId":"zeroworld","siteName":"제로월드","branchId":"1","branchName":"김포본점","themeId":"14","themeName":"FEAR","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=14","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=14","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/14_7610250240.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=14","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=14","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/1_9989297162.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-1-15","siteId":"zeroworld","siteName":"제로월드","branchId":"1","branchName":"김포본점","themeId":"15","themeName":"해리포터의 모험 SE : 마법모자의 위기","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=15","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=15","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/15_1026594960.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=15","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=15","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/1_9989297162.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-1-16","siteId":"zeroworld","siteName":"제로월드","branchId":"1","branchName":"김포본점","themeId":"16","themeName":"검은사원 SE","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=16","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=16","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/16_1333210546.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=16","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=16","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/1_9989297162.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-1-17","siteId":"zeroworld","siteName":"제로월드","branchId":"1","branchName":"김포본점","themeId":"17","themeName":"피노키오 대탈출","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=17","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=17","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/17_2977611217.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=17","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=17","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/1_9989297162.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-1-18","siteId":"zeroworld","siteName":"제로월드","branchId":"1","branchName":"김포본점","themeId":"18","themeName":"복희네 사진관 SE","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=18","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=18","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/18_5469103021.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=18","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=18","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/1_9989297162.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-1-7","siteId":"zeroworld","siteName":"제로월드","branchId":"1","branchName":"김포본점","themeId":"7","themeName":"최면","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=7","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=7","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/7_2665347392.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=7","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=7","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/1_9989297162.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-1-19","siteId":"zeroworld","siteName":"제로월드","branchId":"1","branchName":"김포본점","themeId":"19","themeName":"성역전설","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=19","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=19","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/19_4497358408.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=19","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=19","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/1_9989297162.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-1-20","siteId":"zeroworld","siteName":"제로월드","branchId":"1","branchName":"김포본점","themeId":"20","themeName":"인형괴담","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=20","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=20","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/20_2877913590.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=20","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=20","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/1_9989297162.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-1-21","siteId":"zeroworld","siteName":"제로월드","branchId":"1","branchName":"김포본점","themeId":"21","themeName":"어느 겨울밤","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=21","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=21","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/21_1699400147.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=21","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=21","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/1_9989297162.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-1-22","siteId":"zeroworld","siteName":"제로월드","branchId":"1","branchName":"김포본점","themeId":"22","themeName":"탈옥 : 특별수용소","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=22","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=22","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/22_1353635518.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=22","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=22","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/1_9989297162.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-1-23","siteId":"zeroworld","siteName":"제로월드","branchId":"1","branchName":"김포본점","themeId":"23","themeName":"제로호텔","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=23","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=23","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/23_2569171480.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=23","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=1&theme_num=23","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/1_9989297162.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-4-28","siteId":"zeroworld","siteName":"제로월드","branchId":"4","branchName":"강남점","themeId":"28","themeName":"아이엠","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=28","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=28","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:30","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/28_6019351846.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=28","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=28","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/4_9111989617.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-4-29","siteId":"zeroworld","siteName":"제로월드","branchId":"4","branchName":"강남점","themeId":"29","themeName":"어느겨울밤2","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=29","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=29","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:30","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/29_9011501549.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=29","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=29","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/4_9111989617.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-4-30","siteId":"zeroworld","siteName":"제로월드","branchId":"4","branchName":"강남점","themeId":"30","themeName":"콜러","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=30","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=30","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:30","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/30_4361012266.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=30","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=30","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/4_9111989617.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-4-31","siteId":"zeroworld","siteName":"제로월드","branchId":"4","branchName":"강남점","themeId":"31","themeName":"나비효과","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=31","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=31","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:30","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/31_1413439783.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=31","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=31","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/4_9111989617.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-4-32","siteId":"zeroworld","siteName":"제로월드","branchId":"4","branchName":"강남점","themeId":"32","themeName":"링","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=32","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=32","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:30","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/32_8119401658.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=32","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=32","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/4_9111989617.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-4-27","siteId":"zeroworld","siteName":"제로월드","branchId":"4","branchName":"강남점","themeId":"27","themeName":"제로호텔L","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=27","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=27","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:30","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/27_5174624165.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=27","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=27","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/4_9111989617.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-4-26","siteId":"zeroworld","siteName":"제로월드","branchId":"4","branchName":"강남점","themeId":"26","themeName":"DONE","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=26","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=26","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:30","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/26_6862357033.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=26","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=26","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/4_9111989617.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-4-25","siteId":"zeroworld","siteName":"제로월드","branchId":"4","branchName":"강남점","themeId":"25","themeName":"포레스트 (FORREST)","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=25","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=25","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:30","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/25_5764603364.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=25","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=25","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/4_9111989617.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-4-24","siteId":"zeroworld","siteName":"제로월드","branchId":"4","branchName":"강남점","themeId":"24","themeName":"헐!","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=24","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=24","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"11:30","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/24_6795775423.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=24","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=4&theme_num=24","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/4_9111989617.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-5-36","siteId":"zeroworld","siteName":"제로월드","branchId":"5","branchName":"홍대점","themeId":"36","themeName":"사랑...하는...감?","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=36","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=36","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"12:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/36_9683914137.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=36","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=36","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/5_7643508679.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-5-35","siteId":"zeroworld","siteName":"제로월드","branchId":"5","branchName":"홍대점","themeId":"35","themeName":"깜방탈출","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=35","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=35","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"12:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/35_6138739909.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=35","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=35","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/5_7643508679.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-5-34","siteId":"zeroworld","siteName":"제로월드","branchId":"5","branchName":"홍대점","themeId":"34","themeName":"ALIVE","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=34","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=34","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"12:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/34_3417622171.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=34","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=34","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/5_7643508679.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-5-33","siteId":"zeroworld","siteName":"제로월드","branchId":"5","branchName":"홍대점","themeId":"33","themeName":"NOX","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=33","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=33","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"12:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/33_5401205142.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=33","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=33","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/5_7643508679.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-5-9","siteId":"zeroworld","siteName":"제로월드","branchId":"5","branchName":"홍대점","themeId":"9","themeName":"층간소음","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=9","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=9","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"12:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/9_8294038556.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=9","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=A&zizum_num=5&theme_num=9","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/5_7643508679.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-2-39","siteId":"zeroworld","siteName":"제로월드","branchId":"2","branchName":"다이브 건대점","themeId":"39","themeName":"인터뷰 (INTERVIEW)","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=B&zizum_num=2&theme_num=39","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=B&zizum_num=2&theme_num=39","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"12:30","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/39_3983305796.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=B&zizum_num=2&theme_num=39","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=B&zizum_num=2&theme_num=39","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/2_3151946323.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-zeroworld-2-38","siteId":"zeroworld","siteName":"제로월드","branchId":"2","branchName":"다이브 건대점","themeId":"38","themeName":"오르골 (ORGEL)","bookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=B&zizum_num=2&theme_num=38","themeBookingUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=B&zizum_num=2&theme_num=38","adapterId":"zeroworld","openingRule":{"daysBefore":14,"openTime":"12:30","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://zeroworldkorea.com/file/theme/38_9168570557.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=B&zizum_num=2&theme_num=38","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://zeroworldkorea.com/layout/res/home.php?go=rev.make&s_subj=B&zizum_num=2&theme_num=38","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://zeroworldkorea.com/file/zizum/2_3151946323.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-doom-1-1","siteId":"doom","siteName":"둠이스케이프","branchId":"1","branchName":"1호점","themeId":"29","themeName":"나폴리탄","bookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1","themeBookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1","adapterId":"doom","openingRule":{"daysBefore":14,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://doomescape.com/file/theme/29_3290704845.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://doomescape.com/layout/res/home.php?go=main","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-doom-1-2","siteId":"doom","siteName":"둠이스케이프","branchId":"1","branchName":"1호점","themeId":"8","themeName":"Rendering","bookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1","themeBookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1","adapterId":"doom","openingRule":{"daysBefore":14,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://doomescape.com/file/theme/8_9783995423.gif","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://doomescape.com/layout/res/home.php?go=main","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-doom-1-3","siteId":"doom","siteName":"둠이스케이프","branchId":"1","branchName":"1호점","themeId":"27","themeName":"기담정","bookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1","themeBookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1","adapterId":"doom","openingRule":{"daysBefore":14,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://doomescape.com/file/theme/27_1252036177.gif","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://doomescape.com/layout/res/home.php?go=main","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-doom-1-4","siteId":"doom","siteName":"둠이스케이프","branchId":"1","branchName":"1호점","themeId":"28","themeName":"인앤아웃","bookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1","themeBookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1","adapterId":"doom","openingRule":{"daysBefore":14,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://doomescape.com/file/theme/28_6918521244.gif","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=1","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://doomescape.com/layout/res/home.php?go=main","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-doom-2-1","siteId":"doom","siteName":"둠이스케이프","branchId":"2","branchName":"2호점","themeId":"30","themeName":"운명","bookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2","themeBookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2","adapterId":"doom","openingRule":{"daysBefore":14,"openTime":"23:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://doomescape.com/file/theme/30_1050141195.gif","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://doomescape.com/layout/res/home.php?go=main","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-doom-2-2","siteId":"doom","siteName":"둠이스케이프","branchId":"2","branchName":"2호점","themeId":"31","themeName":"디스토피아","bookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2","themeBookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2","adapterId":"doom","openingRule":{"daysBefore":14,"openTime":"23:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://doomescape.com/file/theme/31_1878173996.gif","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://doomescape.com/layout/res/home.php?go=main","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-doom-2-3","siteId":"doom","siteName":"둠이스케이프","branchId":"2","branchName":"2호점","themeId":"32","themeName":"죄","bookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2","themeBookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2","adapterId":"doom","openingRule":{"daysBefore":14,"openTime":"23:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://doomescape.com/file/theme/32_1490545499.gif","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://doomescape.com/layout/res/home.php?go=main","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-doom-2-4","siteId":"doom","siteName":"둠이스케이프","branchId":"2","branchName":"2호점","themeId":"33","themeName":"인바이트","bookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2","themeBookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2","adapterId":"doom","openingRule":{"daysBefore":14,"openTime":"23:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://doomescape.com/file/theme/33_8813716089.gif","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=2","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://doomescape.com/layout/res/home.php?go=main","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-doom-3-1","siteId":"doom","siteName":"둠이스케이프","branchId":"3","branchName":"DTH점 (부평)","themeId":"19","themeName":"슬래셔","bookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3","themeBookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3","adapterId":"doom","openingRule":{"daysBefore":7,"openTime":"23:30","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://doomescape.com/file/theme/19_5166969671.com-resize","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://doomescape.com/layout/res/home.php?go=main","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-doom-3-2","siteId":"doom","siteName":"둠이스케이프","branchId":"3","branchName":"DTH점 (부평)","themeId":"22","themeName":"트리거","bookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3","themeBookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3","adapterId":"doom","openingRule":{"daysBefore":7,"openTime":"23:30","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://doomescape.com/file/theme/22_3601104894.gif","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://doomescape.com/layout/res/home.php?go=main","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-doom-3-3","siteId":"doom","siteName":"둠이스케이프","branchId":"3","branchName":"DTH점 (부평)","themeId":"24","themeName":"언리얼","bookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3","themeBookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3","adapterId":"doom","openingRule":{"daysBefore":7,"openTime":"23:30","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://doomescape.com/file/theme/24_1971649662.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://doomescape.com/layout/res/home.php?go=main","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-doom-3-4","siteId":"doom","siteName":"둠이스케이프","branchId":"3","branchName":"DTH점 (부평)","themeId":"25","themeName":"스네어","bookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3","themeBookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3","adapterId":"doom","openingRule":{"daysBefore":7,"openTime":"23:30","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://doomescape.com/file/theme/25_5304512153.gif","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=3","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://doomescape.com/layout/res/home.php?go=main","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-doom-4-1","siteId":"doom","siteName":"둠이스케이프","branchId":"4","branchName":"FEAR점 (수원)","themeId":"34","themeName":"허수아비","bookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=4","themeBookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=4","adapterId":"doom","openingRule":{"daysBefore":5,"openTime":"23:45","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://doomescape.com/file/theme/34_4437239922.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=4","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://doomescape.com/layout/res/home.php?go=main","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-doom-4-2","siteId":"doom","siteName":"둠이스케이프","branchId":"4","branchName":"FEAR점 (수원)","themeId":"35","themeName":"옵스큐라","bookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=4","themeBookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=4","adapterId":"doom","openingRule":{"daysBefore":5,"openTime":"23:45","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://doomescape.com/file/theme/35_1355284173.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=4","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://doomescape.com/layout/res/home.php?go=main","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-doom-4-3","siteId":"doom","siteName":"둠이스케이프","branchId":"4","branchName":"FEAR점 (수원)","themeId":"36","themeName":"데이투어","bookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=4","themeBookingUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=4","adapterId":"doom","openingRule":{"daysBefore":5,"openTime":"23:45","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://doomescape.com/file/theme/36_5389952639.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://doomescape.com/layout/res/home.php?go=rev.make&s_zizum=4","sourceNote":"공식 오픈 규칙 확인 · 예약 선택·입력은 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://doomescape.com/layout/res/home.php?go=main","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://doomescape.com/file/cheditor/20260519151153_qbketvxf.png","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-nextedition-15-62","siteId":"nextedition","siteName":"넥스트에디션","branchId":"15","branchName":"건대1호점","themeId":"62","themeName":"다시봄","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060662/items/5585784","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060662/items/5585784","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/konkuk-1/spring-again.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 연결 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":80,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/geondae-1/?theme=62","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-15-64","siteId":"nextedition","siteName":"넥스트에디션","branchId":"15","branchName":"건대1호점","themeId":"64","themeName":"이불 밖은 위험해","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060662/items/5585786","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060662/items/5585786","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/konkuk-1/outside-the-blanket-is-dangerous.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 연결 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/geondae-1/?theme=64","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-15-63","siteId":"nextedition","siteName":"넥스트에디션","branchId":"15","branchName":"건대1호점","themeId":"63","themeName":"B아파트 13동 1313호","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060662/items/5585785","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060662/items/5585785","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/konkuk-1/b-apartment-building-13-unit-1313.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 연결 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/geondae-1/?theme=63","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-15-61","siteId":"nextedition","siteName":"넥스트에디션","branchId":"15","branchName":"건대1호점","themeId":"61","themeName":"MONSTER:10800","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060662/items/5585783","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060662/items/5585783","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/konkuk-1/monster-10800.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 연결 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":70,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/geondae-1/?theme=61","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-15-60","siteId":"nextedition","siteName":"넥스트에디션","branchId":"15","branchName":"건대1호점","themeId":"60","themeName":"썸","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060662/items/5585774","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060662/items/5585774","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/konkuk-1/fling.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 연결 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/geondae-1/?theme=60","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-15-114","siteId":"nextedition","siteName":"넥스트에디션","branchId":"15","branchName":"건대1호점","themeId":"114","themeName":"SOUL CHASER - 실종","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060662/items/5791660","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060662/items/5791660","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/konkuk-1/soul-chaser-missing.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 연결 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":90,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/geondae-1/?theme=114","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-13-327","siteId":"nextedition","siteName":"넥스트에디션","branchId":"13","branchName":"건대2호점","themeId":"327","themeName":"생존자","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060776/items/6338561?theme=place&entry=pll&lang=ko&isProgramBizItem=false","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060776/items/6338561?theme=place&entry=pll&lang=ko&isProgramBizItem=false","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/konkuk-2/survivor.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 예약 상품 확인 · 사용자 확인 D-7 자정 · 실기기 자동 선택 확인 필요","automationStatus":"practice-supported","durationMinutes":65,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/geondae-2/?theme=327","bookingLinkCheckedAt":"2026-10-02"},{"id":"catalog-nextedition-13-67","siteId":"nextedition","siteName":"넥스트에디션","branchId":"13","branchName":"건대2호점","themeId":"67","themeName":"동화나라 수비대","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060776/items/5585582?theme=place&entry=pll&lang=ko&isProgramBizItem=false","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060776/items/5585582?theme=place&entry=pll&lang=ko&isProgramBizItem=false","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/konkuk-2/fairy-tale-land-guardians.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 예약 상품 확인 · 사용자 확인 D-7 자정 · 실기기 자동 선택 확인 필요","automationStatus":"practice-supported","durationMinutes":80,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/geondae-2/?theme=67","bookingLinkCheckedAt":"2026-10-02"},{"id":"catalog-nextedition-13-68","siteId":"nextedition","siteName":"넥스트에디션","branchId":"13","branchName":"건대2호점","themeId":"68","themeName":"빛을 구해줘","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060776/items/5585584?theme=place&entry=pll&lang=ko&isProgramBizItem=false","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060776/items/5585584?theme=place&entry=pll&lang=ko&isProgramBizItem=false","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/konkuk-2/save-the-light.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 예약 상품 확인 · 사용자 확인 D-7 자정 · 실기기 자동 선택 확인 필요","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/geondae-2/?theme=68","bookingLinkCheckedAt":"2026-10-02"},{"id":"catalog-nextedition-13-66","siteId":"nextedition","siteName":"넥스트에디션","branchId":"13","branchName":"건대2호점","themeId":"66","themeName":"Make-up","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060776/items/5585578?theme=place&entry=pll&lang=ko&isProgramBizItem=false","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060776/items/5585578?theme=place&entry=pll&lang=ko&isProgramBizItem=false","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/konkuk-2/make-up.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 예약 상품 확인 · 사용자 확인 D-7 자정 · 실기기 자동 선택 확인 필요","automationStatus":"practice-supported","durationMinutes":70,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/geondae-2/?theme=66","bookingLinkCheckedAt":"2026-10-02"},{"id":"catalog-nextedition-13-70","siteId":"nextedition","siteName":"넥스트에디션","branchId":"13","branchName":"건대2호점","themeId":"70","themeName":"커튼콜","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060776/items/5585586?theme=place&entry=pll&lang=ko&isProgramBizItem=false","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060776/items/5585586?theme=place&entry=pll&lang=ko&isProgramBizItem=false","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/konkuk-2/curtain-call.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 예약 상품 확인 · 사용자 확인 D-7 자정 · 실기기 자동 선택 확인 필요","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/geondae-2/?theme=70","bookingLinkCheckedAt":"2026-10-02"},{"id":"catalog-nextedition-13-69","siteId":"nextedition","siteName":"넥스트에디션","branchId":"13","branchName":"건대2호점","themeId":"69","themeName":"방탈출 아카데미","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060776/items/5585585?theme=place&entry=pll&lang=ko&isProgramBizItem=false","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060776/items/5585585?theme=place&entry=pll&lang=ko&isProgramBizItem=false","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/konkuk-2/escape-room-academy.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 예약 상품 확인 · 사용자 확인 D-7 자정 · 실기기 자동 선택 확인 필요","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/geondae-2/?theme=69","bookingLinkCheckedAt":"2026-10-02"},{"id":"catalog-nextedition-13-65","siteId":"nextedition","siteName":"넥스트에디션","branchId":"13","branchName":"건대2호점","themeId":"65","themeName":"어제, 그리고 오늘","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060776/items/5585572?theme=place&entry=pll&lang=ko&isProgramBizItem=false","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060776/items/5585572?theme=place&entry=pll&lang=ko&isProgramBizItem=false","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/konkuk-2/yesterday-and-today.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 예약 상품 확인 · 사용자 확인 D-7 자정 · 실기기 자동 선택 확인 필요","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/geondae-2/?theme=65","bookingLinkCheckedAt":"2026-10-02"},{"id":"catalog-nextedition-16-41","siteId":"nextedition","siteName":"넥스트에디션","branchId":"16","branchName":"건대 보네르관","themeId":"41","themeName":"세렌디피티(SERENDIPITY)","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1061259/items/5589184","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1061259/items/5589184","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/konkuk-bonheur/serendipity.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 연결 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":100,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/geondae-bonheur/?theme=41","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-12-55","siteId":"nextedition","siteName":"넥스트에디션","branchId":"12","branchName":"부천점","themeId":"55","themeName":"진시황","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060779/items/5585494","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060779/items/5585494","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/bucheon/qin-shi-huang.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 제목·URL 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":null,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/bucheon/?theme=55","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-12-53","siteId":"nextedition","siteName":"넥스트에디션","branchId":"12","branchName":"부천점","themeId":"53","themeName":"쌩얼","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060779/items/5585492","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060779/items/5585492","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/bucheon/bare-face.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 제목·URL 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":null,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/bucheon/?theme=53","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-12-54","siteId":"nextedition","siteName":"넥스트에디션","branchId":"12","branchName":"부천점","themeId":"54","themeName":"집으로","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060779/items/5585493","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060779/items/5585493","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/bucheon/homeward.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 제목·URL 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":null,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/bucheon/?theme=54","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-12-52","siteId":"nextedition","siteName":"넥스트에디션","branchId":"12","branchName":"부천점","themeId":"52","themeName":"주르륵","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060779/items/5585483","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060779/items/5585483","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/bucheon/drip-drop.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 제목·URL 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":null,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/bucheon/?theme=52","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-20-97","siteId":"nextedition","siteName":"넥스트에디션","branchId":"20","branchName":"분당서현점","themeId":"97","themeName":"평범한 하루","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1110806/items/5756095","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1110806/items/5756095","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/bundang-seohyeon/an-ordinary-day.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 제목·URL 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":90,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/bundang-seohyeon/?theme=97","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-20-99","siteId":"nextedition","siteName":"넥스트에디션","branchId":"20","branchName":"분당서현점","themeId":"99","themeName":"몽중몽","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1110806/items/5756101","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1110806/items/5756101","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/bundang-seohyeon/dream-within-a-dream.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 제목·URL 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/bundang-seohyeon/?theme=99","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-20-100","siteId":"nextedition","siteName":"넥스트에디션","branchId":"20","branchName":"분당서현점","themeId":"100","themeName":"테마명을 뭐로할지 못정하겠어요ㅠㅠ","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1110806/items/5756102","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1110806/items/5756102","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/bundang-seohyeon/i-cant-decide-on-a-theme-name.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 제목·URL 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/bundang-seohyeon/?theme=100","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-20-96","siteId":"nextedition","siteName":"넥스트에디션","branchId":"20","branchName":"분당서현점","themeId":"96","themeName":"너에게 가는 길","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1110806/items/5756083","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1110806/items/5756083","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/bundang-seohyeon/the-road-to-you.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 제목·URL 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/bundang-seohyeon/?theme=96","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-20-98","siteId":"nextedition","siteName":"넥스트에디션","branchId":"20","branchName":"분당서현점","themeId":"98","themeName":"짠해","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1110806/items/5756099","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1110806/items/5756099","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/bundang-seohyeon/cheers.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 제목·URL 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/bundang-seohyeon/?theme=98","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-20-101","siteId":"nextedition","siteName":"넥스트에디션","branchId":"20","branchName":"분당서현점","themeId":"101","themeName":"익명의 여자","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1110806/items/5756103","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1110806/items/5756103","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/bundang-seohyeon/anonymous-woman.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 제목·URL 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/bundang-seohyeon/?theme=101","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-10-42","siteId":"nextedition","siteName":"넥스트에디션","branchId":"10","branchName":"신림점","themeId":"42","themeName":"극","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060924/items/5586005","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060924/items/5586005","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/sillim/the-play.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 제목·URL 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":70,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/sillim/?theme=42","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-10-43","siteId":"nextedition","siteName":"넥스트에디션","branchId":"10","branchName":"신림점","themeId":"43","themeName":"씨프?? XX!!","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060924/items/5586011","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060924/items/5586011","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/sillim/thief-xx.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 제목·URL 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/sillim/?theme=43","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-10-44","siteId":"nextedition","siteName":"넥스트에디션","branchId":"10","branchName":"신림점","themeId":"44","themeName":"Tester","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060924/items/5586012","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060924/items/5586012","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/sillim/tester.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 제목·URL 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/sillim/?theme=44","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-10-45","siteId":"nextedition","siteName":"넥스트에디션","branchId":"10","branchName":"신림점","themeId":"45","themeName":"LOVER","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060924/items/5586013","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060924/items/5586013","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/sillim/lover.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 제목·URL 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/sillim/?theme=45","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-10-46","siteId":"nextedition","siteName":"넥스트에디션","branchId":"10","branchName":"신림점","themeId":"46","themeName":"옛날옛날에","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060924/items/5586014","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060924/items/5586014","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/sillim/once-upon-a-time.png","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 제목·URL 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/sillim/?theme=46","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-14-59","siteId":"nextedition","siteName":"넥스트에디션","branchId":"14","branchName":"잠실점","themeId":"59","themeName":"카페라떼","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060665/items/5585759","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060665/items/5585759","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/jamsil/cafe-latte.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 제목·URL 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/jamsil/?theme=59","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-14-58","siteId":"nextedition","siteName":"넥스트에디션","branchId":"14","branchName":"잠실점","themeId":"58","themeName":"작은 악마들","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060665/items/5585758","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060665/items/5585758","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/jamsil/little-devils.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 제목·URL 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/jamsil/?theme=58","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-14-57","siteId":"nextedition","siteName":"넥스트에디션","branchId":"14","branchName":"잠실점","themeId":"57","themeName":"락 페스티벌","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060665/items/5585757","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060665/items/5585757","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/jamsil/rock-festival.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 제목·URL 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/jamsil/?theme=57","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-nextedition-14-56","siteId":"nextedition","siteName":"넥스트에디션","branchId":"14","branchName":"잠실점","themeId":"56","themeName":"데.코.연 (데이트 코스 연구회)","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060665/items/5585747","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1060665/items/5585747","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"00:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://img.reserv.company/nextedition/jamsil/date-course-research-society.jpg","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nextedition.co.kr/themes","sourceNote":"네이버 상품 제목·URL 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","durationMinutes":60,"openingHint":{"daysBefore":7,"openTime":"00:00","status":"user-confirmed","note":"사용자 확인(2026-10-02): 이용일 7일 전 00:00 KST. 지점·테마별 예외는 예약 안내 재확인 필요.","sources":[]},"openingRuleCheckedAt":"2026-10-02","openingRuleSource":"user-confirmed","previousBookingUrl":"https://nextedition.co.kr/reservation/jamsil/?theme=56","reservationHint":"신청 후 업체 확인으로 확정 · 홈페이지와 판매 범위가 다를 수 있습니다."},{"id":"catalog-charlie-1585385-7411891","siteId":"charlie","siteName":"찰리이스케이프","branchId":"1585385","branchName":"2호점","themeId":"7411891","themeName":"퀴즈카페2","bookingUrl":"https://booking.naver.com/booking/12/bizes/1585385/items/7411891","themeBookingUrl":"https://booking.naver.com/booking/12/bizes/1585385/items/7411891","adapterId":"naver-booking","openingRule":{"daysBefore":7,"openTime":"22:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"verified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://naverbooking-phinf.pstatic.net/20260204_105/1770176357010xb9Py_PNG/%C6%F7%BD%BA%C5%CD_%C3%D6%C1%BE.png?type=f804_408_60_sharpen","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://m.booking.naver.com/booking/12/bizes/1585385","sourceNote":"공식 예약 화면의 오픈 안내 확인 · 참여인원 실기기 검증 필요","automationStatus":"practice-supported","imageSourceUrl":"https://booking.naver.com/booking/12/bizes/1585385/items/7411891","imageVerifiedAt":"2026-10-01","openingRuleSourceUrl":"https://m.booking.naver.com/booking/12/bizes/1585385/items/7411891","openingRuleCheckedAt":"2026-10-01"},{"id":"catalog-page-today-1325520-6446475","siteId":"page-today","siteName":"오늘의 한 페이지","branchId":"1325520","branchName":"강남점","themeId":"6446475","themeName":"버디","bookingUrl":"https://booking.naver.com/booking/12/bizes/1325520/items/6446475","themeBookingUrl":"https://booking.naver.com/booking/12/bizes/1325520/items/6446475","adapterId":"naver-booking","openingRule":null,"openingRuleStatus":"unverified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://naverbooking-phinf.pstatic.net/20250222_156/174019050685216P8e_JPEG/poster.jpeg?type=f804_408_60_sharpen","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://page-today.co.kr/","sourceNote":"공식 목록 확인 · 오픈 규칙 확인 필요 · 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://booking.naver.com/booking/12/bizes/1325520/items/6446475","imageVerifiedAt":"2026-10-01","openingHint":{"openTime":"22:00","daysBefore":null,"status":"community","note":"최근 이용 후기에서 22:00 확인. 방문 며칠 전인지와 네이버·홈페이지 차이는 재확인 필요.","sources":["https://93yjm93.tistory.com/170?category=1182756"]}},{"id":"catalog-page-today-1325520-6738581","siteId":"page-today","siteName":"오늘의 한 페이지","branchId":"1325520","branchName":"강남점","themeId":"6738581","themeName":"용하다 용해!! 용팔도령","bookingUrl":"https://booking.naver.com/booking/12/bizes/1325520/items/6738581","themeBookingUrl":"https://booking.naver.com/booking/12/bizes/1325520/items/6738581","adapterId":"naver-booking","openingRule":null,"openingRuleStatus":"unverified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://naverbooking-phinf.pstatic.net/20250507_88/1746589748143AOUEE_JPEG/yp.jpeg?type=a1000_60_sharpen","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://page-today.co.kr/","sourceNote":"공식 목록 확인 · 오픈 규칙 확인 필요 · 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://booking.naver.com/booking/12/bizes/1325520/items/6738581","imageVerifiedAt":"2026-10-01","openingHint":{"openTime":"22:00","daysBefore":null,"status":"community","note":"최근 이용 후기에서 22:00 확인. 방문 며칠 전인지와 네이버·홈페이지 차이는 재확인 필요.","sources":["https://93yjm93.tistory.com/170?category=1182756"]}},{"id":"catalog-channel27-1498729-7094790","siteId":"channel27","siteName":"채널27","branchId":"1498729","branchName":"버터플라이점","themeId":"7094790","themeName":"사요나라, 세이코!","bookingUrl":"https://booking.naver.com/booking/12/bizes/1498729/items/7094790","themeBookingUrl":"https://booking.naver.com/booking/12/bizes/1498729/items/7094790","adapterId":"naver-booking","openingRule":null,"openingRuleStatus":"unverified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://naverbooking-phinf.pstatic.net/20251024_144/1761269143690pNgDy_JPEG/%BC%BC%C0%CC%C4%DA_%C6%F7%BD%BA%C5%CD.jpg?type=f804_408_60_sharpen","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://m.place.naver.com/place/2009700690/home","sourceNote":"공식 목록 확인 · 오픈 규칙 확인 필요 · 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://booking.naver.com/booking/12/bizes/1498729/items/7094790","imageVerifiedAt":"2026-10-01","openingHint":{"daysBefore":null,"openTime":"00:00","status":"observed","note":"네이버 공개 데이터의 최근 오픈 시각 00:00 확인. 반복 규칙은 확인 필요.","sources":["https://booking.naver.com/booking/12/bizes/1498729/items/7094790"]}},{"id":"catalog-channel27-1498729-7193259","siteId":"channel27","siteName":"채널27","branchId":"1498729","branchName":"버터플라이점","themeId":"7193259","themeName":"붐붐박사의 폭죽놀이 유토피아","bookingUrl":"https://booking.naver.com/booking/12/bizes/1498729/items/7193259","themeBookingUrl":"https://booking.naver.com/booking/12/bizes/1498729/items/7193259","adapterId":"naver-booking","openingRule":null,"openingRuleStatus":"unverified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://naverbooking-phinf.pstatic.net/20260120_154/17688922057571i4wt_PNG/%BA%D5%BA%D5%C6%F7%BD%BA%C5%CD.png?type=f804_408_60_sharpen","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://m.place.naver.com/place/2009700690/home","sourceNote":"공식 목록 확인 · 오픈 규칙 확인 필요 · 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://booking.naver.com/booking/12/bizes/1498729/items/7193259","imageVerifiedAt":"2026-10-01","openingHint":{"daysBefore":null,"openTime":"00:00","status":"observed","note":"네이버 공개 데이터의 최근 오픈 시각 00:00 확인. 반복 규칙은 확인 필요.","sources":["https://booking.naver.com/booking/12/bizes/1498729/items/7193259"]}},{"id":"catalog-nabijam-1-7525534","siteId":"nabijam","siteName":"나비잠","branchId":"1564927","branchName":"범계 1호점","themeId":"7525534","themeName":"범계: 산군토벌기","bookingUrl":"https://booking.naver.com/booking/12/bizes/1564927/items/7525534","themeBookingUrl":"https://booking.naver.com/booking/12/bizes/1564927/items/7525534","adapterId":"naver-booking","openingRule":null,"openingRuleStatus":"unverified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://naverbooking-phinf.pstatic.net/20260319_135/1773907755593PoLNI_JPEG/image.jpg?type=f804_408_60_sharpen","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://nabijam.com/layout/res/home.php?go=pds.list&num=720&pds_type=2","sourceNote":"공식 네이버 예약 목록 확인 · 오픈 규칙 확인 필요 · 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://booking.naver.com/booking/12/bizes/1564927/items/7525534","imageVerifiedAt":"2026-10-01","openingHint":{"daysBefore":6,"openTime":"00:00","status":"historical-official","note":"2023년 공식 공지 D-6 자정. 2026년 네이버 이전 후 동일한 날짜 범위인지 재확인 필요.","sources":["https://nabijam.com/layout/res/home.php?go=pds.list&num=112&pds_type=2"]}},{"id":"catalog-nabijam-1-7306876","siteId":"nabijam","siteName":"나비잠","branchId":"1564927","branchName":"범계 1호점","themeId":"7306876","themeName":"트러블","bookingUrl":"https://booking.naver.com/booking/12/bizes/1564927/items/7306876","themeBookingUrl":"https://booking.naver.com/booking/12/bizes/1564927/items/7306876","adapterId":"naver-booking","openingRule":null,"openingRuleStatus":"unverified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://naverbooking-phinf.pstatic.net/20251223_148/17664811899477ToSf_PNG/KakaoTalk_20251223_175511689.png?type=f804_408_60_sharpen","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://nabijam.com/layout/res/home.php?go=pds.list&num=720&pds_type=2","sourceNote":"공식 네이버 예약 목록 확인 · 오픈 규칙 확인 필요 · 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://booking.naver.com/booking/12/bizes/1564927/items/7306876","imageVerifiedAt":"2026-10-01","openingHint":{"daysBefore":6,"openTime":"00:00","status":"historical-official","note":"2023년 공식 공지 D-6 자정. 2026년 네이버 이전 후 동일한 날짜 범위인지 재확인 필요.","sources":["https://nabijam.com/layout/res/home.php?go=pds.list&num=112&pds_type=2"]}},{"id":"catalog-nabijam-1-7307064","siteId":"nabijam","siteName":"나비잠","branchId":"1564927","branchName":"범계 1호점","themeId":"7307064","themeName":"몽(蒙)","bookingUrl":"https://booking.naver.com/booking/12/bizes/1564927/items/7307064","themeBookingUrl":"https://booking.naver.com/booking/12/bizes/1564927/items/7307064","adapterId":"naver-booking","openingRule":null,"openingRuleStatus":"unverified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://naverbooking-phinf.pstatic.net/20251223_249/1766484571628EjKpA_JPEG/KakaoTalk_20251223_175521761.jpg?type=f804_408_60_sharpen","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://nabijam.com/layout/res/home.php?go=pds.list&num=720&pds_type=2","sourceNote":"공식 네이버 예약 목록 확인 · 오픈 규칙 확인 필요 · 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://booking.naver.com/booking/12/bizes/1564927/items/7307064","imageVerifiedAt":"2026-10-01","openingHint":{"daysBefore":6,"openTime":"00:00","status":"historical-official","note":"2023년 공식 공지 D-6 자정. 2026년 네이버 이전 후 동일한 날짜 범위인지 재확인 필요.","sources":["https://nabijam.com/layout/res/home.php?go=pds.list&num=112&pds_type=2"]}},{"id":"catalog-nabijam-1-7881326","siteId":"nabijam","siteName":"나비잠","branchId":"1564927","branchName":"범계 1호점","themeId":"7881326","themeName":"왓 어 트립! What a Trip!","bookingUrl":"https://booking.naver.com/booking/12/bizes/1564927/items/7881326","themeBookingUrl":"https://booking.naver.com/booking/12/bizes/1564927/items/7881326","adapterId":"naver-booking","openingRule":null,"openingRuleStatus":"unverified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"https://naverbooking-phinf.pstatic.net/20260718_154/1784379045421uqPqJ_JPEG/image.jpg?type=f804_408_60_sharpen","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-01","sourceUrl":"https://nabijam.com/layout/res/home.php?go=pds.list&num=720&pds_type=2","sourceNote":"공식 네이버 예약 목록 확인 · 오픈 규칙 확인 필요 · 실기기 연습 필요","automationStatus":"practice-supported","imageSourceUrl":"https://booking.naver.com/booking/12/bizes/1564927/items/7881326","imageVerifiedAt":"2026-10-01","openingHint":{"daysBefore":6,"openTime":"00:00","status":"historical-official","note":"2023년 공식 공지 D-6 자정. 2026년 네이버 이전 후 동일한 날짜 범위인지 재확인 필요.","sources":["https://nabijam.com/layout/res/home.php?go=pds.list&num=112&pds_type=2"]}},{"id":"catalog-nabijam-2-harpy","siteId":"nabijam","siteName":"나비잠","branchId":"B","branchName":"범계 2호점","themeId":"","themeName":"Harpy’s Candy Shop 하피스 캔디샵","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1583178/items/7387709","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1583178/items/7387709","adapterId":"naver-booking","openingRule":null,"openingRuleStatus":"unverified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nabijam.com/layout/res/home.php?go=theme.list&zizum=B","sourceNote":"네이버 상품 연결 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","openingHint":{"daysBefore":6,"openTime":"00:00","status":"historical-official","note":"2023년 공식 공지 D-6 자정. 2026년 네이버 이전 후 동일한 날짜 범위인지 재확인 필요.","sources":["https://nabijam.com/layout/res/home.php?go=pds.list&num=112&pds_type=2"]},"previousBookingUrl":"https://nabijam.com/layout/res/home.php?go=rev.make&zizum=B","reservationHint":"네이버 예약으로 이전 · 예약금·확정 안내를 확인해 주세요."},{"id":"catalog-nabijam-2-lost-found","siteId":"nabijam","siteName":"나비잠","branchId":"B","branchName":"범계 2호점","themeId":"","themeName":"Lost & Found 로스트 앤 파운드","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1583178/items/7387728","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1583178/items/7387728","adapterId":"naver-booking","openingRule":null,"openingRuleStatus":"unverified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nabijam.com/layout/res/home.php?go=theme.list&zizum=B","sourceNote":"네이버 상품 연결 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","openingHint":{"daysBefore":6,"openTime":"00:00","status":"historical-official","note":"2023년 공식 공지 D-6 자정. 2026년 네이버 이전 후 동일한 날짜 범위인지 재확인 필요.","sources":["https://nabijam.com/layout/res/home.php?go=pds.list&num=112&pds_type=2"]},"previousBookingUrl":"https://nabijam.com/layout/res/home.php?go=rev.make&zizum=B","reservationHint":"네이버 예약으로 이전 · 예약금·확정 안내를 확인해 주세요."},{"id":"catalog-nabijam-2-blind-justice","siteId":"nabijam","siteName":"나비잠","branchId":"B","branchName":"범계 2호점","themeId":"","themeName":"Blind Justice 블라인드 저스티스","bookingUrl":"https://m.booking.naver.com/booking/12/bizes/1583178/items/7387724","themeBookingUrl":"https://m.booking.naver.com/booking/12/bizes/1583178/items/7387724","adapterId":"naver-booking","openingRule":null,"openingRuleStatus":"unverified","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"imageUrl":"","catalogSource":"official website / official Naver Booking","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://nabijam.com/layout/res/home.php?go=theme.list&zizum=B","sourceNote":"네이버 상품 연결 확인 · 실기기 자동 선택 미검증","automationStatus":"practice-supported","openingHint":{"daysBefore":6,"openTime":"00:00","status":"historical-official","note":"2023년 공식 공지 D-6 자정. 2026년 네이버 이전 후 동일한 날짜 범위인지 재확인 필요.","sources":["https://nabijam.com/layout/res/home.php?go=pds.list&num=112&pds_type=2"]},"previousBookingUrl":"https://nabijam.com/layout/res/home.php?go=rev.make&zizum=B","reservationHint":"네이버 예약으로 이전 · 예약금·확정 안내를 확인해 주세요."},{"branchId":"6","branchName":"던전루나(강남)","themeId":"49","themeName":"3일","imageUrl":"https://xdungeon.net/file/theme/49/49_8635451017.jpg","id":"catalog-beatphobia-6-49","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=6","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=6","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"18:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"18:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=6","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"5","branchName":"홍대던전Ⅲ","themeId":"19","themeName":"경성 연쇄실종사건","imageUrl":"https://xdungeon.net/file/theme/19/19_8537382733.png","id":"catalog-beatphobia-5-19","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=5","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=5","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"15:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"15:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=5","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"10","branchName":"서면던전 레드(부산)","themeId":"55","themeName":"어느 수집가의 집","imageUrl":"https://xdungeon.net/file/theme/55/55_4743680767.jpg","id":"catalog-beatphobia-10-55","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=10","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=10","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"21:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"21:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=10","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"5","branchName":"홍대던전Ⅲ","themeId":"17","themeName":"이미지 세탁소","imageUrl":"https://xdungeon.net/file/theme/17/17_9845052463.png","id":"catalog-beatphobia-5-17","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=5","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=5","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"15:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"15:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=5","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"7","branchName":"서면던전(부산)","themeId":"38","themeName":"날씨의 신 (부산 서면)","imageUrl":"https://xdungeon.net/file/theme/38/38_7828264614.jpg","id":"catalog-beatphobia-7-38","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=7","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=7","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"20:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"20:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=7","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"3","branchName":"홍대던전","themeId":"13","themeName":"꿈의 공장 (홍대)","imageUrl":"https://xdungeon.net/file/theme/13/13_7475838983.jpg","id":"catalog-beatphobia-3-13","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=3","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=3","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"13:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"13:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=3","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"1","branchName":"던전101","themeId":"9","themeName":"LET’S PLAY TOGETHER","imageUrl":"https://xdungeon.net/file/theme/9/9_6351157047.jpg","id":"catalog-beatphobia-1-9","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=1","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=1","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"14:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"14:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=1","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"10","branchName":"서면던전 레드(부산)","themeId":"52","themeName":"당감동 정육점","imageUrl":"https://xdungeon.net/file/theme/52/52_7744824808.jpg","id":"catalog-beatphobia-10-52","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=10","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=10","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"21:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"21:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=10","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"1","branchName":"던전101","themeId":"1","themeName":"화생설화 : Blooming","imageUrl":"https://xdungeon.net/file/theme/1/1_4586195611.png","id":"catalog-beatphobia-1-1","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=1","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=1","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"14:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"14:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=1","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"9","branchName":"던전스텔라(강남)","themeId":"59","themeName":"TIENTANG CITY","imageUrl":"https://xdungeon.net/file/theme/59/59_4338951469.png","id":"catalog-beatphobia-9-59","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=9","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=9","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"19:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"19:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=9","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"7","branchName":"서면던전(부산)","themeId":"36","themeName":"오늘 나는 (부산 서면)","imageUrl":"https://xdungeon.net/file/theme/36/36_4458915665.png","id":"catalog-beatphobia-7-36","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=7","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=7","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"20:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"20:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=7","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"4","branchName":"강남던전Ⅱ","themeId":"4","themeName":"LOST KINGDOM2 : 대탐험의 시작","imageUrl":"https://xdungeon.net/file/theme/4/4_7736547019.png","id":"catalog-beatphobia-4-4","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=4","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=4","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"17:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"17:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=4","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"10","branchName":"서면던전 레드(부산)","themeId":"56","themeName":"AMEN","imageUrl":"https://xdungeon.net/file/theme/56/56_8563141336.jpg","id":"catalog-beatphobia-10-56","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=10","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=10","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"21:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"21:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=10","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"9","branchName":"던전스텔라(강남)","themeId":"51","themeName":"響 : 향","imageUrl":"https://xdungeon.net/file/theme/51/51_9344952071.png","id":"catalog-beatphobia-9-51","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=9","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=9","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"19:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"19:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=9","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"10","branchName":"서면던전 레드(부산)","themeId":"57","themeName":"부적","imageUrl":"https://xdungeon.net/file/theme/57/57_2736427488.jpg","id":"catalog-beatphobia-10-57","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=10","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=10","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"21:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"21:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=10","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"7","branchName":"서면던전(부산)","themeId":"37","themeName":"꿈의 공장 (부산 서면)","imageUrl":"https://xdungeon.net/file/theme/37/37_3514855627.jpg","id":"catalog-beatphobia-7-37","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=7","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=7","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"20:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"20:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=7","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"9","branchName":"던전스텔라(강남)","themeId":"50","themeName":"데스티니 앤드 타로","imageUrl":"https://xdungeon.net/file/theme/50/50_7745391062.jpg","id":"catalog-beatphobia-9-50","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=9","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=9","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"19:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"19:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=9","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"3","branchName":"홍대던전","themeId":"3","themeName":"오늘 나는 (홍대)","imageUrl":"https://xdungeon.net/file/theme/3/3_8186075995.png","id":"catalog-beatphobia-3-3","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=3","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=3","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"13:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"13:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=3","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"2","branchName":"강남던전","themeId":"2","themeName":"강남목욕탕","imageUrl":"https://xdungeon.net/file/theme/2/2_1141758698.jpg","id":"catalog-beatphobia-2-2","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=2","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=2","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"16:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"16:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=2","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"3","branchName":"홍대던전","themeId":"14","themeName":"날씨의 신 (홍대)","imageUrl":"https://xdungeon.net/file/theme/14/14_1175778262.jpg","id":"catalog-beatphobia-3-14","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=3","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=3","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"13:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"13:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=3","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"6","branchName":"던전루나(강남)","themeId":"8","themeName":"검은 운명의 밤","imageUrl":"https://xdungeon.net/file/theme/8/8_1961246779.png","id":"catalog-beatphobia-6-8","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=6","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=6","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"18:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"18:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=6","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"10","branchName":"서면던전 레드(부산)","themeId":"54","themeName":"산장으로의 초대","imageUrl":"https://xdungeon.net/file/theme/54/54_4771846903.jpg","id":"catalog-beatphobia-10-54","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=10","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=10","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"21:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"21:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=10","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"2","branchName":"강남던전","themeId":"12","themeName":"LOST KINGDOM : 잊혀진 전설","imageUrl":"https://xdungeon.net/file/theme/12/12_3322874120.jpg","id":"catalog-beatphobia-2-12","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=2","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=2","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"16:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"16:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=2","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"5","branchName":"홍대던전Ⅲ","themeId":"5","themeName":"그달동네","imageUrl":"https://xdungeon.net/file/theme/5/5_8093401843.png","id":"catalog-beatphobia-5-5","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=5","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=5","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"15:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"15:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=5","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"1","branchName":"던전101","themeId":"6","themeName":"전래동 자살사건","imageUrl":"https://xdungeon.net/file/theme/6/6_7919106628.png","id":"catalog-beatphobia-1-6","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=1","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=1","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"14:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"14:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=1","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"1","branchName":"던전101","themeId":"7","themeName":"MST 엔터테인먼트","imageUrl":"https://xdungeon.net/file/theme/7/7_1718289672.jpg","id":"catalog-beatphobia-1-7","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=1","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=1","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"14:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"14:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=1","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"5","branchName":"홍대던전Ⅲ","themeId":"18","themeName":"And I met E","imageUrl":"https://xdungeon.net/file/theme/18/18_5563125084.png","id":"catalog-beatphobia-5-18","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=5","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=5","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"15:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"15:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=5","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"10","branchName":"서면던전 레드(부산)","themeId":"53","themeName":"고시원 살인사건","imageUrl":"https://xdungeon.net/file/theme/53/53_6665881096.jpg","id":"catalog-beatphobia-10-53","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=10","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=10","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"21:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"21:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=10","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"2","branchName":"강남던전","themeId":"11","themeName":"마음을 그려드립니다","imageUrl":"https://xdungeon.net/file/theme/11/11_6145641280.jpg","id":"catalog-beatphobia-2-11","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=2","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=2","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"16:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"16:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=2","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"2","branchName":"강남던전","themeId":"10","themeName":"대호시장 살인사건","imageUrl":"https://xdungeon.net/file/theme/10/10_1395908201.jpg","id":"catalog-beatphobia-2-10","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=2","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=2","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"16:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"16:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=2","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"3","branchName":"홍대던전","themeId":"15","themeName":"사라진 보물 : 대저택의 비밀","imageUrl":"https://xdungeon.net/file/theme/15/15_3539534119.jpg","id":"catalog-beatphobia-3-15","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=3","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=3","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"13:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"13:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=3","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"},{"branchId":"4","branchName":"강남던전Ⅱ","themeId":"16","themeName":"MAYDAY","imageUrl":"https://xdungeon.net/file/theme/16/16_3845207710.png","id":"catalog-beatphobia-4-16","siteId":"beatphobia","siteName":"비트포비아","bookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=4","themeBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=4","adapterId":"beatphobia","openingRule":{"daysBefore":6,"openTime":"17:00","timezone":"Asia/Seoul","prefireMs":0,"retryOffsetsMs":[120,420,900,1600]},"openingRuleStatus":"configured","timePriorities":[],"allowAnyFallback":true,"fallbackThemeIds":[],"favorite":false,"sessionTemplates":{},"catalogSource":"official website","catalogVerifiedAt":"2026-10-02","sourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageSourceUrl":"https://xdungeon.net/layout/res/home.php?go=theme.list","imageVerifiedAt":"2026-10-02","automationStatus":"practice-supported","sourceNote":"D-6 사용자 설정 · 지점별 시각 공식 확인 · 실기기 연습 필요","openingHint":{"daysBefore":6,"openTime":"17:00","status":"configured","note":"D-6 사용자 확인 · 지점별 시각은 공식 안내","sources":["https://xdungeon.net/layout/res/home.php?go=rev.guide","https://xdungeon.net/file/cheditor/20240424142201_tlhulhfu.jpg"]},"previousBookingUrl":"https://xdungeon.net/layout/res/home.php?go=rev.main&s_zizum=4","reservationHint":"최종 예약 확정은 직접 진행 · CAPTCHA 직접 입력","openingRuleCheckedAt":"2026-10-02","openingRuleSourceUrl":"https://xdungeon.net/layout/res/home.php?go=rev.guide"}];
  function getBuiltinCatalogProfiles(){
    return [...BRANCHES.flatMap(branch=>branch.themes.map(theme=>makeKeyescapeProfile(branch,theme))),...PARTNER_CATALOG.map(p=>({...p,openingRule:p.openingRule&&{...p.openingRule},timePriorities:[],fallbackThemeIds:[],sessionTemplates:{}}))];
  }
  function enrichLocal(local,builtin){
    const migrateBooking=((['nextedition','nabijam'].includes(builtin.siteId)&&builtin.adapterId==='naver-booking')||(builtin.siteId==='beatphobia'&&builtin.adapterId==='beatphobia'))&&builtin.previousBookingUrl&&local.adapterId==='manual'&&local.bookingUrl===builtin.previousBookingUrl&&(!local.themeBookingUrl||local.themeBookingUrl===builtin.previousBookingUrl);
    return {
      ...builtin,
      ...local,
      id:local.id||builtin.id,
      bookingUrl:migrateBooking?builtin.bookingUrl:(local.bookingUrl||builtin.bookingUrl),
      themeBookingUrl:migrateBooking?builtin.themeBookingUrl:(local.themeBookingUrl||builtin.themeBookingUrl||''),
      adapterId:migrateBooking?builtin.adapterId:(local.adapterId||builtin.adapterId),
      automationStatus:migrateBooking?builtin.automationStatus:(local.automationStatus||builtin.automationStatus),
      reservationHint:local.reservationHint||builtin.reservationHint||'',
      openingHint:builtin.siteId==='beatphobia'&&(migrateBooking||(!local.openingRule&&builtin.openingRule))?builtin.openingHint:(local.openingHint||builtin.openingHint),
      themeId:builtin.siteId==='doom'&&String(local.themeId)===String(builtin.id).split('-').pop()?builtin.themeId:(local.themeId||builtin.themeId),
      openingRule:local.openingRule||builtin.openingRule,
      openingRuleStatus:local.openingRule?(local.openingRuleStatus||"configured"):builtin.openingRuleStatus,
      openingRuleSourceUrl:local.openingRule?local.openingRuleSourceUrl:builtin.openingRuleSourceUrl,
      timePriorities:Array.isArray(local.timePriorities)?local.timePriorities:(builtin.timePriorities||[]),
      fallbackThemeIds:Array.isArray(local.fallbackThemeIds)?local.fallbackThemeIds:(builtin.fallbackThemeIds||[]),
      sessionTemplates:local.sessionTemplates||builtin.sessionTemplates||{},
      imageUrl:local.imageUrl||builtin.imageUrl||'',
      catalogSource:local.catalogSource||builtin.catalogSource,
      catalogVerifiedAt:local.catalogVerifiedAt||builtin.catalogVerifiedAt,
      sourceUrl:local.sourceUrl||builtin.sourceUrl,
      sourceNote:(!local.openingRule&&builtin.openingRule)?builtin.sourceNote:(local.sourceNote||builtin.sourceNote)
    };
  }
  function mergeBuiltinCatalog(localProfiles=[],builtinProfiles=getBuiltinCatalogProfiles()){
    const out=(localProfiles||[]).map(p=>({...p}));
    for(const builtin of builtinProfiles||[]){
      const key=semanticProfileKey(builtin);
      const i=out.findIndex(p=>semanticProfileKey(p)===key);
      if(i>=0) out[i]=enrichLocal(out[i],builtin);
      else out.push({...builtin});
    }
    return out;
  }
  function upsertProfileByIdentity(profiles=[],incoming={}){
    const out=(profiles||[]).map(p=>({...p}));
    const key=semanticProfileKey(incoming);
    const i=out.findIndex(p=>semanticProfileKey(p)===key);
    if(i<0){out.push({...incoming});return out;}
    const old=out[i];
    out[i]={...old,...incoming,id:old.id||incoming.id,
      timePriorities:Array.isArray(old.timePriorities)?old.timePriorities:(incoming.timePriorities||[]),
      fallbackThemeIds:Array.isArray(old.fallbackThemeIds)?old.fallbackThemeIds:(incoming.fallbackThemeIds||[]),
      sessionTemplates:old.sessionTemplates||incoming.sessionTemplates||{},
      imageUrl:incoming.imageUrl||old.imageUrl||''};
    return out;
  }

  return {BUILTIN_CATALOG_VERSION,getBuiltinCatalogProfiles,semanticProfileKey,mergeBuiltinCatalog,upsertProfileByIdentity};
});


/* packages/schemas/src/profile.js */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TicketHelper = Object.assign(root.TicketHelper || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const TIE_BREAKS = new Set(['earliest', 'latest', 'closest', 'site-order']);
  const TEMPLATE_KINDS = new Set(['weekday', 'weekend', 'date', 'manual']);
  const MISMATCH_POLICIES = new Set(['exact-only', 'exact-then-nearest', 'fall-back-to-hour-bands']);
  const PRIVATE_KEYS = new Set([
    'name', 'phone', 'phoneNumber', 'credentials', 'password', 'cookies', 'cookie',
    'token', 'accessToken', 'refreshToken', 'session', 'sessionId', 'currentAvailability'
  ]);

  function isPlainObject(value) {
    return !!value && typeof value === 'object' && !Array.isArray(value);
  }

  function isHourBand(value) {
    return Number.isInteger(value) && value >= 0 && value <= 23;
  }

  function isHHMM(value) {
    if (typeof value !== 'string' || !/^\d{2}:\d{2}$/.test(value)) return false;
    const [h, m] = value.split(':').map(Number);
    return h >= 0 && h <= 23 && m >= 0 && m <= 59;
  }

  function validateTimePreference(pref, path, errors) {
    if (!isPlainObject(pref)) {
      errors.push(`${path} must be an object`);
      return;
    }
    if (!isHourBand(pref.hour)) errors.push(`${path}.hour must be 0..23`);
    if (!TIE_BREAKS.has(pref.tieBreak)) errors.push(`${path}.tieBreak is invalid`);
    if (pref.tieBreak === 'closest') {
      if (!Number.isInteger(pref.referenceMinute) || pref.referenceMinute < 0 || pref.referenceMinute > 59) {
        errors.push(`${path}.referenceMinute must be 0..59 when tieBreak=closest`);
      }
    }
  }

  function validateSessionTemplate(template, expectedKind, path, errors) {
    if (!isPlainObject(template)) {
      errors.push(`${path} must be an object`);
      return;
    }
    if (!TEMPLATE_KINDS.has(template.kind)) errors.push(`${path}.kind is invalid`);
    if (expectedKind && template.kind !== expectedKind) errors.push(`${path}.kind must be ${expectedKind}`);
    if (!Array.isArray(template.times) || template.times.some((t) => !isHHMM(t))) {
      errors.push(`${path}.times must be HH:MM[]`);
    }
    if (!Array.isArray(template.userPriority) || template.userPriority.some((t) => !isHHMM(t))) {
      errors.push(`${path}.userPriority must be HH:MM[]`);
    }
    if (!MISMATCH_POLICIES.has(template.mismatchPolicy)) errors.push(`${path}.mismatchPolicy is invalid`);
  }

  function validateOpeningRule(rule, errors) {
    if (!isPlainObject(rule)) {
      errors.push('openingRule is required');
      return;
    }
    if (!Number.isInteger(rule.daysBefore) || rule.daysBefore < 0 || rule.daysBefore > 60) {
      errors.push('openingRule.daysBefore is required and must be 0..60');
    }
    if (!isHHMM(rule.openTime)) errors.push('openingRule.openTime is required and must be HH:MM');
    if (rule.timezone !== 'Asia/Seoul') errors.push('openingRule.timezone must be Asia/Seoul');
    if (!(rule.prefireMs === 'auto' || (Number.isInteger(rule.prefireMs) && rule.prefireMs >= 0 && rule.prefireMs <= 5000))) {
      errors.push('openingRule.prefireMs must be auto or 0..5000');
    }
    if (!Array.isArray(rule.retryOffsetsMs) || rule.retryOffsetsMs.some((v) => !Number.isInteger(v) || v < 0 || v > 10000)) {
      errors.push('openingRule.retryOffsetsMs must be non-negative millisecond integers');
    }
  }

  function validateThemeProfile(profile) {
    const errors = [];
    if (!isPlainObject(profile)) return { ok: false, errors: ['profile must be an object'] };
    for (const key of ['id', 'siteId', 'themeName', 'bookingUrl', 'adapterId']) {
      if (typeof profile[key] !== 'string' || !profile[key].trim()) errors.push(`${key} is required`);
    }
    if(!(profile.openingRule===null&&profile.openingRuleStatus==='unverified'))validateOpeningRule(profile.openingRule, errors);
    if (!Array.isArray(profile.timePriorities)) errors.push('timePriorities must be an array');
    else profile.timePriorities.forEach((p, i) => validateTimePreference(p, `timePriorities[${i}]`, errors));
    if (typeof profile.allowAnyFallback !== 'boolean') errors.push('allowAnyFallback must be boolean');
    if (!Array.isArray(profile.fallbackThemeIds) || profile.fallbackThemeIds.some((id) => typeof id !== 'string')) {
      errors.push('fallbackThemeIds must be string[]');
    }
    if (typeof profile.favorite !== 'boolean') errors.push('favorite must be boolean');

    const st = profile.sessionTemplates;
    if (st !== undefined) {
      if (!isPlainObject(st)) errors.push('sessionTemplates must be an object');
      else {
        if (st.weekday) validateSessionTemplate(st.weekday, 'weekday', 'sessionTemplates.weekday', errors);
        if (st.weekend) validateSessionTemplate(st.weekend, 'weekend', 'sessionTemplates.weekend', errors);
        if (st.manual) validateSessionTemplate(st.manual, 'manual', 'sessionTemplates.manual', errors);
        if (st.dates !== undefined) {
          if (!isPlainObject(st.dates)) errors.push('sessionTemplates.dates must be an object');
          else for (const [date, template] of Object.entries(st.dates)) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push(`sessionTemplates.dates.${date} key must be YYYY-MM-DD`);
            validateSessionTemplate(template, 'date', `sessionTemplates.dates.${date}`, errors);
          }
        }
      }
    }
    return { ok: errors.length === 0, errors };
  }

  function sanitizeProfileExport(value) {
    if (Array.isArray(value)) return value.map(sanitizeProfileExport);
    if (!isPlainObject(value)) return value;
    const out = {};
    for (const [key, child] of Object.entries(value)) {
      if (PRIVATE_KEYS.has(key)) continue;
      out[key] = sanitizeProfileExport(child);
    }
    return out;
  }

  return {
    isHourBand,
    isHHMM,
    validateThemeProfile,
    sanitizeProfileExport,
    constants: {
      TIE_BREAKS: [...TIE_BREAKS],
      TEMPLATE_KINDS: [...TEMPLATE_KINDS],
      MISMATCH_POLICIES: [...MISMATCH_POLICIES]
    }
  };
});


/* packages/schemas/src/run-state.js */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TicketHelper = Object.assign(root.TicketHelper || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const RUN_STAGES = Object.freeze([
    'idle', 'waiting-open', 'selecting-date', 'selecting-session', 'advancing',
    'filling-form', 'awaiting-captcha', 'ready-to-confirm', 'completed', 'failed'
  ]);
  function createRunCheckpoint(profileId, stage = 'idle', extra = {}) {
    return { version: 1, profileId, stage, updatedAt: Date.now(), ...extra };
  }
  return { RUN_STAGES, createRunCheckpoint };
});


/* packages/schemas/src/adapter.js */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TicketHelper = Object.assign(root.TicketHelper || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const DIAGNOSTIC_STAGES = Object.freeze([
    'adapter-unsupported', 'date-missing', 'date-disabled', 'session-container-missing',
    'session-ambiguous', 'session-unavailable', 'next-button-missing', 'next-button-ambiguous',
    'navigation-failed', 'form-field-missing', 'agreement-missing', 'captcha-pending',
    'confirmation-blocked', 'site-error', 'unknown'
  ]);
  function actionOk(data = {}) { return { ok: true, ...data }; }
  function actionFail(stage, message, data = {}) { return { ok: false, stage, message, ...data }; }
  return { DIAGNOSTIC_STAGES, actionOk, actionFail };
});


/* packages/core/src/opening-rule.js */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TicketHelper = Object.assign(root.TicketHelper || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SEOUL_OFFSET_MINUTES = 9 * 60;

  function parseDateOnly(value) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
    if (!m) throw new TypeError('targetDate must be YYYY-MM-DD');
    const year = Number(m[1]), month = Number(m[2]), day = Number(m[3]);
    const check = new Date(Date.UTC(year, month - 1, day));
    if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
      throw new RangeError('targetDate is not a valid calendar date');
    }
    return { year, month, day };
  }

  function parseTime(value) {
    const m = /^(\d{2}):(\d{2})$/.exec(String(value));
    if (!m) throw new TypeError('openTime must be HH:MM');
    const hour = Number(m[1]), minute = Number(m[2]);
    if (hour > 23 || minute > 59) throw new RangeError('openTime is invalid');
    return { hour, minute };
  }

  function calculateOpeningInstant(targetDate, rule) {
    if (!rule || rule.timezone !== 'Asia/Seoul') throw new TypeError('timezone must be Asia/Seoul');
    if (!Number.isInteger(rule.daysBefore) || rule.daysBefore < 0) throw new TypeError('daysBefore must be a non-negative integer');
    const { year, month, day } = parseDateOnly(targetDate);
    const { hour, minute } = parseTime(rule.openTime);
    const kstWallClockAsUtc = Date.UTC(year, month - 1, day - rule.daysBefore, hour, minute, 0, 0);
    return new Date(kstWallClockAsUtc - SEOUL_OFFSET_MINUTES * 60_000);
  }

  function recommendPrefireMs(samplesMs, bounds = {}) {
    const min = Number.isFinite(bounds.min) ? bounds.min : 120;
    const max = Number.isFinite(bounds.max) ? bounds.max : 800;
    const fallback = Number.isFinite(bounds.fallback) ? bounds.fallback : 350;
    const valid = (Array.isArray(samplesMs) ? samplesMs : [])
      .filter((v) => Number.isFinite(v) && v >= 0)
      .sort((a, b) => a - b);
    if (!valid.length) return Math.round(Math.min(max, Math.max(min, fallback)));
    const mid = Math.floor(valid.length / 2);
    const median = valid.length % 2 ? valid[mid] : (valid[mid - 1] + valid[mid]) / 2;
    return Math.round(Math.min(max, Math.max(min, median)));
  }

  function buildOpenWindow(openAt, rule, options = {}) {
    const openMs = openAt instanceof Date ? openAt.getTime() : Number(openAt);
    if (!Number.isFinite(openMs)) throw new TypeError('openAt must be a Date or epoch milliseconds');
    const prefire = rule.prefireMs === 'auto'
      ? recommendPrefireMs(options.samplesMs || [], options.bounds || { fallback: 350 })
      : rule.prefireMs;
    if (!Number.isFinite(prefire) || prefire < 0) throw new TypeError('prefireMs must be non-negative or auto');
    const retries = Array.isArray(rule.retryOffsetsMs) ? rule.retryOffsetsMs : [];
    const offsets = [-Math.round(prefire), 0, ...retries.filter((v) => Number.isFinite(v) && v >= 0).map(Math.round)];
    return [...new Set(offsets)].sort((a, b) => a - b).map((offset) => openMs + offset);
  }

  return { calculateOpeningInstant, buildOpenWindow, recommendPrefireMs };
});


/* packages/core/src/open-trigger.js */
(function(root,factory){
  const deps=typeof module==='object'&&module.exports?require('./opening-rule.js'):(root.TicketHelper||{});
  const api=factory(deps);
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.TicketHelper=Object.assign(root.TicketHelper||{},api);
})(typeof globalThis!=='undefined'?globalThis:this,function(deps){
  'use strict';
  const RETRYABLE=new Set(['date-missing','date-disabled','sessions-not-loaded','session-container-missing','session-unavailable']);
  function createOpenTrigger(targetDate,rule,options={}){
    const openAt=deps.calculateOpeningInstant(targetDate,rule);
    return {version:1,targetDate,openAtMs:openAt.getTime(),attemptsMs:deps.buildOpenWindow(openAt,rule,options),nextIndex:0};
  }
  function normalizeState(state){
    return {version:1,targetDate:state?.targetDate,openAtMs:state?.openAtMs,attemptsMs:Array.isArray(state?.attemptsMs)?state.attemptsMs.slice():[],nextIndex:Number.isInteger(state?.nextIndex)&&state.nextIndex>=0?state.nextIndex:0};
  }
  function nextOpenTriggerAction(state,nowMs=Date.now()){
    const next=normalizeState(state);let i=next.nextIndex;
    while(i+1<next.attemptsMs.length&&next.attemptsMs[i+1]<=nowMs)i++;
    if(i>=next.attemptsMs.length)return{kind:'exhausted',state:next};
    const atMs=next.attemptsMs[i];
    if(nowMs<atMs)return{kind:'wait',atMs,delayMs:atMs-nowMs,state:next};
    next.nextIndex=i+1;return{kind:'attempt',atMs,delayMs:0,state:next};
  }
  function isOpeningRetryableStage(stage){return RETRYABLE.has(String(stage||''));}
  return{createOpenTrigger,nextOpenTriggerAction,isOpeningRetryableStage};
});


/* packages/core/src/browser-run.js */
(function(root,factory){
  const deps=typeof module==='object'&&module.exports?{
    ...require('./run-resume.js'),
    ...require('./open-trigger.js')
  }:(root.TicketHelper||{});
  const api=factory(deps);
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.TicketHelper=Object.assign(root.TicketHelper||{},api);
})(typeof globalThis!=='undefined'?globalThis:this,function(deps){
  'use strict';

  function createBrowserRunHooks({saveCheckpoint,profileId,targetDate,mode='practice',fallbackCursor}={}){
    if(typeof saveCheckpoint!=='function') throw new TypeError('saveCheckpoint is required');
    const write=(stage,session,autoContinue)=>saveCheckpoint(deps.createPersistedCheckpoint({
      profileId,stage,targetDate,mode,fallbackCursor,now:Date.now,
      extra:{sessionLabel:session?.label||session||'',autoContinue:!!autoContinue}
    }));
    return {
      async onBeforeAdvance({session}={}){return write('filling-form',session,true);},
      async onBeforeConfirm({session}={}){return write('confirming',session,false);}
    };
  }

  async function resumePersistedStage(machine,checkpoint,userProfile={}){
    if(!machine||!checkpoint) return null;
    const common={profileId:checkpoint.profileId,targetDate:checkpoint.targetDate,mode:checkpoint.mode||'practice',session:{label:checkpoint.sessionLabel||''},fallbackCursor:checkpoint.fallbackCursor};
    if(checkpoint.stage==='filling-form') return machine.resumeAfterAdvance({...common,userProfile});
    if(checkpoint.stage==='awaiting-captcha') return machine.resumeFromCaptcha(common);
    return null;
  }

  function shouldRetryOpeningResult(result,openTrigger){
    if(!result||result.stage!=='failed'||!openTrigger) return false;
    if(!deps.isOpeningRetryableStage(result.diagnostic?.stage)) return false;
    return Array.isArray(openTrigger.attemptsMs)&&Number.isInteger(openTrigger.nextIndex)&&openTrigger.nextIndex<openTrigger.attemptsMs.length;
  }



  function sameBookingLocation(a,b){
    try{
      const left=new URL(a);const right=new URL(b);
      const normalizeHost=host=>{
        let value=String(host||'').toLowerCase().replace(/^www\./,'');
        if(value==='m.booking.naver.com')value='booking.naver.com';
        return value;
      };
      const normalizePath=path=>{const value=String(path||'/').replace(/\/+$/,'');return value||'/';};
      const query=url=>JSON.stringify([...url.searchParams.entries()].filter(([key])=>key!=='_th_reset').sort((x,y)=>x[0]===y[0]?String(x[1]).localeCompare(String(y[1])):String(x[0]).localeCompare(String(y[0]))));
      return normalizeHost(left.hostname)===normalizeHost(right.hostname)&&normalizePath(left.pathname)===normalizePath(right.pathname)&&query(left)===query(right);
    }catch{return String(a||'')===String(b||'');}
  }

  async function waitForManualCaptcha(machine,context,options={}){
    const pollMs=Number.isFinite(options.pollMs)?Math.max(50,Math.round(options.pollMs)):100;
    const maxWaitMs=Number.isFinite(options.maxWaitMs)?Math.max(pollMs,Math.round(options.maxWaitMs)):15*60*1000;
    const sleep=typeof options.sleep==='function'?options.sleep:(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
    const started=Date.now();
    while(true){
      const result=await machine.resumeFromCaptcha(context);
      if(result?.stage!=='awaiting-captcha') return result;
      if(Date.now()-started>=maxWaitMs) return result;
      await sleep(pollMs);
    }
  }

  return{createBrowserRunHooks,resumePersistedStage,shouldRetryOpeningResult,sameBookingLocation,waitForManualCaptcha};
});


/* packages/core/src/session-schedule.js */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TicketHelper = Object.assign(root.TicketHelper || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function parseSessionTime(label) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(String(label || '').trim());
    if (!m) return null;
    const hour = Number(m[1]), minute = Number(m[2]);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
    return { hour, minute, total: hour * 60 + minute, label: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}` };
  }

  function dayKind(dateString) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateString));
    if (!m) throw new TypeError('targetDate must be YYYY-MM-DD');
    const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
    const dow = d.getUTCDay();
    return dow === 0 || dow === 6 ? 'weekend' : 'weekday';
  }

  function fromTemplate(source, template) {
    const times = Array.isArray(template?.times) ? template.times.slice() : [];
    return {
      source,
      times,
      sessions: times.map((label) => ({ label, available: null, template: true })),
      userPriority: Array.isArray(template?.userPriority) ? template.userPriority.slice() : [],
      mismatchPolicy: template?.mismatchPolicy || 'fall-back-to-hour-bands',
      template: template || null
    };
  }

  function resolveSessionSchedule(targetDate, liveSessions, templates = {}) {
    const dateTemplate = templates?.dates?.[targetDate];
    const kind = dayKind(targetDate);
    const applicableTemplate = dateTemplate || templates?.[kind] || templates?.manual || null;
    if (Array.isArray(liveSessions) && liveSessions.length) {
      return {
        source: 'live',
        times: liveSessions.map((s) => s.label),
        sessions: liveSessions,
        userPriority: Array.isArray(applicableTemplate?.userPriority) ? applicableTemplate.userPriority.slice() : [],
        mismatchPolicy: applicableTemplate?.mismatchPolicy || 'fall-back-to-hour-bands',
        template: applicableTemplate
      };
    }
    if (dateTemplate) return fromTemplate('date', dateTemplate);
    if (templates?.[kind]) return fromTemplate(kind, templates[kind]);
    if (templates?.manual) return fromTemplate('manual', templates.manual);
    return { source: 'none', times: [], sessions: [], userPriority: [], mismatchPolicy: 'fall-back-to-hour-bands', template: null };
  }

  function availableSessions(sessions) {
    return (Array.isArray(sessions) ? sessions : [])
      .map((session, index) => ({ ...session, __index: index, __parsed: parseSessionTime(session.label) }))
      .filter((session) => session.available === true && !session.disabled && session.__parsed);
  }

  function rankExactSessions(sessions, exactPriority, mismatchPolicy = 'exact-only') {
    const remaining = availableSessions(sessions);
    const result = [];
    const used = new Set();
    const priorities = Array.isArray(exactPriority) ? exactPriority.map(parseSessionTime).filter(Boolean) : [];

    for (const wanted of priorities) {
      let bestIndex = -1;
      let bestDistance = Infinity;
      for (let i = 0; i < remaining.length; i++) {
        const candidate = remaining[i];
        if (used.has(candidate.__index)) continue;
        if (candidate.__parsed.total === wanted.total) {
          bestIndex = i;
          bestDistance = 0;
          break;
        }
        if (mismatchPolicy === 'exact-then-nearest') {
          const distance = Math.abs(candidate.__parsed.total - wanted.total);
          if (distance < bestDistance || (distance === bestDistance && candidate.__index < remaining[bestIndex]?.__index)) {
            bestDistance = distance;
            bestIndex = i;
          }
        }
      }
      if (bestIndex >= 0 && (bestDistance === 0 || mismatchPolicy === 'exact-then-nearest')) {
        const chosen = remaining[bestIndex];
        used.add(chosen.__index);
        const { __index, __parsed, ...clean } = chosen;
        result.push(clean);
      }
    }
    return result;
  }

  return { parseSessionTime, dayKind, resolveSessionSchedule, rankExactSessions };
});


/* packages/core/src/time-priority.js */
(function (root, factory) {
  const deps = typeof module === 'object' && module.exports
    ? require('./session-schedule.js')
    : (root.TicketHelper || {});
  const api = factory(deps);
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TicketHelper = Object.assign(root.TicketHelper || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (deps) {
  'use strict';
  const parseSessionTime = deps.parseSessionTime;

  function normalize(sessions) {
    return (Array.isArray(sessions) ? sessions : []).map((session, index) => ({
      ...session,
      __index: index,
      __siteOrder: Number.isFinite(session.siteOrder) ? session.siteOrder : index,
      __parsed: parseSessionTime(session.label)
    })).filter((session) => session.available === true && !session.disabled && session.__parsed);
  }

  function comparator(pref) {
    if (pref.tieBreak === 'latest') return (a, b) => b.__parsed.minute - a.__parsed.minute || a.__siteOrder - b.__siteOrder;
    if (pref.tieBreak === 'earliest') return (a, b) => a.__parsed.minute - b.__parsed.minute || a.__siteOrder - b.__siteOrder;
    if (pref.tieBreak === 'closest') {
      const ref = Number.isInteger(pref.referenceMinute) ? pref.referenceMinute : 30;
      return (a, b) => Math.abs(a.__parsed.minute - ref) - Math.abs(b.__parsed.minute - ref)
        || a.__parsed.minute - b.__parsed.minute || a.__siteOrder - b.__siteOrder;
    }
    return (a, b) => a.__siteOrder - b.__siteOrder;
  }

  function clean(session) {
    const { __index, __siteOrder, __parsed, ...out } = session;
    return out;
  }

  function rankSessions(sessions, priorities, allowAny = false) {
    const normalized = normalize(sessions);
    const used = new Set();
    const ranked = [];
    for (const pref of Array.isArray(priorities) ? priorities : []) {
      if (!Number.isInteger(pref?.hour)) continue;
      const group = normalized
        .filter((s) => !used.has(s.__index) && s.__parsed.hour === pref.hour)
        .sort(comparator(pref));
      for (const session of group) {
        used.add(session.__index);
        ranked.push(clean(session));
      }
    }
    if (allowAny) {
      const rest = normalized.filter((s) => !used.has(s.__index)).sort((a, b) => a.__siteOrder - b.__siteOrder);
      ranked.push(...rest.map(clean));
    }
    return ranked;
  }

  return { rankSessions };
});


/* packages/core/src/fallback-engine.js */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TicketHelper = Object.assign(root.TicketHelper || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function profileMap(profiles) {
    return new Map((Array.isArray(profiles) ? profiles : []).filter((p) => p && typeof p.id === 'string').map((p) => [p.id, p]));
  }

  function nextThemeProfile(currentId, profiles, visited = new Set()) {
    const map = profileMap(profiles);
    const current = map.get(currentId);
    if (!current) return null;
    for (const id of Array.isArray(current.fallbackThemeIds) ? current.fallbackThemeIds : []) {
      if (visited.has(id)) continue;
      const next = map.get(id);
      if (next) return next;
    }
    return null;
  }

  function createFallbackCursor(profileId) {
    return { profileId, attemptIndex: 0, visitedProfileIds: new Set(profileId ? [profileId] : []), done: !profileId };
  }

  function advanceFallbackCursor(cursor, profiles) {
    if (!cursor || cursor.done) return { ...(cursor || {}), done: true };
    const visited = cursor.visitedProfileIds instanceof Set ? new Set(cursor.visitedProfileIds) : new Set(cursor.visitedProfileIds || []);
    const next = nextThemeProfile(cursor.profileId, profiles, visited);
    if (!next) return { ...cursor, visitedProfileIds: visited, done: true };
    visited.add(next.id);
    return { profileId: next.id, attemptIndex: 0, visitedProfileIds: visited, done: false };
  }

  function buildAttemptPlan(profile, sessions, ranker) {
    const ranked = typeof ranker === 'function' ? ranker(sessions, profile.timePriorities || [], !!profile.allowAnyFallback) : [];
    return ranked.map((session, attemptIndex) => ({ profileId: profile.id, attemptIndex, session }));
  }

  return { nextThemeProfile, createFallbackCursor, advanceFallbackCursor, buildAttemptPlan };
});


/* packages/core/src/logging.js */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TicketHelper = Object.assign(root.TicketHelper || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function createRunEvent(stage, detail = {}, now = Date.now) {
    return { atMs: Math.trunc(now()), stage, ...detail };
  }
  function serializeRunLog(events, format = 'text') {
    const safe = Array.isArray(events) ? events : [];
    if (format === 'json') return JSON.stringify(safe);
    return safe.map((event) => {
      const { atMs, stage, ...detail } = event;
      const suffix = Object.keys(detail).length ? ` ${JSON.stringify(detail)}` : '';
      return `${atMs} ${stage}${suffix}`;
    }).join('\n');
  }
  return { createRunEvent, serializeRunLog };
});


/* packages/core/src/diagnostics.js */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TicketHelper = Object.assign(root.TicketHelper || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function diagnostic(stage, message, detail = {}) {
    return { stage: stage || 'unknown', message: message || stage || 'unknown', ...detail };
  }
  function fromAction(result, fallbackStage = 'unknown') {
    if (!result || result.ok !== false) return null;
    return diagnostic(result.stage || fallbackStage, result.message, result);
  }
  return { diagnostic, diagnosticFromAction: fromAction };
});


/* packages/core/src/run-resume.js */
(function (root, factory) {
  const api=factory(); if(typeof module==='object'&&module.exports) module.exports=api;
  root.TicketHelper=Object.assign(root.TicketHelper||{},api);
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const NON_RESUMABLE=new Set(['completed','failed']);
  const REWIND={advancing:'selecting-session','ready-to-confirm':'awaiting-captcha'};
  function normalizeCursor(cursor){
    if(!cursor) return undefined;
    return {...cursor,visitedProfileIds:cursor.visitedProfileIds instanceof Set?[...cursor.visitedProfileIds]:(Array.isArray(cursor.visitedProfileIds)?cursor.visitedProfileIds.slice():[])};
  }
  function createPersistedCheckpoint({profileId,stage='idle',targetDate,mode='practice',fallbackCursor,now=Date.now,extra={}}={}){
    return {version:1,profileId,stage,targetDate,mode,fallbackCursor:normalizeCursor(fallbackCursor),updatedAtMs:Math.trunc(now()),...extra};
  }
  function restoreRun(checkpoint,{profileId,now=Date.now,maxAgeMs=12*60*60*1000}={}){
    if(!checkpoint||checkpoint.version!==1) return {ok:false,reason:'invalid-checkpoint'};
    if(checkpoint.profileId!==profileId) return {ok:false,reason:'profile-mismatch'};
    if(NON_RESUMABLE.has(checkpoint.stage)) return {ok:false,reason:'terminal-stage'};
    if(Number.isFinite(checkpoint.updatedAtMs)&&Number.isFinite(maxAgeMs)&&Math.trunc(now())-checkpoint.updatedAtMs>maxAgeMs) return {ok:false,reason:'stale-checkpoint'};
    const resumeStage=REWIND[checkpoint.stage]||checkpoint.stage;
    return {ok:true,resumeStage,reason:REWIND[checkpoint.stage]?'rewind-consequential-stage':'resume',checkpoint:{...checkpoint,fallbackCursor:normalizeCursor(checkpoint.fallbackCursor)}};
  }
  return {createPersistedCheckpoint,restoreRun};
});


/* packages/core/src/run-machine.js */
(function (root, factory) {
  const deps = typeof module === 'object' && module.exports ? {
    ...require('./session-schedule.js'),
    ...require('./time-priority.js'),
    ...require('./fallback-engine.js'),
    ...require('./logging.js'),
    ...require('./diagnostics.js')
  } : (root.TicketHelper || {});
  const api = factory(deps);
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TicketHelper = Object.assign(root.TicketHelper || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (deps) {
  'use strict';

  class TicketRunMachine {
    constructor({ profiles = [], adapterResolver, now = Date.now, onScheduleObserved, onBeforeAdvance, onBeforeConfirm, deferScheduleObservation = false } = {}) {
      this.profiles = profiles;
      this.adapterResolver = adapterResolver;
      this.now = now;
      this.onScheduleObserved = onScheduleObserved;
      this.deferScheduleObservation = deferScheduleObservation;
      this.onBeforeAdvance = onBeforeAdvance;
      this.onBeforeConfirm = onBeforeConfirm;
      this.events = [];
    }

    emit(stage, detail = {}) {
      const event = deps.createRunEvent(stage, detail, this.now);
      this.events.push(event);
      return event;
    }

    finish(payload) {
      return { events: this.events.slice(), ...payload };
    }

    fail(stage, message, detail = {}) {
      this.emit('failed', { diagnosticStage: stage, message });
      return this.finish({ stage: 'failed', diagnostic: deps.diagnostic(stage, message, detail) });
    }

    profileById(id) {
      return this.profiles.find((p) => p.id === id) || null;
    }

    rankedCandidates(profile, liveSessions, targetDate) {
      const schedule = deps.resolveSessionSchedule(targetDate, liveSessions, profile.sessionTemplates || {});
      const exact = deps.rankExactSessions(schedule.sessions, schedule.userPriority, schedule.mismatchPolicy);
      const exactKeys = new Set(exact.map((s) => `${s.label}|${s.siteOrder ?? ''}`));
      const remaining = schedule.sessions.filter((s) => !exactKeys.has(`${s.label}|${s.siteOrder ?? ''}`));
      const byHour = deps.rankSessions(remaining, profile.timePriorities || [], !!profile.allowAnyFallback);
      return { schedule, candidates: [...exact, ...byHour] };
    }



    adapterFor(profileId) {
      const profile = this.profileById(profileId);
      if (!profile) return { profile: null, adapter: null };
      const adapter = typeof this.adapterResolver === 'function' ? this.adapterResolver(profile) : null;
      return { profile, adapter };
    }

    async resumeFromCaptcha({ profileId, targetDate, mode = 'practice', session, fallbackCursor, resetEvents = true } = {}) {
      if (resetEvents) this.events = [];
      const { profile, adapter } = this.adapterFor(profileId);
      if (!profile) return this.fail('unknown', `profile not found: ${profileId}`);
      if (!adapter) return this.fail('adapter-unsupported', `adapter unavailable: ${profile.adapterId}`);
      try {
        this.emit('awaiting-captcha', { profileId });
        const captcha = await adapter.captchaState();
        if (captcha !== 'complete') return this.finish({ stage: 'awaiting-captcha', profileId, session: session?.label || session, fallbackCursor });
        this.emit('ready-to-confirm', { profileId, session: session?.label || session, mode });
        if (mode === 'practice') return this.finish({ stage: 'ready-to-confirm', profileId, session: session?.label || session, stoppedForPractice: true, fallbackCursor });
        if(adapter.requiresManualConfirmation===true)return this.finish({stage:'ready-to-confirm',profileId,session:session?.label||session,requiresManualConfirmation:true,fallbackCursor});
        if (typeof this.onBeforeConfirm === 'function') await this.onBeforeConfirm({ profileId, targetDate, mode, session, fallbackCursor });
        const continued = await adapter.continueAfterCaptcha(mode);
        if (!continued?.ok) return this.fail(continued?.stage || 'confirmation-blocked', continued?.message || 'confirmation could not continue', continued || {});
        if (continued.requiresExternalConfirmation) {
          this.emit('payment-submitted', { profileId, session: session?.label || session, amount: continued.amount });
          return this.finish({ stage: 'payment-submitted', profileId, session: session?.label || session, fallbackCursor, amount: continued.amount, paymentSubmitted: true });
        }
        this.emit('completed', { profileId, session: session?.label || session });
        return this.finish({ stage: 'completed', profileId, session: session?.label || session, fallbackCursor });
      } catch (error) {
        const stage = error && typeof error === 'object' && error.stage ? error.stage : 'site-error';
        return this.fail(stage, error instanceof Error ? error.message : String(error));
      }
    }

    async resumeAfterAdvance({ profileId, targetDate, mode = 'practice', userProfile = {}, session, fallbackCursor, resetEvents = true } = {}) {
      if (resetEvents) this.events = [];
      const { profile, adapter } = this.adapterFor(profileId);
      if (!profile) return this.fail('unknown', `profile not found: ${profileId}`);
      if (!adapter) return this.fail('adapter-unsupported', `adapter unavailable: ${profile.adapterId}`);
      try {
        this.emit('filling-form', { profileId });
        const filled = await adapter.fillUserInfo(userProfile);
        if (!filled?.ok) return this.fail(filled?.stage || 'form-field-missing', filled?.message || 'failed to fill user information');
        const agreed = await adapter.applyAgreements();
        if (!agreed?.ok) return this.fail(agreed?.stage || 'agreement-missing', agreed?.message || 'failed to apply agreements');
        return await this.resumeFromCaptcha({ profileId, targetDate, mode, session, fallbackCursor, resetEvents: false });
      } catch (error) {
        const stage = error && typeof error === 'object' && error.stage ? error.stage : 'site-error';
        return this.fail(stage, error instanceof Error ? error.message : String(error));
      }
    }

    fallbackResult(profile, fallbackCursor) {
      const cursor = fallbackCursor && fallbackCursor.profileId === profile.id
        ? fallbackCursor
        : deps.createFallbackCursor(profile.id);
      const nextCursor = deps.advanceFallbackCursor(cursor, this.profiles);
      if (!nextCursor || nextCursor.done || !nextCursor.profileId || nextCursor.profileId === profile.id) return null;
      const next = this.profileById(nextCursor.profileId);
      if (!next) return null;
      this.emit('fallback', { fromProfileId: profile.id, toProfileId: next.id });
      return this.finish({ stage: 'fallback', nextProfileId: next.id, nextUrl: next.bookingUrl, fallbackCursor: nextCursor });
    }

    async run({ profileId, targetDate, mode = 'practice', userProfile = {}, fallbackCursor } = {}) {
      this.events = [];
      const profile = this.profileById(profileId);
      if (!profile) return this.fail('unknown', `profile not found: ${profileId}`);
      const adapter = typeof this.adapterResolver === 'function' ? this.adapterResolver(profile) : null;
      if (!adapter) return this.fail('adapter-unsupported', `adapter unavailable: ${profile.adapterId}`);

      try {
        if (typeof adapter.selectTheme === 'function') {
          this.emit('selecting-theme', { profileId, themeName: profile.themeName });
          const themeResult = await adapter.selectTheme(profile.themeName);
          if (!themeResult?.ok) return this.fail(themeResult?.stage || 'theme-missing', themeResult?.message || 'theme could not be selected');
        }
        this.emit('selecting-date', { profileId, targetDate });
        const dateResult = await adapter.selectTargetDate(targetDate);
        if (!dateResult?.ok) return this.fail(dateResult?.stage || 'date-missing', dateResult?.message || 'target date could not be selected');

        const sessions = await adapter.readSessions();
        if (typeof this.onScheduleObserved === 'function' && Array.isArray(sessions) && sessions.length) {
          try {
            const saving=this.onScheduleObserved({ profileId, targetDate, sessions: sessions.slice() });
            if(this.deferScheduleObservation)Promise.resolve(saving).catch(error=>this.emit('schedule-observation-failed',{profileId,message:String(error?.message||error)}));
            else await saving;
          }
          catch (error) { this.emit('schedule-observation-failed', { profileId, message: error instanceof Error ? error.message : String(error) }); }
        }
        const { schedule, candidates } = this.rankedCandidates(profile, sessions, targetDate);
        this.emit('selecting-session', { profileId, source: schedule.source, candidateCount: candidates.length });
        if (!candidates.length) return this.fallbackResult(profile, fallbackCursor) || this.fail('session-unavailable', 'no available session matched the configured priorities');

        for (const session of candidates) {
          this.emit('selecting-session', { profileId, session: session.label });
          const selected = await adapter.chooseSession(session);
          if (!selected?.ok) {
            this.emit('session-attempt-failed', { session: session.label, diagnosticStage: selected?.stage || 'session-unavailable' });
            continue;
          }

          this.emit('advancing', { profileId, session: session.label });
          if (typeof this.onBeforeAdvance === 'function') await this.onBeforeAdvance({ profileId, targetDate, mode, session, fallbackCursor });
          const advanced = await adapter.goNext();
          if (!advanced?.ok) {
            this.emit('session-attempt-failed', { session: session.label, diagnosticStage: advanced?.stage || 'navigation-failed' });
            continue;
          }
          if(advanced.navigationPending===true)return this.finish({stage:'filling-form',profileId,session:session.label,navigationPending:true,fallbackCursor});

          return await this.resumeAfterAdvance({ profileId, targetDate, mode, userProfile, session, fallbackCursor, resetEvents: false });
        }

        return this.fallbackResult(profile, fallbackCursor) || this.fail('session-unavailable', 'all candidate sessions failed');
      } catch (error) {
        const stage = error && typeof error === 'object' && error.stage ? error.stage : 'site-error';
        return this.fail(stage, error instanceof Error ? error.message : String(error));
      }
    }
  }

  return { TicketRunMachine, serializeRunLog: deps.serializeRunLog };
});


/* packages/adapters/src/registry.js */
(function (root, factory) {
  const api = factory(root.TicketHelper || {});
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TicketHelper = Object.assign(root.TicketHelper || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function adapterIdForUrl(url) {
    let parsed;try{parsed=new URL(String(url||''));}catch{return null;}
    if(!['https:','http:'].includes(parsed.protocol))return null;
    const host=parsed.hostname.toLowerCase();
    if(['keyescape.com','www.keyescape.com'].includes(host))return 'keyescape';
    if(['booking.naver.com','m.booking.naver.com'].includes(host))return 'naver-booking';
    if(['rabbitholeescape.co.kr','www.rabbitholeescape.co.kr','play33.kr','www.play33.kr','xn--2e0b040a4xj.com','www.xn--2e0b040a4xj.com'].includes(host))return 'tonybilly';
    if(host==='zeroworldkorea.com'||host==='www.zeroworldkorea.com')return 'zeroworld';
    if(host==='doomescape.com'||host==='www.doomescape.com')return 'doom';
    if(['xdungeon.net','www.xdungeon.net'].includes(host))return 'beatphobia';
    if(['nextedition.co.kr','www.nextedition.co.kr','page-today.co.kr','www.page-today.co.kr','nabijam.com','www.nabijam.com'].includes(host))return 'manual';
    return null;
  }
  return { adapterIdForUrl };
});


/* packages/adapters/src/keyescape/parser.js */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TicketHelper = Object.assign(root.TicketHelper || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function parseRgb(value) {
    const m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(String(value || ''));
    return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
  }

  function classifySessionDescriptor(input) {
    const descriptor = { ...input };
    let available = true;
    if (descriptor.disabled || descriptor.ariaDisabled === true || descriptor.ariaDisabled === 'true') available = false;
    if (descriptor.pointerEvents === 'none') available = false;
    if (Number.isFinite(Number(descriptor.opacity)) && Number(descriptor.opacity) < 0.55) available = false;

    const bg = parseRgb(descriptor.backgroundColor);
    const fg = parseRgb(descriptor.color);
    if (available && bg && fg) {
      const spread = Math.max(...bg) - Math.min(...bg);
      const bgAvg = bg.reduce((a, b) => a + b, 0) / 3;
      const fgAvg = fg.reduce((a, b) => a + b, 0) / 3;
      if (spread < 14 && bgAvg >= 215 && bgAvg < 250 && fgAvg > 115) available = false;
    }
    return { ...descriptor, available };
  }

  function parseSessionDescriptors(descriptors) {
    return (Array.isArray(descriptors) ? descriptors : [])
      .filter((d) => /^\d{1,2}:\d{2}$/.test(String(d.label || '').trim()))
      .map((d, index) => classifySessionDescriptor({ siteOrder: index, ...d }));
  }

  return { parseRgb, classifySessionDescriptor, parseSessionDescriptors };
});


/* packages/adapters/src/keyescape/selectors.js */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TicketHelper = Object.assign(root.TicketHelper || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  return {
    KEYESCAPE_SELECTORS: Object.freeze({
      broadText: 'button,a,[role="button"],div,span,p,strong,b,td,label',
      actions: 'button,a,[role="button"],input[type="submit"]',
      inputs: 'input',
      captcha: 'textarea[name="g-recaptcha-response"], #g-recaptcha-response'
    })
  };
});


/* packages/adapters/src/keyescape/adapter.js */
(function (root, factory) {
  const deps = typeof module === 'object' && module.exports
    ? { ...require('./parser.js'), ...require('./selectors.js') }
    : (root.TicketHelper || {});
  const api = factory(deps);
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TicketHelper = Object.assign(root.TicketHelper || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (deps) {
  'use strict';

  function resultOk(data = {}) { return { ok: true, ...data }; }
  function resultFail(stage, message, data = {}) { return { ok: false, stage, message, ...data }; }
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function parseTargetDate(value) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''));
    if (!m) return null;
    return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
  }

  function createKeyescapeAdapter({ page, profile = {} }) {
    if (!page) throw new TypeError('page is required');
    return {
      id: 'keyescape',

      async selectTheme(themeName) {
        if (!themeName) return resultFail('theme-missing', 'theme name is required');
        if(profile.trustCurrentPageTheme===true)return resultOk({themeName,selectedByCurrentPage:true});
        if(profile.themeBookingUrl&&typeof page.currentHref==='function'){
          try{
            const expected=new URL(profile.themeBookingUrl,'https://www.keyescape.com');
            const current=new URL(page.currentHref(),'https://www.keyescape.com');
            const keys=['zizum_num','theme_num','theme_info_num'];
            if(keys.every(key=>!expected.searchParams.get(key)||expected.searchParams.get(key)===current.searchParams.get(key))){
              return resultOk({themeName,selectedByUrl:true});
            }
          }catch{}
        }
        if (typeof page.selectThemeByName !== 'function') return resultFail('theme-missing', 'theme selector is unavailable');
        const ok = await page.selectThemeByName(themeName, profile.branchName, profile.branchId);
        return ok ? resultOk({ themeName }) : resultFail('theme-missing', `theme could not be selected: ${themeName}`);
      },

      async selectTargetDate(targetDate) {
        if(profile.trustCurrentPageDate===true)return resultOk({targetDate,selectedByCurrentPage:true});
        const target = parseTargetDate(targetDate);
        if (!target) return resultFail('date-missing', 'target date must be YYYY-MM-DD');
        if (!page.getMonth() && typeof page.ensureCalendarVisible === 'function') {
          const restored = await page.ensureCalendarVisible();
          if (!restored) return resultFail('date-missing', 'calendar could not be restored from session view');
        }
        for (let i = 0; i < 24; i++) {
          const current = page.getMonth();
          if (!current) return resultFail('date-missing', 'calendar month header not found');
          const currentIndex = current.year * 12 + current.month;
          const targetIndex = target.year * 12 + target.month;
          if (currentIndex === targetIndex) break;
          const dir = targetIndex > currentIndex ? 1 : -1;
          if (!(await page.clickMonthArrow(dir))) return resultFail('date-missing', 'calendar month arrow not found');
        }
        const current = page.getMonth();
        if (!current || current.year !== target.year || current.month !== target.month) {
          return resultFail('date-missing', 'target month could not be reached');
        }
        const day = page.findDay(target.day);
        if (!day) return resultFail('date-missing', 'target date not found');
        if (day.enabled === false) return resultFail('date-disabled', 'target date is not enabled');
        const targets=Array.isArray(day.elements)&&day.elements.length?day.elements:[day.element||day];
        if(typeof page.listSessionDescriptors==='function'){
          const budget=profile.openingAttempt===true?Math.max(70,Math.min(420,Number(profile.openingWaitMs)||420)):3200;
          const deadline=Date.now()+budget;
          for(let index=0;index<targets.length&&Date.now()<deadline;index++){
            page.clickElement(targets[index]);
            const attemptUntil=Math.min(deadline,Date.now()+(index===targets.length-1?budget:Math.min(650,Math.ceil(budget/targets.length))));
            while(Date.now()<attemptUntil){
              let descriptors=[];
              try{descriptors=page.listSessionDescriptors()||[];}catch{}
              const sessions=deps.parseSessionDescriptors(descriptors);
              if(Array.isArray(sessions)&&sessions.length)return resultOk({sessionsLoaded:true,dayClickAttempt:index+1});
              await sleep(35);
            }
          }
          return resultFail('sessions-not-loaded','target date click did not open session buttons');
        }
        page.clickElement(targets[0]);
        return resultOk();
      },

      async readSessions() {
        return deps.parseSessionDescriptors(page.listSessionDescriptors());
      },

      async chooseSession(session) {
        const sessions = deps.parseSessionDescriptors(page.listSessionDescriptors());
        const matches = sessions.filter((s) => s.label === session.label);
        if (matches.length === 0) return resultFail('session-unavailable', `session not found: ${session.label}`);
        if (matches.length > 1) return resultFail('session-ambiguous', `multiple session buttons found: ${session.label}`);
        if (!matches[0].available) return resultFail('session-unavailable', `session unavailable: ${session.label}`);
        page.clickElement(matches[0].element || matches[0]);
        return resultOk({ session: matches[0] });
      },

      async goNext() {
        const actions = page.findExactActions('NEXT');
        if (!actions.length) return resultFail('next-button-missing', 'NEXT button not found');
        if (actions.length > 1) return resultFail('next-button-ambiguous', 'multiple NEXT buttons found');
        const before = page.currentHref();
        page.clickElement(actions[0]);
        const navigated = await page.waitForNavigation(before);
        return navigated ? resultOk() : resultFail('navigation-failed', 'NEXT did not navigate');
      },

      async fillUserInfo(userProfile) {
        const inputs = page.getInputs();
        const name = inputs.find((input) => input.role === 'name');
        const phone2 = inputs.find((input) => input.role === 'phone2');
        const phone3 = inputs.find((input) => input.role === 'phone3');
        const digits = String(userProfile?.phone || '').replace(/\D/g, '');
        const tail = digits.startsWith('010') ? digits.slice(3) : digits.slice(-8);
        if (!name || !phone2 || !phone3 || !userProfile?.name || tail.length !== 8) {
          return resultFail('form-field-missing', 'reservation name/phone fields are incomplete');
        }
        name.setValue(String(userProfile.name));
        phone2.setValue(tail.slice(0, 4));
        phone3.setValue(tail.slice(4, 8));
        if (userProfile?.participants && !await page.selectParticipants?.(userProfile.participants)) {
          return resultFail('participants-missing', '설정한 참여 인원을 선택하지 못했습니다. 직접 확인해 주세요.');
        }
        return resultOk();
      },

      async applyAgreements() {
        const agreement = page.findAgreement();
        if (!agreement) return resultFail('agreement-missing', '전체동의 control not found');
        const alreadyChecked=agreement.checked===true||agreement.element?.checked===true;
        if(!alreadyChecked)page.clickElement(agreement.element || agreement);
        if(page.excludeMarketingConsent?.()===false)return resultFail('agreement-missing','마케팅 수신 동의를 해제하지 못했습니다. 직접 확인해 주세요.');
        return resultOk({alreadyChecked});
      },

      async captchaState() {
        const response = String(page.captchaResponse() || '').trim();
        return response.length > 10 ? 'complete' : 'pending';
      },

      async continueAfterCaptcha(mode) {
        if (mode === 'practice') return resultFail('confirmation-blocked', 'practice mode never confirms reservation');
        if ((await this.captchaState()) !== 'complete') return resultFail('captcha-pending', 'CAPTCHA must be completed manually');
        const actions = page.findExactActions('예약하기');
        if (!actions.length) return resultFail('confirmation-blocked', '예약하기 button not found');
        if (actions.length > 1) return resultFail('confirmation-blocked', 'multiple 예약하기 buttons found');
        page.clickElement(actions[0]);
        return resultOk();
      }
    };
  }

  function createBrowserKeyescapePage(doc = document, win = window, options = {}) {
    const selectors = deps.KEYESCAPE_SELECTORS;
    const textOf = (el) => String(el?.innerText ?? el?.textContent ?? '').replace(/\s+/g, ' ').trim();
    const visible = (el) => {
      if (!el || typeof el.getBoundingClientRect !== 'function') return false;
      const r = el.getBoundingClientRect();
      const s = win.getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
    };
    const unique = (nodes) => [...new Set(nodes)];

    function monthInfo() {
      const nodes = [...doc.querySelectorAll('div,span,p,strong,b')].filter(visible);
      const matches = nodes.map((el) => {
        const m = /^(\d{4})년\s*(\d{1,2})월$/.exec(textOf(el));
        if (!m) return null;
        const r = el.getBoundingClientRect();
        return { element: el, year: Number(m[1]), month: Number(m[2]), area: r.width * r.height };
      }).filter(Boolean).sort((a, b) => a.area - b.area);
      return matches[0] || null;
    }

    function calendarBox(header) {
      let p = header;
      for (let i = 0; i < 8 && p; i++, p = p.parentElement) {
        const count = [...p.querySelectorAll('div,span,td,a,button')].filter((el) => /^(?:[1-9]|[12]\d|3[01])$/.test(textOf(el))).length;
        if (count >= 15) return p;
      }
      return header?.parentElement || doc;
    }

    function setValue(input, value) {
      const proto = Object.getPrototypeOf(input);
      const desc = Object.getOwnPropertyDescriptor(proto, 'value');
      if (desc?.set) desc.set.call(input, value); else input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function normalized(value){return String(value||'').normalize('NFKC').toLowerCase().replace(/[^0-9a-z가-힣]+/g,'');}

    return {
      async selectThemeByName(themeName, branchName, branchId) {
        const target=normalized(themeName); if(!target)return false;
        const optionMatches=(optionTarget,candidate)=>{
          const value=normalized(candidate);
          if(!value)return false;
          if(value===optionTarget)return true;
          return optionTarget.length>=4&&(value.includes(optionTarget)||optionTarget.includes(value));
        };
        const findThemeOption=()=>{
          let partial=null;
          for(const sel of [...doc.querySelectorAll('select')]){
            const options=[...(sel.options||[])];
            for(const option of options){
              const value=normalized(textOf(option));
              if(value===target)return {sel,option,options,exact:true};
              if(!partial&&optionMatches(target,value))partial={sel,option,options,exact:false};
            }
          }
          return partial;
        };
        const selectedThemeMatches=()=>{
          const found=findThemeOption();
          if(!found)return false;
          const options=[...(found.sel.options||[])];
          const current=found.sel.selectedOptions?.[0]||options[found.sel.selectedIndex];
          return !!current&&optionMatches(target,textOf(current));
        };
        const triggerJqueryChange=(sel,value)=>{
          try{
            const jq=win?.jQuery||win?.$;
            if(typeof jq!=='function')return false;
            const wrapped=jq(sel);
            if(!wrapped?.val||!wrapped?.trigger)return false;
            wrapped.val(value).trigger('change');
            return true;
          }catch{return false;}
        };
        const waitForThemeOption=async (waitMs)=>{
          const until=Date.now()+Math.max(0,Number(waitMs)||0);
          let found=findThemeOption();
          while(!found&&Date.now()<until){
            await sleep(50);
            found=findThemeOption();
          }
          return found;
        };

        let found=findThemeOption();
        if(!found){
          const branchTarget=normalized(branchName);
          const branchValue=String(branchId||'');
          const selects=[...doc.querySelectorAll('select')];
          const branchSelect=selects.find(sel=>{
            const options=[...(sel.options||[])];
            return options.some(o=>
              (branchTarget&&normalized(textOf(o))===branchTarget) ||
              (branchValue&&String(o.value||'')===branchValue)
            );
          });
          if(branchSelect){
            const options=[...(branchSelect.options||[])];
            const option=options.find(o=>
              (branchTarget&&normalized(textOf(o))===branchTarget) ||
              (branchValue&&String(o.value||'')===branchValue)
            );
            if(option){
              setValue(branchSelect,option.value);
              found=await waitForThemeOption(1600);
              if(!found&&triggerJqueryChange(branchSelect,option.value)){
                found=await waitForThemeOption(3400);
              }
            }
          }
        }
        if(!found)return false;
        if(selectedThemeMatches())return true;

        setValue(found.sel,found.option.value);
        for(let i=0;i<25;i++){
          await sleep(40);
          if(selectedThemeMatches())return true;
        }

        const refreshed=findThemeOption();
        if(refreshed&&triggerJqueryChange(refreshed.sel,refreshed.option.value)){
          for(let i=0;i<50;i++){
            await sleep(40);
            if(selectedThemeMatches())return true;
          }
        }
        return false;
      },
      getMonth() {
        const info = monthInfo();
        return info ? { year: info.year, month: info.month } : null;
      },
      async ensureCalendarVisible() {
        if (monthInfo()) return true;
        const waitForCalendar = async (el) => {
          if (!el) return false;
          try { el.click?.(); } catch {}
          for (let i = 0; i < 60; i++) {
            await sleep(40);
            if (monthInfo()) return true;
          }
          return false;
        };
        const arrows = ['←','‹','＜','◀','◁','❮'];
        const labelOf = (el) => [
          textOf(el),
          el?.getAttribute?.('aria-label') || '',
          el?.getAttribute?.('title') || '',
          el?.getAttribute?.('alt') || '',
          String(el?.className || '')
        ].join(' ');
        const direct = unique([...doc.querySelectorAll('button,a,[role="button"],[onclick],span,div,img')]
          .filter(visible)
          .map((node) => node.closest?.('button,a,[role="button"],[onclick]') || node)
          .filter((el) => arrows.includes(textOf(el)) || /뒤로|이전|back|prev/i.test(labelOf(el))));
        for (const el of direct) if (await waitForCalendar(el)) return true;

        // KEYESCAPE's time view sometimes renders the back arrow as an image/CSS
        // control without useful text. Find the small clickable control immediately
        // to the left of the visible "시간" heading.
        const timeHeaders = [...doc.querySelectorAll('div,span,p,strong,b,h1,h2,h3')]
          .filter(visible)
          .filter((el) => textOf(el) === '시간');
        for (const header of timeHeaders) {
          const hr = header.getBoundingClientRect();
          let box = header.parentElement;
          for (let depth = 0; depth < 5 && box; depth++, box = box.parentElement) {
            const nearby = unique([...box.querySelectorAll('button,a,[role="button"],[onclick],img,span,div')]
              .filter(visible)
              .map((node) => node.closest?.('button,a,[role="button"],[onclick]') || node)
              .filter((el) => {
                if (el === header || textOf(el) === '시간') return false;
                const r = el.getBoundingClientRect();
                if (r.width < 8 || r.height < 8 || r.width > 120 || r.height > 120) return false;
                const cy = r.top + r.height / 2;
                const hy = hr.top + hr.height / 2;
                return Math.abs(cy - hy) <= 70 && r.right <= hr.left + 12;
              })
              .map((el) => ({ el, r: el.getBoundingClientRect() }))
              .sort((a,b) => Math.abs(a.r.right - hr.left) - Math.abs(b.r.right - hr.left)));
            for (const item of nearby.slice(0,4)) if (await waitForCalendar(item.el)) return true;
          }
        }
        return false;
      },
      async clickMonthArrow(dir) {
        const info = monthInfo();
        if (!info) return false;
        const box = calendarBox(info.element);
        const hr = info.element.getBoundingClientRect();
        const candidates = [];
        for (const node of box.querySelectorAll('button,a,[role="button"],img,span,div')) {
          if (!visible(node)) continue;
          const el = node.closest?.('button,a,[role="button"]') || node;
          const r = el.getBoundingClientRect();
          const cy = r.top + r.height / 2, hy = hr.top + hr.height / 2;
          if (Math.abs(cy - hy) > 65 || r.width > 90 || r.height > 90) continue;
          if (dir > 0 && r.left <= hr.right) continue;
          if (dir < 0 && r.right >= hr.left) continue;
          candidates.push({ el, d: dir > 0 ? r.left - hr.right : hr.left - r.right });
        }
        candidates.sort((a, b) => a.d - b.d);
        if (!candidates[0]) return false;
        candidates[0].el.click();
        const old = `${info.year}-${info.month}`;
        for (let i = 0; i < 30; i++) {
          await sleep(30);
          const next = monthInfo();
          if (next && `${next.year}-${next.month}` !== old) return true;
        }
        return true;
      },
      findDay(day) {
        const info = monthInfo();
        if (!info) return null;
        const box = calendarBox(info.element);
        const raw = unique([...box.querySelectorAll('button,a,[role="button"],td,div,span')]
          .filter(visible).filter((el) => textOf(el) === String(day)));
        if (!raw.length) return null;
        const candidates=[];
        const push=(el,priority)=>{
          if(!el||!visible(el)||candidates.some(x=>x.el===el))return;
          const style=win.getComputedStyle(el);
          const disabled=!!el.disabled||el.getAttribute?.('aria-disabled')==='true'||style.pointerEvents==='none';
          const tag=String(el.tagName||'').toLowerCase();
          const interactive=/^(button|a)$/.test(tag)||el.getAttribute?.('role')==='button'||el.hasAttribute?.('onclick')||typeof el.onclick==='function';
          candidates.push({el,priority:priority+(interactive?100:0)+(style.cursor==='pointer'?20:0)-(tag==='td'&&!interactive?20:0),disabled});
        };
        for(const node of raw){
          push(node.closest?.('button,a,[role="button"],[onclick]'),40);
          push(node,30);
          push(node.closest?.('td'),10);
        }
        candidates.sort((a,b)=>b.priority-a.priority);
        const enabledCandidates=candidates.filter(x=>!x.disabled);
        const elements=(enabledCandidates.length?enabledCandidates:candidates).map(x=>x.el);
        if(!elements.length)return null;
        const el=elements[0];
        return { element:el, elements, id:el.id, text:String(day), enabled:enabledCandidates.length>0 };
      },
      clickElement(el) {
        if(!el)return false;
        try{el.scrollIntoView?.({block:'center',inline:'center',behavior:'instant'});}catch{}
        try{el.click?.();return true;}catch{return false;}
      },
      listSessionDescriptors() {
        const seen = new Set(), out = [];
        for (const node of doc.querySelectorAll('button,a,[role="button"],div,span')) {
          if (!visible(node) || !/^\d{1,2}:\d{2}$/.test(textOf(node))) continue;
          const el = node.closest?.('button,a,[role="button"]') || node;
          if (seen.has(el)) continue;
          seen.add(el);
          const style = win.getComputedStyle(el);
          out.push({
            element: el, id: el.id || '', label: textOf(node), disabled: !!el.disabled,
            ariaDisabled: el.getAttribute?.('aria-disabled') || false,
            pointerEvents: style.pointerEvents, opacity: Number(style.opacity),
            backgroundColor: style.backgroundColor, color: style.color, siteOrder: out.length
          });
        }
        return out;
      },
      findExactActions(label) {
        return unique([...doc.querySelectorAll(selectors.actions)].filter(visible).filter((el) => (textOf(el) || el.value || '') === label));
      },
      currentHref() { return win.location.href; },
      async waitForNavigation(before) {
        for (let i = 0; i < 28; i++) {
          await sleep(25);
          if (win.location.href !== before || win.location.pathname.includes('reservation2.php')) return true;
        }
        return false;
      },
      selectParticipants: count => deps.selectParticipantCount(doc, win, count, { isCancelled: options.isCancelled }),
      getInputs() {
        const all = [...doc.querySelectorAll(selectors.inputs)];
        const name = all.find((el) => /성명|예약자|이름/.test(el.placeholder || ''));
        const phoneFields = all.filter((el) => (el.placeholder || '') === '0000' || Number(el.maxLength) === 4).slice(0, 2);
        return [
          name && { role: 'name', element: name, setValue: (v) => setValue(name, v) },
          phoneFields[0] && { role: 'phone2', element: phoneFields[0], setValue: (v) => setValue(phoneFields[0], v) },
          phoneFields[1] && { role: 'phone3', element: phoneFields[1], setValue: (v) => setValue(phoneFields[1], v) }
        ].filter(Boolean);
      },
      excludeMarketingConsent:()=>deps.clearMarketingConsent(doc,win,options),
      findAgreement() {
        const matches = [...doc.querySelectorAll('label,span,div,p')].filter(visible).filter((el) => textOf(el) === '전체동의');
        if (!matches.length) return null;
        matches.sort((a, b) => {
          const ar = a.getBoundingClientRect(), br = b.getBoundingClientRect();
          return ar.width * ar.height - br.width * br.height;
        });
        const element=matches[0].closest?.('label')||matches[0];
        const checkbox=element.control||element.querySelector?.('input[type="checkbox"]')||doc.getElementById(element.getAttribute?.('for')||'');
        return { element:checkbox||element,checked:checkbox?.checked===true||element.getAttribute?.('aria-checked')==='true',text:'전체동의' };
      },
      captchaResponse() { return doc.querySelector(selectors.captcha)?.value || ''; }
    };
  }

  return { createKeyescapeAdapter, createBrowserKeyescapePage };
});


/* packages/adapters/src/naver-booking/parser.js */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TicketHelper = Object.assign(root.TicketHelper || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  function parseNaverClock(value) {
    const raw = String(value || '').replace(/\s+/g, ' ').trim();
    let m = /^(오전|오후)\s*(\d{1,2}):(\d{2})$/.exec(raw);
    let hour, minute;
    if (m) {
      hour = Number(m[2]); minute = Number(m[3]);
      if (m[1] === '오후' && hour !== 12) hour += 12;
      if (m[1] === '오전' && hour === 12) hour = 0;
    } else {
      m = /^(\d{1,2}):(\d{2})$/.exec(raw);
      if (!m) return null;
      hour = Number(m[1]); minute = Number(m[2]);
    }
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
    return { hour, minute, total: hour * 60 + minute, label: `${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`, rawLabel: raw };
  }
  function parseNaverSessionDescriptors(descriptors) {
    const out=[];
    for (let i=0;i<(descriptors||[]).length;i++) {
      const d=descriptors[i];
      const parsed=parseNaverClock(d.label);
      if (!parsed) continue;
      const hardDisabled=!!d.disabled || !!d.soldOut || d.ariaDisabled===true || d.ariaDisabled==='true' || /disabled|is_disabled|unselectable|sold[_-]?out/i.test(String(d.className||''));
      out.push({...d,...parsed,siteOrder:Number.isFinite(d.siteOrder)?d.siteOrder:i,available:!hardDisabled});
    }
    return out;
  }
  function soldOutText(value) {
    const t=String(value||'').replace(/\s+/g,' ').trim();
    return /선택한 회차는 매진되어 예약\s*할\s*수\s*없습니다/.test(t) || /선택한 회차는 매진/.test(t);
  }
  return { parseNaverClock, parseNaverSessionDescriptors, soldOutText };
});


/* packages/adapters/src/naver-booking/selectors.js */
(function (root, factory) {
 const api=factory(); if(typeof module==='object'&&module.exports) module.exports=api;
 root.TicketHelper=Object.assign(root.TicketHelper||{},api);
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 return { NAVER_SELECTORS:Object.freeze({
   sessionNodes:'button,a,[role="button"],label,div,span',
   actions:'button,a,[role="button"]',
   toastText:'div,span,p,li'
 })};
});


/* packages/adapters/src/naver-booking/adapter.js */
(function (root, factory) {
  const deps = typeof module === 'object' && module.exports
    ? { ...require('./parser.js'), ...require('./selectors.js') }
    : (root.TicketHelper || {});
  const api=factory(deps);
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.TicketHelper=Object.assign(root.TicketHelper||{},api);
})(typeof globalThis!=='undefined'?globalThis:this,function(deps){
  'use strict';
  const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
  function ok(data={}){return {ok:true,...data};}
  function fail(stage,message,data={}){return {ok:false,stage,message,...data};}
  function diagError(stage,message){const e=new Error(message);e.stage=stage;return e;}

  function targetUrlForDate(bookingUrl,targetDate){
    let url;
    try { url=new URL(bookingUrl,'https://m.booking.naver.com'); }
    catch { return null; }
    url.searchParams.delete('tab');
    url.searchParams.set('startDateTime',`${targetDate}T00:00:00+09:00`);
    return url.toString();
  }

  function createNaverBookingAdapter({page,bookingUrl,paymentPolicy={}}){
    if(!page) throw new TypeError('page is required');
    let requestedDate=null,selectedLabel=null;
    const dateMatches=()=>!requestedDate||page.currentTargetDate()===requestedDate;
    return {
      id:'naver-booking',
      async selectTargetDate(targetDate){
        requestedDate=targetDate;selectedLabel=null;
        if(page.currentTargetDate()===targetDate) return ok();
        const navigateTo=targetUrlForDate(bookingUrl,targetDate);
        return navigateTo?fail('date-missing','target date requires direct-date navigation',{navigateTo}):fail('date-missing','could not construct target-date URL');
      },
      async readSessions(){
        if(!dateMatches())throw diagError('date-missing','requested date changed before reading sessions');
        const state=page.sessionContainerState();
        if(state==='missing') throw diagError('session-container-missing','session container not found');
        if(state==='ambiguous') throw diagError('session-ambiguous','multiple ambiguous session containers found');
        return deps.parseNaverSessionDescriptors(page.listSessionDescriptors());
      },
      async chooseSession(session){
        selectedLabel=null;if(!dateMatches())return fail('date-missing','requested date changed before selection');
        const sessions=deps.parseNaverSessionDescriptors(page.listSessionDescriptors());
        const matches=sessions.filter(s=>s.label===session.label);
        if(!matches.length) return fail('session-unavailable',`session not found: ${session.label}`);
        if(matches.length>1) return fail('session-ambiguous',`multiple session buttons: ${session.label}`);
        if(!matches[0].available) return fail('session-unavailable',`session disabled: ${session.label}`);
        page.clickElement(matches[0].element||matches[0]);
        const outcome=await page.waitForSlotOutcome(matches[0].label);
        if(outcome==='sold-out') return fail('session-unavailable',`sold out: ${session.label}`);
        if(outcome!=='selected') return fail('navigation-failed',`session selection did not activate: ${session.label}`);
        if(!dateMatches())return fail('date-missing','requested date changed during selection');
        selectedLabel=session.label;return ok({session:matches[0]});
      },
      async goNext(){
        if(!dateMatches())return fail('date-missing','requested date changed before NEXT');
        const current=deps.parseNaverSessionDescriptors(page.listSessionDescriptors()).filter(s=>s.label===selectedLabel);
        if(!selectedLabel||current.length!==1||!current[0].available||(typeof page.isSessionSelected==='function'&&!page.isSessionSelected(selectedLabel)))return fail('session-unavailable','selected session changed before NEXT');
        const actions=page.findExactActions('다음');
        if(!actions.length) return fail('next-button-missing','다음 button not found');
        if(actions.length>1) return fail('next-button-ambiguous','multiple 다음 buttons found');
        const before=page.currentHref(); page.clickElement(actions[0]);
        return (await page.waitForNavigation(before))?ok():fail('navigation-failed','다음 did not navigate');
      },
      async fillUserInfo(user){if(user?.participants&&!await page.selectParticipants?.(user.participants))return fail('participants-missing','설정한 참여 인원을 선택하지 못했습니다. 직접 확인해 주세요.');return ok();},
      async applyAgreements(){ return page.excludeMarketingConsent?.()===false?fail('agreement-missing','마케팅 수신 동의를 해제하지 못했습니다. 직접 확인해 주세요.'):ok(); },
      async captchaState(){ return 'complete'; },
      async continueAfterCaptcha(mode){
        if(mode==='practice') return fail('confirmation-blocked','practice mode stops before 동의하고 결제하기');
        if(page.excludeMarketingConsent?.()===false)return fail('agreement-missing','마케팅 수신 동의를 해제하지 못했습니다. 직접 확인해 주세요.');
        const actions=page.findExactActions('동의하고 결제하기');
        if(!actions.length) return fail('confirmation-blocked','동의하고 결제하기 button not found');
        if(actions.length>1) return fail('confirmation-blocked','multiple 동의하고 결제하기 buttons found');
        page.clickElement(actions[0]);
        const boundary=await page.waitForNpayBoundary();
        if(!boundary) return fail('navigation-failed','Npay final-payment boundary not detected');
        if(mode!=='confirm') return ok({paymentBoundary:true});
        const max=Number(paymentPolicy?.maxPaymentAmount)||0;
        const final=page.finalPaymentAction?.();
        if(!final?.element||!Number.isFinite(final.amount)) return fail('confirmation-blocked','final payment button not found');
        if(max>0&&final.amount>max) return fail('payment-limit-exceeded',`payment amount ${final.amount} exceeds cap ${max}`,{amount:final.amount,maxPaymentAmount:max});
        page.clickElement(final.element);
        return ok({paymentBoundary:true,paymentSubmitted:true,requiresExternalConfirmation:true,amount:final.amount,maxPaymentAmount:max});
      }
    };
  }

  function createBrowserNaverPage(doc=document,win=window,options={}){
    const selectors=deps.NAVER_SELECTORS;
    const checkCancelled=()=>{if(options.isCancelled?.())throw diagError('cancelled','실행이 중지되었습니다.');};
    const textOf=(el)=>String(el?.innerText??el?.textContent??'').replace(/\s+/g,' ').trim();
    const visible=(el)=>{if(!el||typeof el.getBoundingClientRect!=='function')return false;const r=el.getBoundingClientRect(),s=win.getComputedStyle(el);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden';};
    const actions=(label)=>[...doc.querySelectorAll(selectors.actions)].filter(visible).filter(el=>textOf(el)===label).filter(el=>!(el.disabled||el.getAttribute?.('aria-disabled')==='true'||/disabled|inactive|is_disabled/i.test(String(el.className||''))));
    function listSessionDescriptors(){
      const seen=new Set(),out=[];
      // Naver's .btn_time places the clock in a text node and stock in a child span.
      for(const el of doc.querySelectorAll('button.btn_time')){
        if(!visible(el))continue;
        const copy=el.cloneNode(true);for(const stock of copy.querySelectorAll('.stock'))stock.remove();
        const label=textOf(copy);if(!deps.parseNaverClock(label))continue;
        seen.add(el);out.push({element:el,id:el.id||'',label,disabled:!!el.disabled,ariaDisabled:el.getAttribute('aria-disabled')||false,className:String(el.className||''),soldOut:/매진|예약\s*(?:불가|마감)/.test(textOf(el)),siteOrder:out.length});
      }
      for(const node of doc.querySelectorAll(selectors.sessionNodes)){
        const parsed=deps.parseNaverClock(textOf(node)); if(!parsed) continue;
        const el=node.closest?.('button,a,[role="button"],label')||node;
        if(!visible(el)||seen.has(el)) continue; seen.add(el);
        out.push({element:el,id:el.id||'',label:textOf(node),disabled:!!el.disabled,ariaDisabled:el.getAttribute?.('aria-disabled')||false,className:String(el.className||''),siteOrder:out.length});
      }
      return out;
    }
    function soldOutToastExists(){
      return [...doc.querySelectorAll(selectors.toastText)].filter(visible).some(el=>deps.soldOutText(textOf(el)));
    }
    function currentTargetDate(){
      try {
        const u=new URL(win.location.href);if(u.searchParams.get('tab')==='details')return null; const raw=u.searchParams.get('startDateTime')||''; const m=/^(\d{4}-\d{2}-\d{2})/.exec(raw); return m?.[1]||null;
      } catch { return null; }
    }
    return {
      currentTargetDate,
      excludeMarketingConsent:()=>deps.clearMarketingConsent(doc,win,options),
      navigateToDate(date,url){win.location.replace(targetUrlForDate(url,date));},
      sessionContainerState(){return listSessionDescriptors().length?'ok':'missing';},
      listSessionDescriptors,
      clickElement(el){
        checkCancelled();
        try { el.scrollIntoView?.({block:'center',inline:'center',behavior:'instant'}); } catch{}
        checkCancelled();
        try { el.click?.(); } catch{}
      },
      isSessionSelected(label){
        const selected=listSessionDescriptors().filter(d=>d.element.getAttribute('aria-selected')==='true'||d.element.getAttribute('aria-pressed')==='true'||/(?:^|\s)(?:selected|is_selected)(?:\s|$)/.test(d.element.className));
        return selected.length===1&&deps.parseNaverClock(selected[0].label)?.label===label;
      },
      async waitForSlotOutcome(label){
        const started=Date.now();
        while(Date.now()-started<2200){
          checkCancelled();
          if(soldOutToastExists()) return 'sold-out';
          const chosen=listSessionDescriptors().find(d=>deps.parseNaverClock(d.label)?.label===label);
          if(chosen&&(chosen.element.getAttribute('aria-selected')==='true'||chosen.element.getAttribute('aria-pressed')==='true'||/(?:^|\s)(?:selected|is_selected)(?:\s|$)/.test(chosen.element.className)))return 'selected';
          await sleep(50);
        }
        return 'timeout';
      },
      selectParticipants:count=>deps.selectParticipantCount(doc,win,count,{isCancelled:options.isCancelled}),
      findExactActions:actions,
      currentHref(){return win.location.href;},
      async waitForNavigation(before){for(let i=0;i<40;i++){checkCancelled();await sleep(50);checkCancelled();if(win.location.href!==before||win.location.pathname.includes('/request'))return true;}return false;},
      async waitForNpayBoundary(){
        for(let i=0;i<120;i++){
          checkCancelled();
          const final=[...doc.querySelectorAll(selectors.actions)].filter(visible).some(el=>/^\s*[\d,]+원\s*결제하기\s*$/.test(textOf(el)));
          if(final) return true;
          await sleep(50);
        }
        return false;
      },
      finalPaymentAction(){
        const matches=[...doc.querySelectorAll(selectors.actions)].filter(visible).map(el=>({el,text:textOf(el)})).filter(x=>/^\s*[\d,]+원\s*결제하기\s*$/.test(x.text));
        if(matches.length!==1) return null;
        const amount=Number((matches[0].text.match(/[\d,]+/)?.[0]||'').replace(/,/g,''));
        return Number.isFinite(amount)?{element:matches[0].el,amount}:null;
      }
    };
  }

  return { createNaverBookingAdapter, createBrowserNaverPage, targetUrlForDate };
});


/* packages/ui/src/components.js */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TicketHelper = Object.assign(root.TicketHelper || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  function moveItem(list, from, to) {
    const out = Array.isArray(list) ? list.slice() : [];
    if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to < 0 || from >= out.length || to >= out.length || from === to) return out;
    const [item] = out.splice(from, 1);
    out.splice(to, 0, item);
    return out;
  }

  function addHourPriority(list, hour, tieBreak = 'site-order') {
    const out = Array.isArray(list) ? list.slice() : [];
    if (!Number.isInteger(hour) || hour < 0 || hour > 23 || out.some((p) => p.hour === hour)) return out;
    return [...out, { hour, tieBreak }];
  }

  function removeHourPriority(list, hour) {
    return (Array.isArray(list) ? list : []).filter((p) => p.hour !== hour);
  }

  function parseHourPriorityInput(value) {
    const out=[];
    for(const part of String(value||'').split(/[\s,>→]+/)){
      if(part==='') continue;
      const hour=Number(part.replace(/시대?$/,''));
      if(Number.isInteger(hour)&&hour>=0&&hour<=23&&!out.some(p=>p.hour===hour)) out.push({hour,tieBreak:'site-order'});
    }
    return out;
  }

  function parseExactPriorityInput(value) {
    const out=[];
    for(const part of String(value||'').split(/[\s,>→]+/)){
      const m=/^(\d{1,2}):(\d{2})$/.exec(part);
      if(!m) continue;
      const h=Number(m[1]),min=Number(m[2]); if(h<0||h>23||min<0||min>59) continue;
      const time=`${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`; if(!out.includes(time))out.push(time);
    }
    return out;
  }

  function applyPriorityInputs(profile,{hours='',exactTimes='',targetDate}={}){
    if(!profile)return profile;
    const next={...profile,timePriorities:parseHourPriorityInput(hours)};
    const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(targetDate||''));
    if(!m)return next;
    const d=new Date(Date.UTC(Number(m[1]),Number(m[2])-1,Number(m[3])));const kind=(d.getUTCDay()===0||d.getUTCDay()===6)?'weekend':'weekday';
    const templates={...(profile.sessionTemplates||{})};const prev=templates[kind]||{kind,times:[],mismatchPolicy:'exact-then-nearest'};
    const priority=parseExactPriorityInput(exactTimes);
    templates[kind]={...prev,kind,times:Array.isArray(prev.times)&&prev.times.length?prev.times.slice():priority.slice(),userPriority:priority,mismatchPolicy:prev.mismatchPolicy||'exact-then-nearest'};
    next.sessionTemplates=templates; return next;
  }

  function setExactSessionPriority(template, orderedTimes) {
    const unique = [];
    for (const time of Array.isArray(orderedTimes) ? orderedTimes : []) if (typeof time === 'string' && !unique.includes(time)) unique.push(time);
    return { ...(template || {}), userPriority: unique };
  }

  function moveFallbackTheme(ids, from, to) { return moveItem(ids, from, to); }
  function saveObservedSchedule(profile, targetDate, sessions, observedAt = Date.now()) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(targetDate || ''));
    if (!profile || !match) return profile;
    const d = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
    const kind = d.getUTCDay() === 0 || d.getUTCDay() === 6 ? 'weekend' : 'weekday';
    const times = [];
    for (const session of Array.isArray(sessions) ? sessions : []) {
      const label = String(session?.label || '').trim();
      if (/^\d{2}:\d{2}$/.test(label) && !times.includes(label)) times.push(label);
    }
    if (!times.length) return profile;
    const templates = { ...(profile.sessionTemplates || {}) };
    const previous = templates[kind] || {};
    templates[kind] = {
      ...previous,
      kind,
      times,
      userPriority: Array.isArray(previous.userPriority) ? previous.userPriority.slice() : [],
      mismatchPolicy: previous.mismatchPolicy || 'fall-back-to-hour-bands',
      observedAt,
      observedFromDate: targetDate
    };
    return { ...profile, sessionTemplates: templates };
  }

  function scheduleSourceLabel(source) {
    return ({ live:'실제 날짜 회차', date:'날짜별 저장 시간표', weekend:'주말 시간표', weekday:'평일 시간표', manual:'수동 시간표' })[source] || '시간표 미확인';
  }

  function hourLabel(item) { return `${String(item.hour).padStart(2,'0')}시대`; }

  function createAppMarkup(state = {}) {
    const schedule = state.schedule || { source:'none', times:[], userPriority:[] };
    const exact = Array.isArray(schedule.userPriority) && schedule.userPriority.length ? schedule.userPriority : schedule.times || [];
    const hourItems = (state.timePriorities || []).map((p, i) => `<span class="th-chip"><b>${i + 1}</b> ${escapeHtml(hourLabel(p))}</span>`).join('');
    const sessionItems = exact.map((time, i) => `<span class="th-chip th-chip-session"><b>${i + 1}</b> ${escapeHtml(time)}</span>`).join('');
    const liveClass = state.mode === 'live' ? 'is-live' : 'is-practice';
    return `<div class="th-app ${liveClass}">
      <header class="th-header"><div><div class="th-kicker">Ticket Helper</div><h1>${escapeHtml(state.themeName || '테마를 선택하세요')}</h1><p>${escapeHtml([state.siteName,state.branchName].filter(Boolean).join(' · '))}</p></div><span class="th-mode">${state.mode === 'live' ? '실전' : '연습'}</span></header>
      <section class="th-card th-hero"><div class="th-row"><div><span class="th-label">목표 날짜</span><strong>${escapeHtml(state.targetDate || '—')}</strong></div><div><span class="th-label">예상 오픈</span><strong>${escapeHtml(state.openingText || '—')}</strong></div></div><div class="th-countdown"><span>오픈까지</span><b>${escapeHtml(state.countdown || '--:--:--')}</b></div></section>
      <section class="th-card"><div class="th-section-head"><h2>회차 우선순위</h2><span class="th-source">${escapeHtml(scheduleSourceLabel(schedule.source))}</span></div><p class="th-help">실제 목표 날짜 회차가 보이면 그 값을 최우선으로 사용합니다. 시간 우선순위 직접 설정.</p><div class="th-chips">${sessionItems || '<span class="th-muted">저장된 정확한 회차 우선순위 없음</span>'}</div><div class="th-subtitle">시간대 보조 우선순위</div><div class="th-chips">${hourItems || '<span class="th-muted">필요할 때 00~23시 중 직접 추가</span>'}</div></section>
      <section class="th-card th-status"><div><span class="th-label">현재 상태</span><strong>${escapeHtml(state.statusText || '대기')}</strong></div><button type="button" data-action="prepare">티켓팅 준비</button></section>
    </div>`;
  }

  function mountTicketHelper(container, state, handlers = {}) {
    if (!container) throw new TypeError('container is required');
    container.innerHTML = createAppMarkup(state);
    container.querySelector?.('[data-action="prepare"]')?.addEventListener('click', () => handlers.onPrepare?.());
    return container;
  }

  return { escapeHtml, moveItem, addHourPriority, removeHourPriority, parseHourPriorityInput, parseExactPriorityInput, applyPriorityInputs, setExactSessionPriority, moveFallbackTheme, saveObservedSchedule, scheduleSourceLabel, createAppMarkup, mountTicketHelper };
});


/* apps/userscript/src/gm-storage.js */
(function (root, factory) {
  const deps = typeof module === 'object' && module.exports
    ? {...require('../../../packages/schemas/src/profile.js'),...require('../../../packages/ui/src/components.js')}
    : (root.TicketHelper || {});
  const api = factory(deps);
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TicketHelper = Object.assign(root.TicketHelper || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (deps) {
  'use strict';
  const KEYS = Object.freeze({
    profiles:'ticket-helper:profiles',
    localUser:'ticket-helper:local-user',
    checkpoint:'ticket-helper:checkpoint',
    settings:'ticket-helper:settings',
    backup:'ticket-helper:auto-backup',
    syncConfig:'ticket-helper:sync-config',
    syncState:'ticket-helper:sync-state'
  });

  function createTicketStorage(gm) {
    if (!gm || typeof gm.getValue !== 'function' || typeof gm.setValue !== 'function') throw new TypeError('GM storage adapter required');
    const clone=(value)=>{try{return JSON.parse(JSON.stringify(value))}catch{return value}};
    async function snapshot(reason='auto'){
      const profiles=await gm.getValue(KEYS.profiles,[]);
      const settings=await gm.getValue(KEYS.settings,{});
      if(!Array.isArray(profiles)||!settings||typeof settings!=='object'||Array.isArray(settings))return null;
      const backup={version:1,at:Date.now(),reason,profiles:clone(profiles),settings:clone(settings)};
      await gm.setValue(KEYS.backup,backup);
      return backup;
    }
    return {
      storageKind:gm.storageKind||'unknown',
      async getProfiles(){
        const current=await gm.getValue(KEYS.profiles,null);
        if(Array.isArray(current))return current;
        const backup=await gm.getValue(KEYS.backup,null);
        if(Array.isArray(backup?.profiles)){
          await gm.setValue(KEYS.profiles,clone(backup.profiles));
          return clone(backup.profiles);
        }
        return [];
      },
      async setProfiles(profiles){
        const normalized=Array.isArray(profiles)?profiles:[];
        const current=await gm.getValue(KEYS.profiles,null);
        if(Array.isArray(current))await snapshot('before-profiles-write');
        await gm.setValue(KEYS.profiles,normalized);
      },
      async saveObservedSchedule(profileId,targetDate,sessions,observedAt=Date.now()){
        const profiles=await this.getProfiles(); const index=profiles.findIndex(p=>p.id===profileId);
        if(index<0||typeof deps.saveObservedSchedule!=='function') return null;
        const updated=deps.saveObservedSchedule(profiles[index],targetDate,sessions,observedAt); profiles[index]=updated; await this.setProfiles(profiles); return updated;
      },
      async getLocalUser(){ return await gm.getValue(KEYS.localUser, null); },
      async setLocalUser(profile){ await gm.setValue(KEYS.localUser, profile || null); },
      async getCheckpoint(){ return await gm.getValue(KEYS.checkpoint, null); },
      async setCheckpoint(checkpoint){ await gm.setValue(KEYS.checkpoint, checkpoint || null); },
      async clearCheckpoint(){ if (gm.deleteValue) await gm.deleteValue(KEYS.checkpoint); else await gm.setValue(KEYS.checkpoint, null); },
      async getSettings(){
        const current=await gm.getValue(KEYS.settings,null);
        if(current&&typeof current==='object'&&!Array.isArray(current))return current;
        const backup=await gm.getValue(KEYS.backup,null);
        if(backup?.settings&&typeof backup.settings==='object'&&!Array.isArray(backup.settings)){
          await gm.setValue(KEYS.settings,clone(backup.settings));
          return clone(backup.settings);
        }
        return {};
      },
      async setSettings(settings){
        const normalized=settings&&typeof settings==='object'&&!Array.isArray(settings)?settings:{};
        const current=await gm.getValue(KEYS.settings,null);
        if(current&&typeof current==='object'&&!Array.isArray(current))await snapshot('before-settings-write');
        await gm.setValue(KEYS.settings,normalized);
      },
      async getAutoBackup(){ return await gm.getValue(KEYS.backup,null); },
      async getSyncConfig(){ const v=await gm.getValue(KEYS.syncConfig,null); return v&&typeof v==='object'&&!Array.isArray(v)?v:null; },
      async setSyncConfig(value){ await gm.setValue(KEYS.syncConfig,value&&typeof value==='object'?value:null); },
      async getSyncState(){ const v=await gm.getValue(KEYS.syncState,null); return v&&typeof v==='object'&&!Array.isArray(v)?v:null; },
      async setSyncState(value){ await gm.setValue(KEYS.syncState,value&&typeof value==='object'?value:null); },
      async createAutoBackup(reason='manual'){ return snapshot(reason); },
      async restoreAutoBackup(){
        const backup=await gm.getValue(KEYS.backup,null);
        if(!Array.isArray(backup?.profiles)||!backup?.settings||typeof backup.settings!=='object')return null;
        const currentProfiles=await gm.getValue(KEYS.profiles,[]);
        const currentSettings=await gm.getValue(KEYS.settings,{});
        await gm.setValue(KEYS.backup,{version:1,at:Date.now(),reason:'before-restore',profiles:clone(Array.isArray(currentProfiles)?currentProfiles:[]),settings:clone(currentSettings&&typeof currentSettings==='object'?currentSettings:{})});
        await gm.setValue(KEYS.profiles,clone(backup.profiles));
        await gm.setValue(KEYS.settings,clone(backup.settings));
        return {profiles:clone(backup.profiles),settings:clone(backup.settings),restoredAt:backup.at||0};
      },
      async exportProfiles(){
        const profiles = await this.getProfiles();
        return JSON.stringify((profiles || []).map((p) => deps.sanitizeProfileExport ? deps.sanitizeProfileExport(p) : p), null, 2);
      },
      async importProfiles(json){
        const parsed = typeof json === 'string' ? JSON.parse(json) : json;
        if (!Array.isArray(parsed)) throw new TypeError('profile import must be an array');
        await this.createAutoBackup('before-import');
        await gm.setValue(KEYS.profiles,parsed);
        return parsed;
      }
    };
  }

  function createBrowserGM(rootObj = root, injectedGM = null) {
    const modern = injectedGM || rootObj?.GM;
    if (modern?.getValue && modern?.setValue) {
      const api={
        storageKind:modern.storageKind||'userscripts-gm',
        getValue:(k,d)=>modern.getValue(k,d),
        setValue:(k,v)=>modern.setValue(k,v),
        deleteValue:(k)=>modern.deleteValue?.(k)
      };
      if(typeof modern.xmlHttpRequest==='function') api.xmlHttpRequest=(details)=>modern.xmlHttpRequest(details);
      return api;
    }
    if (typeof rootObj?.GM_getValue === 'function' && typeof rootObj?.GM_setValue === 'function') {
      return {
        storageKind:'legacy-gm',
        async getValue(k,d){ return rootObj.GM_getValue(k,d); },
        async setValue(k,v){ rootObj.GM_setValue(k,v); },
        async deleteValue(k){ if (typeof rootObj.GM_deleteValue === 'function') rootObj.GM_deleteValue(k); }
      };
    }
    const ls=rootObj?.localStorage;
    if(ls&&typeof ls.getItem==='function'&&typeof ls.setItem==='function'){
      return {
        storageKind:'origin-localStorage',
        async getValue(k,d){
          const raw=ls.getItem(k);
          if(raw===null||raw===undefined)return d;
          try{return JSON.parse(raw);}catch{return d;}
        },
        async setValue(k,v){ls.setItem(k,JSON.stringify(v));},
        async deleteValue(k){ls.removeItem?.(k);}
      };
    }
    throw new Error('Persistent storage unavailable. Open Userscripts popup once, keep the script enabled, then reload Safari.');
  }

  return { TICKET_STORAGE_KEYS: KEYS, createTicketStorage, createBrowserGM };
});


/* packages/sync/src/github-sync.js */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.TicketHelper=Object.assign(root.TicketHelper||{},api);
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function syncClone(value){try{return JSON.parse(JSON.stringify(value))}catch{return value}}
  function sanitizeSyncSettings(settings={}){
    const out={};
    for(const key of ['profileId','siteId','branchId','fallbackEnabled','compactView']) if(settings[key]!==undefined) out[key]=settings[key];
    return out;
  }
  function buildSyncPayload(profiles=[],settings={},updatedAt=Date.now(),deviceId=''){
    return {schemaVersion:1,updatedAt:Number(updatedAt)||Date.now(),deviceId:String(deviceId||''),profiles:syncClone(Array.isArray(profiles)?profiles:[]),settings:sanitizeSyncSettings(settings)};
  }
  function chooseSyncDirection({localUpdatedAt=0,remoteUpdatedAt=0,localDirty=false}={}){
    const local=Number(localUpdatedAt)||0,remote=Number(remoteUpdatedAt)||0;
    if(localDirty&&remote>local)return 'conflict';
    if(remote>local)return 'pull';
    if(local>remote&&localDirty)return 'push';
    if(local===remote)return 'noop';
    return localDirty?'push':'noop';
  }
  function encodeUtf8Base64(value){
    const bytes=new TextEncoder().encode(String(value));let binary='';
    for(const b of bytes)binary+=String.fromCharCode(b);
    return btoa(binary);
  }
  function decodeUtf8Base64(value){
    const binary=atob(String(value));const bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  function parseRepoFullName(value){
    const parts=String(value||'').trim().split('/');
    if(parts.length!==2||!parts[0]||!parts[1])throw new Error('GitHub 저장소는 owner/repo 형식이어야 합니다.');
    return {owner:parts[0],repo:parts[1]};
  }
  function createGitHubSyncClient({request,repoFullName,path='sync/ticket-helper-settings.json',branch='sync-data'}={}){
    if(typeof request!=='function')throw new TypeError('request is required');
    const parsed=parseRepoFullName(repoFullName);
    const encodedPath=String(path).split('/').filter(Boolean).map(encodeURIComponent).join('/');
    const url='https://api.github.com/repos/'+encodeURIComponent(parsed.owner)+'/'+encodeURIComponent(parsed.repo)+'/contents/'+encodedPath;
    const readUrl=url+'?ref='+encodeURIComponent(branch);
    const makeHeaders=(token)=>({Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',Authorization:'Bearer '+String(token||'').trim()});
    async function pull(token){
      const res=await request({method:'GET',url:readUrl,headers:makeHeaders(token)});const status=Number(res?.status||0);
      if(status===404)return {exists:false,sha:'',payload:null};
      if(status<200||status>=300)throw new Error('GitHub 동기화 조회 실패 (HTTP '+(status||'?')+')');
      const body=JSON.parse(res?.responseText||res?.response||'{}');
      const raw=decodeUtf8Base64(String(body.content||'').replace(/\s+/g,''));
      return {exists:true,sha:String(body.sha||''),payload:JSON.parse(raw)};
    }
    async function push(token,payload){
      const current=await pull(token);
      const data={message:'chore: sync Ticket Helper settings',content:encodeUtf8Base64(JSON.stringify(payload,null,2)),branch};
      if(current.exists&&current.sha)data.sha=current.sha;
      const res=await request({method:'PUT',url,headers:{...makeHeaders(token),'Content-Type':'application/json'},data:JSON.stringify(data)});
      const status=Number(res?.status||0);
      if(status<200||status>=300)throw new Error('GitHub 동기화 업로드 실패 (HTTP '+(status||'?')+')');
      return {ok:true};
    }
    return {pull,push};
  }
  return {sanitizeSyncSettings,buildSyncPayload,chooseSyncDirection,createGitHubSyncClient};
});

/* packages/adapters/src/partner-booking.js */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;root.TicketHelper=Object.assign(root.TicketHelper||{},api);})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const ok=(extra={})=>({ok:true,...extra});
  const fail=(stage,message)=>({ok:false,stage,message});
  const clean=v=>String(v||'').normalize('NFKC').replace(/\s+/g,'').toLowerCase();
  function withRunCancellation(adapter,isCancelled){
    const check=()=>{if(isCancelled()){const error=new Error('실행이 중지되었습니다.');error.stage='cancelled';throw error;}};
    const guarded={...adapter};
    for(const [key,value] of Object.entries(adapter))if(typeof value==='function')guarded[key]=async(...args)=>{check();const result=await value.apply(guarded,args);check();return result;};
    return guarded;
  }
  async function selectParticipantCount(doc,win,count,{isCancelled=()=>false,maxWaitMs=8000}={}){
    const n=Number(count);if(!Number.isInteger(n)||n<1||n>20)return false;
    const text=el=>{const copy=el?.cloneNode?.(true);if(!copy)return '';copy.querySelectorAll('.blind,.necessary_text,i,svg').forEach(node=>node.remove());return String(copy.textContent||'').replace(/\s+/g,' ').trim();};
    const label=new RegExp('^'+n+'\\s*명$');
    const rendered=el=>{if(!el?.isConnected)return false;for(let node=el;node;node=node.parentElement){const style=win.getComputedStyle(node);if(node.hidden||style.display==='none'||style.visibility==='hidden'||style.visibility==='collapse')return false;}return true;};
    const sleep=()=>new Promise(resolve=>win.setTimeout(resolve,50));
    let scope=null,trigger=null;
    for(let elapsed=0;elapsed<=maxWaitMs;elapsed+=50){
      if(isCancelled())return false;
      const candidates=[...doc.querySelectorAll('select')].filter(el=>[...el.options].some(o=>/^\d+\s*명$/.test(text(o))));
      if(candidates.length>1)return false;
      if(candidates.length===1){const el=candidates[0],option=[...el.options].find(o=>label.test(text(o))&&!o.disabled&&!o.closest('optgroup[disabled]'));if(el.matches(':disabled')||!option)return false;
        if(el.selectedOptions?.[0]===option)return true;
        const setter=Object.getOwnPropertyDescriptor(el.ownerDocument.defaultView.HTMLSelectElement.prototype,'value')?.set;if(setter)setter.call(el,option.value);else el.value=option.value;
        el.dispatchEvent(new win.Event('input',{bubbles:true}));el.dispatchEvent(new win.Event('change',{bubbles:true}));return el.value===option.value;
      }
      const labels=[...doc.querySelectorAll('label,strong,span,h3,.form_title')].filter(el=>/^참여\s*인원\s*설정/.test(text(el)));
      for(const heading of labels){let parent=heading;
        for(let i=0;i<5&&parent;i++,parent=parent.parentElement){
          const official=[...parent.querySelectorAll('.form_select .select_btn')];
          const buttons=official.length?official:[...parent.querySelectorAll('[role="combobox"],button,[aria-haspopup],a')].filter(el=>el.matches('[role="combobox"]')||/해당하는 항목|항목을 선택/.test(text(el)));
          const triggers=buttons.filter(el=>!buttons.some(other=>other!==el&&el.contains(other)));
          if(triggers.length!==1)continue;scope=parent;trigger=triggers[0];break;
        }if(trigger)break;
      }
      if(trigger)break;if(elapsed<maxWaitMs)await sleep();
    }
    if(!trigger||isCancelled()||!rendered(trigger)||trigger.matches(':disabled')||trigger.getAttribute('aria-disabled')==='true'||trigger.closest('.form_select.disabled'))return false;
    if(label.test(text(trigger)))return true;
    const hasOpenOptions=[...scope.querySelectorAll('.select_list,[role="listbox"],[role="option"]')].some(rendered);
    if(!hasOpenOptions&&trigger.getAttribute('aria-expanded')!=='true')trigger.click();
    for(let elapsed=0;elapsed<=2000;elapsed+=50){
      if(isCancelled())return false;
      const candidates=[...scope.querySelectorAll('.select_list .select_item,[role="option"],li,button,a')].filter(el=>rendered(el)&&label.test(text(el))&&!el.matches(':disabled')&&el.getAttribute('aria-disabled')!=='true');
      const options=candidates.filter(el=>!candidates.some(other=>other!==el&&el.contains(other))).filter(el=>el!==trigger);
      if(options.length>1)return false;
      if(options.length===1){options[0].click();
        for(let i=0;i<20;i++){if(isCancelled())return false;
          const current=trigger.isConnected?trigger:scope.querySelector('.select_btn,[role="combobox"]');
          if(label.test(text(current))||options[0].getAttribute('aria-selected')==='true')return true;await sleep();
        }return false;
      }await sleep();
    }return false;
  }
  function createPartnerBookingAdapter({page,profile}){
    return {
      requiresManualConfirmation:true,
      async selectTheme(){return await page.selectTheme(profile)?ok():fail('theme-missing','선택 테마를 확인할 수 없습니다.');},
      async selectTargetDate(date){return await page.selectDate(date)?ok():fail('date-missing','목표 날짜 선택을 확인할 수 없습니다.');},
      async readSessions(){if(typeof page.waitForSessions==='function'&&await page.waitForSessions()===false){const error=new Error('목표 날짜 회차 갱신을 기다리는 중입니다.');error.stage='sessions-not-loaded';throw error;}return page.readSessions(profile);},
      async chooseSession(session){return page.chooseSession(session,profile)?ok():fail('session-unavailable','선택 회차가 마감되었거나 변경되었습니다.');},
      async goNext(){return await page.advance()?ok({navigationPending:page.navigationExpected===true}):fail('next-missing','예약 정보 화면을 열 수 없습니다.');},
      async fillUserInfo(user){if(!page.fillUser(user))return fail('form-field-missing','예약자 이름·연락처를 확인해 주세요.');if(user?.participants&&!await page.selectParticipants?.(user.participants))return fail('participants-missing','설정한 참여 인원을 선택하지 못했습니다. 직접 확인해 주세요.');return ok();},
      async applyAgreements(){return page.applyAgreements()?ok():fail('agreement-missing','필수 동의를 직접 확인해 주세요.');},
      async captchaState(){return page.captchaState();},
      async continueAfterCaptcha(){return fail('confirmation-blocked','새 연동 사이트는 인원·금액을 확인하고 직접 예약을 확정해 주세요.');}
    };
  }
  function createBrowserPartnerPage(doc,win,profile,options={}){
    let selected=null,refreshFrom=null,requestedDate=null,selectedBeat=null;
    const sleep=ms=>new Promise(resolve=>win.setTimeout(resolve,ms));
    const text=el=>String(el?.innerText||el?.textContent||'').trim();
    const field=selector=>doc.querySelector(selector);
    const setValue=(el,value)=>{if(!el)return false;el.value=String(value);el.dispatchEvent(new win.Event('input',{bubbles:true}));el.dispatchEvent(new win.Event('change',{bubbles:true}));return true;};
    const wait=async test=>{const limit=profile.openingAttempt?Math.max(70,Number(profile.openingWaitMs)||420):8000;for(let i=0;i<Math.ceil(limit/50);i++){if(test())return true;await sleep(50);}return false;};
    function beatCard(){
      const branch=field('select[name="s_zizum"]');
      if(String(branch?.value)!==String(profile.branchId))return null;
      const cards=[...doc.querySelectorAll('.box')].filter(el=>clean(text(el.querySelector('.img_box .tit')))===clean(profile.themeName));
      if(cards.length!==1)return null;
      const id=cards[0].querySelector('.img_box a')?.getAttribute('href')?.match(/^javascript:_fun_theme_view\('([^']+)'\)$/)?.[1];
      return String(id)===String(profile.themeId)?cards[0]:null;
    }
    function beatDateReady(){
      try{const el=field('input[name="rev_days"]');const rendered=el?.getAttribute('value');return !!rendered&&(!requestedDate||el.value===requestedDate)&&rendered===el.value&&(new URL(win.location.href).searchParams.get('rev_days')||rendered)===el.value;}catch{return false;}
    }
    function beatLinkReady(el){
      if(el.closest('.dead')||!el.getAttribute('href'))return false;
      try{const url=new URL(el.getAttribute('href'),win.location.href);return url.origin===new URL(win.location.href).origin&&url.pathname==='/layout/res/home.php'&&url.searchParams.get('go')==='rev.make'&&!!url.searchParams.get('crypt_data');}catch{return false;}
    }
    function sessions(){
      let elements=[];
      if(profile.adapterId==='beatphobia'){if(!beatDateReady())return [];elements=[...(beatCard()?.querySelectorAll('.time_box a')||[])];}
      else if(profile.adapterId==='zeroworld')elements=[...doc.querySelectorAll('#theme_time_data a.choice-time__time')];
      else if(profile.adapterId==='doom'){
        const cards=[...doc.querySelectorAll('.resv_wrap .box')];
        const card=cards.find(el=>clean(text(el.querySelector('.tit .name')))===clean(profile.themeName));
        elements=card?[...card.querySelectorAll('.time a')]:[];
      }else{
        const cards=[...doc.querySelectorAll('.res-item')];
        const card=cards.find(el=>clean(text(el.querySelector('h2,strong')))===clean(profile.themeName));
        elements=card?[...card.querySelectorAll('button')]:[...doc.querySelectorAll('button.eveReservationButton,button[disabled]')];
      }
      return elements.flatMap((el,index)=>{
        const label=text(el).match(/\b(?:[01]\d|2[0-3]):[0-5]\d\b/)?.[0];if(!label)return [];
        const hidden=el.querySelector('.eveHiddenData');let data;try{data=JSON.parse(text(hidden));}catch{}
        if(data&&(String(data.branch)!==String(profile.branchId)||String(data.theme)!==String(profile.themeId)))return [];
        const unavailable=el.disabled||el.classList.contains('disable')||el.getAttribute('aria-disabled')==='true'||/예약\s*(?:불가|마감)|매진/.test(text(el));
        const selectable=profile.adapterId==='beatphobia'?beatLinkReady(el):profile.adapterId==='doom'?!!el.getAttribute('href'):profile.adapterId==='zeroworld'?/^javascript:fun_theme_time_select/.test(el.getAttribute('href')||''):/예약\s*가능/.test(text(el));
        return [{label,available:!unavailable&&selectable,siteOrder:index,element:el}];
      });
    }
    return {
      navigationExpected:profile.adapterId!=='zeroworld',
      async selectTheme(){
        if(profile.adapterId==='beatphobia')return !!beatCard();
        if(profile.adapterId==='doom')return sessions().length>0;
        if(profile.adapterId==='zeroworld'){
          await wait(()=>!!field('input[name="theme_num"]')?.value||doc.querySelectorAll('#theme_list a').length>0);
          const current=field('input[name="theme_num"]');if(String(current?.value)===String(profile.themeId))return true;
          const target=[...doc.querySelectorAll('#theme_list a')].find(el=>(el.getAttribute('href')||'').startsWith(`javascript:fun_theme_select('${profile.themeId}',`));
          if(!target)return false;refreshFrom=field('#theme_time_data')?.firstElementChild||null;target.click();return wait(()=>String(field('input[name="theme_num"]')?.value)===String(profile.themeId));
        }
        // Direct theme links can display a stale branch selector; match the rendered card/data.
        const title=[...doc.querySelectorAll('.res-item h2,.res-item strong,article strong')].some(el=>clean(text(el))===clean(profile.themeName));
        const data=[...doc.querySelectorAll('.eveHiddenData')].some(el=>{try{const d=JSON.parse(text(el));return String(d.branch)===String(profile.branchId)&&String(d.theme)===String(profile.themeId);}catch{return false;}});
        return title||data;
      },
      async selectDate(date){
        if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return false;
        if(profile.adapterId==='beatphobia'){requestedDate=date;selected=null;selectedBeat=null;return beatDateReady()&&field('input[name="rev_days"]')?.value===date;}
        if(profile.adapterId==='zeroworld'){
          if(field('input[name="rev_days"]')?.value===date)return true;
          if(!await wait(()=>doc.querySelectorAll('#calendar_data a[href^="javascript:fun_days_select"]').length>0))return false;
          const [year,month]=date.split('-');
          for(let i=0;i<24;i++){
            const day=[...doc.querySelectorAll('#calendar_data a')].find(el=>(el.getAttribute('href')||'').startsWith(`javascript:fun_days_select('${date}',`));
            if(day){refreshFrom=field('#theme_time_data')?.firstElementChild||null;day.click();return wait(()=>field('input[name="rev_days"]')?.value===date);}
            const header=(text(field('#calendar_data .calendar__year-pick'))+' '+text(field('#calendar_data .calendar__month-pick'))).trim()||text(field('#calendar_data'));const y=header.match(/(\d{4})년/)?.[1],m=header.match(/(\d{1,2})월/)?.[1];if(!y||!m)return false;
            const dir=Number(year)*12+Number(month)>Number(y)*12+Number(m)?1:-1;
            const arrows=[...doc.querySelectorAll('#calendar_data .calendar__arrow')].filter(el=>/^javascript:fun_calendar_move/.test(el.getAttribute('href')||''));
            const arrow=arrows[dir>0?arrows.length-1:0];if(!arrow)return false;const oldCalendar=arrow;arrow.click();if(!await wait(()=>!oldCalendar.isConnected))return false;
          }return false;
        }
        return field(profile.adapterId==='doom'?'input[name="rev_days"]':'input[name="date"][type="text"]')?.value===date;
      },
      readSessions:sessions,
      waitForSessions:()=>wait(()=>(!refreshFrom||!refreshFrom.isConnected)&&sessions().length>0),
      chooseSession(session){const matches=sessions().filter(s=>s.available&&s.label===session.label);selected=(profile.adapterId==='beatphobia'&&matches.length!==1)?null:(matches[0]?.element||null);if(profile.adapterId==='beatphobia')selectedBeat=selected?{label:session.label,date:field('input[name="rev_days"]')?.value,href:selected.getAttribute('href')}:null;return !!selected;},
      async advance(){if(!selected)return false;if(profile.adapterId==='beatphobia'){if(options.isCancelled?.())return false;const current=sessions(),chosen=current.find(s=>s.available&&s.element===selected);if(!chosen||!selectedBeat||chosen.label!==selectedBeat.label||field('input[name="rev_days"]')?.value!==selectedBeat.date||selected.getAttribute('href')!==selectedBeat.href||current.filter(s=>s.available&&s.label===selectedBeat.label).length!==1)return false;}selected.click();if(profile.adapterId==='zeroworld')return wait(()=>!!field('input[name="theme_time_num"]')?.value);return true;},
      selectParticipants:count=>selectParticipantCount(doc,win,count,{isCancelled:options.isCancelled}),
      fillUser(user){
        const name=field('input[name="name"]');const phone=String(user?.phone||'').replace(/\D/g,'');
        if(!name||!String(user?.name||'').trim()||!/^01\d\d{7,8}$/.test(phone))return false;
        const single=field('input[name="phone"],input[name="mobile"]');const second=field('input[name="mobile2"]'),third=field('input[name="mobile3"]');
        const first=field('select[name="mobile1"],input[name="mobile1"]');
        const assignments=[[name,String(user.name)],...(single?[[single,phone]]:[[first,phone.slice(0,3)],[second,phone.slice(3,-4)],[third,phone.slice(-4)]])];
        if(assignments.some(([el,value])=>!el||el.matches(':disabled')||(el.tagName==='SELECT'&&![...el.options].some(option=>option.value===value&&!option.disabled))))return false;
        for(const [el,value] of assignments)setValue(el,value);
        return assignments.every(([el,value])=>el.value===value);
      },
      applyAgreements(){
        if(profile.adapterId==='beatphobia'){
          const controls=['agree_a','agree_b','agree_c'].map(name=>field(`input[name="${name}"][type="checkbox"]`));
          if(controls.some(el=>!el||el.matches(':disabled'))||options.isCancelled?.())return false;
          for(const el of controls.slice(0,2))if(!el.checked)el.click();
          if(controls[2].checked)controls[2].click();
          return controls[0].checked&&controls[1].checked&&!controls[2].checked;
        }
        const required=field('input[name="policy"][type="checkbox"]');if(required&&!required.checked)required.click();
        const agree=doc.querySelector('input[name="ck_agree"][type="radio"]');if(agree&&!agree.checked)agree.click();return clearMarketingConsent(doc,win,options);
      },
      captchaState(){const captcha=field('input[name="input_captcha"]');return captcha&&!captcha.value.trim()?'pending':'complete';}
    };
  }
  function clearMarketingConsent(doc,win,options={}){
    const marketing=/마케팅|광고성?\s*(?:정보|수신)|홍보\s*(?:정보|수신)/;
    const text=el=>String(el?.textContent||'').replace(/\s+/g,' ').trim();
    const checked=el=>el.tagName==='INPUT'?el.checked===true:el.getAttribute('aria-checked')==='true';
    for(const el of doc.querySelectorAll('input[type="checkbox"],[role="checkbox"]')){
      const labels=[...(el.labels||[])].filter(label=>label.querySelectorAll('input[type="checkbox"]').length<=1);
      const named=(el.getAttribute('aria-labelledby')||'').split(/\s+/).filter(Boolean).map(id=>doc.getElementById(id));
      const description=[el.getAttribute('aria-label')||'',...labels.map(text),...named.map(text),el.tagName==='INPUT'?'':text(el)].join(' ');
      if(!marketing.test(description)||!checked(el))continue;
      if(options.isCancelled?.()||el.disabled||el.matches?.(':disabled')||el.getAttribute('aria-disabled')==='true')return false;
      if(el.tagName!=='INPUT'){
        const style=win.getComputedStyle(el),rect=el.getBoundingClientRect();
        if(el.closest('[hidden]')||style.display==='none'||style.visibility==='hidden'||!rect.width||!rect.height)return false;
      }
      try{el.click();}catch{return false;}
      if(checked(el))return false;
    }
    return true;
  }
  return {createPartnerBookingAdapter,createBrowserPartnerPage,withRunCancellation,selectParticipantCount,clearMarketingConsent};
});


/* apps/userscript/src/page-bridge.js */
(function (root, factory) {
  const deps = typeof module === 'object' && module.exports ? {
    ...require('../../../packages/adapters/src/registry.js'),
    ...require('../../../packages/adapters/src/keyescape/adapter.js'),
    ...require('../../../packages/adapters/src/naver-booking/adapter.js')
  } : (root.TicketHelper || {});
  const api=factory(deps);
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.TicketHelper=Object.assign(root.TicketHelper||{},api);
})(typeof globalThis!=='undefined'?globalThis:this,function(deps){
  'use strict';
  function detectAdapterId(url){ return deps.adapterIdForUrl ? deps.adapterIdForUrl(url) : null; }
  function prepareTargetUrl(adapterId, bookingUrl, targetDate){
    if(adapterId==='naver-booking' && deps.targetUrlForDate) return deps.targetUrlForDate(bookingUrl,targetDate);
    if(['tonybilly','doom','beatphobia'].includes(adapterId)&&/^\d{4}-\d{2}-\d{2}$/.test(targetDate||'')){
      try{const url=new URL(bookingUrl);url.searchParams.set(['doom','beatphobia'].includes(adapterId)?'rev_days':'date',targetDate);return url.href;}catch{}
    }
    return bookingUrl;
  }
  function prepareProfileTargetUrl(profile,targetDate){
    if(!profile)return '';
    const bookingUrl=profile.themeBookingUrl||profile.bookingUrl||'';
    return prepareTargetUrl(profile.adapterId,bookingUrl,targetDate);
  }
  function createPageAdapter(profile, doc=document, win=window, runOptions={}){
    if(!profile) return null;
    if(profile.adapterId==='keyescape') return deps.createKeyescapeAdapter({page:deps.createBrowserKeyescapePage(doc,win,runOptions),profile});
    if(profile.adapterId==='naver-booking') return deps.createNaverBookingAdapter({page:deps.createBrowserNaverPage(doc,win,runOptions),bookingUrl:profile.bookingUrl,paymentPolicy:{maxPaymentAmount:Number(runOptions.maxPaymentAmount)||0}});
    if(['tonybilly','zeroworld','doom','beatphobia'].includes(profile.adapterId))return deps.createPartnerBookingAdapter({page:deps.createBrowserPartnerPage(doc,win,profile,runOptions),profile});
    return null;
  }
  return {detectAdapterId,prepareTargetUrl,prepareProfileTargetUrl,createPageAdapter};
});


/* apps/userscript/src/app.js */
(function (root, factory) {
  const deps=typeof module==='object'&&module.exports?require('../../../packages/ui/src/components.js'):(root.TicketHelper||{});
  const api=factory(deps);
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.TicketHelper=Object.assign(root.TicketHelper||{},api);
})(typeof globalThis!=='undefined'?globalThis:this,function(deps){
  'use strict';
  const esc=deps.escapeHtml || ((v)=>String(v??''));

  function buildOverlayState(profile,schedule,run={}){
    return {
      mode:run.mode||'practice', profileId:profile?.id||'', themeName:profile?.themeName||'테마를 선택하세요',
      siteName:profile?.siteName||profile?.siteId||'', branchName:profile?.branchName||profile?.branchId||'',
      targetDate:run.targetDate||'', openingText:run.openingText||'자동 계산', countdown:run.countdown||'--:--:--',
      schedule:schedule||{source:'none',times:[],userPriority:[]}, timePriorities:profile?.timePriorities||[],
      fallbackThemes:run.fallbackThemes||profile?.fallbackThemeIds||[], adapterHealth:run.adapterHealth||'확인 필요', statusText:run.statusText||'대기',
      detectedThemeName:run.detectedThemeName||'', detectedBranchName:run.detectedBranchName||'', pageScan:run.pageScan||null,
      panelOpen:run.panelOpen,
      storageKind:run.storageKind||'unknown',
      savedThemeCount:Number(run.savedThemeCount||0),
      backupAt:Number(run.backupAt||0),
      compactView:run.compactView!==false
    };
  }

  function catalogFromProfiles(profiles=[]){
    const sites=[];
    for(const p of profiles||[]){
      const siteId=p.siteId||p.adapterId||'site';
      let site=sites.find(x=>x.id===siteId);
      if(!site){site={id:siteId,name:p.siteName||siteId,branches:[]};sites.push(site);}
      const branchId=String(p.branchId||p.branchName||'default');
      let branch=site.branches.find(x=>x.id===branchId);
      if(!branch){branch={id:branchId,name:p.branchName||p.branchId||'지점 미설정',profiles:[]};site.branches.push(branch);}
      branch.profiles.push(p);
    }
    return sites;
  }

  function resolveSelection(profiles,state={}){
    const catalog=catalogFromProfiles(profiles);
    let selected=(profiles||[]).find(p=>p.id===state.profileId)||null;
    let site=catalog.find(s=>s.id===(state.siteId||selected?.siteId))||catalog[0]||null;
    let branch=site?.branches.find(b=>b.id===String(state.branchId||selected?.branchId||''))||null;
    if(!branch&&selected) branch=site?.branches.find(b=>b.profiles.some(p=>p.id===selected.id))||null;
    if(!branch) branch=site?.branches[0]||null;
    if(!selected||!branch?.profiles.some(p=>p.id===selected.id)) selected=branch?.profiles[0]||selected||profiles?.[0]||null;
    return {catalog,site,branch,selected};
  }

  function sessionLabels(viewState={}){
    const scanned=(viewState.pageScan?.sessions||[]).map(s=>String(s?.label||'')).filter(Boolean);
    const saved=Array.isArray(viewState.schedule?.times)?viewState.schedule.times:[];
    return [...new Set(scanned.length?scanned:saved)];
  }

  function formatDatePickerValue(value){
    const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value||''));
    if(!m)return '날짜 선택';
    return `${Number(m[1])}. ${Number(m[2])}. ${Number(m[3])}.`;
  }
  function formatTimePickerValue(value){
    const m=/^(\d{2}):(\d{2})$/.exec(String(value||''));
    if(!m)return '시간 선택';
    const h=Number(m[1]), minute=m[2], period=h<12?'오전':'오후', hour=h%12||12;
    return `${period} ${hour}:${minute}`;
  }
  function localDateValue(date){
    const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
  }
  function desktopTimeParts(value=''){
    const m=/^(\d{2}):(\d{2})$/.exec(String(value||''));
    return m?{hour:m[1],minute:m[2]}:{hour:'10',minute:'00'};
  }
  function desktopTimeControls(value=''){
    const parts=desktopTimeParts(value);
    const hours=Array.from({length:24},(_,h)=>{
      const v=String(h).padStart(2,'0');
      return `<button type="button" data-action="picker-hour" data-picker-hour="${v}" class="${v===parts.hour?'is-selected':''}">${v}</button>`;
    }).join('');
    const minutes=Array.from({length:12},(_,i)=>{
      const v=String(i*5).padStart(2,'0');
      return `<button type="button" data-action="picker-minute" data-picker-minute="${v}" class="${v===parts.minute?'is-selected':''}">${v}</button>`;
    }).join('');
    const preview=formatTimePickerValue(`${parts.hour}:${parts.minute}`);
    return `<div class="th-time-preview"><span>선택 시간</span><strong data-picker-current>${esc(preview)}</strong></div><div class="th-time-section"><strong>시</strong><div class="th-time-hour-grid">${hours}</div></div><div class="th-time-section"><strong>분</strong><div class="th-time-minute-grid">${minutes}</div></div><div class="th-picker-actions"><button type="button" class="th-picker-confirm" data-action="picker-confirm">적용</button></div>`;
  }
  function pickerFieldMarkup({label,field,type,value=''}) {
    const isDesktopRuntime=!!(typeof globalThis!=='undefined'&&globalThis.TICKET_HELPER_DESKTOP_RUNTIME);
    if(isDesktopRuntime){
      const display=type==='date'?formatDatePickerValue(value):formatTimePickerValue(value);
      const popover=type==='date'
        ?'<div class="th-calendar-head"><button type="button" data-action="picker-prev-month">‹</button><strong data-picker-month-label></strong><button type="button" data-action="picker-next-month">›</button></div><div class="th-calendar-week"><span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span></div><div class="th-calendar-grid" data-picker-calendar></div>'
        :desktopTimeControls(value);
      return `<div class="th-picker-field"><div class="th-picker-label">${esc(label)}</div><div class="th-custom-picker" data-picker-type="${esc(type)}" data-picker-field="${esc(field)}"><button type="button" class="th-custom-picker-trigger" data-action="picker-toggle"><span data-picker-display="${esc(field)}">${esc(display)}</span><span class="th-picker-arrow">▾</span></button><div class="th-picker-popover" hidden>${popover}</div><input class="th-picker-value" data-field="${esc(field)}" type="hidden" value="${esc(value)}"></div></div>`;
    }
    const display=type==='date'?formatDatePickerValue(value):formatTimePickerValue(value);
    return `<label>${esc(label)}<div class="th-picker-shell"><span class="th-picker-display" data-picker-display="${esc(field)}">${esc(display)}</span><input class="th-picker-native" data-field="${esc(field)}" type="${esc(type)}" value="${esc(value)}" aria-label="${esc(label)}"></div></label>`;
  }

  function storageKindLabel(kind){
    if(kind==='extension-storage')return 'Chrome/Edge 확장';
    if(kind==='userscripts-gm')return 'Userscripts';
    if(kind==='legacy-gm')return 'Userscripts(legacy)';
    if(kind==='origin-localStorage')return '사이트 로컬';
    return 'Userscripts';
  }
  function formatBackupAt(value){
    const n=Number(value||0);
    if(!Number.isFinite(n)||n<=0)return '';
    try{
      return new Intl.DateTimeFormat('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(n));
    }catch{return new Date(n).toLocaleString('ko-KR');}
  }

  function createMobileConfigMarkup(profiles,state={},viewState={},localUser={},syncConfig={}){
    const {catalog,site,branch,selected}=resolveSelection(profiles,state);
    const siteOptions=catalog.length?catalog.map(s=>`<option value="${esc(s.id)}"${s.id===site?.id?' selected':''}>${esc(s.name)}</option>`).join(''):'<option value="">등록된 사이트 없음</option>';
    const branchOptions=site?.branches?.length?site.branches.map(b=>`<option value="${esc(b.id)}"${b.id===branch?.id?' selected':''}>${esc(b.name)}</option>`).join(''):'<option value="">등록된 지점 없음</option>';
    const themeOptions=branch?.profiles?.length?branch.profiles.map(p=>`<option value="${esc(p.id)}"${p.id===selected?.id?' selected':''}>${esc(p.themeName||p.id)}</option>`).join(''):'<option value="">등록된 테마 없음</option>';
    const exactPriority=Array.isArray(viewState.schedule?.userPriority)?viewState.schedule.userPriority:[];
    const times=sessionLabels(viewState);
    const sessionButtons=times.length?times.map(time=>{
      const rank=exactPriority.indexOf(time);
      return `<button type="button" class="th-time-chip${rank>=0?' selected':''}" data-action="session-priority" data-time="${esc(time)}" aria-pressed="${rank>=0?'true':'false'}">${rank>=0?`<b>${rank+1}</b> `:''}${esc(time)}</button>`;
    }).join(''):'<span class="th-empty">아직 인식된 회차가 없습니다.</span>';
    const hourButtons=(selected?.timePriorities||[]).map((p,i)=>`<button type="button" class="th-hour-chip" data-action="remove-hour" data-hour="${p.hour}"><b>${i+1}</b> ${String(p.hour).padStart(2,'0')}시 ×</button>`).join('')||'<span class="th-empty">보조 시간대 없음</span>';
    const hourOptions='<option value="">시간대 선택</option>'+Array.from({length:24},(_,h)=>`<option value="${h}">${String(h).padStart(2,'0')}시대</option>`).join('');
    const detectedTheme=esc(viewState?.pageScan?.themeName||viewState?.detectedThemeName||'');
    const detectedBranch=esc(viewState?.pageScan?.branchName||viewState?.detectedBranchName||'');
    const scanText=viewState.pageScan?`${viewState.pageScan.siteName||''}${viewState.pageScan.branchName?' · '+viewState.pageScan.branchName:''}${viewState.pageScan.themeName?' · '+viewState.pageScan.themeName:''}`:'현재 페이지를 눌러 자동 인식';
    const open=viewState.panelOpen===false?'':' open';
    const imageUrl=safeImageUrl(selected?.imageUrl||'');
    const openingRule=selected?.openingRule||{};
    const themePreview=selected?`<div class="th-theme-preview">${imageUrl?`<img src="${esc(imageUrl)}" alt="${esc(selected.themeName||'테마')} 포스터">`:'<div class="th-theme-placeholder">🎟️</div>'}<div><strong>${esc(selected.themeName||'')}</strong><span>${esc(selected.branchName||'')}</span><small>D-${Number.isInteger(openingRule.daysBefore)?openingRule.daysBefore:'?'} · ${esc(openingRule.openTime||'시간 확인 필요')}</small></div></div>`:'';
    const compact=viewState.compactView!==false;
    const compactSummary=selected?`${selected.themeName||''}${selected.branchName?' · '+selected.branchName:''} · D-${Number.isInteger(openingRule.daysBefore)?openingRule.daysBefore:'?'} ${openingRule.openTime||''}`:'선택된 테마 없음';
    const backupLabel=viewState.backupAt?`최근 자동백업 ${formatBackupAt(viewState.backupAt)}`:'아직 자동백업 없음';
    const syncStatus=String(viewState.syncStatusText||'연결 안 됨');
    const syncLast=viewState.syncLastAt?formatBackupAt(viewState.syncLastAt):'아직 동기화 없음';
    const syncRepo=String(syncConfig.repoFullName||'omjun0807-del/ticket-helper-private');
    return `<details class="th-panel" data-compact="${compact}"${open}><summary><strong>Ticket Helper</strong><span>${esc(selected?.themeName||'탭해서 설정')}</span></summary><div class="th-mobile-config">
      ${viewState.updateRemoteVersion?`<div class="th-help" role="status">새 버전 v${esc(viewState.updateRemoteVersion)} · <button type="button" data-action="check-update">업데이트 파일 열기</button></div>`:""}
      <section class="th-card th-theme-card" aria-label="예약 테마"><div class="th-card-heading"><span class="th-step">01</span><strong>예약 테마</strong></div>
      ${compact?`<div class="th-compact-summary">${esc(compactSummary)}</div>`:`<div class="th-scan-result">${esc(scanText)}</div>`}
      ${selected?.openingHint?`<small>${esc(selected.openingHint.note||'오픈 규칙 확인 필요')}${selected.openingHint.openTime?` · 참고 시각 ${esc(selected.openingHint.openTime)}`:''}</small>`:''}
      ${safeImageUrl(selected?.openingRuleSourceUrl||selected?.openingHint?.sources?.[0]||'')?`<a href="${esc(safeImageUrl(selected.openingRuleSourceUrl||selected.openingHint.sources?.[0]))}" target="_blank" rel="noopener noreferrer">오픈 안내 출처 · ${selected.openingRuleStatus==='verified'?'공식 확인':selected.openingRuleStatus==='configured'?'사용자 설정':'재확인 필요'}</a>`:''}
      <div class="th-storage-status">저장 · ${esc(storageKindLabel(viewState.storageKind))} · 테마 ${Number(viewState.savedThemeCount||profiles.length)}개</div>


      <label>사이트<select data-field="site">${siteOptions}</select></label>
      <label>지점<select data-field="branch">${branchOptions}</select></label>
      <label>테마<select data-field="profile">${themeOptions}</select></label>
      ${themePreview}
      ${selected?`<div class="th-help">${selected.adapterId==='manual'?'목록·예약 링크 지원 · 자동 예약 미지원':selected.automationStatus==='practice-supported'?'선택·입력 연습 지원 · 실기기 확인 필요':''}${!selected.openingRule?' · 오픈 규칙 확인 필요':''}</div>${selected.reservationHint?`<div class="th-help">${esc(selected.reservationHint)}</div>`:''}<a class="th-link-button" href="${esc(selected.themeBookingUrl||selected.bookingUrl||'')}">공식 예약 페이지 열기</a>`:''}
      </section>
      <section class="th-card" aria-label="예약 설정"><div class="th-card-heading"><span class="th-step">02</span><strong>예약 설정</strong></div>
      ${pickerFieldMarkup({label:'목표 날짜',field:'target-date',type:'date',value:state.targetDate||''})}
      <button type="button" class="th-scan-button secondary" data-action="scan-target-date">목표일 회차 미리보기 (선택)</button>

      <div class="th-section-title">실제 회차 우선순위 <small>원하는 순서대로 탭</small></div>
      <div class="th-time-grid">${sessionButtons}</div>
      ${times.length?'<button type="button" class="th-link-button" data-action="clear-session-priority">회차 우선순위 초기화</button>':''}

      <div class="th-section-title">예약자 정보</div>
      <label>참여 인원<select data-field="local-participants"><option value="">직접 선택</option>${Array.from({length:10},(_,i)=>`<option value="${i+1}"${Number(localUser.participants)===i+1?' selected':''}>${i+1}명</option>`).join('')}</select></label>
      <label>예약자 이름<input data-field="local-name" autocomplete="name" value="${esc(localUser.name||'')}"></label>
      <label>연락처<input data-field="local-phone" inputmode="tel" autocomplete="tel" value="${esc(localUser.phone||'')}" placeholder="01012345678"></label>
      </section>
      <section class="th-card th-execution-card" aria-label="실행"><div class="th-card-heading"><span class="th-step">03</span><strong>실행</strong><span class="th-mode-badge">${state.mode==='confirm'?'예약 확정':state.mode==='live'?'실전':'연습'}</span></div>
      <div class="th-open-display"><span>예약 오픈</span><strong>${esc(viewState.openingText||'규칙·날짜 설정 필요')}</strong></div>
      <div class="th-help th-readiness" role="status" aria-live="polite"><strong>예약 준비</strong><div data-preparation-summary></div><div data-opening-countdown></div></div>
      <div class="th-run-state"><span class="th-state-dot" aria-hidden="true"></span><span>현재 상태 · ${esc(viewState.statusText||'대기')}</span></div>
      <label>모드<select data-field="mode"><option value="practice"${state.mode==='practice'||!state.mode?' selected':''}>연습 · 확정 안 함</option><option value="live"${state.mode==='live'?' selected':''}>실전 · 예약확정 / 결제 직전</option><option value="confirm"${state.mode==='confirm'?' selected':''}>예약 확정까지 · 최종 결제 클릭</option></select></label>
      <div class="th-warning">※ ‘예약 확정까지’는 네이버 최종 결제 버튼까지 누릅니다. 생체인증/추가인증은 직접 진행합니다.</div>
      <div class="th-config-actions"><button type="button" data-action="prepare"${selected?'':' disabled'}>티켓팅 준비</button><button type="button" data-action="stop" class="secondary">중지</button></div>
      </section>
      <details class="th-subsection th-more-settings" data-ui-section="more"${compact?'':' open'}><summary>추가 설정</summary><div class="th-subsection-body">
      <details class="th-subsection" data-ui-section="hours"${compact?'':' open'}><summary>보조 시간대 · ${esc((selected?.timePriorities||[]).map(p=>p.hour+'시').join(' → ')||'선택 안 함')}</summary><div class="th-subsection-body">
      <div class="th-help">실제 회차 우선순위 다음으로 사용할 시간대를 선택합니다.</div>
      <div class="th-time-grid">${hourButtons}</div>
      <div class="th-inline-add"><select data-field="hour-to-add">${hourOptions}</select><button type="button" data-action="add-hour" disabled>시간대 추가</button></div>
      </div></details>

      <details class="th-subsection" data-ui-section="options"${compact?'':' open'}><summary>실행 옵션</summary><div class="th-subsection-body">
      <label class="th-check"><input data-field="captcha-auto-resume" type="checkbox"${state.captchaAutoResume!==false?' checked':''}> CAPTCHA 직접 완료 후 자동 계속</label>
      </div></details>
      <details class="th-subsection" data-ui-section="practice"${compact?'':' open'}><summary>연습·도움말</summary><div class="th-subsection-body">
      <div class="th-help">오픈 전 날짜가 비활성화되어 미리보기가 안 돼도 실전 실행에는 영향 없습니다. 저장된 회차 우선순위를 사용하고, 오픈 시각에 실제 회차를 새로 읽습니다.</div>
      <div class="th-config-actions"><button type="button" data-action="practice-now" class="secondary"${selected&&selected.adapterId!=='manual'?'':' disabled'}>즉시 연습 테스트</button><button type="button" data-action="timing-test" class="secondary"${selected&&selected.adapterId!=='manual'?'':' disabled'}>10초 동작 테스트</button></div>
      <div class="th-warning">10초 동작 테스트는 현재 불러온 예약 가능 회차에서 타이머 → 회차 선택 → NEXT 흐름을 확인합니다. 미래 날짜의 실제 활성화 여부는 서버가 정하므로 실전 오픈 시각에만 검증됩니다.</div>
      </div></details>

      <details class="th-subsection"><summary>테마 등록 · 현재 페이지</summary><div class="th-subsection-body"><button type="button" class="secondary" data-action="scan-current">현재 페이지 정보 읽기</button><div class="th-help">등록할 테마의 예약 페이지에서 지점·테마명을 읽습니다. 회차는 목표일 회차 미리보기에서 확인하세요. 예약은 실행하지 않습니다.</div><div class="th-scan-result">${esc(scanText)}</div>
        <div class="th-help">현재 열려 있는 예약 페이지를 새 항목으로 저장합니다. 같은 테마가 이미 있으면 덮어쓰기 전에 확인합니다.</div>
        <label>지점명<input data-field="new-branch-name" value="${detectedBranch}" placeholder="예: 우주라이크 / 드림이스케이프"></label>
        <label>테마명<input data-field="new-theme-name" value="${detectedTheme}" placeholder="자동 인식 실패 시 직접 입력"></label>
        <label>오픈 D-<input data-field="new-days-before" type="number" min="0" max="60" inputmode="numeric" placeholder="예: 6"></label>
        ${pickerFieldMarkup({label:'오픈 시각',field:'new-open-time',type:'time',value:''})}
        <button type="button" data-action="add-current">현재 페이지 새로 등록</button>
      </div></details>
      ${selected?`<details class="th-subsection"><summary>선택 테마 수정 · ${esc(selected.themeName||'')}</summary><div class="th-subsection-body">
        <div class="th-help">아래 값은 수정 후 포커스를 벗어나면 바로 저장됩니다.</div>
        <label>테마명<input data-field="profile-theme-name" value="${esc(selected.themeName||'')}"></label>
        <label>지점명<input data-field="profile-branch-name" value="${esc(selected.branchName||'')}"></label>
        <label>오픈 D-<input data-field="profile-days-before" type="number" min="0" max="60" inputmode="numeric" value="${selected.openingRule?.daysBefore??''}"></label>
        ${pickerFieldMarkup({label:'오픈 시각',field:'profile-open-time',type:'time',value:selected.openingRule?.openTime||''})}
      </div></details>`:''}
      <details class="th-subsection"><summary>기기 동기화 · GitHub</summary><div class="th-subsection-body">
        <div class="th-sync-status"><strong>${esc(syncStatus)}</strong><span>${esc(syncLast)}</span></div>
        <label>Private 저장소<input data-field="sync-repo" value="${esc(syncRepo)}" autocomplete="off" spellcheck="false"></label>
        <label>GitHub 토큰<input data-field="sync-token" type="password" value="" autocomplete="off" placeholder="${syncConfig.hasToken?'토큰 저장됨 · 변경할 때만 새 토큰 입력':'fine-grained token 입력'}"></label>
        <label class="th-check"><input data-field="sync-auto" type="checkbox"${syncConfig.autoSync?' checked':''}> 자동 동기화</label>
        <div class="th-warning">테마·지점·오픈 규칙·회차/시간 우선순위만 동기화합니다. 예약자 이름·전화번호·실전/확정 모드는 각 기기에만 남습니다. 토큰도 기기 로컬에만 저장됩니다.</div>
        <div class="th-config-actions"><button type="button" data-action="sync-test" class="secondary">연결 확인</button><button type="button" data-action="sync-pull" class="secondary">내려받기</button><button type="button" data-action="sync-push">업로드</button></div>
      </div></details>
      <details class="th-subsection"><summary>${viewState.extensionVersion?`PC 확장판 · v${esc(viewState.extensionVersion)}`:viewState.desktopUserscript?`PC Userscript · v${esc(viewState.installedVersion||'?')}`:`업데이트 · v${esc(viewState.installedVersion||'?')}`}</summary><div class="th-subsection-body">${viewState.extensionVersion?'<div class="th-warning">Chrome/Edge 네이티브 확장판입니다. 새 확장 버전은 브라우저 확장 업데이트 또는 새 PC 확장 패키지로 적용합니다.</div>':viewState.desktopUserscript?'<div class="th-warning">PC에서는 Tampermonkey가 @updateURL / @downloadURL / @version을 기준으로 새 버전을 확인합니다. 확장 프로그램의 업데이트 확인 설정을 켜 주세요. 별도 ZIP 교체나 chrome://extensions 새로고침이 필요 없습니다.</div>':'<div class="th-warning">새 버전을 자동으로 확인해 위에 표시합니다. 버튼으로 파일을 열고 Safari 확장 기능 → Userscripts에서 적용하세요. 설치 파일 자동 교체는 Userscripts가 지원하는 범위에서만 가능합니다.</div><button type="button" data-action="check-update" class="secondary">새 버전 확인</button>'}</div></details>
      <details class="th-subsection"><summary>백업 / 복구</summary><div class="th-subsection-body"><div class="th-warning"><strong>${esc(backupLabel)}</strong><br>테마·회차·설정을 변경하기 전 자동 백업을 1개 유지합니다. 이름/연락처는 백업에 포함하지 않습니다.</div><div class="th-config-actions"><button type="button" data-action="restore-auto-backup" class="secondary"${viewState.backupAt?'':' disabled'}>자동백업 복구</button><button type="button" data-action="import-profiles" class="secondary">가져오기</button><button type="button" data-action="export-profiles" class="secondary">내보내기</button></div></div></details>
      </div></details>
    </div></details>`;
  }

  function applyMobilePriorityConfig(profiles,cfg={}){
    const out=Array.isArray(profiles)?profiles.slice():[]; const i=out.findIndex(p=>p.id===cfg.profileId);
    if(i<0||typeof deps.applyPriorityInputs!=='function') return out;
    out[i]=deps.applyPriorityInputs(out[i],{hours:cfg.hours||'',exactTimes:cfg.exactTimes||'',targetDate:cfg.targetDate});
    return out;
  }

  function applyMobileProfileConfig(profiles,cfg={}){
    let out=applyMobilePriorityConfig(profiles,cfg); const i=out.findIndex(p=>p.id===cfg.profileId);
    if(i<0)return out;
    const current=out[i]; const rule={timezone:'Asia/Seoul',prefireMs:0,retryOffsetsMs:[500,1200],...(current.openingRule||{})};
    const days=String(cfg.profileDaysBefore??'').trim()===''?NaN:Number(cfg.profileDaysBefore);
    if(Number.isInteger(days)&&days>=0&&days<=60)rule.daysBefore=days;
    if(/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(String(cfg.profileOpenTime||'')))rule.openTime=String(cfg.profileOpenTime);
    const theme=String(cfg.profileThemeName||'').trim(); const branch=String(cfg.profileBranchName||'').trim();
    const complete=Number.isInteger(rule.daysBefore)&&!!rule.openTime;
    out[i]={...current,themeName:theme||current.themeName,branchName:branch||current.branchName,openingRule:complete?rule:(current.openingRule||null),openingRuleStatus:complete?'configured':current.openingRuleStatus};
    return out;
  }

  function safeImageUrl(value){
    const v=String(value||'').trim();
    return /^https?:\/\//i.test(v)?v:'';
  }
  function reservationReadiness(profile,state={},user={}){
    const issues=[];
    const date=String(state.targetDate||'');
    const validDate=/^\d{4}-\d{2}-\d{2}$/.test(date)&&Number.isFinite(Date.parse(date))&&new Date(date).toISOString().slice(0,10)===date;
    if(!profile)issues.push('테마 미선택');
    if(!validDate)issues.push('목표 날짜 미설정');
    if(!String(user.name||'').trim())issues.push('예약자 이름 미설정');
    if(!/^01\d\d{7,8}$/.test(String(user.phone||'').replace(/\D/g,'')))issues.push('연락처 확인 필요');
    if(profile&&!profile.timePriorities?.length&&!Object.values(profile.sessionTemplates||{}).some(t=>t?.userPriority?.length))issues.push('회차·시간대 우선순위 미설정');
    if(profile?.adapterId==='manual')issues.push('자동 예약 미지원');
    let openAtMs=null;
    if(!profile?.openingRule)issues.push('오픈 규칙 미확인');
    else if(validDate){try{openAtMs=deps.calculateOpeningInstant(date,profile.openingRule).getTime();}catch{issues.push('오픈 규칙 확인 필요');}}
    return {issues,openAtMs};
  }
  function formatOpeningCountdown(openAtMs,now=Date.now()){
    if(!Number.isFinite(openAtMs))return '오픈 규칙·목표 날짜를 설정해 주세요';
    const remaining=openAtMs-now;if(remaining<=0)return '오픈 시각 지남';
    if(remaining<60000)return '오픈까지 '+(remaining/1000).toFixed(1)+'초';
    const minutes=Math.ceil(remaining/60000),days=Math.floor(minutes/1440),hours=Math.floor(minutes%1440/60),mins=minutes%60;
    return '오픈까지 '+(days?days+'일 ':'')+(hours?hours+'시간 ':'')+mins+'분';
  }
  function updatePreparationStatus(rootNode,readiness,now=Date.now()){
    const summary=rootNode.querySelector('[data-preparation-summary]');
    if(summary)summary.textContent=readiness.issues.length?readiness.issues.join(' · '):'기본 준비 완료';
    const countdown=rootNode.querySelector('[data-opening-countdown]');
    if(countdown){countdown.dataset.openAt=Number.isFinite(readiness.openAtMs)?String(readiness.openAtMs):'';countdown.textContent=formatOpeningCountdown(readiness.openAtMs,now);}
  }

  function fieldNeedsRerender(field){return field==='site'||field==='branch'||field==='profile';}
  function capturePanelUiState(rootNode){
    const panel=rootNode?.querySelector?.('.th-panel'); const status=rootNode?.querySelector?.('.th-status-content');
    const active=rootNode?.activeElement;
    const activeField=active?.dataset?.field||'';
    return {
      panelScrollTop:Number(panel?.scrollTop||0),
      panelOpen:panel?!!panel.open:undefined,
      compactView:panel?.dataset?.compact,
      sectionOpen:[...rootNode?.querySelectorAll?.('[data-ui-section]')||[]].map(el=>({id:el.dataset.uiSection,open:!!el.open})),
      statusScrollTop:Number(status?.scrollTop||0),
      activeField,
      selectionStart:Number.isInteger(active?.selectionStart)?active.selectionStart:null,
      selectionEnd:Number.isInteger(active?.selectionEnd)?active.selectionEnd:null
    };
  }
  function restorePanelUiState(rootNode,state={}){
    const apply=()=>{
      const panel=rootNode?.querySelector?.('.th-panel'); const status=rootNode?.querySelector?.('.th-status-content');
      if(panel){if(typeof state.panelOpen==='boolean')panel.open=state.panelOpen;panel.scrollTop=Number(state.panelScrollTop||0);}
      if(panel?.dataset?.compact===state.compactView){
        for(const section of state.sectionOpen||[]){
          const el=[...rootNode.querySelectorAll?.('[data-ui-section]')||[]].find(node=>node.dataset.uiSection===section.id);
          if(el)el.open=section.open;
        }
      }
      if(status)status.scrollTop=Number(state.statusScrollTop||0);
    };
    apply();
    const raf=(typeof requestAnimationFrame==='function'?requestAnimationFrame:(fn)=>setTimeout(fn,0));
    raf(apply); setTimeout(apply,40);
    if(state.activeField){
      const field=[...rootNode.querySelectorAll?.('[data-field]')||[]].find(el=>el.dataset?.field===state.activeField);
      // Native select/date/time pickers can reopen when focused after DOM replacement.
      const nativePicker=field?.tagName==='SELECT'||(field?.tagName==='INPUT'&&['date','time','datetime-local','month','week','color'].includes(field.type));
      if(field&&!nativePicker){
        try{field.focus({preventScroll:true});}catch{try{field.focus()}catch{}}
        if(Number.isInteger(state.selectionStart)&&typeof field.setSelectionRange==='function'){
          try{field.setSelectionRange(state.selectionStart,Number.isInteger(state.selectionEnd)?state.selectionEnd:state.selectionStart);}catch{}
        }
        raf(apply);
      }
    }
  }

  function createPanelRenderScheduler(rootNode,draw,win=globalThis){
    let held=false,pending=false,gesture=false;
    const isPicker=el=>el?.tagName==='SELECT'||(el?.tagName==='INPUT'&&['date','time','datetime-local','month','week','color'].includes(el.type));
    const flush=()=>{if(!held&&!gesture&&pending){pending=false;draw();}};
    rootNode.addEventListener('pointerdown',event=>{gesture=true;if(isPicker(event.target))held=true;},true);
    const releaseGesture=()=>{gesture=false;win.setTimeout(flush,0);};
    (rootNode.ownerDocument||rootNode).addEventListener('pointerup',releaseGesture,true);
    (rootNode.ownerDocument||rootNode).addEventListener('pointercancel',releaseGesture,true);
    rootNode.addEventListener('focusin',event=>{held=isPicker(event.target);if(!held)win.setTimeout(flush,0);},true);
    rootNode.addEventListener('change',event=>{if(isPicker(event.target)){held=false;gesture=false;win.setTimeout(flush,0);}},true);
    rootNode.addEventListener('focusout',event=>{if(isPicker(event.target)){held=false;win.setTimeout(flush,0);}},true);
    return ()=>{if(held||gesture){pending=true;return false;}pending=false;draw();return true;};
  }

  function mountUserscriptPanel(host,{profiles=[],state={},viewState={},localUser={},syncConfig={},onPrepare,onPracticeNow,onTimingTest,onStop,onChange,onLocalUserInput,onToggleCompact,onSyncConfig,onSyncTest,onSyncPull,onSyncPush,onImport,onExport,onRestoreBackup,onAddCurrent,onScan,onScanTargetDate,onSessionPriority,onClearSessionPriority,onAddHour,onRemoveHour,onCheckUpdate}={}){
    const rootNode=host.shadowRoot||host.attachShadow?.({mode:'open'})||host;
    const previousUi=capturePanelUiState(rootNode);
    const css=(typeof globalThis!=='undefined'&&globalThis.TICKET_HELPER_CSS)||'';
    const isDesktopRuntime=!!(typeof globalThis!=='undefined'&&globalThis.TICKET_HELPER_DESKTOP_RUNTIME);
    rootNode.innerHTML=`<style>${css}
      :host{all:initial}.th-shell{position:fixed;left:auto;right:max(8px,env(safe-area-inset-right));bottom:max(8px,env(safe-area-inset-bottom));width:min(390px,calc(100vw - 42px));max-width:390px;margin-left:auto;z-index:2147483647;pointer-events:none;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo",system-ui,sans-serif}
      .th-panel,.th-status-panel{pointer-events:auto;background:#fff;border:1px solid #e3e6ef;border-radius:18px;box-shadow:0 14px 42px rgba(0,0,0,.22);overflow:hidden;box-sizing:border-box}.th-panel[open]{max-height:min(72dvh,720px);overflow:auto;overscroll-behavior:contain;scrollbar-gutter:stable;touch-action:pan-y}.th-panel:not([open]){width:max-content;max-width:100%;margin-left:auto;border-radius:999px}.th-panel:not([open])>summary{background:#5b5ce2;color:#fff;border-radius:999px;padding:11px 16px}.th-panel:not([open])>summary span{display:none}.th-panel:not([open])~.th-status-panel{display:none}
      .th-panel>summary,.th-status-panel>summary,.th-subsection>summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 14px;font:800 14px system-ui;color:#161b2c;cursor:pointer}.th-panel>summary::-webkit-details-marker,.th-status-panel>summary::-webkit-details-marker,.th-subsection>summary::-webkit-details-marker{display:none}.th-panel>summary{position:sticky;top:0;z-index:5;background:rgba(255,255,255,.96);backdrop-filter:blur(10px)}.th-panel>summary span{font-size:11px;color:#667085;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:60%}
      .th-mobile-config{background:#fff;padding:10px 12px 14px;display:grid;grid-template-columns:minmax(0,1fr);gap:9px;box-sizing:border-box;overflow:visible}.th-mobile-config *{box-sizing:border-box;min-width:0}.th-mobile-config label{font:700 11px/1.4 system-ui;color:#667085;display:flex;flex-direction:column;gap:4px}.th-mobile-config select,.th-mobile-config input{display:block;width:100%;max-width:100%;min-width:0;inline-size:100%;max-inline-size:100%;min-inline-size:0;font:700 14px system-ui;padding:10px 11px;border:1px solid #e3e6ef;border-radius:11px;background:#fff;color:#161b2c;overflow:hidden}.th-picker-field{display:flex;flex-direction:column;gap:4px}.th-picker-label{font:700 11px/1.4 system-ui;color:#667085}.th-custom-picker{display:flex;flex-direction:column;gap:6px}.th-custom-picker-trigger{width:100%;height:46px;border:1px solid #e3e6ef;border-radius:11px;background:#fff;color:#161b2c;font:800 14px system-ui;display:flex;align-items:center;justify-content:center;position:relative;cursor:pointer}.th-picker-arrow{position:absolute;right:12px;color:#667085}.th-picker-popover{position:static;width:100%;background:#fff;border:1px solid #dfe3ee;border-radius:14px;box-shadow:none;padding:10px;margin-top:0}.th-picker-popover[hidden]{display:none!important}.th-picker-value{display:none!important}.th-calendar-head{display:grid;grid-template-columns:38px 1fr 38px;align-items:center;gap:6px;margin-bottom:8px}.th-calendar-head strong{text-align:center;font:900 13px system-ui}.th-calendar-head button{height:34px;border:0;border-radius:9px;background:#f3f4f8;color:#344054;font-size:20px;cursor:pointer}.th-calendar-week,.th-calendar-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.th-calendar-week span{text-align:center;font:700 10px system-ui;color:#98a2b3;padding:3px 0}.th-calendar-grid button{height:34px;border:0;border-radius:9px;background:#f8f9fc;color:#344054;font:800 11px system-ui;cursor:pointer}.th-calendar-grid button.is-outside{opacity:.3}.th-calendar-grid button.is-selected{background:#5b5ce2;color:#fff}.th-calendar-grid button:hover{outline:1px solid #cfd0ff}.th-time-preview{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 10px;margin-bottom:10px;border:1px solid #eceef4;border-radius:10px;background:#f8f9fc}.th-time-preview span{font:700 10px system-ui;color:#98a2b3}.th-time-preview strong{font:900 14px system-ui;color:#344054}.th-time-section{display:flex;flex-direction:column;gap:5px;margin-bottom:8px}.th-time-section>strong{font:800 10px system-ui;color:#667085}.th-time-hour-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:4px}.th-time-minute-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:4px}.th-custom-picker .th-time-hour-grid button,.th-custom-picker .th-time-minute-grid button{height:28px;padding:0;border:1px solid #e4e7ec;border-radius:8px;background:#fff;color:#475467;font:800 10px system-ui;cursor:pointer}.th-custom-picker .th-time-hour-grid button:hover,.th-custom-picker .th-time-minute-grid button:hover{background:#f7f7ff;border-color:#c9cbff;color:#4b4cd3}.th-custom-picker .th-time-hour-grid button.is-selected,.th-custom-picker .th-time-minute-grid button.is-selected{background:#5b5ce2;color:#fff;border-color:#5b5ce2}.th-picker-actions{display:flex;justify-content:flex-end;padding-top:2px}.th-custom-picker .th-picker-confirm{flex:none;width:92px;min-height:32px;margin:0;border:0;border-radius:9px;padding:7px 12px;background:#5b5ce2;color:#fff;font:800 11px system-ui;cursor:pointer}.th-custom-picker .th-picker-confirm:hover{background:#4f50d8}
      .th-mobile-config input[type="date"],.th-mobile-config input[type="time"]{width:100%!important;max-width:100%!important;min-width:0!important;inline-size:100%!important;max-inline-size:100%!important;min-inline-size:0!important;overflow:hidden}
      .th-mobile-config input[type="date"]::-webkit-date-and-time-value,.th-mobile-config input[type="time"]::-webkit-date-and-time-value{min-width:0;width:100%;text-align:center}
      .th-mobile-config input[type="date"]::-webkit-datetime-edit,.th-mobile-config input[type="time"]::-webkit-datetime-edit{min-width:0;max-width:100%;overflow:hidden}
      .th-picker-shell{position:relative;display:flex;align-items:center;justify-content:center;width:100%;max-width:100%;height:46px;min-width:0;overflow:hidden;border:1px solid #e3e6ef;border-radius:11px;background:#fff;color:#161b2c}
      .th-picker-display{display:block;width:100%;max-width:100%;padding:0 38px 0 12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center;font:800 14px/46px system-ui;color:#161b2c;pointer-events:none}
      .th-picker-shell:after{content:'▾';position:absolute;right:12px;top:50%;transform:translateY(-50%);font:900 13px system-ui;color:#667085;pointer-events:none}
      .th-mobile-config .th-picker-native{position:absolute!important;inset:0!important;display:block!important;width:100%!important;max-width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;margin:0!important;padding:0!important;border:0!important;border-radius:11px!important;background:transparent!important;opacity:.001!important;color:transparent!important;-webkit-appearance:none!important;appearance:none!important;z-index:2;cursor:pointer}.th-shell.th-desktop-runtime .th-picker-native{pointer-events:none!important}.th-shell.th-desktop-runtime .th-picker-shell{cursor:pointer}
      .th-mobile-config .th-check{flex-direction:row;align-items:center;gap:8px}.th-mobile-config .th-check input{width:auto}.th-mobile-config small{font-weight:500;color:#98a2b3}.th-config-actions{display:flex;gap:8px;flex-wrap:wrap}.th-config-actions button,.th-subsection button,.th-inline-add button,.th-scan-button{flex:1;border:1px solid transparent;border-radius:11px;padding:11px 12px;background:#5b5ce2;color:#fff;font-weight:800;font-size:13px}.th-config-actions button.secondary,.th-subsection button.secondary,.th-view-toggle.secondary{background:#fff;color:#4b4cd3;border-color:#cfd0ff}.th-config-actions button:disabled,.th-subsection button:disabled,.th-inline-add button:disabled{background:#f0f2f8!important;color:#98a2b3!important;border-color:#e4e7ec!important;opacity:1}.th-section-title{font:900 12px system-ui;color:#344054;margin-top:5px;padding-top:8px;border-top:1px solid #eef0f5}.th-section-title:first-of-type{border-top:0}.th-scan-button{width:100%;background:#161b2c}.th-scan-button.secondary{background:#5b5ce2}.th-scan-result{font:600 11px/1.4 system-ui;color:#667085;background:#f6f7fb;border-radius:10px;padding:9px 10px}.th-storage-status{font:700 10px/1.3 system-ui;color:#667085;background:#f8f9fc;border:1px solid #eef0f5;border-radius:999px;padding:6px 9px;width:max-content;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.th-time-grid{display:flex;gap:7px;flex-wrap:wrap}.th-time-chip,.th-hour-chip{border:1px solid #dfe3ee;border-radius:999px;padding:8px 10px;background:#f7f8fb;color:#344054;font:800 12px system-ui}.th-time-chip.selected{background:#ececff;color:#4b4cd3;border-color:#cfd0ff}.th-time-chip b,.th-hour-chip b{display:inline-flex;align-items:center;justify-content:center;min-width:17px;height:17px;border-radius:999px;background:#5b5ce2;color:#fff;font-size:10px}.th-inline-add{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px}.th-inline-add button{flex:none}.th-theme-preview{display:grid;grid-template-columns:72px minmax(0,1fr);gap:10px;align-items:center;padding:9px;border:1px solid #eef0f5;border-radius:12px;background:#fbfcfe}.th-theme-preview img,.th-theme-placeholder{width:72px;height:72px;object-fit:cover;border-radius:10px;background:#eef0f5}.th-theme-placeholder{display:grid;place-items:center;font-size:28px}.th-theme-preview div:last-child{display:flex;flex-direction:column;gap:3px;min-width:0}.th-theme-preview strong{font:900 14px system-ui;color:#161b2c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.th-theme-preview span{font:700 11px system-ui;color:#667085}.th-theme-preview small{font:700 10px system-ui;color:#5b5ce2}.th-link-button{border:0;background:transparent;color:#5b5ce2;font:800 12px system-ui;text-align:left;padding:2px}.th-empty{font:600 11px system-ui;color:#98a2b3}.th-warning{font:600 10px/1.45 system-ui;color:#7a5b00;background:#fff8dd;border-radius:10px;padding:9px 10px}.th-subsection{border:1px solid #eef0f5;border-radius:12px;background:#fbfcfe}.th-subsection>summary{font-size:12px;padding:10px 11px}.th-subsection-body{display:grid;grid-template-columns:minmax(0,1fr);gap:8px;padding:0 10px 10px;min-width:0;max-width:100%;overflow:hidden}.th-subsection-body>label{min-width:0;max-width:100%}.th-divider{height:1px;background:#eef0f5;margin:2px 0}.th-status-panel{margin-top:7px}.th-status-panel>summary{gap:10px}.th-status-summary{min-width:0;max-width:68%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:right;font:700 10px/1.3 system-ui;color:#667085}.th-status-content{max-height:34vh;overflow:auto}.th-top-actions{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px}.th-view-toggle{flex:none!important;white-space:nowrap}.th-compact-summary{font:800 11px/1.35 system-ui;color:#344054;background:#f6f7fb;border-radius:10px;padding:9px 10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.th-help{font:600 10px/1.45 system-ui;color:#667085;background:#f6f7fb;border-radius:9px;padding:8px 9px}.th-sync-status{display:flex;align-items:center;justify-content:space-between;gap:8px;background:#f6f7fb;border-radius:9px;padding:8px 9px;font:700 10px/1.35 system-ui;color:#667085}.th-sync-status strong{color:#344054}.th-sync-status span{white-space:nowrap}

      /* Escape UI cards: keep native pickers, action hooks and storage unchanged. */
      .th-panel{border-radius:22px;border-color:#d9ddec;box-shadow:0 16px 48px rgba(22,27,44,.2)}
      .th-panel[open]{max-height:min(80dvh,820px)}
      .th-panel>summary{min-height:52px;padding:14px 16px;border-bottom:1px solid #e8eaf3;background:#fff}
      .th-panel>summary strong{font-size:16px;letter-spacing:-.3px}.th-panel>summary span{font-size:12px}
      .th-mobile-config{background:#f3f4fa;padding:12px;gap:12px}
      .th-card{display:grid;grid-template-columns:minmax(0,1fr);gap:12px;padding:14px;background:#fff;border:1px solid #e3e6f0;border-radius:16px;min-width:0}
      .th-card-heading{display:flex;align-items:center;gap:8px;color:#20263b;font-size:15px;font-weight:800;min-height:26px}
      .th-step{display:grid;place-items:center;width:26px;height:26px;border-radius:9px;background:#efedff;color:#5746bd;font-size:11px;font-weight:800}
      .th-mobile-config label{font-size:13px;line-height:1.5;color:#41495f;gap:6px}
      .th-mobile-config select,.th-mobile-config input:not([type=checkbox]):not([type=hidden]){font-size:16px;min-height:44px;border:1px solid #d7ddeb;border-radius:11px;background:#fff;color:#20263b;padding:10px 11px;max-width:100%}
      .th-mobile-config button{min-height:44px;border-radius:11px;font-size:13px;font-weight:750}
      .th-top-actions{grid-template-columns:minmax(0,1fr) auto;gap:8px}.th-scan-button{background:#343752}
      .th-scan-button.secondary,.th-mobile-config .secondary{background:#eef0f7;color:#41495f;border:1px solid #dfe3ee}
      .th-theme-preview{padding:10px;background:#f8f8fc;border-color:#eeeef6;border-radius:12px}
      .th-theme-preview strong{font-size:15px;white-space:normal;overflow-wrap:anywhere}.th-theme-preview span,.th-theme-preview small{font-size:12px}
      .th-compact-summary,.th-scan-result{font-size:12px;background:#f5f4fb;color:#51496e;white-space:normal;overflow-wrap:anywhere}
      .th-storage-status{font-size:11px;background:#fff;border-radius:8px;color:#626b80}
      .th-card>small,.th-card>a{font-size:12px;line-height:1.5;overflow-wrap:anywhere}
      .th-section-title{font-size:13px;line-height:1.5;padding-top:12px;margin-top:0;border-color:#edf0f6;color:#41495f}.th-section-title small{font-size:11px;color:#717a8d}
      .th-time-grid{gap:8px}.th-mobile-config .th-time-chip,.th-mobile-config .th-hour-chip{min-height:44px;min-width:64px;border-radius:12px;font-size:13px;padding:9px 10px}
      .th-time-chip.selected{background:#eeeafd;color:#5142ad;border-color:#c9bdf5}.th-time-chip b,.th-hour-chip b{background:#6651c9}
      .th-picker-label{font-size:13px;color:#41495f}.th-picker-shell,.th-custom-picker-trigger{min-height:44px!important;border-radius:11px!important}.th-picker-display{font-size:16px!important}
      .th-help{font-size:12px;line-height:1.6;color:#5c667b;background:#f4f6fa;padding:10px 11px;border-radius:11px}
      .th-warning{font-size:12px;line-height:1.55;padding:11px;background:#fff8e8;color:#705316}
      .th-open-display{display:grid;gap:5px;padding:13px;background:#f0ecff;border:1px solid #ded5fa;border-radius:12px}
      .th-open-display span{font-size:12px;color:#665795}.th-open-display strong{font-size:16px;line-height:1.5;color:#4a3695;overflow-wrap:anywhere}
      .th-readiness strong{color:#303b53}.th-readiness [data-opening-countdown]{margin-top:5px;color:#5540aa;font-weight:800}
      .th-mode-badge{margin-left:auto;font-size:11px;line-height:1.4;border:1px solid #e3ddf5;border-radius:999px;padding:4px 8px;background:#f8f5ff;color:#5a489b}
      .th-run-state{display:flex;align-items:center;gap:7px;font-size:12px;line-height:1.5;color:#4b5670;background:#f6f8fb;padding:9px 11px;border-radius:10px}
      .th-state-dot{width:7px;height:7px;flex:none;border-radius:50%;background:#7275a4}
      .th-config-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.th-config-actions button{width:100%;min-width:0}
      .th-execution-card [data-action=prepare]{background:#6651c9;color:#fff;border:1px solid #6651c9;min-height:48px;font-size:15px}.th-execution-card [data-action=stop]{min-height:48px}
      .th-subsection{background:#fff;border-color:#e3e6f0;border-radius:13px}.th-subsection>summary{min-height:44px;font-size:13px;padding:12px}
      .th-subsection>summary:after{content:'＋';color:#7a8193;font-size:16px;flex:none}.th-subsection[open]>summary:after{content:'−'}
      .th-subsection-body{gap:11px;padding:0 12px 12px;overflow:visible}.th-more-settings>.th-subsection-body{background:#f7f8fc;padding:12px;border-radius:0 0 13px 13px}
      .th-status-panel{border-radius:15px;box-shadow:0 6px 20px rgba(22,27,44,.1)}.th-status-panel>summary{font-size:12px;min-height:44px}.th-status-summary{font-size:11px}
      button:focus-visible,summary:focus-visible,select:focus-visible,input:focus-visible,a:focus-visible{outline:3px solid #b9a9f2;outline-offset:2px}
      @media(max-width:420px){.th-shell{width:calc(100vw - 24px);max-width:390px;right:max(8px,env(safe-area-inset-right))}.th-card{padding:12px}.th-mobile-config{padding:10px}.th-top-actions button{font-size:12px}}
    </style><div class="th-shell${isDesktopRuntime?' th-desktop-runtime':''}">${createMobileConfigMarkup(profiles,state,viewState,localUser,syncConfig)}<details class="th-status-panel"><summary><span>상태 / 상세</span><small class="th-status-summary">${esc((viewState.mode==='practice'?'연습':viewState.mode==='confirm'?'확정':'실전')+' · '+(viewState.statusText||'대기')+' · 오픈 '+(viewState.openingText||'확인 필요'))}</small></summary><div class="th-status-content">${deps.createAppMarkup?deps.createAppMarkup(viewState):''}</div></details></div>`;
    rootNode.querySelector('[data-action="prepare"]')?.addEventListener('click',()=>onPrepare?.(readConfig(rootNode)));
    rootNode.querySelector('[data-action="practice-now"]')?.addEventListener('click',()=>onPracticeNow?.(readConfig(rootNode)));
    rootNode.querySelector('[data-action="timing-test"]')?.addEventListener('click',()=>onTimingTest?.(readConfig(rootNode)));
    rootNode.querySelector('[data-action="stop"]')?.addEventListener('click',()=>onStop?.());
    rootNode.querySelector('[data-action="scan-current"]')?.addEventListener('click',()=>onScan?.(readConfig(rootNode)));
    rootNode.querySelector('[data-action="toggle-compact"]')?.addEventListener('click',()=>onToggleCompact?.());
    rootNode.querySelector('[data-action="scan-target-date"]')?.addEventListener('click',()=>onScanTargetDate?.(readConfig(rootNode)));
    rootNode.querySelector('[data-action="import-profiles"]')?.addEventListener('click',()=>onImport?.());
    rootNode.querySelector('[data-action="export-profiles"]')?.addEventListener('click',()=>onExport?.());
    rootNode.querySelector('[data-action="restore-auto-backup"]')?.addEventListener('click',()=>onRestoreBackup?.());
    rootNode.querySelector('[data-action="sync-test"]')?.addEventListener('click',()=>onSyncTest?.(readConfig(rootNode)));
    rootNode.querySelector('[data-action="sync-pull"]')?.addEventListener('click',()=>onSyncPull?.(readConfig(rootNode)));
    rootNode.querySelector('[data-action="sync-push"]')?.addEventListener('click',()=>onSyncPush?.(readConfig(rootNode)));
    for(const button of rootNode.querySelectorAll('[data-action="check-update"]'))button.addEventListener('click',()=>onCheckUpdate?.());
    rootNode.querySelector('[data-action="add-current"]')?.addEventListener('click',()=>onAddCurrent?.(readConfig(rootNode)));
    rootNode.querySelector('[data-action="clear-session-priority"]')?.addEventListener('click',()=>onClearSessionPriority?.(readConfig(rootNode)));
    const hourSelect=rootNode.querySelector('[data-field="hour-to-add"]');
    const hourAddButton=rootNode.querySelector('[data-action="add-hour"]');
    const syncHourAdd=()=>{if(hourAddButton)hourAddButton.disabled=!/^(?:[0-9]|1[0-9]|2[0-3])$/.test(String(hourSelect?.value||''));};
    hourSelect?.addEventListener('change',syncHourAdd); syncHourAdd();
    hourAddButton?.addEventListener('click',()=>{const raw=String(hourSelect?.value||'');if(!/^(?:[0-9]|1[0-9]|2[0-3])$/.test(raw))return;onAddHour?.(readConfig(rootNode),Number(raw));});
    for(const el of rootNode.querySelectorAll?.('[data-action="session-priority"]')||[]) el.addEventListener('click',()=>onSessionPriority?.(readConfig(rootNode),el.dataset.time));
    for(const el of rootNode.querySelectorAll?.('[data-action="remove-hour"]')||[]) el.addEventListener('click',()=>onRemoveHour?.(readConfig(rootNode),Number(el.dataset.hour)));
    const syncPickerDisplay=(el)=>{
      if(!el?.classList?.contains('th-picker-native'))return;
      const display=rootNode.querySelector?.(`[data-picker-display="${el.dataset.field}"]`);
      if(!display)return;
      display.textContent=el.type==='date'?formatDatePickerValue(el.value):formatTimePickerValue(el.value);
    };
    for(const el of rootNode.querySelectorAll?.('.th-picker-native')||[]){
      el.addEventListener('input',()=>syncPickerDisplay(el));
      el.addEventListener('change',()=>syncPickerDisplay(el));
    }
    if(isDesktopRuntime){
      for(const shell of rootNode.querySelectorAll?.('.th-picker-shell')||[]){
        shell.addEventListener('pointerdown',(event)=>{
          const el=shell.querySelector?.('.th-picker-native');
          if(!el)return;
          event.preventDefault();
          event.stopPropagation();
          if(typeof el.showPicker==='function'){try{el.showPicker();return;}catch{}}
          try{el.focus({preventScroll:true});}catch{try{el.focus()}catch{}}
          try{el.click();}catch{}
        });
      }
    }
    const setDesktopPickerOpen=(picker,open)=>{
      const pop=picker?.querySelector?.('.th-picker-popover');
      const arrow=picker?.querySelector?.('.th-picker-arrow');
      if(pop)pop.hidden=!open;
      picker?.classList?.toggle('is-open',!!open);
      if(arrow)arrow.textContent=open?'▴':'▾';
    };
    const closeDesktopPickers=(except=null)=>{
      for(const picker of rootNode.querySelectorAll?.('.th-custom-picker')||[]){
        if(picker===except)continue;
        setDesktopPickerOpen(picker,false);
      }
    };
    const renderDesktopCalendar=(picker,monthDate)=>{
      const grid=picker?.querySelector?.('[data-picker-calendar]');
      const label=picker?.querySelector?.('[data-picker-month-label]');
      if(!grid||!label)return;
      const y=monthDate.getFullYear(),m=monthDate.getMonth();
      picker.dataset.pickerMonth=`${y}-${String(m+1).padStart(2,'0')}`;
      label.textContent=`${y}년 ${m+1}월`;
      const first=new Date(y,m,1,12,0,0,0);
      const start=new Date(y,m,1-first.getDay(),12,0,0,0);
      const value=picker.querySelector?.('.th-picker-value')?.value||'';
      let html='';
      for(let i=0;i<42;i++){
        const d=new Date(start);d.setDate(start.getDate()+i);
        const v=localDateValue(d);
        html+=`<button type="button" data-action="picker-day" data-date="${v}" class="${d.getMonth()!==m?'is-outside ':''}${v===value?'is-selected':''}">${d.getDate()}</button>`;
      }
      grid.innerHTML=html;
    };
    for(const picker of rootNode.querySelectorAll?.('.th-custom-picker')||[]){
      const pop=picker.querySelector?.('.th-picker-popover');
      const value=picker.querySelector?.('.th-picker-value');
      picker.querySelector?.('[data-action="picker-toggle"]')?.addEventListener('click',(event)=>{
        event.preventDefault();event.stopPropagation();
        const willOpen=!!pop?.hidden;
        closeDesktopPickers(picker);
        setDesktopPickerOpen(picker,willOpen);
        if(willOpen&&picker.dataset.pickerType==='date'){
          const current=/^\d{4}-\d{2}-\d{2}$/.test(value?.value||'')?String(value.value):localDateValue(new Date());
          const [y,m]=current.split('-').map(Number);
          renderDesktopCalendar(picker,new Date(y,m-1,1,12,0,0,0));
        }
      });
      picker.querySelector?.('[data-action="picker-prev-month"]')?.addEventListener('click',(event)=>{
        event.preventDefault();event.stopPropagation();
        const key=picker.dataset.pickerMonth||localDateValue(new Date()).slice(0,7);
        const [y,m]=key.split('-').map(Number);
        renderDesktopCalendar(picker,new Date(y,m-2,1,12,0,0,0));
      });
      picker.querySelector?.('[data-action="picker-next-month"]')?.addEventListener('click',(event)=>{
        event.preventDefault();event.stopPropagation();
        const key=picker.dataset.pickerMonth||localDateValue(new Date()).slice(0,7);
        const [y,m]=key.split('-').map(Number);
        renderDesktopCalendar(picker,new Date(y,m,1,12,0,0,0));
      });
      picker.querySelector?.('[data-picker-calendar]')?.addEventListener('click',(event)=>{
        const button=event.target?.closest?.('[data-action="picker-day"]');
        if(!button||!value)return;
        event.preventDefault();event.stopPropagation();
        value.value=String(button.dataset.date||'');
        const display=rootNode.querySelector?.(`[data-picker-display="${value.dataset.field}"]`);
        if(display)display.textContent=formatDatePickerValue(value.value);
        setDesktopPickerOpen(picker,false);
        value.dispatchEvent(new Event('change',{bubbles:true}));
      });
      const refreshTimePreview=()=>{
        const current=picker.querySelector?.('[data-picker-current]');
        if(!current)return;
        const hour=picker.querySelector?.('[data-action="picker-hour"].is-selected')?.dataset?.pickerHour||'10';
        const minute=picker.querySelector?.('[data-action="picker-minute"].is-selected')?.dataset?.pickerMinute||'00';
        current.textContent=formatTimePickerValue(`${hour}:${minute}`);
      };
      picker.querySelector?.('.th-time-hour-grid')?.addEventListener('click',(event)=>{
        const button=event.target?.closest?.('[data-action="picker-hour"]');
        if(!button)return;
        event.preventDefault();event.stopPropagation();
        for(const el of picker.querySelectorAll?.('[data-action="picker-hour"]')||[])el.classList.toggle('is-selected',el===button);
        refreshTimePreview();
      });
      picker.querySelector?.('.th-time-minute-grid')?.addEventListener('click',(event)=>{
        const button=event.target?.closest?.('[data-action="picker-minute"]');
        if(!button)return;
        event.preventDefault();event.stopPropagation();
        for(const el of picker.querySelectorAll?.('[data-action="picker-minute"]')||[])el.classList.toggle('is-selected',el===button);
        refreshTimePreview();
      });
      picker.querySelector?.('[data-action="picker-confirm"]')?.addEventListener('click',(event)=>{
        if(!value)return;
        event.preventDefault();event.stopPropagation();
        const hour=picker.querySelector?.('[data-action="picker-hour"].is-selected')?.dataset?.pickerHour||'10';
        const minute=picker.querySelector?.('[data-action="picker-minute"].is-selected')?.dataset?.pickerMinute||'00';
        value.value=`${hour}:${minute}`;
        const display=rootNode.querySelector?.(`[data-picker-display="${value.dataset.field}"]`);
        if(display)display.textContent=formatTimePickerValue(value.value);
        setDesktopPickerOpen(picker,false);
        value.dispatchEvent(new Event('change',{bubbles:true}));
      });
    }
    const wheelScroll=(target,event)=>{
      if(!target)return;
      const max=Math.max(0,Number(target.scrollHeight||0)-Number(target.clientHeight||0));
      const delta=Number(event.deltaY||0);
      if(max<=0||!delta)return;
      target.scrollTop=Math.max(0,Math.min(max,Number(target.scrollTop||0)+delta));
      event.preventDefault();
      event.stopPropagation();
    };
    const mainPanel=rootNode.querySelector?.('.th-panel');
    mainPanel?.addEventListener('wheel',(event)=>{
      if(mainPanel.open)wheelScroll(mainPanel,event);
    },{passive:false,capture:true});
    const statusContent=rootNode.querySelector?.('.th-status-content');
    statusContent?.addEventListener('wheel',(event)=>wheelScroll(statusContent,event),{passive:false,capture:true});
    for(const el of rootNode.querySelectorAll?.('[data-field]')||[]){
      const field=String(el.dataset?.field||'');
      if(field.startsWith('new-')||field==='hour-to-add') continue;
      if(field.startsWith('sync-')){el.addEventListener('change',()=>onSyncConfig?.(readConfig(rootNode)));continue;}
      el.addEventListener('change',()=>onChange?.(readConfig(rootNode),field,fieldNeedsRerender(field)));
      if(field==='local-name'||field==='local-phone') el.addEventListener('input',()=>onLocalUserInput?.(readConfig(rootNode)));
    }
    updatePreparationStatus(rootNode,reservationReadiness(profiles.find(p=>p.id===state.profileId),state,localUser));
    restorePanelUiState(rootNode,previousUi);
    return rootNode;
  }

  function readConfig(rootNode){return {
    siteId:rootNode.querySelector('[data-field="site"]')?.value||'',branchId:rootNode.querySelector('[data-field="branch"]')?.value||'',profileId:rootNode.querySelector('[data-field="profile"]')?.value||'',
    targetDate:rootNode.querySelector('[data-field="target-date"]')?.value||'',mode:rootNode.querySelector('[data-field="mode"]')?.value||'practice',fallbackEnabled:false,
    captchaAutoResume:!!rootNode.querySelector('[data-field="captcha-auto-resume"]')?.checked,maxPaymentAmount:rootNode.querySelector('[data-field="max-payment-amount"]')?.value||'',
    localParticipants:rootNode.querySelector('[data-field="local-participants"]')?.value||'',localName:rootNode.querySelector('[data-field="local-name"]')?.value||'',localPhone:rootNode.querySelector('[data-field="local-phone"]')?.value||'',
    profileThemeName:rootNode.querySelector('[data-field="profile-theme-name"]')?.value||'',profileBranchName:rootNode.querySelector('[data-field="profile-branch-name"]')?.value||'',profileDaysBefore:rootNode.querySelector('[data-field="profile-days-before"]')?.value||'',profileOpenTime:rootNode.querySelector('[data-field="profile-open-time"]')?.value||'',
    newBranchName:rootNode.querySelector('[data-field="new-branch-name"]')?.value||'',newThemeName:rootNode.querySelector('[data-field="new-theme-name"]')?.value||'',newDaysBefore:rootNode.querySelector('[data-field="new-days-before"]')?.value||'',newOpenTime:rootNode.querySelector('[data-field="new-open-time"]')?.value||'',
    syncRepo:rootNode.querySelector('[data-field="sync-repo"]')?.value||'',syncToken:rootNode.querySelector('[data-field="sync-token"]')?.value||'',syncAuto:!!rootNode.querySelector('[data-field="sync-auto"]')?.checked
  };}

  return {buildOverlayState,catalogFromProfiles,resolveSelection,createMobileConfigMarkup,applyMobilePriorityConfig,applyMobileProfileConfig,safeImageUrl,reservationReadiness,formatOpeningCountdown,updatePreparationStatus,fieldNeedsRerender,createPanelRenderScheduler,capturePanelUiState,restorePanelUiState,mountUserscriptPanel,readConfig};
});


/* apps/userscript/src/entry.js */
(function (root, factory) {
  const api=factory(root.TicketHelper||{},root);
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.TicketHelper=Object.assign(root.TicketHelper||{},api);
  if(typeof window!=='undefined'&&typeof document!=='undefined'&&!(typeof module==='object'&&module.exports)) api.bootTicketHelper().catch(err=>api.renderBootError?.(err,document));
})(typeof globalThis!=='undefined'?globalThis:this,function(deps,hostRoot){
  'use strict';
  const BOOT_KEY='__ticketHelperBootClaimed';
  const UPDATE_META_URL='https://raw.githubusercontent.com/omjun0807-del/ticket-helper-release/main/ticket-helper.meta.js';
  const UPDATE_DOWNLOAD_URL='https://raw.githubusercontent.com/omjun0807-del/ticket-helper-release/main/ticket-helper.user.js';
  const UPDATE_INTERVAL_MS=6*60*60*1000;

  function parseUserscriptMetaVersion(text){
    const m=/^\s*\/\/\s*@version\s+([^\s]+)\s*$/mi.exec(String(text||''));
    return m?m[1].trim():'';
  }
  function compareVersions(a,b){
    const aa=String(a||'').split('.').map(x=>Number.parseInt(x,10)||0), bb=String(b||'').split('.').map(x=>Number.parseInt(x,10)||0);
    const n=Math.max(aa.length,bb.length);
    for(let i=0;i<n;i++){const av=aa[i]||0,bv=bb[i]||0;if(av>bv)return 1;if(av<bv)return -1;}
    return 0;
  }

  function renderBootError(error,doc=hostRoot.document){
    if(!doc)return null;
    const id='ticket-helper-boot-error';
    const existing=doc.getElementById?.(id); if(existing)return existing;
    const el=doc.createElement?.('div'); if(!el)return null;
    el.id=id;
    el.textContent=`Ticket Helper 오류: ${String(error?.message||error||'알 수 없는 오류')}`;
    Object.assign(el.style||{}, {position:'fixed',left:'10px',right:'10px',bottom:'10px',zIndex:'2147483647',background:'#b42318',color:'#fff',padding:'12px 14px',borderRadius:'12px',font:'700 13px -apple-system,BlinkMacSystemFont,sans-serif',boxShadow:'0 8px 28px rgba(0,0,0,.3)'});
    (doc.documentElement||doc.body)?.appendChild?.(el);
    return el;
  }

  function cleanDetectedThemeName(value){
    return String(value||'').replace(/\s*[:|\-]\s*네이버\s*예약.*$/i,'').replace(/\s*네이버\s*예약.*$/i,'').replace(/\s*[:|\-]\s*키이스케이프.*$/i,'').trim();
  }

  function isGenericDetectedThemeName(value){
    const normalized=String(value||'').normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
    if(!normalized)return true;
    const compact=normalized.replace(/[^0-9a-z가-힣]+/g,'');
    return new Set(['키이스케이프','keyescape','예약','reservation','reservationkeyescape','itskey','itskeyescape','네이버예약','naverbooking']).has(compact);
  }

  function detectThemeNameFromPage(doc=hostRoot.document){
    if(!doc)return '';
    const meta=doc.querySelector?.('meta[property="og:title"]')?.content;
    const candidates=[meta,doc.title,doc.querySelector?.('h1')?.textContent,doc.querySelector?.('h2')?.textContent];
    for(const value of candidates){const cleaned=cleanDetectedThemeName(value);if(cleaned&&cleaned.length<=80&&!isGenericDetectedThemeName(cleaned))return cleaned;}
    return '';
  }

  function detectThemeImageFromPage(doc=hostRoot.document){
    if(!doc)return '';
    for(const img of [...(doc.querySelectorAll?.('img')||[])]){
      const src=String(img?.src||img?.getAttribute?.('src')||'').trim();
      if(/^https?:\/\//i.test(src)&&/\/theme_info\//i.test(src)) return src;
    }
    const og=String(doc.querySelector?.('meta[property="og:image"]')?.content||'').trim();
    return /^https?:\/\//i.test(og)?og:'';
  }

  function detectCurrentPageContext(url=hostRoot.location?.href||'',doc=hostRoot.document,profiles=[]){
    const adapterId=deps.detectAdapterId?.(url)||null;
    let parsed; try{parsed=new URL(url);}catch{parsed=null;}
    let themeName=detectThemeNameFromPage(doc);
    let branchId='', branchName='', siteName='';
    if(adapterId==='keyescape'){
      siteName='키이스케이프';
      branchId=parsed?.searchParams.get('zizum_num')||'';
      const saved=(profiles||[]).find(p=>p.siteId==='keyescape'&&String(p.branchId||'')===String(branchId));
      branchName=saved?.branchName||'';
      const selectedLabels=[...(doc?.querySelectorAll?.('select')||[])].map((sel)=>{
        const option=sel?.selectedOptions?.[0]||sel?.options?.[sel?.selectedIndex];
        return String(option?.textContent||option?.innerText||'').replace(/\s+/g,' ').trim();
      }).filter(Boolean);
      if(selectedLabels[0]&&!/선택|지점/i.test(selectedLabels[0])) branchName=selectedLabels[0];
      if(selectedLabels[1]&&!/선택|테마/i.test(selectedLabels[1])&&!isGenericDetectedThemeName(selectedLabels[1])) themeName=selectedLabels[1];
      if(isGenericDetectedThemeName(themeName)) themeName='';
      if(!branchName){
        const body=String(doc?.body?.innerText||doc?.body?.textContent||'');
        const known=['우주라이크','더오름','STATION','메모리컴퍼니','LOG_IN 1','LOG_IN 2','후즈데어','강남점','홍대점','부산점','전주점','무비무드'];
        branchName=known.find(x=>body.includes(x))||'';
      }
    }else if(adapterId==='naver-booking'){
      siteName='네이버 예약';
      branchId=(/\/bizes\/(\d+)/i.exec(parsed?.pathname||'')||[])[1]||'';
      const saved=(profiles||[]).find(p=>p.siteId==='naver-booking'&&String(p.branchId||'')===String(branchId));
      const title=cleanDetectedThemeName(doc?.title||'');
      branchName=saved?.branchName||((title&&title!==themeName)?title:'');
    }
    const matched=parsed&&(profiles||[]).find(p=>{
      try{
        const booking=new URL(p.themeBookingUrl||p.bookingUrl);
        const host=v=>v.replace(/^www\.|^m\./,'');
        if(host(booking.hostname)!==host(parsed.hostname)||booking.pathname.replace(/\/$/,'')!==parsed.pathname.replace(/\/$/,''))return false;
        return [...booking.searchParams.entries()].every(([key,value])=>['date','rev_days','startDateTime','_th_reset'].includes(key)||parsed.searchParams.get(key)===value);
      }catch{return false;}
    });
    if(matched){siteName=matched.siteName;branchId=matched.branchId;branchName=matched.branchName;themeName=matched.themeName;}
    return {adapterId,siteId:matched?.siteId||adapterId,siteName,branchId,branchName,themeName,imageUrl:matched?.imageUrl||detectThemeImageFromPage(doc),url:String(url||'')};
  }

  function createProfileFromCurrentPage(input={},helpers=deps){
    const url=String(input.url||'');
    const adapterId=helpers.detectAdapterId?.(url);
    if(!adapterId) throw new Error('지원하는 예약 페이지가 아닙니다.');
    if(!['keyescape','naver-booking'].includes(adapterId))throw new Error('이 사이트는 기본 카탈로그의 테마를 선택해 주세요. 새 테마 개별 등록은 현재 키이스케이프·네이버 예약에서 지원합니다.');
    const themeName=String(input.themeName||'').trim();
    const branchName=String(input.branchName||'').trim();
    if(!themeName) throw new Error('테마명을 입력하세요.');
    const daysBefore=Number(input.daysBefore);
    if(!Number.isInteger(daysBefore)||daysBefore<0||daysBefore>60) throw new Error('오픈 D- 값을 0~60으로 입력하세요.');
    const openTime=String(input.openTime||'').trim();
    if(!/^\d{2}:\d{2}$/.test(openTime)) throw new Error('오픈 시각을 입력하세요.');
    const parsed=new URL(url);
    let id='';
    if(adapterId==='naver-booking'){
      if(!/\/items\/\d+/i.test(parsed.pathname)) throw new Error('네이버는 예약할 테마를 눌러 상세 예약 페이지에서 등록하세요.');
      parsed.searchParams.delete('startDateTime');
      const m=/\/bizes\/(\d+)\/items\/(\d+)/i.exec(parsed.pathname);
      id=m?`naver-booking-${m[1]}-${m[2]}`:`naver-booking-${encodeURIComponent(themeName).slice(0,40)}`;
    }else if(adapterId==='keyescape'){
      if(!/reservation1\.php$/i.test(parsed.pathname)) throw new Error('키이스케이프는 예약 바로가기에서 원하는 테마 예약 화면을 연 뒤 등록하세요.');
      const branch=parsed.searchParams.get('zizum_num')||'branch';
      const theme=parsed.searchParams.get('theme_num')||parsed.searchParams.get('theme_info_num')||encodeURIComponent(themeName).slice(0,24);
      id=`keyescape-${branch}-${theme}`;
    }
    let branchId='';
    if(adapterId==='keyescape') branchId=parsed.searchParams.get('zizum_num')||'';
    if(adapterId==='naver-booking') branchId=(/\/bizes\/(\d+)/i.exec(parsed.pathname)||[])[1]||'';
    return {id,siteId:adapterId,siteName:adapterId==='keyescape'?'키이스케이프':'네이버 예약',branchId,branchName,themeName,bookingUrl:parsed.toString(),adapterId,
      openingRule:{daysBefore,openTime,timezone:'Asia/Seoul',prefireMs:350,retryOffsetsMs:[120,420]},timePriorities:[],allowAnyFallback:true,fallbackThemeIds:[],favorite:true,sessionTemplates:{},imageUrl:String(input.imageUrl||''),sourceNote:'모바일 현재 페이지에서 등록 — 오픈 규칙 확인 필요'};
  }

  function selectProfileForPageContext(profiles=[],context={},preferredId=''){
    const preferred=(profiles||[]).find(p=>p.id===preferredId); if(preferred)return preferred;
    const norm=(v)=>String(v||'').normalize('NFKC').toLowerCase().replace(/[^0-9a-z가-힣]+/g,'');
    const exact=(profiles||[]).find(p=>String(p.siteId||p.adapterId||'')===String(context.siteId||context.adapterId||'')&&String(p.branchId||'')===String(context.branchId||'')&&norm(p.themeName)===norm(context.themeName));
    if(exact)return exact;
    const branch=(profiles||[]).find(p=>String(p.siteId||p.adapterId||'')===String(context.siteId||context.adapterId||'')&&String(p.branchId||'')===String(context.branchId||''));
    return branch||(profiles||[])[0]||null;
  }

  function deriveFallbackContinuation(result,profiles,state,helpers=deps){
    if(!state?.fallbackEnabled||result?.stage!=='fallback'||!result.nextProfileId)return null;
    const next=(profiles||[]).find(p=>p.id===result.nextProfileId);
    if(!next)return null;
    const url=typeof helpers.prepareProfileTargetUrl==='function'?helpers.prepareProfileTargetUrl(next,state.targetDate):(typeof helpers.prepareTargetUrl==='function'?helpers.prepareTargetUrl(next.adapterId,next.themeBookingUrl||next.bookingUrl,state.targetDate):(next.themeBookingUrl||next.bookingUrl));
    return {profileId:next.id,url,fallbackCursor:result.fallbackCursor,autoContinue:true};
  }

  async function handleRunResult({result,profiles,state,storage,helpers=deps,navigate=(url)=>{hostRoot.location.href=url}}={}){
    const transition=deriveFallbackContinuation(result,profiles,state,helpers);
    if(transition){
      const nextState={...state,profileId:transition.profileId};
      await storage.setSettings(nextState);
      const checkpoint=helpers.createPersistedCheckpoint({profileId:transition.profileId,stage:'selecting-date',targetDate:state.targetDate,mode:state.mode,fallbackCursor:transition.fallbackCursor,now:Date.now,extra:{events:result.events||[],autoContinue:true}});
      await storage.setCheckpoint(checkpoint);
      navigate(transition.url);
      return {continuing:true,checkpoint,state:nextState,url:transition.url,result};
    }
    const checkpoint=helpers.createPersistedCheckpoint({profileId:state.profileId,stage:result.stage,targetDate:state.targetDate,mode:state.mode,fallbackCursor:result.fallbackCursor,now:Date.now,extra:{events:result.events||[],autoContinue:false,sessionLabel:result.session||''}});
    await storage.setCheckpoint(checkpoint);
    return {continuing:false,checkpoint,state,result};
  }

  function createScheduleObserver(storage){
    return async ({profileId,targetDate,sessions})=>{
      if(storage?.saveObservedSchedule) return storage.saveObservedSchedule(profileId,targetDate,sessions,Date.now());
      return null;
    };
  }

  function claimBoot(target=hostRoot,version='v0.1'){
    if(!target)return false;
    if(target[BOOT_KEY]) return false;
    target[BOOT_KEY]={version,at:Date.now()}; return true;
  }

  function sameUrl(a,b){
    if(typeof deps.sameBookingLocation==='function')return deps.sameBookingLocation(a,b);
    try{return new URL(a).href===new URL(b).href}catch{return String(a||'')===String(b||'')}
  }

  function expectedUserscriptResumePage(profile,checkpoint,doc=hostRoot.document,win=hostRoot){
    if(checkpoint?.stage!=='filling-form'&&checkpoint?.stage!=='awaiting-captcha')return true;
    if(profile?.adapterId==='keyescape')return /reservation2\.php$/i.test(win?.location?.pathname||'');
    if(profile?.adapterId==='naver-booking'){
      const body=String(doc?.body?.innerText||doc?.body?.textContent||'');
      return /동의하고\s*결제하기/.test(body)||/\/request(?:\/|$)/i.test(win?.location?.pathname||'');
    }
    if(profile?.adapterId==='tonybilly')return /\/reservation\/create(?:\/|$)/i.test(win?.location?.pathname||'');
    if(profile?.adapterId==='beatphobia')return new URL(win.location.href).searchParams.get('go')==='rev.make';
    if(profile?.adapterId==='doom')return new URL(win.location.href).searchParams.get('go')==='rev.make.input';
    if(profile?.adapterId==='zeroworld')return !!doc?.querySelector?.('input[name="theme_time_num"]')?.value;
    return false;
  }

  function createArmedCheckpoint(profile,state,helpers=deps,nowMs=Date.now()){
    if(state?.bypassOpeningSchedule===true)return null;
    if(!profile?.openingRule||!state?.targetDate||typeof helpers.createOpenTrigger!=='function')return null;
    let trigger;
    try{trigger=helpers.createOpenTrigger(state.targetDate,profile.openingRule);}catch{return null;}
    if(profile.adapterId==='keyescape'&&Number.isFinite(trigger.openAtMs))trigger.attemptsMs=[...new Set([...(trigger.attemptsMs||[]),trigger.openAtMs+900,trigger.openAtMs+1600])].sort((a,b)=>a-b);
    const last=trigger.attemptsMs?.[trigger.attemptsMs.length-1];
    if(!Number.isFinite(last)||nowMs>last+1500)return null;
    return helpers.createPersistedCheckpoint({profileId:profile.id,stage:'armed',targetDate:state.targetDate,mode:state.mode||'practice',fallbackCursor:state.fallbackCursor,now:()=>nowMs,extra:{autoContinue:true,openTrigger:trigger,events:[]}});
  }

  function nextArmedAction(checkpoint,nowMs=Date.now(),helpers=deps){
    if(!checkpoint?.openTrigger||typeof helpers.nextOpenTriggerAction!=='function')return {kind:'exhausted',state:checkpoint?.openTrigger};
    return helpers.nextOpenTriggerAction(checkpoint.openTrigger,nowMs);
  }

  function createTimingTestCheckpoint(profile,state={},helpers=deps,nowMs=Date.now(),delayMs=10000){
    if(!profile?.id||!state?.targetDate||typeof helpers.createPersistedCheckpoint!=='function')return null;
    const wait=Math.max(1000,Math.round(Number(delayMs)||10000));
    const openTrigger={version:1,targetDate:state.targetDate,openAtMs:nowMs+wait,attemptsMs:[nowMs+wait],nextIndex:0,testMode:true};
    return helpers.createPersistedCheckpoint({profileId:profile.id,stage:'armed',targetDate:state.targetDate,mode:'practice',fallbackCursor:state.fallbackCursor,now:()=>nowMs,extra:{autoContinue:true,openTrigger,events:[],timingTest:true}});
  }

  function calendarResetNavigationUrl(url,now=Date.now()){
    try{
      const u=new URL(url,hostRoot.location?.href||'https://www.keyescape.com/');
      u.searchParams.set('_th_reset',String(now));
      return u.toString();
    }catch{return String(url||'');}
  }

  async function scanTargetDateSessions({profile,targetDate,doc=hostRoot.document,win=hostRoot,helpers=deps,pollMs=80,maxWaitMs=8000,skipLocationNavigation=false,sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms))}={}){
    if(!profile) return {ok:false,stage:'profile-missing',message:'테마를 먼저 선택하세요.'};
    if(!/^\d{4}-\d{2}-\d{2}$/.test(String(targetDate||''))) return {ok:false,stage:'date-missing',message:'목표 날짜를 먼저 선택하세요.'};
    const targetUrl=typeof helpers.prepareProfileTargetUrl==='function'?helpers.prepareProfileTargetUrl(profile,targetDate):(typeof helpers.prepareTargetUrl==='function'?helpers.prepareTargetUrl(profile.adapterId,profile.themeBookingUrl||profile.bookingUrl,targetDate):(profile.themeBookingUrl||profile.bookingUrl));
    const currentUrl=String(win?.location?.href||'');
    const locationMatches=typeof helpers.sameBookingLocation==='function'?helpers.sameBookingLocation(currentUrl,targetUrl):(!currentUrl||!targetUrl||currentUrl===targetUrl);
    if(currentUrl&&targetUrl&&!locationMatches&&!skipLocationNavigation) return {ok:false,stage:'navigating',message:'선택한 지점 예약 페이지로 이동합니다.',navigateTo:targetUrl};
    const adapter=helpers.createPageAdapter?.(profile,doc,win);
    if(!adapter) return {ok:false,stage:'adapter-missing',message:'현재 페이지에서 예약 어댑터를 만들 수 없습니다.'};
    if(typeof adapter.selectTheme==='function'){
      const themeSelected=await adapter.selectTheme(profile.themeName);
      if(!themeSelected?.ok)return themeSelected;
    }
    const selected=await adapter.selectTargetDate(targetDate);
    if(!selected?.ok){
      if(selected?.navigateTo) return {...selected,ok:false,navigateTo:selected.navigateTo};
      const calendarResetNeeded=profile.adapterId==='keyescape'
        && selected?.stage==='date-missing'
        && /calendar|month\s+header/i.test(String(selected?.message||''));
      if(calendarResetNeeded&&currentUrl&&targetUrl&&locationMatches){
        return {ok:false,stage:'calendar-reset-required',message:'시간 화면에서 달력 복귀에 실패해 예약 페이지를 새로 열고 자동으로 다시 시도합니다.',reloadCurrentPage:true,navigateTo:targetUrl};
      }
      return selected||{ok:false,stage:'date-missing',message:'목표 날짜를 선택하지 못했습니다.'};
    }
    const started=Date.now();
    while(true){
      let sessions=[];
      try{sessions=await adapter.readSessions();}catch(err){
        if(Date.now()-started>=maxWaitMs) return {ok:false,stage:err?.stage||'sessions-not-loaded',message:String(err?.message||err)};
      }
      if(Array.isArray(sessions)&&sessions.length) return {ok:true,sessions};
      if(Date.now()-started>=maxWaitMs) return {ok:false,stage:'sessions-not-loaded',message:'목표 날짜 회차가 아직 표시되지 않았습니다.'};
      await sleep(pollMs);
    }
  }

  async function bootTicketHelper(){
    if(!claimBoot(hostRoot,'v0.1')) return false;
    const doc=hostRoot.document;
    if(!doc.documentElement||doc.readyState==='loading') await new Promise(resolve=>doc.addEventListener('DOMContentLoaded',resolve,{once:true}));
    const injectedGM=(typeof GM!=='undefined'&&GM)?GM:null; const gm=deps.createBrowserGM(hostRoot,injectedGM),storage=deps.createTicketStorage(gm);
    let profiles=await storage.getProfiles();
    const settings=await storage.getSettings();
    if(typeof deps.mergeBuiltinCatalog==='function'&&typeof deps.getBuiltinCatalogProfiles==='function'&&settings.catalogSeedVersion!==deps.BUILTIN_CATALOG_VERSION){
      profiles=deps.mergeBuiltinCatalog(profiles,deps.getBuiltinCatalogProfiles());
      await storage.setProfiles(profiles);
      settings.catalogSeedVersion=deps.BUILTIN_CATALOG_VERSION;
      await storage.setSettings(settings);
    }
    let checkpoint=await storage.getCheckpoint();
    let localUser=await storage.getLocalUser()||{};
    let syncConfig=await storage.getSyncConfig?.()||{repoFullName:'omjun0807-del/ticket-helper-private',token:'',autoSync:false,deviceId:''};
    if(!syncConfig.repoFullName)syncConfig.repoFullName='omjun0807-del/ticket-helper-private';
    if(!syncConfig.deviceId){syncConfig.deviceId='device-'+Math.random().toString(36).slice(2,10)+'-'+Date.now().toString(36);await storage.setSyncConfig?.(syncConfig);}
    let syncState=await storage.getSyncState?.()||{localUpdatedAt:0,lastRemoteUpdatedAt:0,lastSyncAt:0,dirty:false,status:'연결 안 됨'};
    const host=doc.createElement('div');host.id='ticket-helper-root';doc.documentElement.appendChild(host);
    const currentId=settings.profileId||checkpoint?.profileId||'';
    const bootContext=detectCurrentPageContext(hostRoot.location.href,doc,profiles);
    const initialProfile=selectProfileForPageContext(profiles,bootContext,currentId);
    const state={profileId:initialProfile?.id||'',siteId:settings.siteId||initialProfile?.siteId||'',branchId:String(settings.branchId||initialProfile?.branchId||''),targetDate:settings.targetDate||checkpoint?.targetDate||'',mode:settings.mode||checkpoint?.mode||'practice',fallbackEnabled:false,captchaAutoResume:settings.captchaAutoResume!==false,maxPaymentAmount:'',compactView:true,lastUpdateCheckAt:Number(settings.lastUpdateCheckAt||0),updateRemoteVersion:compareVersions(String(settings.updateRemoteVersion||'0'),String(hostRoot.TICKET_HELPER_VERSION||'0.1.51'))>0?String(settings.updateRemoteVersion):''};
    let runGeneration=0,activeRun=null;
    let reloadTimer=null, pageScan=null, backupInfo=await storage.getAutoBackup?.()||null, localUserSaveTimer=null, syncTimer=null, syncBusy=false, syncStatusText=String(syncState.status||'연결 안 됨');

    function selectedProfile(){return profiles.find(p=>p.id===state.profileId)||profiles[0]||null;}
    function viewData(){
      const p=selectedProfile();
      const schedule=p?deps.resolveSessionSchedule(state.targetDate||new Date().toISOString().slice(0,10),[],p.sessionTemplates||{}):{source:'none',times:[],userPriority:[]};
      const fallbackThemes=(p?.fallbackThemeIds||[]).map(id=>profiles.find(x=>x.id===id)?.themeName||id);
      let openingText='자동 계산';
      try{if(p?.openingRule&&state.targetDate&&deps.calculateOpeningInstant){const d=deps.calculateOpeningInstant(state.targetDate,p.openingRule);openingText=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(d);}}catch{}
      const ctx=detectCurrentPageContext(hostRoot.location.href,doc,profiles);
      const isBookingPage=(ctx.adapterId==='keyescape'&&/reservation1\.php|reservation2\.php/i.test(hostRoot.location.pathname||''))||(ctx.adapterId==='naver-booking'&&/\/items\/\d+|\/request/i.test(hostRoot.location.pathname||''))||(['tonybilly','zeroworld','doom','beatphobia'].includes(ctx.adapterId)&&/reservation|home\.php/i.test(hostRoot.location.pathname||''));
      const viewState=deps.buildOverlayState(p,schedule,{...state,openingText,fallbackThemes,adapterHealth:ctx.adapterId==='manual'?'목록·링크 지원':ctx.adapterId?'연습으로 확인 필요':'지원 페이지 아님',detectedThemeName:ctx.themeName,detectedBranchName:ctx.branchName,pageScan,panelOpen:isBookingPage||!!checkpoint,storageKind:storage.storageKind||gm.storageKind||'userscripts-gm',savedThemeCount:profiles.length,backupAt:Number(backupInfo?.at||0),compactView:state.compactView!==false});
      viewState.installedVersion=String(hostRoot.TICKET_HELPER_VERSION||'0.1.51');
      viewState.extensionVersion=String(hostRoot.TICKET_HELPER_EXTENSION?.version||'');
      viewState.desktopUserscript=!viewState.extensionVersion&&!!hostRoot.TICKET_HELPER_DESKTOP_RUNTIME;
      viewState.updateRemoteVersion=state.updateRemoteVersion||"";
      viewState.syncStatusText=syncStatusText;
      viewState.syncLastAt=Number(syncState.lastSyncAt||0);
      return {profile:p,schedule,viewState};
    }

    async function persistConfig(cfg,changedField){
      if(changedField==='site'){
        const matches=profiles.filter(p=>p.siteId===cfg.siteId); const first=matches[0];
        state.siteId=cfg.siteId; state.branchId=String(first?.branchId||''); state.profileId=first?.id||'';
      }else if(changedField==='branch'){
        const matches=profiles.filter(p=>p.siteId===(cfg.siteId||state.siteId)&&String(p.branchId||'')===String(cfg.branchId||'')); const first=matches[0];
        state.siteId=cfg.siteId||state.siteId; state.branchId=String(cfg.branchId||''); state.profileId=first?.id||'';
      }else if(changedField==='profile'){
        const p=profiles.find(x=>x.id===cfg.profileId); state.profileId=cfg.profileId; state.siteId=p?.siteId||cfg.siteId||state.siteId; state.branchId=String(p?.branchId||cfg.branchId||state.branchId||'');
      }
      const settingsCfg={profileId:state.profileId||cfg.profileId,siteId:state.siteId||cfg.siteId,branchId:state.branchId||cfg.branchId,targetDate:cfg.targetDate,mode:cfg.mode,fallbackEnabled:false,captchaAutoResume:cfg.captchaAutoResume,maxPaymentAmount:cfg.maxPaymentAmount,compactView:state.compactView!==false};
      Object.assign(state,settingsCfg); await storage.setSettings(state); backupInfo=await storage.getAutoBackup?.()||backupInfo;
      if(changedField==='local-name'||changedField==='local-phone'||changedField==='local-participants'||changedField==='prepare'){localUser={name:cfg.localName||'',phone:cfg.localPhone||'',participants:cfg.localParticipants||''};await storage.setLocalUser(localUser);}
      if(['profile-theme-name','profile-branch-name','profile-days-before','profile-open-time','prepare'].includes(changedField)){
        profiles=typeof deps.applyMobileProfileConfig==='function'?deps.applyMobileProfileConfig(profiles,cfg):deps.applyMobilePriorityConfig(profiles,cfg);
        await storage.setProfiles(profiles); backupInfo=await storage.getAutoBackup?.()||backupInfo;
      }
      if(['site','branch','profile','fallback','profile-theme-name','profile-branch-name','profile-days-before','profile-open-time'].includes(changedField))await markSyncDirty();
      return settingsCfg;
    }

    function syncUiConfig(){return {repoFullName:syncConfig.repoFullName||'omjun0807-del/ticket-helper-private',autoSync:!!syncConfig.autoSync,hasToken:!!String(syncConfig.token||'').trim()};}
    async function saveSyncConfigFromUi(cfg={}){
      const repo=String(cfg.syncRepo||syncConfig.repoFullName||'omjun0807-del/ticket-helper-private').trim();
      if(repo)syncConfig.repoFullName=repo;
      if(String(cfg.syncToken||'').trim())syncConfig.token=String(cfg.syncToken).trim();
      syncConfig.autoSync=!!cfg.syncAuto;
      await storage.setSyncConfig?.(syncConfig);
      if(syncConfig.autoSync&&syncConfig.token)scheduleAutoSync(800);
      render();
    }
    function githubSyncClient(){
      if(typeof gm.xmlHttpRequest!=='function')throw new Error('현재 Userscripts에서 GitHub 요청 기능을 사용할 수 없습니다.');
      if(!String(syncConfig.token||'').trim())throw new Error('GitHub 동기화 토큰을 먼저 입력해 주세요.');
      return deps.createGitHubSyncClient({request:(details)=>gm.xmlHttpRequest(details),repoFullName:syncConfig.repoFullName||'omjun0807-del/ticket-helper-private'});
    }
    async function setSyncState(next){syncState={...syncState,...next};await storage.setSyncState?.(syncState);syncStatusText=String(syncState.status||syncStatusText||'대기');}
    async function markSyncDirty(){await setSyncState({localUpdatedAt:Date.now(),dirty:true,status:syncConfig.autoSync&&syncConfig.token?'변경 감지 · 동기화 대기':'로컬 변경 있음'});if(syncConfig.autoSync&&syncConfig.token)scheduleAutoSync(1600);}
    function scheduleAutoSync(delay=1600){if(!syncConfig.autoSync||!syncConfig.token)return;if(syncTimer!==null)hostRoot.clearTimeout?.(syncTimer);syncTimer=hostRoot.setTimeout?.(()=>{syncTimer=null;performGitHubSync('auto').catch(()=>{});},delay);}
    async function applyRemoteSync(remote){
      const payload=remote?.payload;
      if(!payload||Number(payload.schemaVersion)!==1||!Array.isArray(payload.profiles))throw new Error('원격 동기화 파일 형식이 올바르지 않습니다.');
      profiles=payload.profiles;
      const remoteSettings=deps.sanitizeSyncSettings(payload.settings||{});
      Object.assign(state,remoteSettings);
      const existing=await storage.getSettings();
      await storage.setProfiles(profiles);
      await storage.setSettings({...existing,...remoteSettings});
      await setSyncState({localUpdatedAt:Number(payload.updatedAt||Date.now()),lastRemoteUpdatedAt:Number(payload.updatedAt||0),lastSyncAt:Date.now(),dirty:false,status:'동기화 완료 · 내려받음'});
      render();return payload;
    }
    async function pushLocalSync(client,updatedAt=Date.now()){
      const stamp=Number(updatedAt)||Date.now();
      const payload=deps.buildSyncPayload(profiles,state,stamp,syncConfig.deviceId||'');
      await client.push(syncConfig.token,payload);
      await setSyncState({localUpdatedAt:stamp,lastRemoteUpdatedAt:stamp,lastSyncAt:Date.now(),dirty:false,status:'동기화 완료 · 업로드'});
      render();return payload;
    }
    async function performGitHubSync(mode='auto'){
      if(mode==='auto'&&(activeRun||checkpoint?.autoContinue)){scheduleAutoSync(5000);return {status:'deferred'};}
      if(syncBusy)return {status:'busy'};
      syncBusy=true;syncStatusText='GitHub 확인 중…';render();
      try{
        const client=githubSyncClient();
        const remote=await client.pull(syncConfig.token);
        if(mode==='test'){await setSyncState({lastSyncAt:Date.now(),status:remote.exists?'연결 정상 · 동기화 파일 있음':'연결 정상 · 첫 업로드 필요'});render();return {status:'ok'};}
        if(mode==='pull'){if(!remote.exists)throw new Error('아직 원격 동기화 파일이 없습니다. 이 기기에서 먼저 업로드해 주세요.');await applyRemoteSync(remote);return {status:'pulled'};}
        if(mode==='push'){
          const remoteAt=Number(remote?.payload?.updatedAt||0),localAt=Number(syncState.localUpdatedAt||0);
          if(remote.exists&&remoteAt>localAt&&!hostRoot.confirm?.('다른 기기의 동기화 데이터가 더 최신입니다. 그래도 이 기기 설정으로 덮어쓸까요?')){syncStatusText='업로드 취소';render();return {status:'cancelled'};}
          await pushLocalSync(client,Date.now());return {status:'pushed'};
        }
        if(!remote.exists){await pushLocalSync(client,Date.now());return {status:'pushed'};}
        const decision=deps.chooseSyncDirection({localUpdatedAt:Number(syncState.localUpdatedAt||0),remoteUpdatedAt:Number(remote.payload?.updatedAt||0),localDirty:!!syncState.dirty});
        if(decision==='pull'){await applyRemoteSync(remote);return {status:'pulled'};}
        if(decision==='push'){await pushLocalSync(client,Number(syncState.localUpdatedAt||Date.now()));return {status:'pushed'};}
        if(decision==='conflict'){await setSyncState({status:'동기화 충돌 · 수동으로 내려받기/업로드 선택'});render();return {status:'conflict'};}
        await setSyncState({lastSyncAt:Date.now(),lastRemoteUpdatedAt:Number(remote.payload?.updatedAt||0),status:'동기화 최신'});render();return {status:'noop'};
      }catch(err){
        await setSyncState({status:'동기화 오류'});render();
        if(mode!=='auto')hostRoot.alert?.('GitHub 동기화 실패: '+String(err?.message||err));
        return {status:'error',error:err};
      }finally{syncBusy=false;}
    }

    function targetFor(profile,targetDate){return typeof deps.prepareProfileTargetUrl==='function'?deps.prepareProfileTargetUrl(profile,targetDate):deps.prepareTargetUrl(profile.adapterId,profile.themeBookingUrl||profile.bookingUrl,targetDate);}
    function clearReload(){if(reloadTimer!==null){hostRoot.clearTimeout?.(reloadTimer);reloadTimer=null;}}
    function scheduleReloadForTrigger(trigger){
      clearReload();
      const i=Number.isInteger(trigger?.nextIndex)?trigger.nextIndex:0;
      const at=trigger?.attemptsMs?.[i];
      if(!Number.isFinite(at))return false;
      const delay=Math.max(0,at-Date.now());
      reloadTimer=hostRoot.setTimeout(()=>hostRoot.location.reload(),delay);
      return true;
    }
    function scheduleCalendarNavigationForTrigger(trigger,selected,targetDate){
      clearReload();
      const i=Number.isInteger(trigger?.nextIndex)?trigger.nextIndex:0;
      const at=trigger?.attemptsMs?.[i];
      const target=selected&&targetDate?targetFor(selected,targetDate):'';
      if(!Number.isFinite(at)||!target)return false;
      const delay=Math.max(0,at-Date.now());
      reloadTimer=hostRoot.setTimeout(()=>{
        reloadTimer=null;
        hostRoot.location.href=calendarResetNavigationUrl(target,Date.now());
      },delay);
      return true;
    }
    function scheduleInPageResume(checkpointToResume,atMs){
      clearReload();
      if(!checkpointToResume||!Number.isFinite(atMs))return false;
      reloadTimer=hostRoot.setTimeout(()=>{
        reloadTimer=null;
        resumePersisted(checkpointToResume).catch?.(err=>hostRoot.alert?.('오픈 실행 재개 실패: '+String(err?.message||err)));
      },Math.max(0,atMs-Date.now()));
      return true;
    }

    function updateIsSafe(){
      if(checkpoint||activeRun!==null)return false;
      const url=new URL(hostRoot.location.href);
      if(/reservation1\.php|reservation2\.php|\/request(?:\/|$)|\/reservation\/create/i.test(url.pathname)||['rev.make','rev.make.input'].includes(url.searchParams.get('go'))||!!doc.querySelector('input[name="theme_time_num"]')?.value)return false;
      const selected=selectedProfile();
      if(selected?.openingRule&&state.targetDate){try{const left=deps.calculateOpeningInstant(state.targetDate,selected.openingRule).getTime()-Date.now();if(left>=0&&left<60000)return false;}catch{}}
      return true;
    }
    let updateBusy=false;
    async function checkUpdate(force=false){
      if(updateBusy||!updateIsSafe()){if(force)hostRoot.alert?.('예약 진행 중이거나 오픈 직전입니다. 중지 후 예약 목록에서 업데이트해 주세요.');return {status:'deferred'};}
      if(hostRoot.TICKET_HELPER_EXTENSION){
        if(force)hostRoot.alert?.(`PC 확장판 v${hostRoot.TICKET_HELPER_EXTENSION.version||'?'}입니다. 확장 업데이트는 브라우저의 확장 프로그램 관리에서 적용됩니다.`);
        return {status:'extension-managed'};
      }
      if(hostRoot.TICKET_HELPER_DESKTOP_RUNTIME){
        if(force)hostRoot.alert?.(`PC Userscript v${hostRoot.TICKET_HELPER_VERSION||'?'}입니다. Tampermonkey의 업데이트 확인 설정을 켜면 새 버전을 확인·업데이트합니다.`);
        return {status:'userscript-managed'};
      }
      const now=Date.now();
      if(!force&&state.lastUpdateCheckAt&&now-state.lastUpdateCheckAt<UPDATE_INTERVAL_MS)return {status:'skipped'};
      if(typeof gm.xmlHttpRequest!=='function'){
        if(force)hostRoot.alert?.('현재 Userscripts 버전에서 원격 업데이트 확인 API를 사용할 수 없습니다.');
        return {status:'unsupported'};
      }
      updateBusy=true;
      try{
        const response=await gm.xmlHttpRequest({method:'GET',url:UPDATE_META_URL,headers:{'Cache-Control':'no-cache'}});
        const status=Number(response?.status||0);
        if(status&&status>=400)throw new Error(`HTTP ${status}`);
        const remote=parseUserscriptMetaVersion(response?.responseText||response?.response||'');
        const current=String(hostRoot.TICKET_HELPER_VERSION||'0.1.51');
        if(!remote)throw new Error('원격 버전 정보를 읽지 못했습니다.');
        if(!updateIsSafe())return {status:'deferred'};
        state.lastUpdateCheckAt=now;state.updateRemoteVersion=compareVersions(remote,current)>0?remote:'';await storage.setSettings(state);
        if(!updateIsSafe())return {status:'deferred'};
        if(state.updateRemoteVersion){
          if(force&&updateIsSafe()){hostRoot.location.href=UPDATE_DOWNLOAD_URL;return {status:'opened',remote,current};}
          render();return {status:'available',remote,current};
        }
        if(force)hostRoot.alert?.(`현재 최신 버전입니다. (v${current})`);
        return {status:'current',remote,current};
      }catch(err){
        if(force)hostRoot.alert?.(`업데이트 확인 실패: ${String(err?.message||err)}\n업데이트 채널이 아직 설정되지 않았을 수도 있습니다.`);
        return {status:'error',error:err};
      }finally{updateBusy=false;}
    }

    let render=()=>{};

    function makeMachine(selected,cfg,fallbackCursor,openTrigger){
      const generation=runGeneration;
      const nextAttempt=openTrigger?.attemptsMs?.[openTrigger.nextIndex];
      const baseProfile=openTrigger?{...selected,openingAttempt:true,openingWaitMs:Number.isFinite(nextAttempt)?Math.max(70,Math.min(420,nextAttempt-Date.now())):420}:selected;
      const effectiveProfile=cfg?.trustCurrentPageTheme?{...baseProfile,trustCurrentPageTheme:true,trustCurrentPageDate:true,themeBookingUrl:String(hostRoot.location?.href||selected.themeBookingUrl||selected.bookingUrl||'')}:baseProfile;
      const rawAdapter=deps.createPageAdapter(effectiveProfile,doc,hostRoot,{maxPaymentAmount:Number(cfg.maxPaymentAmount)||0,isCancelled:()=>generation!==runGeneration});
      if(!rawAdapter)return null;
      const adapter=deps.withRunCancellation(rawAdapter,()=>generation!==runGeneration);
      const observer=async payload=>{
        if(generation!==runGeneration)return;
        const updated=await storage.saveObservedSchedule(payload.profileId,payload.targetDate,payload.sessions,Date.now());
        if(generation!==runGeneration)return;
        if(updated){const i=profiles.findIndex(p=>p.id===updated.id);if(i>=0)profiles[i]=updated;render();}
      };
      const hooks=deps.createBrowserRunHooks({saveCheckpoint:cp=>generation===runGeneration?storage.setCheckpoint(cp):Promise.resolve(),profileId:selected.id,targetDate:cfg.targetDate,mode:cfg.mode,fallbackCursor});
      const machine=new deps.TicketRunMachine({profiles:profiles.map(p=>({...p,fallbackThemeIds:[]})),adapterResolver:()=>adapter,deferScheduleObservation:cfg.mode!=='practice',onScheduleObserved:observer,onBeforeAdvance:hooks.onBeforeAdvance,onBeforeConfirm:hooks.onBeforeConfirm});
      return {machine,adapter,generation};
    }

    async function settleResult(result,selected,cfg,fallbackCursor,openTrigger,machine){
      if(result?.diagnostic?.stage==='cancelled')return {stage:'cancelled'};
      if(result?.navigationPending===true)return {result,stage:'filling-form',navigationPending:true};
      if(openTrigger&&deps.shouldRetryOpeningResult?.(result,openTrigger)){
        checkpoint=deps.createPersistedCheckpoint({profileId:selected.id,stage:'armed',targetDate:cfg.targetDate,mode:cfg.mode,fallbackCursor,now:Date.now,extra:{autoContinue:true,openTrigger,events:result.events||[]}});
        await storage.setCheckpoint(checkpoint);
        if(selected.adapterId==='keyescape'&&result?.diagnostic?.stage==='sessions-not-loaded')scheduleInPageResume(checkpoint,openTrigger.attemptsMs[openTrigger.nextIndex]);
        else if(selected.adapterId==='keyescape')scheduleCalendarNavigationForTrigger(openTrigger,selected,cfg.targetDate);
        else scheduleReloadForTrigger(openTrigger);
        return {retryOpening:true,result};
      }
      if(result?.stage==='awaiting-captcha'&&cfg.mode!=='practice'&&cfg.captchaAutoResume!==false&&machine){
        try{hostRoot.navigator?.vibrate?.([80,40,80]);}catch{}
        checkpoint=deps.createPersistedCheckpoint({profileId:selected.id,stage:'awaiting-captcha',targetDate:cfg.targetDate,mode:cfg.mode,fallbackCursor,now:Date.now,extra:{autoContinue:true,sessionLabel:result.session||'',events:result.events||[]}});
        await storage.setCheckpoint(checkpoint);
        result=await deps.waitForManualCaptcha(machine,{profileId:selected.id,targetDate:cfg.targetDate,mode:cfg.mode,session:{label:result.session||''},fallbackCursor},{pollMs:100,maxWaitMs:15*60*1000});
      }
      if(result?.diagnostic?.stage==='cancelled')return {stage:'cancelled'};
      return handleRunResult({result,profiles,state:{...state,...cfg,profileId:selected.id},storage,helpers:deps,navigate:url=>{hostRoot.location.href=url}});
    }

    async function execute(selected,cfg,fallbackCursor,openTrigger){
      if(!selected||!cfg.targetDate)return null;
      if(activeRun===runGeneration)return {stage:'already-running'};
      const entryGeneration=runGeneration;
      const target=targetFor(selected,cfg.targetDate);
      if(!cfg.skipTargetNavigation&&target&&!sameUrl(hostRoot.location.href,target)){
        const nextState={...state,...cfg,profileId:selected.id};
        await storage.setSettings(nextState);
        checkpoint=deps.createPersistedCheckpoint({profileId:selected.id,stage:'selecting-date',targetDate:cfg.targetDate,mode:cfg.mode,fallbackCursor,now:Date.now,extra:{autoContinue:true,events:[],openTrigger}});
        await storage.setCheckpoint(checkpoint);
        if(entryGeneration!==runGeneration)return {stage:'cancelled'};
        hostRoot.location.href=target;
        return {stage:'navigating'};
      }
      const built=makeMachine(selected,cfg,fallbackCursor,openTrigger);if(!built)return null;
      activeRun=built.generation;
      try{
        const result=await built.machine.run({profileId:selected.id,targetDate:cfg.targetDate,mode:cfg.mode,userProfile:localUser||{},fallbackCursor});
        if(built.generation!==runGeneration)return {stage:'cancelled'};
        const outcome=await settleResult(result,selected,cfg,fallbackCursor,openTrigger,built.machine);
        if(built.generation===runGeneration&&outcome?.checkpoint){checkpoint=outcome.checkpoint;state.statusText=outcome.result?.diagnostic?.message||({failed:'실행 실패', 'ready-to-confirm':'입력 완료 · 직접 최종 확인', 'awaiting-captcha':'인증 대기'}[outcome.result?.stage]||outcome.result?.stage||'대기');render();}
        return outcome;
      }finally{if(activeRun===built.generation)activeRun=null;}
    }

    async function resumePersisted(cp){
      const resumeGeneration=runGeneration;
      const selected=profiles.find(p=>p.id===cp.profileId)||selectedProfile();
      if(!selected||!cp.targetDate)return null;
      const cfg={profileId:selected.id,targetDate:cp.targetDate,mode:cp.mode||'practice',fallbackEnabled:state.fallbackEnabled,captchaAutoResume:state.captchaAutoResume,maxPaymentAmount:state.maxPaymentAmount};
      Object.assign(state,cfg);
      const target=targetFor(selected,cfg.targetDate);
      if(target&&!sameUrl(hostRoot.location.href,target)&&cp.stage!=='filling-form'&&cp.stage!=='awaiting-captcha'){
        hostRoot.location.href=target;return {stage:'navigating'};
      }
      if(cp.stage==='armed'){
        const action=nextArmedAction(cp,Date.now(),deps);
        if(action.kind==='wait'){
          if(selected.adapterId==='keyescape')scheduleCalendarNavigationForTrigger(action.state,selected,cfg.targetDate);
          else scheduleReloadForTrigger(action.state);
          return {stage:'armed-wait'};
        }
        if(action.kind==='exhausted'){await storage.clearCheckpoint();return {stage:'armed-exhausted'};}
        checkpoint=deps.createPersistedCheckpoint({profileId:selected.id,stage:'armed',targetDate:cfg.targetDate,mode:cfg.mode,fallbackCursor:cp.fallbackCursor,now:Date.now,extra:{autoContinue:true,openTrigger:action.state,events:cp.events||[]}});
        await storage.setCheckpoint(checkpoint);
        if(resumeGeneration!==runGeneration)return {stage:'cancelled'};
        if(selected.adapterId==='keyescape'&&Number.isFinite(action.atMs)&&Number.isFinite(action.state?.openAtMs)&&action.atMs<action.state.openAtMs){
          scheduleInPageResume(checkpoint,action.state.openAtMs);
          return {stage:'prefire-ready',openAtMs:action.state.openAtMs};
        }
        return execute(selected,cfg,cp.fallbackCursor,action.state);
      }
      if(cp.stage==='filling-form'||cp.stage==='awaiting-captcha'){
        if(!expectedUserscriptResumePage(selected,cp,doc,hostRoot))return {stage:'resume-page-mismatch'};
        const built=makeMachine(selected,cfg,cp.fallbackCursor);if(!built)return null;
        activeRun=built.generation;
        let result=await deps.resumePersistedStage(built.machine,cp,localUser||{});
        if(result?.stage==='awaiting-captcha'&&cfg.mode!=='practice'&&cfg.captchaAutoResume!==false){
          try{hostRoot.navigator?.vibrate?.([80,40,80]);}catch{}
          checkpoint=deps.createPersistedCheckpoint({profileId:selected.id,stage:'awaiting-captcha',targetDate:cfg.targetDate,mode:cfg.mode,fallbackCursor:cp.fallbackCursor,now:Date.now,extra:{autoContinue:true,sessionLabel:cp.sessionLabel||result.session||'',events:result.events||[]}});
          await storage.setCheckpoint(checkpoint);
          result=await deps.waitForManualCaptcha(built.machine,{profileId:selected.id,targetDate:cfg.targetDate,mode:cfg.mode,session:{label:cp.sessionLabel||result.session||''},fallbackCursor:cp.fallbackCursor},{pollMs:100,maxWaitMs:15*60*1000});
        }
        if(built.generation!==runGeneration||result?.diagnostic?.stage==='cancelled'){if(activeRun===built.generation)activeRun=null;return {stage:'cancelled'};}
        const outcome=await handleRunResult({result,profiles,state:{...state,...cfg},storage,helpers:deps,navigate:url=>{hostRoot.location.href=url}});
        checkpoint=outcome.checkpoint;state.statusText=result?.diagnostic?.message||(result?.stage==='ready-to-confirm'?'입력 완료 · 직접 최종 확인':result?.stage||'대기');if(activeRun===built.generation)activeRun=null;render();return outcome;
      }
      return execute(selected,cfg,cp.fallbackCursor,cp.openTrigger);
    }

    async function armOrExecute(selected,cfg){
      if(!selected||!cfg.targetDate)return null;
      if(selected.adapterId==='manual'){hostRoot.alert?.('이 사이트는 테마 목록과 공식 예약 링크만 지원합니다. 자동 예약 연동은 실기기 검증 후 추가됩니다.');return {stage:'adapter-unsupported'};}
      if(cfg.bypassOpeningSchedule!==true&&!selected.openingRule){hostRoot.alert?.('오픈 규칙이 확인되지 않았습니다. 선택 테마 수정에서 D-일수와 시각을 입력하거나 지금 연습을 사용해 주세요.');return {stage:'opening-rule-unverified'};}
      const armed=createArmedCheckpoint(selected,{...cfg,fallbackCursor:undefined},deps,Date.now());
      if(!armed)return execute(selected,cfg,undefined,undefined);
      checkpoint=armed;await storage.setCheckpoint(armed);
      const target=targetFor(selected,cfg.targetDate);
      if(target&&!sameUrl(hostRoot.location.href,target)){hostRoot.location.href=target;return {stage:'navigating'};}
      return resumePersisted(armed);
    }

    function canPracticeOnCurrentPage(selected,cfg){
      if(hostRoot.TICKET_HELPER_DESKTOP_RUNTIME)return false;
      if(!selected||selected.adapterId!=='keyescape')return false;
      if(!Array.isArray(pageScan?.sessions)||!pageScan.sessions.length)return false;
      return String(pageScan.profileId||'')===String(selected.id||'')&&String(pageScan.targetDate||'')===String(cfg?.targetDate||'');
    }

    async function armTimingTest(selected,cfg,delayMs=10000){
      if(!selected||!cfg.targetDate)return null;
      if(!hostRoot.TICKET_HELPER_DESKTOP_RUNTIME){
        if(!canPracticeOnCurrentPage(selected,cfg)){
          hostRoot.alert?.('10초 동작 테스트는 현재 예약 가능한 날짜의 회차를 먼저 불러온 뒤 사용할 수 있습니다. 실제 티켓팅 준비/실전 실행은 회차 미리보기 없이도 가능합니다.');
          return {stage:'timing-test-needs-current-sessions'};
        }
        clearReload();
        checkpoint=null;
        await storage.clearCheckpoint();
        const testCfg={...cfg,mode:'practice',profileId:selected.id,bypassOpeningSchedule:true,skipTargetNavigation:true,trustCurrentPageTheme:true};
        reloadTimer=hostRoot.setTimeout(()=>{
          reloadTimer=null;
          execute(selected,testCfg,undefined,undefined).catch?.(err=>hostRoot.alert?.('10초 동작 테스트 실패: '+String(err?.message||err)));
        },Math.max(1000,Math.round(Number(delayMs)||10000)));
        return {stage:'timing-test-in-place',delayMs};
      }
      const testCfg={...cfg,mode:'practice',profileId:selected.id};
      const armed=createTimingTestCheckpoint(selected,testCfg,deps,Date.now(),delayMs);
      if(!armed)return null;
      checkpoint=armed;await storage.setCheckpoint(armed);
      const target=targetFor(selected,cfg.targetDate);
      if(target&&!sameUrl(hostRoot.location.href,target)){hostRoot.location.href=target;return {stage:'navigating'};}
      scheduleReloadForTrigger(armed.openTrigger);
      return {stage:'timing-test-armed',delayMs};
    }

    render=deps.createPanelRenderScheduler(host.shadowRoot||host.attachShadow({mode:'open'}),()=>{
      const {profile,schedule,viewState}=viewData();
      deps.mountUserscriptPanel(host,{profiles,state,viewState,localUser,syncConfig:syncUiConfig(),
        onChange:async (cfg,field,needsRerender)=>{const saving=persistConfig(cfg,field);if(needsRerender)render();else deps.updatePreparationStatus(host.shadowRoot,deps.reservationReadiness(selectedProfile(),state,localUser));await saving;if(!needsRerender)deps.updatePreparationStatus(host.shadowRoot,deps.reservationReadiness(selectedProfile(),state,localUser));},
        onLocalUserInput:cfg=>{localUser={name:cfg.localName||'',phone:cfg.localPhone||'',participants:cfg.localParticipants||''};deps.updatePreparationStatus(host.shadowRoot,deps.reservationReadiness(selectedProfile(),state,localUser));if(localUserSaveTimer!==null)hostRoot.clearTimeout?.(localUserSaveTimer);localUserSaveTimer=hostRoot.setTimeout?.(()=>{storage.setLocalUser(localUser).catch?.(()=>{});localUserSaveTimer=null;},400);},
        onToggleCompact:async()=>{state.compactView=state.compactView===false;await storage.setSettings(state);await markSyncDirty();render();},
        onSyncConfig:async cfg=>saveSyncConfigFromUi(cfg),
        onSyncTest:async cfg=>{await saveSyncConfigFromUi(cfg);return performGitHubSync('test');},
        onSyncPull:async cfg=>{await saveSyncConfigFromUi(cfg);if(syncState.dirty&&!hostRoot.confirm?.('이 기기의 아직 동기화되지 않은 변경사항을 원격 설정으로 덮어쓸까요?'))return;return performGitHubSync('pull');},
        onSyncPush:async cfg=>{await saveSyncConfigFromUi(cfg);return performGitHubSync('push');},
        onStop:async()=>{runGeneration++;activeRun=null;clearReload();checkpoint=null;state.statusText='실행 중지';await storage.clearCheckpoint();render();},
        onImport:async()=>{const raw=hostRoot.prompt?.('백업한 프로필 JSON을 붙여넣으세요.','')||'';if(!raw.trim())return;profiles=await storage.importProfiles(raw);state.profileId=profiles[0]?.id||'';await storage.setSettings(state);await markSyncDirty();render();},
        onRestoreBackup:async()=>{const backup=await storage.getAutoBackup?.();if(!backup?.profiles){hostRoot.alert?.('복구할 자동 백업이 없습니다.');return;}const when=backup.at?new Date(backup.at).toLocaleString('ko-KR'):'최근';if(!hostRoot.confirm?.(`${when} 자동 백업으로 테마/회차/설정을 되돌릴까요? 이름·연락처는 변경하지 않습니다.`))return;const restored=await storage.restoreAutoBackup();if(!restored){hostRoot.alert?.('자동 백업 복구에 실패했습니다.');return;}profiles=restored.profiles||[];Object.assign(state,restored.settings||{});backupInfo=await storage.getAutoBackup?.()||null;await markSyncDirty();render();hostRoot.alert?.('자동 백업을 복구했습니다.');},
        onExport:async()=>{const json=await storage.exportProfiles();if(hostRoot.navigator?.clipboard?.writeText){try{await hostRoot.navigator.clipboard.writeText(json);hostRoot.alert?.('백업 JSON을 클립보드에 복사했습니다.');return;}catch{}}hostRoot.prompt?.('아래 백업 JSON을 복사하세요.',json);},
        onCheckUpdate:async()=>checkUpdate(true),
        onScan:async()=>{try{pageScan={...detectCurrentPageContext(hostRoot.location.href,doc,profiles),sessions:[]};render();}catch(err){hostRoot.alert?.(`페이지 정보 확인 실패: ${String(err?.message||err)}`);}},
        onScanTargetDate:async cfg=>{const generation=runGeneration;try{
          await persistConfig(cfg,'target-date');
          const p=profiles.find(x=>x.id===cfg.profileId)||selectedProfile();
          if(!p){hostRoot.alert?.('테마를 먼저 등록/선택해 주세요.');return;}
          state.pendingTargetScanNavigateCount=0;
          const result=await scanTargetDateSessions({profile:p,targetDate:cfg.targetDate,doc,win:hostRoot,helpers:deps});
          if(result?.reloadCurrentPage){
            state.pendingTargetScan=true;
            state.pendingTargetScanProfileId=p.id;
            state.pendingTargetScanTargetDate=cfg.targetDate;
            state.pendingTargetScanResetCount=Number(state.pendingTargetScanResetCount||0)+1;
            await storage.setSettings(state);
            hostRoot.location.href=calendarResetNavigationUrl(result.navigateTo||targetFor(p,cfg.targetDate));
            return;
          }
          if(result?.navigateTo){
            state.pendingTargetScan=true;
            state.pendingTargetScanProfileId=p.id;
            state.pendingTargetScanTargetDate=cfg.targetDate;
            state.pendingTargetScanResetCount=Number(state.pendingTargetScanResetCount||0);
            state.pendingTargetScanNavigateCount=1;
            await storage.setSettings(state);
            hostRoot.location.href=result.navigateTo;
            return;
          }
          if(!result?.ok){const preopen=['date-disabled','sessions-not-loaded'].includes(String(result?.stage||''));hostRoot.alert?.(preopen?'현재는 목표일 회차를 미리 볼 수 없습니다. 오픈 전/비활성 상태일 수 있습니다. 실전 실행은 회차 미리보기 없이도 가능합니다.':`목표일 회차 미리보기 실패: ${String(result?.message||result?.stage||'알 수 없는 오류')}`);return;}
          const ctx=detectCurrentPageContext(hostRoot.location.href,doc,profiles);
          pageScan={...ctx,sessions:result.sessions,profileId:p.id,targetDate:cfg.targetDate};
          const updated=await storage.saveObservedSchedule(p.id,cfg.targetDate,result.sessions,Date.now());
          if(generation!==runGeneration)return;
        if(updated){const i=profiles.findIndex(x=>x.id===updated.id);if(i>=0)profiles[i]=updated;await markSyncDirty();}
          render();
        }catch(err){hostRoot.alert?.(`목표일 회차 불러오기 실패: ${String(err?.message||err)}`);}},
        onSessionPriority:async (cfg,time)=>{const p=profiles.find(x=>x.id===cfg.profileId);if(!p){return} if(!cfg.targetDate){hostRoot.alert?.('목표 날짜를 먼저 선택해 주세요.');return;} const sessions=pageScan?.sessions||[]; if(sessions.length){const updated=deps.saveObservedSchedule(p,cfg.targetDate,sessions,Date.now());const i=profiles.findIndex(x=>x.id===p.id);profiles[i]=updated;} const i=profiles.findIndex(x=>x.id===p.id);const kind=deps.dayKind(cfg.targetDate);const templates={...(profiles[i].sessionTemplates||{})};const tpl={...(templates[kind]||{kind,times:[],userPriority:[],mismatchPolicy:'exact-then-nearest'})};const priority=Array.isArray(tpl.userPriority)?tpl.userPriority.slice():[];const pos=priority.indexOf(time);if(pos>=0)priority.splice(pos,1);else priority.push(time);templates[kind]={...tpl,userPriority:priority};profiles[i]={...profiles[i],sessionTemplates:templates};await storage.setProfiles(profiles);await markSyncDirty();render();},
        onClearSessionPriority:async cfg=>{const i=profiles.findIndex(x=>x.id===cfg.profileId);if(i<0||!cfg.targetDate)return;const kind=deps.dayKind(cfg.targetDate);const templates={...(profiles[i].sessionTemplates||{})};if(templates[kind])templates[kind]={...templates[kind],userPriority:[]};profiles[i]={...profiles[i],sessionTemplates:templates};await storage.setProfiles(profiles);await markSyncDirty();render();},
        onAddHour:async (cfg,hour)=>{const i=profiles.findIndex(x=>x.id===cfg.profileId);if(i<0)return;profiles[i]={...profiles[i],timePriorities:deps.addHourPriority(profiles[i].timePriorities||[],hour)};await storage.setProfiles(profiles);await markSyncDirty();render();},
        onRemoveHour:async (cfg,hour)=>{const i=profiles.findIndex(x=>x.id===cfg.profileId);if(i<0)return;profiles[i]={...profiles[i],timePriorities:deps.removeHourPriority(profiles[i].timePriorities||[],hour)};await storage.setProfiles(profiles);await markSyncDirty();render();},
        onAddCurrent:async cfg=>{try{const ctx=detectCurrentPageContext(hostRoot.location.href,doc,profiles);const created=createProfileFromCurrentPage({url:hostRoot.location.href,branchName:cfg.newBranchName||ctx.branchName,themeName:cfg.newThemeName||ctx.themeName,daysBefore:Number(cfg.newDaysBefore),openTime:cfg.newOpenTime,imageUrl:ctx.imageUrl},deps);const duplicate=profiles.find(p=>typeof deps.semanticProfileKey==='function'?deps.semanticProfileKey(p)===deps.semanticProfileKey(created):p.id===created.id);if(duplicate&&!hostRoot.confirm?.(`이미 저장된 테마입니다: ${duplicate.themeName}\n현재 페이지 정보로 업데이트할까요?`))return;profiles=typeof deps.upsertProfileByIdentity==='function'?deps.upsertProfileByIdentity(profiles,created):[...profiles,created];const saved=profiles.find(p=>typeof deps.semanticProfileKey==='function'&&deps.semanticProfileKey(p)===deps.semanticProfileKey(created))||profiles.find(p=>p.id===created.id)||created;state.profileId=saved.id;state.siteId=saved.siteId;state.branchId=String(saved.branchId||'');await storage.setProfiles(profiles);await storage.setSettings(state);await markSyncDirty();render();hostRoot.alert?.(`테마 등록 완료: ${saved.themeName}`);}catch(err){hostRoot.alert?.(`테마 등록 실패: ${String(err?.message||err)}`);}},
        onPrepare:async cfg=>{await persistConfig(cfg,'prepare');const selected=profiles.find(p=>p.id===state.profileId||p.id===cfg.profileId);return armOrExecute(selected,{...cfg,profileId:selected?.id||cfg.profileId});},
        onPracticeNow:async cfg=>{await persistConfig(cfg,'prepare');const selected=profiles.find(p=>p.id===state.profileId||p.id===cfg.profileId);if(!selected||!cfg.targetDate){hostRoot.alert?.('테마와 목표 날짜를 먼저 선택해 주세요.');return null;}const inPlace=canPracticeOnCurrentPage(selected,cfg);return armOrExecute(selected,{...cfg,mode:'practice',profileId:selected.id,bypassOpeningSchedule:true,skipTargetNavigation:inPlace,trustCurrentPageTheme:inPlace});},
        onTimingTest:async cfg=>{await persistConfig(cfg,'prepare');const selected=profiles.find(p=>p.id===state.profileId||p.id===cfg.profileId);if(!selected||!cfg.targetDate){hostRoot.alert?.('테마와 목표 날짜를 먼저 선택해 주세요.');return null;}const result=await armTimingTest(selected,{...cfg,profileId:selected.id},10000);if(result?.stage==='timing-test-in-place')hostRoot.alert?.('10초 후 현재 불러온 회차에서 선택 → NEXT 흐름을 연습합니다. 미래 날짜 활성화는 실전 오픈 시각에 별도로 처리됩니다.');else if(result?.stage==='timing-test-armed')hostRoot.alert?.('10초 후 오픈 트리거 재개 흐름을 연습합니다.');return result;}
      });
      return {profile,schedule};
    },hostRoot);

    render();
    const updateCountdown=()=>{
      const el=host.shadowRoot?.querySelector('[data-opening-countdown]');
      if(el)el.textContent=deps.formatOpeningCountdown(el.dataset.openAt?Number(el.dataset.openAt):null);
    };
    const countdownTimer=hostRoot.setInterval?.(updateCountdown,250);
    hostRoot.addEventListener?.('pagehide',()=>hostRoot.clearInterval?.(countdownTimer),{once:true});
    doc.addEventListener?.('visibilitychange',updateCountdown);
    if(updateIsSafe()) hostRoot.setTimeout?.(()=>{checkUpdate(false);},1500);
    doc.addEventListener?.('visibilitychange',()=>{if(doc.visibilityState==='visible'&&updateIsSafe())checkUpdate(false);});
    if(syncConfig.autoSync&&syncConfig.token&&!checkpoint) scheduleAutoSync(2200);

    if(settings.pendingTargetScan&&state.targetDate){
      const pendingProfile=profiles.find(p=>p.id===settings.pendingTargetScanProfileId)||initialProfile;
      const pendingDate=String(settings.pendingTargetScanTargetDate||state.targetDate||'');
      const resetCount=Number(settings.pendingTargetScanResetCount||0);
      const navigateCount=Number(settings.pendingTargetScanNavigateCount||0);
      if(pendingProfile&&pendingDate){
        try{
          const skipLocationNavigation=!!pendingProfile.themeBookingUrl&&navigateCount>=1;
          const result=await scanTargetDateSessions({profile:pendingProfile,targetDate:pendingDate,doc,win:hostRoot,helpers:deps,skipLocationNavigation});
          if(result?.reloadCurrentPage&&resetCount<2){
            state.pendingTargetScan=true;
            state.pendingTargetScanProfileId=pendingProfile.id;
            state.pendingTargetScanTargetDate=pendingDate;
            state.pendingTargetScanResetCount=resetCount+1;
            await storage.setSettings(state);
            hostRoot.location.href=calendarResetNavigationUrl(result.navigateTo||targetFor(pendingProfile,pendingDate),Date.now()+resetCount);
            return true;
          }
          if(result?.navigateTo){
            if(navigateCount>=1){
              state.pendingTargetScan=false;
              state.pendingTargetScanProfileId='';
              state.pendingTargetScanTargetDate='';
              state.pendingTargetScanResetCount=0;
              state.pendingTargetScanNavigateCount=0;
              await storage.setSettings(state);
              hostRoot.alert?.('반복 페이지 이동을 차단했습니다. 현재 페이지에서 테마를 다시 인식해 주세요.');
              return true;
            }
            state.pendingTargetScan=true;
            state.pendingTargetScanProfileId=pendingProfile.id;
            state.pendingTargetScanTargetDate=pendingDate;
            state.pendingTargetScanResetCount=resetCount;
            state.pendingTargetScanNavigateCount=navigateCount+1;
            await storage.setSettings(state);
            hostRoot.location.href=result.navigateTo;
            return true;
          }
          state.pendingTargetScan=false;
          state.pendingTargetScanProfileId='';
          state.pendingTargetScanTargetDate='';
          state.pendingTargetScanResetCount=0;
          state.pendingTargetScanNavigateCount=0;
          await storage.setSettings(state);
          if(result?.ok){
            state.profileId=pendingProfile.id;
            state.siteId=pendingProfile.siteId||state.siteId;
            state.branchId=String(pendingProfile.branchId||state.branchId||'');
            state.targetDate=pendingDate;
            const ctx=detectCurrentPageContext(hostRoot.location.href,doc,profiles);
            pageScan={...ctx,sessions:result.sessions,profileId:pendingProfile.id,targetDate:pendingDate};
            const updated=await storage.saveObservedSchedule(pendingProfile.id,pendingDate,result.sessions,Date.now());
        if(updated){const i=profiles.findIndex(x=>x.id===updated.id);if(i>=0)profiles[i]=updated;}
            await storage.setSettings(state);
            render();
          }else{
            const preopen=['date-disabled','sessions-not-loaded'].includes(String(result?.stage||''));hostRoot.alert?.(preopen?'현재는 목표일 회차를 미리 볼 수 없습니다. 오픈 전/비활성 상태일 수 있습니다. 실전 실행은 계속 사용할 수 있습니다.':`목표일 회차 미리보기 실패: ${String(result?.message||result?.stage||'알 수 없는 오류')}`);
          }
        }catch(err){
          state.pendingTargetScan=false;
          state.pendingTargetScanResetCount=0;
          state.pendingTargetScanNavigateCount=0;
          await storage.setSettings(state);
          hostRoot.alert?.(`목표일 회차 불러오기 실패: ${String(err?.message||err)}`);
        }
      }
    }

    if(checkpoint?.autoContinue&&initialProfile&&checkpoint.profileId===initialProfile.id&&state.targetDate){
      await resumePersisted(checkpoint);
    }
    return true;
  }
  return {claimBoot,deriveFallbackContinuation,handleRunResult,createScheduleObserver,createArmedCheckpoint,createTimingTestCheckpoint,nextArmedAction,scanTargetDateSessions,expectedUserscriptResumePage,renderBootError,detectThemeNameFromPage,detectThemeImageFromPage,detectCurrentPageContext,createProfileFromCurrentPage,selectProfileForPageContext,parseUserscriptMetaVersion,compareVersions,bootTicketHelper};
});
