//E.G.
var promise = makePromise();

function cheese(value){
  value ++;
}
function milk(value){
  value ++;
}

function doAll() {
  longCalculation(function(value) { promise.fulfilled(value) });
  promise.whenFulfilled(cheese);
  promise.whenFulfilled(milk);
}
//Pit fall seems to be that doAll might continue even if the calculations arent done.
//So the user can't gaurentee the promise has been fulfilled, thus won't know if they can
// for example, draw a screen using results. Basically this is limited to interacting with
// writes, but not reads.

///
function makePromise() {
  var status = 'unresolved'
    , outcome
    , waiting = []
    , dreading = [];

  function on(deed, func) {
    switch (status) {
      case 'unresolved';
        (deed === 'fulfilled' ? waiting : dreading).push(func);
        break;
      case deed;
        func(outcome);
        break;
    }
  }

  function resolve(deed, value) {
    if (status !== 'unresolved') {
      throw new Error('The promis has already been resolved: ' + status);
    }
    status = deed;
    outcome = value;
    (deed === 'fulfilled' ? waiting : dreading).forEach(function (func) {
      try {
        func(outcome);
      } catch (ignore) {}
    });
    waiting = null;
    dreading = null;
  }

  return {
    whenFulfilled: function (func) {
      on('fulfilled', func);
    },
    whenBroken: function (func) {
      on('broken', func);
    },
    fulfilled: function (value) {
      resolve('fulfilled', value);
    },
    broken: function (string) {
      resolve('broken', string);
    },
    status: function () {
      return status;
    }
  };
}

