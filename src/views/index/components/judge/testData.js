export const testData = {
  sxt: [
    {
      id: 1,
      time: '2018-12-11 14:25',
      latitude: 28.093856,
      longitude: 112.973557,
      checked: true,
      playing: false,
      vUrl: '../../../../assets/video/demo.mp4'
    }, {
      id: 2,
      time: '2018-12-12 14:25',
      latitude: 28.093804,
      longitude: 112.976828,
      checked: true,
      playing: false,
      vUrl: '../../../../assets/video/demo.mp4'
    },
    {
      id: 3,
      time: '2018-12-13 14:25',
      latitude: 28.093222,
      longitude: 112.978718,
      checked: true,
      playing: false,
      vUrl: '../../../../assets/video/demo.mp4'
    }, {
      id: 4,
      time: '2018-12-14 14:25',
      latitude: 28.093537,
      longitude: 112.981628,
      checked: true,
      playing: false,
      vUrl: '../../../../assets/video/demo.mp4'
    },
    {
      id: 5,
      time: '2018-12-15 14:25',
      latitude: 28.094869,
      longitude: 112.975227,
      checked: true,
      playing: false,
      vUrl: '../../../../assets/video/demo.mp4'
    },
  ],
  zp: [
    {
      id: 1,
      name: '摄像头001',
      latitude: 28.093856,
      longitude: 112.973557,
      times: 1,
      checked: false,
      videoList: [
        {
          id: 'v1',
          time: '2018-12-11 14:25',
          playing: false,
        }
      ]
    }, {
      id: 2,
      name: '摄像头002',
      latitude: 28.093804,
      longitude: 112.976828,
      times: 4,
      checked: false,
      videoList: [
        {
          id: 'v2',
          time: '2018-12-11 14:25',
          playing: false,
        },
        {
          id: 'v3',
          time: '2018-12-11 14:25',
          playing: false,
        },
        {
          id: 'v4',
          time: '2018-12-11 14:25',
          playing: false,
        },
        {
          id: 'v5',
          time: '2018-12-11 14:25',
          playing: false,
        }
      ]
    },
    {
      id: 3,
      name: '摄像头003',
      latitude: 28.093222,
      longitude: 112.978718,
      times: 8,
      checked: false,
      videoList: [
        {
          id: 'v6',
          time: '2018-12-11 14:25',
          playing: false,
        },
        {
          id: 'v7',
          time: '2018-12-11 14:25',
          playing: false,
        },
        {
          id: 'v8',
          time: '2018-12-11 14:25',
          playing: false,
        },
        {
          id: 'v9',
          time: '2018-12-11 14:25',
          playing: false,
        },
        {
          id: 'v10',
          time: '2018-12-11 14:25',
          checked: true,
          playing: false,
        },
        {
          id: 'v11',
          time: '2018-12-11 14:25',
          playing: false,
        },
        {
          id: 'v12',
          time: '2018-12-11 14:25',
          playing: false,
        },
        {
          id: 'v13',
          time: '2018-12-11 14:25',
          playing: false,
        }
      ]
    }, {
      id: 4,
      name: '摄像头004',
      latitude: 28.093537,
      longitude: 112.981628,
      times: 1,
      checked: false,
      videoList: [
        {
          id: 'v14',
          time: '2018-12-11 14:25',
          playing: false,
        }
      ]
    },
    {
      id: 5,
      name: '摄像头005',
      latitude: 28.094869,
      longitude: 112.975227,
      times: 1,
      checked: false,
      videoList: [
        {
          id: 'v15',
          time: '2018-12-11 14:25',
          playing: false,
        }
      ]
    },
  ],
  gw: [
    {
      addLongitude: 112.973557,
      addLatitude: 28.093856,
      snapNum: 10,
      checked: false,
      childList: [
        [
          {
            semblance: 10,
            snapPhoto: '',
            snapNum: 2,
            shotTime: '18-12-23 14:23'
          },
          {
            semblance: 20,
            snapPhoto: '',
            snapNum: 4,
            shotTime: '18-12-23 14:23'
          },
          {
            semblance: 30,
            snapPhoto: '',
            snapNum: 4,
            shotTime: '18-12-23 14:23'
          }
        ]
      ]
    },
    {
      addLongitude: 112.975227,
      addLatitude: 28.094869,
      snapNum: 30,
      checked: false,
      childList: [
        {
          semblance: 10,
          snapPhoto: '',
          snapNum: 10,
          shotTime: '18-12-23 14:23'
        },
        {
          semblance: 20,
          snapPhoto: '',
          snapNum: 10,
          shotTime: '18-12-23 14:23'
        },
        {
          semblance: 30,
          snapPhoto: '',
          snapNum: 10,
          shotTime: '18-12-23 14:23'
        }
      ]
    }
  ],
  cameraData: [
    {
      id: '1',
      name: '常用点位',
      cList: [
        {name: '舌头1', id: '1-1'},
        {name: '舌头2', id: '1-2'},
        {name: '舌头3', id: '1-3'},
        {name: '舌头4', id: '1-4'},
        {name: '舌头5', id: '1-5'},
        {name: '舌头6', id: '1-6'}
      ]
    },
    {
      id: '2',
      name: '自定义点位',
      cList: [
        {name: '摄像头1', id: '2-1'},
        {name: '摄像头2', id: '2-2'},
        {name: '摄像头3', id: '2-3'},
        {name: '摄像头4', id: '2-4'},
        {name: '摄像头5', id: '2-5'}
      ]
    }
  ],
  testList: [
    {id: 1, structureType: 1, deviceName: '摄像头1',semblance: 432},
    {id: 5, structureType: 1, deviceName: '摄像头5',semblance: 432},
    {id: 2, structureType: 1, deviceName: '摄像头2',semblance: 432},
    {id: 3, structureType: 1, deviceName: '摄像头3',semblance: 432},
    {id: 4, structureType: 1, deviceName: '摄像头4',semblance: 432},
    {id: 1, structureType: 1, deviceName: '摄像头1',semblance: 432},
    {id: 5, structureType: 1, deviceName: '摄像头5',semblance: 432},
    {id: 2, structureType: 1, deviceName: '摄像头2',semblance: 432},
    {id: 3, structureType: 1, deviceName: '摄像头3',semblance: 432},
    {id: 4, structureType: 1, deviceName: '摄像头4',semblance: 432},
    {id: 1, structureType: 1, deviceName: '摄像头1',semblance: 432},
    {id: 5, structureType: 1, deviceName: '摄像头5',semblance: 432},
    {id: 2, structureType: 1, deviceName: '摄像头2',semblance: 432},
    {id: 3, structureType: 1, deviceName: '摄像头3',semblance: 432},
    {id: 4, structureType: 1, deviceName: '摄像头4',semblance: 432},
    {id: 1, structureType: 1, deviceName: '摄像头1',semblance: 432}
  ]
}