// ==UserScript==
// @name         Ticket Helper - Ticketlink 경기 진입 시험판
// @namespace    ticket-helper-baseball
// @version      0.1.17
// @description  티켓링크·NOL 경기 진입 보조. 안내 비교 진단은 티켓링크만 지원.
// @match        https://www.ticketlink.co.kr/sports/*
// @match        https://ticketlink.co.kr/sports/*
// @match        https://www.ticketlink.co.kr/error/popup/*
// @match        https://ticketlink.co.kr/error/popup/*
// @match        https://nol.yanolja.com/ticket/genre/sports*
// @match        https://tickets.interpark.com/gates/ticket/*
// @updateURL    https://raw.githubusercontent.com/omjun0807-del/ticket-helper-release/main/baseball/ticketlink-entry.meta.js
// @downloadURL  https://raw.githubusercontent.com/omjun0807-del/ticket-helper-release/main/baseball/ticketlink-entry.user.js
// @run-at       document-idle
// @grant        none
// @noframes
// ==/UserScript==

(function(){
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BaseballNoticeTrial=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const KEY='ticket-helper:baseball-entry:v1:notice-trial';
const MANUAL_KEY=KEY+':manual';
const recordKey=mode=>mode==='manual'?MANUAL_KEY:KEY;
const compact=s=>String(s||'').replace(/\s+/g,'');
const textOf=el=>el.innerText===undefined?el.textContent:el.innerText;
function read(win,mode='auto'){try{const r=JSON.parse(win.localStorage.getItem(recordKey(mode))||'null');return r&&typeof r.id==='string'&&Number.isFinite(r.bookAt)&&Array.isArray(r.events)?r:null;}catch{return null;}}
function start(win,at,mode='auto'){if(read(win,mode)?.status==='blocked')throw Error('이전 진단에서 차단이 확인되어 해당 확인 진단을 종료했습니다.');const r={id:at+'-'+Math.random().toString(36).slice(2,10),version:'0.1.17',mode:mode==='manual'?'manual':'auto',path:win.location.pathname,bookAt:at,status:'waiting',events:[{type:'book',ms:0}]};win.localStorage.setItem(recordKey(mode),JSON.stringify(r));return r;}
function append(win,id,type,at,extra={},mode='auto'){
 const r=read(win,mode);if(!r||r.id!==id||!['waiting','confirm-clicked'].includes(r.status)||!Number.isFinite(at))return r;
 if((type==='confirm'||type==='manual-confirm')&&r.status!=='waiting')return r;
 if(type==='manual-confirm'&&mode!=='manual'||type==='confirm'&&mode==='manual')return r;
 if(type==='seen'&&r.events.some(e=>e.type==='seen'))return r;
 if(!['seen','confirm','manual-confirm','confirm-event','book-event','stop','timeout','guard','error'].includes(type))return r;
 const event={type,ms:Math.max(0,at-r.bookAt)};
 for(const k of ['isTrusted','activationActive'])if(typeof extra[k]==='boolean'||extra[k]===null)event[k]=extra[k];
 if(type==='error')event.code=extra.code==='error.netfunnel.invalid.key'?extra.code:'other';
 r.events.push(event);r.events=r.events.slice(-20);
 if(type==='confirm'||type==='manual-confirm')r.status='confirm-clicked';
 if(type==='stop'||type==='timeout'||type==='guard')r.status=type;
 if(type==='error')r.status='blocked';
 win.localStorage.setItem(recordKey(mode),JSON.stringify(r));return r;
}
function findConfirmation(doc,visible,panel){
 const candidates=new Set();
 for(const button of doc.querySelectorAll('button,a,[role=button]')){
  if(panel.contains(button)||!visible(button)||button.matches(':disabled')||button.getAttribute('aria-disabled')==='true'||button.classList.contains('disabled')||compact(textOf(button))!=='확인')continue;
  for(let box=button.parentElement;box&&box!==doc.body;box=box.parentElement){
   const marker=box.matches('dialog,[role=dialog],[aria-modal=true]')||Array.from(box.classList).some(c=>/^(?:modal|popup|layer)(?:[-_]|$)|(?:[-_])(?:modal|popup|layer)(?:[-_]|$)/i.test(c));
   if(!marker||box.matches('main,article,section,nav,header,footer')||!visible(box))continue;
   const text=compact(textOf(box));
   const title=Array.from(box.querySelectorAll('*')).some(el=>visible(el)&&el.children.length===0&&compact(textOf(el))==='예매안내');
   if(!title||!text.includes('관람')||!text.includes('시야'))continue;
   if(text.length>4000||box.querySelector('input,textarea,select,iframe')||/보안문자|인증문자|자동입력방지|대기순번|접속대기|결제동의/.test(text))break;
   const confirms=Array.from(box.querySelectorAll('button,a,[role=button]')).filter(el=>visible(el)&&compact(textOf(el))==='확인');
   if(confirms.length===1)candidates.add(button);break;
  }
 }
 return candidates.size===1?Array.from(candidates)[0]:null;
}
function observeError(win,at){
 try{
  const recent=[{mode:'auto',record:read(win)},{mode:'manual',record:read(win,'manual')}].filter(item=>item.record).sort((a,b)=>b.record.bookAt-a.record.bookAt)[0];
  const r=recent?.record,url=new URL(win.location.href);if(!r||!['waiting','confirm-clicked'].includes(r.status)||at<r.bookAt||at-r.bookAt>60000||!/^\/error\/popup\//.test(url.pathname)||!win.opener)return;
  const parent=new URL(win.opener.location.href);if(parent.origin!==url.origin||parent.pathname!==r.path)return;
  append(win,r.id,'error',at,{code:url.searchParams.get('errorCode')},recent.mode);
 }catch{}
}
function format(win,mode='auto'){
 const title=mode==='manual'?'안내 직접 확인 비교':'안내 자동 확인 진단',r=read(win,mode);if(!r)return title+' 기록이 없습니다.';
 const labels={book:'예매 클릭',seen:'안내창 발견',confirm:'안내 자동 확인','manual-confirm':'안내 직접 확인 모드 클릭', 'confirm-event':'안내 클릭 이벤트','book-event':'예매 클릭 이벤트',stop:'사용자 중지',timeout:'진단 시간 만료',guard:'화면/인증/대기열 중지',error:'관련 오류창'};
 const lines=[title+' · '+(r.status==='blocked'?'차단 확인 · 추가 클릭 중지':r.status==='confirm-clicked'?'확인 클릭 기록 · 결과 미확인':'진행 상태: '+(['waiting','stop','timeout','guard'].includes(r.status)?r.status:'알 수 없음'))];
 for(const e of r.events){if(!labels[e.type]||!Number.isFinite(e.ms))continue;let line=labels[e.type]+': '+e.ms+'ms';if(typeof e.isTrusted==='boolean')line+=' · isTrusted='+e.isTrusted;if(typeof e.activationActive==='boolean')line+=' · 사용자 활성화='+e.activationActive;if(e.type==='error')line+=' · '+(e.code==='error.netfunnel.invalid.key'?e.code:'기타 오류');lines.push(line);}
 lines.push('오류 기록이 없다고 예약창 진입 성공을 뜻하지는 않습니다.');return lines.join('\n');
}
function formatComparison(win){return format(win)+'\n\n'+format(win,'manual')+'\n\n속도와 클릭 이벤트가 함께 달라질 수 있어 이 비교만으로 차단 원인을 확정할 수 없습니다.';}
return {KEY,MANUAL_KEY,read,start,append,findConfirmation,observeError,format,formatComparison};
});

(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BaseballEntry=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const Trial=typeof module==='object'&&module.exports?require('./notice-trial'):globalThis.BaseballNoticeTrial;
const KEY='ticket-helper:baseball-entry:v1', NOL_KEY='ticket-helper:baseball-nol-entry:v1',GATE_KEY='ticket-helper:baseball-nol-gate:v1';
const VERSION='0.1.17';
const compact=s=>String(s||'').replace(/\s+/g,'').toUpperCase();
function validateConfig(c){
 if(!c||!/^\d{4}-\d{2}-\d{2}$/.test(c.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(c.time))throw Error('경기 날짜와 시간을 확인하세요.');
 const [y,m,d]=c.date.split('-').map(Number),v=new Date(Date.UTC(y,m-1,d));if(v.getUTCFullYear()!==y||v.getUTCMonth()!==m-1||v.getUTCDate()!==d)throw Error('유효한 경기 날짜가 아닙니다.');
 if(typeof c.home!=='string'||typeof c.away!=='string'||compact(c.home).length<2||compact(c.away).length<2||compact(c.home)===compact(c.away)||c.home.length>40||c.away.length>40)throw Error('홈팀과 원정팀을 서로 다르게 입력하세요.');
 return {date:c.date,time:c.time,home:c.home.trim(),away:c.away.trim()};
}
function matchGame(text,c){
 try{validateConfig(c);}catch{return false;}
 const s=String(text||'');const dates=[...s.matchAll(/(?<!\d)(?:(\d{4})[.\/년\s-]+)?(\d{1,2})[.\/월-]+\s*(\d{1,2})(?:일)?(?!\d)/g)];
 const [y,m,d]=c.date.split('-').map(Number),times=[...s.matchAll(/(?<!\d)(\d{1,2}):([0-5]\d)(?!\d)/g)];
 return dates.length===1&&(!dates[0][1]||Number(dates[0][1])===y)&&Number(dates[0][2])===m&&Number(dates[0][3])===d&&times.length===1&&`${times[0][1].padStart(2,'0')}:${times[0][2]}`===c.time&&compact(s).includes(compact(c.home))&&compact(s).includes(compact(c.away));
}
function selector(el,doc){const parts=[];while(el&&el!==doc.body){const parent=el.parentElement;if(!parent)throw Error('경기 행을 지정하지 못했습니다.');parts.unshift(`${el.tagName.toLowerCase()}:nth-child(${Array.from(parent.children).indexOf(el)+1})`);el=parent;}return 'body > '+parts.join(' > ');}
const textOf=el=>el.innerText===undefined?el.textContent:el.innerText;
const gateTitle=s=>/^2026와일드카드결정전[12]차전-LGVS두산$/.test(compact(s));
function validateGateConfig(c){if(!c||!/^\d{1,12}$/.test(c.product)||typeof c.title!=='string'||c.title.length>150||!gateTitle(c.title))throw Error('현재 WC 상품을 먼저 지정하세요.');return {product:c.product,title:c.title};}
function gateTitles(doc,visible,panel){return Array.from(doc.querySelectorAll('p,span,h1,h2,h3,div')).filter(el=>!panel.contains(el)&&visible(el)&&gateTitle(textOf(el))&&!Array.from(el.children).some(child=>visible(child)&&gateTitle(textOf(child))));}
function gateControls(row,visible){return Array.from(row.querySelectorAll('button,a,[role=button]')).filter(el=>visible(el)&&/^(예매하기|남은시간\d{1,2}:[0-5]\d(?::[0-5]\d)?)$/.test(compact(textOf(el))));}
function readyGate(doc,visible,panel){return Array.from(doc.querySelectorAll('h1,h2,h3,p,span,div')).some(el=>!panel.contains(el)&&visible(el)&&compact(textOf(el))==='예매준비가완료됐어요');}
function captureGateTarget(doc,win,visible,panel){
 const titles=gateTitles(doc,visible,panel),product=win.location.pathname.match(/^\/gates\/ticket\/(\d+)\/?$/)?.[1];
 if(!product||titles.length!==1||!readyGate(doc,visible,panel))throw Error('예매 준비가 완료된 단일 WC 상품 화면에서 지정하세요.');
 const controls=gateControls(doc.body,visible).filter(el=>!panel.contains(el));if(controls.length!==1)throw Error('대기 또는 예매 버튼을 하나로 확인하지 못했습니다.');
 for(let row=titles[0].parentElement;row&&row!==doc.body;row=row.parentElement)if(row.contains(controls[0]))return {rowSelector:selector(row,doc),label:textOf(titles[0]).trim().replace(/\s+/g,' '),product};
 throw Error('상품과 버튼의 화면 영역을 확인하지 못했습니다.');
}
function matchGateRow(doc,win,row,c,visible,panel){try{validateGateConfig(c);}catch{return false;}const titles=gateTitles(doc,visible,panel);return !!row&&visible(row)&&win.location.pathname.match(/^\/gates\/ticket\/(\d+)\/?$/)?.[1]===c.product&&titles.length===1&&row.contains(titles[0])&&compact(textOf(titles[0]))===compact(c.title)&&readyGate(doc,visible,panel);}
function findGateTarget(doc,win,target,c,visible,panel){
 let row;try{row=doc.querySelector(target?.rowSelector);}catch{return null;}
 if(!matchGateRow(doc,win,row,c,visible,panel)||target.product!==c.product)return null;
 const controls=gateControls(row,visible);if(controls.length!==1)return null;const el=controls[0];
 return compact(textOf(el))==='예매하기'&&!el.disabled&&!el.matches(':disabled')&&el.getAttribute('aria-disabled')!=='true'&&!el.classList.contains('disabled')?el:null;
}
function gateCountdown(doc,win,target,c,visible,panel){
 let row;try{row=doc.querySelector(target?.rowSelector);}catch{return null;}
 if(!matchGateRow(doc,win,row,c,visible,panel))return null;
 const controls=gateControls(row,visible);if(controls.length!==1)return null;
 const m=compact(textOf(controls[0])).match(/^남은시간(\d{1,2}):([0-5]\d)(?::([0-5]\d))?$/);if(!m)return null;
 return m[3]===undefined?(Number(m[1])*60+Number(m[2]))*1000:(Number(m[1])*3600+Number(m[2])*60+Number(m[3]))*1000;
}
// Apply only our own panel declarations through CSS properties; do not change page CSP.
function applyGateStyles(panel){
 const css=panel.querySelector('style')?.textContent;if(css)panel.gateStyleText=css.split('@media')[0];
 if(!panel.gateStyleText)return;
 for(const el of [panel,...panel.querySelectorAll('*')])while(el.style?.length)el.style.removeProperty(el.style.item(0));
 for(const [,selectors,body] of panel.gateStyleText.matchAll(/([^{}]+)\{([^{}]*)\}/g)){
  const names=selectors.split(',').map(s=>s.trim()).filter(s=>s.startsWith('#th-entry')&&!/:hover|:active|:focus|::/.test(s));
  for(const name of names){let elements;try{elements=[...(panel.matches(name)?[panel]:[]),...panel.querySelectorAll(name)];}catch{continue;}
   for(const declaration of body.split(';')){const i=declaration.indexOf(':');if(i<0)continue;const property=declaration.slice(0,i).trim(),value=declaration.slice(i+1).trim(),important=/!important$/.test(value);for(const el of elements)el.style.setProperty(property,value.replace(/!important$/,''),important?'important':'');}
  }
 }
}
function captureTarget(el,c,doc,visible){
 validateConfig(c);const button=el.closest('button,a,input[type=button],[role=button]');if(!button||!visible(button))throw Error('목표 경기의 버튼을 클릭하세요.');
 for(let row=button.parentElement;row&&row!==doc.body;row=row.parentElement){const text=textOf(row);if(text.length>1200)break;if(matchGame(text,c))return {rowSelector:selector(row,doc),label:text.trim().slice(0,600)};}
 throw Error('버튼 주변에서 날짜·시간·두 팀을 확인하지 못했습니다. 입력을 확인하세요.');
}
function findTarget(doc,target,c,visible,requireUniqueVisible=false){
 if(!target||typeof target.rowSelector!=='string')return null;let row;try{row=doc.querySelector(target.rowSelector);}catch{return null;}
 if(!row||!visible(row)||!matchGame(textOf(row),c))return null;
 const enabled=el=>!el.disabled&&!el.matches(':disabled')&&el.getAttribute('aria-disabled')!=='true'&&!el.classList.contains('disabled');
 const matches=Array.from(row.querySelectorAll('button,a,input[type=button],[role=button]')).filter(el=>visible(el)&&(requireUniqueVisible||enabled(el))&&/^(예매|예매하기)$/.test(compact(el.value||textOf(el))));
 return matches.length===1&&enabled(matches[0])?matches[0]:null;
}
// Match only the informational sports notice seen in the user's capture.
const isNoticeBox=el=>el.matches('dialog,[role=dialog],[aria-modal=true]')||Array.from(el.classList).some(c=>/^(?:modal|popup|layer)(?:[-_]|$)|(?:[-_])(?:modal|popup|layer)(?:[-_]|$)/i.test(c));
function noticeDiagnostic(doc,visible,panel){
 const controls=Array.from(doc.querySelectorAll('button,a,input[type=button],[role=button],span,div')).filter(el=>!panel.contains(el)&&visible(el)&&compact(el.value||textOf(el))==='확인'&&(!el.matches('span,div')||el.children.length===0));
 const lines=['안내창 진단 · 화면에 보이는 확인 후보 '+controls.length+'개'];
 for(const control of controls.slice(0,5)){
  lines.push('버튼: '+control.tagName.toLowerCase()+' · class='+String(control.className||'없음').slice(0,120));
  let box=control.parentElement,depth=0;
  while(box&&box!==doc.body&&depth++<8){
   const titled=Array.from(box.querySelectorAll('*')).some(el=>visible(el)&&compact(textOf(el))==='예매안내');
   const text=compact(textOf(box));
   lines.push('부모 '+depth+': '+box.tagName.toLowerCase()+' · class='+String(box.className||'없음').slice(0,120)+' · 팝업 표식: '+(isNoticeBox(box)?'예':'아니오')+' · 제목 일치: '+(titled?'예':'아니오')+' · 관람/시야: '+(text.includes('관람')&&text.includes('시야')?'예':'아니오')+' · 입력/iframe: '+(box.querySelector('input,textarea,select,iframe')?'있음':'없음'));
   if(titled&&text.includes('관람')&&text.includes('시야'))break;
   box=box.parentElement;
  }
 }
 if(!controls.length)lines.push('확인 버튼을 현재 문서에서 찾지 못했습니다. 별도 창 또는 iframe 여부를 확인해야 합니다.');
 return lines.join('\n');
}
function decide(state,{now,url,access,targetReady,reloadAtOpen=true}){
 if(!state||!['armed','reloaded'].includes(state.phase)||!Number.isFinite(state.openAt)||!Number.isFinite(now)||url!==state.url||access!=='ready'||now>state.openAt+30000)return 'stop';
 if(now<state.openAt)return 'wait';if(state.phase==='armed'&&reloadAtOpen)return 'reload';return targetReady?'click':'wait';
}
function mount(doc,win,options={}){
 const nol=options.provider==='nol',gate=nol&&win.location.origin==='https://tickets.interpark.com'&&/^\/gates\/ticket\/\d{1,12}\/?$/.test(win.location.pathname),runKey=gate?GATE_KEY:nol?NOL_KEY:KEY,foldKey=runKey+':folded',settingsKey=runKey+':settings',version=VERSION;
 const currentUrl=()=>gate?win.location.origin+win.location.pathname:win.location.href;
 const supportedPage=()=>nol?(gate?win.location.origin==='https://tickets.interpark.com'&&/^\/gates\/ticket\/\d{1,12}\/?$/.test(win.location.pathname):/^https:\/\/nol\.yanolja\.com\/ticket\/genre\/sports(?:\/[a-z0-9-]+)?\/?(?:[?#]|$)/.test(win.location.href)):/^https:\/\/(www\.)?ticketlink\.co\.kr\/sports\//.test(win.location.href);
 if(!nol&&/^https:\/\/(www\.)?ticketlink\.co\.kr\/error\/popup\//.test(win.location.href)){Trial.observeError(win,(options.now||(()=>Date.now()))());return null;}
 if(!supportedPage())return null;
 if(doc.getElementById('th-entry'))return doc.getElementById('th-entry');
 const now=options.now||(()=>Date.now()),reload=options.reload||(()=>win.location.reload());
 const visible=options.visible||(el=>{if(!el.isConnected||el.closest('[hidden]'))return false;for(let p=el;p;p=p.parentElement){const s=win.getComputedStyle(p);if(s.display==='none'||s.visibility==='hidden'||s.opacity==='0')return false;}return el.getClientRects().length>0;});
 const panel=doc.createElement('aside');panel.id='th-entry';panel.setAttribute('aria-label','야구 티켓 헬퍼');panel.innerHTML=`<style>
#th-entry,#th-entry *{box-sizing:border-box}
#th-entry{position:fixed;right:20px;bottom:20px;z-index:2147483647;width:380px;max-width:calc(100vw - 24px);max-height:calc(100vh - 40px);overflow:auto;background:#fff;color:#202139;border:1px solid #e4e1f4;border-radius:24px;box-shadow:0 16px 60px #29204b26;font:14px/1.5 system-ui,-apple-system,sans-serif;isolation:isolate;text-align:left}
#th-entry [hidden]{display:none!important}
#th-entry p{margin:0}#th-entry small{font-size:12px;line-height:1.6;color:#63657a}
#th-entry .th-head{display:flex;align-items:center;gap:11px;padding:19px 20px;background:linear-gradient(125deg,#f1edff,#faf9ff);border-bottom:1px solid #ebe7fa}
#th-entry .th-logo{display:grid;place-items:center;flex:none;width:42px;height:42px;border-radius:14px;background:#6452d8;color:white;box-shadow:0 4px 10px #6452d830}
#th-entry .th-head-copy{flex:1;min-width:0}#th-entry .th-head-copy strong{display:block;font-size:17px;letter-spacing:-.5px;font-weight:750}#th-entry .th-head-copy span{display:block;font-size:11px;color:#6d628e;margin-top:2px}
#th-entry button{appearance:none;display:inline-flex;justify-content:center;align-items:center;gap:6px;border:1px solid #deddea;border-radius:12px;min-height:44px;margin:0;padding:10px 12px;background:white;color:#35334d;font:600 13px/1.4 system-ui;cursor:pointer;box-shadow:none}
#th-entry button:hover{background:#f4f1ff;border-color:#b8aceb}#th-entry button:active{transform:translateY(1px)}#th-entry button:focus-visible,#th-entry input:focus-visible,#th-entry a:focus-visible,#th-entry summary:focus-visible{outline:3px solid #b5a6f3;outline-offset:2px}
#th-entry [data-toggle]{min-width:48px;font-size:12px;padding:8px 10px;background:#fff9;border-color:#e4def8;color:#62519b}
#th-entry [data-content]{padding:19px 20px 20px}
#th-entry .th-section-title{font-weight:750;font-size:14px;letter-spacing:-.3px;margin-bottom:12px}#th-entry .th-section-title span{font-weight:500;font-size:11px;color:#747087;margin-left:6px}
#th-entry .th-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;margin-bottom:12px}
#th-entry label{display:block;min-width:0;margin:0;font-size:12px;font-weight:650;color:#56536a}
#th-entry input{display:block;appearance:auto;min-width:0;width:100%;max-width:100%;min-height:44px;margin-top:6px;padding:10px 11px;border:1px solid #dedeea;border-radius:11px;background:#fafafe;color:#24243e;font:500 13px/1.5 system-ui;box-shadow:none}
#th-entry input::placeholder{color:#9a96aa}#th-entry input:focus{border-color:#8d7bdc;background:white}#th-entry input::-webkit-datetime-edit{min-width:0;padding:0}
#th-entry .th-open{padding:13px;border:1px solid #e6e0fa;border-radius:15px;background:#f7f4ff}#th-entry .th-open input{background:#fff}#th-entry .th-open small{display:block;margin-top:7px;font-size:11px;color:#72658e}
#th-entry .th-actions{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;margin-top:16px}
#th-entry [data-mark]{background:#f1edff;border-color:#e3dbfa;color:#5941ba}#th-entry [data-arm]{background:#6551d6;border-color:#6551d6;color:white;box-shadow:0 4px 12px #6551d624}#th-entry [data-arm]:hover{background:#5742c8}#th-entry [data-stop]{color:#a64a5e;border-color:#eedfe3;background:#fffafb}
#th-entry .th-status-card{margin-top:16px;padding:13px 14px;border:1px solid #e8e5f3;border-radius:15px;background:#faf9fe}#th-entry .th-status-label{display:flex;align-items:center;gap:7px;font-size:11px;font-weight:750;color:#71618f;margin-bottom:7px}#th-entry .th-dot{width:6px;height:6px;border-radius:50%;background:#8065dc}#th-entry [data-status]{white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px;line-height:1.65;color:#46405f}
#th-entry [data-diagnostic-result]{white-space:pre-wrap;overflow-wrap:anywhere;margin-top:12px}
[data-th-entry-notice="manual"]{outline:3px solid #8065dc!important;outline-offset:4px;box-shadow:0 0 0 7px #8065dc26!important}
#th-entry .th-foot{margin-top:14px;padding-top:11px;border-top:1px solid #eeecf4}#th-entry details{margin-top:7px}#th-entry summary{cursor:pointer;font-size:12px;font-weight:600;color:#726a86;padding:7px 0}#th-entry details small{display:block;padding:3px 0 7px}#th-entry details p{font-size:12px;line-height:1.7;color:#636078;margin:5px 0}#th-entry a{color:#6450cb;text-decoration:underline;text-underline-offset:3px;font-size:12px}
#th-entry[data-folded=true]{width:auto;overflow:visible;border:0;border-radius:100px;background:transparent;box-shadow:0 8px 26px #4c35a92e}
#th-entry[data-folded=true] .th-head{padding:0;border:0;background:none}#th-entry[data-folded=true] .th-logo,#th-entry[data-folded=true] .th-head-copy{display:none}#th-entry[data-folded=true] [data-toggle]{border:0;min-height:48px;border-radius:100px;background:#6551d6;color:#fff;padding:12px 22px;font-size:14px}
@media(max-width:420px){#th-entry{right:12px;bottom:12px;max-height:calc(100vh - 24px)}#th-entry .th-head{padding:15px 16px}#th-entry [data-content]{padding:16px}#th-entry input{font-size:12px;padding:10px 8px}}
@media(prefers-reduced-motion:reduce){#th-entry button:active{transform:none}}
</style>
<header class="th-head"><div class="th-logo" aria-hidden="true"><svg width="25" height="25" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M6 5.5c4 2 4 11 0 13M18 5.5c-4 2-4 11 0 13M12 3v18M3 12h18" stroke="currentColor" stroke-width="1.3"/></svg></div><div class="th-head-copy"><strong>Ticket Helper</strong><span>BASEBALL · 경기 진입 시험판 ${version}</span></div><button type="button" data-toggle aria-expanded="true" aria-controls="th-entry-content">접기</button></header>
<div data-content id="th-entry-content">
<div class="th-section-title">목표 경기 <span>화면에 나온 팀 이름으로 입력</span></div>
<div class="th-grid"><label>경기 날짜<input name="date" type="date"></label><label>경기 시작 시간<input name="time" type="time" value="18:30"></label></div>
<div class="th-grid"><label>홈팀<input name="home" placeholder="예: LG"></label><label>원정팀<input name="away" placeholder="예: KIA"></label></div>
<div class="th-open"><label>예매 오픈 시각<input name="open" type="datetime-local" step="1"></label><small>현재 실행 기준: PC 현지 시계</small></div>
<div class="th-actions"><button type="button" data-mark>① 경기 버튼 지정</button><button type="button" data-arm>② 시작 대기</button><button type="button" data-check>경기 일치 확인</button><button type="button" data-stop>중지</button></div>
<div class="th-status-card"><div class="th-status-label"><span class="th-dot" aria-hidden="true"></span>실행 상태</div><p data-status role="status" aria-live="polite">경기 정보를 입력한 뒤 목표 경기 버튼을 지정하세요.</p></div>
<div class="th-foot"><details data-diagnostics><summary>안내 진단 · 비교 기록</summary><small>기존 비교 기록을 보거나 별도 진단을 선택할 때 여세요.</small><div class="th-actions"><button type="button" data-arm-manual style="grid-column:1/-1">안내 직접 확인 비교 시작</button><button type="button" data-arm-trial style="grid-column:1/-1">안내 자동 확인 진단 시작 · 1회</button><button type="button" data-diagnose>안내창 형태 진단</button><button type="button" data-trial-result>자동·직접 확인 비교</button></div><p data-diagnostic-result>‘자동·직접 확인 비교’를 누르면 저장된 기록을 표시합니다.</p></details><details><summary>진행 방식과 확인할 사항</summary><small>오픈 시각에 목록 1회 새로고침 → 목표 예매 버튼 자동 클릭 1회 → 기본은 강조한 안내 확인 버튼 직접 클릭.<br>직접 확인 비교는 사용자가 누른 안내 클릭만 관찰합니다. 자동 확인 진단은 별도 선택 시 1회이며, 차단 기록이 있으면 재실행하지 않습니다.<br>대기열·인증·보안 경고에서는 중지합니다. 예약창과 보안문자는 직접 확인하세요. 좌석 선택은 아직 연결되지 않았습니다.<br>이 탭을 앞에 유지하세요. 오픈 정각 실기 검증 전입니다.</small></details><details><summary>시계 · 자동 업데이트 · v${version}</summary><p>PC 현지 시계 기준이며 서버 시각 보정은 없습니다.</p><a href="https://time.navyism.com/?host=www.ticketlink.co.kr" target="_blank" rel="noopener noreferrer">티켓링크 네이비즘 열기 ↗</a><small>Tampermonkey의 자동 업데이트 설정에 따라 새 버전을 받습니다. 새 코드는 다음 페이지 로딩부터 적용됩니다.</small></details></div>
</div>
`;
 doc.body.append(panel);const q=s=>panel.querySelector(s),say=t=>q('[data-status]').textContent=t,report=t=>{const el=q('[data-diagnostic-result]');if(el)el.textContent=t;};let state=null,target=null,marking=false,navigating=false,pendingTrial=null,activeTrialId=null,activeTrialMode='auto',pendingNotice=null,hintedNotice=null;
 if(nol){
  q('.th-head-copy span').textContent='NOL · 경기 진입 준비판 '+version+' · WC 실제 화면 미검증';
  q('[data-diagnostics]').remove();
  const details=q('.th-foot').querySelectorAll('details');
  details[0].querySelector('small').textContent='새로고침 없이 대기 → 오픈 시각 이후 지정한 경기의 예매 버튼이 활성화되면 자동 클릭 1회. 대기 화면과 열린 예매창은 직접 확인하세요. 안내 확인·보안문자·좌석 선택은 직접 진행합니다. WC 경기 페이지가 공개되면 실제 날짜·시간·두 팀을 다시 확인하고 지정하세요. PC 현지 시계 기준이며 이 탭을 앞에 유지하세요. 오픈 정각 실기 검증 전입니다.';
  details[1].querySelector('a').href='https://time.navyism.com/?host=nol.yanolja.com';details[1].querySelector('a').textContent='NOL 네이비즘 열기 ↗';
 }
 if(gate){
  q('.th-head-copy span').textContent='NOL · WC 오픈 대기 '+version+' · 실제 자동 진입 미검증';
  q('.th-section-title').textContent='현재 WC 상품';
  for(const name of ['date','time','home','away'])q(`[name=${name}]`).closest('label').hidden=true;
  for(const [name,label] of [['product','상품 번호'],['title','상품명']]){const item=doc.createElement('label');item.textContent=label;const input=doc.createElement('input');input.name=name;input.readOnly=true;item.append(input);q('.th-open').before(item);}
  q('[data-mark]').textContent='① 현재 상품 지정';q('[data-check]').textContent='상품 일치 확인';
  q('.th-foot details small').textContent='현재 상품과 오픈 시각을 지정하세요. 화면의 카운트다운으로 오픈을 확인하고 활성화된 예매하기 버튼만 1회 클릭합니다. 입력 시각과 2분 넘게 다르면 중지합니다. 대기열·안내·보안문자는 직접 진행하세요. 화면 오픈 기준 30초 뒤 종료합니다.';q('.th-open small').textContent='WC 대기 화면의 카운트다운 우선 · PC 시각과 차이 확인';q('.th-foot details p').textContent='카운트다운을 지정 후 관찰한 경우 화면의 오픈 시점을 우선합니다. 카운트다운을 확인하지 못한 경우 PC 시각을 사용합니다. 버튼 활성화와 상품 일치도 함께 확인합니다.';
  const record=doc.createElement('details');record.innerHTML='<summary>마지막 예매 버튼 클릭 기록</summary><p data-click-record>아직 클릭 기록이 없습니다.</p>';q('.th-foot').prepend(record);q('.th-foot a').href='https://time.navyism.com/?host=tickets.interpark.com';q('.th-foot a').textContent='인터파크 네이비즘 열기 ↗';say('현재 상품을 지정하고 예매 오픈 시각을 입력하세요.');
 }
 function fold(value){panel.dataset.folded=String(value);q('[data-content]').hidden=value;q('[data-toggle]').textContent=value?'야구 헬퍼 열기':'접기';q('[data-toggle]').setAttribute('aria-expanded',String(!value));if(gate)applyGateStyles(panel);try{win.sessionStorage.setItem(foldKey,String(value));}catch{}}
 try{fold(win.sessionStorage.getItem(foldKey)==='true');}catch{}
 const fields=gate?['product','title','open']:['date','time','home','away','open'];
 function saveSettings(){win.localStorage.setItem(settingsKey,JSON.stringify(Object.fromEntries(fields.map(k=>[k,q(`[name=${k}]`).value]))));}
 try{const saved=JSON.parse(win.localStorage.getItem(settingsKey)||'null');if(saved&&typeof saved==='object'){for(const k of fields)if(typeof saved[k]==='string'&&saved[k].length<=100)q(`[name=${k}]`).value=saved[k];say('저장한 설정을 불러왔습니다. 목표 경기 버튼을 다시 지정하세요.');}}catch{}
 const validate=gate?validateGateConfig:validateConfig;
 function config(){return validate(Object.fromEntries((gate?['product','title']:['date','time','home','away']).map(k=>[k,q(`[name=${k}]`).value])));}
 function matchesRow(row,c){return gate?matchGateRow(doc,win,row,c,visible,panel):!!row&&matchGame(textOf(row),c);}
 function access(){
 const parts=[];for(const el of doc.body.children)if(el!==panel&&visible(el))parts.push(textOf(el));const text=parts.join(' ').replace(/\s+/g,'');
 if(/비정상적인접근으로이용이일시제한|보안정책에따라서비스이용이제한|시스템에서비정상적인활동이감지|ErrorCode:?200/i.test(text))return 'blocked';
 if(/서비스접속대기중|현재대기순번|접속대기중|대기인원/.test(text))return 'queue';
 if(/보안문자를입력|자동입력방지문자를입력|인증문자를입력/.test(text)||Array.from(doc.querySelectorAll('iframe[src*="recaptcha"],iframe[src*="hcaptcha"],input[type=password],input[name*=captcha i],input[id*=captcha i],input[aria-label*=보안문자]')).some(visible))return 'captcha';
 if(gate&&/정상적인접근이아닙니다|오류가발생했습니다/.test(text))return 'blocked';
 if(gate&&(/인증이필요|인증이진행중|인증미완료/.test(text)||!readyGate(doc,visible,panel)))return 'captcha';
 return supportedPage()&&target&&doc.querySelector(target.rowSelector)&&visible(doc.querySelector(target.rowSelector))?'ready':'unknown';
 }
 function showClick(record){const el=q('[data-click-record]');if(el)el.textContent=record&&record.product===win.location.pathname.match(/\/(\d+)\/?$/)?.[1]?`${record.kind==='auto'?'자동':'직접'} 클릭 · ${new Date(record.at).toLocaleString('ko-KR',{hour12:false})}\n상품 번호 ${record.product} · isTrusted=${record.isTrusted}\n버튼 클릭 기록이며 진입 성공 여부는 영상과 열린 화면으로 확인하세요.`:'현재 상품의 클릭 기록이 없습니다.';}
 function recordClick(kind,event){if(!gate)return;const record={version,kind,product:target.product,at:now(),isTrusted:event.isTrusted};showClick(record);try{win.sessionStorage.setItem(GATE_KEY+':last-click',JSON.stringify(record));}catch{q('[data-click-record]').textContent+='\n저장 실패: 현재 화면에서만 확인할 수 있습니다.';}}
 if(gate)try{const r=JSON.parse(win.sessionStorage.getItem(GATE_KEY+':last-click')||'null');if(r&&['auto','manual'].includes(r.kind)&&Number.isFinite(r.at)&&typeof r.isTrusted==='boolean')showClick(r);}catch{}
 function clearHint(){if(hintedNotice?.getAttribute('data-th-entry-notice')==='manual')hintedNotice.removeAttribute('data-th-entry-notice');hintedNotice=null;}
 function endNotice(){clearHint();pendingNotice=null;}
 function watchNotice(){
  if(!pendingNotice)return;
  if(now()>pendingNotice.until||currentUrl()!==pendingNotice.url||['blocked','captcha','queue'].includes(access())){endNotice();say('안내 확인 보조를 종료했습니다. 현재 화면은 직접 확인하세요.');return;}
  const confirmation=Trial.findConfirmation(doc,visible,panel);
  if(confirmation===hintedNotice)return;
  clearHint();
  if(confirmation){hintedNotice=confirmation;confirmation.setAttribute('data-th-entry-notice','manual');say('예매 안내의 강조된 확인 버튼을 직접 눌러주세요.');}
  else say('안내 확인은 직접 진행하세요. 현재 안내 버튼을 확인하고 있습니다.');
 }
 function stop(message){endNotice();if(pendingTrial){try{Trial.append(win,pendingTrial.id,'stop',now(),{},pendingTrial.mode);report(Trial.formatComparison(win));}catch{}pendingTrial=null;}state=null;marking=false;navigating=false;win.sessionStorage.removeItem(runKey);say(message);}
 function persist(){win.sessionStorage.setItem(runKey,JSON.stringify(state));}
 try{const saved=JSON.parse(win.sessionStorage.getItem(runKey)||'null');if(saved){validate(saved.config);if((nol&&(saved.noticeTrial===true||saved.noticeManual===true))||typeof saved.target?.rowSelector!=='string'||!Number.isFinite(saved.openAt))throw Error('saved target');state=saved;target=saved.target;for(const k of (gate?['product','title']:['date','time','home','away']))q(`[name=${k}]`).value=saved.config[k];const at=new Date(saved.openAt),pad=n=>String(n).padStart(2,'0');q('[name=open]').value=`${at.getFullYear()}-${pad(at.getMonth()+1)}-${pad(at.getDate())}T${pad(at.getHours())}:${pad(at.getMinutes())}:${pad(at.getSeconds())}`;try{saveSettings();}catch{}}}catch{win.sessionStorage.removeItem(runKey);state=null;}
 function pendingRecord(){
  if(!pendingTrial)return null;
  const pending=pendingTrial,record=Trial.read(win,pending.mode),status=access();
  if(!record||record.id!==pending.id||record.status!=='waiting'){pendingTrial=null;endNotice();report(Trial.formatComparison(win));say(record?.id===pending.id&&record.status==='blocked'?'확인 진단에서 오류가 기록되었습니다. 열린 오류창과 진단 기록을 확인하세요.':'확인 진단이 종료되었습니다. 진단 메뉴에서 기록을 확인하세요.');return null;}
  if(now()>pending.until||currentUrl()!==pending.url||['blocked','captcha','queue'].includes(status)){pendingTrial=null;endNotice();Trial.append(win,pending.id,now()>pending.until?'timeout':'guard',now(),{},pending.mode);report(Trial.formatComparison(win));say('확인 진단을 중지했습니다. 현재 화면은 직접 확인하세요.');return null;}
  return record;
 }
 function tick(){
 watchNotice();
 if(pendingTrial){
  try{
   const pending=pendingTrial;if(!pendingRecord())return;
   const confirmation=Trial.findConfirmation(doc,visible,panel);if(!confirmation)return;
   Trial.append(win,pending.id,'seen',now(),{},pending.mode);
   if(pending.mode==='manual'){report(Trial.formatComparison(win));say('예매 안내의 강조된 확인 버튼을 직접 눌러주세요. 클릭 기록만 관찰합니다.');return;}
   const claimed=Trial.append(win,pending.id,'confirm',now());pendingTrial=null;
   if(claimed?.id!==pending.id||claimed.status!=='confirm-clicked')return;
   confirmation.addEventListener('click',e=>{try{Trial.append(win,pending.id,'confirm-event',now(),{isTrusted:e.isTrusted,activationActive:win.navigator.userActivation?.isActive??null});}catch{}},{capture:true,once:true});
   confirmation.click();report(Trial.formatComparison(win));say('안내 자동 확인 진단 1회를 실행했습니다. 열린 창과 진단 기록을 확인하세요.');return;
  }catch{pendingTrial=null;endNotice();say('진단 기록 저장에 실패하여 확인 진단을 중지했습니다.');return;}
 }
 if(!state||navigating)return;try{const status=access();if(state.phase==='reloaded'&&status==='unknown'&&currentUrl()===state.url&&now()>=state.openAt&&now()<=state.openAt+30000){say('경기 목록이 표시되기를 기다립니다. 추가 새로고침은 하지 않습니다.');return;}const button=gate?findGateTarget(doc,win,target,state.config,visible,panel):findTarget(doc,target,state.config,visible,nol),action=decide(gate&&Number.isFinite(state.siteOpenAt)?{...state,openAt:state.siteOpenAt}:state,{now:now(),url:currentUrl(),access:status,targetReady:!!button,reloadAtOpen:!nol});
 if(action==='stop'){stop(status==='queue'?'대기열 감지: 창을 유지하고 기다려 주세요.':status==='blocked'?'보안 경고: 동작을 중지했습니다.':status==='captcha'?'로그인·인증은 직접 진행하세요.':'화면·기한·경기 확인 실패로 중지했습니다.');return;}
 if(action==='wait'&&gate&&Number.isFinite(state.siteOpenAt)){say(now()<state.siteOpenAt?`화면 오픈까지 약 ${Math.max(0,Math.ceil((state.siteOpenAt-now())/1000))}초 · PC 기준과 ${Math.round((state.openAt-state.siteOpenAt)/1000)}초 차이`:'화면 오픈 확인 · 예매 버튼 활성화 대기 중');return;}if(action==='wait'){say(now()<state.openAt?`오픈까지 ${Math.max(0,Math.ceil((state.openAt-now())/1000))}초 · 이 탭을 앞에 두세요.`:(nol?'새로고침 없이 목표 예매 버튼 활성화 대기 중':'새로고침 완료 · 목표 예매 버튼 활성화 대기 중'));return;}
 if(action==='reload'){state.phase='reloaded';persist();navigating=true;say('목록을 한 번 새로고침합니다.');reload();return;}
 if(action==='click'){if(gate)button.addEventListener('click',event=>recordClick('auto',event),{capture:true,once:true});const mode=state.noticeManual===true?'manual':'auto',trial=!nol&&(state.noticeTrial===true||state.noticeManual===true)?Trial.start(win,now(),mode):null,manualNotice=!nol&&(state.noticeTrial!==true||mode==='manual');state.phase='clicked';persist();state=null;win.sessionStorage.removeItem(runKey);if(manualNotice)pendingNotice={url:currentUrl(),until:now()+30000};if(trial){activeTrialId=trial.id;activeTrialMode=mode;pendingTrial={id:trial.id,mode,url:currentUrl(),until:now()+30000};button.addEventListener('click',e=>{try{Trial.append(win,trial.id,'book-event',now(),{isTrusted:e.isTrusted,activationActive:win.navigator.userActivation?.isActive??null},mode);}catch{}},{capture:true,once:true});}say(trial?(mode==='manual'?'목표 예매 버튼 클릭 · 안내 확인은 직접 눌러주세요. 클릭 기록만 관찰합니다.':'목표 예매 버튼 클릭 · 안내 자동 확인 진단 1회 대기 중'):(nol?'목표 예매 버튼을 한 번 클릭했습니다. 열린 대기 화면·예매창에서 안내 확인과 보안문자는 직접 진행하세요.':'목표 예매 버튼을 한 번 클릭했습니다. 예매 안내의 확인은 직접 눌러주세요.'));button.click();}
 }catch(e){try{stop('중지: '+e.message);}catch{state=null;say('저장소 접근 실패로 중지했습니다.');}}}
 panel.entryTick=tick;
 doc.addEventListener('click',event=>{
  if(gate&&state&&!panel.contains(event.target)&&currentUrl()===state.url&&access()==='ready'){
   const button=findGateTarget(doc,win,target,state.config,visible,panel);if(button?.contains(event.target)){recordClick('manual',event);state=null;win.sessionStorage.removeItem(runKey);say('사용자가 예매 버튼을 눌렀습니다. 열린 화면을 직접 확인하세요.');}
  }
  if(pendingNotice&&!marking&&!panel.contains(event.target)){
   watchNotice();
   const confirmation=pendingNotice&&Trial.findConfirmation(doc,visible,panel);
   if(confirmation?.contains(event.target)){endNotice();say('안내 확인을 눌렀습니다. 열린 예약창을 직접 확인하세요.');}
  }
  if(pendingTrial?.mode!=='manual'||marking||panel.contains(event.target))return;
  try{
   const pending=pendingTrial;if(!pendingRecord())return;
   const confirmation=Trial.findConfirmation(doc,visible,panel);if(!confirmation||!confirmation.contains(event.target))return;
   Trial.append(win,pending.id,'seen',now(),{},'manual');pendingTrial=null;
   const claimed=Trial.append(win,pending.id,'manual-confirm',now(),{},'manual');
   if(claimed?.id===pending.id&&claimed.status==='confirm-clicked')Trial.append(win,pending.id,'confirm-event',now(),{isTrusted:event.isTrusted,activationActive:win.navigator.userActivation?.isActive??null},'manual');
   report(Trial.formatComparison(win));say('직접 확인 클릭을 기록했습니다. 열린 예약창과 진단 기록을 확인하세요.');
  }catch{pendingTrial=null;endNotice();say('직접 확인 기록에 실패했습니다. 클릭 자체는 변경하지 않았습니다.');}
 },true);
 doc.addEventListener('click',event=>{if(!marking||panel.contains(event.target))return;event.preventDefault();event.stopImmediatePropagation();try{target=captureTarget(event.target,config(),doc,visible);marking=false;say('지정한 경기:\n'+target.label+'\n입력이 맞으면 시작 대기를 누르세요.');}catch(e){marking=false;say(e.message);}},true);
 panel.addEventListener('input',event=>{const keepTarget=gate&&event.target===q('[name=open]');if(!keepTarget)target=null;stop(keepTarget?'오픈 시각이 바뀌었습니다. 상품을 확인하고 시작 대기를 다시 누르세요.':'설정이 바뀌었습니다. 목표 버튼을 다시 지정하세요.');try{saveSettings();}catch{say('설정 저장 실패: 브라우저 저장소를 확인하세요. 실행은 중지했습니다.');}});
 panel.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;try{
 if(nol&&(b.hasAttribute('data-arm-trial')||b.hasAttribute('data-arm-manual')||b.hasAttribute('data-diagnose')||b.hasAttribute('data-trial-result')))return;
 if(b.hasAttribute('data-toggle')){fold(panel.dataset.folded!=='true');return;}
 if(b.hasAttribute('data-trial-result')){report(Trial.formatComparison(win));return;}
 if(b.hasAttribute('data-diagnose')){stop('진단을 위해 실행을 중지했습니다. 결과는 진단 메뉴에서 확인하세요.');report(noticeDiagnostic(doc,visible,panel));return;}
 if(b.hasAttribute('data-stop')){stop('사용자가 중지했습니다.');return;}
 if(b.hasAttribute('data-mark')){
  if(gate){stop('현재 상품을 확인합니다.');target=null;target=captureGateTarget(doc,win,visible,panel);q('[name=product]').value=target.product;q('[name=title]').value=target.label;try{saveSettings();}catch{}say('지정한 상품:\n'+target.label+'\n상품 번호 '+target.product+' · 오픈 시각을 확인하고 시작 대기를 누르세요.');return;}
  const c=config();stop('목표 경기의 예매 또는 오픈 예정 버튼을 클릭하세요. 이 클릭은 예매를 진행하지 않습니다.');target=null;
  if(nol){
   const candidates=[];
   for(const button of doc.querySelectorAll('button,a,input[type=button],[role=button]')){
    if(panel.contains(button)||!visible(button)||!/^(예매|예매하기|오픈예정)$/.test(compact(button.value||textOf(button))))continue;
    try{candidates.push(captureTarget(button,c,doc,visible));}catch{}
   }
   if(candidates.length!==1)throw Error('입력한 경기와 일치하는 예매 버튼을 하나로 확인하지 못했습니다. 경기 날짜·시간·팀과 현재 페이지를 확인하세요.');
   target=candidates[0];say('지정한 경기:\n'+target.label+'\n입력이 맞으면 시작 대기를 누르세요.');return;
  }
  marking=true;return;
 }
 if(b.hasAttribute('data-check')){const c=config();say(target&&matchesRow(doc.querySelector(target.rowSelector),c)?(gate?'지정한 상품 정보가 일치합니다.':'지정한 행의 경기 정보가 일치합니다.'):'경기 일치 확인 실패: 목표 버튼을 다시 지정하세요.');return;}
 if(b.hasAttribute('data-arm')||b.hasAttribute('data-arm-trial')||b.hasAttribute('data-arm-manual')){const c=config(),openAt=new Date(q('[name=open]').value).getTime();if(!Number.isFinite(openAt)||openAt<now()||openAt>now()+86400000)throw Error('오픈 시각은 현재 이후 24시간 안으로 지정하세요.');if(!target||access()!=='ready'||!matchesRow(doc.querySelector(target.rowSelector),c))throw Error('목표 경기와 화면을 먼저 확인하세요.');const noticeTrial=b.hasAttribute('data-arm-trial'),noticeManual=b.hasAttribute('data-arm-manual');if((noticeTrial||noticeManual)&&Trial.read(win,noticeManual?'manual':'auto')?.status==='blocked')throw Error('차단 기록이 있어 해당 확인 진단을 종료했습니다.');if(pendingTrial)throw Error('확인 진단이 진행 중입니다. 중지 후 설정하세요.');endNotice();try{saveSettings();}catch{}state={phase:'armed',url:currentUrl(),openAt,config:c,target,noticeTrial,noticeManual};if(gate){const remaining=gateCountdown(doc,win,target,c,visible,panel);if(remaining!==null){const siteOpenAt=now()+remaining;if(Math.abs(siteOpenAt-openAt)>120000)throw Error('화면 카운트다운과 입력한 오픈 시각이 2분 넘게 다릅니다. PC 시계와 오픈 시각을 확인하세요.');state.siteOpenAt=siteOpenAt;}}persist();marking=false;navigating=false;tick();}
 }catch(e){state=null;win.sessionStorage.removeItem(runKey);say(e.message);}});
 win.addEventListener('storage',e=>{if(nol)return;const record=Trial.read(win,activeTrialMode);if(e.key===(activeTrialMode==='manual'?Trial.MANUAL_KEY:Trial.KEY)&&record?.id===activeTrialId){report(Trial.formatComparison(win));say(record.status==='blocked'?'확인 진단에서 오류가 기록되었습니다. 열린 오류창과 진단 기록을 확인하세요.':'확인 진단 기록이 갱신되었습니다. 열린 창과 진단 메뉴를 확인하세요.');}});
 let timer=win.setInterval(tick,100);if(gate)win.addEventListener('pageshow',()=>{if(timer===null){timer=win.setInterval(tick,100);say('페이지로 돌아왔습니다. 상품과 오픈 시각을 확인하고 시작 대기를 다시 누르세요.');}});win.addEventListener('pagehide',()=>{win.clearInterval(timer);timer=null;endNotice();if(gate){state=null;try{win.sessionStorage.removeItem(runKey);}catch{}}if(pendingTrial){try{Trial.append(win,pendingTrial.id,'stop',now(),{},pendingTrial.mode);}catch{}pendingTrial=null;}},gate?{}:{once:true});if(state)say('저장된 실행을 확인합니다.');return panel;
}
return {KEY,NOL_KEY,GATE_KEY,validateConfig,matchGame,captureTarget,findTarget,decide,mount};
});

BaseballEntry.mount(document,window,{provider:['nol.yanolja.com','tickets.interpark.com'].includes(window.location.hostname)?'nol':'ticketlink'});
})();
