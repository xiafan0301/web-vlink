<template>
  <div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  mounted() {
    this.$router.push({name: 'alarm_detail', query: {uid: this.$route.query.uid, objType: this.$route.query.objType, type: this.$route.query.type}});
  },
  methods: {
  }
}
</script>
<style lang="scss">

</style>