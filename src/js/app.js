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



var Vector2 = require('vector2');
var jsSHA = require("sha.js");
var UI = require("ui");
var ajax = require('ajax');
var util2 = require('util2');
var password = require('password.js');
var moment = require('vendor/moment.js');

var stationList = [];

function getSignature(text)
{
  var shaObj = new jsSHA(text, "TEXT");
  var hmac = shaObj.getHMAC(password(), "TEXT", "SHA-1", "B64");
  return hmac;
}

function getCurrentTime()
{
    /*
    "time": {
        "date": "29.02.2015", "time": "21:28"
    },
    */
    //Sat Feb 28 2015 15:50:44 GMT+0000
    var now = moment();
    now.add(1, "hours");
    return {"date":now.format("DD.MM.YYYY") ,"time":now.format("HH:mm")};
}

////// REQUESTS
// checkname Request

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
    var sig = getSignature(util2.toString(data));
    //  console.log(sig);
    ajax({
        url:'http://api-test.geofox.de/hvvgti/restapp/checkName', 
        type:'json',
        method:'post',
        headers:{
          'Accept': 'application/json',
          //'Content-Type': 'application/json;charset=UTF-8',
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

function CNName(name,result)
{
    var data = {
        "coordinateType": "EPSG_4326",
        "maxList": '1',
        "theName": {
          "name": name,
          "type": "STATION"
        }
    };
    var sig = getSignature(util2.toString(data));
    ajax({
        url:'http://api-test.geofox.de/hvvgti/restapp/checkName', 
        type:'json',
        method:'post',
        headers:{
          'Accept': 'application/json',
        //'Content-Type': 'application/json;charset=UTF-8',
        'geofox-auth-type': "HmacSHA1",
        'geofox-auth-user': "wille",
        'geofox-auth-signature': sig },
        data: data
        },
        function(json) {
            result(json.results[0]);
        },
        function(error) {
            var e = util2.toString(error);
            console.log('CNName failed: ' + e);
        }
    );
}

// listStations Request
function LSRequest()
{
    var results='';
    var data = {
        "language": "de"
    };
    var sig = getSignature(util2.toString(data));
 //   console.log(sig);
 ajax({
    url:'http://api-test.geofox.de/hvvgti/restapp/listStations', 
    type:'json',
    method:'post',
    headers:{
        'Accept': 'application/json',
            //'Content-Type': 'application/json;charset=UTF-8',
            'geofox-auth-type': "HmacSHA1",
            'geofox-auth-user': "wille",
            'geofox-auth-signature': sig },
            data: data
        },
        function(json) {
            stationList = json.stations;
        },
        function(error) {
            var e = util2.toString(error);
            console.log('LSRequest failed: ' + e);
            results = e;
        }
        );
}

//http://api-test.geofox.de/hvvgti/restapp/departureList
/*
{
    "name": "Rosenhof",
    "city": "Ahrensburg",
    "combinedName": "Ahrensburg, Rosenhof",
    "id": "Master:35009",
    "type": "STATION",
}
*/
function DLRequest(station)
{
    console.log(util2.toString(station));
/* 
json{"returnCode":"OK","time":{"date":"28.02.2015","time":"16:36"},"departures":[{"line":{"name":"181","direction":"U S Sternschanze",
"type":{"simpleType":"BUS","shortInfo":"Bus","longInfo":"Niederflur Stadtbus"},"id":"HHA-B:181_HHA-B"},"timeOffset":2,"serviceId":53379,"station":{"combinedName":"Informatikum","id":"Master:83006"}},
*/
    var data = {
        "version": 16,
        "station": station,
        "time": getCurrentTime(),
        "maxList": 10,
        "maxTimeOffset": 200
    };
    var sig = getSignature(util2.toString(data));
    console.log(util2.toString(data));
    console.log("starting request");
    ajax({
        url:'http://api-test.geofox.de/hvvgti/restapp/departureList', 
        type:'json',
        method:'post',
        headers:{
            'Accept': 'application/json',
            //'Content-Type': 'application/json;charset=UTF-8',
            'geofox-auth-type': "HmacSHA1",
            'geofox-auth-user': "wille",
            'geofox-auth-signature': sig },
        data: data
        },
        function(json) {
            //var RQCard = new UI.Card();
            var items = [];
            //console.log("json "+util2.toString(json));
            //console.log("json dep "+util2.toString(json.departures[0]));
            for (var i=0; i<json.departures.length; i++)
            {
                var dep = json.departures[i];
                //console.log("dep "+util2.toString(dep));
                //console.log("dep "+dep);
                var item = {
                    title: dep.line.name + " in " + dep.timeOffset + "min",
                    subtitle: dep.line.direction
                };
                //console.log(util2.toString("item"+item));
                items.push(item);
            }
            var rMenu = new UI.Menu({
                sections: [{
                    title: station.name,
                    items: items
                }]
            });
            /*
            RQCard.title("LSRequest");
            //console.log(util2.toString(json));
            RQCard.body(json.departures[0].line.name);
            RQCard.show();
            */
            rMenu.show();
        },
        function(error) {
            var e = util2.toString(error);
            console.log('DLRequest failed: ' + e);
        });
}


var mainMenu = new UI.Menu({
  sections: [{
    //title: 'First section',
    items: [{
      title: 'First Item',
      subtitle: 'Some subtitle',
      icon: 'images/item_icon.png'
  }, {
      title: 'Second item'
  }]
}]
});

mainMenu.show();
//test departure
function deptest()
{
    CNName('Informatikum',DLRequest);
}

deptest();

////// UI
// 
