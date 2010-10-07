/**
 *	@name Side Scroller
 *	@version v1.0
 *	@description carousel like scroller
 *	@author Michael Turnwall
 *
 *	<p>
 *  Copyright 2010 Michael Turnwall<br>
 *  Licensed under a MIT license:<br>
 *	http://www.opensource.org/licenses/mit-license.php</p>
*/

// onload function written by Simon Willison - http://simon.incutio.com Copyright Simon Willison
// use this function instead of window.onload - usage addLoadEvent(functionName) or addLoadEvent(function(){ some code;} )
function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			oldonload();
			func();
		};
	}
}

function getStyle(el, style)
{
	var styled;
	if (typeof el != "object") {
		el = document.getElementById(el);
	}
	if (el.currentStyle) {  // IE
		styled =  (el.currentStyle[style]);
	} else if (window.getComputedStyle) {  // everyone else
		styled =  (document.defaultView.getComputedStyle(el,null).getPropertyValue(style));
	}
	return (styled) ? styled : "Error: Sorry, " + style + " could not be found";
}

if (typeof Object.create !== 'function') {
	Object.create = function (o) {
		function F() {}
		F.prototype = o;
		return new F();
	};
}

/** 
	Side Scroller Object for carousel image sliding
	@class
*/
var SideScroller = /** @lends Picker.prototype */  {
    defaults: {
        duration: 0.5,			// time it takes to scroll in seconds
        numToScroll: 1,			// number of items to scroll
        mask: 'scrollerMask',	// the ID of the element that masks the scroll items
        scroller: 'scroller'	// the ID fo the element that will actually be scrolled
    },
    /** 
	 * initializes the object
	 * @param {Object Literal} options an object containing options for object
	 * @constructs
	 */
    init: function (options) {
        this.slideTimer;            // used for setTimeout instance
        this.distanceMoved = 0;     // how far slider has moved
        this.tIncrement = Math.round((this.defaults.duration*1000)/30);  // time increment
        this.tMultiply = 0;         // time multipler to speed up movement
        
        
        this.scroller = document.getElementById(options.scroller || this.defaults.scroller);
        this.mask = document.getElementById(options.mask || this.defaults.mask);
        this.btns = [];
        this.btns['prev'] = document.getElementById(options.prevBtn);
        this.btns['next'] = document.getElementById(options.nextBtn);
        
        this.scrollItems = this.removeTextNodes();
        
        this.scrollItemWidth = this.getScrollItemWidth(this.scrollItems);
        this.totalMoveDistance = this.scrollItemWidth * this.defaults.numToScroll;
        this.setScrollerWidth();
        this.bindArrows();
    },
    /** 
     *  remove extra text nodes from scroller
     *  @return {NodeList} child nodes with white space text nodes removed
     *  @private
     */
    removeTextNodes: function() {
        var child = this.scroller.firstChild;
        while (child) {
            var tempChild = child.nextSibling;
            if (child.nodeType == 3) {
                this.scroller.removeChild(child);
            }
            child = tempChild;
        };
        return this.scroller.childNodes;
    },
    /**
     *  bind the click events to the nav arrows
	 *	'this' will still refer to the object rather than the anchor that was clicked
     */
    bindArrows: function () {
        var obj = this;
        this.btns['prev'].onclick = function() {
            obj.initScroll.call(obj, 1);	// make sure 'this' still refers to the object
            return false;
        };
        this.btns['next'].onclick = function() {
            obj.initScroll.call(obj, -1);	// make sure 'this' still refers to the object
            return false;
        };
    },
    /**
     *  remove the click events from the nav arrows
     */
    unbindArrows: function () {
        this.btns['prev'].onclick = function() {
            return false;
        };
        this.btns['next'].onclick = function() {
            return false;
        };
    },
    /**
     *  set the width of the scroller itself
     */
    setScrollerWidth: function () {
        var totalItems = this.scrollItems.length;
        var marginRight = getStyle(this.scrollItems[0], 'marginLeft');
        this.totalScrollWidth = this.scrollItemWidth * totalItems;
        this.scroller.style.width = this.totalScrollWidth + "px";
    },
    /**
     *  find the width of an individual scroll item which is used 
     *  to determine the total width of the scroller
     *  @param {NodeList} scrollItems the collection of all the scroll items
     *  @return {Integer} returns width of first scroll item
     *  @private
     */
    getScrollItemWidth: function(scrollItems) {    
        return scrollItems[0].offsetWidth + 5;
    },
    /**
     *  setup items to be scrolled
     *  @param {Integer} dir the direction to slide, either -1 or 1
     *  @param {DOM Element} linkage the nav arrow that was clicked
     */
    initScroll: function (dir, linkage) {
        this.unbindArrows();    // removing binding to prevent double clicks
        this.increment = Math.round(this.scrollItemWidth / (30 * this.defaults.duration));
        if (dir == -1) {
            this.slideLeft(dir);
        } else {
            var count = 0;
            var numToScroll = this.defaults.numToScroll;   // write to local variable for speed
			var childs = this.scroller.childNodes;
			// move elements from back to front before sliding
    		while (count < numToScroll) {
    			this.scroller.insertBefore(childs[childs.length-1],this.scroller.firstChild);
    			count++;
			}
    		this.scroller.style.left = ((this.scrollItemWidth * numToScroll) * (-1)) + "px";
    		this.slideRight(dir);
		}
    },
    /**
    *   scroll the items
    *   @param {Integer} dir the direction to move items
    */
    scroll: function(dir) {
        var left = (this.scroller.offsetLeft + (this.increment * dir));
        this.scroller.style.left = left + 'px';
        this.distanceMoved += this.increment;
        this.tMultiply++;
    },
    /**
    *   scroll the items to the left
    *   @param {Integer} dir the direction to move items
    */
    slideLeft: function (dir) {
        if (this.distanceMoved < this.totalMoveDistance) {
            this.scroll(dir);
            var self = this;
            this.slideTimer = window.setTimeout(function() { self.slideLeft(dir); }, (this.tIncrement/this.tMultiply));
        } else {
            var left = this.scroller.offsetLeft + (this.scrollItemWidth * dir);
            this.scroller.style.left = left + 'px';
            var count = 0;
            var numToScroll = this.defaults.numToScroll;   // write to local variable for speed
            while (count < numToScroll) {
        		this.scroller.appendChild(this.scroller.removeChild(this.scroller.firstChild));
                count++;
            }
            this.scroller.style.left = 0;
            this.distanceMoved = 0;
            this.tMultiply = 0;
            this.bindArrows();
        }
    },
    /**
    *   scroll the items to the right
    *   @param {Integer} dir the direction to move items
    */
    slideRight: function (dir) {
        if (this.distanceMoved <= this.totalMoveDistance) {
            this.scroll(dir);
            var self = this;
            this.slideTimer = window.setTimeout(function() { self.slideRight(dir); }, (this.tIncrement/this.tMultiply));
        } else {
           clearTimeout(this.slideTimer);
           this.tMultiply = 0;
           this.distanceMoved = 0;
           this.bindArrows();
        }
    }
};