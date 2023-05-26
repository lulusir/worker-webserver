"use strict";(()=>{var m=Object.defineProperty;var b=(t,e,n)=>e in t?m(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var f=(t,e,n)=>(b(t,typeof e!="symbol"?e+"":e,n),n);var u={Ready:"Ready",Close:"Close"};var o=class{constructor(e){this.pipe=e}getNewPid(){return this.pipe.newid}consume(e,n){this.pipe.write(e,n)}async send(e,n,s){if(s){let r={pid:e,data:n};s.postMessage(r)}}async receive(e){return this.pipe.read(e).then(n=>n.data)}};function g(t){let e=new Headers(t.headers),n={status:t.status,statusText:t.statusText,headers:e};if(t.body!==null){let s=e.get("content-type");if(s&&s.includes("application/json")){let r=JSON.parse(t.body);return new Response(JSON.stringify(r),n)}else if(s&&s.includes("application/octet-stream")){let r=w(t.body);return new Response(r,n)}else return new Response(t.body,n)}else return new Response(null,n)}function w(t){let e=new ArrayBuffer(t.length),n=new Uint8Array(e);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return e}var c=class{constructor(e,n){this.pipeMessage=e;this.sw=n}async getClient(e){return await this.sw.clients.get(e)}async buildResponse(e){let n=this.pipeMessage.getNewPid(),s=await this.getClient(e.clientId);return s?this.pipeMessage.send(n,{req:this.serializeRequest(e.request)},s):console.warn("client not found",e),this.pipeMessage.receive(n).then(r=>r.res.status===200?g(r.res):fetch(e.request))}serializeRequest(e){let n={url:e.url,method:e.method,headers:{},referrer:e.referrer,referrerPolicy:e.referrerPolicy,mode:e.mode,credentials:e.credentials,cache:e.cache,redirect:e.redirect,integrity:e.integrity,keepalive:e.keepalive};for(let[s,r]of e.headers.entries())n.headers[s]=r;return n}};var l=class{static single(){return l._instance}_id=1;get newid(){return this._id++}_pipe=new Map;read(e){return new Promise(n=>{this._pipe.set(e,{resolve:n})})}write(e,n){if(this._pipe.has(e)){let{resolve:s}=this._pipe.get(e);s&&s(n),this._pipe.delete(e)}}size(){return this._pipe.size}},a=l;f(a,"_instance",new l);function y(t){return/^(http|https):\/\//i.test(t)}var p=class{value="default";ready(){this.value="ready"}close(){this.value="close"}isReady(){return this.value==="ready"}};var i=self,d=new p,R=a.single(),h=new o(R),x=new c(h,i);i.addEventListener("install",function(){i.skipWaiting()});i.addEventListener("activate",function(t){t.waitUntil(i.clients.claim())});i.addEventListener("message",t=>{if(t.data===u.Ready){d.ready();return}if(t.data===u.Close){d.close();return}if(t.data?.pid){let{pid:e}=t.data;h.consume(e,t.data);return}});i.addEventListener("fetch",t=>{if(!d.isReady())return;let{request:e}=t;(e.headers.get("accept")||"").includes("text/event-stream")||e.mode!=="navigate"&&(e.cache==="only-if-cached"&&e.mode!=="same-origin"||y(e.url)&&t.respondWith(x.buildResponse(t)))});})();
