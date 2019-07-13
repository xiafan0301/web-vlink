<template>
  <el-dialog
  class="struc_detail_dialog dddbig"
    :visible.sync="strucDetailDialog"
    :show-close="false"
    
    width="1180px"
    >
     <div class="imgbox"  @click="closeImg" > 
<img :src="img" alt=""class="img2">
     </div>
  
  </el-dialog>
</template>
<script>

export default {
  /* 提交成功后通过在父组件 emit mapSelectorEmit 事件获取所框选的东西 */
  
   

  props: ['open', 'url'],
  data () {
    return {
     strucDetailDialog:false,
     img:''
    }
  },
  watch: {
    open (v) {
      this.strucDetailDialog = v;
    },
    url (v) {
      this.img = v;
    },
    strucDetailDialog (v){
      if(!v){
        this.$emit("closeimg")
      }
    }
  
  },
  mounted () {
    this.show=this.showItem
    this.img=this.url
    
  },
  methods: {
    closeImg(){
      this.strucDetailDialog=false
       this.$emit("closeimg")

    },
   
  }
}
</script>
<style lang="scss" paged>
.dddbig .el-dialog{
  background: none;
}
  .imgbox{
    height: 90vh;
    width: 100%;
    display: flex;
    align-items: center; /*垂直居中*/
    justify-content: center; /*水平居中*/
    .img2 {
	  width: auto;
    height: auto;
     max-width: 100%;
    max-height:80vh;
    // display: block;
    // vertical-align: middle;
    // align-items: center;
}
  }
</style>
<style lang="scss" >
</style>


