import { FunctionComponent, useEffect, useRef } from 'react'
import cn from './Plot.scss'
import * as curvesPlot from './curves-plot'
import { plotHeight, plotWidth } from '../params'
import { mainSlice } from '../root/store'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../types'

const Plot: FunctionComponent = () => {
  const pts = useSelector((state: RootState) => state.pts)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const plot = curvesPlot.init({
      canvasRef: canvasRef.current,
      uiRef: uiRef.current,
      width: plotWidth,
      height: plotHeight,
    })

    dispatch(mainSlice.actions.setPts(plot.pts))

    return () => {
      plot.destroy()
    }
  }, [])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const uiRef = useRef<HTMLDivElement>(null)

  const start = (idx: number) => {
    const handleMove = (e: MouseEvent) => {
      // setPts((pts) => {
      //   const pts2 = pts.slice()
      //   pts2[idx][0] += e.movementX
      //   pts2[idx][1] += e.movementY
      //   return pts2
      // })
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', handleMove)
    })
  }

  return (
    <div
      className={cn.container}
      style={{ width: plotWidth, height: plotHeight }}
    >
      <div className={cn.canvas}>
        <canvas ref={canvasRef}>Plot</canvas>
      </div>
      <div className={cn.ui} ref={uiRef}>
        {pts.map((pt, idx) => (
          <div
            className={cn.pin}
            key={idx}
            style={{ transform: `translate(${pt[0]}px, ${pt[1]}px)` }}
            onMouseDown={(e) => {
              start(idx)
            }}
            onMouseUp={(e) => {
              stop()
            }}
          >
            <span className={cn.marker}></span>
            <div className={cn.label}>{`${pt[0]},${pt[1]}`}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { Plot }

// ---- PATH

// const renderPath = (): void => {
//   let path = ''

//   if (false) {
// ----- THESE ARE SEGMENTS
//     // Calculating points for dcLines
//     path += `M ${pts[0][0]} ${pts[0][1]}`

//     let interpolation = 0
//     // we know last point's coordinates so we can skip one last iteration
//     for (let i = 0; i < segments - 1; i++) {
//       interpolation += 1 / segments
//       const dcPoints = getDCPoints(interpolation)
//       path += ' L ' + dcPoints[dcPoints.length - 1].join(' ')
//     }

//     path += ` L ${pts[3][0]} ${pts[3][1]}`
//   } else {
//     // No need to calculate points

//     pts.forEach((p, idx) => {
//       let prefix: string = ''

//       if (idx === 0) {
//         prefix = 'M'
//       } else if (idx === 1) {
//         prefix = 'C'
//       }

//       path += `${prefix} ${p[0]} ${p[1]}`
//     })
//   }

//   dom.curve?.setAttribute('d', path)
// }

// const renderPin = (idx?: number) => {
//   if (idx) {
//     pinEls[
//       idx
//     ].style.transform = `${translateCenter} translate(${pts[idx][0]}px, ${pts[idx][1]}px)`
//     pinEls[idx].setAttribute('data-coords', `${pts[idx][0]}, ${pts[idx][1]}`)
//   } else {
//     pinEls.forEach((el, i) => {
//       el.style.transform = `${translateCenter} translate(${pts[i][0]}px, ${pts[i][1]}px)`
//       el.setAttribute('data-coords', `${pts[i][0]}, ${pts[i][1]}`)
//     })
//   }
// }

// ----- pin move:
// document.addEventListener('mousemove', (e) => {
//   if (!(e.buttons & leftButtonBitMask) || id === null) {
//     return
//   }
//   pts[id][0] = startPts.x - (start.x - e.pageX)
//   pts[id][1] = startPts.y - (start.y - e.pageY)

//   renderPin(id)
//   renderPath()
//   renderDCElements(getDCPoints(interpolationValue))
// })

// pin.addEventListener('mousedown', (e: MouseEvent) => {
//   e.preventDefault()
//   const target = e.target as HTMLElement
//   id = Number(target.getAttribute('data-id'))
//   dom.container?.classList.add('no-transition')

//   start = { x: e.pageX, y: e.pageY }
//   startPts = { x: pts[id][0], y: pts[id][1] }

//   const notMoving = () => {
//     if (!id) {
//       throw new Error('bad id')
//     }

//     dom.container?.classList.remove('no-transition')
//     if (pts[id][0] > width) {
//       pts[id][0] = width
//     } else if (pts[id][0] < 0) {
//       pts[id][0] = 0
//     }

//     if (pts[id][1] > height) {
//       pts[id][1] = height
//     } else if (pts[id][1] < 0) {
//       pts[id][1] = 0
//     }

//     renderPin(id)
//     renderPath()
//     renderDCElements(getDCPoints(interpolationValue))

//     id = null
//   }

//   document.addEventListener('mouseup', notMoving, { once: true })
// })

// --- DC elements

// const createDCElements = (points: Point[]) => {
//   for (let idx = 0; idx < points.length; idx++) {
//     const markerTemplate = dom.templates.dcMarker.content.cloneNode(
//       true,
//     ) as HTMLTemplateElement
//     const marker = markerTemplate.querySelector('.dc-marker') as SVGElement

//     marker.classList.add(`level-${order}`)
//     dcMarkers.push(marker)
//     dom.svg?.append(marker)

//     // Dont build line for the last point
//     if (idx !== points.length - 1) {
//       const lineTemplate = dom.templates.dcLine.content.cloneNode(
//         true,
//       ) as HTMLTemplateElement
//       const line = lineTemplate.querySelector('.dc-line') as SVGElement

//       line.classList.add(`level-${order}`)
//       dcLines.push(line)

//       dom.svg?.append(line)
//     }
//   }
// }

// const renderDCElements = (points: Point[]) => {
//   for (let idx = 0; idx < points.length; idx++) {
//     dcMarkers[idx].setAttribute('cx', String(points[idx][0]))
//     dcMarkers[idx].setAttribute('cy', String(points[idx][1]))

//     if (idx !== points.length - 1) {
//       dcLines[idx].setAttribute(
//         'd',
//         `M ${points[idx][0]} ${points[idx][1]} L ${points[idx + 1][0]} ${
//           points[idx + 1][1]
//         }`,
//       )
//     }
//   }
// }

// const getDCPoints = (interpolation: number): Point[] => {
//   const out: Point[] = []

//   const addPoints = (pointsArray: Point[], count: number): void => {
//     const buffer: Point[] = []
//     for (let i = pointsArray.length; i > pointsArray.length - count; i--) {
//       const interpolatedXOffset =
//         (pointsArray[pointsArray.length - i + 1][0] -
//           pointsArray[pointsArray.length - i][0]) *
//         interpolation
//       const interpolatedYOffset =
//         (pointsArray[pointsArray.length - i + 1][1] -
//           pointsArray[pointsArray.length - i][1]) *
//         interpolation

//       buffer.push([
//         pointsArray[pointsArray.length - i][0] + interpolatedXOffset,
//         pointsArray[pointsArray.length - i][1] + interpolatedYOffset,
//       ])
//     }
//     out.push(...buffer)
//   }

//   let counter: number = pts.length - 1

//   while (counter) {
//     addPoints(counter === pts.length - 1 ? pts : out, counter)
//     counter--
//   }

//   return out
// }
