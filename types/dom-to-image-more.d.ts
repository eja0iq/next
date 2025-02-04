// Type definitions for dom-to-image-more
// Project: https://github.com/1904labs/dom-to-image-more
// Definitions by: Your Name

declare module 'dom-to-image-more' {
  interface DomToImageOptions {
    filter?: (node: Node) => boolean;
    bgcolor?: string;
    width?: number;
    height?: number;
    style?: {
      [key: string]: string | number;
      transform?: string;
      transformOrigin?: string;
      background?: string;
    };
    quality?: number;
    cacheBust?: boolean;
    imagePlaceholder?: string;
  }

  interface DomToImage {
    toSvg: (node: Node, options?: DomToImageOptions) => Promise<string>;
    toPng: (node: Node, options?: DomToImageOptions) => Promise<string>;
    toJpeg: (node: Node, options?: DomToImageOptions) => Promise<string>;
    toBlob: (node: Node, options?: DomToImageOptions) => Promise<Blob>;
    toPixelData: (node: Node, options?: DomToImageOptions) => Promise<Uint8Array>;
  }

  const domtoimage: DomToImage;
  export = domtoimage;
}

declare global {
  interface Window {
    domtoimage: typeof import('dom-to-image-more');
  }
}