'use strict';

app.filter('capitalize', function() {
  return function(input) {
    if (input && input !== null) {
      input = input.toLowerCase();
      return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
  };
});