function addLoadEvent(A){var B=window.onload;if(typeof window.onload!="function"){window.onload=A;}else{window.onload=function(){B();A();};}}function getStyle(B,A){var C;if(typeof B!="object"){B=document.getElementById(B);}if(B.currentStyle){C=(B.currentStyle[A]);}else{if(window.getComputedStyle){C=(document.defaultView.getComputedStyle(B,null).getPropertyValue(A));}}return(C)?C:"Error: Sorry, "+A+" could not be found";}if(typeof Object.create!=="function"){Object.create=function(B){function A(){}A.prototype=B;return new A();};}var SideScroller={defaults:{duration:0.5,numToScroll:1,mask:"scrollerMask",scroller:"scroller"},init:function(A){this.slideTimer;this.distanceMoved=0;this.tIncrement=Math.round((this.defaults.duration*1000)/30);this.tMultiply=0;this.scroller=document.getElementById(A.scroller||this.defaults.scroller);this.mask=document.getElementById(A.mask||this.defaults.mask);this.btns=[];this.btns.prev=document.getElementById(A.prevBtn);this.btns.next=document.getElementById(A.nextBtn);this.scrollItems=this.removeTextNodes();this.scrollItemWidth=this.getScrollItemWidth(this.scrollItems);this.totalMoveDistance=this.scrollItemWidth*this.defaults.numToScroll;this.setScrollerWidth();this.bindArrows();},removeTextNodes:function(){var B=this.scroller.firstChild;while(B){var A=B.nextSibling;if(B.nodeType==3){this.scroller.removeChild(B);}B=A;}return this.scroller.childNodes;},bindArrows:function(){var A=this;this.btns.prev.onclick=function(){A.initScroll.call(A,1);return false;};this.btns.next.onclick=function(){A.initScroll.call(A,-1);return false;};},unbindArrows:function(){this.btns.prev.onclick=function(){return false;};this.btns.next.onclick=function(){return false;};},setScrollerWidth:function(){var B=this.scrollItems.length;var A=getStyle(this.scrollItems[0],"marginLeft");this.totalScrollWidth=this.scrollItemWidth*B;this.scroller.style.width=this.totalScrollWidth+"px";},getScrollItemWidth:function(A){return A[0].offsetWidth+5;},initScroll:function(A,B){this.unbindArrows();this.increment=Math.round(this.scrollItemWidth/(30*this.defaults.duration));if(A==-1){this.slideLeft(A);}else{var C=0;var E=this.defaults.numToScroll;var D=this.scroller.childNodes;while(C<E){this.scroller.insertBefore(D[D.length-1],this.scroller.firstChild);C++;}this.scroller.style.left=((this.scrollItemWidth*E)*(-1))+"px";this.slideRight(A);}},scroll:function(A){var B=(this.scroller.offsetLeft+(this.increment*A));this.scroller.style.left=B+"px";this.distanceMoved+=this.increment;this.tMultiply++;},slideLeft:function(B){if(this.distanceMoved<this.totalMoveDistance){this.scroll(B);var A=this;this.slideTimer=window.setTimeout(function(){A.slideLeft(B);},(this.tIncrement/this.tMultiply));}else{var E=this.scroller.offsetLeft+(this.scrollItemWidth*B);this.scroller.style.left=E+"px";var C=0;var D=this.defaults.numToScroll;while(C<D){this.scroller.appendChild(this.scroller.removeChild(this.scroller.firstChild));C++;}this.scroller.style.left=0;this.distanceMoved=0;this.tMultiply=0;this.bindArrows();}},slideRight:function(B){if(this.distanceMoved<=this.totalMoveDistance){this.scroll(B);var A=this;this.slideTimer=window.setTimeout(function(){A.slideRight(B);},(this.tIncrement/this.tMultiply));}else{clearTimeout(this.slideTimer);this.tMultiply=0;this.distanceMoved=0;this.bindArrows();}}};