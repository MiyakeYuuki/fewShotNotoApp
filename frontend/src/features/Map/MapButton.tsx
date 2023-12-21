import React from "react";
import { Button } from "@mui/material";
import { MapButton } from "../../styles/styles";

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface MapLinkButtonProps {
  location: Location;
  label: string;
}


/**
 * マップリンクボタンコンポーネント
 * @param {object} location 観光地の情報
 * @param {string} label ボタンのラベル
 * @returns {TSX.Element}マップリンクボタン
 */
const MapLinkButton: React.FC<MapLinkButtonProps> = ({ location, label }) => {
  const handleButtonClick = () => {
    const encodedName = encodeURIComponent(location.name);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${encodedName}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <Button onClick={handleButtonClick} style={MapButton}>
      {label}
    </Button>
  );
};

export default MapLinkButton;
