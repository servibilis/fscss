!function(e){var t={};function s(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=t,s.d=function(e,t,r){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(s.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)s.d(r,n,function(t){return e[t]}.bind(null,n));return r},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s(s.s=1)}([function(e,t,s){"use strict";function r(e){for(var t=!1,s="",r=(e=(e=e.replace(/(?:\n|\r)+\/{2,}.*(?=\n)/g,"").trim()).replace(/(?:\n|\r)+/g,"").trim()).length,n=0;n<r;n++)0==t&&n+1<r&&"/"==e[n]&&"*"==e[n+1]?(t=!0,n+=1):1==t&&n+1<r&&"*"==e[n]&&"/"==e[n+1]?(t=!1,n+=1):0==t&&(s+=e[n]);return s}function n(e){var t={child:{},style:{}},s=e.indexOf("{"),n=[{start:0,second_start:s,end:!1}];if(-1===s)n[n.length-1].end=e.length;else for(var o=1,a=e.length,l=!1,u=!1,c=s+1;c<a;c++){var d=e[c];if(!0!==u)if(!1==(u="'"==d||'"'==d)){var f=n.length;if("}"==d?o-=1:"{"==d&&(o+=1),0==o){n[f-1].end=c;var v=e.indexOf("{",c);if(-1==v)break;n[f]={start:c+1,second_start:v,end:!1},o=1,c=v+1}}else l=d;else!1===(u=l!=d)&&(l=!1)}for(var h=0;h<n.length;h++){var y=n[h],p=e.substring(y.start,y.end),g="";y.second_start>0&&(p=e.substring(y.start,y.second_start),g=e.substring(y.second_start+1,y.end));for(var _=[],m=p.length,b=!1,w=!1,x=0;x<m;x++){var k=p[x];!0!==w?!1==(w="'"==k||'"'==k)?";"==k&&(_[_.length]=x):b=k:!1===(w=b!=k)&&(b=!1)}for(var S=_.length,E=0,j=0;j<S;j++)i(t.style,p.substring(E,_[j])),E=_[j]+1;if(g.length>0){p=r(p.substring(E,m));var O=this.scss_to_array(g);t.child[p]=p in t.child==!1?O:this.merge(t.child[p],O)}else i(t.style,p.substring(E,m))}return t}function i(e,t){var s=t.split(":");return 2==s.length?(s[0]=r(s[0]),s[1]=r(s[1])):(s[0]=r(t),s[1]=""),""!=s[0]&&(e[s[0]]=s[1],!0)}function o(e,t){for(var s in t.style)""!=s&&(e.style[s]=t.style[s]);for(var r in t.child)r in e.child==!1?e.child[r]=t.child[r]:e.child[r]=this.merge(e.child[r],t.child[r]);return e}s.d(t,"c",(function(){return r})),s.d(t,"b",(function(){return n})),s.d(t,"a",(function(){return o}))},function(e,t,s){"use strict";s.r(t),function(e){s(0);e.fscss=s(3).default}.call(this,s(2))},function(e,t){var s;s=function(){return this}();try{s=s||new Function("return this")()}catch(e){"object"==typeof window&&(s=window)}e.exports=s},function(e,t,s){"use strict";s.r(t),s.d(t,"default",(function(){return o}));var r=s(0);function n(e,t){for(var s=0;s<t.length;s++){var r=t[s];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function i(e,t,s){return t&&n(e.prototype,t),s&&n(e,s),e}var o=function(){function e(t){var s=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e);var r=void 0!==t.get_fscss&&t.get_fscss,n=void 0!==t.set_fscss&&t.set_fscss,i=void 0!==t.set_scss&&t.set_scss,o=void 0===t.show_save_button||t.show_save_button,a=void 0!==t.key_save_css?t.key_save_css:"F6",l=!0===Array.isArray(t.array_class_exclude)?t.array_class_exclude:[],u=!0===Array.isArray(t.progressive_sizes)?t.progressive_sizes:[576,768,992,1200];if(this.controll_words=["--add_tag","--stop","--skip","--to_root","--prefix","--suffix"],r instanceof Function==!1)throw"fn_get_fscss is not function";if(this.get=r,n instanceof Function==!1)throw"fn_set_fscss is not function";this.set_fscss=n,this.set_scss=!1,i instanceof Function==!0&&(this.set_scss=i),this.key_save_css=a.toLowerCase(),this.array_class_exclude=l,this.progressive_sizes=u,this.button=!0===o,this.obj_mutations=[],this.fname=!0===Array.isArray(this.progressive_sizes)&&"fscssprop",this.copyStyleSheets(),!0===this.button&&this.init_button(),document.addEventListener("keyup",(function(e){e.key.toLowerCase()==s.key_save_css&&s.save()}));for(var c=document.querySelectorAll("body,body *"),d=0;d<c.length;d++)void 0!==c[d].attributes.style&&(c[d].dataset.copystyle=c[d].getAttribute("style"));var f=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;this.dev_observer=new f((function(e){e.forEach((function(e){"style"==e.attributeName&&(e.target.dataset.mutation=1,1==s.button&&(document.getElementById("dev_save").className="show"),s.obj_mutations.indexOf(e.target)<0&&(s.obj_mutations[s.obj_mutations.length]=e.target))}))})),this.dev_observer.observe(document.body,{subtree:!0,childList:!0,attributes:!0,attributeOldValue:!0,attributeFilter:["style"]})}return i(e,null,[{key:"getText",value:function(e,t){var s=new XMLHttpRequest;return s.open("GET",e,!1),s.send(null),200===s.status?s.responseText:""}},{key:"get_css_properties_for_element",value:function(e){var t=void 0!==e.dataset.copystyle&&r.c(e.dataset.copystyle),s=e.getAttribute("style");if(null==s)return{};if(void 0!==(s=r.b(r.c(s))).style&&(s=s.style),Object.keys(s).length>0&&0!=t&&""!=t){var n={};if(void 0!==(t=r.b(r.c(t))).style)for(var i in t=t.style,s)void 0!==t[i]&&s[i]==t[i]||(n[i]=s[i]);return n}return s}},{key:"getCustomProp",value:function(e,t){var s=window.getComputedStyle(e).getPropertyValue(t);return null!==e.parentElement?window.getComputedStyle(e.parentElement).getPropertyValue(t)!=s&&s:s}},{key:"getSelectorForElement",value:function(t){var s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],n=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],i=arguments.length>4&&void 0!==arguments[4]&&arguments[4];window.getComputedStyle(t);0==i&&0==r.length&&(i=parseInt(e.getCustomProp(t,"--to_root"))>0);var o=t.tagName.toLowerCase(),a=parseInt(e.getCustomProp(t,"--stop"))>0;if(!0===n&&0!=r.length){var l=parseInt(e.getCustomProp(t,"--skip"))>0;if(!0===l||!0===i&&!1===a)return e.getSelectorForElement(t.parentElement,s,r,n,i)}"body"==o&&(a=!0);var u=e.getCustomProp(t,"--prefix"),c=e.getCustomProp(t,"--suffix"),d=parseInt(e.getCustomProp(t,"--add_tag"))>0,f=!0===d?o:"",v=t.id.trim(),h=t.className.toLowerCase().trim();for(var y in""!=v&&(f+="#"+v),h=h.split(/\s+/))""!=h[y]&&s.indexOf(h[y])<0&&(f+="."+h[y]);return!1!==u&&""!=u&&(f=(u=(u=u.replace(/\s*['||"]\s*$/,"")).replace(/^\s*['||"]\s*/,""))+f),!1!==c&&""!=c&&(f+=c=(c=c.replace(/\s*['||"]\s*$/,"")).replace(/^\s*['||"]\s*/,"")),""!=f&&r.unshift(f),!0===n&&!1===a?e.getSelectorForElement(t.parentElement,s,r,n,i):r}}]),i(e,[{key:"copyStyleSheets",value:function(){this.Sheets=[];for(var e=0;e<document.styleSheets.length;e++){var t=document.styleSheets[e];for(var s in this.Sheets[e]={},t.rules){var r=t.rules[s].selectorText;void 0!==r&&(this.Sheets[e][r]=t.rules[s].style.cssText)}}}},{key:"init_button",value:function(){var e=this,t=document.createElement("style");document.head.appendChild(t),t.sheet.insertRule("#dev_save{display:none;font-family: sans-serif;opacity:0.8;position:fixed;bottom:20px;right:20px;color:#fff;font-size:14px;line-height:2;background-color:#434343;padding:0px 15px}",0),t.sheet.insertRule("#dev_save.show{display:block;}",0),t.sheet.insertRule("#dev_save::before{content:'save';}",0),t.sheet.insertRule("#dev_save:hover{cursor:pointer;;background-color:#000;transition:background-color 0.5s;}",0);var s=document.createElement("div");s.id="dev_save",document.body.appendChild(s),s.addEventListener("click",(function(){confirm("save?")&&(e.save(),document.getElementById("dev_save").className="")}))}},{key:"array_to_css",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"\n",r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"\t",n="";if(void 0!==e.style)for(var i in e.style)!1===this.fname||!1===t?n+=s+(""!=e.style[i]?i+":"+e.style[i]:i)+";":n+=s+this.set_css_prop(i,e.style[i])+";";if(void 0!==e.child)for(var o in e.child)n+=s+o+"{"+("string"==typeof e.child[o]?e.child[o]:this.array_to_css(e.child[o],t,s+r))+s+r+"}";return n=(n=(n=n.replace(/};+/g,"}")).replace(/{;+/g,"{")).replace(/;+/g,";")}},{key:"set_css_prop",value:function(e,t){for(var s=t.length,r=[],n=!1,i=!1,o=0;o<s;o++){var a=t[o];!0!==i?!1==(i="'"==a||'"'==a)&&"|"==a?r.push(o):n=a:!1===(i=n!=a)&&(n=!1)}if(r.length>0){for(var l=[],u=0,c=0;c<r.length;c++){var d=t.substring(u,r[c]);l.push(""!=d?d:"null"),u=r[c]+1}return l.push(t.substring(u)),"@include "+this.fname+"("+e+","+l.join(",")+")"}return""!=t?e+":"+t:e}},{key:"applyMutations",value:function(t){arguments.length>1&&void 0!==arguments[1]&&arguments[1];void 0===t&&(t={child:{},style:{}});for(var s=0;s<this.obj_mutations.length;s++){var n=this.obj_mutations[s];if(1===parseInt(n.dataset.mutation)){var i=e.getSelectorForElement(n,this.array_class_exclude),o=e.get_css_properties_for_element(n),a=i.length;if(Object.keys(o).length>0&&a>0){for(var l=t,u=0;u<a;u++){var c=i[u];void 0===l.child[c]&&(l.child[c]={child:{},style:{}}),l=l.child[c]}l=r.a(l,{child:{},style:o})}}}}},{key:"include_propfn_scss",value:function(){var e="";if(this.progressive_sizes.length>0){e="@mixin "+this.fname+"($name,$def";for(var t="#{$name}:#{$def};",s=0;s<this.progressive_sizes.length;s++){var r=this.progressive_sizes[s];e+=", $p"+r+":null",t+="\n\t@if $p"+r+"!=null {\n\t\t@media (min-width:"+r+"px){ #{$name}:#{$p"+r+"}; } \n\t\t} "}e+="){\n\t"+t+" \n\t}"}return e}},{key:"save",value:function(){for(var t=r.b(this.get()),s=0;s<document.styleSheets.length;s++){var n=document.styleSheets[s];if(void 0!==this.Sheets[s])for(var i in n.rules){var o=n.rules[i].selectorText;if(void 0!==o){var a=e.getElementBySelector(t,o.split(/\s+/),0);if(!1!==a){var l=this.Sheets[s][o];if(void 0!==l){var u=n.rules[i].style.cssText;if(l!=u){l=r.b(l),u=r.b(u);var c={},d=0;for(var f in u.style)u.style[f]!=l.style[f]&&(c[f]=u.style[f],d+=1);if(d>0)for(var v in c)a.style[v]=c[v]}}}}}}this.applyMutations(t),this.set_fscss(this.array_to_css(t,!1)),this.save_scss(t)}},{key:"save_scss",value:function(e){if(!1!==this.set_scss){var t=this.array_to_css(e,!0);!1!==this.fname&&(t=this.include_propfn_scss()+"\n"+t),this.set_scss(t)}}}],[{key:"getElementBySelector",value:function(t,s,r){return r>=s.length?t:void 0!==t.child[s[r]]&&e.getElementBySelector(t.child[s[r]],s,r+1)}}]),e}()}]);