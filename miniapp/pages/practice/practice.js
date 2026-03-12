const app = getApp();

Page({
  data: {
    currentLevel: 1,
    yearList: [
      { year: 2024, count: 150 },
      { year: 2023, count: 200 },
      { year: 2022, count: 180 },
      { year: 2021, count: 160 },
      { year: 2020, count: 140 },
      { year: 2019, count: 120 },
      { year: 2018, count: 100 },
      { year: 2017, count: 80 }
    ],
    tags: ['齿轮传动', '传感器', 'Arduino', '编程基础', '机械结构', '动力系统', '控制器', '舵机控制', '超声波', '循迹']
  },

  onLoad() {
    const level = wx.getStorageSync('currentLevel') || 1;
    this.setData({ currentLevel: level });
  },

  // 切换等级
  switchLevel(e) {
    const level = e.currentTarget.dataset.level;
    this.setData({ currentLevel: level });
    wx.setStorageSync('currentLevel', level);
  },

  // 顺序练习
  startSequence() {
    wx.navigateTo({
      url: `/pages/question/question?mode=sequence&level=${this.data.currentLevel}`
    });
  },

  // 随机练习
  startRandom() {
    wx.navigateTo({
      url: `/pages/question/question?mode=random&level=${this.data.currentLevel}`
    });
  },

  // 错题练习
  startWrong() {
    wx.navigateTo({
      url: '/pages/question/question?mode=wrong'
    });
  },

  // 收藏练习
  startFavorite() {
    wx.navigateTo({
      url: '/pages/question/question?mode=favorite'
    });
  },

  // 按年份练习
  practiceByYear(e) {
    const year = e.currentTarget.dataset.year;
    wx.navigateTo({
      url: `/pages/question/question?mode=year&level=${this.data.currentLevel}&year=${year}`
    });
  },

  // 按知识点练习
  practiceByTag(e) {
    const tag = e.currentTarget.dataset.tag;
    wx.navigateTo({
      url: `/pages/question/question?mode=tag&level=${this.data.currentLevel}&tag=${encodeURIComponent(tag)}`
    });
  }
});
