<template>
  <div>
    <h1>登录</h1>
    <router-link :to="{name: 'index'}">返回</router-link>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  created () {
    this.axios({
      url: 'mapServices/borders/431224',
      method: 'get',
      // params: data,
      // data,
      mode: ''
    }).then((res) => {
    }).catch((error) => {
    });
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
</style>
