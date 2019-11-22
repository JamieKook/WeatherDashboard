
$(document).ready(function(){
    let appID = "2283f8cb8d1d8568c222f4ed3459c3b4";
    $("#searchbtn").on("click", function(){
        event.preventDefault(); 
        $("#date").html(moment().format(" (M/D/YYYY) ")); 
        let searchCity= $(this).prev().val();
        let weather= "http://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&APPID=" + appID;
        console.log(weather); 
        $.getJSON(weather, function(json){
            $("#currentCity").html(json.name); 
            $("#weather_image").attr("src", "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
            $("#temp").html(((json.main.temp-273.15) * 9/5 + 32).toFixed(1)+"&#8457");
            $("#humidity").html(json.main.humidity+"%");
            $("#windspeed").html(((json.wind.speed)* 2.237).toFixed(1)+" MPH"); 
        })
        
        let forecast="http://api.openweathermap.org/data/2.5/forecast?q=" + searchCity +"&units=imperial&APPID=" + appID;
        console.log(forecast); 
        $.ajax({
            url: forecast,
            method: "GET"
        }).then(function(response){
            console.log(response); 
            let allForecastDays= response.list; 
            console.log(allForecastDays);
            let dayCount=1; 

            for (let i=0; i <allForecastDays.length; i++){
                let dateFull= allForecastDays[i].dt_txt; 
                let date=dateFull.split(" ")[0];
                let time= dateFull.split(" ")[1];  
                if(time === "15:00:00"){
                    console.log(time); 
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

})


