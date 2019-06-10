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
    if(this.$route.query.dispatchType == 2) {
      this.$router.push({name: 'task_alarm_detail', query: {id: this.$route.query.id, processType: this.$route.query.processType, uid: this.$route.query.uid, objType: this.$route.query.objType, dispatchType:this.$route.query.dispatchType}});
    }else {
      this.$router.push({name: 'task_detail', query: {id: this.$route.query.id, processType: this.$route.query.processType, uid: this.$route.query.uid, dispatchType:this.$route.query.dispatchType}});
    }
  },
  methods: {
  }
}
</script>
<style lang="scss">

</style>