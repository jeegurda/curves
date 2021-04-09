type domObj = {
  [key: string]: any
}

export const checkDom = (dom: domObj) => {
  for (const key in dom) {
    if (dom[key] === null) {
      console.error('%o is mising from DOM', key)
      throw new Error('Some DOM elements are missing')
    }
  }

  if (!dom.tInput) {
    return false
  }

  return true
}
