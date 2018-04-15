/* global chrome */

// Current options extend defaults
let defaultOptions = {
  nusach: 'sf'
};
let options;

// Load options from storage
const load = function () {
  return new Promise((resolve) => {
    chrome.storage.sync.get('options', (storage) => {
      // Get and save options
      options = storage.options || defaultOptions;

      // Show and resolve
      show(options);
      resolve(options);
    });
  });
};

// Save options to storage
const save = function (object) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({
      'options': object
    }, resolve);
  });
};

// Show options
const show = function (options) {
  for (const key in options) {
    if (options.hasOwnProperty(key)) {
      switch (typeof (options[key])) {
        case ('boolean'): {
          document.getElementById(key).checked = options[key];
          break;
        }
        case ('string'): {
          document.getElementById(key).value = options[key];
          break;
        }
      }
    }
  }
};

// Reset to defaults
const reset = function () {
  save(defaultOptions)
    .then(() => {
      show(defaultOptions);
    });
};

// On change, save
document.addEventListener('change', (event) => {
  switch (event.target.type) {
    case ('checkbox'): {
      options[event.target.id] = event.target.checked;
      break;
    }
    case ('select-one'): {
      options[event.target.id] = event.target.value;
      break;
    }
  }

  save(options);
});

// On reset button click
document.addEventListener('click', (event) => {
  if (event.target.id === 'reset-options') {
    reset();
  }
});

load();
