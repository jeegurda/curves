import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit'
import { MainSliceState, Point } from '../types'

const initialState: MainSliceState = {
  pts: [],
  syncUI: 0,
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setPts: (state, { payload }: PayloadAction<Point[]>) => {
      state.pts = payload
    },
    setPt: (state, { payload }: PayloadAction<{ idx: number; pt: Point }>) => {
      state.pts[payload.idx] = payload.pt
    },
    syncUi: (state) => {
      state.syncUI++
    },
  },
})

export const store = configureStore({
  reducer: mainSlice.reducer,
})
