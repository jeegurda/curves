export const getEl = (el: Element | null) => {
  if (el === null) {
    console.error('%o is missing from the DOM', el)
    throw new Error('Missing element')
  }
  return el
}

// requires integer > 1
export const rnd = (lim: number) => Math.floor(Math.random() * lim)
