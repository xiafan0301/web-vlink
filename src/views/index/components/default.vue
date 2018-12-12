<template>
  <div>
    <h1>雪亮工程WEB端 测试啊</h1>
  </div>
</template>
<script>
import {getBorders, getEventsStatistics} from '../api/api';
export default {
  data () {
    return {
    }
  },
  created () {
  },
  mounted () {
    getBorders('431224').then((res) => {
      console.log('getBorders res', res);
    })
    .catch((error) => {
    });
    let param = {dateType: 2}
    getEventsStatistics(param).then((res) => {
      console.log('getEventsStatistics res', res);
    })
    .catch(() => {
    });
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
</style>
