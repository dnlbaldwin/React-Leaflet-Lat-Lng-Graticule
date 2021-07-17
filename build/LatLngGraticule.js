import { useEffect, useState } from 'react';
import { useMapEvents } from 'react-leaflet';
var defaultLatLngInterval = [
    20,
    20,
    20,
    20,
    10,
    10,
    5,
    5,
    1,
    1,
    0.25,
    0.25,
    0.1,
    0.05,
    0.05,
    0.05,
    0.025,
    0.025,
    0.025,
];
var drawGraticule = function (map, canvas, style) {
    // Determine lat/lng interval
    // TODO Set default value if index not found
    var currentLatLngInterval = defaultLatLngInterval[Math.round(map.getZoom())];
    var ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }
    var leftTopLl = map.containerPointToLatLng({
        x: 0,
        y: 0,
    });
    var rightBottomLl = map.containerPointToLatLng({
        x: canvas.width,
        y: canvas.height,
    });
    var baseStartingLatitude = Math.floor(rightBottomLl.lat / currentLatLngInterval) * currentLatLngInterval;
    var baseStartingLongitude = Math.floor(leftTopLl.lng / currentLatLngInterval) * currentLatLngInterval;
    for (var i = baseStartingLatitude; i <= leftTopLl.lat; i += currentLatLngInterval) {
        var westEnd = map.latLngToContainerPoint({
            lat: i,
            lng: leftTopLl.lng,
        });
        var eastEnd = map.latLngToContainerPoint({
            lat: i,
            lng: rightBottomLl.lng,
        });
        ctx.lineWidth = style.outLineWeight;
        ctx.strokeStyle = style.outlineColour;
        ctx.fillStyle = style.outlineColour;
        ctx.beginPath();
        ctx.moveTo(westEnd.x, westEnd.y);
        ctx.lineTo(eastEnd.x, eastEnd.y);
        ctx.stroke();
        ctx.lineWidth = style.lineWeight;
        ctx.strokeStyle = style.lineColour;
        ctx.fillStyle = style.lineColour;
        ctx.stroke();
        // Draw the labels
        var labelText = ((i / currentLatLngInterval) * currentLatLngInterval)
            .toFixed(3)
            .toString()
            .replace(/(\.0+|0+)$/, '');
        var textWidth = ctx.measureText(labelText).width;
        var textHeight = ctx.measureText(labelText).actualBoundingBoxAscent;
        ctx.fillStyle = style.lineColour;
        ctx.fillRect(westEnd.x + textWidth / 2 + 1, westEnd.y - textHeight, textWidth + 3, textHeight + 6);
        ctx.fillStyle = style.outlineColour;
        ctx.font = style.fontType;
        ctx.fillText(labelText, westEnd.x + textWidth / 2 + 2, westEnd.y + 3);
    }
    for (var i = baseStartingLongitude; i <= rightBottomLl.lng; i += currentLatLngInterval) {
        var northEnd = map.latLngToContainerPoint({
            lat: leftTopLl.lat,
            lng: i,
        });
        var southEnd = map.latLngToContainerPoint({
            lat: rightBottomLl.lat,
            lng: i,
        });
        ctx.lineWidth = style.outLineWeight;
        ctx.strokeStyle = style.outlineColour;
        ctx.fillStyle = style.outlineColour;
        ctx.beginPath();
        ctx.moveTo(northEnd.x, northEnd.y);
        ctx.lineTo(southEnd.x, southEnd.y);
        ctx.stroke();
        ctx.lineWidth = style.lineWeight;
        ctx.strokeStyle = style.lineColour;
        ctx.fillStyle = style.lineColour;
        ctx.stroke();
        // Draw the labels
        var labelText = ((i / currentLatLngInterval) * currentLatLngInterval)
            .toFixed(3)
            .toString()
            .replace(/(\.0+|0+)$/, '');
        var textWidth = ctx.measureText(labelText).width;
        var textHeight = ctx.measureText(labelText).actualBoundingBoxAscent;
        ctx.fillStyle = style.lineColour;
        ctx.fillRect(southEnd.x - textWidth / 2 - 1, southEnd.y - textHeight - 9, textWidth + 3, textHeight + 6);
        ctx.fillStyle = style.outlineColour;
        ctx.font = style.fontType;
        ctx.fillText(labelText, southEnd.x - textWidth / 2, southEnd.y - 6);
    }
};
//TODO - Add line props, zoom interval props
var LatLngGraticule = function (props) {
    // Line/label properties
    var fontColour = '#000';
    var fontBackground = '#FFF';
    var lineColor = '#000';
    var lineOutlineColor = '#FFF';
    var lineWeight = 2;
    var lineOutlineWeight = 3;
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
            drawGraticule(map, canvas, {
                lineWeight: lineWeight,
                outLineWeight: lineOutlineWeight,
                lineColour: lineColor,
                outlineColour: lineOutlineColor,
                fontType: '16px Courier New',
            });
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