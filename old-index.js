/*
https://dev.to/phoinixi/one-way-data-binding-in-vanilla-js-poc-4dj7
https://dev.to/phoinixi/two-way-data-binding-in-vanilla-js-poc-4e06
https://addyosmani.com/resources/essentialjsdesignpatterns/book/#detailnamespacing
*/

//i've got an error during setup (ie compilation) rather than execution in the console. 
//It's a type error. It occurs before I type anything into the console.
//var namespace = namespace || {}; // does not work with const?

const DataBinding = (function(way) {

  let twoWay;
  if (way === 1) {
    twoWay = false;
  } else {
    twoWay = true;
  }

  createState = state => {
    return new Proxy(state, {
      set(target, property, value) {
        target[property] = value;
        render();
        return true;
      }
    });
  };

  render = (state) => {
    let bindings = Array.from(document.querySelectorAll('[data-binding]'));
  
    bindings.forEach(view => {
      let binding = view.dataset.binding;
      if (!state[binding]) {
        throw new ReferenceError(`${binding} is a not a member of the current state`);
      } else {
        document.querySelector(`[data-binding='${binding}']`).innerHTML = state[binding];
        if (twoWay) {
          document.querySelector(`[data-model='${binding}']`).value = state[binding];  
        }
      }
    });
  };

  return createState;

})();

// const state = namespace.createState({
  //   name: 'Nelson MacNulty',
  //   title: 'Front-end Developer'
  // });
  
  //namespace.setupListeners();
  
  
// one way
function loadJSON(callback) {   
  
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'quotes.json', true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return 
      // a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);  
}
  
function autoPlay({ quotes }) {
  window.oneWayState = DataBinding(1);
  let state = window.oneWayState(quotes[0]); //error
  setInterval(() => { 
    const index = Math.floor(Math.random() * Math.floor(quotes.length));
    const { author, quote } = quotes[index];
    console.log(quote);
    Object.assign(state, {  // Object.assign(target, source); state object is mutated, triggering setter.
      author,             // A prop in target is overwritten by a prop in source, 
      quote              // if they have the same key.
    }); 
  }, 2000);
}

function startOneWay() {
  loadJSON(function(response) {
    // Parse JSON string into object
    var actual_JSON = JSON.parse(response);
    //window.state = createState(actual_JSON[0]);
    autoPlay(actual_JSON);
  });
}

// two way
function setupListeners(state) {
  const inputElements = document.querySelectorAll('[data-model]');
  
  inputElements.forEach((el) => {
    const name = el.dataset.model;
    el.addEventListener('keyup', (event) => {
      state[name] = el.value;
      console.log(state);
    });
  });
}

function startTwoWay() {
  window.twoWayState = DataBinding(2);
  let state = window.twoWayState({ name: "NameyNameMe"});
  setupListeners(state);
}