Page({
  data: {
    latitude: 40.06021,
    longitude: 116.3433,
    markers: [{
      iconPath: '/images/navi.png',
      id: 0,
      latitude: 40.06021,
      longitude: 116.3433,
      width: 50,
      height: 50
    }]

  },
  markertap: function () {
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      name: 'XX大酒店',
      address: '北京市 海淀区 XX路'
    })
  }
})