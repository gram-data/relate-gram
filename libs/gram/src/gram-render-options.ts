
export interface GramRenderOptions {
  id: string;
  width: number;
  height: number;
  shapeRadius: number;
  caption: string;
  creator: string;
}

export const defaultRenderOptions: GramRenderOptions = {
  id: 'gram',
  width: 1600,
  height: 800,
  shapeRadius: 20,
  caption: '',
  creator: undefined,
};
