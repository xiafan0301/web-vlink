export const testData = [
  {
      name: '摄像头111',
      address: '长沙市天心区君逸路', 
      latitude: 28.100253,
      longitude: 112.981563,
      controlList: [
        {
          controlName: '布控1',
          num: '01',
          controlObj: '张三',
          controlState: '1',
          facilityType: '球机',
          alarmRank: '五级',
          createTime: '2018-01-01'
        },
        {
          controlName: '布控2',
          num: '02',
          controlObj: '张三',
          controlState: '1',
          facilityType: '球机',
          alarmRank: '一级',
          createTime: '2018-01-01'
        }
      ]
  }, {
      name: '摄像头222',
      address: '天心区雀园路568号', 
      latitude: 28.099481,
      longitude: 112.981627,
      controlList: [
        {
          controlName: '布控3',
          num: '03',
          controlObj: '李四',
          controlState: '0',
          facilityType: '球机',
          alarmRank: '',
          createTime: '2018-01-01'
        },
        {
          controlName: '布控4',
          num: '04',
          controlObj: '李四',
          controlState: '0',
          facilityType: '球机',
          alarmRank: '',
          createTime: '2018-01-01'
        }
      ]
  }, {
      name: '摄像头333',
      address: '天心区君逸路九峰安置小区19栋3号门面', 
      latitude: 28.099711,
      longitude: 112.979254,
      controlList: [
       {
        controlName: '布控5',
        num: '05',
        controlObj: '王五',
        controlState: '2',
        facilityType: '枪机',
        alarmRank: '',
        createTime: '2018-01-01'
       },
       {
        controlName: '布控6',
        num: '05',
        controlObj: '王五',
        controlState: '1',
        facilityType: '枪机',
        alarmRank: '',
        createTime: '2018-01-01'
       }
     ]
  }, {
      name: '摄像头444',
      address: '天心区雀园路', 
      latitude: 28.099139,
      longitude: 112.979826,
      controlList: [
        {
          controlName: '布控7',
          num: '05',
          controlObj: '王五',
          controlState: '2',
          facilityType: '枪机',
          alarmRank: '',
          createTime: '2018-01-01'
         }
      ]
  }
]

export const conData = {
  devList: [
    {uid: 1, type: 'sxt', sid: '0', equName: '摄像头001', address: 'xxx', isNormal: true, isSelected: true, latitude: 28.095324, longitude: 112.975426},
    // {uid: 1, type: 'sxt', sid: '1', equName: '摄像头002', address: 'xxx', isNormal: true, isSelected: false, latitude: 28.096324, longitude: 112.976426},
    {uid: 2, type: 'sxt', sid: '2', equName: '摄像头003', address: 'xxx', isNormal: false, isSelected: true, latitude: 28.097324, longitude: 112.977426},
    {uid: 3, type: 'sxt', sid: '3', equName: '摄像头004', address: 'xxx', isNormal: true, isSelected: false, latitude: 28.098324, longitude: 112.978426},
    {uid: 4, type: 'kk', sid: '5', equName: '卡口005', address: 'xxx', isNormal: true, isSelected: true, latitude: 28.093324, longitude: 112.973426},
    {uid: 5, type: 'kk', sid: '6', equName: '卡口006', address: 'xxx', isNormal: true, isSelected: false, latitude: 28.092324, longitude: 112.972426},
    {uid: 6, type: 'kk', sid: '7', equName: '卡口007', address: 'xxx', isNormal: true, isSelected: true, latitude: 28.091324, longitude: 112.971426},
    {uid: 7, type: 'kk', sid: '8', equName: '卡口008', address: 'xxx', isNormal: true, isSelected: false, latitude: 28.090324, longitude: 112.970426},
    {uid: 8, type: 'sxt', sid: '9', equName: '摄像头009', address: 'xxx', isNormal: true, isSelected: true, latitude: 28.096290, longitude: 112.966430},
    {uid: 9, type: 'sxt', sid: '10', equName: '摄像头0010', address: 'xxx', isNormal: false, isSelected: true, latitude: 28.097290, longitude: 112.967430},
    {uid: 10, type: 'kk', sid: '11', equName: '卡口0011', address: 'xxx', isNormal: true, isSelected: false, latitude: 27.898681, longitude: 110.690875},
    {uid: 11, type: 'kk', sid: '12', equName: '卡口0012', address: 'xxx', isNormal: true, isSelected: true, latitude: 27.898981, longitude: 110.670975},
    // {uid: , type: 'kk', sid: '13', equName: '卡口0013', address: 'xxx', isNormal: true, isSelected: true, latitude: 28.095290, longitude: 112.965430},
    // {uid: , type: 'kk', sid: '14', equName: '卡口0014', address: 'xxx', isNormal: true, isSelected: false, latitude: 28.094290, longitude: 112.964430},
    // {uid: , type: 'kk', sid: '15', equName: '卡口0015', address: 'xxx', isNormal: true, isSelected: false, latitude: 28.093290, longitude: 112.963430},
    // {uid: , type: 'kk', sid: '16', equName: '卡口0016', address: 'xxx', isNormal: true, isSelected: true, latitude: 28.092290, longitude: 112.962430}
  ]
}
// 布控详情数据模型
export const conDetail = {
  alarmLevel: null,
  alarmList: null,
  alarmNum: null,
  createTime: null,
  duration: null,
  eventDetail: null,
  eventId: null,
  objectList: [],
  objectNum: null,
  runningEndTime: null,
  runningStartTime: null,
  surveillanceDateEnd: null,
  surveillanceDateStart: null,
  surveillanceName: null,
  surveillanceNo: null,
  surveillanceStatus: null,
  terminationReason: null,
  time: null,
  type: null,
  updateTime: null
}

