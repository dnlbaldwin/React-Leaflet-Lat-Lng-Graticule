import { LayersControlEvent, LatLng, Map, Point } from 'leaflet';
import { useEffect, useState } from 'react';
import { useMapEvents } from 'react-leaflet';

// TODO - Make this configurable through props.
/**
 * This controls the lat/lng interval of the graticule, in degrees.
 */
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

/**
 * This interface controls the style of the graticule.
 */
interface Style {
  lineWeight: number;
  outLineWeight: number;
  lineColour: string;
  outlineColour: string;
  fontColour: string;
  fontBackground: string;
  fontType: string;
}

/**
 * This procedure handles drawing the graticule
 * @param map
 * @param canvas
 * @param style
 * @returns
 */
const drawGraticule = (map: Map, canvas: HTMLCanvasElement, style: Style) => {
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

  // Round down so we're guaranteed to show the first graticule line
  const baseStartingLatitude: number = Math.floor(rightBottomLl.lat / currentLatLngInterval) * currentLatLngInterval;

  const baseStartingLongitude: number = Math.floor(leftTopLl.lng / currentLatLngInterval) * currentLatLngInterval;

  // Draw the latitude lines
  for (let i = baseStartingLatitude; i <= leftTopLl.lat; i += currentLatLngInterval) {
    const westEnd = map.latLngToContainerPoint({
      lat: i,
      lng: leftTopLl.lng,
    });

    const eastEnd = map.latLngToContainerPoint({
      lat: i,
      lng: rightBottomLl.lng,
    });

    drawLine(ctx, westEnd, eastEnd, style);

    drawLatitudeLabel(ctx, i, westEnd, style);
  }

  // Draw the longitude lines
  for (let i = baseStartingLongitude; i <= rightBottomLl.lng; i += currentLatLngInterval) {
    const northEnd = map.latLngToContainerPoint({
      lat: leftTopLl.lat,
      lng: i,
    });
    const southEnd = map.latLngToContainerPoint({
      lat: rightBottomLl.lat,
      lng: i,
    });

    drawLine(ctx, northEnd, southEnd, style);

    drawLongitudeLabel(ctx, i, southEnd, style);
  }
};

/**
 * This procedure draws a line between two points on a canvas.
 * @param ctx
 * @param pointOne
 * @param pointTwo
 * @param style
 */
const drawLine = (ctx: CanvasRenderingContext2D, pointOne: Point, pointTwo: Point, style: Style) => {
  ctx.lineWidth = style.outLineWeight;
  ctx.strokeStyle = style.outlineColour;
  ctx.fillStyle = style.outlineColour;

  ctx.beginPath();
  ctx.moveTo(pointOne.x, pointOne.y);
  ctx.lineTo(pointTwo.x, pointTwo.y);
  ctx.stroke();

  ctx.lineWidth = style.lineWeight;
  ctx.strokeStyle = style.lineColour;
  ctx.fillStyle = style.lineColour;

  ctx.stroke();
};

/**
 * Given a latitude, this procedure will draw a label on the canvas.
 * @param ctx
 * @param latitude
 * @param point
 * @param style
 */
const drawLatitudeLabel = (ctx: CanvasRenderingContext2D, latitude: number, point: Point, style: Style) => {
  if (Math.abs(latitude) < 90) {
    let labelText: string;
    if (latitude === 0) {
      labelText = '0';
    } else if (latitude > 0) {
      labelText =
        latitude
          .toFixed(3)
          .toString()
          .replace(/(\.0+|0+)$/, '') + 'N';
    } else {
      labelText =
        Math.abs(latitude)
          .toFixed(3)
          .toString()
          .replace(/(\.0+|0+)$/, '') + 'S';
    }

    ctx.fillStyle = style.fontBackground;
    ctx.font = style.fontType;
    const textWidth = ctx.measureText(labelText).width;
    const textHeight = ctx.measureText(labelText).actualBoundingBoxAscent;

    ctx.fillRect(point.x + 10, point.y - textHeight, textWidth + 3, textHeight + 6);

    ctx.fillStyle = style.fontColour;

    ctx.fillText(labelText, point.x + 11, point.y + 3);
  }
};

/**
 * Given a longitude, this procedure will draw a label on the canvas.
 * @param ctx
 * @param longitude
 * @param point
 * @param style
 */
const drawLongitudeLabel = (ctx: CanvasRenderingContext2D, longitude: number, point: Point, style: Style) => {
  let labelText: string;
  if (longitude === 0) {
    labelText = '0';
  } else if (longitude > 0) {
    labelText =
      longitude
        .toFixed(3)
        .toString()
        .replace(/(\.0+|0+)$/, '') + 'E';
  } else {
    labelText =
      Math.abs(longitude)
        .toFixed(3)
        .toString()
        .replace(/(\.0+|0+)$/, '') + 'W';
  }

  const textWidth = ctx.measureText(labelText).width;
  const textHeight = ctx.measureText(labelText).actualBoundingBoxAscent;
  ctx.font = style.fontType;
  ctx.fillStyle = style.fontBackground;

  ctx.fillRect(point.x - textWidth / 2 - 1, point.y - 3 * textHeight - 3, textWidth + 3, textHeight + 6);

  ctx.fillStyle = style.fontColour;

  ctx.fillText(labelText, point.x - textWidth / 2, point.y - 2 * textHeight);
};

/**
 * This is the functional component which contains the graticule
 * @param props
 * @returns
 */
const LatLngGraticule = (props: any) => {
  // Line/label properties
  const fontColour = props.fontColour || '#FFF';
  const fontBackground = props.fontBackground || '#000';
  const lineColour = props.lineColour || '#000';
  const lineOutlineColour = props.lineOutlineColour || '#FFF';
  const lineWeight = props.lineWeight || 2;
  const lineOutlineWeight = props.lineOutlineWeight || 3;
  const fontType = props.fontType || '16px Courier New';

  let initCanvas: HTMLCanvasElement = document.createElement('canvas');

  const [canvas, setCanvas] = useState(initCanvas);
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

  map.getPanes().overlayPane.appendChild(canvas);

  // Initial draw if required
  useEffect(() => {
    reset(map, canvas, gridShown);
  }, []);

  /**
   * This procedure is called when the map is moved or the view is reset.
   * @param map
   * @param canvas
   * @param showGrid
   */
  function reset(map: Map, canvas: HTMLCanvasElement, showGrid: boolean) {
    if (showGrid) {
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
          lineColour: lineColour,
          outlineColour: lineOutlineColour,
          fontColour: fontColour,
          fontBackground: fontBackground,
          fontType: fontType,
        });
      }
    }
  }

  /**
   * This procedure will set state to ensure the graticule is displayed
   * @param e
   * @param map
   * @param canvas
   * @param name
   */
  function showGrid(e: LayersControlEvent, map: Map, canvas: HTMLCanvasElement, name: string) {
    if (e.name === name) {
      setGridVisbility(true);
      reset(map, canvas, true);
    }
  }

  /**
   * This procedure will set state to ensure the graticule is hidden
   * @param e
   * @param name
   * @param canvas
   */
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
