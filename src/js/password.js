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