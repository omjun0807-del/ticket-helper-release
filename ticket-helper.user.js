// ==UserScript==
// @name         Ticket Helper
// @namespace    ticket-helper.private
// @version      0.1.9
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

globalThis.TICKET_HELPER_VERSION="0.1.9";
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