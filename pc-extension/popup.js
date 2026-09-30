'use strict';

const PROFILE_KEY='ticket-helper:profiles';
const SYNC_CONFIG_KEY='ticket-helper:sync-config';
const SYNC_STATE_KEY='ticket-helper:sync-state';
const UPDATE_STATE_KEY='ticket-helper:extension-update-state';

function isSupported(url=''){
  try{const parsed=new URL(url);return parsed.protocol==='https:'&&["keyescape.com", "www.keyescape.com", "booking.naver.com", "m.booking.naver.com", "rabbitholeescape.co.kr", "www.rabbitholeescape.co.kr", "play33.kr", "www.play33.kr", "xn--2e0b040a4xj.com", "www.xn--2e0b040a4xj.com", "zeroworldkorea.com", "www.zeroworldkorea.com", "doomescape.com", "www.doomescape.com", "nextedition.co.kr", "www.nextedition.co.kr", "page-today.co.kr", "www.page-today.co.kr", "nabijam.com", "www.nabijam.com", "m.place.naver.com"].includes(parsed.hostname);}catch{return false;}
}

async function activeTab(){const tabs=await chrome.tabs.query({active:true,currentWindow:true});return tabs[0]||null;}

function formatUpdateState(state){
  const status=String(state?.status||'unknown');
  if(status==='downloaded')return {text:'업데이트 ZIP 다운로드됨',showDownload:true};
  if(status==='available')return {text:'새 버전 있음',showDownload:false};
  if(status==='current')return {text:'최신 버전',showDownload:false};
  if(status==='error')return {text:'확인 실패',showDownload:false};
  return {text:'확인 전',showDownload:false};
}

async function refresh(){
  const manifest=chrome.runtime.getManifest();
  const currentVersion=manifest.version;
  document.getElementById('version').textContent='v'+currentVersion;
  const data=await chrome.storage.local.get([PROFILE_KEY,SYNC_CONFIG_KEY,SYNC_STATE_KEY,UPDATE_STATE_KEY]);
  const profiles=Array.isArray(data[PROFILE_KEY])?data[PROFILE_KEY]:[];
  const syncConfig=data[SYNC_CONFIG_KEY]||{};
  const syncState=data[SYNC_STATE_KEY]||{};
  const updateState=data[UPDATE_STATE_KEY]||{};
  document.getElementById('themeCount').textContent='테마 '+profiles.length+'개';
  document.getElementById('syncState').textContent=String(syncState.status||'동기화 연결 전');
  document.getElementById('autoSync').textContent=syncConfig.autoSync?'ON':'OFF';
  document.getElementById('tokenState').textContent=syncConfig.token?'저장됨':'미설정';

  const formatted=formatUpdateState(updateState);
  document.getElementById('updateState').textContent=formatted.text;
  document.getElementById('latestVersion').textContent=updateState.latestVersion?'v'+updateState.latestVersion:'현재 v'+currentVersion;
  document.getElementById('showDownload').hidden=!formatted.showDownload;

  const tab=await activeTab();
  const supported=!!tab?.id&&isSupported(tab.url||'');
  document.getElementById('pageState').textContent=supported?'지원 페이지':'지원 페이지 아님';
  document.getElementById('openPanel').disabled=!supported;
}

document.getElementById('openPanel').addEventListener('click',async()=>{
  const message=document.getElementById('message');message.textContent='';
  try{
    const tab=await activeTab();
    if(!tab?.id)throw new Error('현재 탭을 찾지 못했습니다.');
    const response=await chrome.tabs.sendMessage(tab.id,{type:'ticket-helper:open-panel'});
    if(!response?.ok)throw new Error(response?.error||'Ticket Helper가 아직 준비되지 않았습니다.');
    window.close();
  }catch(err){message.textContent=String(err?.message||err);}
});

document.getElementById('checkUpdate').addEventListener('click',async()=>{
  const button=document.getElementById('checkUpdate');
  const message=document.getElementById('message');
  button.disabled=true;message.textContent='업데이트 확인 중...';
  try{
    const state=await chrome.runtime.sendMessage({type:'ticket-helper:check-extension-update',autoDownload:true});
    message.textContent=state?.status==='downloaded'?'새 버전 ZIP을 다운로드했습니다.':state?.status==='current'?'현재 최신 버전입니다.':state?.error||'업데이트 상태를 확인했습니다.';
    await refresh();
  }catch(err){message.textContent=String(err?.message||err);}
  finally{button.disabled=false;}
});

document.getElementById('showDownload').addEventListener('click',async()=>{
  const message=document.getElementById('message');message.textContent='';
  try{
    const response=await chrome.runtime.sendMessage({type:'ticket-helper:show-extension-download'});
    if(!response?.ok)throw new Error(response?.error||'다운로드 파일을 찾지 못했습니다.');
  }catch(err){message.textContent=String(err?.message||err);}
});

refresh().catch(err=>{document.getElementById('message').textContent=String(err?.message||err);});
chrome.runtime.sendMessage({type:'ticket-helper:check-extension-update',autoDownload:true}).then(()=>refresh()).catch(()=>{});
