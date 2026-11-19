const { EventEmitter } = require('events');

class DOMEvent {
  constructor(type, bubbles = false) {
    this.type = type;
    this.bubbles = bubbles;
    this.stopped = false;
  }
  stopPropagation() { this.stopped = true; }
}

class DOMNode {
  constructor(tag, parent = null) {
    this.tag = tag.toUpperCase();
    this.parent = parent;
    this.emitter = new EventEmitter();
    this.map = new WeakMap();
  }

  addEventListener(type, fn, once = false) {
    const wrap = (e) => {
      if (!e.stopped) { e.currentTarget = this; fn.call(this, e); }
    };
    this.map.set(fn, wrap);
    this.emitter[once ? 'once' : 'on'](type, wrap);
  }

  removeEventListener(type, fn) {
    if (this.map.has(fn)) {
      this.emitter.off(type, this.map.get(fn));
      this.map.delete(fn);
    }
  }

  dispatchEvent(e) {
    e.target = e.target || this;
    for (let cur = this; cur && !e.stopped; cur = e.bubbles ? cur.parent : null) {
      this.emitter === cur.emitter && cur.emitter.emit(e.type, e);
    }
  }
}

// --- Demo ---
const div = new DOMNode('div');
const btn = new DOMNode('button', div);

const onBtn = (e) => console.log(`[${e.currentTarget.tag}] "${e.type}" from <${e.target.tag.toLowerCase()}>`);
const onDiv = (e) => console.log(`[${e.currentTarget.tag}] bubbled "${e.type}" from <${e.target.tag.toLowerCase()}>`);

btn.addEventListener('click', onBtn);
div.addEventListener('click', onDiv);

console.log('1. Normal bubbling click:');
btn.dispatchEvent(new DOMEvent('click', true));

console.log('\n2. Click with stopPropagation on button:');
btn.addEventListener('click', (e) => e.stopPropagation(), true);
btn.dispatchEvent(new DOMEvent('click', true));

console.log('\n3. After removeEventListener on button:');
btn.removeEventListener('click', onBtn);
btn.dispatchEvent(new DOMEvent('click', true));