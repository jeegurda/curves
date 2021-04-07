import Vue from 'vue'
import Root from './Root.vue'

import * as dom from './dom'

const init = () => {
  console.log('trying to mount vue')
  
  new Vue({
    el: dom.vContainer,
    data: {
      ye: 'ye!'
    }
  })
}


export default () => {}
