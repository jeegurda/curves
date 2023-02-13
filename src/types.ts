export type PlotProps = {
  width: number
  height: number
}

export type ControlProps = {
  tPrecision: number
}

export type Point = [number, number]

declare global {
  interface Window {
    plot: any
  }
}
