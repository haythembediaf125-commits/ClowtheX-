/// <reference types="vite/client" />

declare module "jsbarcode" {
  function JsBarcode(
    element: SVGElement | HTMLCanvasElement | HTMLImageElement | string,
    value: string,
    options?: {
      format?: string;
      width?: number;
      height?: number;
      displayValue?: boolean;
      text?: string;
      fontOptions?: string;
      font?: string;
      textAlign?: string;
      textPosition?: string;
      textMargin?: number;
      fontSize?: number;
      background?: string;
      lineColor?: string;
      margin?: number;
      marginTop?: number;
      marginBottom?: number;
      marginLeft?: number;
      marginRight?: number;
      valid?: (valid: boolean) => void;
    }
  ): void;
  export = JsBarcode;
}
