const wrapper = document.getElementById("wrapper");
const input = document.querySelector(".finder");
let acc = document.getElementsByClassName("accordion");

let i = 0;
var x, y;
var inputCity, inputCountry;

for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("active");
    let panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}

mapboxgl.accessToken =
  "pk.eyJ1IjoiaXNoaWRhNTMwIiwiYSI6ImNrbDlvZnBybjBydjMyd3J2bXZ4bWE5N2gifQ.HTvWU1KONIHSqR54vaHuHw";
let map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-79.4512, 43.6568],
  zoom: 13,
});

let geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
});
document.getElementById("geocoder").appendChild(geocoder.onAdd(map));
const placeholderInput = document.querySelector("input");
placeholderInput.setAttribute("placeholder", "Enter the city...");

input.addEventListener("change", async (e) => {
  inputCity = e.target.value;
  let params = {
    q: inputCity,
    format: "json",
  };
  axios
    .get("https://nominatim.openstreetmap.org/search", {
      params: params,
    })
    .then(function (response) {
      x = response.data[0].lat;
      y = response.data[0].lon;

      i++;
      if (i !== 1) return;

      var params = {
        lon: y,
        lat: x,
      };
      apiKey = "UBQDIH1h1LCEG7ONpSB5JLLa9lckINJ0FCHnPif0";
      axios
        .get(
          `https://api.nasa.gov/planetary/earth/imagery?lon=${y}&lat=${x}&date=2014-02-01&api_key=${apiKey}`,
          {
            params: params,
          }
        )
        .then(function (response) {
          i = 0;
          console.log(response);
          let urlNasa = response.config.url;
          wrapper.setAttribute("style", "display:flex !important");
          const img = document.createElement("img");
          const headline = document.createElement("h2");
          const divWrapper = document.createElement("div");
          img.classList.add("nasaImg");
          img.setAttribute("src", `${urlNasa}`);
          divWrapper.classList.add("container");
          wrapper.appendChild(divWrapper);
          headline.innerText = inputCity;
          divWrapper.appendChild(headline);
          divWrapper.appendChild(img);
          inputCity.value = "";
          return;
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {});
    })

    .catch(function (error) {
      console.log(error);
      alert("error, wrong latitude or longitude, please try again");
      return;
    })
    .then(function () {});
});
