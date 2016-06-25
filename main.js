var baseUrl = "https://weathersync.herokuapp.com/"
var LocationAPI = {
  getUrl: function() { return baseUrl + "ip" }
},
WeatherAPI = {
  getUrl: function(lat, lon) {
    return baseUrl + "weather/" + lat + "," + lon
  }
}, 
IconAPI = {
  getUrl: function(id) {
    return "https://openweathermap.org/img/w/" + id + ".png"
  }
}

function updateCityHTML(city) {
  getSingleElementByClass("city").innerHTML = city
}

function updateTempHTML(temp) {
  getSingleElementByClass("temp").innerHTML = temp + "&#176;"
}

function updateDescriptionHTML(descriptions) {
  var html = ""
  var el = getSingleElementByClass("description")
  descriptions.forEach(function(description, i) { html += !i ? description : ", " + description })
  el.innerHTML = html
}

function addImagesToImageBox(ids) {
  var imgBox = getSingleElementByClass("img-box")
  ids.forEach(function(id) {
    
    var img = document.createElement("img")
    img.src = IconAPI.getUrl(id)
    imgBox.appendChild(img)

  })
}

function makeRequest(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}

makeRequest(LocationAPI.getUrl()).then(function(data) {
  
  data = JSON.parse(data)
  updateCityHTML(data.city.toUpperCase())

  return makeRequest(WeatherAPI.getUrl(data.location.latitude, data.location.longitude))

}).then(function(data) {

  data = JSON.parse(data)
  updateTempHTML(kelvinToFahrenheit(data.main.temp))
  updateDescriptionHTML(data.weather.map(function(w) { return w.main }))
  debugger
  addImagesToImageBox(data.weather.map(function(w) { return w.icon }))
})


function getSingleElementByClass(klass) {
  return document.getElementsByClassName(klass)[0]
}
function kelvinToFahrenheit(k) {
  k = k*9/5 - 459.67
  return Math.floor(k * 100) / 100 
}
