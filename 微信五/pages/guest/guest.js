Page({
  data: {
    picker: {
      arr: ['0', '1', '2', '3', '4', '5', '6'],
      index: 1
    }
  },
  pickerChange: function (e) {
    this.setData({
      'picker.index': e.detail.value
    })
  },
  // 验证姓名
  nameChange: function (e) {
    this.checkName(e.detail.value)
  },
  // 验证手机号
  phoneChange: function (e) {
    this.checkPhone(e.detail.value)
  },
  // checkName()方法
  checkName: function (data) {
    var reg = /^[\u4E00-\u9FA5A-Za-z]+$/;
    return this.check(data, reg, '姓名输入错误！')
  },
  // checkPhone()方法
  checkPhone: function (data) {
    var reg = /^(((13)|(15)|(17)|(18))\d{9})$/;
    return this.check(data, reg, '手机号码输入有误！')
  },
  // check()方法
  check: function (data, reg, errMsg) {
    if (!reg.test(data)) {
      wx.showToast({
        title: errMsg,
        icon: 'none',
        duration: 1500
      })
    }
    return true
  },
  formSubmit: function (e) {
    var name = e.detail.value.name
    var phone = e.detail.value.phone
    if (this.checkName(name) && this.checkPhone(phone)) {
      // 在此处可编写代码将e.detail.value提交到服务器
      wx.login({
        success: res => {
          server.post({
            formId: e.detail.formId,
            code: res.code
          }, () => {
            // 将表单提交给服务器，传入formId和code
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1500
            })
            // 提交成功后，由服务器发送模板消息
            server.sendTemplateMessage(res => {
              console.log('模板消息发送结果：', res.data)
            })
          })
        },
      })
    }
  }
})
// 模拟服务器端代码
var server = {
  appid: '', // 在此处填写自己的appid
  secret: '', // 在此处填写自己的secret
  // 用于保存用户的openid和formId
  user: {
    openid: '',
    formId: ''
  },
  // 用于接收表单，调用this.getOpenid()根据code换取openid
  post: function (data, success) {
    console.log('收到客户端提交的数据：', data)
    this.user.formId = data.formId
    this.getOpenid(data.code, res => {
      console.log('用户openid：' + res.data.openid)
      this.user.openid = res.data.openid
      success()
    })
  },
  // 用于根据code获取openid
  getOpenid: function (code, success) { },
  // 用于发送模板消息
  getOpenid: function (code, success) {
    wx.request({
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      data: {
        appid: this.appid,
        secret: this.secret,
        grant_type: 'authorization_code',
        js_code: code
      },
      success: success
    })
  },
  // 用于发送模板消息
  sendTemplateMessage: function (success) {
    var user = this.user
    var data = {
      touser: user.openid,
      template_id: '……',  // 在此处填写模板id
      page: 'index',
      form_id: user.formId,
      data: {
        keyword1: {
          value: '王辉辉、张琳琳'
        },
        keyword2: {
          value: '谢谢你的祝福'
        },
        keyword3: {
          value: '请记得按时参加婚宴哦'
        },
        keyword4: {
          value: '北京市海淀区XX路XX酒店'
        }
      }
    }
    this.getAccessToken(res => {
      var token = res.data.access_token
      console.log('服务器access_token：' + token)
      var url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + token
      wx.request({
        url: url,
        method: 'post',
        data: data,
        success: success
      })
    })
  },
  // 用于获取access_token
  getAccessToken: function (success) {
    var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + this.appid + '&secret=' + this.secret
    wx.request({
      url: url,
      success: success
    })

  }
}