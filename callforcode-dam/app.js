var app = require('express')(),
    express = require('express'),
    swig = require('swig'),
    path = require('path'),
    fs = require('fs'),
    jsf = require('json-schema-faker'),
    damMeasuresSchema = require('./damMeasuresSchema.js'),
    math = require('mathjs');
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
var hostname = appEnv.host;
var port = appEnv.port;

app.use(express.static('./public'))
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', false);
swig.setDefaults({ cache: false });

jsf.option({
  useDefaultValue: true,
});

/* Routes */
app.get('/', function (req, res) {
  res.render('index', { authors: ['Paul', 'Jim', 'Jane'] });
});

app.get('/api/damSensorData', function (req, res) {
    var data = fs.readFileSync('./public/data/damSensorData.json');
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
});

app.get('/api/dams', function (req, res) {
    var data = fs.readFileSync('./public/data/dams.json');
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
});

app.get('/api/damCalc', function (req, res) {

    var data = fs.readFileSync('./public/data/damSensorData.json');
    var obj = JSON.parse(data);
    var response = [];

    for(var i = 0 ; i < 10 ; i++) {
        var inflowRate = obj.damMeasures[i].inflowRate
        var inflowRate = obj.damMeasures[i].inflowRate
        var outflowRate = obj.damMeasures[i].outflowRate
        var seepageRate = obj.damMeasures[i].seepageRate
        var evapRate = obj.damMeasures[i].evaporationRate
        var predRainfall = obj.damMeasures[i].predictedRainfall
        var actRainfall = obj.damMeasures[i].activeRainfall
        var waterLevel = obj.damMeasures[i].currentWaterLevel
        var lowerLength = 3300
        var upperLength = 4800
        var surface = 12080

        var currVol = (12080 * 1200)/ 3
        var greenVol = math.chain(12080).multiply(1350).divide(3).done()
        var orangeVol = math.chain(12080).multiply(1400).divide(3).done()
        var redVol = math.chain(12080).multiply(1430).divide(3).done()
        var daysToGreen = math.ceil(((greenVol - currVol) / (inflowRate - outflowRate - seepageRate - evapRate + predRainfall)) / 24)
        var daysToOrange = math.ceil(((orangeVol - currVol) / (inflowRate - outflowRate - seepageRate - evapRate + predRainfall)) / 24)
        var daysToRed = math.ceil(((redVol - currVol) / (inflowRate - outflowRate - seepageRate - evapRate + predRainfall)) / 24)

        var result = {
            id: i,
            orangeLevel: daysToOrange,
            greenLevel: daysToRed,
            redLevel: daysToRed,
            currentlevel: waterLevel
        };
        response.push(result);
    }

    res.send(response);

});

/* Generate Dam Stats */
function logSensorData() {
    jsf.resolve(damMeasuresSchema).then(function(result) {
        fs.writeFile("./public/data/damSensorData.json", JSON.stringify(result), function(err) {
            if (err)
                console.log(err)
        });
    });
}
setInterval(logSensorData, 9000);

/* Generate Calculations */
function calculateDamStats() {
    fs.writeFile("./public/data/damStats.json", JSON.stringify(result), function(err) {
        if (err)
            console.log(err)
     });
}

app.listen(port);
console.log('Application Started on http://localhost:3000/');
