# PebbleHVV
This is an app implementing the HVV API on Pebble Smartwatch using Pebble.js

Until I get to obfuscate some code, you'll need your own password to actually run this. You can get it by sending mail to HVV. After that, save below code as password.js

```javascript
var password = (function(){ 
  var password = function(){
    return ""; // fill in password here
  };
  if (typeof module !== 'undefined') {
    module.exports = password;
  } else {
    window.ajax = password;
  }

  return password;
})();
```