$(document).ready (function(){

    $("#search-button").on("click", function(){
        console.log("Hi")
    });

    $(".history").on("click", function(){

        
    })

    function makeRow (text){
        var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
        $(".history").append(li);
    }

    function searchWeather(searchValue){
        $ajax({
            type:"GET",
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=9c135dd303b912f70f9f217a0fcfb173",
            dataType: "json",
            success: function(data){

                if (history.indexOf(searchValue) === -1){
                    history.push(searchValue);
                    window.localStorage.setItem("history", JSON.stringify(history));

                    makeRow(searchValue);
                }

                $("#today").empty();

                var title = $("<h3>").addClass("card-title".text(data.name + " (" + new Date().toLocaleDate));
                var card = $("<div>").addClass("card");
                var wind = $("<p>").addClass("card-text").text("Wind Speed:" + data.wind.speed + " MPH");
                var humid = $("<p>").addClass("card-text").text("Humidity:" + data.main.humidity + "%");
                var temp = $("<p>").addClass("card-text").text("Temperature:" + data.main.temp + " F");
                var cardBody = $("<div>").addCLass("card-body");
                var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + );


                title.append(img);
                cardBody.append(title, temp, humid, wind);
                card.append(cardBody);
                $("#today").append(card);

                getForecast(searchValue);
                getUVIndex(data.coord.lat, data.coord.lon);
            }

        });
    }

    function getForecast(searchValue) {
        $ajax({
            type:"GET",
            url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=9c135dd303b912f70f9f217a0fcfb173",
            dataType: "json",
            success: function(data){
                $("#forecast").html("<h4 class= \"mt-3\">5-Day Forecast: </h4>").append("div class=\"row\">");

                for (var i=0;i<data.list.length; i++){

                    if (data.list[i].dt_text.indexOf("15:00:00") !== -1 ) {
                        var col = $("<div>").addClass("col=md-2");
                        var card = $("<div>").addClass("card bg-primary text-white");
                        var body=$("<div>").addClass("card-body p-2");

                        var title = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocalStorage);

                        var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather);

                        var p1 = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp_max + "F");
                        var p2 = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");

                        col.append(card.append(body.append(title, img, p1, p2)));
                        $("#forecast .row").append(col);    
                    }
                }
            }
        });
    }

    //get current history (if available from local storage)
    var history = JSON.parse(window.localStorage.getItem("history")) || [];

    if (history.length > 0) {
        searchWeather(history[history.length-1]);
    }

    for (var i=0;i<history.length;i++){
        makeRow(hisotry[i]);
    }

});