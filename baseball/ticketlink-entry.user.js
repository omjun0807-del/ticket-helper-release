// ==UserScript==
// @name         Ticket Helper - Ticketlink 경기 진입 시험판
// @namespace    ticket-helper-baseball
// @version      0.1.6
// @description  지정한 경기 목록에서 오픈 시각 1회 새로고침 및 예매 진입. 좌석/결제 자동화 없음.
// @match        https://www.ticketlink.co.kr/sports/*
// @match        https://ticketlink.co.kr/sports/*
// @updateURL    https://raw.githubusercontent.com/omjun0807-del/ticket-helper-release/main/baseball/ticketlink-entry.meta.js
// @downloadURL  https://raw.githubusercontent.com/omjun0807-del/ticket-helper-release/main/baseball/ticketlink-entry.user.js
// @run-at       document-idle
// @grant        none
// @noframes
// ==/UserScript==

(function(){
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BaseballEntry=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const KEY='ticket-helper:baseball-entry:v1', FOLD_KEY=KEY+':folded', SETTINGS_KEY=KEY+':settings';
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
function captureTarget(el,c,doc,visible){
 validateConfig(c);const button=el.closest('button,a,input[type=button],[role=button]');if(!button||!visible(button))throw Error('목표 경기의 버튼을 클릭하세요.');
 for(let row=button.parentElement;row&&row!==doc.body;row=row.parentElement){const text=textOf(row);if(text.length>1200)break;if(matchGame(text,c))return {rowSelector:selector(row,doc),label:text.trim().slice(0,600)};}
 throw Error('버튼 주변에서 날짜·시간·두 팀을 확인하지 못했습니다. 입력을 확인하세요.');
}
function findTarget(doc,target,c,visible){
 if(!target||typeof target.rowSelector!=='string')return null;let row;try{row=doc.querySelector(target.rowSelector);}catch{return null;}
 if(!row||!visible(row)||!matchGame(textOf(row),c))return null;
 const matches=Array.from(row.querySelectorAll('button,a,input[type=button],[role=button]')).filter(el=>visible(el)&&!el.disabled&&!el.matches(':disabled')&&el.getAttribute('aria-disabled')!=='true'&&!el.classList.contains('disabled')&&/^(예매|예매하기)$/.test(compact(el.value||textOf(el))));
 return matches.length===1?matches[0]:null;
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
function findNoticeConfirmation(doc,visible,panel){
 const found=new Set();
 for(const button of doc.querySelectorAll('button,a,input[type=button],[role=button]')){
  if(panel.contains(button)||!visible(button)||button.disabled||button.matches(':disabled')||button.getAttribute('aria-disabled')==='true'||button.classList.contains('disabled')||compact(button.value||textOf(button))!=='확인')continue;
  let box=button.parentElement;while(box&&box!==doc.body&&!isNoticeBox(box))box=box.parentElement;
  if(!box||box===doc.body||box.matches('main,article,section,nav,header,footer')||!visible(box))continue;
  const text=compact(textOf(box));
  const titled=Array.from(box.querySelectorAll('*')).some(el=>visible(el)&&el.children.length===0&&compact(textOf(el))==='예매안내');
  if(text.length>4000||!titled||!text.includes('시야')||!text.includes('관람')||box.querySelector('input,textarea,select,iframe')||/보안문자|인증문자|자동입력방지|대기순번|접속대기|결제동의/.test(text))continue;
  const controls=Array.from(box.querySelectorAll('button,a,[role=button]')).filter(el=>visible(el)&&compact(textOf(el))==='확인');
  if(controls.length===1)found.add(button);
 }
 return found.size===1?Array.from(found)[0]:null;
}
function decide(state,{now,url,access,targetReady}){
 if(!state||!['armed','reloaded'].includes(state.phase)||!Number.isFinite(state.openAt)||!Number.isFinite(now)||url!==state.url||access!=='ready'||now>state.openAt+30000)return 'stop';
 if(now<state.openAt)return 'wait';if(state.phase==='armed')return 'reload';return targetReady?'click':'wait';
}
function mount(doc,win,options={}){
 if(doc.getElementById('th-entry'))return doc.getElementById('th-entry');
 if(!/^https:\/\/(www\.)?ticketlink\.co\.kr\/sports\//.test(win.location.href))return null;
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
#th-entry .th-foot{margin-top:14px;padding-top:11px;border-top:1px solid #eeecf4}#th-entry details{margin-top:7px}#th-entry summary{cursor:pointer;font-size:12px;font-weight:600;color:#726a86;padding:7px 0}#th-entry details small{display:block;padding:3px 0 7px}#th-entry details p{font-size:12px;line-height:1.7;color:#636078;margin:5px 0}#th-entry a{color:#6450cb;text-decoration:underline;text-underline-offset:3px;font-size:12px}
#th-entry[data-folded=true]{width:auto;overflow:visible;border:0;border-radius:100px;background:transparent;box-shadow:0 8px 26px #4c35a92e}
#th-entry[data-folded=true] .th-head{padding:0;border:0;background:none}#th-entry[data-folded=true] .th-logo,#th-entry[data-folded=true] .th-head-copy{display:none}#th-entry[data-folded=true] [data-toggle]{border:0;min-height:48px;border-radius:100px;background:#6551d6;color:#fff;padding:12px 22px;font-size:14px}
@media(max-width:420px){#th-entry{right:12px;bottom:12px;max-height:calc(100vh - 24px)}#th-entry .th-head{padding:15px 16px}#th-entry [data-content]{padding:16px}#th-entry input{font-size:12px;padding:10px 8px}}
@media(prefers-reduced-motion:reduce){#th-entry button:active{transform:none}}
</style>
<header class="th-head"><div class="th-logo" aria-hidden="true"><svg width="25" height="25" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M6 5.5c4 2 4 11 0 13M18 5.5c-4 2-4 11 0 13M12 3v18M3 12h18" stroke="currentColor" stroke-width="1.3"/></svg></div><div class="th-head-copy"><strong>Ticket Helper</strong><span>BASEBALL · 경기 진입 시험판 0.1.6</span></div><button type="button" data-toggle aria-expanded="true" aria-controls="th-entry-content">접기</button></header>
<div data-content id="th-entry-content">
<div class="th-section-title">목표 경기 <span>화면에 나온 팀 이름으로 입력</span></div>
<div class="th-grid"><label>경기 날짜<input name="date" type="date"></label><label>경기 시작 시간<input name="time" type="time" value="18:30"></label></div>
<div class="th-grid"><label>홈팀<input name="home" placeholder="예: LG"></label><label>원정팀<input name="away" placeholder="예: KIA"></label></div>
<div class="th-open"><label>예매 오픈 시각<input name="open" type="datetime-local" step="1"></label><small>현재 실행 기준: PC 현지 시계</small></div>
<div class="th-actions"><button type="button" data-mark>① 경기 버튼 지정</button><button type="button" data-arm>② 시작 대기</button><button type="button" data-check>경기 일치 확인</button><button type="button" data-stop>중지</button><button type="button" data-diagnose style="grid-column:1/-1">안내창 진단 · 결과 표시</button></div>
<div class="th-status-card"><div class="th-status-label"><span class="th-dot" aria-hidden="true"></span>실행 상태</div><p data-status role="status" aria-live="polite">경기 정보를 입력한 뒤 목표 경기 버튼을 지정하세요.</p></div>
<div class="th-foot"><details><summary>진행 방식과 확인할 사항</summary><small>오픈 시각에 목록 1회 새로고침 → 목표 예매 버튼 1회 클릭 → 일반 예매 안내 1회 확인.<br>대기열·인증·보안 경고에서는 중지합니다. 예약창과 보안문자는 직접 확인하세요. 좌석 선택은 아직 연결되지 않았습니다.<br>이 탭을 앞에 유지하세요. 오픈 정각 실기 검증 전입니다.</small></details><details><summary>시계 · 자동 업데이트 · v0.1.6</summary><p>PC 현지 시계 기준이며 서버 시각 보정은 없습니다.</p><a href="https://time.navyism.com/?host=www.ticketlink.co.kr" target="_blank" rel="noopener noreferrer">티켓링크 네이비즘 열기 ↗</a><small>Tampermonkey의 자동 업데이트 설정에 따라 새 버전을 받습니다. 새 코드는 다음 페이지 로딩부터 적용됩니다.</small></details></div>
</div>
`;
 doc.body.append(panel);const q=s=>panel.querySelector(s),say=t=>q('[data-status]').textContent=t;let state=null,target=null,marking=false,navigating=false,noticePending=null;
 function fold(value){panel.dataset.folded=String(value);q('[data-content]').hidden=value;q('[data-toggle]').textContent=value?'야구 헬퍼 열기':'접기';q('[data-toggle]').setAttribute('aria-expanded',String(!value));try{win.sessionStorage.setItem(FOLD_KEY,String(value));}catch{}}
 try{fold(win.sessionStorage.getItem(FOLD_KEY)==='true');}catch{}
 const fields=['date','time','home','away','open'];
 function saveSettings(){win.localStorage.setItem(SETTINGS_KEY,JSON.stringify(Object.fromEntries(fields.map(k=>[k,q(`[name=${k}]`).value]))));}
 try{const saved=JSON.parse(win.localStorage.getItem(SETTINGS_KEY)||'null');if(saved&&typeof saved==='object'){for(const k of fields)if(typeof saved[k]==='string'&&saved[k].length<=100)q(`[name=${k}]`).value=saved[k];say('저장한 설정을 불러왔습니다. 목표 경기 버튼을 다시 지정하세요.');}}catch{}
 function config(){return validateConfig(Object.fromEntries(['date','time','home','away'].map(k=>[k,q(`[name=${k}]`).value])));}
 function access(){
 const parts=[];for(const el of doc.body.children)if(el!==panel&&visible(el))parts.push(textOf(el));const text=parts.join(' ').replace(/\s+/g,'');
 if(/보안정책에따라서비스이용이제한|시스템에서비정상적인활동이감지|ErrorCode:?200/i.test(text))return 'blocked';
 if(/서비스접속대기중|현재대기순번|접속대기중|대기인원/.test(text))return 'queue';
 if(/보안문자를입력|자동입력방지문자를입력|인증문자를입력/.test(text)||Array.from(doc.querySelectorAll('iframe[src*="recaptcha"],iframe[src*="hcaptcha"],input[type=password],input[name*=captcha i],input[id*=captcha i],input[aria-label*=보안문자]')).some(visible))return 'captcha';
 return /^\/sports\//.test(win.location.pathname)&&target&&doc.querySelector(target.rowSelector)&&visible(doc.querySelector(target.rowSelector))?'ready':'unknown';
 }
 function stop(message){state=null;marking=false;navigating=false;noticePending=null;win.sessionStorage.removeItem(KEY);say(message);}
 function persist(){win.sessionStorage.setItem(KEY,JSON.stringify(state));}
 try{const saved=JSON.parse(win.sessionStorage.getItem(KEY)||'null');if(saved){validateConfig(saved.config);if(typeof saved.target?.rowSelector!=='string'||!Number.isFinite(saved.openAt))throw Error('saved target');state=saved;target=saved.target;for(const k of ['date','time','home','away'])q(`[name=${k}]`).value=saved.config[k];const at=new Date(saved.openAt),pad=n=>String(n).padStart(2,'0');q('[name=open]').value=`${at.getFullYear()}-${pad(at.getMonth()+1)}-${pad(at.getDate())}T${pad(at.getHours())}:${pad(at.getMinutes())}:${pad(at.getSeconds())}`;try{saveSettings();}catch{}}}catch{win.sessionStorage.removeItem(KEY);state=null;}
 function tick(){
 if(noticePending){
  try{const status=access();if(now()>noticePending.until||win.location.href!==noticePending.url||['queue','blocked','captcha'].includes(status)){noticePending=null;say('예매 진입 후 안내 처리 종료 · 대기열과 인증은 직접 확인하세요.');return;}
   const confirmation=findNoticeConfirmation(doc,visible,panel);if(confirmation){noticePending=null;say('예매 안내를 확인했습니다. 별도 예약창을 확인하세요.');confirmation.click();}return;
  }catch(e){stop('안내 처리 중지: '+e.message);return;}
 }
 if(!state||navigating)return;try{const status=access();if(state.phase==='reloaded'&&status==='unknown'&&win.location.href===state.url&&now()>=state.openAt&&now()<=state.openAt+30000){say('경기 목록이 표시되기를 기다립니다. 추가 새로고침은 하지 않습니다.');return;}const button=findTarget(doc,target,state.config,visible),action=decide(state,{now:now(),url:win.location.href,access:status,targetReady:!!button});
 if(action==='stop'){stop(status==='queue'?'대기열 감지: 창을 유지하고 기다려 주세요.':status==='blocked'?'보안 경고: 동작을 중지했습니다.':status==='captcha'?'로그인·인증은 직접 진행하세요.':'화면·기한·경기 확인 실패로 중지했습니다.');return;}
 if(action==='wait'){say(now()<state.openAt?`오픈까지 ${Math.max(0,Math.ceil((state.openAt-now())/1000))}초 · 이 탭을 앞에 두세요.`:'새로고침 완료 · 목표 예매 버튼 활성화 대기 중');return;}
 if(action==='reload'){state.phase='reloaded';persist();navigating=true;say('목록을 한 번 새로고침합니다.');reload();return;}
 if(action==='click'){state.phase='clicked';persist();state=null;win.sessionStorage.removeItem(KEY);noticePending={until:now()+30000,url:win.location.href};say('목표 예매 버튼을 한 번 클릭했습니다. 예매 안내 확인 대기 · 예약창과 대기열을 확인하세요.');button.click();}
 }catch(e){try{stop('중지: '+e.message);}catch{state=null;say('저장소 접근 실패로 중지했습니다.');}}}
 panel.entryTick=tick;
 doc.addEventListener('click',event=>{if(!marking||panel.contains(event.target))return;event.preventDefault();event.stopImmediatePropagation();try{target=captureTarget(event.target,config(),doc,visible);marking=false;say('지정한 경기:\n'+target.label+'\n입력이 맞으면 시작 대기를 누르세요.');}catch(e){marking=false;say(e.message);}},true);
 panel.addEventListener('input',()=>{target=null;stop('설정이 바뀌었습니다. 목표 버튼을 다시 지정하세요.');try{saveSettings();}catch{say('설정 저장 실패: 브라우저 저장소를 확인하세요. 실행은 중지했습니다.');}});
 panel.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;try{
 if(b.hasAttribute('data-toggle')){fold(panel.dataset.folded!=='true');return;}
 if(b.hasAttribute('data-diagnose')){stop('진단을 위해 실행을 중지했습니다.');say(noticeDiagnostic(doc,visible,panel));return;}
 if(b.hasAttribute('data-stop')){stop('사용자가 중지했습니다.');return;}
 if(b.hasAttribute('data-mark')){config();stop('목표 경기의 예매 또는 오픈 예정 버튼을 클릭하세요. 이 클릭은 예매를 진행하지 않습니다.');target=null;marking=true;return;}
 if(b.hasAttribute('data-check')){const c=config();say(target&&doc.querySelector(target.rowSelector)&&matchGame(textOf(doc.querySelector(target.rowSelector)),c)?'지정한 행의 경기 정보가 일치합니다.':'경기 일치 확인 실패: 목표 버튼을 다시 지정하세요.');return;}
 if(b.hasAttribute('data-arm')){const c=config(),openAt=new Date(q('[name=open]').value).getTime();if(!Number.isFinite(openAt)||openAt<now()||openAt>now()+86400000)throw Error('오픈 시각은 현재 이후 24시간 안으로 지정하세요.');if(!target||access()!=='ready'||!matchGame(textOf(doc.querySelector(target.rowSelector)),c))throw Error('목표 경기와 화면을 먼저 확인하세요.');try{saveSettings();}catch{}noticePending=null;state={phase:'armed',url:win.location.href,openAt,config:c,target};persist();marking=false;navigating=false;tick();}
 }catch(e){state=null;win.sessionStorage.removeItem(KEY);say(e.message);}});
 const timer=win.setInterval(tick,100);win.addEventListener('pagehide',()=>win.clearInterval(timer),{once:true});if(state)say('저장된 실행을 확인합니다.');return panel;
}
return {KEY,validateConfig,matchGame,captureTarget,findTarget,decide,mount};
});

BaseballEntry.mount(document,window);
})();
