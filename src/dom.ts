export const svg: SVGElement = document.querySelector('.svg')
export const curve: SVGElement = document.querySelector('.curve')
export const grid: SVGElement = document.querySelector('.grid')

export const widthInput: HTMLInputElement = document.querySelector('#width-input')
export const tInput: HTMLInputElement = document.querySelector('#t-input')
export const tValue = document.querySelector('#t-value')

export const save = document.querySelector('#save')
export const load = document.querySelector('#load')

export const container: HTMLElement = document.querySelector('.container')
export const randomize = document.querySelector('#randomize')
export const templates = {
  pin: document.querySelector('template#pin') as HTMLTemplateElement,
  dcMarker: document.querySelector('template#dc-marker') as HTMLTemplateElement,
  dcLine: document.querySelector('template#dc-line') as HTMLTemplateElement,
}

export const segmentsIncrease = document.querySelector('.segments-increase')
export const segmentsDecrease = document.querySelector('.segments-decrease')
export const segmentsInput: HTMLInputElement = document.querySelector('.segments-input')

export const vContainer: HTMLElement = document.querySelector('.v-layout')
