/**
 * Created by tomgobich on 6/10/16.
 */

const WEEKDAYS = 7;

// Holds weekly forecast data
var Forecast = {
    "day": [],
    "condition": [],
    "conditionCode": [],
    "tempLow": [],
    "tempHigh": [],
    "display": []
};



// The home of everything! (except load)
$(document).ready( function() {

    // Initiate weather determination
    setLocation();

});

// When button is clicked reset load screen and refresh weather data
$("#locationSubmit").click( function() {

    //animateWeatherShow();

    // Show loading screen / hide content
    resetLoadScreen();

    // Initiate weather determination
    setLocation();

});

// Stop form from submitting and refreshing page,
// Instead reset load screen and refresh weather data
$('form').submit(function (evt) {

    // Prevent default "submit" action
    evt.preventDefault();

    // Show loading screen / hide content
    resetLoadScreen();

    // Initiate weather determination
    setLocation();

});



// ----------------------------------------------------------------------
// name: setLocation
// abstract: Determines location to get weather, then calls loadWeather
// ----------------------------------------------------------------------
function setLocation() {

    var locationDefault;
    var locationInput = document.getElementById('locationInput');
    var locationCookie = document.cookie;

    // Was a location entered?
    if( locationInput.value.length > 0 ) {

        // Yes, set location entered to default
        locationDefault = locationInput.value;

    }
    else {

        // No, set default to New York, NY
        locationDefault = "New York, NY";

    }

    // Is there a location stored in a cookie?
    if( locationCookie != "" &&
        locationCookie != "Undefined" &&
        locationInput.value.length < 1 ) {

        // Yes, get location from cookie and remove key text
        locationDefault = locationCookie.replace( "location=", "" );

        // Load weather data
        loadWeather( locationCookie );

    }
    // Is there geolocation data in Navigator and no location entered?
    else if( "geolocation" in navigator && locationInput.value == "" ) {

        // Yes, get current position
        navigator.geolocation.getCurrentPosition( function( position ) {

            // Set default location to current coordinates
            locationDefault = position.coords.latitude + ',' + position.coords.longitude;

            document.cookie = "location=" + locationDefault;

            // Load weather data
            loadWeather( locationDefault );

        });

    }
    else {

        // Load weather data
        loadWeather( locationDefault, "" );

    }

    // Refresh data on interval
    setInterval( loadWeather( locationDefault, "" ), 10000 );

}



// ----------------------------------------------------------------------
// name: resetLoadScreen
// abstract: Resets loading screen
// ----------------------------------------------------------------------
function resetLoadScreen() {

    // Show inner container loading element
    $('#weatherLoading').show();

    // Hide inner container weather data
    $('#weatherContainer').hide();

}



// ----------------------------------------------------------------------
// name: loadWeather
// abstract: Initializes simpleWeather API and sets basic settings.
//           All weather element functions are called from here!
// ----------------------------------------------------------------------
function loadWeather( location, woeid ) {

    // Load / set data for simpleWeather API
    $.simpleWeather({
        location: location,
        woeid: woeid,
        unit: 'f',
        success: function( weather ) {

            var locationInput = document.getElementById('locationInput');

            // Set value for location to City, Region EX: Cincinnati, OH
            locationInput.value = weather.city + ', ' + weather.region;

            // Loads and Displays Current conditions section
            setCurrentConditions( weather );

            // Loads and Displays Forecast section
            setForecast( weather );

            // Sets Weather Background video
            setWeatherBg( weather );

            // Initial page load
            $('#content').show();
            $('#loading').hide();

            // Weather refresh load
            $('#weatherContainer').show();
            $('#weatherLoading').hide();

        },

        error: function( error ) {
            $(".error").html('<p>' + error + '</p>');
        }

    });
}



// ----------------------------------------------------------------------
// name: setCurrentConditions
// abstract: Loads and Displays Current Conditions section
// ----------------------------------------------------------------------
function setCurrentConditions( weather ) {

    var conditionOverview = document.getElementById('conditionOverview');
    var conditionDetails = document.getElementById('conditionDetails');
    var conditionOverview = [];
    var conditionData = [];

    // Get data for condition overview (main, left/top)
    conditionOverview = getConditionOverview( weather );

    // Get data for condition specifics (main, right/bottom)
    conditionData = getConditionData( weather );

    // Display the information gathered
    displayConditionOverview( conditionOverview );
    displayConditionData( conditionData );

}



