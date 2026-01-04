declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          url: string;
          'loading-anim'?: boolean;
          'events-target'?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};