var app = require('express')(),
	express = require('express'),
	swig = require('swig'),
	path = require('path'),
	fs = require('fs'),
	jsf = require('json-schema-faker'),
	damMeasuresSchema = require('./damMeasuresSchema.js');

app.use(express.static('./public'))
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', false);
swig.setDefaults({ cache: false });

app.get('/', function (req, res) {
  res.render('index', { authors: ['Paul', 'Jim', 'Jane'] });
});

app.get('/api/damStats', function (req, res) {
	var data = fs.readFileSync('./damSensorData.json');
	res.setHeader('Content-Type', 'application/json');
	res.send(data);
});

jsf.option({
  useDefaultValue: true,
});

function logSensorData() {
    jsf.resolve(damMeasuresSchema).then(function(result) {
        fs.writeFile("damSensorData.json", JSON.stringify(result), function(err) {
            if (err)
                console.log(err)
        });
    });
}
setInterval(logSensorData, 1500);

app.listen(3000);
console.log('Application Started on http://localhost:3000/');
