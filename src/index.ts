import './curves.scss'

import * as dom from './dom'
import { checkDom } from './utils'
import initVue from './init-vue'

initVue()
checkDom(dom)

const leftButtonBitMask: number = 0b00001
const width: number = 500
const height: number = 500
const columns: number = 10
const rows: number = 10
const precision: number = 3
const order: number = 3 // 3rd order - 4 points
const pinEls: HTMLElement[] = []

const rnd = (lim: number) => Math.floor(Math.random() * (lim + 1))

type Point = [number, number]

let pts = ((): Point[] => {
  return Array
    .from(new Array(order + 1))
    .map(() => [
      rnd(width),
      rnd(height)
    ])
})()

const randomizePts = () => {
  pts.forEach((pt: Point) => {
    pt[0] = rnd(width)
    pt[1] = rnd(height)
  })
}

let segments: number = 1
let id: number | null = null
let start = {x: 0, y: 0}
let startPts = {x: 0, y: 0}
let interpolationValue = Number(dom.tInput?.value) / Math.pow(10, precision) // Interpolated to 0..1

dom.save?.addEventListener('click', () => {
  localStorage.pts = JSON.stringify(pts)
  dom.load?.removeAttribute('disabled')
})

dom.load?.addEventListener('click', () => {
  try {
    pts = JSON.parse(localStorage.pts)
    build()
  } catch (e) {
    delete localStorage.pts
    dom.load?.setAttribute('disabled', '')
  }
})

try {
  JSON.parse(localStorage.pts)
} catch (e) {
  delete localStorage.pts
  dom.load?.setAttribute('disabled', '')
}

document.addEventListener('mousemove', e => {
  if (!(e.buttons & leftButtonBitMask) || id === null) {
    return
  }
  pts[id][0] = startPts.x - (start.x - e.pageX)
  pts[id][1] = startPts.y - (start.y - e.pageY)

  renderPin(id)
  renderPath()
  renderDCElements(
    getDCPoints(interpolationValue)
  )
})

const translateCenter = 'translate(-50%, -50%)'

const renderPin = (idx?: number) => {
  if (idx) {
    pinEls[idx].style.transform = `${translateCenter} translate(${pts[idx][0]}px, ${pts[idx][1]}px)`
    pinEls[idx].setAttribute('data-coords', `${pts[idx][0]}, ${pts[idx][1]}`)
  } else {
    pinEls.forEach((el, i) => {
      el.style.transform = `${translateCenter} translate(${pts[i][0]}px, ${pts[i][1]}px)`
      el.setAttribute('data-coords', `${pts[i][0]}, ${pts[i][1]}`)
    })
  }
}

const dcMarkers: SVGElement[] = []
const dcLines: SVGElement[] = []

const createDCElements = (points: Point[]) => {
  for (let idx = 0; idx < points.length; idx++) {
    const markerTemplate = dom.templates.dcMarker.content.cloneNode(true) as HTMLTemplateElement
    const marker = markerTemplate.querySelector('.dc-marker') as SVGElement

    marker.classList.add(`level-${order}`)
    dcMarkers.push(marker)
    dom.svg?.append(marker)

    // Dont build line for the last point
    if (idx !== points.length - 1) {
      const lineTemplate = dom.templates.dcLine.content.cloneNode(true) as HTMLTemplateElement
      const line = lineTemplate.querySelector('.dc-line') as SVGElement
  
      line.classList.add(`level-${order}`)
      dcLines.push(line)
  
      dom.svg?.append(line)
    }
  }
}

const renderDCElements = (points: Point[]) => {
  for (let idx = 0; idx < points.length; idx++) {
    dcMarkers[idx].setAttribute('cx', String(points[idx][0]))
    dcMarkers[idx].setAttribute('cy', String(points[idx][1]))

    if (idx !== points.length - 1) {  
      dcLines[idx].setAttribute('d', `M ${points[idx][0]} ${points[idx][1]} L ${points[idx + 1][0]} ${points[idx + 1][1]}`)
    }
  }
}

const getDCPoints = (interpolation: number): Point[] => {
  const out: Point[] = []

  const addPoints = (pointsArray: Point[], count: number): void => {
    const buffer: Point[] = []
    for (let i = pointsArray.length; i > pointsArray.length - count; i--) {
      const interpolatedXOffset = (pointsArray[pointsArray.length - i + 1][0] - pointsArray[pointsArray.length - i][0]) * interpolation
      const interpolatedYOffset = (pointsArray[pointsArray.length - i + 1][1] - pointsArray[pointsArray.length - i][1]) * interpolation
  
      buffer.push([
        pointsArray[pointsArray.length - i][0] + interpolatedXOffset,
        pointsArray[pointsArray.length - i][1] + interpolatedYOffset,
      ])
    }
    out.push(...buffer)
  }

  let counter: number = pts.length - 1

  while (counter) {
    addPoints(
      (counter === pts.length - 1) ? pts : out, 
      counter
    )
    counter--
  }

  return out
}

