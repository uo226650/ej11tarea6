// Tarea 6: Aplicación de temática libre en JavaScript usando el API de Google Maps

// TAW y WAVE dan problemas de accesibilidad debido a la naturaleza de los mapas dinámicos de google

/**
 * Esta aplicación ofrece servicio de meteorología localizado a través de un mapa.
 * El usuario puebe consultar los datos meteorológicos de un determinado
 * punto en el mapa con solo pinchar con el ratón.
 */
class Meteo {
  constructor(latitud, longitud, mapa) {
    this.mapa = mapa;
    this.apikey = "07b6411b853066034815f4b565dd1922";
    this.codigoPais = "ES";
    this.unidades = "&units=metric";
    this.idioma = "&lang=es";
    this.url = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitud + "&lon=" + longitud + this.unidades + this.idioma + "&appid=" + this.apikey;
    this.correcto = "¡Todo correcto! JSON recibido de <a href='http://openweathermap.org'>OpenWeatherMap</a>"
  }

  procesaJSON() {
    $.ajax({
      context: this, //Paso la referencia al objeto Meteo como contenido del context de ajax
      dataType: "json",
      url: this.url,
      method: 'GET',
      success: function (datos) {

        //Presentación de los datos contenidos en JSON

        var stringDatos = "<ul><li>Ciudad: " + datos.name + "</li>";
        stringDatos += "<li>País: " + datos.sys.country + "</li>";
        stringDatos += "<li>Latitud: " + datos.coord.lat + " grados</li>";
        stringDatos += "<li>Longitud: " + datos.coord.lon + " grados</li>";
        stringDatos += "<li>Temperatura: " + datos.main.temp + " grados Celsius</li>";
        stringDatos += "<li>Temperatura máxima: " + datos.main.temp_max + " grados Celsius</li>";
        stringDatos += "<li>Temperatura mínima: " + datos.main.temp_min + " grados Celsius</li>";
        stringDatos += "<li>Presión: " + datos.main.pressure + " milibares</li>";
        stringDatos += "<li>Humedad: " + datos.main.humidity + " %</li>";
        stringDatos += "<li>Amanece a las: " + new Date(datos.sys.sunrise * 1000).toLocaleTimeString() + "</li>";
        stringDatos += "<li>Oscurece a las: " + new Date(datos.sys.sunset * 1000).toLocaleTimeString() + "</li>";
        stringDatos += "<li>Dirección del viento: " + datos.wind.deg + " grados</li>";
        stringDatos += "<li>Velocidad del viento: " + datos.wind.speed + " metros/segundo</li>";
        stringDatos += "<li>Hora de la medida: " + new Date(datos.dt * 1000).toLocaleTimeString() + "</li>";
        stringDatos += "<li>Fecha de la medida: " + new Date(datos.dt * 1000).toLocaleDateString() + "</li>";
        stringDatos += "<li>Descripción: " + datos.weather[0].description + "</li>";
        stringDatos += "<li>Visibilidad: " + datos.visibility + " metros</li>";
        stringDatos += "<li>Nubosidad: " + datos.clouds.all + " %</li></ul>";

        this.ciudad = datos.name;

        var icono = "<img src= '" +
          "http://openweathermap.org/img/wn/" + datos.weather[0].icon + "@2x.png '"
          + "alt='Icono " + datos.weather[0].description + "' />";

        $("#datos").html(stringDatos);
        $("h2").html(this.ciudad);
        $(".icono").html(icono);
        this.actualizaInfoWindow();
      },
      error: function () {
        $("h2").html("¡Tenemos problemas! No puedo obtener JSON de <a href='http://openweathermap.org'>OpenWeatherMap</a>");
        $("#datos").remove();
      }
    });
  }

  actualizaInfoWindow(){
    this.mapa.infoWindow.setContent( //Etiqueta en el mapa personalizada de estilo (aquel asignado a elementos <p> en el css)
      "<p>" + this.ciudad + "</p>" //Etiqueta en el mapa personalizada con el contenido dinámico (nombre de la ciudad)
    );
  }

  verJSON() {
    this.procesaJSON();
  }
}

class Mapa {
  
  initMap() {
    const myLatlng = { lat: 43.413197, lng: -6.149665 }; //Centro de inicio
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: myLatlng,
    });
    // Create the initial InfoWindow.
    this.infoWindow = new google.maps.InfoWindow({
      content: "Pulsa para obtener datos climatológicos",
      position: myLatlng,
    });
    this.infoWindow.open(map);
    // Configure the click listener.
    map.addListener("click", (mapsMouseEvent) => {
      // Close the current InfoWindow.
      this.infoWindow.close();
      this.muestraClima(mapsMouseEvent);
      // Create a new InfoWindow.
      this.infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });
      this.infoWindow.open(map);
    });
  }

  muestraClima(mapsMouseEvent) {
    var latitud = mapsMouseEvent.latLng.lat();
    var longitud = mapsMouseEvent.latLng.lng();
    this.meteo = new Meteo(latitud, longitud, this);
    this.meteo.verJSON();
  }
}

var mapa = new Mapa();

