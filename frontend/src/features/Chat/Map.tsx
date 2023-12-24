import React, { useState, useRef, useEffect } from "react";
import { typeSpots } from "../../functions/FirestoreFunction";
import { Card } from "@mui/material";
import { GoogleMap, LoadScriptNext, MarkerF } from "@react-google-maps/api";

/**
 * 観光地の情報を管理するstate
 */
interface MapProps {
  spots: typeSpots[];
}

/**
 * 現在地の緯度経度とエラーの状態を管理するstate
 */
interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

/**
 * 観光地のMAPを表示するコンポーネント
 * @param {typeSpots} spots 観光地の情報
 * @returns {ReactNode}　観光地のMAPを表示　
 */
const Map: React.FC<MapProps> = ({ spots }) => {
  const mapRef = useRef<google.maps.Map>();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [markersLoaded, setMarkersLoaded] = useState(0);
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
  });
  const mapContanerStyle = {
    width: "100%",
    height: "400px",
  };
  const defaultCenter = { lat: 36.648303564849584, lng: 136.96126538496677 }; // 砺波市役所の緯度経度
  const mapApiKey = process.env.REACT_APP_GOOGLEMAP_APIKEY as string;
  const MAP_ZOOM_LEVEL = 8;
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    setMapLoaded(true);
  };
  const handleMarkerLoad = () => {
    setMarkersLoaded((prev) => prev + 1);
  };
  useEffect(() => {
    if (
      mapLoaded &&
      markersLoaded === spots.length &&
      mapRef.current &&
      spots.length > 0
    ) {
      const bounds = new google.maps.LatLngBounds();
      spots.forEach((spot) => {
        bounds.extend(
          new google.maps.LatLng(
            spot.geopoint.latitude,
            spot.geopoint.longitude
          )
        );
      });
      if (location.latitude !== null && location.longitude !== null) {
        bounds.extend(
          new google.maps.LatLng(location.latitude, location.longitude)
        );
      }
      mapRef.current.fitBounds(bounds);
    }
  }, [spots, mapLoaded, markersLoaded]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prevState) => ({
        ...prevState,
        error:
          "あなたが使用しているブラウザはGeolocationをサポートしていません。",
      }));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        () => {
          setLocation((prevState) => ({
            ...prevState,
            error: "あなたの位置情報を取得することができません。",
          }));
        }
      );
    }
  }, []);
  return (
    <div>
      <Card style={{ border: "1px solid #ccc" }}>
        <LoadScriptNext googleMapsApiKey={mapApiKey}>
          <GoogleMap
            mapContainerStyle={mapContanerStyle}
            onLoad={handleMapLoad}
            center={defaultCenter}
            zoom={MAP_ZOOM_LEVEL}
          >
            {spots.map((spot) => (
              <MarkerF
                key={spot.id}
                position={{
                  lat: spot.geopoint.latitude,
                  lng: spot.geopoint.longitude,
                }}
                onLoad={handleMarkerLoad}
                label={spot.name}
              />
            ))}
            {location.latitude !== null && location.longitude !== null && (
              <MarkerF
                position={{
                  lat: location.latitude,
                  lng: location.longitude,
                }}
                label="現在地"
              />
            )}
          </GoogleMap>
        </LoadScriptNext>
      </Card>
    </div>
  );
};

export default Map;
