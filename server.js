const express = require('express');
const hbs = require('hbs');
const fetch = require("node-fetch");
const request = require("request");
const bodyParser = require('body-parser');
const fs = require("fs");
const gallery = require("./gallery.js");
const weather = require('./weather.js');

const port = process.env.PORT || 8080;

var app = express();
var url ='';

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request, response) => {
    response.render('index.hbs');
});

app.get('/gallery', (request, response) => {
    response.render('gallery.hbs');
});

app.post('/getimages', (request, response) => {
	var user = {
		keyword: request.body.keyword
	};

	gallery.getimages(user.keyword).then((result) => {
		var image1 = result.hits[0].largeImageURL;
		var image2 = result.hits[1].largeImageURL;
		var image3 = result.hits[2].largeImageURL;
		response.render('display.hbs', {
			image1: image1,
			image2: image2,
			image3: image3
		});
	}).catch((error) => {
		console.log('Error:', error);
	});

});

app.post('/getweather', (request, response) => {
	var user = {
		keyword: request.body.keyword
	};

	weather.getAddress(user.keyword).then((result) => {
		var lat = result.results[0].geometry.location.lat;
		var lng = result.results[0].geometry.location.lng;
		return weather.getTemp(lat, lng);
	}).then((result) => {
		if(result.currently.summary == 'Drizzle') {
			var imagesrc = 'data:image/png;base64,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';
		}
		if(result.currently.summary == 'Mostly Cloudy') {
			var imagesrc = 'data:image/png;base64,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'
		}


		response.render('weatherdisplay.hbs', {
			summary: result.currently.summary,
			temperature: user.keyword + ' is currently ' + result.currently.temperature + ' degrees fahrenheight and ',
			imagesrc: imagesrc
		});
	}).catch((error) => {
		console.log('Error:', error);
	});

});


app.get('/weather', (request, response) => {
    response.render('weather.hbs');
});

app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});