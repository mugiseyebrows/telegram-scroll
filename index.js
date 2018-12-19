
!function() {
	
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
					var op = document.createElement('option'); 
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
						{value: 0.5, text: '0.5s'},
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
		for(var key in handlers) {
			if (target.classList.contains(key)) {
				handlers[key]();
				e.preventDefault();
				return;
			}
		}
	});

}();
