import React, { useEffect, useState } from "react";
import NavIcon from "../assets/icons/nav.png";
import AimIcon from "../assets/icons/aim.png";

const Map = () => {
  const [address, setAddress] = useState();
  const [temp, setTemp] = useState();
  const [humidity, setHumidity] = useState();
  const [description, setDescription] = useState();
  const [currentPosition, setCurrentPosition] = useState({
    lat: 10.987963,
    lng: -74.7888312,
  });

  useEffect(() => {
    let map;
    const loadGoogleApi = setInterval(() => {
      if (window.google) {
        const google = window.google;
        clearInterval(loadGoogleApi);

        const mapCenter = new google.maps.LatLng(
          currentPosition.lat,
          currentPosition.lng
        );
        map = new google.maps.Map(document.getElementById("map"), {
          center: mapCenter,
          zoom: 14,
        });
        new google.maps.Marker({ position: mapCenter, map });

        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ location: mapCenter }, (results, status) => {
          if (status === "OK") {
            if (results[0]) {
              setAddress(results[0].formatted_address);
            } else {
              window.alert("No results found");
            }
          } else {
            window.alert("Geocoder failed due to: " + status);
          }
        });

        const services = new google.maps.places.PlacesService(map);
        services.nearbySearch(
          { location: mapCenter, map, type: "cafe", radius: 10000 },
          (results, status) => {
            if (status === "OK") {
              if (results.length) {
                results.forEach((place) => {
                  new google.maps.Marker({
                    position: place.geometry.location,
                    icon: "http://maps.google.com/mapfiles/kml/pal2/icon54.png",
                    label: place.name,
                    map,
                  });
                });
              } else {
                window.alert("No hay cafeterías cercanas a esta zona");
              }
            } else if (status === "ZERO_RESULTS") {
              window.alert("No hay cafeterías cercanas a esta zona");
            } else {
              window.alert("PlacesService failed due to: " + status);
            }
          }
        );
      }
    }, 100);

    const weatherInfo = async () => {
      const weather = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${currentPosition.lat}&lon=${currentPosition.lng}&appid=fa6a6ccde96758e3cd6be8a62e4a1274&units=metric&lang=es`
      );

      if (weather.status === 200) {
        const response = await weather.json();
        setTemp(response.main.temp);
        setHumidity(response.main.humidity);
        setDescription(response.weather[0].description);
      } else {
        window.alert("Weather API Error: " + weather.statusText);
      }
    };
    weatherInfo();
  }, [currentPosition.lat, currentPosition.lng]);

  const getPosition = (position) => {
    const currentPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    setCurrentPosition(currentPosition);
  };

  const onLocate = () => {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(getPosition);
  };

  return (
    <div className="space-y-4">
      <div id="map" />
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="location-description">
          <span className="inline-content">
            <img src={NavIcon} alt="Nav Icon" />
            <p>{address}</p>
          </span>
        </div>
        <div className="locate-button" onClick={onLocate}>
          <span className="inline-content">
            <p>Mi localización</p> <img src={AimIcon} alt="Aim Icon" />
          </span>
        </div>
      </div>
      <div>
        <p className="location-description">Clima:</p>
        <table className="text-center md:mt-2 md:ml-6 mx-auto">
          <thead>
            <tr className="title-table divide-x divide-black">
              <th className="p-2">Temperatura</th>
              <th className="p-2">Humedad</th>
              <th className="p-2">Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr className="divide-x divide-black">
              <td className="p-2">{`${temp} ºC`}</td>
              <td className="p-2">{`${humidity} %`}</td>
              <td className="p-2">{description}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Map;
