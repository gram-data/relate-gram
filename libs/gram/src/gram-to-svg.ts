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
import { Gram } from './entities/gram.entity';
import { defaultRenderOptions, GramRenderOptions } from './gram-render-options';
const d3 = require('d3');

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

export const gramToSvg = (src: string, options?: Partial<GramRenderOptions>) => {
  const { width, height, shapeRadius } = Object.assign(
    defaultRenderOptions,
    options,
  );
  const id = tokens.identifier.test(options.id)
    ? options.id
    : defaultRenderOptions.id;

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

  return (svgFragment.firstChild as SVGElement);
};
