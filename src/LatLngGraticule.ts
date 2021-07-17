import { LayersControlEvent, LatLng, Map, Point } from 'leaflet';
import { useEffect, useState } from 'react';
import { useMapEvents } from 'react-leaflet';

const defaultLatLngInterval = [
  20, //0
  20, //1
  20, //2
  20, //3
  10, //4
  10, //5
  5, //6
  5, //7
  1, //8
  1, //9
  0.25, //10
  0.25, //11
  0.1, //12
  0.05, //13
  0.05, //14
  0.05, //15
  0.025, //16
  0.025, //17
  0.025, //18
];

interface Style {
  lineWeight: number;
  outLineWeight: number;
  lineColour: string;
  outlineColour: string;
  fontType: string;
}

const drawGraticule = (map: Map, canvas: HTMLCanvasElement, style: Style) => {
  // Determine lat/lng interval
  // TODO Set default value if index not found

  const currentLatLngInterval = defaultLatLngInterval[Math.round(map.getZoom())];

  let ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  const leftTopLl: LatLng = map.containerPointToLatLng(<Point>{
    x: 0,
    y: 0,
  });

  const rightBottomLl: LatLng = map.containerPointToLatLng(<Point>{
    x: canvas.width,
    y: canvas.height,
  });

  const baseStartingLatitude: number = Math.floor(rightBottomLl.lat / currentLatLngInterval) * currentLatLngInterval;

  const baseStartingLongitude: number = Math.floor(leftTopLl.lng / currentLatLngInterval) * currentLatLngInterval;

  for (let i = baseStartingLatitude; i <= leftTopLl.lat; i += currentLatLngInterval) {
    const westEnd = map.latLngToContainerPoint({
      lat: i,
      lng: leftTopLl.lng,
    });

    const eastEnd = map.latLngToContainerPoint({
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

    const labelText = ((i / currentLatLngInterval) * currentLatLngInterval)
      .toFixed(3)
      .toString()
      .replace(/(\.0+|0+)$/, '');
    const textWidth = ctx.measureText(labelText).width;
    const textHeight = ctx.measureText(labelText).actualBoundingBoxAscent;

    ctx.fillStyle = style.lineColour;

    ctx.fillRect(westEnd.x + textWidth / 2 + 1, westEnd.y - textHeight, textWidth + 3, textHeight + 6);

    ctx.fillStyle = style.outlineColour;
    ctx.font = style.fontType;

    ctx.fillText(labelText, westEnd.x + textWidth / 2 + 2, westEnd.y + 3);
  }

  for (let i = baseStartingLongitude; i <= rightBottomLl.lng; i += currentLatLngInterval) {
    const northEnd = map.latLngToContainerPoint({
      lat: leftTopLl.lat,
      lng: i,
    });
    const southEnd = map.latLngToContainerPoint({
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

    const labelText = ((i / currentLatLngInterval) * currentLatLngInterval)
      .toFixed(3)
      .toString()
      .replace(/(\.0+|0+)$/, '');
    const textWidth = ctx.measureText(labelText).width;
    const textHeight = ctx.measureText(labelText).actualBoundingBoxAscent;

    ctx.fillStyle = style.lineColour;

    ctx.fillRect(southEnd.x - textWidth / 2 - 1, southEnd.y - textHeight - 9, textWidth + 3, textHeight + 6);

    ctx.fillStyle = style.outlineColour;
    ctx.font = style.fontType;

    ctx.fillText(labelText, southEnd.x - textWidth / 2, southEnd.y - 6);
  }
};

//TODO - Add line props, zoom interval props
const LatLngGraticule = (props: any) => {
  // Line/label properties
  const fontColour = '#000';
  const fontBackground = '#FFF';
  const lineColor = '#000';
  const lineOutlineColor = '#FFF';
  const lineWeight = 2;
  const lineOutlineWeight = 3;
  const showLabel = true;

  let canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.classList.add('leaflet-zoom-animated');
  canvas.classList.add(props.name);
  let name: string = props.name;

  let map = useMapEvents({
    viewreset: () => {
      reset(map, canvas, gridShown);
    },
    move: () => {
      reset(map, canvas, gridShown);
    },
    overlayadd: (e: LayersControlEvent) => {
      showGrid(e, map, canvas, name);
    },
    overlayremove: (e: LayersControlEvent) => {
      clearScreen(e, name, canvas);
    },
  });

  const [gridShown, setGridVisbility] = useState(props.checked);

  // Add the canvas only if it hasn't already been added
  if (!map.getPanes().overlayPane.classList.contains(name)) {
    map.getPanes().overlayPane.appendChild(canvas);
  }
  // Initial draw if required
  useEffect(() => {
    reset(map, canvas, gridShown);
  }, []);

  function reset(map: Map, canvas: HTMLCanvasElement, showGrid: boolean) {
    const mapLeftTop: Point = map.containerPointToLayerPoint([0, 0]);
    canvas.style['transform'] = `translate3d(${mapLeftTop.x}px,${mapLeftTop.y}px,0)`;

    canvas.width = map.getSize().x;
    canvas.height = map.getSize().y;

    let ctx = canvas.getContext('2d');

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

  function showGrid(e: LayersControlEvent, map: Map, canvas: HTMLCanvasElement, name: string) {
    if (e.name === name) {
      setGridVisbility(true);
      reset(map, canvas, true);
    }
  }

  function clearScreen(e: LayersControlEvent, name: string, canvas: HTMLCanvasElement) {
    if (e.name === name) {
      let ctx = canvas.getContext('2d');
      if (ctx) {
        setGridVisbility(false);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }
  return null;
};

export default LatLngGraticule;