// ----------------------------------------------------------------------
// name: getConditionOverview
// abstract: Collects data on current conditions from simpelWeather API
//           Contains General Information
// ----------------------------------------------------------------------
function getConditionOverview( weather ) {

    var conditionOverview = [];

    // Get data for condition overview from simpleWeather
    conditionOverview["code"] = weather.code;
    conditionOverview["temperature"] = weather.temp;
    conditionOverview["condition"] = weather.currently;

    // return condition overview data
    return conditionOverview;

}



// ----------------------------------------------------------------------
// name: getConditionData
// abstract: Collects data on current conditions from simpelWeather API
//           Contains Detailed Information
// ----------------------------------------------------------------------
function getConditionData( weather ) {

    var conditionData = [];

    // Get data for condition specifics from simpleWeather
    conditionData["updated"] = weather.updated;
    conditionData["low"] = weather.low;
    conditionData["high"] = weather.high;
    conditionData["windChill"] = weather.wind.chill;
    conditionData["windDirection"] = weather.wind.direction;
    conditionData["windSpeed"] = weather.wind.speed;
    conditionData["humidity"] = weather.humidity;
    conditionData["heatIndex"] = weather.heatindex;
    conditionData["pressure"] = weather.pressure;
    conditionData["visibility"] = weather.visibility;
    conditionData["sunrise"] = weather.sunrise;
    conditionData["sunset"] = weather.sunset;

    // return condition specifics data
    return conditionData;

}



// ----------------------------------------------------------------------
// name: displayConditionOverview
// abstract: Displays overview of current weather conditions
// ----------------------------------------------------------------------
function displayConditionOverview( conditionOverview ) {

    var conditionIcon = document.getElementById('currentConditionIcon');
    var temp = document.getElementById('currentTemp');
    var condition = document.getElementById('currentCondition');

    // Display condition overview data on HTML
    conditionIcon.innerHTML = '<img class="svg" src="images/weathericons/' + conditionOverview["code"] + '.svg" />'
    temp.innerHTML = conditionOverview["temperature"] + '&deg;';
    condition.innerHTML = conditionOverview["condition"];

}



// ----------------------------------------------------------------------
// name: displayConditionData
// abstract: Displays details of current weather conditions
// ----------------------------------------------------------------------
function displayConditionData( conditionData ) {

    var updated         = document.getElementById('currentUpdated');
    var low             = document.getElementById('currentLow');
    var high            = document.getElementById('currentHigh');
    var windChill       = document.getElementById('currentWindChill');
    var windDirection   = document.getElementById('currentWindDirection');
    var windSpeed       = document.getElementById('currentWindSpeed');
    var humidity        = document.getElementById('currentHumidity');
    var heatIndex       = document.getElementById('currentHeatIndex');
    var pressure        = document.getElementById('currentPressure');
    var visibility      = document.getElementById('currentVisibility');
    var sunrise         = document.getElementById('currentSunrise');
    var sunset          = document.getElementById('currentSunset');

    // Display condition specifics data on HTML
    updated.innerHTML = conditionData["updated"];
    low.innerHTML = conditionData["low"] + '&deg;';
    high.innerHTML = conditionData["high"] + '&deg;';
    windChill.innerHTML = conditionData["windChill"] + '&deg;';
    windDirection.innerHTML = conditionData["windDirection"];
    windSpeed.innerHTML = conditionData["windSpeed"] + ' mph';
    humidity.innerHTML = conditionData["humidity"] + '%';
    heatIndex.innerHTML = conditionData["heatIndex"];
    pressure.innerHTML = conditionData["pressure"];
    visibility.innerHTML = conditionData["visibility"] + ' mi';
    sunrise.innerHTML = conditionData["sunrise"];
    sunset.innerHTML = conditionData["sunset"];

}



