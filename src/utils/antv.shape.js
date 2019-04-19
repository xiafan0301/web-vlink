import G2 from '@antv/g2';
const Shape = G2.Shape;
/*  圆柱（圆角柱状图） */
Shape.registerShape('interval', 'cylinder', {
  draw (cfg, group) {
    let points = cfg.points;
    // const points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标
    let path = [];
    path.push(['M', points[0].x, points[0].y]);
    path.push(['L', points[1].x, points[1].y]);
    path.push(['L', points[2].x, points[2].y]);
    path.push(['L', points[3].x, points[3].y]);
    path.push('Z');
    path = this.parsePath(path); // 将 0 - 1 转化为画布坐标
    let iRadius = (path[2][1] - path[1][1]) / 2;
    let iY = (path[0][2] - path[1][2]) / 2;
    if (iRadius > iY) { iRadius = iY }
    return group.addShape('rect', {
      attrs: {
        x: path[1][1], // 矩形起始点为左上角
        y: path[1][2],
        width: path[2][1] - path[1][1],
        height: path[0][2] - path[1][2],
        fill: cfg.color,
        radius: iRadius
      }
    });
  }
});
