const express = require('express'),
    request = require('request'),
    fs = require('fs');
    hbs = require('hbs'),
    bodyParser = require('body-parser')

    port = process.env.PORT || 8080;

const darksky = require("./darksky.js")

var app = express();

app.use(bodyParser.urlencoded({
    extended:true
}))


hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('getTime', () => {
    date = new Date();
    return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
});

hbs.registerHelper('upper', (text) => {
    return text.toUpperCase();
})

app.use(express.static(__dirname + '/public'));


app.use((request, response, next) => {
    var time = new Date().toString()
    console.log(time)
    next()
})

app.get('/', (request, response) => {
	response.render('index.hbs', {
		title: 'Homepage',
		welcomeMessage: 'This is homepage!!!'
	});
});

app.get('/weather', (request, response) => {
	response.render('weather.hbs', {
		title: 'Weather report',
		welcomeMessage: 'This is Weather!!!'
	});
});

app.get('/404', (request, response) => {
    response.send('Page not found!')
});


app.post("/", (request, response) => {
    let {
        lat,
        long
    } = request.body;
    darksky.getWeather(lat, long).then(res => {
        if (res) {
            console.log(res)
            response.render('index.hbs', {
                summary: res['status'],
                temp: res['temp']
            })
        }
    })
    .catch(
        (err)=> {
            response.status(400);
            response.send('Cna not find!!!');
        }
    )
    //function().then().then().catch()
})



app.listen(port, () => {
    console.log(`Server is up on the port ${port}`);
});

