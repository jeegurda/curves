<template>
  <div>
    <transition>
      <p key="0" v-if="active % 3 === 0">First</p>
      <p key="1" v-if="active % 3 === 1">Second</p>
      <p key="2" v-if="active % 3 === 2">Third</p>
    </transition>
    <button @click="active += 1">Toggle</button>
  </div>
</template>

<script>
  export default {
    data: () => ({
      active: 0
    })
  }
</script>

<style scoped>
  p {
    transition: opacity 0.5s;
  }
</style>
