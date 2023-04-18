export const qs = <T extends HTMLElement | SVGElement>(qs: string): T => {
  const el = document.querySelector<T>(qs)
  if (el === null) {
    console.error('%o is missing from the DOM', el)
    throw new Error('Missing element')
  }
  return el
}

export const qsa = <T extends HTMLElement>(qs: string): T[] => {
  const els = Array.from(document.querySelectorAll<T>(qs))
  return els
}

/** requires integer > 1 */
export const rnd = (lim: number) => Math.floor(Math.random() * lim)

export const te: (msg: string) => never = (msg) => {
  throw new Error(msg)
}
