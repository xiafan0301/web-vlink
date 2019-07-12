/**
 * 随机数，10位时间戳 连接4位随机整数 e.g. 1428910956 + "" +3482
 * @example $.zUtils.random14(newTime);
 * */
export const videoTree = (sid) => {
  let nNode = $('#' + sid);
  if (nNode && nNode.length > 0) {
    nNode.on('click', '.tree_title', function () {
      let $li = $(this).closest('li');
      let $ul = $li.children('.tree_sli');
      let $icon = $li.find('.show_list_pi');
      $ul.stop();
      let iSum = $ul.children('li').length;
      let iTime = 300 + iSum * 10;
      if (iTime > 500) { iTime = 500; }
      if ($ul.is(':hidden')) {
        $ul.slideDown(iTime);
        $icon.addClass('show_list_pi2');
      } else {
        $ul.slideUp(iTime);
        $icon.removeClass('show_list_pi2');
      }
    });
  }
};