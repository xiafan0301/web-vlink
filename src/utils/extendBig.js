$(function() {
  $("body").on('click','.bigImg',(e)=>{
    //console.log(111,e);
    let _this=$(e.currentTarget)
    let imgUrl = _this.attr("src")
    if($(".obox").length>0){
      $(".bigUimg").attr('src',imgUrl)
      $(".dilage,.obox").show();
    }else{
    let imgbox = $("<div class='obox'><img src='"+imgUrl+"' class='bigUimg' /></div>")
    let div = $("<div class='dilage'></div>")
    $(".vl_main").append(div)
    $(".vl_main").append(imgbox);
    }
  })
  $("body").on('click','.bigUimg,.obox',(e)=>{
    $(".dilage,.obox").hide();
  })
})