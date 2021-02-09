/*
https://dev.to/phoinixi/one-way-data-binding-in-vanilla-js-poc-4dj7
https://dev.to/phoinixi/two-way-data-binding-in-vanilla-js-poc-4e06
*/

createState = (state, render) => {
  return new Proxy(state, {
    set(target, property, value) {
      target[property] = value;
      render();
      return true;
    }
  });
};

const loadJSON = () => {   
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'quotes.json', true);
  xobj.onreadystatechange = () => {
    if (xobj.readyState == 4 && xobj.status == "200") {
      let data = JSON.parse(xobj.responseText);
      setupIntervalListener(data);
    }
  };
  xobj.send(null);  
}

function setupIntervalListener({ quotes }) {
  let state = states.oneWay;
  setInterval(() => { 
    const index = Math.floor(Math.random() * Math.floor(quotes.length));
    const { author, quote } = quotes[index];
    console.log(quote);
    state.author = author;
    state.quote = quote;
  }, 2000);

}

function setupListeners() {
  let state = states.twoWay;
  const inputElements = document.querySelectorAll('[data-model]');
  
  inputElements.forEach((el) => {
    const name = el.dataset.model;
    el.addEventListener('keyup', (event) => {
      state[name] = el.value;
      console.log(state);
    });
  });
}

const renderOneWay = () => {
  let state = states.oneWay;
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
  let state = states.twoWay;
  let div = document.querySelector('#twoway');
  let views = Array.from(div.querySelectorAll('[data-binding]'));

  views.forEach(view => {
    let val = view.dataset.binding;
    document.querySelector(`[data-binding='${val}']`).innerHTML = state[val];
    document.querySelector(`[data-model='${val}']`).value = state[val];
  });
};

let states = {};
states.oneWay = createState({ author: 'Bob', quote: 'Hahaha!' }, renderOneWay);
states.twoWay = createState({ name: 'Bob', title: 'Administrator'}, renderTwoWay);

loadJSON();
setupListeners();
renderOneWay();
renderTwoWay();