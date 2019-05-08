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
    this.$router.push({name: 'task_detail', query: {id: this.$route.query.id, processType: this.$route.query.processType}});
  },
  methods: {
  }
}
</script>
<style lang="scss">

</style>