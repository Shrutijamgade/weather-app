require('dotenv').config();
const express = require('express');
const https = require("https");
const bodyParser = require('body-parser');
const ejs = require("ejs");

const app = express();
var cities = [];
var error = "";
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', function (req, res) {

    res.render("index", { cityInfo: cities, error: error });

});

app.post('/', function (req, res) {
    var query = req.body.cityName;

    if (query.includes(',')) {
        query = query.split(',')[0];
    }
    let citiesName = cities.map(c => {
        return c.name.toLowerCase();
    });
    
    if (query) {
        query = query[0].toUpperCase() + query.slice(1).toLowerCase();
    }
    
    const appid = process.env.APPID;
    const unit = "metric"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${appid}1&units=${unit}`
    https.get(url, function (response) {
        //console.log(response.statusCode);
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            // console.log(weatherData);
            if (weatherData?.cod !== '404' && weatherData?.cod !== '400') {
                const temp = weatherData.main.temp;
                const description = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                const country = weatherData?.sys?.country;

                if (citiesName.includes(query.toLowerCase())) {
                    error = `You already know the weather for ${query}.`;
                }
                else {
                    const cityData = {
                        name: query,
                        image: imageURL,
                        temperature: temp,
                        description: description,
                        country: country
    
                    }
                    cities.push(cityData);
                    error = "";
                }
            }
            else {
                error = "Enter a valid City!";
                
            }
            res.redirect("/");
            


        },
            response.on("error", function (e) {
                console.log("error", e);
            }),
        )
    
    });
    
});


app.listen(3000, function () {
    console.log("Server running");
});



