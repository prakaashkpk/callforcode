/*
Front end app.js
*/
/*$(document).ready(function() {
    $.ajax({
        url: "./data/damSensorData.json" // TODO: Replace hostname // Prakash
    }).then(function(data) {
        console.log('data ' + JSON.stringify(data));

        obj = JSON.parse(JSON.stringify(data));
        console.log(obj.damMeasures[1])
        var inflowRate = obj.damMeasures[1].inflowRate
        var inflowRate = obj.damMeasures[1].inflowRate
        var outflowRate = obj.damMeasures[1].outflowRate
        var seepageRate = obj.damMeasures[1].seepageRate
        var evapRate = obj.damMeasures[1].evaporationRate
        var predRainfall = obj.damMeasures[1].predictedRainfall
        var actRainfall = obj.damMeasures[1].activeRainfall
        var waterLevel = obj.damMeasures[1].currentWaterLevel
        var lowerLength = 3300
        var upperLength = 4800
        var surface = 12080
        var volume = "[upperLength + lowerLength + (√ (upperLength x lowerlength)] x Depth ÷ 3"
        var orangeVol = math.chain(12080).multiply(1400).divide(3).done()
        const greenVol = math.chain(12080).multiply(1410).divide(3).done()
        var redVol = math.chain(12080).multiply(1420).divide(3).done()
        var daysToGreen = (greenVol / (inflowRate - outflowRate - seepageRate - evapRate + predRainfall)) / 24
        var daysToOrange = (orangeVol / (inflowRate - outflowRate - seepageRate - evapRate + predRainfall)) / 24
        var daysToRed = (redVol / (inflowRate - outflowRate - seepageRate - evapRate + predRainfall)) / 24
        console.log('days to green: ' + daysToGreen)
        console.log('days to orange: ' + daysToOrange)
        console.log('days to Red: ' + daysToRed)

    });
});
*/


$(document).ready(function() {

    var latitude = 9.529171;
    var longtitude = 77.14426;
    var access_token = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';


    var LeafIcon = L.Icon.extend({
        options: {
            shadowUrl: '',
            iconSize: [48, 48],
            shadowSize: [50, 64],
            iconAnchor: [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor: [-3, -76]
        }
    });

    var greenIcon = new LeafIcon({
            iconUrl: './images/location-green.png'
        }),
        redIcon = new LeafIcon({
            iconUrl: './images/location-red.png'
        }),
        orangeIcon = new LeafIcon({
            iconUrl: './images/location-green.png'
        });


    var mymap = L.map('mapid').setView([9.8434, 76.9763], 9);

    document.getElementById("mapid").style.width = (screen.width - 20 + 'px');
    document.getElementById("mapid").style.height = (screen.height - 95 + 'px');

    // Array of all the dams
    var dams = [];
    var stats = [];

    // Get the Dam details
    // $.get('./data/dams.json', function(data) {
    // }).error(function (data, error) {

    updateMap();
    setInterval(updateMap, 9000);
    function updateMap() {
        console.log('updateMap');
        $.ajax({
          url: 'http://localhost:3000/api/damCalc',
          method: "GET",
          success: function (data) {
              // console.log("DamCalc " + JSON.stringify(data));
              updateLoc(data);
          }
      });

        function updateLoc(dd) {
            stats = dd;
            // console.log("updateLoc: " + JSON.stringify(stats[1]));

            $.ajax({
              url: 'http://localhost:3000/api/dams',
              method: "GET",
              success: function(data) {
                dams = data;

                console.log("dams.length " + dams.length);
                for (i = 0; i < dams.length; i++) {
                    var dam = dams[i];
                    var stat = stats[i];
                    var icon = greenIcon;
                    var info = "";

                    // var icon = i == 2 ? redIcon : greenIcon;

                    // Calculation
                    // {"id":1,"orangeLevel":197139,"greenLevel":202173,"redLevel":202173,"currentlevel":225}
                    if(stat !== undefined) {
                        console.log('stat is undefined');
                        var min = Math.min(stat.greenLevel, stat.orangeLevel, stat.redLevel);
                        console.log('i: ' + i + ', ' + JSON.stringify(stat));
                        if(min == stat.greenLevel) {
                            icon = greenIcon;
                            info = stat.greenLevel;
                        } else if(min == stat.orangeLevel) {
                            icon = orangeIcon;
                            info = stat.greenLevel;
                        } else {
                            icon = redIcon;
                            info = stat.greenLevel;
                        }
                    }

                    var latitude = dam.damLatitude;
                    var longtitude = dam.damLongitude;
                    console.log('lat, long: ' + latitude + ', ' + longtitude);

                    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + access_token, {
                        maxZoom: 18,
                        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                        id: 'mapbox.streets'
                    }).addTo(mymap);

                    L.marker([latitude, longtitude], {
                        icon: icon
                    }).addTo(mymap).bindPopup("<h4>Dam " + dam.damname + "</h4> Current Level: " + stat.currentlevel + "<br\> Days Left: " + info + '<br\> ').openPopup();
                }
              },
              dataType: "json",
              error: function (d, e) {
                  console.log("ERROR " + d.responseText);
              }
            });

        }
        

    }


});