// ----------------------------------------------------------------------
// name: setForecast
// abstract: Loads and Displays Forecast section
// ----------------------------------------------------------------------
function setForecast( weather ) {

    var forecast = document.getElementById('forecast');
    var forecastDisplay = "";

    // Loop through weekdays
    for( var day = 0; day < WEEKDAYS; day++ ) {

        // Get data from simpleWeather API
        getForecast( weather, day );

        // Get display data from Forecast object and append
        forecastDisplay += Forecast.display[day];

    }

    // Display weekday data to HTML
    forecast.innerHTML = forecastDisplay;

}



// ----------------------------------------------------------------------
// name: getForecast
// abstract: collects data from simpleWeather API and saves data in
//           Forecast object
// ----------------------------------------------------------------------
function getForecast( weather, day ) {

    // Get data from simpleWeather and place in Forecast object fields
    Forecast.day[day] = weather.forecast[day].day;
    Forecast.condition[day] = weather.forecast[day].text;
    Forecast.conditionCode[day] = '<img class="svg weathericon" src="images/weathericons/' + weather.forecast[day].code + '.svg">';
    Forecast.tempLow[day] = weather.forecast[day].low + '&deg;';
    Forecast.tempHigh[day] = weather.forecast[day].high + '&deg;';

    // Replace shorthand day name for full day name EX: Mon -> Monday
    Forecast.day[day] = getFullDayName( Forecast.day[day] );

    // Abbreviates long condition names EX: Scattered Thunderstorms -> Scattered Storms
    Forecast.condition[day] = getConditionAbbreviation( Forecast.condition[day] );

    // Setup display object to hold HTML ready to display
    Forecast.display[day]   = `<div class="weather-forecast">
                                    <div class="forecast heading">
                                        <div class="forecast weekday">` + Forecast.day[day] + `</div>
                                        <div class="forecast condition">`+ Forecast.condition[day] + `</div>
                                    </div>
                                    <div class="forecast condition-icon">` + Forecast.conditionCode[day] + `</div>
                                    <div class="temperature">
                                        <div class="forecast temp-low">` + Forecast.tempLow[day] + `</div>
                                        <div class="forecast temp-high">` + Forecast.tempHigh[day] + `</div>
                                    </div>
                                </div>`;

}



// ----------------------------------------------------------------------
// name: getFullDayName
// abstract: takes a an abbreviated weekday name and returns the full name
// ----------------------------------------------------------------------
function getFullDayName( shortDayName ) {

    var fullDayName;

    // Replace short day names with full names EX: MON -> Monday
    switch( shortDayName.toUpperCase() ) {
        case 'MON':
            fullDayName = 'Monday';
            break;
        case 'TUE':
            fullDayName = 'Tuesday';
            break;
        case 'WED':
            fullDayName = 'Wednesday';
            break;
        case 'THU':
            fullDayName = 'Thursday';
            break;
        case 'FRI':
            fullDayName = 'Friday';
            break;
        case 'SAT':
            fullDayName = 'Saturday';
            break;
        case 'SUN':
            fullDayName = 'Sunday';
            break;
    }

    // Return the full day name
    return fullDayName;

}



