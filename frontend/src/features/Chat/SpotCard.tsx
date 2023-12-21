import React from 'react';
import {
    Button,
    Typography,
    CardContent,
    Card
} from "@mui/material";
import {
    areaButtonStyle,
    categoryButtonStyle,
    keywordButtonStyle,
} from '../../styles/styles';
import { typeSpots } from '../../functions/FirestoreFunction';
import MapLinkButton from '../Map/MapButton';
interface SpotCardProps {
    spot: typeSpots
}

const SpotCard: React.FC<SpotCardProps> = ({ spot }) => {
    return (
        <Card key={spot.id} style={{ border: '1px solid #ccc' }}>
            <CardContent>
                <Typography variant="h6">
                    <strong>
                        名前：
                        <a href={spot.url} target="_blank" rel="noopener noreferrer">
                            {spot.name}
                        </a>
                    </strong>
                    <MapLinkButton
                        location={{
                            name: spot.name,
                            lat: spot.geopoint.latitude,
                            lng: spot.geopoint.longitude,
                        }}
                        label="MAP"
                    />
                </Typography>
                <div>
                    エリア：
                    <Button
                        variant="contained"
                        style={areaButtonStyle}
                    // onClick={handleButtonClick}
                    >
                        {spot.area}
                    </Button>
                </div>
                <Typography variant="body1">
                    カテゴリ：
                    {spot.category
                        .split(',')
                        .map((category) => category.trim())
                        .filter(category => category !== "")
                        .map((category, index) => (
                            <Button
                                variant="contained"
                                style={categoryButtonStyle}
                                key={index} >
                                {category.trim()}
                                {/* onClick={handleButtonClick} */}
                            </Button>
                        ))}
                </Typography>
                <Typography variant="body1">
                    キーワード：
                    {spot.keyword
                        .split(',')
                        .map((keyword) => keyword.trim())
                        .filter(keyword => keyword !== "")
                        .map((keyword, index) => (
                            <Button
                                variant="contained"
                                style={keywordButtonStyle}
                                key={index} >
                                {keyword.trim()}
                                {/* onClick={handleButtonClick} */}
                            </Button>
                        ))}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default SpotCard;