export const root = document.querySelector('.curves-root')

export const svg = document.querySelector<SVGElement>('.svg')
export const curve = document.querySelector<SVGElement>('.curve')
export const grid = document.querySelector<SVGElement>('.grid')

export const widthInput =
  document.querySelector<HTMLInputElement>('#width-input')
export const tInput = document.querySelector<HTMLInputElement>('#t-input')
export const tValue = document.querySelector<HTMLInputElement>('#t-value')

export const save = document.querySelector('#save')
export const load = document.querySelector('#load')
export const container = document.querySelector('.container')
export const randomize = document.querySelector('#randomize')
export const templates = {
  pin: document.querySelector('template#pin') as HTMLTemplateElement,
  dcMarker: document.querySelector('template#dc-marker') as HTMLTemplateElement,
  dcLine: document.querySelector('template#dc-line') as HTMLTemplateElement,
}

export const segmentsIncrease = document.querySelector('.segments-increase')
export const segmentsDecrease = document.querySelector('.segments-decrease')
export const segmentsInput =
  document.querySelector<HTMLInputElement>('.segments-input')