// ----------------------------------------------------------------------
// name: getConditionAbbreviation
// abstract: If condition string is too long, returns abbreviated version
// ----------------------------------------------------------------------
function getConditionAbbreviation( condition ) {

    // Array of condition names and their abbreviations
    // List contains conditions too long to fit in HTML elements
    var conditionText = [
        {
            name: 'SEVERE THUNDERSTORMS',
            abbreviation: 'Severe Storms'
        },
        {
            name: 'MIXED RAIN AND SNOW',
            abbreviation: 'Rain/Snow Mix'
        },
        {
            name: 'MIXED RAIN AND SLEET',
            abbreviation: 'Rain/Sleet Mix'
        },
        {
            name: 'MIXED SNOW AND SLEET',
            abbreviation: 'Snow/Sleet Mix'
        },
        {
            name: 'LIGHT SNOW SHOWERS',
            abbreviation: 'Light Snow'
        },
        {
            name: 'ISOLATED THUNDERSTORMS',
            abbreviation: 'Spotty Storms'
        },
        {
            name: 'SCATTERED THUNDERSTORMS',
            abbreviation: 'Scattered Storms'
        },
        {
            name: 'SCATTERED SHOWERS',
            abbreviation: 'Scattered Rain'
        },
        {
            name: 'SCATTERED SNOW SHOWERS',
            abbreviation: 'Scattered Snow'
        },
        {
            name: 'ISOLATED THUNDERSHOWERS',
            abbreviation: 'Spotty Thunder'
        },
    ];

    var conditionTextLength = conditionText.length;
    var conditionReturn = condition;
    var conditionToUpper = condition.toUpperCase();

    // Loop through conditionText
    for( var i = 0; i < conditionTextLength; i++ ) {

        // current text is set to conditionText's current index in loop
        var currentText = conditionText[i].name;

        // Does the condition match the current text?
        if( conditionToUpper == currentText ) {

            // Yes, set return variable to condition's abbreviation
            conditionReturn = conditionText[i].abbreviation;

        }
    }

    // Return abbreviated condition
    return conditionReturn;

}



// ----------------------------------------------------------------------
// name: setWeatherBg
// abstract: Sets background video depending on location's time & condition
// ----------------------------------------------------------------------
function setWeatherBg( weather ) {

    var date = new Date();
    var weatherBg = "";

    // Get location's current time (hh:mm) and sets it in date
    date = getCurrentTime( weather, date );

    // Determine which bg video to show
    weatherBg = getWeatherBg( weather, date, weatherBg );

    // Show video in HTML
    document.getElementById('weatherBg').innerHTML = weatherBg;

}



// ----------------------------------------------------------------------
// name: getCurrentTime
// abstract: Returns timezone's difference from UTC time
// ----------------------------------------------------------------------
function getCurrentTime( weather, date ) {

    var hours = 0;
    var minutes = 0;
    var spaceIndex = 0;
    var timeZone = weather.updated;
    var utcTime = date.getUTCHours();
    var utcMinutes = date.getUTCMinutes();

    // 1) Gets timezone for the location that the weather is currently shown
    // String format: Fri, 17 Jun 2016 04:00 PM EDT
    spaceIndex = timeZone.lastIndexOf(" ");
    timeZone = timeZone.substr( spaceIndex + 1, timeZone.length - spaceIndex );

    // 2) Determines UTC offput for timezone EX: EDT = -4
    switch( timeZone.toUpperCase() ) {
        case 'HST':
            hours = -10;
            break;
        case 'ULAT':
        case 'PDT':
            hours = -7;
            break;
        case 'MDT':
            hours = -6;
            break;
        case 'CDT':
            hours = -5;
            break;
        case 'EDT':
            hours = -4;
            break;
        case 'BRT':
            hours = -3;
            break;
        case 'BST':
            hours = 1;
            break;
        case 'CEST':
            hours = 2;
            break;
        case 'IST':
            hours = 5;
            minutes = 30;
            break;
        case 'SGT':
            hours = 8;
            break;
        case 'JST':
            hours = 9;
            break;
        case 'AEST':
            hours = 10;
            break;
        case 'NZST':
            hours = 12;
            break;
    }

    // Set hours/minutes to weather location's current hours/minutes
    date.setHours( utcTime + hours );
    date.setMinutes( utcMinutes + minutes );

    // Return date
    return date;

}



