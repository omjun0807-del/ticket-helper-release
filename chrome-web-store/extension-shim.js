(()=>{
  'use strict';
  const bridge=globalThis.TicketHelperExtensionBridge;
  if(!bridge?.createChromeGm||typeof chrome==='undefined') return;
  globalThis.GM=bridge.createChromeGm(chrome);
  const manifest=chrome.runtime.getManifest();
  globalThis.TICKET_HELPER_EXTENSION={version:String(manifest.version||''),name:String(manifest.name||'Ticket Helper PC')};

  function openPanel(){
    const host=document.getElementById('ticket-helper-root');
    const panel=host?.shadowRoot?.querySelector?.('.th-panel');
    if(panel){panel.open=true;panel.scrollIntoView?.({block:'nearest'});return true;}
    return false;
  }

  chrome.runtime.onMessage.addListener((message,_sender,sendResponse)=>{
    if(message?.type==='ticket-helper:open-panel'){
      let attempts=0;
      const tryOpen=()=>{
        if(openPanel()){sendResponse({ok:true});return;}
        attempts+=1;
        if(attempts>=20){sendResponse({ok:false,error:'Ticket Helper panel not ready'});return;}
        setTimeout(tryOpen,100);
      };
      tryOpen();
      return true;
    }
    return undefined;
  });
})();
