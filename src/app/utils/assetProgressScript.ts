// Runs in <head> before any app code. Wraps fetch so that, for GLB files, the
// number of bytes received so far is recorded in window.__glbBytes[path]. The
// loader reads it every frame to show real download progress. three.js loads
// GLBs with fetch, and the wrapped response is read exactly like the original.
export const assetProgressScript = `(function(){
var o=window.fetch;
if(!o||!window.ReadableStream)return;
var bytes=window.__glbBytes={};
window.fetch=function(input){
var req=o.apply(this,arguments),path;
try{path=new URL(typeof input==="string"?input:input.url,location.href).pathname}catch(e){return req}
if(path.slice(-4)!==".glb")return req;
return req.then(function(res){
if(!res.ok||!res.body)return res;
var reader=res.body.getReader(),count=0;
bytes[path]=0;
return new Response(new ReadableStream({
pull:function(ctl){return reader.read().then(function(r){
if(r.done){ctl.close();return}
count+=r.value.byteLength;bytes[path]=count;ctl.enqueue(r.value)})},
cancel:function(e){return reader.cancel(e)}
}),{status:res.status,statusText:res.statusText,headers:res.headers})
})
}
})();`;
