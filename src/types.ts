import { store } from './root/store'

export type Point = [number, number]

export interface MainSliceState {
  pts: Point[]
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
