'use strict';

chrome.runtime.onMessage.addListener((message,_sender,sendResponse)=>{
  if(message?.type!=='ticket-helper:http') return undefined;
  (async()=>{
    try{
      const req=message.request||{};
      const method=String(req.method||'GET').toUpperCase();
      const init={method,headers:req.headers||{},redirect:'follow',cache:'no-store'};
      if(!['GET','HEAD'].includes(method)&&req.data!==undefined) init.body=req.data;
      const response=await fetch(String(req.url||''),init);
      const responseText=await response.text();
      sendResponse({
        status:response.status,
        statusText:response.statusText,
        responseText,
        response:responseText,
        finalUrl:response.url
      });
    }catch(err){
      sendResponse({status:0,responseText:'',response:'',error:String(err?.message||err)});
    }
  })();
  return true;
});
