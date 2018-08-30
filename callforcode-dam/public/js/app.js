/*
Front end app.js
*/

$(document).ready(function() {
    $.ajax({
        url: "http://localhost:3000/api/damStats" // TODO: Replace hostname // Prakash
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

