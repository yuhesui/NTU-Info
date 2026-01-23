const React = window.React;
const { useState, useEffect, useRef } = React;

const MapComponent = ({ data }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapContainerRef.current || !window.L) return;

        if (mapInstanceRef.current === null) {
            const map = L.map(mapContainerRef.current).setView([1.3483, 103.6831], 15);
            mapInstanceRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const bikeIcon = L.icon({
                iconUrl: 'https://img.icons8.com/ios-filled/50/4A90E2/bicycle.png',
                iconSize: [30, 30],
                iconAnchor: [15, 30],
                popupAnchor: [0, -30]
            });

            const toolIcon = L.icon({
                iconUrl: 'https://img.icons8.com/ios-filled/50/f5a623/maintenance.png',
                iconSize: [30, 30],
                iconAnchor: [15, 30],
                popupAnchor: [0, -30]
            });
            
            data.routes.forEach(route => {
                L.polyline(route.positions, { color: route.color, weight: 5 })
                 .bindPopup(`<b>${route.name}</b>`)
                 .addTo(map);
            });

            data.parking.forEach(park => {
                L.marker(park.position, { icon: bikeIcon })
                 .bindPopup(`<b>${park.name}</b><br>${park.description}`)
                 .addTo(map);
            });

            data.repair_stations.forEach(station => {
                L.marker(station.position, { icon: toolIcon })
                 .bindPopup(`<b>${station.name}</b><br>${station.description}`)
                 .addTo(map);
            });
        }
    }, [data]);

    return React.createElement('div', { ref: mapContainerRef, className: 'h-[600px] w-full rounded-lg shadow-md z-0' });
};

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
    
    useEffect(() => {
        lucide.createIcons();
    });

    return React.createElement('div', { className: 'container mx-auto px-4 py-8' },
        React.createElement('div', { className: 'flex flex-col md:flex-row md:items-center justify-between mb-6' },
            React.createElement('div', null,
                React.createElement('h1', { className: 'text-4xl font-bold text-gray-900' }, 'Campus Cycling Map'),
                React.createElement('p', { className: 'mt-2 text-lg text-gray-600' }, 'Explore cycling routes, bike parking, and repair stations across NTU.')
            ),
            React.createElement('div', { className: 'flex items-center space-x-2 mt-4 md:mt-0 p-2 bg-yellow-100 border border-yellow-300 rounded-lg' },
                React.createElement('i', { 'data-lucide': 'info', className: 'w-5 h-5 text-yellow-600' }),
                React.createElement('span', { className: 'text-sm font-medium text-yellow-700' }, 'This feature is currently in Beta.')
            )
        ),
        React.createElement('div', { className: 'bg-white p-6 rounded-xl shadow-lg' },
            React.createElement('div', { className: 'flex flex-wrap gap-6 mb-6' },
                React.createElement('div', { className: 'flex items-center gap-2' },
                    React.createElement('div', { className: 'w-4 h-4 rounded-full bg-[#4A90E2]' }),
                    React.createElement('span', { className: 'font-medium' }, 'Cycling Route')
                ),
                 React.createElement('div', { className: 'flex items-center gap-2' },
                    React.createElement('img', { src: 'https://img.icons8.com/ios-filled/50/4A90E2/bicycle.png', className: 'w-5 h-5' }),
                    React.createElement('span', { className: 'font-medium' }, 'Bike Parking')
                ),
                 React.createElement('div', { className: 'flex items-center gap-2' },
                    React.createElement('img', { src: 'https://img.icons8.com/ios-filled/50/f5a623/maintenance.png', className: 'w-5 h-5' }),
                    React.createElement('span', { className: 'font-medium' }, 'Repair Station')
                )
            ),
            loading
                ? React.createElement('div', { className: 'flex justify-center items-center h-[600px]' }, 'Loading map data...')
                : mapData
                    ? React.createElement(MapComponent, { data: mapData })
                    : React.createElement('div', { className: 'flex justify-center items-center h-[600px] text-red-500' }, 'Failed to load map data.')
        )
    );
};

export default CampusCyclingMapPage;
