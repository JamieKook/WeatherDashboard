let searchHistory=[]; 
let defaultCityArr= ["Austin", "Chicago", "New York", "Orlando", "San Francisco", " Seattle", "Denver", "Atlanta"]; 
let cities=[]

$(document).ready(function(){
    let appID = "2283f8cb8d1d8568c222f4ed3459c3b4";
    let mapquestID="Ro62gR6y6GdOzLZCJbOTDKhK50QK8o1r";
    let lat;
    let lon;
    let state; 
    let searchCity; 

//functions for app
    //----------------------------------------------------
    //Add to search history- invoking if search history not 404, done in forecast data fxn 
    function addHistory(){
        searchHistory=JSON.parse(localStorage.getItem("searchHistory"));
        if (searchHistory === null){
            searchHistory=[]; 
        }
        if (searchHistory.indexOf(searchCity) === -1){     
            searchHistory.push(searchCity);
            if (searchHistory.length >8){
                searchHistory.splice(0,1); 
            }
        }
        localStorage.setItem("searchHistory",JSON.stringify(searchHistory));
    
    }

    //Initializes the page with current cities data given the lat and lon from the geolocation api
    function initailLocale(lat, lon){
        LatLonStateFinder(currentWeather, forecastData);    
    } 
    
    //Gets 5 day forecast 
    function forecastData(){
        let forecast="https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity +"&units=imperial&APPID=" + appID;
        $.ajax({
            url: forecast,
            method: "GET"
        }).then(function(response){
            console.log("This is the 5 day forecast data: ");
            console.log(response); 
            let allForecastDays= response.list; 
            let dayCount=1; 
            for (let i=0; i <allForecastDays.length; i++){
                let dateFull= allForecastDays[i].dt_txt; 
                let date=dateFull.split(" ")[0];
                let time= dateFull.split(" ")[1];  
                if(time === "15:00:00"){
                    let year= date.split("-")[0];
                    let month=date.split("-")[1];
                    let day = date.split("-")[2];
                    $("#day"+dayCount).children(".card-date").html(month+"/"+day+"/"+year); 
                    $("#day"+dayCount).children(".card-temp").html("Temp: "+allForecastDays[i].main.temp.toFixed(1)+"&#8457"); 
                    $("#day"+dayCount).children(".card-humid").html("Humidity: " +allForecastDays[i].main.humidity+"%"); 
                    $("#day"+dayCount).children(".card-icon").html("<img src=http://openweathermap.org/img/w/" + allForecastDays[i].weather[0].icon + ".png>" ); 
                    dayCount++; 
                } 
            }  
        })   
    }

    //get current weather data- optional function parameter to wait for data (retrieves lat and lon)
    function currentWeather(fxn1, fxn2){
        let weather= "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&APPID=" + appID;
        $.getJSON(weather, function(json){
            console.log("This is the current weather data: ");
            console.log(json); 
            $("#date").html(moment().format(" (M/D/YYYY) "));
            $("#currentCity").html(json.name); 
            $("#weather_image").attr("src", "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
            $("#temp").html(((json.main.temp-273.15) * 9/5 + 32).toFixed(1)+"&#8457");
            $("#humidity").html(json.main.humidity+"%");
            $("#windspeed").html(((json.wind.speed)* 2.237).toFixed(1)+" MPH"); 
            $("#description").html("Description: "+json.weather[0].description);
            lat= json.coord.lat; 
            lon= json.coord.lon;
            console.log("lat is "+lat+" and lon is "+lon +". Data taken from current weather json"); 
    
            //Get location information
            fxn1= fxn1 || undefined; 
            if (fxn1 !== undefined){
                fxn1(); 
            }

            fxn2= fxn2 || undefined; 
            if (fxn2 !== undefined){
                fxn2(); 
            }
        })  
    }

    //use lat and lon to find state and city name- option function parameters to wait for data (city and state)
    //and creates search history during this function using updated search city name to avoid repeated history
    function LatLonStateFinder(waitfxn1, waitfxn2){
        let locationurl= "https://www.mapquestapi.com/geocoding/v1/reverse?key="+mapquestID+"&location="+lat+","+lon+"&includeRoadMetadata=true&includeNearestIntersection=true"; 
        $.ajax({
            url: locationurl,
            method: "GET"
        }).then(function(address){
            console.log("This is the address given the lat and lon: ");
            console.log(address);
            state=address.results[0].locations[0].adminArea3;
            searchCity=address.results[0].locations[0].adminArea5;
            console.log("After running latlon the city is "+searchCity); 
            $("#currentState").html(", "+address.results[0].locations[0].adminArea3); 
            let mapurl = "https://www.mapquestapi.com/staticmap/v5/map?key="+mapquestID+"&center="+searchCity+","+state+"&size=@2x";
            $("#mapquest").attr("src",mapurl);
            console.log("The saved search city name is " + searchCity);
            addHistory();
            makeCityArr(); 
            populateCity(cities);

            waitfxn1= waitfxn1 || undefined; 
            if (waitfxn1 !== undefined){
                waitfxn1(); 
            }
            waitfxn2= waitfxn2 || undefined; 
            if (waitfxn2 !== undefined){
                waitfxn2(); 
            }
        })
    }

    //create city array which combines the search history and default cities to get 8 city names
    function makeCityArr(){
        cities=[];
        let counter=0; 
        searchHistory= JSON.parse(localStorage.getItem("searchHistory"));
        if (searchHistory === null){
            searchHistory =[]; 
        } else {
            searchHistory=searchHistory.reverse(); 
        }
        for (let i=0; i<8; i++){
            if (searchHistory[i]!== undefined){
                cities.push(searchHistory[i]); 
                counter++; 
            } else {
                break; 
            }
        }
        if (cities.length<8){
            for (let j=0; counter < 8; j++){
                if (cities.indexOf(defaultCityArr[j])=== -1){
                    cities.push(defaultCityArr[j]);
                    counter++; 
                }  
            }
        }
        return cities; 
    }

    //populate the buttons on the search history with given array
    function populateCity(arr){
        let cityId=1; 
        for (let i=0; i<8; i++){
            $("#city"+cityId).html(arr[i]); 
            cityId++; 
        }
    }

    //clear and reset search history to default cities
    function setDefault(){
        debugger; 
        event.preventDefault(); 
        searchHistory=[]; 
        cities=[]; 
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory)); 
        populateCity(defaultCityArr); 
    }
//-----------------------------------------------
//invocation of functions here: 

    //set initial buttons of using saved history and default cities
    populateCity(makeCityArr());  

    //get initial weather data using current position from geolocation
    navigator.geolocation.getCurrentPosition(function(position) {
       lat= position.coords.latitude;
       lon = position.coords.longitude; 
       console.log("lat is "+lat+" and lon is "+lon); 
        initailLocale(lat, lon); 
      });
    
    //button listeners to select data for selected cities
    $("button").on("click", function(){
        event.preventDefault();  

        if ($(this).attr("id")=== "searchbtn"){
            searchCity= $(this).prev().val().trim();
        } else {
            searchCity=$(this).text(); 
        }
        console.log("The inputed city is "+searchCity); 
        currentWeather(LatLonStateFinder);  
        forecastData();          
    }); 

    //clear search history on click
    $("#clear").on("click", setDefault); 

    
})