// 民族
export const nationData = [
  {value: 1, label: "汉族"},
  {value: 2, label: "蒙古族"},
  {value: 3, label: "回族"},
  {value: 4, label: "藏族"},
  {value: 5, label: "维吾尔族"},
  {value: 6, label: "苗族"},
  {value: 7, label: "彝族"},
  {value: 8, label: "壮族"},
  {value: 9, label: "布依族"},
  {value: 10, label: "朝鲜族"},
  {value: 11, label: "满族"},
  {value: 12, label: "侗族"},
  {value: 13, label: "瑶族"},
  {value: 14, label: "白族"},
  {value: 15, label: "土家族"},
  {value: 16, label: "哈尼族"},
  {value: 17, label: "哈萨克族"},
  {value: 18, label: "傣族"},
  {value: 19, label: "黎族"},
  {value: 20, label: "傈僳族"},
  {value: 21, label: "佤族"},
  {value: 22, label: "畲族"},
  {value: 23, label: "高山族"},
  {value: 24, label: "拉祜族"},
  {value: 25, label: "水族"},
  {value: 26, label: "东乡族"},
  {value: 27, label: "纳西族"},
  {value: 28, label: "景颇族"},
  {value: 29, label: "柯尔克孜族"},
  {value: 30, label: "土族"},
  {value: 31, label: "达斡尔族"},
  {value: 32, label: "仫佬族"},
  {value: 33, label: "羌族"},
  {value: 34, label: "布朗族"},
  {value: 35, label: "撒拉族"},
  {value: 36, label: "毛难族"},
  {value: 37, label: "仡佬族"},
  {value: 38, label: "锡伯族"},
  {value: 39, label: "阿昌族"},
  {value: 40, label: "普米族"},
  {value: 41, label: "塔吉克族"},
  {value: 42, label: "怒族"},
  {value: 43, label: "乌孜别克族"},
  {value: 44, label: "俄罗斯族"},
  {value: 45, label: "鄂温克族"},
  {value: 46, label: "崩龙族"},
  {value: 47, label: "保安族"},
  {value: 48, label: "裕固族"},
  {value: 49, label: "京族"},
  {value: 50, label: "塔塔尔族"},
  {value: 51, label: "独龙族"},
  {value: 52, label: "鄂伦春族"},
  {value: 53, label: "赫哲族"},
  {value: 54, label: "门巴族"},
  {value: 55, label: "珞巴族"},
  {value: 56, label: "基诺族"}
]
