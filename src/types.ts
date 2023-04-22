import { store } from './root/store'

export type Point = [number, number]

export interface MainSliceState {
  pts: Point[]
  syncUI: number
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export interface IPlotProps {
  tValue: number
  lerpPts: number
  pts: Point[]
  connectPts: boolean
}

export interface IPlot {
  init: () => void
  draw: () => void
  destroy: () => void
  ctx: CanvasRenderingContext2D
  setOrder: (order: number) => void
  props: IPlotProps
}
