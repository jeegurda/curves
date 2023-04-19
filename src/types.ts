import { store } from './root/store'

export type Point = [number, number]

export interface MainSliceState {
  pts: Point[]
  syncUI: number
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export interface IPlot {
  pts: Point[]
  init: () => void
  draw: () => void
  destroy: () => void
  ctx: CanvasRenderingContext2D
  replacePts: (newPts: Point[]) => void
  props: {
    tValue: number
  }
}
