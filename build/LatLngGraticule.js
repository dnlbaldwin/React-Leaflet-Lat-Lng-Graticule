import { useEffect, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
var defaultLatLngInterval = [
    { zoom: 0, interval: 20 },
    { zoom: 1, interval: 20 },
    { zoom: 2, interval: 20 },
    { zoom: 3, interval: 20 },
    { zoom: 4, interval: 10 },
    { zoom: 5, interval: 10 },
    { zoom: 6, interval: 10 },
    { zoom: 7, interval: 10 },
    { zoom: 8, interval: 5 },
    { zoom: 9, interval: 5 },
    { zoom: 10, interval: 5 },
    { zoom: 11, interval: 5 },
    { zoom: 12, interval: 2.5 },
    { zoom: 13, interval: 2.5 },
    { zoom: 14, interval: 2.5 },
    { zoom: 15, interval: 2.5 },
    { zoom: 16, interval: 1 },
    { zoom: 17, interval: 1 },
    { zoom: 18, interval: 1 },
];
var drawGraticule = function (map, canvas) {
    // Determine lat/lng interval
    var currentLatLngInterval = map.getZoom();
};
//TODO - Add line props, zoom interval props
var LatLngGraticule = function (props) {
    // Line/label properties
    var dash = [2, 2];
    var fontColour = '#aaa';
    var fontBackground = '#fff';
    var lineWeight = 1;
    var showLabel = true;
    var canvas = document.createElement('canvas');
    canvas.classList.add('leaflet-zoom-animated');
    canvas.classList.add(props.name);
    var name = props.name;
    var map = useMapEvents({
        viewreset: function () {
            reset(map, canvas, gridShown);
        },
        move: function () {
            reset(map, canvas, gridShown);
        },
        overlayadd: function (e) {
            showGrid(e, map, canvas, name);
        },
        overlayremove: function (e) {
            clearScreen(e, name, canvas);
        },
    });
    var _a = useState(props.checked), gridShown = _a[0], setGridVisbility = _a[1];
    // Add the canvas only if it hasn't already been added
    if (!map.getPanes().overlayPane.classList.contains(name)) {
        console.log(map.getPanes().overlayPane.classList);
        map.getPanes().overlayPane.appendChild(canvas);
    }
    // Initial draw if required
    useEffect(function () {
        reset(map, canvas, gridShown);
    }, []);
    function reset(map, canvas, showGrid) {
        var mapLeftTop = map.containerPointToLayerPoint([0, 0]);
        canvas.style['transform'] = "translate3d(" + mapLeftTop.x + "px," + mapLeftTop.y + "px,0)";
        canvas.width = map.getSize().x;
        canvas.height = map.getSize().y;
        var ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGraticule(map, canvas);
        }
    }
    function showGrid(e, map, canvas, name) {
        if (e.name === name) {
            setGridVisbility(true);
            reset(map, canvas, true);
        }
    }
    function clearScreen(e, name, canvas) {
        if (e.name === name) {
            var ctx = canvas.getContext('2d');
            if (ctx) {
                setGridVisbility(false);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }
    return null;
};
export default LatLngGraticule;
//# sourceMappingURL=LatLngGraticule.js.map