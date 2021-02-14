/*
https://dev.to/phoinixi/one-way-data-binding-in-vanilla-js-poc-4dj7
https://dev.to/phoinixi/two-way-data-binding-in-vanilla-js-poc-4e06
*/

function Binder(state, render) {
  return new Binder.init(state, render);
}

Binder.init = function(state, render) {
  this._state = state || {};
  this.render = render;
}

Binder.init.prototype = Binder.prototype;

Object.defineProperty(Binder.prototype, "state", {
  configurable: false,
  enumerable: true,
  get: function() {
    return this._state;
  },
  set: function(val) {
    this._state = val;
    this.render();
  }
});

function loadJSON() {
  fetch('quotes.json')
  .then(res => res.json())
  .then(data => {
    console.log(data);
    setupIntervalListener(data);
  })
  .catch(err => console.err(err));
}

function setupIntervalListener({ quotes }) {
  setInterval(() => { 
    const index = Math.floor(Math.random() * Math.floor(quotes.length));
    const { author, quote } = quotes[index];
    console.log(quote);
    oneWay.state = { author, quote };
  }, 2000);
}

function setupListeners() {
  const inputElements = document.querySelectorAll('[data-model]');
  
  inputElements.forEach((el) => {
    const name = el.dataset.model;
    el.addEventListener('keyup', (event) => {
      let obj = twoWay.state;
      obj[name] = el.value;
      twoWay.state = obj;
      console.log(twoWay.state);
    });
  });
}

const renderOneWay = () => {
  let state = oneWay.state;
  let div = document.querySelector('#oneway'); // only look at the data attrs in this div
  const bindings = Array.from(div.querySelectorAll('[data-binding]')).map(
    e => e.dataset.binding
  );
  bindings.forEach(binding => {
    if (state[binding]) {
      document.querySelector(`[data-binding='${binding}']`).innerHTML = state[binding];
    } else {
      throw new ReferenceError(`${binding} is a not a member of the current state`);
    }
  });
};

const renderTwoWay = () => {
  let state = twoWay.state;
  let div = document.querySelector('#twoway');
  let views = Array.from(div.querySelectorAll('[data-binding]'));

  views.forEach(view => {
    let val = view.dataset.binding;
    document.querySelector(`[data-binding='${val}']`).innerHTML = state[val];
    document.querySelector(`[data-model='${val}']`).value = state[val];
  });
};

let oneWay = new Binder({ author: 'Bob', quote: 'Hahaha!' }, renderOneWay);
let twoWay = new Binder({ name: 'Bob', title: 'Administrator'}, renderTwoWay);

loadJSON();
setupListeners();
renderOneWay();
renderTwoWay();