
import { tokens } from '@gram-data/gram-ast';
import { JSDOM } from 'jsdom';
import { defaultRenderOptions, GramRenderOptions } from './gram-render-options';
import { svgToCanvas } from './gram-to-canvas';
import { gramToSvg } from './gram-to-svg';

const userhandleRE = /\@[a-zA-Z0-9_]+/;

const gramToHtml = async (src: string, options?: Partial<GramRenderOptions>) => {
  const { creator } = Object.assign(
    defaultRenderOptions,
    options,
  );
  const id = tokens.identifier.test(options.id)
    ? options.id
    : defaultRenderOptions.id;

  const svg = gramToSvg(src, options);
  const canvas = await svgToCanvas(svg.outerHTML);
  
    const metaCreator =
    creator !== undefined && userhandleRE.test(creator)
      ? `<meta name="twitter:creator" content="${creator}"/>`
      : '';
  const metaCard = `<meta name="twitter:card" content="summary_large_image"/>`;
  const metaSite = `<meta name="twitter:site" content="@akollegger"/>`;
  const metaImg = `<meta name="twitter:image" content="${canvas.toDataURL()}"/>`;
  const head = `<head>${metaCard}${metaSite}${metaCreator}${metaImg}</head>`;
  const vdom = new JSDOM(`<!DOCTYPE html><html>${head}</html>`);
  vdom.window.document.body.append(svg);
  return vdom.serialize();
};


export { gramToHtml };
