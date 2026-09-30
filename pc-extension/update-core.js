(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.TicketHelperExtensionUpdate=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  function versionParts(value){
    return String(value||'').trim().replace(/^v/i,'').split('.').map(v=>{
      const n=parseInt(v,10);
      return Number.isFinite(n)?n:0;
    });
  }

  function compareVersions(a,b){
    const aa=versionParts(a),bb=versionParts(b);
    const n=Math.max(aa.length,bb.length);
    for(let i=0;i<n;i++){
      const av=aa[i]||0,bv=bb[i]||0;
      if(av>bv)return 1;
      if(av<bv)return -1;
    }
    return 0;
  }

  function isNewerVersion(latest,current){
    return compareVersions(latest,current)>0;
  }

  function normalizeUpdateState(input={}){
    return {
      status:String(input.status||'unknown'),
      currentVersion:String(input.currentVersion||''),
      latestVersion:String(input.latestVersion||''),
      checkedAt:Number(input.checkedAt||0),
      downloadedVersion:String(input.downloadedVersion||''),
      downloadId:Number.isInteger(input.downloadId)?input.downloadId:null,
      error:String(input.error||'')
    };
  }

  return {versionParts,compareVersions,isNewerVersion,normalizeUpdateState};
});
