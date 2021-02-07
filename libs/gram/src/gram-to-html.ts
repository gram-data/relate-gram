
import { tokens } from '@gram-data/gram-ast';
import { JSDOM } from 'jsdom';
import { defaultRenderOptions, GramRenderOptions } from './gram-render-options';
import { svgToCanvas } from './gram-to-canvas';
import { gramToSvg } from './gram-to-svg';

const userhandleRE = /\@[a-zA-Z0-9_]+/;

const gramToHtml = async (src: string, url: string, options?: Partial<GramRenderOptions>) => {
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
  const twitterCardMeta = `
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:site" content="@akollegger"/>
  ${metaCreator}
  <meta name="twitter:title" content="Gram of ${id}"/>
  <meta name="twitter:description" content="${src.split(",").slice(0,4).join(",")}"/>
  <meta name="twitter:url" content="${url}"/>
  <meta name="twitter:image" content="${url.replace('.html', '.png')}"/>
  `;

  const ogCardMeta = `
  <meta property="og:type" content="website"/>
  <meta property="og:title" content="Gram of ${id}"/>
  <meta property="og:description" content="${src.split(",").slice(0,4).join(",")}"/>
  <meta property="og:url" content="${url}"/>
  <meta property="og:image" content="${url.replace('.html', '.png')}"/>
  `;
  const head = `<head>${twitterCardMeta}${ogCardMeta}</head>`;
  const vdom = new JSDOM(`<!DOCTYPE html><html>${head}</html>`);
  vdom.window.document.body.append(svg);
  return vdom.serialize();
};


export { gramToHtml };
