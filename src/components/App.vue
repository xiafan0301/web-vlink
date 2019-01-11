<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'app'
}
</script>
<style>
html, body {
  height: 100%;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%; height: 100%;
  min-width: 1200px;
  /* min-height: 675px; */
  min-height: 625px;
  /* overflow: hidden; */
}
</style>
