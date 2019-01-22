
!function() {

	function simulate(element, eventName)
	{

		function extend(destination, source) {
			for (let property in source)
			destination[property] = source[property];
			return destination;
		}

		let eventMatchers = {
			'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
			'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
		};

		let defaultOptions = {
			pointerX: 0,
			pointerY: 0,
			button: 0,
			ctrlKey: false,
			altKey: false,
			shiftKey: false,
			metaKey: false,
			bubbles: true,
			cancelable: true
		};

		let options = extend(defaultOptions, arguments[2] || {});
		let oEvent, eventType = null;

		for (let name in eventMatchers)
		{
			if (eventMatchers[name].test(eventName)) { eventType = name; break; }
		}

		if (!eventType)
			throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

		if (document.createEvent)
		{
			oEvent = document.createEvent(eventType);
			if (eventType == 'HTMLEvents')
			{
				oEvent.initEvent(eventName, options.bubbles, options.cancelable);
			}
			else
			{
				oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
				options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
				options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
			}
			element.dispatchEvent(oEvent);
		}
		else
		{
			options.clientX = options.pointerX;
			options.clientY = options.pointerY;
			let evt = document.createEventObject();
			oEvent = extend(evt, options);
			element.fireEvent('on' + eventName, oEvent);
		}
		return element;
	}

	function randomItem(items) {
		return items[Math.floor(Math.random() * items.length)];
	}

	function createUi(ui, parent) {
		
		for(let k in ui) {
			let item = ui[k];
			let [n,...classes] = k.split('.');
			let e = document.createElement(n);
			parent.appendChild(e);
			classes.forEach((c) => e.classList.add(c));
			if (item.css) {
				for (let c in item.css) {
					e.style[c] = item.css[c];
				}
			}
			if (item.text) {
				e.innerText = item.text;
			}
			if (n === 'select') {
				item.options.forEach(option => {
					let op = document.createElement('option'); 
					op.value = option.value;
					op.innerText = option.text;
					e.appendChild(op);
				});
			}
			if (item.children) {
				createUi(item.children, e);
			}
		}
	}

	let ui = {
		'div.panel': {
			css: {
				position: 'fixed',
				top: 0,
				right: 0,
				zIndex: 10000
			},
			children: {
				'select.delay' : {
					options: [
						{value: 1, text: '1s'},
						{value: 2, text: '2s'},
						{value: 3, text: '3s'},
						{value: 4, text: '4s'},
						{value: 5, text: '5s'}
					]
				},
				'button.prev' : {
					text: '◀'
				},
				'button.scroll': {
					text: '▲'
				},
				'button.next': {
					text: '▶'
				},
				'button.stop': {
					text: '■'
				},
				'button.rand': {
					text: 'R'
				}
			}
		}
	};

	createUi(ui,document.body);

	let interval = null;
	
	let delay = () => +document.querySelector('select.delay').value * 1000;
	
	let setClickInterval = (selector) => {
		clearInterval(interval);
		interval = setInterval(() => {
			let wrap = document.querySelector(selector);
			if (wrap) {
				wrap.click();
			} else {
				console.log(`${selector} not found`);
				document.querySelector('.im_message_photo_thumb').click();
			}
		},delay());
	};
	
	let setScrollInterval = (selector) => {
		clearInterval(interval);
		interval = setInterval(()=>{
			let wrap = document.querySelector(selector);
			if (wrap) {
				wrap.scroll(0,0);
			} else {
				console.log(`${selector} not found`);
			}
		},delay());
	};

	let handlers = {
		prev: () => setClickInterval('.modal_prev_wrap'),
		next: () => setClickInterval('.modal_next_wrap'),
		scroll: () => setScrollInterval('.im_history_scrollable_wrap'),
		rand: () => simulate(randomItem(document.querySelectorAll('.im_dialog')),"mousedown"),
		stop: () => {
			clearInterval(interval);
			interval = null;
		}
	};

	document.addEventListener('click', (e) => {
		let target = e.target;
		if (target.tagName !== 'BUTTON') {
			return;	
		}
		for(let key in handlers) {
			if (target.classList.contains(key)) {
				handlers[key]();
				e.preventDefault();
				return;
			}
		}
	});

}();