// ----------------------------------------------------------------------
// name: getWeatherBg
// abstract: Determines which weather background video should be used,
//           then returns a string with the HTML elements inside ready
//           to display
//           Current Background Criteria:
//                  Filename        Crit 1      Crit 2
//                  ---------------------------------------
//                  blurry-night    11pm-6am
//                  city-nights     7pm-11pm    5am-7am
//                  Orange-Ripple   6pm-9pm     6am-10am
//                  puddle          raining
//                  Sunset-Lapse    5pm-8pm     7am-11am
//                  Thin-Ice        cold
//                  Three-Swans     6am-9am
//                  Up              9am-6pm
//                  Window-Snow     Snow
//                  windy           windy
// ----------------------------------------------------------------------
function getWeatherBg( weather, date, weatherBg ) {

    var currentHour = date.getHours();
    var conditionCode = weather.code;
    var currentTemp = weather.temp;
    var weatherBg = "";

    // Set background initially by time
    if( currentHour == 23 ||
        currentHour >=  0 && currentHour <=  6 ) {

        weatherBg = "blurry-night";
        $("#weatherBg").css('background', 'url("images/blurry-night.jpg") center center/cover no-repeat');

    }
    else if( currentHour >= 18 && currentHour <= 23 ||
             currentHour >=  6 && currentHour <=  9 ) {

        weatherBg = "Orange-Ripple";
        $("#weatherBg").css('background', 'url("images/Orange-Ripple.jpg") center center/cover no-repeat');

    }
    else if( currentHour >= 17 && currentHour <= 20 ||
             currentHour >=  7 && currentHour <= 11 ) {

        weatherBg = "Sunset-Lapse";
        $("#weatherBg").css('background', 'url("images/Sunset-Lapse.jpg") center center/cover no-repeat');

    }
    else if( currentHour >=  6 && currentHour <=  9 ) {

        weatherBg = "Three-Swans";
        $("#weatherBg").css('background', 'url("images/Three-Swans.jpg") center center/cover no-repeat');

    }
    else if( currentHour >=  9 && currentHour <= 18 ) {

        weatherBg = "Up";
        $("#weatherBg").css('background', 'url("images/Up.jpg") center center/cover no-repeat');

    }

    // Overthrow time based if condition has match
    if( conditionCode ==  1 ||
        conditionCode ==  3 ||
        conditionCode ==  4 ||
        conditionCode ==  5 ||
        conditionCode ==  6 ||
        conditionCode ==  8 ||
        conditionCode ==  9 ||
        conditionCode == 10 ||
        conditionCode == 11 ||
        conditionCode == 12 ||
        conditionCode == 35 ||
        conditionCode == 37 ||
        conditionCode == 38 ||
        conditionCode == 39 ||
        conditionCode == 40 ||
        conditionCode == 45 ||
        conditionCode == 47 ) {

        weatherBg = "Puddle";
        $("#weatherBg").css('background', 'url("images/Puddle.jpg") center center/cover no-repeat');

    }
    else if( conditionCode ==  7 ||
             conditionCode == 13 ||
             conditionCode == 14 ||
             conditionCode == 15 ||
             conditionCode == 16 ||
             conditionCode == 18 ||
             conditionCode == 41 ||
             conditionCode == 42 ||
             conditionCode == 43 ||
             conditionCode == 46 ) {

        weatherBg = "Window-Snow";
        $("#weatherBg").css('background', 'url("images/Window-Snow.jpg") center center/cover no-repeat');

    }
    else if( conditionCode ==  2 ||
             conditionCode == 23 ||
             conditionCode == 24 ) {

        weatherBg = "windy";
        $("#weatherBg").css('background', 'url("images/windy.jpg") center center/cover no-repeat');

    }
    else if( conditionCode == 25 ||
             currentTemp   <= 32 ) {

        weatherBg = "Thin-Ice";
        $("#weatherBg").css('background', 'url("images/Thin-Ice.jpg") center center/cover no-repeat');

    }

    // Set selected video as video, build video HTML
    weatherBg =     `<video loop muted autoplay poster="images/` + weatherBg + `.jpg" class="weather-bg__video">
                        <source src="videos/` + weatherBg + `.webm" type="video/webm">
                        <source src="videos/` + weatherBg + `.mp4" type="video/mp4">
                        <source src="videos/` + weatherBg + `.ogv" type="video/ogg">
                     </video>`;

    // Return weatherBg
    return weatherBg;

}



// ----------------------------------------------------------------------
// name: animateWeatherShow
// abstract: Animation when weather has loaded and first being shown
// ----------------------------------------------------------------------
function animateWeatherShow() {

    //$("#weatherContainer").slideDown( "slow" );
    $( "#weatherContainer" ).hide( "drop", { direction: "down" }, "slow" );

}
