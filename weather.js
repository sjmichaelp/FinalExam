const request = require('request');
const gmaps = require('./gmaps');

var getAddress = (address) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if(address){
				request({
			        url: 'https://maps.googleapis.com/maps/api/geocode/json' + '?address=' + encodeURIComponent(address) + '&key=AIzaSyC2vjWxCmGpF5fRSDewmg7BGecZrqN0hiU',
			        json: true
			    }, (error, response, body) => {
			    		resolve(body);
    				});
    		};
		}, 200);
	});
};

var getTemp = (lat, lng) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if(lat){
				request({
       	 			url: 'https://api.darksky.net/forecast/84295bc4cdad5c0a9f5c99add5f27c9e/' + lat + ',' + lng,
					json: true
			    }, (error, response, body) => {
			    	resolve(body);
    			});
    		};
		}, 200);
	});
};


module.exports = {
	getTemp: getTemp,
	getAddress: getAddress
}