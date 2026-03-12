const app = getApp();

Page({
  data: {
    currentLevel: 1,
    levelNames: ['入门', '基础', '进阶', '提高', '应用', '综合', '创新', '精通'],
    stats: {
      totalQuestions: 0,
      correctRate: 0,
      streak: 0,
      totalExams: 0
    }
  },

  onLoad() {
    this.loadStats();
  },

  onShow() {
    this.loadStats();
  },

  // 加载统计数据
  loadStats() {
    const userInfo = app.globalData.userInfo;
    if (userInfo && userInfo.stats) {
      const { totalQuestions, correctQuestions, streak, totalExams } = userInfo.stats;
      this.setData({
        stats: {
          totalQuestions: totalQuestions || 0,
          correctRate: totalQuestions > 0 
            ? Math.round((correctQuestions / totalQuestions) * 100) 
            : 0,
          streak: streak || 0,
          totalExams: totalExams || 0
        }
      });
    }
  },

  // 选择等级
  selectLevel(e) {
    const level = e.currentTarget.dataset.level;
    this.setData({ currentLevel: level });
    wx.setStorageSync('currentLevel', level);
  },

  // 开始顺序练习
  startPractice() {
    wx.navigateTo({
      url: `/pages/practice/practice?level=${this.data.currentLevel}&mode=sequence`
    });
  },

  // 开始模拟考试
  startMockExam() {
    wx.navigateTo({
      url: `/pages/exam/exam?level=${this.data.currentLevel}&mode=mock`
    });
  },

  // 错题重做
  continueWrong() {
    wx.navigateTo({
      url: '/pages/practice/practice?mode=wrong'
    });
  },

  // 查看收藏
  viewFavorites() {
    wx.navigateTo({
      url: '/pages/practice/practice?mode=favorite'
    });
  }
});
