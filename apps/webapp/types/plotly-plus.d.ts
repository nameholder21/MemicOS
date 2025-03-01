import "plotly.js-dist-min";

declare module "plotly.js-dist-min" {
  interface PlotData {
    nbinsx?: number | undefined;
    dimensions?: any;
    diagonal?: {
      visible: boolean;
    };
    alignmentgroup?: boolean;
    bingroup?: string;
    offsetgroup?: string;
  }
  interface LayoutAxis {
    matches?: string;
  }
}
