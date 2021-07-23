# React Leaflet Lat/Lng Graticule

This graticule displays a latitude/longitude cells on a Leaflet map.
See known issues [HERE](https://github.com/dnlbaldwin/React-Leaflet-Lat-Lng-Graticule/issues)

See the live demo [HERE](https://dnlbaldwin.github.io/React-Leaflet-Lat-Lng-Graticule/)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This library uses React-Leaflet-V3. It is not tested with React-Leaflet-V2. If compatibility with V2 is required, try out: [React-Leaflet-Graticule](https://github.com/CraigCottingham/react-leaflet-graticule)

### Installing

To install all dependencies run the following command:

```
npm install
```

To run the example on your desktop, navigate to the example directory and run:

```
npm start
```

## Running the tests

No unit tests at this time.

## Usage

```js
import { LayerGroup, LayersControl, MapContainer, TileLayer } from 'react-leaflet';
import './App.css';

import LatLngGraticule from 'react-leaflet-lat-lng-graticule';

// Assigning the same name to the overlay as it's named in the control box
// makes it much easier to toggle it on and off when multiple overlays
// are employed.
const latLngGraticuleName = 'LAT/LNG';
// Controls whether the overlay is displayed on map load
const overlayEnabled = true;
function App() {
  return (
    <MapContainer
      center={[45.4, -75.7]}
      zoom={8}
      minZoom={3}
      maxZoom={16}
      maxBounds={[
        [-90, -180],
        [90, 180],
      ]}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="ESRI Satellite">
          <TileLayer
            url="https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://wiki.openstreetmap.org/wiki/Esri"></a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="ESRI Clarity">
          <TileLayer
            url="https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://wiki.openstreetmap.org/wiki/Esri"></a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OSM Topo">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OSM Topo">
          <TileLayer url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png" attribution="OSM" />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay checked={overlayEnabled} name={latLngGraticuleName}>
          <LayerGroup>
            <LatLngGraticule checked={overlayEnabled} name={latLngGraticuleName} />
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}

export default App;
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details
