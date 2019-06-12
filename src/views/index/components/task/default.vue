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
      if(this.$route.query.processType == 5) {
          if (this.$route.query.dispatchStatus == 1) {
            this.$router.push({name: 'alarm_ctc_detail_info', query: {status: 'ctc_ing', id: this.$route.query.id, objType: this.$route.query.objType}});
          }
          if (this.$route.query.dispatchStatus == 2) {
            this.$router.push({name: 'alarm_ctc_detail_info', query: {status: 'ctc_end', id: this.$route.query.id, objType: this.$route.query.objType}});
          }
        }else {
          this.$router.push({name: 'task_alarm_detail', query: {id: this.$route.query.id, processType: this.$route.query.processType, uid: this.$route.query.uid, objType: this.$route.query.objType, dispatchType:this.$route.query.dispatchType}});          
        }
    }else {
      if(this.$route.query.processType == 5) {
          if (this.$route.query.dispatchStatus == 1) {
            this.$router.push({name: 'ctc_detail_info', query: {status: 'ctc_ing', id: this.$route.query.id }});
          }
          if (this.$route.query.dispatchStatus == 2) {
            this.$router.push({name: 'ctc_detail_info', query: {status: 'ctc_end', id: this.$route.query.id }});
          }
        }else {
          this.$router.push({name: 'task_detail', query: {id: this.$route.query.id, processType: this.$route.query.processType, uid: this.$route.query.uid, dispatchType:this.$route.query.dispatchType}});          
        }
    }
  },
  methods: {
  }
}
</script>
<style lang="scss">

</style>