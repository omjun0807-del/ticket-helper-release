// ==UserScript==
// @name         Ticket Helper
// @namespace    ticket-helper.private
// @version      0.1.8
// @description  Personal escape-room booking helper
// @match        https://keyescape.com/*
// @match        https://www.keyescape.com/*
// @match        https://m.booking.naver.com/*
// @match        https://booking.naver.com/*
// @updateURL    https://raw.githubusercontent.com/omjun0807-del/ticket-helper-release/main/ticket-helper.meta.js
// @downloadURL  https://raw.githubusercontent.com/omjun0807-del/ticket-helper-release/main/ticket-helper.user.js
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.xmlHttpRequest
// @inject-into  content
// @run-at       document-start
// ==/UserScript==

globalThis.TICKET_HELPER_VERSION="0.1.8";
globalThis.TICKET_HELPER_CSS=":root{--th-bg:#f6f7fb;--th-surface:#fff;--th-surface2:#f0f2f8;--th-text:#161b2c;--th-muted:#667085;--th-border:#e3e6ef;--th-primary:#5b5ce2;--th-primary2:#ececff;--th-success:#159b6c;--th-danger:#e5484d;--th-dark:#20263a;--th-radius:18px;font-family:\"Noto Sans KR\",\"Apple SD Gothic Neo\",system-ui,sans-serif}.th-app{box-sizing:border-box;background:var(--th-bg);color:var(--th-text);padding:16px;border-radius:24px;max-width:420px;line-height:1.45}.th-app *{box-sizing:border-box}.th-header{display:flex;justify-content:space-between;align-items:flex-start;padding:4px 2px 14px}.th-header h1{font-size:20px;margin:2px 0}.th-header p,.th-help{color:var(--th-muted);font-size:12px;margin:3px 0}.th-kicker{font-size:11px;font-weight:700;color:var(--th-primary)}.th-mode,.th-source,.th-health{font-size:11px;padding:6px 9px;border-radius:999px;background:var(--th-primary2);color:var(--th-primary);font-weight:700}.is-live .th-mode{background:#fff0f1;color:var(--th-danger)}.th-card{background:var(--th-surface);border:1px solid var(--th-border);border-radius:var(--th-radius);padding:16px;margin-bottom:12px}.th-row,.th-section-head,.th-status{display:flex;justify-content:space-between;gap:12px;align-items:center}.th-label{display:block;color:var(--th-muted);font-size:10px;margin-bottom:3px}.th-countdown{margin-top:14px;border-radius:12px;background:var(--th-dark);color:#fff;padding:12px;display:flex;justify-content:space-between;align-items:center}.th-countdown b{font-size:20px}.th-section-head h2{font-size:15px;margin:0}.th-chips{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0}.th-chip{font-size:11px;background:var(--th-surface2);padding:7px 9px;border-radius:999px}.th-chip-session{background:var(--th-primary2);color:var(--th-primary)}.th-subtitle{font-size:11px;color:var(--th-muted);font-weight:700;margin-top:10px}.th-muted{color:var(--th-muted);font-size:11px}.th-fallback{padding:0;margin:10px 0 0;list-style:none}.th-fallback li{display:flex;gap:9px;align-items:center;padding:7px 0;font-size:12px}.th-fallback li span{width:22px;height:22px;border-radius:7px;display:inline-flex;align-items:center;justify-content:center;background:var(--th-surface2);font-weight:700}.th-status button{border:0;border-radius:12px;background:var(--th-primary);color:#fff;font-weight:800;padding:12px 16px;cursor:pointer}\n";

