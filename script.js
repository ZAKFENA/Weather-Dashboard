$(document).ready(function () {
  var lat;
  var lon;
  var citiesArr = JSON.parse(window.localStorage.getItem("cities")) || [];
  console.log(citiesArr, "beginning");
  var savedCities = localStorage.getItem("cities");
  var savedCitiesArr = JSON.parse(savedCities);

  //Current Date
  var d = new Date();

  var date = d.getUTCDate();
  var month = d.getUTCMonth() + 1; // Since getUTCMonth() returns month from 0-11 not 1-12
  var year = d.getUTCFullYear();
  var currentDate = date + "/" + month + "/" + year;
  var forecastDate1 = date + 1 + "/" + month + "/" + year;
  var forecastDate2 = date + 2 + "/" + month + "/" + year;
  var forecastDate3 = date + 3 + "/" + month + "/" + year;
  var forecastDate4 = date + 4 + "/" + month + "/" + year;
  var forecastDate5 = date + 5 + "/" + month + "/" + year;

  renderCities();
  if (citiesArr.length > 0) {
    displayWeather(citiesArr[citiesArr.length - 1]);
  }

  function renderCities() {
    // Deleting the movies prior to adding new movies
    $(".cities-list").empty();

    console.log(citiesArr, "saved cities array");
    // Looping through the array of cities
    for (var i = 0; i < citiesArr.length; i++) {
      // Then dynamicaly generating buttons for each city in the array
      // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
      var a = $("<li>");
      // Adding a class of saved city to our button
      a.addClass("list-group-item list-group-item-action savedCityButton");
      // Adding a data-attribute
      a.attr("data-name", citiesArr[i]);
      // Providing the initial button text
      a.text(citiesArr[i]);
      // Adding the button to the citiesList div
      $(".cities-list").prepend(a);
    }
  }

  // Function that gets Temprature, Humidity and Wind Speed
  function displayWeather(city, render) {
    // console.log(savedCities);
    var APIkey = "8bb29e39d1793c0fac57e32626a2237c";

    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      APIkey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // console.log(queryURL);
      console.log(response);
      lat = response.coord.lat;
      lon = response.coord.lon;
      console.log(lat);
      console.log(lon);
      var tempF = ((response.main.temp - 273.15) * 1.8 + 32).toFixed(2);
      $(".cityName").text(response.name + " (" + currentDate + ")");
      $(".weatherIcon").attr(("src", response.weather[0]));
      $(".temp").text("Temprature: " + tempF);
      $(".humidity").text("Humidity: " + response.main.humidity);
      $(".wind").text("Wind Speed: " + response.wind.speed);
      displayUVIndex(lat, lon);

      if (render) {
        citiesArr.push(response.name);
        console.log(citiesArr, "displayweather");
        localStorage.setItem("cities", JSON.stringify(citiesArr));
        renderCities();
      }
      // Save cities to local storage to display searched cities
    });
  }

  //Function that gets the UV Index
  function displayUVIndex(lat, lon) {
    var APIkey = "8bb29e39d1793c0fac57e32626a2237c";

    var queryURL =
      "http://api.openweathermap.org/data/2.5/uvi?appid=" +
      APIkey +
      "&lat=" +
      lat +
      "&lon=" +
      lon;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // console.log(response.value);
      $("#UVIndex").text(response.value);

      // });
    });
  }

  function displayForecast(city) {
    // console.log(savedCities);
    var APIkey = "8bb29e39d1793c0fac57e32626a2237c";

    var queryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&cnt=5" +
      "&appid=" +
      APIkey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response, "Forecast");

      // $(".forecast").setAttribute("backgroundcolor", "gray");

      // Day 1
      $("#day1").text(forecastDate1);

      $("#temp1").text(
        "Temp: " +
          ((response.list[0].main.temp - 273.15) * 1.8 + 32).toFixed(2) +
          " °F"
      );
      $("#humidity1").text("Humidity: " + response.list[0].main.humidity + "%");

      // Day 2
      $("#day2").text(forecastDate2);

      $("#temp2").text(
        "Temp: " +
          ((response.list[1].main.temp - 273.15) * 1.8 + 32).toFixed(2) +
          " °F"
      );
      $("#humidity2").text("Humidity: " + response.list[1].main.humidity + "%");

      // Day 3
      $("#day3").text(forecastDate3);

      $("#temp3").text(
        "Temp: " +
          ((response.list[2].main.temp - 273.15) * 1.8 + 32).toFixed(2) +
          " °F"
      );
      $("#humidity3").text("Humidity: " + response.list[2].main.humidity + "%");

      // Day 4
      $("#day4").text(forecastDate4);

      $("#temp4").text(
        "Temp: " +
          ((response.list[3].main.temp - 273.15) * 1.8 + 32).toFixed(2) +
          " °F"
      );
      $("#humidity4").text("Humidity: " + response.list[3].main.humidity + "%");

      // Day 5
      $("#day5").text(forecastDate5);

      $("#temp5").text(
        "Temp: " +
          ((response.list[4].main.temp - 273.15) * 1.8 + 32).toFixed(2) +
          " °F"
      );
      $("#humidity5").text("Humidity: " + response.list[4].main.humidity + "%");
    });
  }

  // Function that when a city search City Button is clicked it calls the renderWeather() function.
  $(document).on("click", ".savedCityButton", function () {
    var city = $(this).attr("data-name");
    displayWeather(city);
    displayForecast(city);
  });

  $("#searchBtn").on("click", function (event) {
    event.preventDefault();

    var city = $("#cityInput").val().trim();

    // console.log($("#cityInput").val());

    displayWeather(city, true);
    console.log(citiesArr);
    displayForecast(city);
  });
});
