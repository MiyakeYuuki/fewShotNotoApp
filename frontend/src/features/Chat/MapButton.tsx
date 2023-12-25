import React from "react";
import { Button } from "@mui/material";
import { MapButtonStyle } from "../../styles/styles";

/**
 * 観光地の情報
 */
interface Location {
	name: string;
	lat: number;
	lng: number;
}

/**
 * マップリンクボタンのprops
 */
interface MapLinkButtonProps {
	location: Location;
	label: string;
}

/**
 * マップリンクボタンコンポーネント
 * @param {Location} location 観光地の情報
 * @param {string} label ボタンのラベル
 * @returns {ReactNode} マップリンクボタン
 */
const MapButton: React.FC<MapLinkButtonProps> = ({ location, label }) => {
	const handleButtonClick = () => {
		const encodedName = encodeURIComponent(location.name);
		const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${encodedName}`;
		window.open(googleMapsUrl, "_blank");
	};

	return (
		<Button onClick={handleButtonClick} style={MapButtonStyle}>
			{label}
		</Button>
	);
};

export default MapButton;
