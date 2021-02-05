import {
  DOMParser
} from 'xmldom';
import * as nodeCanvas from 'canvas';
import fetch from 'node-fetch';
import Canvg, {
  presets
} from 'canvg';

const preset = presets.node({
  DOMParser,
  canvas:nodeCanvas,
  fetch
});

const gramToCanvas = async () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="51.102" height="51.102" viewBox="0 0 47.909 47.909"><g transform="translate(229.669 -548.408)" stroke="#000"><circle r="22.954" cy="572.362" cx="-205.714" style="marker:none" color="#000" overflow="visible" fill="#ff0" stroke-width="2"/><g stroke-linecap="round" stroke-linejoin="round"><g fill="none"><path d="M-218.327 575.69s11.498 21 26.102 0" stroke-width="1.9"/><path d="M-221.571 575.188s3.385 2.052 3.972-1.983m24.939-.424s-.454 3.933 3.459 2.785" stroke-width="1.349"/></g><ellipse cx="-210.357" cy="566.056" rx="1.314" ry="5.08" stroke-width="2"/><ellipse ry="5.08" rx="1.314" cy="566.056" cx="-201.233" stroke-width="2"/></g></g></svg>`;
  const canvas = preset.createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  const v = Canvg.fromString(ctx, svg, preset);

  await v.render();

  return canvas;

}

export {gramToCanvas}