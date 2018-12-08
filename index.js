
!function() {
	
	function createUi(ui, parent) {
		for(let k in ui) {
			let item = ui[k];
			let [n,...classes] = k.split('.');
			let e = document.createElement(n);
			parent.appendChild(e);
			classes.forEach( c => e.classList.add(c) );
			if (item.css) {
				for (let c in item.css) {
					e.style[c] = item.css[c];
				}
			}
			if (item.innerText) {
				e.innerText = item.innerText;
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
				zIndex: 1000
			},
			children: {
				'button.scroll': {
					innerText: 'scroll'
				},
				'button.stop': {
					innerText: 'stop'
				}
			}
		}
	};

	createUi(ui,document.body);

	let interval = null;

	let handlers = {
		scroll: () => {
			clearInterval(interval);
			interval = setInterval(()=>{
				let wrap = document.querySelector('.im_history_scrollable_wrap');
				if (wrap) {
					wrap.scroll(0,0);
				} else {
					console.log('.im_history_scrollable_wrap not found');
				}
			},2000);
		},
		stop: () => {
			clearInterval(interval);
			interval = null;
		}
	};

	document.addEventListener('click', (e) => {

		let target = e.target;
		
		if (target.tagName == 'BUTTON') {
			
			for(var key in handlers) {
				if (target.classList.contains(key)) {
					handlers[key]();
					e.preventDefault();
					return;
				}
			}
			
		}
	});

}();
