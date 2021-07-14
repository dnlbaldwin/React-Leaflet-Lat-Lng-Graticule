import { LayersControlEvent, LatLng, Map, Point } from 'leaflet';
import { useEffect, useState } from 'react';
import { useMapEvents } from 'react-leaflet';

const defaultLatLngInterval = [
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

const drawGraticule = (map: Map, canvas: HTMLCanvasElement) => {
  // Determine lat/lng interval
  const currentLatLngInterval = map.getZoom();
};

//TODO - Add line props, zoom interval props
const LatLngGraticule = (props: any) => {
  // Line/label properties
  const dash = [2, 2];
  const fontColour = '#aaa';
  const fontBackground = '#fff';
  const lineWeight = 1;
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
    console.log(map.getPanes().overlayPane.classList);
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
      drawGraticule(map, canvas);
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