const renderPath = (): void => {
  let path = ''

  if (false) {
    // Calculating points for dcLines
    path += `M ${pts[0][0]} ${pts[0][1]}`

    let interpolation = 0
    // we know last point's coordinates so we can skip one last iteration
    for (let i = 0; i < segments - 1; i++) {
      interpolation += 1 / segments
      const dcPoints = getDCPoints(interpolation) 
      path += ' L ' + dcPoints[dcPoints.length - 1].join(' ')
    }
  
    path += ` L ${pts[3][0]} ${pts[3][1]}`
  } else {
    // No need to calculate points

    pts.forEach((p, idx) => {
      let prefix: string = ''

      if (idx === 0) {
        prefix = 'M'
      } else if (idx === 1) {
        prefix = 'C'
      }

      path += `${prefix} ${p[0]} ${p[1]}`
    })
  }

  dom.curve?.setAttribute('d', path)
}

dom.widthInput?.addEventListener('input', e => {
  setWidth()
})

dom.tInput?.addEventListener('input', (e: Event) => {
  const target = e.target as HTMLInputElement
  interpolationValue = Number(target.value) / Math.pow(10, precision)
  if (dom.tValue) {
    dom.tValue.innerHTML = interpolationValue.toFixed(precision - 1)
  }

  renderDCElements(
    getDCPoints(interpolationValue)
  )
})
dom.tInput?.addEventListener('mousedown', e => {
  dom.container?.classList.add('no-transition')
})
dom.tInput?.addEventListener('mouseup', e => {
  dom.container?.classList.remove('no-transition')
})

const setWidth = () => {
  if (dom.curve && dom.curve.style !== undefined) {
    dom.curve.style.setProperty('strokeWidth', dom.widthInput?.value as string)
  }
}

const buildGrid = () => {
  const getLine = () => document.createElementNS('http://www.w3.org/2000/svg', 'path')

  for (let i = 0; i < height; i += height / rows) {
    let line = getLine()
    line.setAttribute('d', `M 0 ${i} H ${width}`)
    dom.grid?.appendChild(line)
  }
  for (let i = 0; i < width; i += width / columns) {
    let line = getLine()
    line.setAttribute('d', `M ${i} 0 V ${height}`)
    dom.grid?.appendChild(line)
  }
}

const updateSegmentsInput = () => {
  dom.segmentsInput && (dom.segmentsInput.value = String(segments))
}

dom.segmentsIncrease?.addEventListener('click', () => {
  segments++
  updateSegmentsInput()
  renderPath()
})

dom.segmentsDecrease?.addEventListener('click', () => {
  segments--
  if (segments < 1) {
    segments = 1
  }
  updateSegmentsInput()
  renderPath()
})

const build = (initial: boolean = false) => {
  renderPin()
  renderPath()

  const points = getDCPoints(interpolationValue)
  
  if (initial) {
    createDCElements(points)
  }

  renderDCElements(points)
}

dom.randomize?.addEventListener('click', (): void => {
  randomizePts()
  build()
})

const buildElements = (): void => {
  pts.forEach((_, i: number) => {
    const pinTemplate = dom.templates.pin.content.cloneNode(true) as HTMLTemplateElement
    const pin = pinTemplate.querySelector('.pin') as HTMLElement
    pinEls.push(pin)
    
    pin.setAttribute('data-id', String(i))
    dom.container?.appendChild(pinTemplate)
  })

  pinEls.forEach(pin => {
    pin.addEventListener('mousedown', (e: MouseEvent) => {
      e.preventDefault()
      const target = e.target as HTMLElement
      id = Number(target.getAttribute('data-id'))
      dom.container?.classList.add('no-transition')

      start = { x: e.pageX, y: e.pageY }
      startPts = { x: pts[id][0], y: pts[id][1] }

      const notMoving = () => {
        if (!id) {
          throw new Error('bad id')
        }

        dom.container?.classList.remove('no-transition')
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

        renderPin(id)
        renderPath()
        renderDCElements(
          getDCPoints(interpolationValue)
        )

        id = null
      }

      document.addEventListener('mouseup', notMoving, { once: true })
    })
  })
}

buildElements() // requires pts

buildGrid() // no req - svg
setWidth() // no req - svg 

updateSegmentsInput() // no req - dom

build(true)

dom.container?.classList.add('loaded')
