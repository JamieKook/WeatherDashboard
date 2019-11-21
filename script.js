
$(document).ready(function(){
    let appID = "2283f8cb8d1d8568c222f4ed3459c3b4";
    
    $("#searchbtn").on("click", function(){
        event.preventDefault(); 
        let searchCity= $(this).prev().val();
        
        let weather= "http://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&APPID=" + appID;
        console.log(weather); 
        $.getJSON(weather, function(json){
            $("#currentCity").html(json.name); 
            $("#weather_image").attr("src", "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png");
            $("#temp").html(((json.main.temp-273.15) * 9/5 + 32).toFixed(1));
            $("#humidity").html(json.main.humidity);
        })
        }); 

})

// need to get moment.js to get todays date on display 
