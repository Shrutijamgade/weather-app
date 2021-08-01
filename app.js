const express = require('express');
const https = require("https");
const bodyParser = require('body-parser');



const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {

    res.sendFile(__dirname + '/index.html');

})

app.post('/', function (req, res) {
    const query = req.body.cityName;
    const appid = "9a31fc9e6464859474028020360dedc";
    const unit = "metric"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${appid}1&units=${unit}`
    https.get(url, function (response) {
        console.log(response.statusCode);
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            res.write(`<p>The weather is ${description}</p>`);
            res.write(`<h1>The temperature in ${query} is ${temp} degree celsius.</h1>`);
            res.write(`<img src=${imageURL} alt="image"> `);
            res.send();


    })
    
 })
    
})



app.listen(3000, function () {
    console.log("Server running");
})