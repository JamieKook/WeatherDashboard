let searchHistory=[]; 
let defaultCityArr= ["Austin", "Chicago", "New York", "Orlando", "San Fransisco", " Seattle", "Denver", "Atlanta"]; 
let cities=[]

$(document).ready(function(){
    let appID = "2283f8cb8d1d8568c222f4ed3459c3b4";
    
    
    $("#searchbtn").on("click", function(){
        event.preventDefault();  
        let searchCity= $(this).prev().val().trim();

        //Add to search history- invoking if search history not 404
        function addHistory(){
            searchHistory=JSON.parse(localStorage.getItem("searchHistory"));
            if (searchHistory === null){
                searchHistory=[]; 
            }
            if (searchHistory.indexOf(searchCity) === -1){
                searchHistory.push(searchCity);
            }
            localStorage.setItem("searchHistory",JSON.stringify(searchHistory));
            console.log(localStorage); 
            console.log(searchHistory); 
        }

        //get current weather data
        let weather= "http://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&APPID=" + appID;
        $.getJSON(weather, function(json){
            $("#date").html(moment().format(" (M/D/YYYY) "));
            $("#currentCity").html(json.name); 
            $("#weather_image").attr("src", "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
            $("#temp").html(((json.main.temp-273.15) * 9/5 + 32).toFixed(1)+"&#8457");
            $("#humidity").html(json.main.humidity+"%");
            $("#windspeed").html(((json.wind.speed)* 2.237).toFixed(1)+" MPH"); 
            $("#description").html("Description: "+json.weather[0].description); 
        })
        
        let forecast="http://api.openweathermap.org/data/2.5/forecast?q=" + searchCity +"&units=imperial&APPID=" + appID;
        
        //get forecast data
        $.ajax({
            url: forecast,
            method: "GET"
        }).then(function(response){
            addHistory(); 
            console.log(response); 
            let allForecastDays= response.list; 
            console.log(allForecastDays);
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
    }); 

    function makeCityArr(){
     
        let counter=0; 
        searchHistory= JSON.parse(localStorage.getItem("searchHistory")); 
        searchHistory=searchHistory.reverse(); 
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
                cities.push(defaultCityArr[j]);
                counter++; 
            }
        }
        
        console.log(searchHistory); 
        console.log(defaultCityArr); 
        console.log(cities); 
    }

    function populateCity(arr){
        let cityId=1; 
        for (let i=0; i<8; i++){
            $("#city"+cityId).html(arr[i]); 
            cityId++; 
        }
    }
    makeCityArr(); 
    populateCity(cities);  
})


