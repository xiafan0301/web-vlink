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
  "uid": null,
  "surveillanceNo": null,
  "surveillanceName": null,
  "eventId": null,
  "eventCode": null,
  "surveillanceType": null,
  "surveillanceDateStart": null,
  "surveillanceDateEnd": null,
  "surveillancTimeList": [
    {
      "startTime": null,
      "endTime": null,
      "uid": null
    }
  ],
  "alarmLevelDict": [
    {
      "enumField": null,
      "enumValue": null,
      "sort": null,
      "selected": true
    }
  ],
  "modelList": [
    {
      "modelType": null,
      "surveillanceObjectDtoList": [
        {
          "objId": null,
          "objType": null,
          "photoUrl": null,
          "uid": null
        }
      ],
      "pointDtoList": [
        {
          "address": null,
          "longitude": null,
          "latitude": null,
          "devList": [
            {
              "deviceId": null,
              "trackId": null,
              "uid": null,
              "deviceName": null
            }
          ],
          "radius": null,
          "deviceChara": null,
          "groupId": null,
          "groupName": null,
          "uid": null
        }
      ],
      "carNumberInfo": null,
      "uid": null
    }
  ]
}