/* Minimal vendor shims to satisfy TS without altering runtime behavior */

// mermaid minimal typings
declare module 'mermaid' {
  export type MermaidConfig = Record<string, unknown>;

  export interface MermaidAPI {
    initialize: (config: MermaidConfig) => void;
    render: (
      id: string,
      text: string,
      callback?: (svgCode: string, bindFunctions?: unknown) => void,
      container?: Element,
    ) => Promise<{ svg: string }> | void;
    parse?: (text: string) => boolean;
  }

  const mermaid: MermaidAPI;
  export default mermaid;
}

// react-zoom-pan-pinch minimal typings
declare module 'react-zoom-pan-pinch' {
  import * as React from 'react';

  export type ReactZoomPanPinchRef = any;

  export interface TransformComponentProps {
    children?: React.ReactNode;
    wrapperClass?: string;
    contentClass?: string;
    wrapperStyle?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
  }

  export const TransformComponent: React.FC<TransformComponentProps>;

  export interface TransformWrapperProps {
    children?: React.ReactNode | ((utils: any) => React.ReactNode);
    disabled?: boolean;
    limitToBounds?: boolean;
    minScale?: number;
    maxScale?: number;
    initialScale?: number;
    initialPositionX?: number;
    initialPositionY?: number;
    centerOnInit?: boolean;
    wheel?: Record<string, unknown>;
    pinch?: Record<string, unknown>;
    doubleClick?: Record<string, unknown>;
    panning?: Record<string, unknown>;
    alignmentAnimation?: Record<string, unknown>;
    onInit?: (ref: ReactZoomPanPinchRef) => void;
    onTransformed?: (ref: ReactZoomPanPinchRef) => void;
    onPanning?: () => void;
  }

  export const TransformWrapper: React.FC<TransformWrapperProps>;
}
