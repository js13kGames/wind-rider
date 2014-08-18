/**
 * @license almond 0.2.9 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */

(function(){var e,t,n;(function(r){function v(e,t){return h.call(e,t)}function m(e,t){var n,r,i,s,o,u,a,f,c,h,p,v=t&&t.split("/"),m=l.map,g=m&&m["*"]||{};if(e&&e.charAt(0)===".")if(t){v=v.slice(0,v.length-1),e=e.split("/"),o=e.length-1,l.nodeIdCompat&&d.test(e[o])&&(e[o]=e[o].replace(d,"")),e=v.concat(e);for(c=0;c<e.length;c+=1){p=e[c];if(p===".")e.splice(c,1),c-=1;else if(p===".."){if(c===1&&(e[2]===".."||e[0]===".."))break;c>0&&(e.splice(c-1,2),c-=2)}}e=e.join("/")}else e.indexOf("./")===0&&(e=e.substring(2));if((v||g)&&m){n=e.split("/");for(c=n.length;c>0;c-=1){r=n.slice(0,c).join("/");if(v)for(h=v.length;h>0;h-=1){i=m[v.slice(0,h).join("/")];if(i){i=i[r];if(i){s=i,u=c;break}}}if(s)break;!a&&g&&g[r]&&(a=g[r],f=c)}!s&&a&&(s=a,u=f),s&&(n.splice(0,u,s),e=n.join("/"))}return e}function g(e,t){return function(){return s.apply(r,p.call(arguments,0).concat([e,t]))}}function y(e){return function(t){return m(t,e)}}function b(e){return function(t){a[e]=t}}function w(e){if(v(f,e)){var t=f[e];delete f[e],c[e]=!0,i.apply(r,t)}if(!v(a,e)&&!v(c,e))throw new Error("No "+e);return a[e]}function E(e){var t,n=e?e.indexOf("!"):-1;return n>-1&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function S(e){return function(){return l&&l.config&&l.config[e]||{}}}var i,s,o,u,a={},f={},l={},c={},h=Object.prototype.hasOwnProperty,p=[].slice,d=/\.js$/;o=function(e,t){var n,r=E(e),i=r[0];return e=r[1],i&&(i=m(i,t),n=w(i)),i?n&&n.normalize?e=n.normalize(e,y(t)):e=m(e,t):(e=m(e,t),r=E(e),i=r[0],e=r[1],i&&(n=w(i))),{f:i?i+"!"+e:e,n:e,pr:i,p:n}},u={require:function(e){return g(e)},exports:function(e){var t=a[e];return typeof t!="undefined"?t:a[e]={}},module:function(e){return{id:e,uri:"",exports:a[e],config:S(e)}}},i=function(e,t,n,i){var s,l,h,p,d,m=[],y=typeof n,E;i=i||e;if(y==="undefined"||y==="function"){t=!t.length&&n.length?["require","exports","module"]:t;for(d=0;d<t.length;d+=1){p=o(t[d],i),l=p.f;if(l==="require")m[d]=u.require(e);else if(l==="exports")m[d]=u.exports(e),E=!0;else if(l==="module")s=m[d]=u.module(e);else if(v(a,l)||v(f,l)||v(c,l))m[d]=w(l);else{if(!p.p)throw new Error(e+" missing "+l);p.p.load(p.n,g(i,!0),b(l),{}),m[d]=a[l]}}h=n?n.apply(a[e],m):undefined;if(e)if(s&&s.exports!==r&&s.exports!==a[e])a[e]=s.exports;else if(h!==r||!E)a[e]=h}else e&&(a[e]=n)},e=t=s=function(e,t,n,a,f){if(typeof e=="string")return u[e]?u[e](t):w(o(e,t).f);if(!e.splice){l=e,l.deps&&s(l.deps,l.callback);if(!t)return;t.splice?(e=t,t=n,n=null):e=r}return t=t||function(){},typeof n=="function"&&(n=a,a=f),a?i(r,e,t,n):setTimeout(function(){i(r,e,t,n)},4),s},s.config=function(e){return s(e)},e._defined=a,n=function(e,t,n){t.splice||(n=t,t=[]),!v(a,e)&&!v(f,e)&&(f[e]=[e,t,n])},n.amd={jQuery:!0}})(),n("almond",function(){}),n("minivents.min",["require"],function(e){function t(e){var t={};e=e||this,e.on=function(e,n,r){t[e]||(t[e]=[]),t[e].push({f:n,c:r})},e.off=function(e,n){e||(t={});for(var r=t[e]||[],i=r.length=n?r.length:0;i-->0;)n==r[i].f&&r.splice(i,1)},e.emit=function(){var e,n=Array.apply([],arguments),r=t[n.shift()]||[],i=r.length;for(e=0;i>e;e++)r[e].f.apply(r[e].c,n)}}var n,r,i=r!=n;return(i?r:window)[i?"exports":"Events"]=t,t}),n("vector",["require"],function(e){function n(e,t){return Math.sqrt(Math.pow(e,2)+Math.pow(t,2))}var t=function(e,t){this.x=e,this.y=t};return t.prototype={add:function(e){this.x+=e.x,this.y+=e.y},subtract:function(e){this.x-=e.x,this.y-=e.y},mag:function(){return n(this.x,this.y)},scale:function(e){this.x*=e,this.y*=e},normalise:function(){var e=Math.max(Math.abs(this.x),Math.abs(this.y));this.x/=e,this.y/=e},limit:function(e){this.x=Math.min(e,Math.max(-e,this.x)),this.y=Math.min(e,Math.max(-e,this.y))},getDist:function(e){var t=Math.abs(this.x-e.x),r=Math.abs(this.y-e.y);return n(t,r)},getAngle:function(){return Math.atan2(this.y,this.x)},getScaled:function(e){return new t(this.x*e,this.y*e)}},t.fromPolar=function(e,n){return new t(e*Math.cos(n),e*Math.sin(n))},window.Vector=t,t}),n("player",["require","vector"],function(e){var t=e("vector"),n=new t(0,1);return Player=function(e){this.position=new t(480,270),this.velocity=new t(0,0),this.acceleration=new t(0,0),this.speed=3,this.radius=25,bornTime=Date.now(),gameEvents.on("update",this.update,this),gameEvents.on("render",this.render,this),gameEvents.on("press",this.onPress,this)},Player.prototype={update:function(e,t){this.velocity.add(this.acceleration),this.velocity.scale(.95),this.velocity.add(t.getScaled(e)),this.velocity.limit(10),this.position.add(this.velocity),(this.position.y>540||this.position.y<0||this.position.x<0||this.position.x>960)&&gameEvents.emit("gameover")},render:function(e){e.save(),e.translate(this.position.x,this.position.y),e.fillStyle="#fa3da8",e.arc(0,0,this.radius,0,2*Math.PI,!1),e.fill(),e.restore()},onPress:function(e,n){var r=Math.atan2(n-this.position.y,e-this.position.x);this.velocity=t.fromPolar(this.speed,r)},getLifeSpan:function(){return Math.round((Date.now()-bornTime)/1e3)},destroy:function(){gameEvents.off("update",this.update,this),gameEvents.off("render",this.render,this),gameEvents.off("press",this.onPress,this)}},Player}),n("wind",["require","vector"],function(e){var t=e("vector");return Wind=function(){this.windVector=new t(0,0),this.angle=0,this.speed=0,this.size=12,this.xScale=0,gameEvents.on("update",this.update,this),gameEvents.on("render",this.render,this)},Wind.prototype={update:function(e){xChange=1-Math.random()*2,yChange=1-Math.random()*2,this.windVector.add(new t(xChange,yChange)),this.windVector.limit(10),this.speed=this.windVector.mag(),this.xScale=this.speed/10,this.angle=this.windVector.getAngle()},render:function(e){e.font="20pt Arial",e.fillStyle="#000000",e.fillText(Math.round(this.speed),840,50),e.save(),e.translate(840,50),e.rotate(this.angle),e.fillStyle="#ff0000",e.beginPath(),e.moveTo(0,-this.size/2),e.lineTo(this.size*this.xScale,-this.size/2),e.lineTo(this.size*this.xScale,-this.size),e.lineTo(this.size*2*this.xScale,0),e.lineTo(this.size*this.xScale,this.size),e.lineTo(this.size*this.xScale,this.size/2),e.lineTo(0,this.size/2),e.closePath(),e.fill(),e.restore()},destroy:function(){gameEvents.off("update",this.update,this),gameEvents.off("render",this.render,this)},getVector:function(){return this.windVector}},Wind}),n("sceneManager",["require","player","wind"],function(e){function u(e,t){n.width=n.width,n.removeEventListener("mousedown",i),n.removeEventListener("touchstart",i),document.removeEventListener("keydown",s);switch(e){case"game":o=new l;break;case"intro":o=new a;break;case"gameover":o=new f(t)}n.addEventListener("mousedown",i),n.addEventListener("touchstart",i),document.addEventListener("keydown",s),window.scene=o}function a(){r.fillStyle="#fa3da8",r.arc(480,270,25,0,2*Math.PI,!1),r.fill(),r.font="72px Helvetica, sans-serif",r.fillStyle="#000000",r.textAlign="center",r.textBaseLine="middle",r.fillText("Game title",480,270),r.font="20px Helvetica, sans-serif",r.fillText("Click to start",480,320),i=function(e){u("game")}}function f(e){r.fillStyle="#fa3da8",r.arc(480,270,25,0,2*Math.PI,!1),r.fill(),r.font="72px Helvetica, sans-serif",r.fillStyle="#000000",r.textAlign="center",r.textBaseLine="middle",r.fillText("Game over",480,270),r.font="20px Helvetica, sans-serif",r.fillText("You lasted "+e+" seconds.",480,320),i=function(e){u("game")}}function l(){function v(){d=!0}function m(){if(!d)t(m),p?(h=Date.now(),drawnPausedText||(drawnPausedText=!0,r.font="72px Helvetica, sans-serif",r.fillStyle="#000000",r.textAlign="center",r.textBaseLine="middle",r.fillText("Paused",480,270))):(drawnPausedText=!1,g(),w());else{gameEvents.off("gameover",v);var e=f.getLifeSpan();f.destroy(),l.destroy(),f=null,l=null,u("gameover",e)}}function g(){c=Date.now();var e=c-h;h=c,gameEvents.emit("update",e/1e3,l.getVector())}function w(){r.clearRect(0,0,n.width,n.height),gameEvents.emit("render",r)}var o=e("player"),a=e("wind"),f=new o,l=new a,c=Date.now(),h=Date.now(),p=!1,d=!1;gameEvents.on("gameover",v);var y=0,b=0;i=function(e){var t=document.getElementById("content");y=Math.round((e.pageX-t.offsetLeft-t.clientLeft)*scale),b=Math.round((e.pageY-t.offsetTop-t.clientTop)*scale),gameEvents.emit("press",y,b)},s=function(e){e.which===27&&(p=!p)},m()}var t=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}(),n=document.getElementById("gameCanvas"),r=n.getContext("2d"),i=null,s=null,o=null;return{loadScene:u}}),n("game",["require","minivents.min","sceneManager"],function(e){var t=e("minivents.min");window.gameEvents=new t,window.SceneManager=e("sceneManager"),SceneManager.loadScene("intro")}),n("main",["require","game"],function(e){function t(){var e=document.getElementById("content"),t=e.clientWidth*.5625;e.setAttribute("style","height:"+t+"px;"),e.style.height=t+"px",window.scale=960/e.clientWidth}window.onresize=t,t(),window.TWO_PI=Math.PI*2,e("game")}),t(["main"])})();