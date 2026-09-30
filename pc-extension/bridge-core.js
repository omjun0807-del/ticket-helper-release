(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.TicketHelperExtensionBridge=Object.assign(root.TicketHelperExtensionBridge||{},api);
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  function assertChromeApi(chromeApi){
    if(!chromeApi?.storage?.local||typeof chromeApi.storage.local.get!=='function'||typeof chromeApi.storage.local.set!=='function') throw new TypeError('chrome.storage.local is required');
    if(!chromeApi?.runtime||typeof chromeApi.runtime.sendMessage!=='function') throw new TypeError('chrome.runtime.sendMessage is required');
  }

  function normalizeHttpRequest(details={}){
    const method=String(details.method||'GET').toUpperCase();
    const url=String(details.url||'');
    if(!url) throw new TypeError('request url is required');
    const headers=details.headers&&typeof details.headers==='object'?{...details.headers}:{};
    const request={method,url,headers};
    if(details.data!==undefined&&details.data!==null) request.data=details.data;
    return request;
  }

  function createChromeGm(chromeApi){
    assertChromeApi(chromeApi);
    const storage=chromeApi.storage.local;
    return {
      storageKind:'extension-storage',
      async getValue(key,defaultValue){
        const result=await storage.get(key);
        return Object.prototype.hasOwnProperty.call(result||{},key)?result[key]:defaultValue;
      },
      async setValue(key,value){await storage.set({[key]:value});},
      async deleteValue(key){
        if(typeof storage.remove==='function') await storage.remove(key);
        else await storage.set({[key]:undefined});
      },
      async xmlHttpRequest(details){
        const response=await chromeApi.runtime.sendMessage({type:'ticket-helper:http',request:normalizeHttpRequest(details)});
        if(response?.error) throw new Error(String(response.error));
        return response||{status:0,responseText:''};
      }
    };
  }

  return {normalizeHttpRequest,createChromeGm};
});
