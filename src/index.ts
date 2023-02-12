import * as dom from './dom'
import { getEl } from './utils'
import { createRoot } from 'react-dom/client'
import { Root } from './root/Root'
import { createElement, StrictMode } from 'react'

createRoot(getEl(dom.root)).render(
  createElement(StrictMode, null, createElement(Root)),
)
