import {
  DOMParser
} from 'xmldom';
import * as nodeCanvas from 'canvas';
import fetch from 'node-fetch';
import Canvg, {
  presets
} from 'canvg';
import { gramToSvg } from '.';
import { defaultRenderOptions, GramRenderOptions } from './gram-render-options';

const preset = presets.node({
  DOMParser,
  canvas:nodeCanvas,
  fetch
});

const gramToCanvas = async (src: string, options?: Partial<GramRenderOptions>) => {
  const svg = gramToSvg(src, options).outerHTML;
  return await svgToCanvas(svg, options);
}

const svgToCanvas = async (svg:string, options?: Partial<GramRenderOptions>) => {
  const { width, height } = Object.assign(
    defaultRenderOptions,
    options,
  );
  const canvas = preset.createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const v = Canvg.fromString(ctx, svg, preset);

  await v.render();

  return canvas;
}

export {gramToCanvas, svgToCanvas}