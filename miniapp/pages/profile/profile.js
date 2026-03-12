const app = getApp();

Page({
  data: {
    isLogin: false,
    userInfo: {},
    currentLevel: 1,
    stats: {
      totalQuestions: 0,
      correctRate: 0,
      streak: 0,
      totalExams: 0
    }
  },

  onShow() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    const currentLevel = wx.getStorageSync('currentLevel') || 1;
    
    this.setData({
      isLogin: !!userInfo,
      userInfo: userInfo || {},
      currentLevel
    });

    if (userInfo?.stats) {
      const { totalQuestions, correctQuestions, streak, totalExams } = userInfo.stats;
      this.setData({
        stats: {
          totalQuestions: totalQuestions || 0,
          correctRate: totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0,
          streak: streak || 0,
          totalExams: totalExams || 0
        }
      });
    }
  },

  // 模拟登录
  doLogin() {
    const mockUser = {
      id: 'user_' + Date.now(),
      nickname: '机器人学员',
      avatar: '',
      role: 'user',
      stats: { totalQuestions: 0, correctQuestions: 0, streak: 0, totalExams: 0 }
    };
    
    app.globalData.userInfo = mockUser;
    wx.setStorageSync('userInfo', mockUser);
    
    this.setData({
      isLogin: true,
      userInfo: mockUser,
      stats: mockUser.stats
    });
    
    wx.showToast({ title: '登录成功', icon: 'success' });
  },

  // 考试记录
  viewHistory() {
    wx.navigateTo({ url: '/pages/history/history' });
  },

  // 错题本
  viewWrong() {
    wx.navigateTo({ url: '/pages/question/question?mode=wrong' });
  },

  // 收藏
  viewFavorite() {
    wx.navigateTo({ url: '/pages/question/question?mode=favorite' });
  },

  // 学习进度
  viewProgress() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  // 切换等级
  chooseLevel() {
    wx.showActionSheet({
      itemList: ['1级', '2级', '3级', '4级', '5级', '6级', '7级', '8级'],
      success: (res) => {
        const level = res.tapIndex + 1;
        this.setData({ currentLevel: level });
        wx.setStorageSync('currentLevel', level);
        wx.showToast({ title: `已切换到${level}级`, icon: 'success' });
      }
    });
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '提示',
      content: '确定要清除缓存吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          this.setData({
            isLogin: false,
            userInfo: {},
            stats: { totalQuestions: 0, correctRate: 0, streak: 0, totalExams: 0 }
          });
          wx.showToast({ title: '已清除', icon: 'success' });
        }
      }
    });
  },

  // 关于
  about() {
    wx.showModal({
      title: '关于我们',
      content: '机器人等级考试刷题系统 v1.0.0\n\n帮助青少年掌握机器人技术知识',
      showCancel: false
    });
  }
});
