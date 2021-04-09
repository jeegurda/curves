export const svg: SVGElement | null = document.querySelector('.svg')
export const curve: SVGElement | null = document.querySelector('.curve')
export const grid: SVGElement | null = document.querySelector('.grid')

export const widthInput: HTMLInputElement | null = document.querySelector('#width-input')
export const tInput: HTMLInputElement | null = document.querySelector('#t-input')
export const tValue = document.querySelector('#t-value')

export const save: HTMLElement | null = document.querySelector('#save')
export const load: HTMLElement | null = document.querySelector('#load')

export const container: HTMLElement | null = document.querySelector('.container')
export const randomize = document.querySelector('#randomize')
export const templates = {
  pin: document.querySelector('template#pin') as HTMLTemplateElement,
  dcMarker: document.querySelector('template#dc-marker') as HTMLTemplateElement,
  dcLine: document.querySelector('template#dc-line') as HTMLTemplateElement,
}

export const segmentsIncrease = document.querySelector('.segments-increase')
export const segmentsDecrease = document.querySelector('.segments-decrease')
export const segmentsInput: HTMLInputElement | null = document.querySelector('.segments-input')

export const vContainer: HTMLElement | null = document.querySelector('.v-layo ut')
