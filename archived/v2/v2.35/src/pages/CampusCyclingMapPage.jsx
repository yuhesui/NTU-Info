import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'https://esm.sh/react-leaflet@4.2.1';
import { Info } from 'https://esm.sh/lucide-react';
import { CYCLING_MAP_CONFIG } from '../constants/config.js';

const CampusCyclingMapPage = () => {
    const [mapData, setMapData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('src/data/cycling.json')
            .then(response => response.json())
            .then(data => {
                setMapData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching cycling data:", error);
                setLoading(false);
            });
    }, []);
    
    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-[600px]">Loading map data...</div>
            </div>
        );
    }
    
    if (!mapData) {
        return (
             <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-[600px] text-red-500">Failed to load map data.</div>
            </div>
        );
    }

    const bikeIcon = L.icon({
        iconUrl: CYCLING_MAP_CONFIG.BIKE_ICON_URL,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    const toolIcon = L.icon({
        iconUrl: CYCLING_MAP_CONFIG.TOOL_ICON_URL,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Campus Cycling Map</h1>
                    <p className="mt-2 text-lg text-gray-600">Explore cycling routes, bike parking, and repair stations across NTU.</p>
                </div>
                <div className="flex items-center space-x-2 mt-4 md:mt-0 p-2 bg-yellow-100 border border-yellow-300 rounded-lg">
                    <Info className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-700">This feature is currently in Beta.</span>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex flex-wrap gap-6 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#4A90E2]"></div>
                        <span className="font-medium">Cycling Route</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <img src={CYCLING_MAP_CONFIG.BIKE_ICON_URL} className="w-5 h-5" alt="Bike Parking Icon" />
                        <span className="font-medium">Bike Parking</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <img src={CYCLING_MAP_CONFIG.TOOL_ICON_URL} className="w-5 h-5" alt="Repair Station Icon" />
                        <span className="font-medium">Repair Station</span>
                    </div>
                </div>
                <MapContainer center={CYCLING_MAP_CONFIG.INITIAL_CENTER} zoom={CYCLING_MAP_CONFIG.INITIAL_ZOOM} scrollWheelZoom={false} className="h-[600px] w-full rounded-lg shadow-md z-0">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {mapData.routes.map((route, idx) => (
                        <Polyline key={idx} positions={route.positions} pathOptions={{ color: route.color, weight: 5 }}>
                            <Popup><b>{route.name}</b></Popup>
                        </Polyline>
                    ))}
                    {mapData.parking.map((park, idx) => (
                        <Marker key={`park-${idx}`} position={park.position} icon={bikeIcon}>
                            <Popup>
                                <b>{park.name}</b><br />{park.description}
                            </Popup>
                        </Marker>
                    ))}
                    {mapData.repair_stations.map((station, idx) => (
                        <Marker key={`station-${idx}`} position={station.position} icon={toolIcon}>
                             <Popup>
                                <b>{station.name}</b><br />{station.description}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default CampusCyclingMapPage;
