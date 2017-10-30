// TODO:
// - one dimension arrays?

import './curves.css'

import * as dom from './dom'

const ns = 'http://www.w3.org/2000/svg'
const leftButtonBitMask = 0b00001
const width = 500
const height = 500
const columns = 10
const rows = 10
let normal = [
  [80, 300],
  [150, 50],
  [350, 50],
  [400, 300]
]
let pts = [
  [null, null],
  [null, null],
  [null, null],
  [null, null]
]
pts = normal
let id = null
let start = {x: null, y: null}
let startPts = {x: null, y: null}
let castT = Number(dom.tInput.value) / 100 // 0 -- 1

document.addEventListener('mousemove', e => {
  if (!(e.buttons & leftButtonBitMask) || id === null) {
    return
  }
  pts[id][0] = startPts.x - (start.x - e.pageX)
  pts[id][1] = startPts.y - (start.y - e.pageY)

  setPin(id)
  setPath()
  setCast()
})

dom.pins.forEach(pin => {
  pin.addEventListener('mousedown', e => {
    e.preventDefault()
    id = e.target.getAttribute('data-id')
    dom.container.classList.add('no-transition')

    start = { x: e.pageX, y: e.pageY }
    startPts = { x: pts[id][0], y: pts[id][1] }

    const notMoving = () => {
      dom.container.classList.remove('no-transition')
      if (pts[id][0] > width) {
        pts[id][0] = width
      } else if (pts[id][0] < 0) {
        pts[id][0] = 0
      }

      if (pts[id][1] > height) {
        pts[id][1] = height
      } else if (pts[id][1] < 0) {
        pts[id][1] = 0
      }

      setPin(id)
      setPath()
      setCast()

      id = null
      document.removeEventListener('mouseup', notMoving)
    }

    document.addEventListener('mouseup', notMoving)
  })
})

const translateCenter = 'translate(-50%, -50%)'

const setPin = index => {
  if (index) {
    dom.pins[index].style.transform = `${translateCenter} translate(${pts[index][0]}px, ${pts[index][1]}px)`
    dom.pins[index].setAttribute('data-coords', `${pts[index][0]}, ${pts[index][1]}`)
  } else {
    dom.pins.forEach((el, i) => {
      el.style.transform = `${translateCenter} translate(${pts[i][0]}px, ${pts[i][1]}px)`
      el.setAttribute('data-coords', `${pts[i][0]}, ${pts[i][1]}`)
    })
  }
}

const setCast = () => {
  cPts.forEach((cPt, i) => {
    const cath0 = (pts[i + 1][0] - pts[i][0]) * castT
    const cath1 = (pts[i + 1][1] - pts[i][1]) * castT
    cPt[0] = pts[i][0] + cath0
    cPt[1] = pts[i][1] + cath1
  })

  cTopPts.forEach((cTopPt, i) => {
    const cath0 = (cPts[i + 1][0] - cPts[i][0]) * castT
    const cath1 = (cPts[i + 1][1] - cPts[i][1]) * castT
    cTopPt[0] = cPts[i][0] + cath0
    cTopPt[1] = cPts[i][1] + cath1
  })

  dom.cast0.setAttribute('d', `M ${cPts[0][0]} ${cPts[0][1]} L ${cPts[1][0]} ${cPts[1][1]}`)
  dom.cast1.setAttribute('d', `M ${cPts[1][0]} ${cPts[1][1]} L ${cPts[2][0]} ${cPts[2][1]}`)
  dom.supp0Marker.setAttribute('cx', cPts[0][0])
  dom.supp0Marker.setAttribute('cy', cPts[0][1])
  dom.supp1Marker.setAttribute('cx', cPts[1][0])
  dom.supp1Marker.setAttribute('cy', cPts[1][1])
  dom.supp2Marker.setAttribute('cx', cPts[2][0])
  dom.supp2Marker.setAttribute('cy', cPts[2][1])

  dom.castTop.setAttribute('d', `M ${cTopPts[0][0]} ${cTopPts[0][1]} L ${cTopPts[1][0]} ${cTopPts[1][1]}`)
  dom.cast0Marker.setAttribute('cx', cTopPts[0][0])
  dom.cast0Marker.setAttribute('cy', cTopPts[0][1])
  dom.cast1Marker.setAttribute('cx', cTopPts[1][0])
  dom.cast1Marker.setAttribute('cy', cTopPts[1][1])

  const cath0 = (cTopPts[1][0] - cTopPts[0][0]) * castT
  const cath1 = (cTopPts[1][1] - cTopPts[0][1]) * castT

  dom.castTopMarker.setAttribute('cx', cTopPts[0][0] + cath0)
  dom.castTopMarker.setAttribute('cy', cTopPts[0][1] + cath1)
}

const setPath = () => {
  dom.supp0.setAttribute('d', `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]}`)
  dom.supp1.setAttribute('d', `M ${pts[1][0]} ${pts[1][1]} L ${pts[2][0]} ${pts[2][1]}`)
  dom.supp2.setAttribute('d', `M ${pts[2][0]} ${pts[2][1]} L ${pts[3][0]} ${pts[3][1]}`)

  dom.path.setAttribute(
    'd',
    `M ${pts[0][0]} ${pts[0][1]} C ${pts[1][0]} ${pts[1][1]}, ${pts[2][0]} ${pts[2][1]}, ${pts[3][0]} ${pts[3][1]}`
  )
}

dom.widthInput.addEventListener('input', e => {
  setWidth()
})

dom.tInput.addEventListener('input', e => {
  castT = Number(e.target.value) / 100
  setCast()
})
dom.tInput.addEventListener('mousedown', e => {
  dom.container.classList.add('no-transition')
})
dom.tInput.addEventListener('mouseup', e => {
  dom.container.classList.remove('no-transition')
})

const randomizePts = () => pts.forEach(pt => {
  pt[0] = Math.random() * width >> 0
  pt[1] = Math.random() * height >> 0
})

const setWidth = () => {
  dom.path.style.strokeWidth = dom.widthInput.value
}

let cPts = [
  [null, null],
  [null, null],
  [null, null]
]

let cTopPts = [
  [null, null],
  [null, null]
]

const buildGrid = () => {
  for (let i = 0; i < height; i += height / rows) {
    let line = document.createElementNS(ns, 'path')
    line.setAttribute('d', `M 0 ${i} H ${width}`)
    dom.grid.appendChild(line)
  }
  for (let i = 0; i < width; i += width / columns) {
    let line = document.createElementNS(ns, 'path')
    line.setAttribute('d', `M ${i} 0 V ${height}`)
    dom.grid.appendChild(line)
  }
}

const build = () => {
  setPin()
  setPath()
  setCast()
}

dom.randomize.addEventListener('click', () => {
  randomizePts()
  build()
})
setWidth()
build()

buildGrid()
