// 小程序入口
App({
  globalData: {
    userInfo: null,
    token: null,
    // 修改为你的后端API地址
    apiBaseUrl: 'http://localhost:3000/api'
  },

  onLaunch() {
    // 检查登录状态
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
      this.getUserInfo();
    }
  },

  // 获取用户信息
  getUserInfo() {
    wx.request({
      url: `${this.globalData.apiBaseUrl}/user/profile`,
      header: {
        'Authorization': `Bearer ${this.globalData.token}`
      },
      success: (res) => {
        if (res.data.success) {
          this.globalData.userInfo = res.data.data;
        }
      }
    });
  },

  // 登录
  login(code, userInfo) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.globalData.apiBaseUrl}/auth/wechat-login`,
        method: 'POST',
        data: { code, userInfo },
        success: (res) => {
          if (res.data.success) {
            const { token, user } = res.data.data;
            wx.setStorageSync('token', token);
            this.globalData.token = token;
            this.globalData.userInfo = user;
            resolve(user);
          } else {
            reject(res.data.error);
          }
        },
        fail: reject
      });
    });
  }
});
