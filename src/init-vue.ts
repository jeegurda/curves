import Vue from 'vue'
import Root from './Root.vue'

import * as dom from './dom'

const init = () => {  
  new Vue({
    el: dom.vContainer,
    render: c => c(Root),
    components: { Root }
  })
}

export default init
