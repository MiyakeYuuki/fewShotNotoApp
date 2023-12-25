import React from 'react';
import {
    Box,
    Button,
    Typography,
    CardContent,
    Card,
} from "@mui/material";
import { BoxProps } from '@mui/material/Box';
import {
    areaButtonStyle,
    categoryButtonStyle,
    keywordButtonStyle,
} from '../../styles/styles';
import { typeSpots } from '../../functions/FirestoreFunction';
import MapButton from './MapButton';

/**
 * 観光地の情報
 */
interface SpotCardProps {
    spot: typeSpots
}

/**
 * Boxコンポーネントのprops
 * @param {BoxProps} props Boxのprops styleを継承
 * @returns {ReactNode} Boxコンポーネント
 */
function Item(props: BoxProps) {
    const { sx, ...other } = props;
    return (
        <Box
            sx={{
                p: 1,
                m: 1,
                fontSize: '0.875rem',
                fontWeight: '700',
                margin: 0,
                padding: 0,
                ...sx,
            }}
            {...other}
        />
    );
}

/**
 * 観光地のカードコンポーネント
 * @param {typeSpots} spot 観光地の情報
 * @returns {ReactNode} 観光地のカード
 */
const SpotCard: React.FC<SpotCardProps> = ({ spot }) => {
    return (
        <Card key={spot.id} style={{ border: '1px solid #ccc' }}>
            <CardContent>
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    marginBottom: '10px',
                }}>
                    <Item sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">
                            <strong>
                                名前：
                                <a href={spot.url} target="_blank" rel="noopener noreferrer">
                                    {spot.name}
                                </a>
                            </strong>
                        </Typography>
                    </Item>
                    <Item>
                        <MapButton
                            location={{
                                name: spot.name,
                                lat: spot.geopoint.latitude,
                                lng: spot.geopoint.longitude,
                            }}
                            label="MAP"
                        />
                    </Item>
                </Box>
                <div>
                    エリア：
                    <Button
                        variant="contained"
                        style={areaButtonStyle}
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
                            </Button>
                        ))}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default SpotCard;