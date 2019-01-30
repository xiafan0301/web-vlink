export const testData = [
  {
      name: '摄像头111',
      addr: '长沙市天心区君逸路', 
      latitude: 28.100253,
      longitude: 112.981563,
      controlList: [
        {
          controlName: '布控1',
          num: '01',
          controlObj: '张三',
          controlState: '1',
          facilityType: '球机',
          alarmRank: '一级',
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
      addr: '天心区雀园路568号', 
      latitude: 28.099481,
      longitude: 112.981627,
      controlList: [
        {
          controlName: '布控3',
          num: '03',
          controlObj: '李四',
          controlState: '0',
          facilityType: '球机',
          alarmRank: '二级',
          createTime: '2018-01-01'
        },
        {
          controlName: '布控4',
          num: '04',
          controlObj: '李四',
          controlState: '0',
          facilityType: '球机',
          alarmRank: '二级',
          createTime: '2018-01-01'
        }
      ]
  }, {
      name: '摄像头333',
      addr: '天心区君逸路九峰安置小区19栋3号门面', 
      latitude: 28.099711,
      longitude: 112.979254,
      controlList: [
       {
        controlName: '布控5',
        num: '05',
        controlObj: '王五',
        controlState: '2',
        facilityType: '枪机',
        alarmRank: '一级',
        createTime: '2018-01-01'
       },
       {
        controlName: '布控6',
        num: '05',
        controlObj: '王五',
        controlState: '1',
        facilityType: '枪机',
        alarmRank: '一级',
        createTime: '2018-01-01'
       }
     ]
  }, {
      name: '摄像头444',
      addr: '天心区雀园路', 
      latitude: 28.099139,
      longitude: 112.979826,
      controlList: [
        {
          controlName: '布控7',
          num: '05',
          controlObj: '王五',
          controlState: '2',
          facilityType: '枪机',
          alarmRank: '五级',
          createTime: '2018-01-01'
         }
      ]
  }
]
// export const conData = [
//   {
//       name: '摄像头111',
//       addr: '长沙市天心区君逸路', 
//       latitude: 28.100253,
//       longitude: 112.981563
//   }, {
//       name: '摄像头222',
//       addr: '天心区雀园路568号', 
//       latitude: 28.099481,
//       longitude: 112.981627
//   }, {
//       name: '摄像头333',
//       addr: '天心区君逸路九峰安置小区19栋3号门面', 
//       latitude: 28.099711,
//       longitude: 112.979254
//   }, {
//       name: '摄像头444',
//       addr: '天心区雀园路', 
//       latitude: 28.099139,
//       longitude: 112.979826
//   }
// ]
export const conData = [
  {tid: '0', trackPointName: '追踪点001:长沙市天心区创谷广告产业园B3栋',
  name: '摄像头111',
  addr: '长沙市天心区君逸路', 
  latitude: 28.093253,
  longitude: 112.975163,
    sxt: [
      {sid: '0', sxtName: '摄像头001'},
      {sid: '1', sxtName: '摄像头002'},
      {sid: '2', sxtName: '摄像头003'},
      {sid: '3', sxtName: '摄像头004'},
      {sid: '4', sxtName: '摄像头005'},
      {sid: '5', sxtName: '摄像头006'},
      {sid: '6', sxtName: '摄像头007'},
      {sid: '7', sxtName: '摄像头008'}
    ],
    kk: [
      {kid: '01', kName: '卡口0011'},
      {kid: '11', kName: '卡口0021'},
      {kid: '21', kName: '卡口0031'},
      {kid: '31', kName: '卡口0041'},
      {kid: '41', kName: '卡口0051'},
      {kid: '51', kName: '卡口0061'},
      {kid: '61', kName: '卡口0071'},
      {kid: '71', kName: '卡口0081'}
    ]
  },
  {tid: '1', trackPointName: '追踪点002:长沙市天心区创谷广告产业园B4栋',
  name: '摄像头222',
  addr: '天心区雀园路568号', 
  latitude: 28.093281,
  longitude: 112.975927,
    sxt: [
      {sid: '8', sxtName: '摄像头0011'},
      {sid: '9', sxtName: '摄像头0021'},
      {sid: '10', sxtName: '摄像头0031'},
      {sid: '11', sxtName: '摄像头0041'},
      {sid: '12', sxtName: '摄像头0051'},
      {sid: '13', sxtName: '摄像头0061'},
      {sid: '14', sxtName: '摄像头0071'},
      {sid: '15', sxtName: '摄像头0081'}
    ],
    kk: [
      {kid: '81', kName: '卡口001'},
      {kid: '91', kName: '卡口002'},
      {kid: '101', kName: '卡口003'},
      {kid: '111', kName: '卡口004'},
      {kid: '121', kName: '卡口005'},
      {kid: '131', kName: '卡口006'},
      {kid: '141', kName: '卡口007'},
      {kid: '151', kName: '卡口008'}
    ]
  }
]
