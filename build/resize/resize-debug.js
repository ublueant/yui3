YUI.add('resize-base', function(Y) {

/**
 * The Resize Utility allows you to make an HTML element resizable.
 *
 * @module resize
 */

var Lang = Y.Lang,
	isArray = Lang.isArray,
	isBoolean = Lang.isBoolean,
	isString = Lang.isString,

	trim = Lang.trim,
	indexOf = Y.Array.indexOf,

	DOT = '.',
	COMMA = ',',
	SPACE = ' ',

	ACTIVE = 'active',
	ACTIVE_HANDLE = 'activeHandle',
	ACTIVE_HANDLE_NODE = 'activeHandleNode',
	ALL = 'all',
	AUTO_HIDE = 'autoHide',
	BOTTOM = 'bottom',
	CLASS_NAME = 'className',
	CURSOR = 'cursor',
	DRAG_CURSOR = 'dragCursor',
	HANDLE = 'handle',
	HANDLES = 'handles',
	HIDDEN = 'hidden',
	INNER = 'inner',
	LEFT = 'left',
	MARGIN = 'margin',
	NODE = 'node',
	NODE_NAME = 'nodeName',
	NONE = 'none',
	OFFSET_HEIGHT = 'offsetHeight',
	OFFSET_WIDTH = 'offsetWidth',
	PARENT_NODE = 'parentNode',
	POSITION = 'position',
	PROXY = 'proxy',
	PROXY_NODE = 'proxyNode',
	RELATIVE = 'relative',
	RESIZE = 'resize',
	RESIZING = 'resizing',
	RIGHT = 'right',
	STATIC = 'static',
	TOP = 'top',
	WRAP = 'wrap',
	WRAPPER = 'wrapper',
	WRAP_TYPES = 'wrapTypes',

	EV_MOUSE_UP = 'resize:mouseUp',
	EV_RESIZE = 'resize:resize',
	EV_RESIZE_ALIGN = 'resize:align',
	EV_RESIZE_END = 'resize:end',
	EV_RESIZE_START = 'resize:start',

	T = 't',
	TR = 'tr',
	R = 'r',
	BR = 'br',
	B = 'b',
	BL = 'bl',
	L = 'l',
	TL = 'tl',

	isNode = function(v) {
		return (v instanceof Y.Node);
	},

	handleAttrName = function(handle) {
		return HANDLE + handle.toUpperCase();
	},

	concat = function() {
		return Array.prototype.slice.call(arguments).join(SPACE);
	},

	toInitialCap = Y.cached(
		function(str) {
			return str.substring(0, 1).toUpperCase() + str.substring(1);
		}
	),

	getCN = Y.ClassNameManager.getClassName,

	CSS_RESIZE = getCN(RESIZE),
	CSS_RESIZE_HANDLE = getCN(RESIZE, HANDLE),
	CSS_RESIZE_HANDLE_ACTIVE = getCN(RESIZE, HANDLE, ACTIVE),
	CSS_RESIZE_HANDLE_INNER = getCN(RESIZE, HANDLE, INNER),
	CSS_RESIZE_HANDLE_INNER_PLACEHOLDER = getCN(RESIZE, HANDLE, INNER, '{handle}'),
	CSS_RESIZE_HANDLE_PLACEHOLDER = getCN(RESIZE, HANDLE, '{handle}'),
	CSS_RESIZE_HIDDEN_HANDLES = getCN(RESIZE, HIDDEN, HANDLES),
	CSS_RESIZE_PROXY = getCN(RESIZE, PROXY),
	CSS_RESIZE_WRAPPER = getCN(RESIZE, WRAPPER),

	REGEX_CHANGE_HEIGHT = /^(t|tr|b|bl|br|tl)$/i,
	REGEX_CHANGE_LEFT = /^(tl|l|bl)$/i,
	REGEX_CHANGE_TOP = /^(tl|t|tr)$/i,
	REGEX_CHANGE_WIDTH = /^(bl|br|l|r|tl|tr)$/i,

	TPL_HANDLE = '<div class="'+concat(CSS_RESIZE_HANDLE, CSS_RESIZE_HANDLE_PLACEHOLDER)+'">' +
					'<div class="'+concat(CSS_RESIZE_HANDLE_INNER, CSS_RESIZE_HANDLE_INNER_PLACEHOLDER)+'">&nbsp;</div>' +
				 '</div>',

	TPL_PROXY_NODE = '<div class="' + CSS_RESIZE_PROXY + '"></div>',

	TPL_WRAP_NODE = '<div class="' + CSS_RESIZE_WRAPPER + '"></div>',

	ALL_HANDLES = [ T, TR, R, BR, B, BL, L, TL ];

/**
 * A base class for Resize, providing:
 * <ul>
 *    <li>Basic Lifecycle (initializer, renderUI, bindUI, syncUI, destructor)</li>
 *    <li>Applies drag handles to an element to make it resizable</li>
 *    <li>Here is the list of valid resize handles:
 *        <code>[ 't', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl' ]</code>. You can
 *        read this list as top, top-right, right, bottom-right, bottom,
 *        bottom-left, left, top-left.</li>
 *    <li>The drag handles are inserted into the element and positioned
 *        absolute. Some elements, such as a textarea or image, don't support
 *        children. To overcome that, set wrap:true in your config and the
 *        element willbe wrapped for you automatically.</li>
 * </ul>
 *
 * Quick Example:
 *
 * <pre><code>var instance = new Y.Resize({
 *  node: '#resize1',
 *  proxy: true,
 *  preserveRatio: true,
 *  wrap: true,
 *  maxHeight: 170,
 *  maxWidth: 400,
 *  handles: 't, tr, r, br, b, bl, l, tl'
 * });
 * </code></pre>
 *
 * Check the list of <a href="Resize.html#configattributes">Configuration Attributes</a> available for
 * Resize.
 *
 * @class Resize
 * @param config {Object} Object literal specifying widget configuration properties.
 * @constructor
 * @extends Base
 */
function Resize() {
    Resize.superclass.constructor.apply(this, arguments);
}

Y.mix(Resize, {
	/**
	 * Static property provides a string to identify the class.
	 *
	 * @property Resize.NAME
	 * @type String
	 * @static
	 */
	NAME: RESIZE,

	/**
	 * Static property used to define the default attribute
	 * configuration for the Resize.
	 *
	 * @property Resize.ATTRS
	 * @type Object
	 * @static
	 */
	ATTRS: {
		/**
		 * Stores the active handle during the resize.
		 *
		 * @attribute activeHandle
		 * @default null
		 * @private
		 * @type String
		 */
		activeHandle: {
			value: null,
			validator: isString
		},

		/**
		 * Stores the active handle element during the resize.
		 *
		 * @attribute activeHandleNode
		 * @default null
		 * @private
		 * @type Node
		 */
		activeHandleNode: {
			value: null,
			validator: isNode
		},

		/**
         * False to ensure that the resize handles are always visible, true to
         * display them only when the user mouses over the resizable borders.
		 *
		 * @attribute autoHide
		 * @default false
		 * @type boolean
		 */
		autoHide: {
			value: false,
			validator: isBoolean
		},

        /**
         * The handles to use (any combination of): 't', 'b', 'r', 'l', 'bl',
         * 'br', 'tl', 'tr'. Can use a shortcut of All.
         *
         * @attribute handles
         * @default all
         * @type Array | String
         */
		handles: {
			setter: '_setHandles',
			value: ALL
		},

		/**
         * The selector or element to resize. Required.
         *
         * @attribute node
         * @type Node
         */
		node: {
			setter: Y.one
		},

		/**
         * Resize a proxy element instead of the real element.
         *
         * @attribute proxy
         * @default false
         * @type boolean
         */
		proxy: {
			value: false,
			validator: isBoolean
		},

		/**
         * The Resize proxy element.
         *
         * @attribute proxyNode
         * @default Generated using an internal HTML markup
         * @type String | Node
         */
		proxyNode: {
			setter: Y.one,
			valueFn: function() {
				return Y.Node.create(TPL_PROXY_NODE);
			}
		},

		/**
         * True when the element is being Resized.
         *
         * @attribute resizing
         * @default false
         * @type boolean
         */
		resizing: {
			value: false,
			validator: isBoolean
		},

		/**
		 * True to wrap an element with a div if needed (required for textareas
         * and images, defaults to false) in favor of the handles config option.
         * The wrapper element type (default div) could be over-riden passing the
         * <code>wrapper</code> attribute.
		 *
		 * @attribute wrap
		 * @default false
		 * @type boolean
		 */
		wrap: {
			setter: '_setWrap',
			value: false,
			validator: isBoolean
		},

		/**
		 * Elements that requires a wrapper by default. Normally are elements
         * which cannot have children elements.
		 *
		 * @attribute wrapTypes
		 * @default /canvas|textarea|input|select|button|img/i
		 * @readOnly
		 * @type Regex
		 */
		wrapTypes: {
			readOnly: true,
			value: /canvas|textarea|input|select|button|img/i
		},

		/**
		 * Element to wrap the <code>wrapTypes</code>. This element will house
         * the handles elements.
		 *
		 * @attribute wrapper
		 * @default div
		 * @type String | Node
		 * @writeOnce
		 */
		wrapper: {
			setter: '_setWrapper',
			value: null,
			writeOnce: true
		}
	}
});

Y.Resize = Y.extend(
	Resize,
	Y.Base,
	{
		/**
		 * Whether the handle being dragged can change the height.
		 *
		 * @property changeHeightHandles
		 * @default false
		 * @type boolean
		 */
		changeHeightHandles: false,

		/**
		 * Whether the handle being dragged can change the left.
		 *
		 * @property changeLeftHandles
		 * @default false
		 * @type boolean
		 */
		changeLeftHandles: false,

		/**
		 * Whether the handle being dragged can change the top.
		 *
		 * @property changeTopHandles
		 * @default false
		 * @type boolean
		 */
		changeTopHandles: false,

		/**
		 * Whether the handle being dragged can change the width.
		 *
		 * @property changeWidthHandles
		 * @default false
		 * @type boolean
		 */
		changeWidthHandles: false,

		/**
		 * Store DD.Delegate reference for the respective Resize instance.
		 *
		 * @property delegate
		 * @default null
		 * @type Object
		 */
		delegate: null,

	    /**
	     * Stores the current values for the height, width, top and left. You are
	     * able to manipulate these values on resize in order to change the resize
	     * behavior.
	     *
	     * @property info
	     * @type Object
	     * @protected
	     */
		info: null,

		/**
	     * Stores the last values for the height, width, top and left.
	     *
	     * @property lastInfo
	     * @type Object
	     * @protected
	     */
		lastInfo: null,

	    /**
	     * Stores the original values for the height, width, top and left, stored
	     * on resize start.
	     *
	     * @property originalInfo
	     * @type Object
	     * @protected
	     */
		originalInfo: null,

	    /**
	     * Construction logic executed during Resize instantiation. Lifecycle.
	     *
	     * @method initializer
	     * @protected
	     */
		initializer: function() {
			var instance = this;

			instance.info = {};

			instance.originalInfo = {};

			instance.get(NODE).addClass(CSS_RESIZE);

			instance.renderer();
		},

	    /**
	     * Create the DOM structure for the Resize. Lifecycle.
	     *
	     * @method renderUI
	     * @protected
	     */
		renderUI: function() {
			var instance = this;

			instance._renderHandles();
		},

	    /**
	     * Bind the events on the Resize UI. Lifecycle.
	     *
	     * @method bindUI
	     * @protected
	     */
		bindUI: function() {
			var instance = this;

			instance._createEvents();
			instance._bindDD();
			instance._bindHandle();
		},

	    /**
	     * Sync the Resize UI.
	     *
	     * @method syncUI
	     * @protected
	     */
		syncUI: function() {
			var instance = this;

			// hide handles if AUTO_HIDE is true
			instance._setHideHandlesUI(
				instance.get(AUTO_HIDE)
			);
		},

	    /**
	     * Descructor lifecycle implementation for the Resize class. Purges events attached
	     * to the node (and all child nodes) and removes the Resize handles.
	     *
	     * @method destructor
	     * @protected
	     */
		destructor: function() {
			var instance = this,
				node = instance.get(NODE),
				wrapper = instance.get(WRAPPER),
				pNode = wrapper.get(PARENT_NODE);

			// purgeElements on boundingBox
			Y.Event.purgeElement(wrapper, true);

			// destroy handles dd and remove them from the dom
			instance.eachHandle(function(handleEl) {
				instance.delegate.dd.destroy();

				// remove handle
				handleEl.remove(true);
			});

			// unwrap node
			if (instance.get(WRAP)) {
				node.setStyles({
					margin: wrapper.getStyle(MARGIN),
					position: wrapper.getStyle(POSITION)
				});

				if (pNode) {
					pNode.insertBefore(node, wrapper);
				}
				// wrapper.placeBefore(node);

				wrapper.remove(true);
			}

			node.removeClass(CSS_RESIZE);
			node.removeClass(CSS_RESIZE_HIDDEN_HANDLES);
		},

	    /**
	     * Creates DOM (or manipulates DOM for progressive enhancement)
	     * This method is invoked by initializer(). It's chained automatically for
	     * subclasses if required.
	     *
	     * @method renderer
	     * @protected
	     */
	    renderer: function() {
	        this.renderUI();
	        this.bindUI();
	        this.syncUI();
	    },

	    /**
	     * <p>Loop through each handle which is being used and executes a callback.</p>
	     * <p>Example:</p>
	     * <pre><code>instance.eachHandle(
		 *      function(handleName, index) { ... }
		 *  );</code></pre>
	     *
	     * @method eachHandle
	     * @param {function} fn Callback function to be executed for each handle.
	     */
		eachHandle: function(fn) {
			var instance = this;

			Y.each(
				instance.get(HANDLES),
				function(handle, i) {
					var handleEl = instance.get(
						handleAttrName(handle)
					);

					fn.apply(instance, [handleEl, handle, i]);
				}
			);
		},

	    /**
	     * Bind the handles DragDrop events to the Resize instance.
	     *
	     * @method _bindDD
	     * @private
	     */
		_bindDD: function() {
			var instance = this;

			instance.delegate = new Y.DD.Delegate(
				{
					bubbleTargets: instance,
					container: instance.get(WRAPPER),
					dragConfig: {
						clickPixelThresh: 0,
						clickTimeThresh: 0,
						useShim: true,
						move: false
					},
					nodes: DOT+CSS_RESIZE_HANDLE,
					target: false
				}
			);

			instance.on('drag:drag', instance._handleResizeEvent);
			instance.on('drag:dropmiss', instance._handleMouseUpEvent);
			instance.on('drag:end', instance._handleResizeEndEvent);
			instance.on('drag:start', instance._handleResizeStartEvent);
		},

	    /**
	     * Bind the events related to the handles (_onHandleMouseEnter, _onHandleMouseLeave).
	     *
	     * @method _bindHandle
	     * @private
	     */
		_bindHandle: function() {
			var instance = this,
				wrapper = instance.get(WRAPPER);

			wrapper.on('mouseenter', Y.bind(instance._onWrapperMouseEnter, instance));
			wrapper.on('mouseleave', Y.bind(instance._onWrapperMouseLeave, instance));
			wrapper.delegate('mouseenter', Y.bind(instance._onHandleMouseEnter, instance), DOT+CSS_RESIZE_HANDLE);
			wrapper.delegate('mouseleave', Y.bind(instance._onHandleMouseLeave, instance), DOT+CSS_RESIZE_HANDLE);
		},

	    /**
	     * Create the custom events used on the Resize.
	     *
	     * @method _createEvents
	     * @private
	     */
		_createEvents: function() {
			var instance = this,
				// create publish function for kweight optimization
				publish = function(name, fn) {
					instance.publish(name, {
						defaultFn: fn,
						queuable: false,
						emitFacade: true,
						bubbles: true,
						prefix: RESIZE
					});
				};

			/**
			 * Handles the resize start event. Fired when a handle starts to be
	         * dragged.
			 *
	         * @event resize:start
	         * @preventable _defResizeStartFn
	         * @param {Event.Facade} event The resize start event.
	         * @bubbles Resize
	         * @type {Event.Custom}
	         */
			publish(EV_RESIZE_START, this._defResizeStartFn);

			/**
			 * Handles the resize event. Fired on each pixel when the handle is
	         * being dragged.
			 *
	         * @event resize:resize
	         * @preventable _defResizeFn
	         * @param {Event.Facade} event The resize event.
	         * @bubbles Resize
	         * @type {Event.Custom}
	         */
			publish(EV_RESIZE, this._defResizeFn);

			/**
			 * Handles the resize align event.
			 *
	         * @event resize:align
	         * @preventable _defResizeAlignFn
	         * @param {Event.Facade} event The resize align event.
	         * @bubbles Resize
	         * @type {Event.Custom}
	         */
			publish(EV_RESIZE_ALIGN, this._defResizeAlignFn);

			/**
			 * Handles the resize end event. Fired when a handle stop to be
	         * dragged.
			 *
	         * @event resize:end
	         * @preventable _defResizeEndFn
	         * @param {Event.Facade} event The resize end event.
	         * @bubbles Resize
	         * @type {Event.Custom}
	         */
			publish(EV_RESIZE_END, this._defResizeEndFn);

			/**
			 * Handles the resize mouseUp event. Fired when a mouseUp event happens on a
	         * handle.
			 *
	         * @event resize:mouseUp
	         * @preventable _defMouseUpFn
	         * @param {Event.Facade} event The resize mouseUp event.
	         * @bubbles Resize
	         * @type {Event.Custom}
	         */
			publish(EV_MOUSE_UP, this._defMouseUpFn);
		},

	    /**
	      * Responsible for loop each handle element and append to the wrapper.
	      *
	      * @method _renderHandles
	      * @protected
	      */
		_renderHandles: function() {
			var instance = this,
				wrapper = instance.get(WRAPPER);

			instance.eachHandle(function(handleEl) {
				wrapper.append(handleEl);
			});
		},

	    /**
	      * Render the <a href="Resize.html#config_proxyNode">proxyNode</a> element and
	      * make it sibling of the <a href="Resize.html#config_node">node</a>.
	      *
	      * @method _renderProxy
	      * @protected
	      */
		_renderProxy: function() {
			var instance = this,
				proxyNode = instance.get(PROXY_NODE);

			if (!proxyNode.inDoc()) {
				instance.get(WRAPPER).get(PARENT_NODE).append(
					proxyNode.hide()
				);
			}
		},

	    /**
	     * Creates the handle element based on the handle name and initialize the
	     * DragDrop on it.
	     *
	     * @method _buildHandle
	     * @param {String} handle Handle name ('t', 'tr', 'b', ...).
	     * @protected
	     */
		_buildHandle: function(handle) {
			return Y.Node.create(
				Y.substitute(TPL_HANDLE, {
					handle: handle
				})
			);
		},

		/**
	     * Helper method to update the current size value on
	     * <a href="Resize.html#property_info">info</a> to respect the
	     * min/max values and fix the top/left calculations.
		 *
		 * @method _checkSize
		 * @param {String} offset 'offsetHeight' or 'offsetWidth'
		 * @param {number} size Size to restrict the offset
		 * @protected
		 */
		_checkSize: function(offset, size) {
			var instance = this,
				info = instance.info,
				originalInfo = instance.originalInfo,
				axis = (offset == OFFSET_HEIGHT) ? TOP : LEFT;

			// forcing the offsetHeight/offsetWidth to be the passed size
			info[offset] = size;

			// predicting, based on the original information, the last left valid in case of reach the min/max dimension
			// this calculation avoid browser event leaks when user interact very fast with their mouse
			if (((axis == LEFT) && instance.changeLeftHandles) ||
				((axis == TOP) && instance.changeTopHandles)) {

				info[axis] = originalInfo[axis] + originalInfo[offset] - size;
			}
		},

	    /**
	     * Copy relevant styles of the <a href="Resize.html#config_node">node</a>
	     * to the <a href="Resize.html#config_wrapper">wrapper</a>.
	     *
	     * @method _copyStyles
	     * @param {Node} node Node from.
	     * @param {Node} wrapper Node to.
	     * @protected
	     */
		_copyStyles: function(node, wrapper) {
			var position = node.getStyle(POSITION).toLowerCase(),
				nodeStyle = {},
				wrapperStyle;

			// resizable wrapper should be positioned
			if (position == STATIC) {
				position = RELATIVE;
			}

			// copy margin, padding, position styles from the node to wrapper
			wrapperStyle = {
				position: position
			};

			// store margin(Top,Right,Bottom,Left) from the nodes involved
			// apply margin from node to the wrapper
			Y.each([ TOP, RIGHT, BOTTOM, LEFT ], function(dir) {
				var name = MARGIN + toInitialCap(dir);

				nodeStyle[name] = wrapper.getStyle(name);
				wrapperStyle[name] = node.getStyle(name);
			});

			wrapper.setStyles(wrapperStyle);
			node.setStyles(nodeStyle);

			// force remove margin from the internal node
			node.setStyles({ margin: 0 });

			wrapper.set(
				OFFSET_HEIGHT,
				node.get(OFFSET_HEIGHT)
			);

			wrapper.set(
				OFFSET_WIDTH,
				node.get(OFFSET_WIDTH)
			);
		},

		// extract handle name from a string
		// using Y.cached to memoize the function for performance
		_extractHandleName: Y.cached(
			function(node) {
				var className = node.get(CLASS_NAME),

					match = className.match(
						new RegExp(
							getCN(RESIZE, HANDLE, '(\\w{1,2})\\b')
						)
					);

				return match ? match[1] : null;
			}
		),

	    /**
	     * <p>Generates metadata to the <a href="Resize.html#property_info">info</a>
	     * and <a href="Resize.html#property_originalInfo">originalInfo</a></p>
	     * <pre><code>bottom, actXY, left, top, offsetHeight, offsetWidth, right</code></pre>
	     *
	     * @method _getInfo
	     * @param {Node} node
	     * @param {EventFacade} event
	     * @private
	     */
		_getInfo: function(node, event) {
			var actXY,
				drag = event.dragEvent.target,
				nodeXY = node.getXY(),
				nodeX = nodeXY[0],
				nodeY = nodeXY[1],
				offsetHeight = node.get(OFFSET_HEIGHT),
				offsetWidth = node.get(OFFSET_WIDTH);

			if (event) {
				// the xy that the node will be set to. Changing this will alter the position as it's dragged.
				actXY = (drag.actXY.length ? drag.actXY : drag.lastXY);
			}

			return {
				actXY: actXY,
				bottom: (nodeY + offsetHeight),
				left: nodeX,
				offsetHeight: offsetHeight,
				offsetWidth: offsetWidth,
				right: (nodeX + offsetWidth),
				top: nodeY
			};
		},

	    /**
	     * Basic resize calculations.
	     *
	     * @method _resize
	     * @protected
	     */
		_resize: function() {
			var instance = this,
				handle = instance.get(ACTIVE_HANDLE),
				info = instance.info,
				originalInfo = instance.originalInfo,

				dx = info.actXY[0] - originalInfo.actXY[0],
				dy = info.actXY[1] - originalInfo.actXY[1],

				rules = {
					t: function() {
						info.top = originalInfo.top + dy;
						info.offsetHeight = originalInfo.offsetHeight - dy;
					},
					r: function() {
						info.offsetWidth = originalInfo.offsetWidth + dx;
					},
					l: function() {
						info.left = originalInfo.left + dx;
						info.offsetWidth = originalInfo.offsetWidth - dx;
					},
					b: function() {
						info.offsetHeight = originalInfo.offsetHeight + dy;
					},
					tr: function() {
						this.t();
						this.r();
					},
					br: function() {
						this.b();
						this.r();
					},
					tl: function() {
						this.t();
						this.l();
					},
					bl: function() {
						this.b();
						this.l();
					}
				};

			rules[handle](dx, dy);
		},

		/**
		 * Set offsetWidth and offsetHeight of the passed node.
		 *
		 * @method _setOffset
		 * @param {Node} node Node
		 * @param {number} offsetWidth
		 * @param {number} offsetHeight
		 * @protected
		 */
		_setOffset: function(node, offsetWidth, offsetHeight) {
			node.set(OFFSET_WIDTH, offsetWidth);
			node.set(OFFSET_HEIGHT, offsetHeight);
		},

		/**
	     * Sync the Resize UI with internal values from
	     * <a href="Resize.html#property_info">info</a>.
	     *
	     * @method _syncUI
	     * @protected
	     */
		_syncUI: function() {
			var instance = this,
				info = instance.info,
				wrapper = instance.get(WRAPPER),
				node = instance.get(NODE);

			instance._setOffset(wrapper, info.offsetWidth, info.offsetHeight);

			if (instance.changeLeftHandles || instance.changeTopHandles) {
				wrapper.setXY([info.left, info.top]);
			}

			// if wrapper is different from node
			if (!wrapper.compareTo(node)) {
				instance._setOffset(node, info.offsetWidth, info.offsetHeight);
			}

			// prevent webkit textarea resize
			if (Y.UA.webkit) {
				node.setStyle(RESIZE, NONE);
			}
		},

		/**
	     * Sync the proxy UI with internal values from
	     * <a href="Resize.html#property_info">info</a>.
	     *
	     * @method _syncProxyUI
	     * @protected
	     */
		_syncProxyUI: function() {
			var instance = this,
				info = instance.info,
				activeHandleNode = instance.get(ACTIVE_HANDLE_NODE),
				proxyNode = instance.get(PROXY_NODE),
				cursor = activeHandleNode.getStyle(CURSOR);

			proxyNode.show().setStyle(CURSOR, cursor);

			instance.delegate.dd.set(DRAG_CURSOR, cursor);

			instance._setOffset(proxyNode, info.offsetWidth, info.offsetHeight);

			proxyNode.setXY([ info.left, info.top ]);
		},

		/**
	     * Update <code>instance.changeHeightHandles,
            * instance.changeLeftHandles, instance.changeTopHandles,
            * instance.changeWidthHandles</code> information.
	     *
	     * @method _updateChangeHandleInfo
	     * @private
	     */
		_updateChangeHandleInfo: function(handle) {
			var instance = this;

			instance.changeHeightHandles = REGEX_CHANGE_HEIGHT.test(handle);
			instance.changeLeftHandles = REGEX_CHANGE_LEFT.test(handle);
			instance.changeTopHandles = REGEX_CHANGE_TOP.test(handle);
			instance.changeWidthHandles = REGEX_CHANGE_WIDTH.test(handle);
		},

		/**
	     * Update <a href="Resize.html#property_info">info</a> values (bottom, actXY, left, top, offsetHeight, offsetWidth, right).
	     *
	     * @method _updateInfo
	     * @private
	     */
		_updateInfo: function(event) {
			var instance = this;

			instance.info = instance._getInfo(instance.get(WRAPPER), event);
		},

	    /**
	     * Set the active state of the handles.
	     *
	     * @method _setActiveHandlesUI
	     * @param {boolean} val True to activate the handles, false to deactivate.
	     * @protected
	     */
		_setActiveHandlesUI: function(val) {
			var instance = this,
				activeHandleNode = instance.get(ACTIVE_HANDLE_NODE);

			if (activeHandleNode) {
				if (val) {
					// remove CSS_RESIZE_HANDLE_ACTIVE from all handles before addClass on the active
					instance.eachHandle(
						function(handleEl) {
							handleEl.removeClass(CSS_RESIZE_HANDLE_ACTIVE);
						}
					);

					activeHandleNode.addClass(CSS_RESIZE_HANDLE_ACTIVE);
				}
				else {
					activeHandleNode.removeClass(CSS_RESIZE_HANDLE_ACTIVE);
				}
			}
		},

	    /**
	     * Setter for the handles attribute
	     *
	     * @method _setHandles
	     * @protected
	     * @param {String} val
	     */
		_setHandles: function(val) {
			var handles = [];

			// handles attr accepts both array or string
			if (isArray(val)) {
				handles = val;
			}
			else if (isString(val)) {
				// if the handles attr passed in is an ALL string...
				if (val.toLowerCase() == ALL) {
					handles = ALL_HANDLES;
				}
				// otherwise, split the string to extract the handles
				else {
					Y.each(
						val.split(COMMA),
						function(node, i) {
							var handle = trim(node);

							// if its a valid handle, add it to the handles output
							if (indexOf(ALL_HANDLES, handle) > -1) {
								handles.push(handle);
							}
						}
					);
				}
			}

			return handles;
		},

	    /**
	     * Set the visibility of the handles.
	     *
	     * @method _setHideHandlesUI
	     * @param {boolean} val True to hide the handles, false to show.
	     * @protected
	     */
		_setHideHandlesUI: function(val) {
			var instance = this,
				wrapper = instance.get(WRAPPER);

			if (!instance.get(RESIZING)) {
				if (val) {
					wrapper.addClass(CSS_RESIZE_HIDDEN_HANDLES);
				}
				else {
					wrapper.removeClass(CSS_RESIZE_HIDDEN_HANDLES);
				}
			}
		},

	    /**
	     * Setter for the wrap attribute
	     *
	     * @method _setWrap
	     * @protected
	     * @param {boolean} val
	     */
		_setWrap: function(val) {
			var instance = this,
				node = instance.get(NODE),
				nodeName = node.get(NODE_NAME),
				typeRegex = instance.get(WRAP_TYPES);

			// if nodeName is listed on WRAP_TYPES force use the wrapper
			if (typeRegex.test(nodeName)) {
				val = true;
			}

			return val;
		},

	    /**
	     * Setter for the wrapper attribute
	     *
	     * @method _setWrapper
	     * @protected
	     * @readOnly
	     */
		_setWrapper: function() {
			var instance = this,
				node = instance.get(NODE),
				pNode = node.get(PARENT_NODE),
				// by deafult the wrapper is always the node
				wrapper = node;

			// if the node is listed on the wrapTypes or wrap is set to true, create another wrapper
			if (instance.get(WRAP)) {
				wrapper = Y.Node.create(TPL_WRAP_NODE);

				if (pNode) {
					pNode.insertBefore(wrapper, node);
				}
				// node.placeBefore(wrapper);

				wrapper.append(node);

				instance._copyStyles(node, wrapper);

				// remove positioning of wrapped node, the WRAPPER take care about positioning
				node.setStyles({
					position: STATIC,
					left: 0,
					top: 0
				});
			}

			return wrapper;
		},

	    /**
	     * Default resize:mouseUp handler
	     *
	     * @method _defMouseUpFn
	     * @param {EventFacade} event The Event object
	     * @protected
	     */
		_defMouseUpFn: function(event) {
			var instance = this;

			instance.set(RESIZING, false);
		},

	    /**
	     * Default resize:resize handler
	     *
	     * @method _defResizeFn
	     * @param {EventFacade} event The Event object
	     * @protected
	     */
		_defResizeFn: function(event) {
			var instance = this;

			instance._handleResizeAlignEvent(event.dragEvent);

			// if proxy is true _syncProxyUI instead of _syncUI
			if (instance.get(PROXY)) {
				instance._syncProxyUI();
			}
			else {
				// _syncUI of the wrapper, not using proxy
				instance._syncUI();
			}
		},

		/**
	     * Default resize:align handler
	     *
	     * @method _defResizeAlignFn
	     * @param {EventFacade} event The Event object
	     * @protected
	     */
		_defResizeAlignFn: function(event) {
			var instance = this, info;

			instance.lastInfo = instance.info;

			// update the instance.info values
			instance._updateInfo(event);

			info = instance.info;

			// basic resize calculations
			instance._resize();

			// if Y.Plugin.ResizeConstrained is not plugged, check for min dimension
			if (!instance.con) {
				if (info.offsetHeight <= 15) {
					instance._checkSize(OFFSET_HEIGHT, 15);
				}

				if (info.offsetWidth <= 15) {
					instance._checkSize(OFFSET_WIDTH, 15);
				}
			}
		},

	    /**
	     * Default resize:end handler
	     *
	     * @method _defResizeEndFn
	     * @param {EventFacade} event The Event object
	     * @protected
	     */
		_defResizeEndFn: function(event) {
			var instance = this,
				drag = event.dragEvent.target;

			// reseting actXY from drag when drag end
			drag.actXY = [];

			// if proxy is true, hide it on resize end
			if (instance.get(PROXY)) {
				instance._syncProxyUI();

				instance.get(PROXY_NODE).hide();
			}

			// syncUI when resize end
			instance._syncUI();

			instance.set(ACTIVE_HANDLE, null);
			instance.set(ACTIVE_HANDLE_NODE, null);

			instance._setActiveHandlesUI(false);
		},

	    /**
	     * Default resize:start handler
	     *
	     * @method _defResizeStartFn
	     * @param {EventFacade} event The Event object
	     * @protected
	     */
		_defResizeStartFn: function(event) {
			var instance = this, proxyNode;

			instance.set(RESIZING, true);

			// create an originalInfo information for reference
			instance.originalInfo = instance._getInfo(instance.get(WRAPPER), event);

			instance._updateInfo(event);

			if (instance.get(PROXY)) {
				instance._renderProxy();
			}
		},

	    /**
	     * Fires the resize:mouseUp event.
	     *
	     * @method _handleMouseUpEvent
	     * @param {EventFacade} event resize:mouseUp event facade
	     * @protected
	     */
		_handleMouseUpEvent: function(event) {
			this.fire(EV_MOUSE_UP, { dragEvent: event, info: this.info });
		},

	    /**
	     * Fires the resize:resize event.
	     *
	     * @method _handleResizeEvent
	     * @param {EventFacade} event resize:resize event facade
	     * @protected
	     */
		_handleResizeEvent: function(event) {
			this.fire(EV_RESIZE, { dragEvent: event, info: this.info });
		},

	    /**
	     * Fires the resize:align event.
	     *
	     * @method _handleResizeAlignEvent
	     * @param {EventFacade} event resize:resize event facade
	     * @protected
	     */
		_handleResizeAlignEvent: function(event) {
			this.fire(EV_RESIZE_ALIGN, { dragEvent: event, info: this.info });
		},

	    /**
	     * Fires the resize:end event.
	     *
	     * @method _handleResizeEndEvent
	     * @param {EventFacade} event resize:end event facade
	     * @protected
	     */
		_handleResizeEndEvent: function(event) {
			this.fire(EV_RESIZE_END, { dragEvent: event, info: this.info });
		},

	    /**
	     * Fires the resize:start event.
	     *
	     * @method _handleResizeStartEvent
	     * @param {EventFacade} event resize:start event facade
	     * @protected
	     */
		_handleResizeStartEvent: function(event) {
			this.fire(EV_RESIZE_START, { dragEvent: event, info: this.info });
		},

		/**
		 * Mouseenter event handler for the <a href="Resize.html#config_wrapper">wrapper</a>.
		 *
		 * @method _onWrapperMouseEnter
	     * @param {EventFacade} event
		 * @protected
		 */
		_onWrapperMouseEnter: function(event) {
			var instance = this;

			if (instance.get(AUTO_HIDE)) {
				instance._setHideHandlesUI(false);
			}
		},

		/**
		 * Mouseleave event handler for the <a href="Resize.html#config_wrapper">wrapper</a>.
		 *
		 * @method _onWrapperMouseLeave
	     * @param {EventFacade} event
		 * @protected
		 */
		_onWrapperMouseLeave: function(event) {
			var instance = this;

			if (instance.get(AUTO_HIDE)) {
				instance._setHideHandlesUI(true);
			}
		},

		/**
		 * Mouseover event handler for the handles.
		 *
		 * @method _onHandleMouseEnter
	     * @param {EventFacade} event
		 * @protected
		 */
		_onHandleMouseEnter: function(event) {
			var instance = this,
				node = event.currentTarget,
				handle = instance._extractHandleName(node);

			if (!instance.get(RESIZING)) {
				instance.set(ACTIVE_HANDLE, handle);
				instance.set(ACTIVE_HANDLE_NODE, node);

				instance._setActiveHandlesUI(true);
				instance._updateChangeHandleInfo(handle);
			}
		},

		/**
		 * Mouseout event handler for the handles.
		 *
		 * @method _onHandleMouseLeave
	     * @param {EventFacade} event
		 * @protected
		 */
		_onHandleMouseLeave: function(event) {
			var instance = this;

			if (!instance.get(RESIZING)) {
				instance._setActiveHandlesUI(false);
			}
		}
	}
);



Y.each(ALL_HANDLES, function(handle, i) {
	// creating ATTRS with the handles elements
	Y.Resize.ATTRS[handleAttrName(handle)] = {
		setter: function() {
			return this._buildHandle(handle);
		},
		value: null,
		writeOnce: true
	};
});


}, '@VERSION@' ,{skinnable:true, requires:['base', 'widget', 'substitute', 'event', 'oop', 'dd-drag', 'dd-delegate', 'dd-drop']});
YUI.add('resize-constrain', function(Y) {

var Lang = Y.Lang,
	isBoolean = Lang.isBoolean,
	isNumber = Lang.isNumber,
	isString = Lang.isString,

	isNode = function(v) {
		return (v instanceof Y.Node);
	},

	BORDER_BOTTOM_WIDTH = 'borderBottomWidth',
	BORDER_LEFT_WIDTH = 'borderLeftWidth',
	BORDER_RIGHT_WIDTH = 'borderRightWidth',
	BORDER_TOP_WIDTH = 'borderTopWidth',
	BOTTOM = 'bottom',
	CON = 'con',
	CONSTRAIN = 'constrain',
	HOST = 'host',
	LEFT = 'left',
	MAX_HEIGHT = 'maxHeight',
	MAX_WIDTH = 'maxWidth',
	MIN_HEIGHT = 'minHeight',
	MIN_WIDTH = 'minWidth',
	NODE = 'node',
	OFFSET_HEIGHT = 'offsetHeight',
	OFFSET_WIDTH = 'offsetWidth',
	PRESEVE_RATIO = 'preserveRatio',
	REGION = 'region',
	RESIZE_CONTRAINED = 'resizeConstrained',
	RIGHT = 'right',
	TICK_X = 'tickX',
	TICK_Y = 'tickY',
	TOP = 'top',
	VIEW = 'view',
	VIEWPORT_REGION = 'viewportRegion';

function ResizeConstrained() {
	ResizeConstrained.superclass.constructor.apply(this, arguments);
}

Y.mix(ResizeConstrained, {
	NAME: RESIZE_CONTRAINED,

	NS: CON,

	ATTRS: {
        /**
        * Will attempt to constrain the resize node to the boundaries. Arguments:<br>
        * 'view': Contrain to Viewport<br>
        * '#selector_string': Constrain to this node<br>
        * '{Region Object}': An Object Literal containing a valid region (top, right, bottom, left) of page positions
        *
        * @attribute constrain
        * @type {String/Object/Node}
        */
		constrain: {
			setter: function(v) {
				if (v && (isNode(v) || isString(v) || v.nodeType)) {
					v = Y.one(v);
				}

				return v;
			}
		},

        /**
         * The minimum height of the element
         *
         * @attribute minHeight
         * @default 15
         * @type Number
         */
		minHeight: {
			value: 15,
			validator: isNumber
		},

        /**
         * The minimum width of the element
         *
         * @attribute minWidth
         * @default 15
         * @type Number
         */
		minWidth: {
			value: 15,
			validator: isNumber
		},

        /**
         * The maximum height of the element
         *
         * @attribute maxHeight
         * @default Infinity
         * @type Number
         */
		maxHeight: {
			value: Infinity,
			validator: isNumber
		},

        /**
         * The maximum width of the element
         *
         * @attribute maxWidth
         * @default Infinity
         * @type Number
         */
		maxWidth: {
			value: Infinity,
			validator: isNumber
		},

		/**
         * Maintain the element's ratio when resizing.
         *
         * @attribute preserveRatio
         * @default false
         * @type boolean
         */
		preserveRatio: {
			value: false,
			validator: isBoolean
		},

		/**
         * The number of x ticks to span the resize to.
         *
         * @attribute tickX
         * @default false
         * @type Number | false
         */
		tickX: {
			value: false
		},

        /**
         * The number of y ticks to span the resize to.
         *
         * @attribute tickY
         * @default false
         * @type Number | false
         */
		tickY: {
			value: false
		}
	}
});

Y.extend(ResizeConstrained, Y.Plugin.Base, {
	/**
	 * Cache the border widths of the contrain node if constrain
     * option is being used.
	 *
	 * @property constrainBorderInfo
	 * @default {}
	 * @type Object
	 */
	constrainBorderInfo: null,

	initializer: function() {
		var instance = this,
			host = instance.get(HOST);

		instance.constrainBorderInfo = {
			bottom: 0,
			left: 0,
			right: 0,
			top: 0
		};

		host.delegate.dd.plug(
			Y.Plugin.DDConstrained,
			{
				tickX: instance.get(TICK_X),
				tickY: instance.get(TICK_Y)
			}
		);

		host.after('resize:align', Y.bind(instance._handleResizeAlignEvent, instance));
		host.on('resize:start', Y.bind(instance._handleResizeStartEvent, instance));
	},

	/**
     * Helper method to update the current values on
     * <a href="Resize.html#property_info">info</a> to respect the
     * constrain node.
	 *
	 * @method _checkConstrain
	 * @param {String} axis 'top' or 'left'
	 * @param {String} axisConstrain 'bottom' or 'right'
	 * @param {String} offset 'offsetHeight' or 'offsetWidth'
	 * @protected
	 */
	_checkConstrain: function(axis, axisConstrain, offset) {
		var instance = this,
			point1,
			point1Constrain,
			point2,
			point2Constrain,
			host = instance.get(HOST),
			info = host.info,
			region = instance._getConstrainRegion();

		if (region) {
			point1 = info[axis] + info[offset];
			point1Constrain = region[axisConstrain] - instance.constrainBorderInfo[axisConstrain];

			if (point1 >= point1Constrain) {
				info[offset] -= (point1 - point1Constrain);
			}

			point2 = info[axis];
			point2Constrain = region[axis] + instance.constrainBorderInfo[axis];

			if (point2 <= point2Constrain) {
				info[axis] += (point2Constrain - point2);
				info[offset] -= (point2Constrain - point2);
			}
		}
	},

    /**
     * Update the current values on <a href="Resize.html#property_info">info</a>
     * to respect the maxHeight and minHeight.
     *
     * @method _checkHeight
     * @protected
     */
	_checkHeight: function() {
		var instance = this,
			host = instance.get(HOST),
			info = host.info,
			maxHeight = instance.get(MAX_HEIGHT),
			minHeight = instance.get(MIN_HEIGHT);

		instance._checkConstrain(TOP, BOTTOM, OFFSET_HEIGHT);

		if (info.offsetHeight > maxHeight) {
			host._checkSize(OFFSET_HEIGHT, maxHeight);
		}

		if (info.offsetHeight < minHeight) {
			host._checkSize(OFFSET_HEIGHT, minHeight);
		}
	},

    /**
     * Update the current values on <a href="Resize.html#property_info">info</a>
     * calculating the correct ratio for the other values.
     *
     * @method _checkRatio
     * @protected
     */
	_checkRatio: function() {
		var instance = this,
			host = instance.get(HOST),
			info = host.info,
			originalInfo = host.originalInfo,
			oWidth = originalInfo.offsetWidth,
			oHeight = originalInfo.offsetHeight,
			oTop = originalInfo.top,
			oLeft = originalInfo.left,
			oBottom = originalInfo.bottom,
			oRight = originalInfo.right,
			// wRatio/hRatio functions keep the ratio information always synced with the current info information
			// RETURN: percentage how much width/height has changed from the original width/height
			wRatio = function() {
				return (info.offsetWidth/oWidth);
			},
			hRatio = function() {
				return (info.offsetHeight/oHeight);
			},
			isClosestToHeight = host.changeHeightHandles,
			bottomDiff,
			constrainBorders,
			constrainRegion,
			leftDiff,
			rightDiff,
			topDiff;

		// check whether the resizable node is closest to height or not
		if (instance.get(CONSTRAIN) && host.changeHeightHandles && host.changeWidthHandles) {
			constrainRegion = instance._getConstrainRegion();
			constrainBorders = instance.constrainBorderInfo;
			bottomDiff = (constrainRegion.bottom - constrainBorders.bottom) - oBottom;
			leftDiff = oLeft - (constrainRegion.left + constrainBorders.left);
			rightDiff = (constrainRegion.right - constrainBorders.right) - oRight;
			topDiff = oTop - (constrainRegion.top + constrainBorders.top);

			if (host.changeLeftHandles && host.changeTopHandles) {
				isClosestToHeight = (topDiff < leftDiff);
			}
			else if (host.changeLeftHandles) {
				isClosestToHeight = (bottomDiff < leftDiff);
			}
			else if (host.changeTopHandles) {
				isClosestToHeight = (topDiff < rightDiff);
			}
			else {
				isClosestToHeight = (bottomDiff < rightDiff);
			}
		}

		// when the height of the resizable element touch the border of the constrain first
		// force the offsetWidth to be calculated based on the height ratio
		if (isClosestToHeight) {
			info.offsetWidth = oWidth*hRatio();
			instance._checkWidth();
			info.offsetHeight = oHeight*wRatio();
		}
		else {
			info.offsetHeight = oHeight*wRatio();
			instance._checkHeight();
			info.offsetWidth = oWidth*hRatio();
		}

		// fixing the top on handles which are able to change top
		// the idea here is change the top based on how much the height has changed instead of follow the dy
		if (host.changeTopHandles) {
			info.top = oTop + (oHeight - info.offsetHeight);
		}

		// fixing the left on handles which are able to change left
		// the idea here is change the left based on how much the width has changed instead of follow the dx
		if (host.changeLeftHandles) {
			info.left = oLeft + (oWidth - info.offsetWidth);
		}

		// rounding values to avoid pixel jumpings
		Y.each(info, function(value, key) {
			if (isNumber(value)) {
				info[key] = Math.round(value);
			}
		});
	},

	/**
	 * Check whether the resizable node is inside the constrain region.
	 *
	 * @method _checkRegion
	 * @protected
	 * @return {boolean}
	 */
	_checkRegion: function() {
		var instance = this,
			host = instance.get(HOST),
			region = instance._getConstrainRegion();

		return Y.DOM.inRegion(null, region, true, host.info);
	},

    /**
     * Update the current values on <a href="Resize.html#property_info">info</a>
     * to respect the maxWidth and minWidth.
     *
     * @method _checkWidth
     * @protected
     */
	_checkWidth: function() {
		var instance = this,
			host = instance.get(HOST),
			info = host.info,
			maxWidth = instance.get(MAX_WIDTH),
			minWidth = instance.get(MIN_WIDTH);

		instance._checkConstrain(LEFT, RIGHT, OFFSET_WIDTH);

		if (info.offsetWidth < minWidth) {
			host._checkSize(OFFSET_WIDTH, minWidth);
		}

		if (info.offsetWidth > maxWidth) {
			host._checkSize(OFFSET_WIDTH, maxWidth);
		}
	},

	/**
	 * Get the constrain region based on the <code>constrain</code>
     * attribute.
	 *
	 * @method _getConstrainRegion
	 * @protected
	 * @return {Object Region}
	 */
	_getConstrainRegion: function() {
		var instance = this,
			host = instance.get(HOST),
			node = host.get(NODE),
			constrain = instance.get(CONSTRAIN),
			region = null;

		if (constrain) {
			if (constrain == VIEW) {
				region = node.get(VIEWPORT_REGION);
			}
			else if (isNode(constrain)) {
				region = constrain.get(REGION);
			}
			else {
				region = constrain;
			}
		}

		return region;
	},

	_handleResizeAlignEvent: function(event) {
		var instance = this,
			host = instance.get(HOST);

		// check the max/min height and locking top when these values are reach
		instance._checkHeight();

		// check the max/min width and locking left when these values are reach
		instance._checkWidth();

		// calculating the ratio, for proportionally resizing
		if (instance.get(PRESEVE_RATIO)) {
			instance._checkRatio();
		}

		if (instance.get(CONSTRAIN) && !instance._checkRegion()) {
			host.info = host.lastInfo;
		}
	},

	_handleResizeStartEvent: function(event) {
		var instance = this;

		instance._updateConstrainBorderInfo();
	},

	/**
     * Update <code>instance.constrainBorderInfo</code> values (bottom,
     * left, top, right).
     *
     * @method _updateConstrainBorderInfo
     * @private
     */
	_updateConstrainBorderInfo: function() {
		var instance = this,
			constrain = instance.get(CONSTRAIN),
			getStyle;

		if (isNode(constrain)) {
			getStyle = function(val) {
				return parseFloat(constrain.getStyle(val)) || 0;
			};

			instance.constrainBorderInfo.bottom = getStyle(BORDER_BOTTOM_WIDTH);
			instance.constrainBorderInfo.left = getStyle(BORDER_LEFT_WIDTH);
			instance.constrainBorderInfo.right = getStyle(BORDER_RIGHT_WIDTH);
			instance.constrainBorderInfo.top = getStyle(BORDER_TOP_WIDTH);
		}
	}
});

Y.namespace('Plugin');
Y.Plugin.ResizeConstrained = ResizeConstrained;


}, '@VERSION@' ,{requires:['resize-base', 'plugin'], skinnable:false});


YUI.add('resize', function(Y){}, '@VERSION@' ,{use:['resize-base', 'resize-constrain']});

