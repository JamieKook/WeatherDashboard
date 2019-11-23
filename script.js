let searchHistory=[]; 
let defaultCityArr= ["Austin", "Chicago", "New York", "Orlando", "San Fransisco", " Seattle", "Denver", "Atlanta"]; 
let cities=[]

$(document).ready(function(){
    let appID = "2283f8cb8d1d8568c222f4ed3459c3b4";
    let mapquestID="Ro62gR6y6GdOzLZCJbOTDKhK50QK8o1r";
    let lat;
    let lon;
    let state; 
    let Searchcity; 
    
    navigator.geolocation.getCurrentPosition(function(position) {
       lat= position.coords.latitude;
       lon = position.coords.longitude; 
       console.log("lat is "+lat+" and lon is "+lon); 
        initailLocale(lat, lon); 
      });
    
    function initailLocale(lat, lon){
        //Get location information
        let locationurl= "https://www.mapquestapi.com/geocoding/v1/reverse?key="+mapquestID+"&location="+lat+","+lon+"&includeRoadMetadata=true&includeNearestIntersection=true"; 
        $.ajax({
            url: locationurl,
            method: "GET"
        }).then(function(address){
            console.log(address);
            state=address.results[0].locations[0].adminArea3;
            searchCity=address.results[0].locations[0].adminArea5;
            $("#currentState").html(", "+address.results[0].locations[0].adminArea3); 
            // $("#currentCity").html(address.results[0].locations[0].adminArea5); 
            let imageurl= address.results[0].locations[0].mapUrl; 
            imageurl= imageurl.split(":");
            console.log(imageurl); 
            let newUrl="https:"+imageurl[1]; 
            let mapurl = "https://www.mapquestapi.com/staticmap/v5/map?key="+mapquestID+"&center="+searchCity+","+state+"&size=@2x";
            $("#mapquest").attr("src",mapurl);

             //get current weather data
            let weather= "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&APPID=" + appID;
            $.getJSON(weather, function(json){
                console.log(json); 
                $("#date").html(moment().format(" (M/D/YYYY) "));
                $("#currentCity").html(json.name); 
                $("#weather_image").attr("src", "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
                $("#temp").html(((json.main.temp-273.15) * 9/5 + 32).toFixed(1)+"&#8457");
                $("#humidity").html(json.main.humidity+"%");
                $("#windspeed").html(((json.wind.speed)* 2.237).toFixed(1)+" MPH"); 
                $("#description").html("Description: "+json.weather[0].description);
                // lat= json.coord.lat; 
                // lon= json.coord.lon;
                console.log("lat is "+lat+" and lon is "+lon);
            })
            //get forecast data
            let forecast="https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity +"&units=imperial&APPID=" + appID;
            $.ajax({
                url: forecast,
                method: "GET"
            }).then(function(response){
                // addHistory();
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


        
    } 
    
    $("button").on("click", function(){
        event.preventDefault();  

        if ($(this).attr("id")=== "searchbtn"){
            searchCity= $(this).prev().val().trim();
        } else {
            searchCity=$(this).text(); 
        }
        console.log(searchCity); 
        

        //Add to search history- invoking if search history not 404
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

        //get current weather data
        let weather= "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&APPID=" + appID;
        $.getJSON(weather, function(json){
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
            console.log("lat is "+lat+" and lon is "+lon); 

            //Get location information
            let locationurl= "https://www.mapquestapi.com/geocoding/v1/reverse?key="+mapquestID+"&location="+lat+","+lon+"&includeRoadMetadata=true&includeNearestIntersection=true"; 
            $.ajax({
                url: locationurl,
                method: "GET"
            }).then(function(address){
                console.log(address);
                state=address.results[0].locations[0].adminArea3;
                $("#currentState").html(", "+address.results[0].locations[0].adminArea3); 
                let imageurl= address.results[0].locations[0].mapUrl; 
                imageurl= imageurl.split(":");
                console.log(imageurl); 
                let newUrl="https:"+imageurl[1]; 
                let mapurl = "https://www.mapquestapi.com/staticmap/v5/map?key="+mapquestID+"&center="+searchCity+","+state+"&size=@2x";
                $("#mapquest").attr("src",mapurl);

                //get map
               
                console.log(mapurl); 
            })
        })
        
        let forecast="https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity +"&units=imperial&APPID=" + appID;
        
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
            makeCityArr(); 
            populateCity(cities);   
        })   

        
    }); 

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

    function populateCity(arr){
        let cityId=1; 
        for (let i=0; i<8; i++){
            $("#city"+cityId).html(arr[i]); 
            cityId++; 
        }
    }

    function setDefault(){
        debugger; 
        event.preventDefault(); 
        searchHistory=[]; 
        cities=[]; 
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory)); 
        populateCity(defaultCityArr); 
    }

    $("#clear").on("click", setDefault); 

    populateCity(makeCityArr());  
})


