const request = require('request');

var getimages = (keyword) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if(keyword){
				request({
					url: `https://pixabay.com/api/?key=10969230-27fc03044db105d9ba3b25d31&q=${encodeURIComponent(keyword)}&image_type=photo&pretty=true`,
					json: true
			    }, (error, response, body) => {
			    	resolve(body);
    			});
    		};
		}, 200);
	});
};

module.exports = {
	getimages: getimages,
}