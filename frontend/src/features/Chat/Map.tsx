import React, { useState, useEffect } from "react";
import { typeSpots } from "../../functions/FirestoreFunction";
import { Card } from "@mui/material";
import {
	GoogleMap,
	LoadScriptNext,
	MarkerF,
	InfoWindow,
	Marker,
} from "@react-google-maps/api";

interface MapProps {
	spots: typeSpots[];
}

interface LocationState {
	latitude: number | null;
	longitude: number | null;
	error: string | null;
}

const Map: React.FC<MapProps> = ({ spots }) => {
	const [location, setLocation] = useState<LocationState>({
		latitude: null,
		longitude: null,
		error: null,
	});
	const [selectedSpot, setSelectedSpot] = useState<typeSpots | null>(null);
	const [encodedName, setEncodedName] = useState<string | null>(null);

	const mapContainerStyle = {
		width: "100%",
		height: "400px",
	};
	const defaultCenter = { lat: 37.18, lng: 137.0 };
	const MAP_API_KEY = process.env.REACT_APP_GOOGLEMAP_APIKEY as string;
	const MAP_ZOOM_LEVEL = 9;

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

	const handleMarkerClick = (spot: typeSpots) => {
		setSelectedSpot(spot);
		setEncodedName(encodeURIComponent(spot.name));
	};

	const handleInfoWindowClose = () => {
		setSelectedSpot(null);
	};

	return (
		<div>
			<Card style={{ border: "1px solid #ccc" }}>
				<LoadScriptNext googleMapsApiKey={MAP_API_KEY}>
					<GoogleMap
						mapContainerStyle={mapContainerStyle}
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
								label={spot.name}
								onClick={() => handleMarkerClick(spot)}
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
						{selectedSpot && (
							<InfoWindow
								position={{
									lat: selectedSpot.geopoint.latitude,
									lng: selectedSpot.geopoint.longitude,
								}}
								onCloseClick={handleInfoWindowClose}
								options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
							>
								<div>
									<h3>{selectedSpot.name}</h3>
									<p>
										<a href={`https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${encodedName}`} target="_blank" rel="noopener noreferrer">
											道案内を開く
										</a>
									</p>
								</div>
							</InfoWindow>
						)}
					</GoogleMap>
				</LoadScriptNext>
			</Card>
		</div>
	);
};

export default Map;
