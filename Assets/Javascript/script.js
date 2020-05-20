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
// inculde the dates, tehmp, humidity
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

    var pSix = $("<pSix>").text("UV Index: ");
    var span = $("<span>").text(UVIValue);
    span.attr("id", "UVIVal");
    span.appendTo(pSix);
    if (UVIValue < 10) {
      //alert("hiuv");
      span.addClass("lowUV");
    } else {
      //alert("louv");
      span.addClass("highUV");
    }

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
  var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=${APIKey}&units=imperial`;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    // create card deck and begin applying cards to fiveDayForecast
    var results = response.list;
    console.log(results);
    for (var i = 0; i < results.length; i = i + 8) {
      var fiveDayForecast = $("#fiveDayForecast");
      var weatherCard = $("<div class='weatherDiv'>");
      var p1 = $("<h2>").text(moment(results[i].dt_txt).format("MMM Do, YYYY"));
      var p2 = $("<p>").text("Temp: " + results[i].main.temp);
      var iconImg = $("<img>").attr(
        "src",
        "http://openweathermap.org/img/wn/" +
          results[i].weather[0].icon +
          ".png"
      );
      var p3 = $("<p>").text("Humidity: " + results[i].main.humidity);
      weatherCard.empty();
      p1.appendTo(weatherCard);
      iconImg.appendTo(weatherCard);
      p2.appendTo(weatherCard);

      p3.appendTo(weatherCard);
      fiveDayForecast.append(weatherCard);
    }
  });
}

// dynamically generate using js
// generate a card which include <p>,<img>,<h2>,<icon>
