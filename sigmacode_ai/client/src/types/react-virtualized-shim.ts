/*
  Minimaler Typ-Shim für react-virtualized unter React 18.
  Hintergrund: Manche Projekte scheitern am JSX-Typing von AutoSizer/List.
  Diese Deklarationen liefern nur das Nötigste, ohne Laufzeit zu beeinflussen.
*/

/* eslint-disable @typescript-eslint/no-explicit-any */

declare module 'react-virtualized' {
  import * as React from 'react';

  export interface ListRowProps {
    index: number;
    isScrolling: boolean;
    isVisible: boolean;
    key: string;
    parent: any;
    style: React.CSSProperties;
  }

  export interface ListProps {
    width: number;
    height: number;
    rowCount: number;
    rowHeight: number | ((args: { index: number }) => number);
    rowRenderer: (props: ListRowProps) => React.ReactNode;
    overscanRowCount?: number;
    className?: string;
    autoHeight?: boolean;
    scrollToIndex?: number;
    noRowsRenderer?: () => React.ReactNode;
  }

  export class List extends React.Component<Partial<ListProps>> {}

  export interface AutoSizerProps {
    children: (size: { width: number; height: number }) => React.ReactNode;
    disableWidth?: boolean;
    disableHeight?: boolean;
    defaultWidth?: number;
    defaultHeight?: number;
  }

  export class AutoSizer extends React.Component<Partial<AutoSizerProps>> {}

  // Additional commonly used components
  export interface WindowScrollerProps {
    children?: (params: {
      height: number;
      isScrolling: boolean;
      scrollTop: number;
      onChildScroll: (params: { scrollTop: number }) => void;
    }) => React.ReactNode;
    scrollElement?: Element | Window | null;
  }

  export class WindowScroller extends React.Component<Partial<WindowScrollerProps>> {}

  export interface CellMeasurerProps {
    cache: any;
    columnIndex?: number;
    rowIndex?: number;
    parent?: any;
    children: React.ReactNode;
  }

  export class CellMeasurer extends React.Component<Partial<CellMeasurerProps>> {}

  export class CellMeasurerCache {
    constructor(params?: any);
    clearAll(): void;
    clear(rowIndex?: number, columnIndex?: number): void;
    has(rowIndex: number, columnIndex?: number): boolean;
    getHeight(rowIndex: number, columnIndex?: number): number | undefined;
    getWidth(rowIndex: number, columnIndex?: number): number | undefined;
  }
}

// Häufig verwendete Sub-Paths als Aliase bereitstellen
declare module 'react-virtualized/dist/commonjs/AutoSizer' {
  import { AutoSizer } from 'react-virtualized';
  export default AutoSizer;
}

declare module 'react-virtualized/dist/es/AutoSizer' {
  import { AutoSizer } from 'react-virtualized';
  export default AutoSizer;
}

declare module 'react-virtualized/dist/commonjs/List' {
  import { List } from 'react-virtualized';
  export default List;
}

declare module 'react-virtualized/dist/es/List' {
  import { List } from 'react-virtualized';
  export default List;
}

declare module 'react-virtualized/dist/commonjs/WindowScroller' {
  import { WindowScroller } from 'react-virtualized';
  export default WindowScroller;
}

declare module 'react-virtualized/dist/es/WindowScroller' {
  import { WindowScroller } from 'react-virtualized';
  export default WindowScroller;
}

declare module 'react-virtualized/dist/commonjs/CellMeasurer' {
  import { CellMeasurer, CellMeasurerCache } from 'react-virtualized';
  export { CellMeasurer, CellMeasurerCache };
}

declare module 'react-virtualized/dist/es/CellMeasurer' {
  import { CellMeasurer, CellMeasurerCache } from 'react-virtualized';
  export { CellMeasurer, CellMeasurerCache };
}
