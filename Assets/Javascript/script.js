// store users search in localstorage
// on page load, grab from local storage - grab the most recent search
// if the users search exists in local storage dont append a new one, get from local storage
//  in the getCurrentWeather function, check local storage for previous searches

var cityWeather;
if (localStorage.getItem("cities")) {
  cityWeather = JSON.parse(localStorage.getItem("cities"));
} else {
  cityWeather = [];
}
// index of function
for (var i = 0; i < cityWeather.length; i++) {
  var a = $("<div class='card'>");
  a.text(cityWeather[i]);
  a.addClass("cityCard");
  a.attr("data-name", cityWeather[i]);
  $(".search").append(a);
}

function searchOneDayWeather(name) {
  //   e.preventDefault();
  console.log(name);
  // grab users input and store it in a variable (stateSearch)
  // api key and query url
  var APIKey = "096c47eea3eda324326ea249c70207ee";
  //   var name = $("#citySearch").val();
  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${APIKey}&units=imperial`;

  if (cityWeather.indexOf(name) === -1) {
    cityWeather.push(name);
    localStorage.setItem("cities", JSON.stringify(cityWeather));
  }
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    // create a function that gets the current weather (current weather data call)
    console.log(response);
    var city = response.name;
    var temp = response.main.temp;
    var humidity = response.main.humidity;
    var windSpeed = response.wind.speed;
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    console.log(lat, lon);
    // inside of that you're going to generate the city, date, temperature, humidity, wind speed
    // dynamically generate weather div

    var bodyEl = $(".oneDayWeather");
    var forecastEl = $("#forecastDiv");
    //clear clearing element!
    bodyEl.html("");
    forecastEl.html("");
    var weatherDiv = $("<div class='weather'>");
    bodyEl.append(weatherDiv);
    var pOne = $("<p>").text("City: " + city);
    pOne.appendTo(weatherDiv);
    var pTwo = $("<p>").text("Temperature: " + temp);
    pTwo.appendTo(weatherDiv);
    var pThree = $("<p>").text("Humidity: " + humidity);
    pThree.appendTo(weatherDiv);
    var pFour = $("<p>").text("Windspeed: " + windSpeed);
    pFour.appendTo(weatherDiv);
    var timeSteup = moment().format("MMM Do, YYYY");
    var pFive = $("<p>").text(timeSteup);
    pFive.appendTo(weatherDiv);
    weatherDiv.appendTo(forecastEl);
    // call the getUVIndex function to generate the UV index element
    getUVIndex(lat, lon);
    fiveDayForecast(name);
  });
}
function getUVIndex(lat, lon) {
  var appid = "096c47eea3eda324326ea249c70207ee";
  //   var lat = lat;
  //   var lon = lon;
  var queryURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${appid}&lat=${lat}&lon=${lon}`;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    var UVIValue = response.value;
    console.log(UVIValue);
    weatherDiv = $("<div class='weather'>");
    var forecastEl = $("#forecastDiv");
    var pSix = $("<p>").text("UV Index: " + UVIValue);
    weatherDiv.append(pSix);
    weatherDiv.appendTo(forecastEl);
  });
}
$("#searchBtn").on("click", function (e) {
  e.preventDefault();
  var searchCriteria = $("#citySearch").val().trim();

  console.log(searchCriteria);
  searchOneDayWeather(searchCriteria);
  //   getUVIndex(searchCriteria);
  //   fiveDayForecast(searchCriteria);
});

// you can also call searchOneDayWeather from any other on click event
$(".cityCard").on("click", function () {
  var searchCriteria = $(this).attr("data-name");
  console.log(this);
  searchOneDayWeather(searchCriteria);
  //   getUVIndex(searchCriteria);
});

// create 5DayForecast function
function fiveDayForecast(name) {
  var APIKey = "096c47eea3eda324326ea249c70207ee";
  var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=${APIKey}`;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    // create card deck and begin applying cards to fiveDayForecast

    var fiveDayForecast = $("#fiveDayForecast");
    $("#fiveDayForecast").addClass("card-deck");
    // give cards classes
    var dayOneCard = $("<div class='card col-md-4'>");
    var dayTwoCard = $("<div class='card col-md-4'>");
    var dayThreeCard = $("<div class='card col-md-4'>");
    var dayFourCard = $("<div class='card col-md-4'>");
    var dayFiveCard = $("<div class='card col-md-4'>");
    // pull the data from response object
    var weatherDayOne = $("<p>").text("Date: " + response.list[0].dt_txt);
    var weatherDayTwo = $("<p>").text("Date: " + response.list[8].dt_txt);
    var weatherDayThree = $("<p>").text("Date: " + response.list[16].dt_txt);
    var weatherDayFour = $("<p>").text("Date: " + response.list[24].dt_txt);
    var weatherDayFive = $("<p>").text("Date: " + response.list[32].dt_txt);

    var weatherImgOne = $("<img>").attr("src", response.list[0].weather);

    weatherImgOne.appendTo(dayOneCard);
    // append data
    weatherDayOne.appendTo(dayOneCard);
    dayOneCard.appendTo(fiveDayForecast);
    weatherDayTwo.appendTo(dayTwoCard);
    dayTwoCard.appendTo(fiveDayForecast);
    weatherDayThree.appendTo(dayThreeCard);
    dayThreeCard.appendTo(fiveDayForecast);
    weatherDayFour.appendTo(dayFourCard);
    dayFourCard.appendTo(fiveDayForecast);
    weatherDayFive.appendTo(dayFiveCard);
    dayFiveCard.appendTo(fiveDayForecast);

    // var
  });
}
// inculde the dates, tehmp, humidity
// dynamically generate using js
// generate a card which include <p>,<img>,<h2>,<icon>
