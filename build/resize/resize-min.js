YUI.add("resize-base",function(U){var W=U.Lang,b=W.isArray,au=W.isBoolean,ay=W.isString,aq=W.trim,l=U.Array.indexOf,ac=".",s=",",q=" ",p="active",M="activeHandle",D="activeHandleNode",w="all",aj="autoHide",ao="bottom",ak="className",an="cursor",ae="dragCursor",x="handle",K="handles",ab="hidden",u="inner",a="left",J="margin",o="node",C="nodeName",V="none",G="offsetHeight",ax="offsetWidth",e="parentNode",m="position",ap="proxy",d="proxyNode",k="relative",ah="resize",n="resizing",g="right",aC="static",j="top",al="wrap",az="wrapper",af="wrapTypes",H="resize:mouseUp",t="resize:resize",y="resize:align",I="resize:end",Q="resize:start",X="t",aB="tr",Z="r",at="br",ag="b",av="bl",ad="l",aD="tl",O=function(B){return(B instanceof U.Node);},aE=function(B){return x+B.toUpperCase();},aA=function(){return Array.prototype.slice.call(arguments).join(q);},P=U.cached(function(B){return B.substring(0,1).toUpperCase()+B.substring(1);}),A=U.ClassNameManager.getClassName,ar=A(ah),am=A(ah,x),aa=A(ah,x,p),f=A(ah,x,u),E=A(ah,x,u,"{handle}"),aF=A(ah,x,"{handle}"),c=A(ah,ab,K),v=A(ah,ap),aw=A(ah,az),h=/^(t|tr|b|bl|br|tl)$/i,S=/^(tl|l|bl)$/i,N=/^(tl|t|tr)$/i,F=/^(bl|br|l|r|tl|tr)$/i,ai='<div class="'+aA(am,aF)+'">'+'<div class="'+aA(f,E)+'">&nbsp;</div>'+"</div>",aG='<div class="'+v+'"></div>',z='<div class="'+aw+'"></div>',r=[X,aB,Z,at,ag,av,ad,aD];function i(){i.superclass.constructor.apply(this,arguments);}U.mix(i,{NAME:ah,ATTRS:{activeHandle:{value:null,validator:ay},activeHandleNode:{value:null,validator:O},autoHide:{value:false,validator:au},handles:{setter:"_setHandles",value:w},node:{setter:U.one},proxy:{value:false,validator:au},proxyNode:{setter:U.one,valueFn:function(){return U.Node.create(aG);}},resizing:{value:false,validator:au},wrap:{setter:"_setWrap",value:false,validator:au},wrapTypes:{readOnly:true,value:/canvas|textarea|input|select|button|img/i},wrapper:{setter:"_setWrapper",value:null,writeOnce:true}}});U.Resize=U.extend(i,U.Base,{changeHeightHandles:false,changeLeftHandles:false,changeTopHandles:false,changeWidthHandles:false,delegate:null,info:null,lastInfo:null,originalInfo:null,initializer:function(){var B=this;B.info={};B.originalInfo={};B.get(o).addClass(ar);B.renderer();},renderUI:function(){var B=this;B._renderHandles();},bindUI:function(){var B=this;B._createEvents();B._bindDD();B._bindHandle();},syncUI:function(){var B=this;B._setHideHandlesUI(B.get(aj));},destructor:function(){var B=this,R=B.get(o),T=B.get(az),L=T.get(e);U.Event.purgeElement(T,true);B.eachHandle(function(Y){B.delegate.dd.destroy();Y.remove(true);});if(B.get(al)){R.setStyles({margin:T.getStyle(J),position:T.getStyle(m)});if(L){L.insertBefore(R,T);}T.remove(true);}R.removeClass(ar);R.removeClass(c);},renderer:function(){this.renderUI();this.bindUI();this.syncUI();},eachHandle:function(L){var B=this;U.each(B.get(K),function(Y,R){var T=B.get(aE(Y));L.apply(B,[T,Y,R]);});},_bindDD:function(){var B=this;B.delegate=new U.DD.Delegate({bubbleTargets:B,container:B.get(az),dragConfig:{clickPixelThresh:0,clickTimeThresh:0,useShim:true,move:false},nodes:ac+am,target:false});B.on("drag:drag",B._handleResizeEvent);B.on("drag:dropmiss",B._handleMouseUpEvent);B.on("drag:end",B._handleResizeEndEvent);B.on("drag:start",B._handleResizeStartEvent);},_bindHandle:function(){var B=this,L=B.get(az);L.on("mouseenter",U.bind(B._onWrapperMouseEnter,B));L.on("mouseleave",U.bind(B._onWrapperMouseLeave,B));L.delegate("mouseenter",U.bind(B._onHandleMouseEnter,B),ac+am);L.delegate("mouseleave",U.bind(B._onHandleMouseLeave,B),ac+am);},_createEvents:function(){var B=this,L=function(R,T){B.publish(R,{defaultFn:T,queuable:false,emitFacade:true,bubbles:true,prefix:ah});};L(Q,this._defResizeStartFn);L(t,this._defResizeFn);L(y,this._defResizeAlignFn);L(I,this._defResizeEndFn);L(H,this._defMouseUpFn);},_renderHandles:function(){var B=this,L=B.get(az);B.eachHandle(function(R){L.append(R);});},_renderProxy:function(){var B=this,L=B.get(d);if(!L.inDoc()){B.get(az).get(e).append(L.hide());}},_buildHandle:function(B){return U.Node.create(U.substitute(ai,{handle:B}));},_checkSize:function(aH,L){var B=this,Y=B.info,T=B.originalInfo,R=(aH==G)?j:a;Y[aH]=L;if(((R==a)&&B.changeLeftHandles)||((R==j)&&B.changeTopHandles)){Y[R]=T[R]+T[aH]-L;}},_copyStyles:function(T,Y){var B=T.getStyle(m).toLowerCase(),L={},R;if(B==aC){B=k;}R={position:B};U.each([j,g,ao,a],function(aI){var aH=J+P(aI);L[aH]=Y.getStyle(aH);R[aH]=T.getStyle(aH);});Y.setStyles(R);T.setStyles(L);T.setStyles({margin:0});Y.set(G,T.get(G));Y.set(ax,T.get(ax));},_extractHandleName:U.cached(function(R){var L=R.get(ak),B=L.match(new RegExp(A(ah,x,"(\\w{1,2})\\b")));return B?B[1]:null;}),_getInfo:function(Y,B){var aH,aJ=B.dragEvent.target,aI=Y.getXY(),T=aI[0],R=aI[1],L=Y.get(G),aK=Y.get(ax);if(B){aH=(aJ.actXY.length?aJ.actXY:aJ.lastXY);}return{actXY:aH,bottom:(R+L),left:T,offsetHeight:L,offsetWidth:aK,right:(T+aK),top:R};},_resize:function(){var B=this,T=B.get(M),aH=B.info,Y=B.originalInfo,R=aH.actXY[0]-Y.actXY[0],L=aH.actXY[1]-Y.actXY[1],aI={t:function(){aH.top=Y.top+L;aH.offsetHeight=Y.offsetHeight-L;},r:function(){aH.offsetWidth=Y.offsetWidth+R;},l:function(){aH.left=Y.left+R;aH.offsetWidth=Y.offsetWidth-R;},b:function(){aH.offsetHeight=Y.offsetHeight+L;},tr:function(){this.t();this.r();},br:function(){this.b();this.r();},tl:function(){this.t();this.l();},bl:function(){this.b();this.l();}};aI[T](R,L);},_setOffset:function(R,L,B){R.set(ax,L);R.set(G,B);},_syncUI:function(){var B=this,R=B.info,T=B.get(az),L=B.get(o);B._setOffset(T,R.offsetWidth,R.offsetHeight);if(B.changeLeftHandles||B.changeTopHandles){T.setXY([R.left,R.top]);}if(!T.compareTo(L)){B._setOffset(L,R.offsetWidth,R.offsetHeight);}if(U.UA.webkit){L.setStyle(ah,V);}},_syncProxyUI:function(){var B=this,T=B.info,R=B.get(D),L=B.get(d),Y=R.getStyle(an);L.show().setStyle(an,Y);B.delegate.dd.set(ae,Y);B._setOffset(L,T.offsetWidth,T.offsetHeight);L.setXY([T.left,T.top]);},_updateChangeHandleInfo:function(L){var B=this;B.changeHeightHandles=h.test(L);B.changeLeftHandles=S.test(L);
B.changeTopHandles=N.test(L);B.changeWidthHandles=F.test(L);},_updateInfo:function(L){var B=this;B.info=B._getInfo(B.get(az),L);},_setActiveHandlesUI:function(R){var B=this,L=B.get(D);if(L){if(R){B.eachHandle(function(T){T.removeClass(aa);});L.addClass(aa);}else{L.removeClass(aa);}}},_setHandles:function(L){var B=[];if(b(L)){B=L;}else{if(ay(L)){if(L.toLowerCase()==w){B=r;}else{U.each(L.split(s),function(T,R){var Y=aq(T);if(l(r,Y)>-1){B.push(Y);}});}}}return B;},_setHideHandlesUI:function(L){var B=this,R=B.get(az);if(!B.get(n)){if(L){R.addClass(c);}else{R.removeClass(c);}}},_setWrap:function(T){var B=this,R=B.get(o),Y=R.get(C),L=B.get(af);if(L.test(Y)){T=true;}return T;},_setWrapper:function(){var B=this,R=B.get(o),L=R.get(e),T=R;if(B.get(al)){T=U.Node.create(z);if(L){L.insertBefore(T,R);}T.append(R);B._copyStyles(R,T);R.setStyles({position:aC,left:0,top:0});}return T;},_defMouseUpFn:function(L){var B=this;B.set(n,false);},_defResizeFn:function(L){var B=this;B._handleResizeAlignEvent(L.dragEvent);if(B.get(ap)){B._syncProxyUI();}else{B._syncUI();}},_defResizeAlignFn:function(L){var B=this,R;B.lastInfo=B.info;B._updateInfo(L);R=B.info;B._resize();if(!B.con){if(R.offsetHeight<=15){B._checkSize(G,15);}if(R.offsetWidth<=15){B._checkSize(ax,15);}}},_defResizeEndFn:function(R){var B=this,L=R.dragEvent.target;L.actXY=[];if(B.get(ap)){B._syncProxyUI();B.get(d).hide();}B._syncUI();B.set(M,null);B.set(D,null);B._setActiveHandlesUI(false);},_defResizeStartFn:function(R){var B=this,L;B.set(n,true);B.originalInfo=B._getInfo(B.get(az),R);B._updateInfo(R);if(B.get(ap)){B._renderProxy();}},_handleMouseUpEvent:function(B){this.fire(H,{dragEvent:B,info:this.info});},_handleResizeEvent:function(B){this.fire(t,{dragEvent:B,info:this.info});},_handleResizeAlignEvent:function(B){this.fire(y,{dragEvent:B,info:this.info});},_handleResizeEndEvent:function(B){this.fire(I,{dragEvent:B,info:this.info});},_handleResizeStartEvent:function(B){this.fire(Q,{dragEvent:B,info:this.info});},_onWrapperMouseEnter:function(L){var B=this;if(B.get(aj)){B._setHideHandlesUI(false);}},_onWrapperMouseLeave:function(L){var B=this;if(B.get(aj)){B._setHideHandlesUI(true);}},_onHandleMouseEnter:function(R){var B=this,L=R.currentTarget,T=B._extractHandleName(L);if(!B.get(n)){B.set(M,T);B.set(D,L);B._setActiveHandlesUI(true);B._updateChangeHandleInfo(T);}},_onHandleMouseLeave:function(L){var B=this;if(!B.get(n)){B._setActiveHandlesUI(false);}}});U.each(r,function(L,B){U.Resize.ATTRS[aE(L)]={setter:function(){return this._buildHandle(L);},value:null,writeOnce:true};});},"@VERSION@",{skinnable:true,requires:["base","widget","substitute","event","oop","dd-drag","dd-delegate","dd-drop"]});YUI.add("resize-constrain",function(c){var j=c.Lang,p=j.isBoolean,t=j.isNumber,r=j.isString,z=function(G){return(G instanceof c.Node);},C="borderBottomWidth",g="borderLeftWidth",y="borderRightWidth",k="borderTopWidth",n="bottom",m="con",D="constrain",E="host",s="left",i="maxHeight",v="maxWidth",a="minHeight",l="minWidth",F="node",b="offsetHeight",o="offsetWidth",e="preserveRatio",x="region",u="resizeConstrained",q="right",f="tickX",d="tickY",w="top",B="view",A="viewportRegion";function h(){h.superclass.constructor.apply(this,arguments);}c.mix(h,{NAME:u,NS:m,ATTRS:{constrain:{setter:function(G){if(G&&(z(G)||r(G)||G.nodeType)){G=c.one(G);}return G;}},minHeight:{value:15,validator:t},minWidth:{value:15,validator:t},maxHeight:{value:Infinity,validator:t},maxWidth:{value:Infinity,validator:t},preserveRatio:{value:false,validator:p},tickX:{value:false},tickY:{value:false}}});c.extend(h,c.Plugin.Base,{constrainBorderInfo:null,initializer:function(){var G=this,H=G.get(E);G.constrainBorderInfo={bottom:0,left:0,right:0,top:0};H.delegate.dd.plug(c.Plugin.DDConstrained,{tickX:G.get(f),tickY:G.get(d)});H.after("resize:align",c.bind(G._handleResizeAlignEvent,G));H.on("resize:start",c.bind(G._handleResizeStartEvent,G));},_checkConstrain:function(H,Q,I){var N=this,M,J,K,P,O=N.get(E),G=O.info,L=N._getConstrainRegion();if(L){M=G[H]+G[I];J=L[Q]-N.constrainBorderInfo[Q];if(M>=J){G[I]-=(M-J);}K=G[H];P=L[H]+N.constrainBorderInfo[H];if(K<=P){G[H]+=(P-K);G[I]-=(P-K);}}},_checkHeight:function(){var G=this,I=G.get(E),K=I.info,H=G.get(i),J=G.get(a);G._checkConstrain(w,n,b);if(K.offsetHeight>H){I._checkSize(b,H);}if(K.offsetHeight<J){I._checkSize(b,J);}},_checkRatio:function(){var U=this,N=U.get(E),T=N.info,J=N.originalInfo,M=J.offsetWidth,V=J.offsetHeight,L=J.top,W=J.left,P=J.bottom,S=J.right,I=function(){return(T.offsetWidth/M);},K=function(){return(T.offsetHeight/V);},O=N.changeHeightHandles,G,X,Q,R,H,Y;if(U.get(D)&&N.changeHeightHandles&&N.changeWidthHandles){Q=U._getConstrainRegion();X=U.constrainBorderInfo;G=(Q.bottom-X.bottom)-P;R=W-(Q.left+X.left);H=(Q.right-X.right)-S;Y=L-(Q.top+X.top);if(N.changeLeftHandles&&N.changeTopHandles){O=(Y<R);}else{if(N.changeLeftHandles){O=(G<R);}else{if(N.changeTopHandles){O=(Y<H);}else{O=(G<H);}}}}if(O){T.offsetWidth=M*K();U._checkWidth();T.offsetHeight=V*I();}else{T.offsetHeight=V*I();U._checkHeight();T.offsetWidth=M*K();}if(N.changeTopHandles){T.top=L+(V-T.offsetHeight);}if(N.changeLeftHandles){T.left=W+(M-T.offsetWidth);}c.each(T,function(aa,Z){if(t(aa)){T[Z]=Math.round(aa);}});},_checkRegion:function(){var G=this,H=G.get(E),I=G._getConstrainRegion();return c.DOM.inRegion(null,I,true,H.info);},_checkWidth:function(){var G=this,J=G.get(E),K=J.info,I=G.get(v),H=G.get(l);G._checkConstrain(s,q,o);if(K.offsetWidth<H){J._checkSize(o,H);}if(K.offsetWidth>I){J._checkSize(o,I);}},_getConstrainRegion:function(){var G=this,I=G.get(E),H=I.get(F),K=G.get(D),J=null;if(K){if(K==B){J=H.get(A);}else{if(z(K)){J=K.get(x);}else{J=K;}}}return J;},_handleResizeAlignEvent:function(I){var G=this,H=G.get(E);G._checkHeight();G._checkWidth();if(G.get(e)){G._checkRatio();}if(G.get(D)&&!G._checkRegion()){H.info=H.lastInfo;}},_handleResizeStartEvent:function(H){var G=this;G._updateConstrainBorderInfo();},_updateConstrainBorderInfo:function(){var H=this,I=H.get(D),G;if(z(I)){G=function(J){return parseFloat(I.getStyle(J))||0;
};H.constrainBorderInfo.bottom=G(C);H.constrainBorderInfo.left=G(g);H.constrainBorderInfo.right=G(y);H.constrainBorderInfo.top=G(k);}}});c.namespace("Plugin");c.Plugin.ResizeConstrained=h;},"@VERSION@",{requires:["resize-base","plugin"],skinnable:false});YUI.add("resize",function(a){},"@VERSION@",{use:["resize-base","resize-constrain"]});