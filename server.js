const express = require('express');
const hbs = require('hbs');
const request = require('request');

var bodyParser = require('body-parser');
var fs = require('fs');
var hompage = require('./homepage.js');
var app = express();
var port = process.env.PORT || 8080;
// var urlencodedParser = bodyParser.urlencoded({ extended: false })


hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('test_function', (text) => {
	return text.toUpperCase();
});

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:true
}));

app.get('/', (request, response) => {
	response.render('homepage.hbs', {
		name: 'Alexander',
		welcomeMessage: 'This should be caps'
	});
});

app.post('/about', (req, response) => {
	var location = req.body.locationName;
	var resultArr = [];
	console.log(location);

	if (fs.existsSync('test.json')) {
		var readFile = fs.readFileSync('test.json');
	} else {
		var readFile = ''
	}

	if (readFile !== ''){
		receivedData = JSON.parse(readFile);
		receivedData.push(location);
		var locString = JSON.stringify(receivedData);
		fs.writeFileSync('test.json', locString);
	}else{
		resultArr.push(location);
		arrJson = JSON.stringify(resultArr);
		fs.writeFileSync('test.json', arrJson);
	}

	var geocode = (address) => {
    // return new Promise
    return new Promise((resolve, reject) => {
    	request({
    		url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBdZyWZ9E-pTqDt7hO4rAauB7BDeOPaAJM`,
    		json: true
    	}, (error, response, body) => {
    		if (error) {
    			reject('Cannot connect to Google Maps');
    		} else if (body.status === 'ZERO_RESULTS'){
    			reject('Cannot find requested address');
    		} else if (body.status === 'OK') {
    			resolve({
    				lat: body.results[0].geometry.location.lat,
    				lng: body.results[0].geometry.location.lng
    			});
    		}
    	})
    })
	};

	var weather = (lat, lng) => {
		return new Promise ((resolve, reject) => {
			request({
				url: 'https://api.darksky.net/forecast/3ed3bebeb1f6b38a497bdca6579a809c/' + lat + ',' + lng,
				json: true
			}, (error, response, body) => {
				if (error) {
					reject('Rejected from Darksky');
				}else{
					resolve({
						temperature: body.currently.temperature,
						weather: body.currently.summary
					});

				}
			})
		})
	}

	geocode(location).then((result) => {
	    console.log(result);
	    return weather(result.lat, result.lng);
	}, (errorMessage) => {
	    console.log(errorMessage);
	}).then((result) => {
		response.render('about.hbs', {
			name: 'Larry',
			results: `The temperature in ${location} is ${result.temperature} and it is ${result.weather}`
		})
	}, (error) => {
		console.log(error);
	})
	

	// response.render('about.hbs', {
	// 	name: 'Alexander',
	// 	welcomeMessage: 'This should be caps',
	// 	inputLocation: location
	// })
})

app.get('/about', (request, response) => {
	response.render('about.hbs', {
		name: 'About Page'
	});
});

app.listen(port, () => {
	console.log('Server is up on port 8080');
});