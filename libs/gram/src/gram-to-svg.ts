import {
  parse,
  layout,
  draw,
  updateNodes,
  updateLinks,
} from '@gram-data/d3-gram';
import { tokens } from '@gram-data/gram-ast';

import { select } from 'd3-selection';
import { JSDOM } from 'jsdom';
const d3 = require('d3');

export interface SvgOutputOptions {
  id: string;
  width: number;
  height: number;
  shapeRadius: number;
  embed: boolean;
  caption: string;
  creator: string;
}

const defaultOutputOptions: SvgOutputOptions = {
  id: 'gram',
  width: 1600,
  height: 800,
  shapeRadius: 20,
  embed: false,
  caption: '',
  creator: undefined,
};

const userhandleRE = /\@[a-zA-Z0-9_]+/;

const embed = (svg: DocumentFragment, creator: string) => {
  const metaCreator =
    creator !== undefined && userhandleRE.test(creator)
      ? `<meta name="twitter:creator" content="${creator}"/>`
      : '';
  const metaCard = `<meta name="twitter:card" content="summary_large_image"/>`;
  const metaSite = `<meta name="twitter:site" content="@akollegger"/>`;
  const head = `<head>${metaCard}${metaSite}${metaCreator}</head>`;
  const vdom = new JSDOM(`<!DOCTYPE html><html>${head}</html>`);
  vdom.window.document.body.append(svg);
  return vdom.serialize();
};

function boxNodes(nodes:any[], padding:number) {
  const paddingOffset = padding * 2;
  const bbox = nodes.reduce( (acc, node) => {
      const left = Math.min(
        acc[0],
        node.x
      );
      const top = Math.min(
        acc[1],
        node.y
      );
      const right = Math.max(
        acc[2],
        node.x
      );
      const bottom = Math.max(
        acc[3],
        node.y
      );
      return [left, top, right, bottom];
    },
    [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, 0, 0],
  )

  return [bbox[0] - paddingOffset, bbox[1] - paddingOffset, bbox[2] - bbox[0] + (paddingOffset * 2), bbox[3] - bbox[1] + (paddingOffset * 2)];
}

const gramToSvg = (src: string, options?: Partial<SvgOutputOptions>) => {
  const { width, height, shapeRadius, embed: shouldEmbed, creator } = Object.assign(
    defaultOutputOptions,
    options,
  );
  const id = tokens.identifier.test(options.id)
    ? options.id
    : defaultOutputOptions.id;

  const svgFragment = JSDOM.fragment(
    `<svg xmlns="http://www.w3.org/2000/svg" id="${id}" width="${width}" height="${height}"></svg>`,
  );

  const graph = parse(src);
  layout(graph, { width, height });

  const { nodeSelection, linkSelection } = draw(
    graph,
    svgFragment.firstChild,
    { shapeRadius },
  );

  const bbox = boxNodes(graph.nodes, shapeRadius);
  const svgSelection = select(svgFragment.firstChild);
  svgSelection.attr('viewBox', bbox);

  updateNodes(nodeSelection);
  updateLinks(linkSelection);
  if (shouldEmbed) {
    return embed(svgFragment, creator);
  } else {
    return (svgFragment.firstChild as HTMLElement).outerHTML;
  }
};

export { gramToSvg };