/* packages/catalog/src/builtin-catalog.js */
(function (root, factory) {
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.TicketHelper=Object.assign(root.TicketHelper||{},api);
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const BUILTIN_CATALOG_VERSION='2026-09-30-keyescape-1';
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
      adapterId:'keyescape',
      openingRule:{daysBefore:branch.daysBefore,openTime:branch.openTime,timezone:'Asia/Seoul',prefireMs:350,retryOffsetsMs:[120,420]},
      timePriorities:[],allowAnyFallback:true,fallbackThemeIds:[],favorite:false,sessionTemplates:{},
      imageUrl:POSTERS[`${branch.name}|${theme}`]||'',
      catalogSource:'KEYESCAPE official + reservation-opening reference',catalogVerifiedAt:VERIFIED_AT,
      sourceUrl:'https://keyescape.com/works.php',
      sourceNote:'기본 카탈로그 — 오픈 시각/예약 범위를 검증했으며 실제 회차는 목표 날짜에서 자동 학습'
    };
  }
  function getBuiltinCatalogProfiles(){
    return BRANCHES.flatMap(branch=>branch.themes.map(theme=>makeKeyescapeProfile(branch,theme)));
  }
  function enrichLocal(local,builtin){
    return {
      ...builtin,
      ...local,
      id:local.id||builtin.id,
      bookingUrl:local.bookingUrl||builtin.bookingUrl,
      openingRule:local.openingRule||builtin.openingRule,
      timePriorities:Array.isArray(local.timePriorities)?local.timePriorities:(builtin.timePriorities||[]),
      fallbackThemeIds:Array.isArray(local.fallbackThemeIds)?local.fallbackThemeIds:(builtin.fallbackThemeIds||[]),
      sessionTemplates:local.sessionTemplates||builtin.sessionTemplates||{},
      imageUrl:local.imageUrl||builtin.imageUrl||'',
      catalogSource:local.catalogSource||builtin.catalogSource,
      catalogVerifiedAt:local.catalogVerifiedAt||builtin.catalogVerifiedAt,
      sourceUrl:local.sourceUrl||builtin.sourceUrl,
      sourceNote:local.sourceNote||builtin.sourceNote
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
    validateOpeningRule(profile.openingRule, errors);
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
  const RETRYABLE=new Set(['date-missing','date-disabled','session-container-missing','session-unavailable']);
  function createOpenTrigger(targetDate,rule,options={}){
    const openAt=deps.calculateOpeningInstant(targetDate,rule);
    return {version:1,targetDate,openAtMs:openAt.getTime(),attemptsMs:deps.buildOpenWindow(openAt,rule,options),nextIndex:0};
  }
  function normalizeState(state){
    return {version:1,targetDate:state?.targetDate,openAtMs:state?.openAtMs,attemptsMs:Array.isArray(state?.attemptsMs)?state.attemptsMs.slice():[],nextIndex:Number.isInteger(state?.nextIndex)&&state.nextIndex>=0?state.nextIndex:0};
  }
  function nextOpenTriggerAction(state,nowMs=Date.now()){
    const next=normalizeState(state);const i=next.nextIndex;
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
      const query=url=>JSON.stringify([...url.searchParams.entries()].sort((x,y)=>x[0]===y[0]?String(x[1]).localeCompare(String(y[1])):String(x[0]).localeCompare(String(y[0]))));
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
    constructor({ profiles = [], adapterResolver, now = Date.now, onScheduleObserved, onBeforeAdvance, onBeforeConfirm } = {}) {
      this.profiles = profiles;
      this.adapterResolver = adapterResolver;
      this.now = now;
      this.onScheduleObserved = onScheduleObserved;
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
          try { await this.onScheduleObserved({ profileId, targetDate, sessions: sessions.slice() }); }
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
    const value = String(url || '');
    if (/https?:\/\/(?:www\.)?keyescape\.com\//i.test(value)) return 'keyescape';
    if (/https?:\/\/(?:m\.)?booking\.naver\.com\//i.test(value)) return 'naver-booking';
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
        if (typeof page.selectThemeByName !== 'function') return resultFail('theme-missing', 'theme selector is unavailable');
        const ok = await page.selectThemeByName(themeName, profile.branchName, profile.branchId);
        return ok ? resultOk({ themeName }) : resultFail('theme-missing', `theme could not be selected: ${themeName}`);
      },

      async selectTargetDate(targetDate) {
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
        page.clickElement(day.element || day);
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
        return resultOk();
      },

      async applyAgreements() {
        const agreement = page.findAgreement();
        if (!agreement) return resultFail('agreement-missing', '전체동의 control not found');
        page.clickElement(agreement.element || agreement);
        return resultOk();
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

  function createBrowserKeyescapePage(doc = document, win = window) {
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
        const findThemeOption=()=>{
          for(const sel of [...doc.querySelectorAll('select')]){
            const options=[...(sel.options||[])];
            const option=options.find(o=>normalized(textOf(o))===target);
            if(option)return {sel,option,options};
          }
          return null;
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
            if(option) setValue(branchSelect,option.value);
            for(let i=0;i<60&&!found;i++){
              await sleep(50);
              found=findThemeOption();
            }
          }
        }
        if(!found)return false;
        const {sel,option,options}=found;
        const current=sel.selectedOptions?.[0]||options[sel.selectedIndex];
        if(current&&normalized(textOf(current))===target)return true;
        setValue(sel,option.value);
        for(let i=0;i<30;i++){
          await sleep(40);
          const now=sel.selectedOptions?.[0]||[...(sel.options||[])][sel.selectedIndex];
          if(now&&normalized(textOf(now))===target)return true;
        }
        return false;
      },
      getMonth() {
        const info = monthInfo();
        return info ? { year: info.year, month: info.month } : null;
      },
      async ensureCalendarVisible() {
        if (monthInfo()) return true;
        const arrows = ['←','‹','＜','◀','◁'];
        const candidates = unique([...doc.querySelectorAll('button,a,[role="button"],span,div')]
          .filter(visible)
          .map((node) => node.closest?.('button,a,[role="button"]') || node)
          .filter((el) => arrows.includes(textOf(el))));
        for (const el of candidates) {
          el.click?.();
          for (let i = 0; i < 50; i++) {
            await sleep(40);
            if (monthInfo()) return true;
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
        const matches = unique([...box.querySelectorAll('button,a,[role="button"],td,div,span')]
          .filter(visible).filter((el) => textOf(el) === String(day))
          .map((el) => el.closest?.('button,a,[role="button"],td') || el));
        if (!matches.length) return null;
        const el = matches[0];
        const style = win.getComputedStyle(el);
        const enabled = !(el.disabled || el.getAttribute?.('aria-disabled') === 'true' || style.pointerEvents === 'none');
        return { element: el, id: el.id, text: String(day), enabled };
      },
      clickElement(el) { el?.click?.(); return true; },
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
      findAgreement() {
        const matches = [...doc.querySelectorAll('label,span,div,p')].filter(visible).filter((el) => textOf(el) === '전체동의');
        if (!matches.length) return null;
        matches.sort((a, b) => {
          const ar = a.getBoundingClientRect(), br = b.getBoundingClientRect();
          return ar.width * ar.height - br.width * br.height;
        });
        return { element: matches[0].closest?.('label') || matches[0], text: '전체동의' };
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
      const hardDisabled=!!d.disabled || d.ariaDisabled===true || d.ariaDisabled==='true' || /disabled|is_disabled/i.test(String(d.className||''));
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
    url.searchParams.set('startDateTime',`${targetDate}T00:00:00+09:00`);
    return url.toString();
  }

  function createNaverBookingAdapter({page,bookingUrl,paymentPolicy={}}){
    if(!page) throw new TypeError('page is required');
    return {
      id:'naver-booking',
      async selectTargetDate(targetDate){
        if(page.currentTargetDate()===targetDate) return ok();
        const navigateTo=targetUrlForDate(bookingUrl,targetDate);
        return navigateTo?fail('date-missing','target date requires direct-date navigation',{navigateTo}):fail('date-missing','could not construct target-date URL');
      },
      async readSessions(){
        const state=page.sessionContainerState();
        if(state==='missing') throw diagError('session-container-missing','session container not found');
        if(state==='ambiguous') throw diagError('session-ambiguous','multiple ambiguous session containers found');
        return deps.parseNaverSessionDescriptors(page.listSessionDescriptors());
      },
      async chooseSession(session){
        const sessions=deps.parseNaverSessionDescriptors(page.listSessionDescriptors());
        const matches=sessions.filter(s=>s.label===session.label);
        if(!matches.length) return fail('session-unavailable',`session not found: ${session.label}`);
        if(matches.length>1) return fail('session-ambiguous',`multiple session buttons: ${session.label}`);
        if(!matches[0].available) return fail('session-unavailable',`session disabled: ${session.label}`);
        page.clickElement(matches[0].element||matches[0]);
        const outcome=await page.waitForSlotOutcome(matches[0].label);
        if(outcome==='sold-out') return fail('session-unavailable',`sold out: ${session.label}`);
        if(outcome!=='selected') return fail('navigation-failed',`session selection did not activate: ${session.label}`);
        return ok({session:matches[0]});
      },
      async goNext(){
        const actions=page.findExactActions('다음');
        if(!actions.length) return fail('next-button-missing','다음 button not found');
        if(actions.length>1) return fail('next-button-ambiguous','multiple 다음 buttons found');
        const before=page.currentHref(); page.clickElement(actions[0]);
        return (await page.waitForNavigation(before))?ok():fail('navigation-failed','다음 did not navigate');
      },
      async fillUserInfo(){ return ok(); },
      async applyAgreements(){ return ok(); },
      async captchaState(){ return 'complete'; },
      async continueAfterCaptcha(mode){
        if(mode==='practice') return fail('confirmation-blocked','practice mode stops before 동의하고 결제하기');
        const actions=page.findExactActions('동의하고 결제하기');
        if(!actions.length) return fail('confirmation-blocked','동의하고 결제하기 button not found');
        if(actions.length>1) return fail('confirmation-blocked','multiple 동의하고 결제하기 buttons found');
        page.clickElement(actions[0]);
        const boundary=await page.waitForNpayBoundary();
        if(!boundary) return fail('navigation-failed','Npay final-payment boundary not detected');
        if(mode!=='confirm') return ok({paymentBoundary:true});
        const max=Number(paymentPolicy?.maxPaymentAmount)||0;
        if(max<=0) return fail('payment-limit-required','final payment mode requires an explicit payment cap');
        const final=page.finalPaymentAction?.();
        if(!final?.element||!Number.isFinite(final.amount)) return fail('confirmation-blocked','final payment button not found');
        if(final.amount>max) return fail('payment-limit-exceeded',`payment amount ${final.amount} exceeds cap ${max}`,{amount:final.amount,maxPaymentAmount:max});
        page.clickElement(final.element);
        return ok({paymentBoundary:true,paymentSubmitted:true,requiresExternalConfirmation:true,amount:final.amount,maxPaymentAmount:max});
      }
    };
  }

  function createBrowserNaverPage(doc=document,win=window){
    const selectors=deps.NAVER_SELECTORS;
    const textOf=(el)=>String(el?.innerText??el?.textContent??'').replace(/\s+/g,' ').trim();
    const visible=(el)=>{if(!el||typeof el.getBoundingClientRect!=='function')return false;const r=el.getBoundingClientRect(),s=win.getComputedStyle(el);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden';};
    const actions=(label)=>[...doc.querySelectorAll(selectors.actions)].filter(visible).filter(el=>textOf(el)===label).filter(el=>!(el.disabled||el.getAttribute?.('aria-disabled')==='true'||/disabled|inactive|is_disabled/i.test(String(el.className||''))));
    function listSessionDescriptors(){
      const seen=new Set(),out=[];
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
        const u=new URL(win.location.href); const raw=u.searchParams.get('startDateTime')||''; const m=/^(\d{4}-\d{2}-\d{2})/.exec(raw); return m?.[1]||null;
      } catch { return null; }
    }
    return {
      currentTargetDate,
      navigateToDate(date,url){win.location.replace(targetUrlForDate(url,date));},
      sessionContainerState(){return listSessionDescriptors().length?'ok':'missing';},
      listSessionDescriptors,
      clickElement(el){
        try { el.scrollIntoView?.({block:'center',inline:'center',behavior:'instant'}); } catch{}
        try { el.click?.(); } catch{}
      },
      async waitForSlotOutcome(){
        const started=Date.now();
        while(Date.now()-started<2200){
          if(soldOutToastExists()) return 'sold-out';
          if(actions('다음').length===1) return 'selected';
          await sleep(50);
        }
        return 'timeout';
      },
      findExactActions:actions,
      currentHref(){return win.location.href;},
      async waitForNavigation(before){for(let i=0;i<40;i++){await sleep(50);if(win.location.href!==before||win.location.pathname.includes('/request'))return true;}return false;},
      async waitForNpayBoundary(){
        for(let i=0;i<120;i++){
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
    const fallbackItems = (state.fallbackThemes || []).map((name, i) => `<li><span>${i + 1}</span>${escapeHtml(name)}</li>`).join('') || '<li class="th-muted">설정된 다음 테마 없음</li>';
    const liveClass = state.mode === 'live' ? 'is-live' : 'is-practice';
    return `<div class="th-app ${liveClass}">
      <header class="th-header"><div><div class="th-kicker">Ticket Helper</div><h1>${escapeHtml(state.themeName || '테마를 선택하세요')}</h1><p>${escapeHtml([state.siteName,state.branchName].filter(Boolean).join(' · '))}</p></div><span class="th-mode">${state.mode === 'live' ? '실전' : '연습'}</span></header>
      <section class="th-card th-hero"><div class="th-row"><div><span class="th-label">목표 날짜</span><strong>${escapeHtml(state.targetDate || '—')}</strong></div><div><span class="th-label">예상 오픈</span><strong>${escapeHtml(state.openingText || '—')}</strong></div></div><div class="th-countdown"><span>오픈까지</span><b>${escapeHtml(state.countdown || '--:--:--')}</b></div></section>
      <section class="th-card"><div class="th-section-head"><h2>회차 우선순위</h2><span class="th-source">${escapeHtml(scheduleSourceLabel(schedule.source))}</span></div><p class="th-help">실제 목표 날짜 회차가 보이면 그 값을 최우선으로 사용합니다. 시간 우선순위 직접 설정.</p><div class="th-chips">${sessionItems || '<span class="th-muted">저장된 정확한 회차 우선순위 없음</span>'}</div><div class="th-subtitle">시간대 보조 우선순위</div><div class="th-chips">${hourItems || '<span class="th-muted">필요할 때 00~23시 중 직접 추가</span>'}</div></section>
      <section class="th-card"><div class="th-section-head"><h2>실패 시 다음 테마</h2><span class="th-health">${escapeHtml(state.adapterHealth || '확인 필요')}</span></div><ol class="th-fallback">${fallbackItems}</ol></section>
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
  const KEYS = Object.freeze({ profiles:'ticket-helper:profiles', localUser:'ticket-helper:local-user', checkpoint:'ticket-helper:checkpoint', settings:'ticket-helper:settings' });

  function createTicketStorage(gm) {
    if (!gm || typeof gm.getValue !== 'function' || typeof gm.setValue !== 'function') throw new TypeError('GM storage adapter required');
    return {
      async getProfiles(){ return await gm.getValue(KEYS.profiles, []); },
      async setProfiles(profiles){ await gm.setValue(KEYS.profiles, Array.isArray(profiles)?profiles:[]); },
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
      async getSettings(){ return await gm.getValue(KEYS.settings, {}); },
      async setSettings(settings){ await gm.setValue(KEYS.settings, settings || {}); },
      async exportProfiles(){
        const profiles = await this.getProfiles();
        return JSON.stringify((profiles || []).map((p) => deps.sanitizeProfileExport ? deps.sanitizeProfileExport(p) : p), null, 2);
      },
      async importProfiles(json){
        const parsed = typeof json === 'string' ? JSON.parse(json) : json;
        if (!Array.isArray(parsed)) throw new TypeError('profile import must be an array');
        await this.setProfiles(parsed);
        return parsed;
      }
    };
  }

  function createBrowserGM(rootObj = root, injectedGM = null) {
    const modern = injectedGM || rootObj?.GM;
    if (modern?.getValue && modern?.setValue) {
      const api={
        storageKind:'userscripts-gm',
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
    return bookingUrl;
  }
  function createPageAdapter(profile, doc=document, win=window, runOptions={}){
    if(!profile) return null;
    if(profile.adapterId==='keyescape') return deps.createKeyescapeAdapter({page:deps.createBrowserKeyescapePage(doc,win),profile});
    if(profile.adapterId==='naver-booking') return deps.createNaverBookingAdapter({page:deps.createBrowserNaverPage(doc,win),bookingUrl:profile.bookingUrl,paymentPolicy:{maxPaymentAmount:Number(runOptions.maxPaymentAmount)||0}});
    return null;
  }
  return {detectAdapterId,prepareTargetUrl,createPageAdapter};
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
      panelOpen:run.panelOpen
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

  function createMobileConfigMarkup(profiles,state={},viewState={},localUser={}){
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
    const hourOptions=Array.from({length:24},(_,h)=>`<option value="${h}">${String(h).padStart(2,'0')}시대</option>`).join('');
    const detectedTheme=esc(viewState?.pageScan?.themeName||viewState?.detectedThemeName||'');
    const detectedBranch=esc(viewState?.pageScan?.branchName||viewState?.detectedBranchName||'');
    const scanText=viewState.pageScan?`${viewState.pageScan.siteName||''}${viewState.pageScan.branchName?' · '+viewState.pageScan.branchName:''}${viewState.pageScan.themeName?' · '+viewState.pageScan.themeName:''}`:'현재 페이지를 눌러 자동 인식';
    const open=viewState.panelOpen===false?'':' open';
    const imageUrl=safeImageUrl(selected?.imageUrl||'');
    const openingRule=selected?.openingRule||{};
    const themePreview=selected?`<div class="th-theme-preview">${imageUrl?`<img src="${esc(imageUrl)}" alt="${esc(selected.themeName||'테마')} 포스터">`:'<div class="th-theme-placeholder">🎟️</div>'}<div><strong>${esc(selected.themeName||'')}</strong><span>${esc(selected.branchName||'')}</span><small>D-${Number.isInteger(openingRule.daysBefore)?openingRule.daysBefore:'?'} · ${esc(openingRule.openTime||'시간 확인 필요')}</small></div></div>`:'';
    return `<details class="th-panel"${open}><summary><strong>Ticket Helper</strong><span>${esc(selected?.themeName||'탭해서 설정')}</span></summary><div class="th-mobile-config">
      <button type="button" class="th-scan-button" data-action="scan-current">⌖ 현재 페이지 인식</button>
      <div class="th-scan-result">${esc(scanText)}</div>
      ${themePreview}

      <div class="th-section-title">저장된 예약 목록</div>
      <label>사이트<select data-field="site">${siteOptions}</select></label>
      <label>지점<select data-field="branch">${branchOptions}</select></label>
      <label>테마<select data-field="profile">${themeOptions}</select></label>
      <label>목표 날짜<input data-field="target-date" type="date" value="${esc(state.targetDate||'')}"></label>
      <button type="button" class="th-scan-button secondary" data-action="scan-target-date">목표일 회차 불러오기</button>

      <div class="th-section-title">실제 회차 우선순위 <small>원하는 순서대로 탭</small></div>
      <div class="th-time-grid">${sessionButtons}</div>
      ${times.length?'<button type="button" class="th-link-button" data-action="clear-session-priority">회차 우선순위 초기화</button>':''}

      <div class="th-section-title">보조 시간대 <small>회차가 바뀔 때 사용</small></div>
      <div class="th-time-grid">${hourButtons}</div>
      <div class="th-inline-add"><select data-field="hour-to-add">${hourOptions}</select><button type="button" data-action="add-hour">시간대 추가</button></div>

      <div class="th-section-title">실행</div>
      <label>모드<select data-field="mode"><option value="practice"${state.mode==='practice'||!state.mode?' selected':''}>연습 · 확정 안 함</option><option value="live"${state.mode==='live'?' selected':''}>실전 · 예약확정 / 결제 직전</option><option value="confirm"${state.mode==='confirm'?' selected':''}>예약 확정까지 · 최종 결제 클릭</option></select></label>
      <label class="th-check"><input data-field="captcha-auto-resume" type="checkbox"${state.captchaAutoResume!==false?' checked':''}> CAPTCHA 직접 완료 후 자동 계속</label>
      <label class="th-check"><input data-field="fallback" type="checkbox"${state.fallbackEnabled!==false?' checked':''}> 실패 시 다음 테마</label>
      <label>최종 결제 상한(원)<input data-field="max-payment-amount" type="number" min="0" step="1000" inputmode="numeric" value="${esc(state.maxPaymentAmount||'')}" placeholder="예: 120000"></label>
      <div class="th-warning">※ ‘예약 확정까지’는 네이버에서 표시된 결제금액이 상한 이하일 때만 최종 결제 버튼을 누릅니다. 생체인증/추가인증은 직접 진행합니다.</div>
      <label>예약자 이름<input data-field="local-name" autocomplete="name" value="${esc(localUser.name||'')}"></label>
      <label>연락처<input data-field="local-phone" inputmode="tel" autocomplete="tel" value="${esc(localUser.phone||'')}" placeholder="01012345678"></label>
      <div class="th-config-actions"><button type="button" data-action="prepare"${selected?'':' disabled'}>티켓팅 준비</button><button type="button" data-action="stop" class="secondary">중지</button></div>
      <div class="th-config-actions"><button type="button" data-action="practice-now" class="secondary"${selected?'':' disabled'}>즉시 연습 테스트</button><button type="button" data-action="timing-test" class="secondary"${selected?'':' disabled'}>10초 오픈 테스트</button></div>
      <div class="th-warning">연습 테스트는 실제 오픈시간을 기다리지 않습니다. ‘10초 오픈 테스트’는 10초 뒤 실제 오픈 트리거와 같은 재개 경로를 확인합니다. 목표 날짜 자체가 사이트에서 비활성화되어 있으면 날짜 선택 단계에서 멈춥니다.</div>

      <details class="th-subsection"><summary>테마 설정 / 현재 페이지 등록</summary><div class="th-subsection-body">
        <label>지점명<input data-field="new-branch-name" value="${detectedBranch}" placeholder="예: 우주라이크 / 드림이스케이프"></label>
        <label>테마명<input data-field="new-theme-name" value="${detectedTheme}" placeholder="예: WANNA GO HOME"></label>
        <label>오픈 D-<input data-field="new-days-before" type="number" min="0" max="60" inputmode="numeric" placeholder="예: 6"></label>
        <label>오픈 시각<input data-field="new-open-time" type="time" placeholder="10:00"></label>
        <button type="button" data-action="add-current">현재 페이지 등록 / 업데이트</button>
        ${selected?`<div class="th-divider"></div><label>선택 테마명<input data-field="profile-theme-name" value="${esc(selected.themeName||'')}"></label><label>선택 지점명<input data-field="profile-branch-name" value="${esc(selected.branchName||'')}"></label><label>오픈 D-<input data-field="profile-days-before" type="number" min="0" max="60" inputmode="numeric" value="${selected.openingRule?.daysBefore??''}"></label><label>오픈 시각<input data-field="profile-open-time" type="time" value="${esc(selected.openingRule?.openTime||'')}"></label>`:''}
      </div></details>
      <details class="th-subsection"><summary>업데이트 · v${esc(viewState.installedVersion||'?')}</summary><div class="th-subsection-body"><div class="th-warning">새 버전 확인 후 업데이트 파일을 엽니다. Safari에서 Userscripts 팝업을 열어 업데이트를 승인하면 됩니다.</div><button type="button" data-action="check-update" class="secondary">새 버전 확인</button></div></details>
      <details class="th-subsection"><summary>백업</summary><div class="th-subsection-body th-config-actions"><button type="button" data-action="import-profiles" class="secondary">가져오기</button><button type="button" data-action="export-profiles" class="secondary">내보내기</button></div></details>
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
    const current=out[i]; const rule={...(current.openingRule||{})};
    const days=Number(cfg.profileDaysBefore);
    if(Number.isInteger(days)&&days>=0&&days<=60)rule.daysBefore=days;
    if(/^\d{2}:\d{2}$/.test(String(cfg.profileOpenTime||'')))rule.openTime=String(cfg.profileOpenTime);
    const theme=String(cfg.profileThemeName||'').trim(); const branch=String(cfg.profileBranchName||'').trim();
    out[i]={...current,themeName:theme||current.themeName,branchName:branch||current.branchName,openingRule:rule};
    return out;
  }

  function safeImageUrl(value){
    const v=String(value||'').trim();
    return /^https?:\/\//i.test(v)?v:'';
  }
  function fieldNeedsRerender(field){return field==='site'||field==='branch'||field==='profile';}
  function capturePanelUiState(rootNode){
    const panel=rootNode?.querySelector?.('.th-panel'); const status=rootNode?.querySelector?.('.th-status-content');
    return {panelScrollTop:Number(panel?.scrollTop||0),panelOpen:!!panel?.open,statusScrollTop:Number(status?.scrollTop||0)};
  }
  function restorePanelUiState(rootNode,state={}){
    const panel=rootNode?.querySelector?.('.th-panel'); const status=rootNode?.querySelector?.('.th-status-content');
    if(panel){panel.open=state.panelOpen!==false;panel.scrollTop=Number(state.panelScrollTop||0);}
    if(status)status.scrollTop=Number(state.statusScrollTop||0);
  }

  function mountUserscriptPanel(host,{profiles=[],state={},viewState={},localUser={},onPrepare,onPracticeNow,onTimingTest,onStop,onChange,onImport,onExport,onAddCurrent,onScan,onScanTargetDate,onSessionPriority,onClearSessionPriority,onAddHour,onRemoveHour,onCheckUpdate}={}){
    const rootNode=host.shadowRoot||host.attachShadow?.({mode:'open'})||host;
    const previousUi=capturePanelUiState(rootNode);
    const css=(typeof globalThis!=='undefined'&&globalThis.TICKET_HELPER_CSS)||'';
    rootNode.innerHTML=`<style>${css}
      :host{all:initial}.th-shell{position:fixed;left:max(8px,env(safe-area-inset-left));right:max(8px,env(safe-area-inset-right));bottom:max(8px,env(safe-area-inset-bottom));width:auto;max-width:430px;margin-left:auto;z-index:2147483647;pointer-events:none;font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo",system-ui,sans-serif}
      .th-panel,.th-status-panel{pointer-events:auto;background:#fff;border:1px solid #e3e6ef;border-radius:18px;box-shadow:0 14px 42px rgba(0,0,0,.22);overflow:hidden;box-sizing:border-box}.th-panel[open]{max-height:calc(100dvh - 105px);overflow:auto}.th-panel:not([open]){width:max-content;max-width:100%;margin-left:auto;border-radius:999px}.th-panel:not([open])>summary{background:#5b5ce2;color:#fff;border-radius:999px;padding:11px 16px}.th-panel:not([open])>summary span{display:none}.th-panel:not([open])~.th-status-panel{display:none}
      .th-panel>summary,.th-status-panel>summary,.th-subsection>summary{list-style:none;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 14px;font:800 14px system-ui;color:#161b2c;cursor:pointer}.th-panel>summary::-webkit-details-marker,.th-status-panel>summary::-webkit-details-marker,.th-subsection>summary::-webkit-details-marker{display:none}.th-panel>summary span{font-size:11px;color:#667085;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:60%}
      .th-mobile-config{background:#fff;padding:10px 12px 14px;display:grid;grid-template-columns:minmax(0,1fr);gap:9px;box-sizing:border-box;overflow-x:hidden}.th-mobile-config *{box-sizing:border-box;min-width:0}.th-mobile-config label{font:700 11px/1.4 system-ui;color:#667085;display:flex;flex-direction:column;gap:4px}.th-mobile-config select,.th-mobile-config input{width:100%;font:700 14px system-ui;padding:10px 11px;border:1px solid #e3e6ef;border-radius:11px;background:#fff;color:#161b2c}.th-mobile-config .th-check{flex-direction:row;align-items:center;gap:8px}.th-mobile-config .th-check input{width:auto}.th-mobile-config small{font-weight:500;color:#98a2b3}.th-config-actions{display:flex;gap:8px;flex-wrap:wrap}.th-config-actions button,.th-subsection button,.th-inline-add button,.th-scan-button{flex:1;border:0;border-radius:11px;padding:11px 12px;background:#5b5ce2;color:#fff;font-weight:800;font-size:13px}.th-config-actions button.secondary,.th-config-actions button:disabled{background:#f0f2f8;color:#667085}.th-section-title{font:900 12px system-ui;color:#344054;margin-top:5px;padding-top:8px;border-top:1px solid #eef0f5}.th-section-title:first-of-type{border-top:0}.th-scan-button{width:100%;background:#161b2c}.th-scan-button.secondary{background:#5b5ce2}.th-scan-result{font:600 11px/1.4 system-ui;color:#667085;background:#f6f7fb;border-radius:10px;padding:9px 10px}.th-time-grid{display:flex;gap:7px;flex-wrap:wrap}.th-time-chip,.th-hour-chip{border:1px solid #dfe3ee;border-radius:999px;padding:8px 10px;background:#f7f8fb;color:#344054;font:800 12px system-ui}.th-time-chip.selected{background:#ececff;color:#4b4cd3;border-color:#cfd0ff}.th-time-chip b,.th-hour-chip b{display:inline-flex;align-items:center;justify-content:center;min-width:17px;height:17px;border-radius:999px;background:#5b5ce2;color:#fff;font-size:10px}.th-inline-add{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px}.th-inline-add button{flex:none}.th-theme-preview{display:grid;grid-template-columns:72px minmax(0,1fr);gap:10px;align-items:center;padding:9px;border:1px solid #eef0f5;border-radius:12px;background:#fbfcfe}.th-theme-preview img,.th-theme-placeholder{width:72px;height:72px;object-fit:cover;border-radius:10px;background:#eef0f5}.th-theme-placeholder{display:grid;place-items:center;font-size:28px}.th-theme-preview div:last-child{display:flex;flex-direction:column;gap:3px;min-width:0}.th-theme-preview strong{font:900 14px system-ui;color:#161b2c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.th-theme-preview span{font:700 11px system-ui;color:#667085}.th-theme-preview small{font:700 10px system-ui;color:#5b5ce2}.th-link-button{border:0;background:transparent;color:#5b5ce2;font:800 12px system-ui;text-align:left;padding:2px}.th-empty{font:600 11px system-ui;color:#98a2b3}.th-warning{font:600 10px/1.45 system-ui;color:#7a5b00;background:#fff8dd;border-radius:10px;padding:9px 10px}.th-subsection{border:1px solid #eef0f5;border-radius:12px;background:#fbfcfe}.th-subsection>summary{font-size:12px;padding:10px 11px}.th-subsection-body{display:grid;grid-template-columns:minmax(0,1fr);gap:8px;padding:0 10px 10px}.th-divider{height:1px;background:#eef0f5;margin:2px 0}.th-status-panel{margin-top:7px}.th-status-content{max-height:34vh;overflow:auto}
    </style><div class="th-shell">${createMobileConfigMarkup(profiles,state,viewState,localUser)}<details class="th-status-panel"><summary>상태 / 상세</summary><div class="th-status-content">${deps.createAppMarkup?deps.createAppMarkup(viewState):''}</div></details></div>`;
    rootNode.querySelector('[data-action="prepare"]')?.addEventListener('click',()=>onPrepare?.(readConfig(rootNode)));
    rootNode.querySelector('[data-action="practice-now"]')?.addEventListener('click',()=>onPracticeNow?.(readConfig(rootNode)));
    rootNode.querySelector('[data-action="timing-test"]')?.addEventListener('click',()=>onTimingTest?.(readConfig(rootNode)));
    rootNode.querySelector('[data-action="stop"]')?.addEventListener('click',()=>onStop?.());
    rootNode.querySelector('[data-action="scan-current"]')?.addEventListener('click',()=>onScan?.(readConfig(rootNode)));
    rootNode.querySelector('[data-action="scan-target-date"]')?.addEventListener('click',()=>onScanTargetDate?.(readConfig(rootNode)));
    rootNode.querySelector('[data-action="import-profiles"]')?.addEventListener('click',()=>onImport?.());
    rootNode.querySelector('[data-action="export-profiles"]')?.addEventListener('click',()=>onExport?.());
    rootNode.querySelector('[data-action="check-update"]')?.addEventListener('click',()=>onCheckUpdate?.());
    rootNode.querySelector('[data-action="add-current"]')?.addEventListener('click',()=>onAddCurrent?.(readConfig(rootNode)));
    rootNode.querySelector('[data-action="clear-session-priority"]')?.addEventListener('click',()=>onClearSessionPriority?.(readConfig(rootNode)));
    rootNode.querySelector('[data-action="add-hour"]')?.addEventListener('click',()=>onAddHour?.(readConfig(rootNode),Number(rootNode.querySelector('[data-field="hour-to-add"]')?.value)));
    for(const el of rootNode.querySelectorAll?.('[data-action="session-priority"]')||[]) el.addEventListener('click',()=>onSessionPriority?.(readConfig(rootNode),el.dataset.time));
    for(const el of rootNode.querySelectorAll?.('[data-action="remove-hour"]')||[]) el.addEventListener('click',()=>onRemoveHour?.(readConfig(rootNode),Number(el.dataset.hour)));
    for(const el of rootNode.querySelectorAll?.('[data-field]')||[]){
      if(String(el.dataset?.field||'').startsWith('new-')||el.dataset?.field==='hour-to-add') continue;
      el.addEventListener('change',()=>onChange?.(readConfig(rootNode),el.dataset.field,fieldNeedsRerender(el.dataset.field)));
    }
    restorePanelUiState(rootNode,previousUi);
    return rootNode;
  }

  function readConfig(rootNode){return {
    siteId:rootNode.querySelector('[data-field="site"]')?.value||'',branchId:rootNode.querySelector('[data-field="branch"]')?.value||'',profileId:rootNode.querySelector('[data-field="profile"]')?.value||'',
    targetDate:rootNode.querySelector('[data-field="target-date"]')?.value||'',mode:rootNode.querySelector('[data-field="mode"]')?.value||'practice',fallbackEnabled:!!rootNode.querySelector('[data-field="fallback"]')?.checked,
    captchaAutoResume:!!rootNode.querySelector('[data-field="captcha-auto-resume"]')?.checked,maxPaymentAmount:rootNode.querySelector('[data-field="max-payment-amount"]')?.value||'',
    localName:rootNode.querySelector('[data-field="local-name"]')?.value||'',localPhone:rootNode.querySelector('[data-field="local-phone"]')?.value||'',
    profileThemeName:rootNode.querySelector('[data-field="profile-theme-name"]')?.value||'',profileBranchName:rootNode.querySelector('[data-field="profile-branch-name"]')?.value||'',profileDaysBefore:rootNode.querySelector('[data-field="profile-days-before"]')?.value||'',profileOpenTime:rootNode.querySelector('[data-field="profile-open-time"]')?.value||'',
    newBranchName:rootNode.querySelector('[data-field="new-branch-name"]')?.value||'',newThemeName:rootNode.querySelector('[data-field="new-theme-name"]')?.value||'',newDaysBefore:rootNode.querySelector('[data-field="new-days-before"]')?.value||'',newOpenTime:rootNode.querySelector('[data-field="new-open-time"]')?.value||''
  };}

  return {buildOverlayState,catalogFromProfiles,resolveSelection,createMobileConfigMarkup,applyMobilePriorityConfig,applyMobileProfileConfig,safeImageUrl,fieldNeedsRerender,capturePanelUiState,restorePanelUiState,mountUserscriptPanel,readConfig};
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
  const UPDATE_INTERVAL_MS=24*60*60*1000;

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

  function detectThemeNameFromPage(doc=hostRoot.document){
    if(!doc)return '';
    const meta=doc.querySelector?.('meta[property="og:title"]')?.content;
    const candidates=[meta,doc.title,doc.querySelector?.('h1')?.textContent,doc.querySelector?.('h2')?.textContent];
    for(const value of candidates){const cleaned=cleanDetectedThemeName(value);if(cleaned&&cleaned.length<=80)return cleaned;}
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
      if(selectedLabels[1]&&!/선택|테마/i.test(selectedLabels[1])) themeName=selectedLabels[1];
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
    return {adapterId,siteId:adapterId,siteName,branchId,branchName,themeName,imageUrl:detectThemeImageFromPage(doc),url:String(url||'')};
  }

  function createProfileFromCurrentPage(input={},helpers=deps){
    const url=String(input.url||'');
    const adapterId=helpers.detectAdapterId?.(url);
    if(!adapterId) throw new Error('지원하는 예약 페이지가 아닙니다.');
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
    const url=typeof helpers.prepareTargetUrl==='function'?helpers.prepareTargetUrl(next.adapterId,next.bookingUrl,state.targetDate):next.bookingUrl;
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
    return false;
  }

  function createArmedCheckpoint(profile,state,helpers=deps,nowMs=Date.now()){
    if(state?.bypassOpeningSchedule===true)return null;
    if(!profile?.openingRule||!state?.targetDate||typeof helpers.createOpenTrigger!=='function')return null;
    let trigger;
    try{trigger=helpers.createOpenTrigger(state.targetDate,profile.openingRule);}catch{return null;}
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

  async function scanTargetDateSessions({profile,targetDate,doc=hostRoot.document,win=hostRoot,helpers=deps,pollMs=80,maxWaitMs=2200,sleep=(ms)=>new Promise(resolve=>setTimeout(resolve,ms))}={}){
    if(!profile) return {ok:false,stage:'profile-missing',message:'테마를 먼저 선택하세요.'};
    if(!/^\d{4}-\d{2}-\d{2}$/.test(String(targetDate||''))) return {ok:false,stage:'date-missing',message:'목표 날짜를 먼저 선택하세요.'};
    const targetUrl=typeof helpers.prepareTargetUrl==='function'?helpers.prepareTargetUrl(profile.adapterId,profile.bookingUrl,targetDate):profile.bookingUrl;
    const currentUrl=String(win?.location?.href||'');
    const locationMatches=typeof helpers.sameBookingLocation==='function'?helpers.sameBookingLocation(currentUrl,targetUrl):(!currentUrl||!targetUrl||currentUrl===targetUrl);
    if(currentUrl&&targetUrl&&!locationMatches) return {ok:false,stage:'navigating',message:'선택한 지점 예약 페이지로 이동합니다.',navigateTo:targetUrl};
    const adapter=helpers.createPageAdapter?.(profile,doc,win);
    if(!adapter) return {ok:false,stage:'adapter-missing',message:'현재 페이지에서 예약 어댑터를 만들 수 없습니다.'};
    if(typeof adapter.selectTheme==='function'){
      const themeSelected=await adapter.selectTheme(profile.themeName);
      if(!themeSelected?.ok)return themeSelected;
    }
    const selected=await adapter.selectTargetDate(targetDate);
    if(!selected?.ok){
      if(selected?.navigateTo) return {...selected,ok:false,navigateTo:selected.navigateTo};
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
    if(!doc.documentElement) await new Promise(resolve=>doc.addEventListener('DOMContentLoaded',resolve,{once:true}));
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
    const host=doc.createElement('div');host.id='ticket-helper-root';doc.documentElement.appendChild(host);
    const currentId=settings.profileId||checkpoint?.profileId||'';
    const bootContext=detectCurrentPageContext(hostRoot.location.href,doc,profiles);
    const initialProfile=selectProfileForPageContext(profiles,bootContext,currentId);
    const state={profileId:initialProfile?.id||'',siteId:settings.siteId||initialProfile?.siteId||'',branchId:String(settings.branchId||initialProfile?.branchId||''),targetDate:settings.targetDate||checkpoint?.targetDate||'',mode:settings.mode||checkpoint?.mode||'practice',fallbackEnabled:settings.fallbackEnabled!==false,captchaAutoResume:settings.captchaAutoResume!==false,maxPaymentAmount:settings.maxPaymentAmount||'',lastUpdateCheckAt:Number(settings.lastUpdateCheckAt||0)};
    let reloadTimer=null, pageScan=null;

    function selectedProfile(){return profiles.find(p=>p.id===state.profileId)||profiles[0]||null;}
    function viewData(){
      const p=selectedProfile();
      const schedule=p?deps.resolveSessionSchedule(state.targetDate||new Date().toISOString().slice(0,10),[],p.sessionTemplates||{}):{source:'none',times:[],userPriority:[]};
      const fallbackThemes=(p?.fallbackThemeIds||[]).map(id=>profiles.find(x=>x.id===id)?.themeName||id);
      let openingText='자동 계산';
      try{if(p?.openingRule&&state.targetDate&&deps.calculateOpeningInstant){const d=deps.calculateOpeningInstant(state.targetDate,p.openingRule);openingText=new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(d);}}catch{}
      const ctx=detectCurrentPageContext(hostRoot.location.href,doc,profiles);
      const isBookingPage=(ctx.adapterId==='keyescape'&&/reservation1\.php|reservation2\.php/i.test(hostRoot.location.pathname||''))||(ctx.adapterId==='naver-booking'&&/\/items\/\d+|\/request/i.test(hostRoot.location.pathname||''));
      const viewState=deps.buildOverlayState(p,schedule,{...state,openingText,fallbackThemes,adapterHealth:ctx.adapterId?'정상':'지원 페이지 아님',detectedThemeName:ctx.themeName,detectedBranchName:ctx.branchName,pageScan,panelOpen:isBookingPage||!!checkpoint});
      viewState.installedVersion=String(hostRoot.TICKET_HELPER_VERSION||'0.1.8');
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
      const settingsCfg={profileId:state.profileId||cfg.profileId,siteId:state.siteId||cfg.siteId,branchId:state.branchId||cfg.branchId,targetDate:cfg.targetDate,mode:cfg.mode,fallbackEnabled:cfg.fallbackEnabled,captchaAutoResume:cfg.captchaAutoResume,maxPaymentAmount:cfg.maxPaymentAmount};
      Object.assign(state,settingsCfg); await storage.setSettings(state);
      if(changedField==='local-name'||changedField==='local-phone'||changedField==='prepare'){localUser={name:cfg.localName||'',phone:cfg.localPhone||''};await storage.setLocalUser(localUser);}
      if(['profile-theme-name','profile-branch-name','profile-days-before','profile-open-time','prepare'].includes(changedField)){
        profiles=typeof deps.applyMobileProfileConfig==='function'?deps.applyMobileProfileConfig(profiles,cfg):deps.applyMobilePriorityConfig(profiles,cfg);
        await storage.setProfiles(profiles);
      }
      return settingsCfg;
    }

    function targetFor(profile,targetDate){return deps.prepareTargetUrl(profile.adapterId,profile.bookingUrl,targetDate);}
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

    async function checkUpdate(force=false){
      const now=Date.now();
      if(!force&&state.lastUpdateCheckAt&&now-state.lastUpdateCheckAt<UPDATE_INTERVAL_MS)return {status:'skipped'};
      if(typeof gm.xmlHttpRequest!=='function'){
        if(force)hostRoot.alert?.('현재 Userscripts 버전에서 원격 업데이트 확인 API를 사용할 수 없습니다.');
        return {status:'unsupported'};
      }
      try{
        const response=await gm.xmlHttpRequest({method:'GET',url:UPDATE_META_URL,headers:{'Cache-Control':'no-cache'}});
        state.lastUpdateCheckAt=now; await storage.setSettings(state);
        const status=Number(response?.status||0);
        if(status&&status>=400)throw new Error(`HTTP ${status}`);
        const remote=parseUserscriptMetaVersion(response?.responseText||response?.response||'');
        const current=String(hostRoot.TICKET_HELPER_VERSION||'0.1.8');
        if(!remote)throw new Error('원격 버전 정보를 읽지 못했습니다.');
        if(compareVersions(remote,current)>0){
          const accepted=hostRoot.confirm?.(`Ticket Helper v${remote} 새 버전이 있습니다.\n현재 v${current}\n\n업데이트 파일을 열까요? 열린 뒤 Userscripts 팝업에서 업데이트를 승인하면 됩니다.`);
          if(accepted){hostRoot.location.href=UPDATE_DOWNLOAD_URL;return {status:'opened',remote,current};}
          return {status:'available',remote,current};
        }
        if(force)hostRoot.alert?.(`현재 최신 버전입니다. (v${current})`);
        return {status:'current',remote,current};
      }catch(err){
        if(force)hostRoot.alert?.(`업데이트 확인 실패: ${String(err?.message||err)}\n업데이트 채널이 아직 설정되지 않았을 수도 있습니다.`);
        return {status:'error',error:err};
      }
    }

    let render=()=>{};

    function makeMachine(selected,cfg,fallbackCursor){
      const adapter=deps.createPageAdapter(selected,doc,hostRoot,{maxPaymentAmount:Number(cfg.maxPaymentAmount)||0});
      if(!adapter)return null;
      const observer=async payload=>{
        const updated=await storage.saveObservedSchedule(payload.profileId,payload.targetDate,payload.sessions,Date.now());
        if(updated){const i=profiles.findIndex(p=>p.id===updated.id);if(i>=0)profiles[i]=updated;render();}
      };
      const hooks=deps.createBrowserRunHooks({saveCheckpoint:cp=>storage.setCheckpoint(cp),profileId:selected.id,targetDate:cfg.targetDate,mode:cfg.mode,fallbackCursor});
      const machine=new deps.TicketRunMachine({profiles,adapterResolver:()=>adapter,onScheduleObserved:observer,onBeforeAdvance:hooks.onBeforeAdvance,onBeforeConfirm:hooks.onBeforeConfirm});
      return {machine,adapter};
    }

    async function settleResult(result,selected,cfg,fallbackCursor,openTrigger,machine){
      if(openTrigger&&deps.shouldRetryOpeningResult?.(result,openTrigger)){
        checkpoint=deps.createPersistedCheckpoint({profileId:selected.id,stage:'armed',targetDate:cfg.targetDate,mode:cfg.mode,fallbackCursor,now:Date.now,extra:{autoContinue:true,openTrigger,events:result.events||[]}});
        await storage.setCheckpoint(checkpoint);
        scheduleReloadForTrigger(openTrigger);
        return {retryOpening:true,result};
      }
      if(result?.stage==='awaiting-captcha'&&cfg.mode!=='practice'&&cfg.captchaAutoResume!==false&&machine){
        try{hostRoot.navigator?.vibrate?.([80,40,80]);}catch{}
        checkpoint=deps.createPersistedCheckpoint({profileId:selected.id,stage:'awaiting-captcha',targetDate:cfg.targetDate,mode:cfg.mode,fallbackCursor,now:Date.now,extra:{autoContinue:true,sessionLabel:result.session||'',events:result.events||[]}});
        await storage.setCheckpoint(checkpoint);
        result=await deps.waitForManualCaptcha(machine,{profileId:selected.id,targetDate:cfg.targetDate,mode:cfg.mode,session:{label:result.session||''},fallbackCursor},{pollMs:100,maxWaitMs:15*60*1000});
      }
      return handleRunResult({result,profiles,state:{...state,...cfg,profileId:selected.id},storage,helpers:deps,navigate:url=>{hostRoot.location.href=url}});
    }

    async function execute(selected,cfg,fallbackCursor,openTrigger){
      if(!selected||!cfg.targetDate)return null;
      const target=targetFor(selected,cfg.targetDate);
      if(target&&!sameUrl(hostRoot.location.href,target)){
        const nextState={...state,...cfg,profileId:selected.id};
        await storage.setSettings(nextState);
        checkpoint=deps.createPersistedCheckpoint({profileId:selected.id,stage:'selecting-date',targetDate:cfg.targetDate,mode:cfg.mode,fallbackCursor,now:Date.now,extra:{autoContinue:true,events:[],openTrigger}});
        await storage.setCheckpoint(checkpoint);
        hostRoot.location.href=target;
        return {stage:'navigating'};
      }
      const built=makeMachine(selected,cfg,fallbackCursor);if(!built)return null;
      const result=await built.machine.run({profileId:selected.id,targetDate:cfg.targetDate,mode:cfg.mode,userProfile:localUser||{},fallbackCursor});
      return settleResult(result,selected,cfg,fallbackCursor,openTrigger,built.machine);
    }

    async function resumePersisted(cp){
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
        if(action.kind==='wait'){scheduleReloadForTrigger(action.state);return {stage:'armed-wait'};}
        if(action.kind==='exhausted'){await storage.clearCheckpoint();return {stage:'armed-exhausted'};}
        checkpoint=deps.createPersistedCheckpoint({profileId:selected.id,stage:'armed',targetDate:cfg.targetDate,mode:cfg.mode,fallbackCursor:cp.fallbackCursor,now:Date.now,extra:{autoContinue:true,openTrigger:action.state,events:cp.events||[]}});
        await storage.setCheckpoint(checkpoint);
        return execute(selected,cfg,cp.fallbackCursor,action.state);
      }
      if(cp.stage==='filling-form'||cp.stage==='awaiting-captcha'){
        if(!expectedUserscriptResumePage(selected,cp,doc,hostRoot))return {stage:'resume-page-mismatch'};
        const built=makeMachine(selected,cfg,cp.fallbackCursor);if(!built)return null;
        let result=await deps.resumePersistedStage(built.machine,cp,localUser||{});
        if(result?.stage==='awaiting-captcha'&&cfg.mode!=='practice'&&cfg.captchaAutoResume!==false){
          try{hostRoot.navigator?.vibrate?.([80,40,80]);}catch{}
          checkpoint=deps.createPersistedCheckpoint({profileId:selected.id,stage:'awaiting-captcha',targetDate:cfg.targetDate,mode:cfg.mode,fallbackCursor:cp.fallbackCursor,now:Date.now,extra:{autoContinue:true,sessionLabel:cp.sessionLabel||result.session||'',events:result.events||[]}});
          await storage.setCheckpoint(checkpoint);
          result=await deps.waitForManualCaptcha(built.machine,{profileId:selected.id,targetDate:cfg.targetDate,mode:cfg.mode,session:{label:cp.sessionLabel||result.session||''},fallbackCursor:cp.fallbackCursor},{pollMs:100,maxWaitMs:15*60*1000});
        }
        return handleRunResult({result,profiles,state:{...state,...cfg},storage,helpers:deps,navigate:url=>{hostRoot.location.href=url}});
      }
      return execute(selected,cfg,cp.fallbackCursor,cp.openTrigger);
    }

    async function armOrExecute(selected,cfg){
      if(!selected||!cfg.targetDate)return null;
      const armed=createArmedCheckpoint(selected,{...cfg,fallbackCursor:undefined},deps,Date.now());
      if(!armed)return execute(selected,cfg,undefined,undefined);
      checkpoint=armed;await storage.setCheckpoint(armed);
      const target=targetFor(selected,cfg.targetDate);
      if(target&&!sameUrl(hostRoot.location.href,target)){hostRoot.location.href=target;return {stage:'navigating'};}
      return resumePersisted(armed);
    }

    async function armTimingTest(selected,cfg,delayMs=10000){
      if(!selected||!cfg.targetDate)return null;
      const testCfg={...cfg,mode:'practice',profileId:selected.id};
      const armed=createTimingTestCheckpoint(selected,testCfg,deps,Date.now(),delayMs);
      if(!armed)return null;
      checkpoint=armed;await storage.setCheckpoint(armed);
      const target=targetFor(selected,cfg.targetDate);
      if(target&&!sameUrl(hostRoot.location.href,target)){hostRoot.location.href=target;return {stage:'navigating'};}
      scheduleReloadForTrigger(armed.openTrigger);
      return {stage:'timing-test-armed',delayMs};
    }

    render=()=>{
      const {profile,schedule,viewState}=viewData();
      deps.mountUserscriptPanel(host,{profiles,state,viewState,localUser,
        onChange:async (cfg,field,needsRerender)=>{await persistConfig(cfg,field);if(needsRerender)render();},
        onStop:async()=>{clearReload();await storage.clearCheckpoint();},
        onImport:async()=>{const raw=hostRoot.prompt?.('백업한 프로필 JSON을 붙여넣으세요.','')||'';if(!raw.trim())return;profiles=await storage.importProfiles(raw);state.profileId=profiles[0]?.id||'';await storage.setSettings(state);render();},
        onExport:async()=>{const json=await storage.exportProfiles();if(hostRoot.navigator?.clipboard?.writeText){try{await hostRoot.navigator.clipboard.writeText(json);hostRoot.alert?.('백업 JSON을 클립보드에 복사했습니다.');return;}catch{}}hostRoot.prompt?.('아래 백업 JSON을 복사하세요.',json);},
        onCheckUpdate:async()=>checkUpdate(true),
        onScan:async cfg=>{try{
          const ctx=detectCurrentPageContext(hostRoot.location.href,doc,profiles); let sessions=[];
          if(ctx.adapterId){const temp={id:'scan',adapterId:ctx.adapterId,bookingUrl:hostRoot.location.href};const adapter=deps.createPageAdapter(temp,doc,hostRoot);if(adapter)try{sessions=await adapter.readSessions()}catch{} }
          pageScan={...ctx,sessions};
          const p=selectedProfile(); if(p&&cfg.targetDate&&sessions.length&&p.adapterId===ctx.adapterId){const updated=await storage.saveObservedSchedule(p.id,cfg.targetDate,sessions,Date.now());if(updated){const i=profiles.findIndex(x=>x.id===updated.id);if(i>=0)profiles[i]=updated;}}
          render();
        }catch(err){hostRoot.alert?.(`페이지 인식 실패: ${String(err?.message||err)}`);}},
        onScanTargetDate:async cfg=>{try{
          await persistConfig(cfg,'target-date');
          const p=profiles.find(x=>x.id===cfg.profileId)||selectedProfile();
          if(!p){hostRoot.alert?.('테마를 먼저 등록/선택해 주세요.');return;}
          const result=await scanTargetDateSessions({profile:p,targetDate:cfg.targetDate,doc,win:hostRoot,helpers:deps});
          if(result?.navigateTo){
            state.pendingTargetScan=true; await storage.setSettings(state); hostRoot.location.href=result.navigateTo; return;
          }
          if(!result?.ok){hostRoot.alert?.(`목표일 회차 불러오기 실패: ${String(result?.message||result?.stage||'알 수 없는 오류')}`);return;}
          const ctx=detectCurrentPageContext(hostRoot.location.href,doc,profiles);
          pageScan={...ctx,sessions:result.sessions};
          const updated=await storage.saveObservedSchedule(p.id,cfg.targetDate,result.sessions,Date.now());
          if(updated){const i=profiles.findIndex(x=>x.id===updated.id);if(i>=0)profiles[i]=updated;}
          render();
        }catch(err){hostRoot.alert?.(`목표일 회차 불러오기 실패: ${String(err?.message||err)}`);}},
        onSessionPriority:async (cfg,time)=>{const p=profiles.find(x=>x.id===cfg.profileId);if(!p){return} if(!cfg.targetDate){hostRoot.alert?.('목표 날짜를 먼저 선택해 주세요.');return;} const sessions=pageScan?.sessions||[]; if(sessions.length){const updated=deps.saveObservedSchedule(p,cfg.targetDate,sessions,Date.now());const i=profiles.findIndex(x=>x.id===p.id);profiles[i]=updated;} const i=profiles.findIndex(x=>x.id===p.id);const kind=deps.dayKind(cfg.targetDate);const templates={...(profiles[i].sessionTemplates||{})};const tpl={...(templates[kind]||{kind,times:[],userPriority:[],mismatchPolicy:'exact-then-nearest'})};const priority=Array.isArray(tpl.userPriority)?tpl.userPriority.slice():[];const pos=priority.indexOf(time);if(pos>=0)priority.splice(pos,1);else priority.push(time);templates[kind]={...tpl,userPriority:priority};profiles[i]={...profiles[i],sessionTemplates:templates};await storage.setProfiles(profiles);render();},
        onClearSessionPriority:async cfg=>{const i=profiles.findIndex(x=>x.id===cfg.profileId);if(i<0||!cfg.targetDate)return;const kind=deps.dayKind(cfg.targetDate);const templates={...(profiles[i].sessionTemplates||{})};if(templates[kind])templates[kind]={...templates[kind],userPriority:[]};profiles[i]={...profiles[i],sessionTemplates:templates};await storage.setProfiles(profiles);render();},
        onAddHour:async (cfg,hour)=>{const i=profiles.findIndex(x=>x.id===cfg.profileId);if(i<0)return;profiles[i]={...profiles[i],timePriorities:deps.addHourPriority(profiles[i].timePriorities||[],hour)};await storage.setProfiles(profiles);render();},
        onRemoveHour:async (cfg,hour)=>{const i=profiles.findIndex(x=>x.id===cfg.profileId);if(i<0)return;profiles[i]={...profiles[i],timePriorities:deps.removeHourPriority(profiles[i].timePriorities||[],hour)};await storage.setProfiles(profiles);render();},
        onAddCurrent:async cfg=>{try{const ctx=detectCurrentPageContext(hostRoot.location.href,doc,profiles);const created=createProfileFromCurrentPage({url:hostRoot.location.href,branchName:cfg.newBranchName||ctx.branchName,themeName:cfg.newThemeName||ctx.themeName,daysBefore:Number(cfg.newDaysBefore),openTime:cfg.newOpenTime,imageUrl:ctx.imageUrl},deps);profiles=typeof deps.upsertProfileByIdentity==='function'?deps.upsertProfileByIdentity(profiles,created):[...profiles,created];const saved=profiles.find(p=>typeof deps.semanticProfileKey==='function'&&deps.semanticProfileKey(p)===deps.semanticProfileKey(created))||profiles.find(p=>p.id===created.id)||created;state.profileId=saved.id;state.siteId=saved.siteId;state.branchId=String(saved.branchId||'');await storage.setProfiles(profiles);await storage.setSettings(state);render();hostRoot.alert?.(`테마 등록 완료: ${saved.themeName}`);}catch(err){hostRoot.alert?.(`테마 등록 실패: ${String(err?.message||err)}`);}},
        onPrepare:async cfg=>{await persistConfig(cfg,'prepare');const selected=profiles.find(p=>p.id===state.profileId||p.id===cfg.profileId);return armOrExecute(selected,{...cfg,profileId:selected?.id||cfg.profileId});},
        onPracticeNow:async cfg=>{await persistConfig(cfg,'prepare');const selected=profiles.find(p=>p.id===state.profileId||p.id===cfg.profileId);if(!selected||!cfg.targetDate){hostRoot.alert?.('테마와 목표 날짜를 먼저 선택해 주세요.');return null;}return armOrExecute(selected,{...cfg,mode:'practice',profileId:selected.id,bypassOpeningSchedule:true});},
        onTimingTest:async cfg=>{await persistConfig(cfg,'prepare');const selected=profiles.find(p=>p.id===state.profileId||p.id===cfg.profileId);if(!selected||!cfg.targetDate){hostRoot.alert?.('테마와 목표 날짜를 먼저 선택해 주세요.');return null;}const result=await armTimingTest(selected,{...cfg,profileId:selected.id},10000);if(result?.stage==='timing-test-armed')hostRoot.alert?.('10초 후 실제 오픈 트리거와 같은 경로로 연습 실행합니다. 목표 날짜는 현재 사이트에서 예약 가능한 날짜여야 합니다.');return result;}
      });
      return {profile,schedule};
    };
    render();
    const updateSafePath=!/reservation1\.php|reservation2\.php|\/request(?:\/|$)/i.test(hostRoot.location?.pathname||'');
    if(!checkpoint&&updateSafePath) hostRoot.setTimeout?.(()=>{checkUpdate(false);},1500);

    if(settings.pendingTargetScan&&initialProfile&&state.targetDate){
      state.pendingTargetScan=false; await storage.setSettings(state);
      try{
        const result=await scanTargetDateSessions({profile:initialProfile,targetDate:state.targetDate,doc,win:hostRoot,helpers:deps});
        if(result?.ok){
          const ctx=detectCurrentPageContext(hostRoot.location.href,doc,profiles); pageScan={...ctx,sessions:result.sessions};
          const updated=await storage.saveObservedSchedule(initialProfile.id,state.targetDate,result.sessions,Date.now());
          if(updated){const i=profiles.findIndex(x=>x.id===updated.id);if(i>=0)profiles[i]=updated;}
          render();
        }
      }catch{}
    }

    if(checkpoint?.autoContinue&&initialProfile&&checkpoint.profileId===initialProfile.id&&state.targetDate){
      await resumePersisted(checkpoint);
    }
    return true;
  }
  return {claimBoot,deriveFallbackContinuation,handleRunResult,createScheduleObserver,createArmedCheckpoint,createTimingTestCheckpoint,nextArmedAction,scanTargetDateSessions,expectedUserscriptResumePage,renderBootError,detectThemeNameFromPage,detectThemeImageFromPage,detectCurrentPageContext,createProfileFromCurrentPage,selectProfileForPageContext,parseUserscriptMetaVersion,compareVersions,bootTicketHelper};
});
