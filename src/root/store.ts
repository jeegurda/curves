import { configureStore, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { MainSliceState, Point } from '../types'

const initialState: MainSliceState = {
  pts: [],
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setPts: (state, { payload }: PayloadAction<Point[]>) => {
      state.pts = payload
    },
  },
})

export const store = configureStore({
  reducer: mainSlice.reducer,
})
