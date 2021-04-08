import Vue from 'vue'
import App from './App.vue'

import * as dom from './dom'

const init = () => {  
  new Vue({
    el: dom.vContainer,
    render: c => c(App)
  })
}

export default init
