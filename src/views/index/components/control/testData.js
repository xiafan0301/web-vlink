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
          alarmRank: '',
          createTime: '2018-01-01'
         }
      ]
  }
]

export const conData = 
  {
    equList: [
      {type: 'sxt', sid: '0', equName: '摄像头001', addr: 'xxx', isNormal: true, isSelected: true, latitude: 28.095324, longitude: 112.975426},
      {type: 'sxt', sid: '1', equName: '摄像头002', addr: 'xxx', isNormal: true, isSelected: false, latitude: 28.096324, longitude: 112.976426},
      {type: 'sxt', sid: '2', equName: '摄像头003', addr: 'xxx', isNormal: false, latitude: 28.097324, longitude: 112.977426},
      {type: 'sxt', sid: '3', equName: '摄像头004', addr: 'xxx', isNormal: true, isSelected: false, latitude: 28.098324, longitude: 112.978426},
      {type: 'kk', sid: '01', equName: '卡口005', addr: 'xxx', isNormal: true, isSelected: true, latitude: 28.093324, longitude: 112.973426},
      {type: 'kk', sid: '11', equName: '卡口006', addr: 'xxx', isNormal: true, isSelected: false, latitude: 28.092324, longitude: 112.972426},
      {type: 'kk', sid: '21', equName: '卡口007', addr: 'xxx', isNormal: true, isSelected: true, latitude: 28.091324, longitude: 112.971426},
      {type: 'kk', sid: '31', equName: '卡口008', addr: 'xxx', isNormal: true, latitude: 28.090324, longitude: 112.970426},
      {type: 'sxt', sid: '8', equName: '摄像头009', addr: 'xxx', isNormal: true, isSelected: true, latitude: 28.096290, longitude: 112.966430},
      {type: 'sxt', sid: '9', equName: '摄像头0010', addr: 'xxx', isNormal: false, latitude: 28.097290, longitude: 112.967430},
      {type: 'sxt', sid: '10', equName: '摄像头0011', addr: 'xxx', isNormal: true, isSelected: false, latitude: 28.098290, longitude: 112.968430},
      {type: 'sxt', sid: '11', equName: '摄像头0012', addr: 'xxx', isNormal: true, isSelected: true, latitude: 28.099290, longitude: 112.969430},
      {type: 'kk', sid: '81', equName: '卡口0013', addr: 'xxx', isNormal: true, isSelected: true, latitude: 28.095290, longitude: 112.965430},
      {type: 'kk', sid: '91', equName: '卡口0014', addr: 'xxx', isNormal: true, isSelected: false, latitude: 28.094290, longitude: 112.964430},
      {type: 'kk', sid: '101', equName: '卡口0015', addr: 'xxx', isNormal: true, latitude: 28.093290, longitude: 112.963430},
      {type: 'kk', sid: '111', equName: '卡口0016', addr: 'xxx', isNormal: true, isSelected: true, latitude: 28.092290, longitude: 112.962430}
    ]
  }