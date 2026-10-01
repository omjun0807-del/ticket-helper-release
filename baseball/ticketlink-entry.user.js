// ==UserScript==
// @name         Ticket Helper - Ticketlink 경기 진입 시험판
// @namespace    ticket-helper-baseball
// @version      0.1.2
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
const KEY='ticket-helper:baseball-entry:v1', FOLD_KEY=KEY+':folded';
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
function findNoticeConfirmation(doc,visible,panel){
 const found=new Set();
 const isNoticeBox=el=>el.matches('dialog,[role=dialog],[aria-modal=true]')||Array.from(el.classList).some(c=>/^(?:modal|popup|layer)(?:[-_]|$)|(?:[-_])(?:modal|popup|layer)(?:[-_]|$)/i.test(c));
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
 const panel=doc.createElement('aside');panel.id='th-entry';panel.innerHTML=`<style>#th-entry{position:fixed;bottom:16px;right:16px;z-index:2147483647;width:340px;max-width:calc(100vw - 24px);max-height:85vh;overflow:auto;padding:18px;background:#fff;color:#17213c;border:2px solid #5551df;border-radius:16px;box-shadow:0 8px 30px #0003;font:14px/1.5 system-ui}#th-entry[data-folded=true]{width:auto;padding:8px}#th-entry[data-folded=true]>strong{display:none}#th-entry [hidden]{display:none!important}#th-entry label{display:block;margin:8px 0}#th-entry input{display:block;box-sizing:border-box;width:100%;padding:6px;font:inherit}#th-entry button{padding:9px;margin:4px;border:1px solid #ccc;border-radius:8px;cursor:pointer}#th-entry [data-status]{color:#4039aa;white-space:pre-wrap}</style><strong>Ticket Helper · 경기 진입 시험판 0.1.2</strong><button data-toggle aria-expanded="true">접기</button><div data-content><p>PC 경기 목록용 · 좌석 선택 없음</p><details open><summary>목표 경기 설정</summary><label>경기 날짜<input name="date" type="date"></label><label>경기 시간<input name="time" type="time" value="18:30"></label><label>홈팀 (화면에 나온 이름)<input name="home" placeholder="LG"></label><label>원정팀 (화면에 나온 이름)<input name="away" placeholder="KT"></label><label>예매 오픈 시각 (PC 현지 시각)<input name="open" type="datetime-local" step="1"></label></details><button data-mark>1. 목표 경기 버튼 지정</button><button data-check>경기 일치 확인</button><button data-arm>2. 시작 대기</button><button data-stop>중지</button><p data-status role="status">먼저 경기 정보를 입력하고 목표 버튼을 지정하세요.</p><small>오픈 시각에 목록 1회 새로고침 → 일치하는 예매 버튼 1회 클릭. 예매 안내는 1회 확인합니다. PC 시계 기준이며 백그라운드 탭에서는 지연될 수 있습니다. 대기열·인증·보안 경고에서는 중지합니다. 오픈 정각 실기 검증 전입니다.</small><details><summary>시계 · 업데이트 · v0.1.2</summary><p>실행 기준: PC 현지 시계 · 서버 시각 보정 없음<br><a href="https://time.navyism.com/?host=www.ticketlink.co.kr" target="_blank" rel="noopener noreferrer">티켓링크 네이비즘 열기</a></p><small>Violentmonkey의 자동 업데이트 설정에 따라 새 버전을 받습니다. 새 코드는 다음 페이지 로딩부터 적용됩니다.</small></details></div>`;
 doc.body.append(panel);const q=s=>panel.querySelector(s),say=t=>q('[data-status]').textContent=t;let state=null,target=null,marking=false,navigating=false,noticePending=null;
 function fold(value){panel.dataset.folded=String(value);q('[data-content]').hidden=value;q('[data-toggle]').textContent=value?'야구 헬퍼 열기':'접기';q('[data-toggle]').setAttribute('aria-expanded',String(!value));try{win.sessionStorage.setItem(FOLD_KEY,String(value));}catch{}}
 try{fold(win.sessionStorage.getItem(FOLD_KEY)==='true');}catch{}
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
 try{const saved=JSON.parse(win.sessionStorage.getItem(KEY)||'null');if(saved){validateConfig(saved.config);if(typeof saved.target?.rowSelector!=='string')throw Error('saved target');state=saved;target=saved.target;for(const k of ['date','time','home','away'])q(`[name=${k}]`).value=saved.config[k];}}catch{win.sessionStorage.removeItem(KEY);state=null;}
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
 panel.addEventListener('input',()=>{target=null;stop('설정이 바뀌었습니다. 목표 버튼을 다시 지정하세요.');});
 panel.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;try{
 if(b.hasAttribute('data-toggle')){fold(panel.dataset.folded!=='true');return;}
 if(b.hasAttribute('data-stop')){stop('사용자가 중지했습니다.');return;}
 if(b.hasAttribute('data-mark')){config();stop('목표 경기의 예매 또는 오픈 예정 버튼을 클릭하세요. 이 클릭은 예매를 진행하지 않습니다.');target=null;marking=true;return;}
 if(b.hasAttribute('data-check')){const c=config();say(target&&doc.querySelector(target.rowSelector)&&matchGame(textOf(doc.querySelector(target.rowSelector)),c)?'지정한 행의 경기 정보가 일치합니다.':'경기 일치 확인 실패: 목표 버튼을 다시 지정하세요.');return;}
 if(b.hasAttribute('data-arm')){const c=config(),openAt=new Date(q('[name=open]').value).getTime();if(!Number.isFinite(openAt)||openAt<now()||openAt>now()+86400000)throw Error('오픈 시각은 현재 이후 24시간 안으로 지정하세요.');if(!target||access()!=='ready'||!matchGame(textOf(doc.querySelector(target.rowSelector)),c))throw Error('목표 경기와 화면을 먼저 확인하세요.');noticePending=null;state={phase:'armed',url:win.location.href,openAt,config:c,target};persist();marking=false;navigating=false;tick();}
 }catch(e){state=null;win.sessionStorage.removeItem(KEY);say(e.message);}});
 const timer=win.setInterval(tick,100);win.addEventListener('pagehide',()=>win.clearInterval(timer),{once:true});if(state)say('저장된 실행을 확인합니다.');return panel;
}
return {KEY,validateConfig,matchGame,captureTarget,findTarget,decide,mount};
});

BaseballEntry.mount(document,window);
})();
