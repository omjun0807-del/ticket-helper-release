'use strict';

const PROFILE_KEY='ticket-helper:profiles';
const SYNC_CONFIG_KEY='ticket-helper:sync-config';
const SYNC_STATE_KEY='ticket-helper:sync-state';

function isSupported(url=''){
  return /^https:\/\/(?:www\.)?keyescape\.com\//i.test(url)||/^https:\/\/(?:m\.)?booking\.naver\.com\//i.test(url);
}

async function activeTab(){const tabs=await chrome.tabs.query({active:true,currentWindow:true});return tabs[0]||null;}

async function refresh(){
  const manifest=chrome.runtime.getManifest();
  document.getElementById('version').textContent='v'+manifest.version;
  const data=await chrome.storage.local.get([PROFILE_KEY,SYNC_CONFIG_KEY,SYNC_STATE_KEY]);
  const profiles=Array.isArray(data[PROFILE_KEY])?data[PROFILE_KEY]:[];
  const syncConfig=data[SYNC_CONFIG_KEY]||{};
  const syncState=data[SYNC_STATE_KEY]||{};
  document.getElementById('themeCount').textContent='테마 '+profiles.length+'개';
  document.getElementById('syncState').textContent=String(syncState.status||'동기화 연결 전');
  document.getElementById('autoSync').textContent=syncConfig.autoSync?'ON':'OFF';
  document.getElementById('tokenState').textContent=syncConfig.token?'저장됨':'미설정';
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

refresh().catch(err=>{document.getElementById('message').textContent=String(err?.message||err);});
