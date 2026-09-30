'use strict';

importScripts('update-core.js');

const UPDATE_STATE_KEY='ticket-helper:extension-update-state';
const UPDATE_MANIFEST_URL='https://raw.githubusercontent.com/omjun0807-del/ticket-helper-release/main/pc-extension/manifest.json';
const UPDATE_ZIP_URL='https://raw.githubusercontent.com/omjun0807-del/ticket-helper-release/main/ticket-helper-pc-extension.zip';
const UPDATE_ALARM='ticket-helper:update-check';
const updateApi=globalThis.TicketHelperExtensionUpdate;

async function setUpdateBadge(state){
  const hasUpdate=state?.status==='available'||state?.status==='downloaded';
  await chrome.action.setBadgeText({text:hasUpdate?'NEW':''});
  if(hasUpdate) await chrome.action.setBadgeBackgroundColor({color:'#5b5ce2'});
}

async function readUpdateState(){
  const data=await chrome.storage.local.get(UPDATE_STATE_KEY);
  return updateApi.normalizeUpdateState(data[UPDATE_STATE_KEY]||{});
}

async function saveUpdateState(state){
  const normalized=updateApi.normalizeUpdateState(state);
  await chrome.storage.local.set({[UPDATE_STATE_KEY]:normalized});
  await setUpdateBadge(normalized);
  return normalized;
}

async function downloadLatestZip(latestVersion,{force=false}={}){
  const previous=await readUpdateState();
  if(!force&&previous.downloadedVersion===latestVersion&&previous.downloadId!==null){
    return previous;
  }
  const downloadId=await chrome.downloads.download({
    url:UPDATE_ZIP_URL,
    filename:'TicketHelper/ticket-helper-pc-extension-latest.zip',
    conflictAction:'overwrite',
    saveAs:false
  });
  return saveUpdateState({
    ...previous,
    status:'downloaded',
    latestVersion,
    downloadedVersion:latestVersion,
    downloadId,
    error:''
  });
}

async function checkExtensionUpdate({autoDownload=true}={}){
  const currentVersion=chrome.runtime.getManifest().version;
  try{
    const response=await fetch(UPDATE_MANIFEST_URL,{cache:'no-store'});
    if(!response.ok)throw new Error('업데이트 정보를 불러오지 못했습니다. HTTP '+response.status);
    const remote=await response.json();
    const latestVersion=String(remote?.version||'').trim();
    if(!latestVersion)throw new Error('최신 버전 번호를 읽지 못했습니다.');

    const previous=await readUpdateState();
    if(updateApi.isNewerVersion(latestVersion,currentVersion)){
      const available=await saveUpdateState({
        ...previous,
        status:'available',
        currentVersion,
        latestVersion,
        checkedAt:Date.now(),
        error:''
      });
      if(autoDownload)return downloadLatestZip(latestVersion);
      return available;
    }

    return saveUpdateState({
      status:'current',
      currentVersion,
      latestVersion,
      checkedAt:Date.now(),
      downloadedVersion:'',
      downloadId:null,
      error:''
    });
  }catch(err){
    const previous=await readUpdateState();
    return saveUpdateState({
      ...previous,
      status:'error',
      currentVersion,
      checkedAt:Date.now(),
      error:String(err?.message||err)
    });
  }
}

async function ensureUpdateAlarm(){
  await chrome.alarms.create(UPDATE_ALARM,{periodInMinutes:360});
}

chrome.runtime.onInstalled.addListener(()=>{
  ensureUpdateAlarm().catch(()=>{});
  checkExtensionUpdate({autoDownload:true}).catch(()=>{});
});

chrome.runtime.onStartup.addListener(()=>{
  ensureUpdateAlarm().catch(()=>{});
  checkExtensionUpdate({autoDownload:true}).catch(()=>{});
});

chrome.alarms.onAlarm.addListener(alarm=>{
  if(alarm?.name===UPDATE_ALARM)checkExtensionUpdate({autoDownload:true}).catch(()=>{});
});

chrome.runtime.onMessage.addListener((message,_sender,sendResponse)=>{
  if(message?.type==='ticket-helper:http'){
    (async()=>{
      try{
        const req=message.request||{};
        const method=String(req.method||'GET').toUpperCase();
        const init={method,headers:req.headers||{},redirect:'follow',cache:'no-store'};
        if(!['GET','HEAD'].includes(method)&&req.data!==undefined) init.body=req.data;
        const response=await fetch(String(req.url||''),init);
        const responseText=await response.text();
        sendResponse({status:response.status,statusText:response.statusText,responseText,response:responseText,finalUrl:response.url});
      }catch(err){
        sendResponse({status:0,responseText:'',response:'',error:String(err?.message||err)});
      }
    })();
    return true;
  }

  if(message?.type==='ticket-helper:check-extension-update'){
    checkExtensionUpdate({autoDownload:message.autoDownload!==false}).then(sendResponse).catch(err=>sendResponse({status:'error',error:String(err?.message||err)}));
    return true;
  }

  if(message?.type==='ticket-helper:get-extension-update-state'){
    readUpdateState().then(sendResponse).catch(err=>sendResponse({status:'error',error:String(err?.message||err)}));
    return true;
  }

  if(message?.type==='ticket-helper:download-extension-update'){
    const latest=String(message.latestVersion||'');
    downloadLatestZip(latest,{force:true}).then(sendResponse).catch(err=>sendResponse({status:'error',error:String(err?.message||err)}));
    return true;
  }

  if(message?.type==='ticket-helper:show-extension-download'){
    (async()=>{
      const state=await readUpdateState();
      if(state.downloadId!==null)chrome.downloads.show(state.downloadId);
      sendResponse({ok:state.downloadId!==null});
    })().catch(err=>sendResponse({ok:false,error:String(err?.message||err)}));
    return true;
  }

  return undefined;
});

ensureUpdateAlarm().catch(()=>{});
