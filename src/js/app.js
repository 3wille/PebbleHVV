/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

/* 
http://api-test.geofox.de/hvvgti/restapp/checkName
http://api-test.geofox.de/hvvgti/restapp/getRoute
http://api-test.geofox.de/hvvgti/restapp/departureList
http://api-test.geofox.de/hvvgti/restapp/getTariff
http://api-test.geofox.de/hvvgti/restapp/departureCourse
http://api-test.geofox.de/hvvgti/restapp/listStations
http://api-test.geofox.de/hvvgti/restapp/listLines
http://api-test.geofox.de/hvvgti/restapp/getAnnouncements
*/

var jsSHA = require("sha.js");
var UI = require("ui");
var ajax = require('ajax');
var util2 = require('util2');
var password = require('password.js');

function getSignature(text)
{
  var shaObj = new jsSHA(text, "TEXT");
  var hmac = shaObj.getHMAC(password(), "TEXT", "SHA-1", "B64");
  return hmac;
}

var card = new UI.Card();

function CNRequest()
{
  var data = {
        "coordinateType": "EPSG_4326",
        "maxList": '1',
        "theName": {
          "name": "Altona",
          "type": "STATION"
        }
      };
  var sig = getSig(util2.toString(data));
  console.log(sig);
  ajax({
    url:'http://api-test.geofox.de/hvvgti/restapp/checkName', 
    type:'json',
    method:'post',
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      'geofox-auth-type': "HmacSHA1",
      'geofox-auth-user': "wille",
      'geofox-auth-signature': sig },
      data: data
  },
  function(json) {
    // Data is supplied here
    card.title(json.returnCode);
    console.log(util2.toString(json));
    card.body(json.results[0].name);
    return json;
  },
  function(error) {
    var e = util2.toString(error);
    console.log('Ajax failed: ' + e);
  }
);
}

// listStations Request
function LSRequest()
{

    var data = {
        "language": "de",
        "version": 16,
        "coordinateType": "EPSG_4326",
        "filterEquivalent": "true"
    };
    var sig = getSig(util2.toString(data));
    console.log(sig);
    return ajax({
        url:'http://api-test.geofox.de/hvvgti/restapp/listStations', 
        type:'json',
        method:'post',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'geofox-auth-type': "HmacSHA1",
            'geofox-auth-user': "wille",
            'geofox-auth-signature': sig },
        data: data
        },
        function(json) {
            // Data is supplied here
            card.title("LSRequest");
            console.log(util2.toString(json));
            card.body(json.results[0].name);
            return json;
        },
        function(error) {
            var e = util2.toString(error);
            console.log('Ajax failed: ' + e);
        }
    );
}

