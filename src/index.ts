import * as dom from './dom'
import { getEl } from './utils'
import { createRoot } from 'react-dom/client'
import { Curves } from './curves/Curves'
import { createElement, StrictMode } from 'react'

createRoot(getEl(dom.root)).render(
  createElement(StrictMode, null, createElement(Curves)),
)
