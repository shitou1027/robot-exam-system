const app = getApp();

Page({
  data: {
    examStarted: false,
    selectedLevel: 1,
    questionCounts: ['10', '20', '30', '50'],
    questionCountIndex: 2,
    
    // 考试中
    examId: null,
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    answers: [],
    timeLeft: 3600, // 60分钟
    timer: null
  },

  onLoad(options) {
    if (options.level) {
      this.setData({ selectedLevel: parseInt(options.level) });
    }
  },

  onUnload() {
    this.stopTimer();
  },

  // 选择等级
  selectLevel(e) {
    const level = e.currentTarget.dataset.level;
    this.setData({ selectedLevel: level });
  },

  // 选择题目数量
  onQuestionCountChange(e) {
    this.setData({ questionCountIndex: e.detail.value });
  },

  // 开始考试
  startExam() {
    const { selectedLevel, questionCounts, questionCountIndex } = this.data;
    const questionCount = parseInt(questionCounts[questionCountIndex]);

    wx.showLoading({ title: '加载中' });

    // 创建考试
    wx.request({
      url: `${app.globalData.apiBaseUrl}/exams/start`,
      method: 'POST',
      data: {
        userId: app.globalData.userInfo?.id || 'guest',
        level: selectedLevel,
        type: 'mock',
        config: { questionCount, timeLimit: 60 }
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.success) {
          const { examId, questions, config } = res.data.data;
          this.setData({
            examStarted: true,
            examId,
            questions,
            currentQuestion: questions[0],
            answers: new Array(questions.length).fill(''),
            timeLeft: config.timeLimit * 60
          });
          this.startTimer();
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '开始失败', icon: 'none' });
      }
    });
  },

  // 启动计时器
  startTimer() {
    const timer = setInterval(() => {
      let { timeLeft } = this.data;
      if (timeLeft > 0) {
        timeLeft--;
        this.setData({ timeLeft });
      } else {
        this.stopTimer();
        this.autoSubmit();
      }
    }, 1000);
    this.setData({ timer });
  },

  // 停止计时器
  stopTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },

  // 格式化时间
  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  },

  // 选择答案
  selectAnswer(e) {
    const key = e.currentTarget.dataset.key;
    const { answers, currentIndex } = this.data;
    answers[currentIndex] = key;
    this.setData({ answers });
  },

  // 跳转到指定题目
  jumpToQuestion(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentIndex: index,
      currentQuestion: this.data.questions[index]
    });
  },

  // 上一题
  prevQuestion() {
    if (this.data.currentIndex > 0) {
      const newIndex = this.data.currentIndex - 1;
      this.setData({
        currentIndex: newIndex,
        currentQuestion: this.data.questions[newIndex]
      });
    }
  },

  // 下一题
  nextQuestion() {
    if (this.data.currentIndex < this.data.questions.length - 1) {
      const newIndex = this.data.currentIndex + 1;
      this.setData({
        currentIndex: newIndex,
        currentQuestion: this.data.questions[newIndex]
      });
    }
  },

  // 提交考试
  submitExam() {
    wx.showModal({
      title: '确认提交',
      content: `已答 ${this.data.answers.filter(a => a).length}/${this.data.questions.length} 题，确定提交吗？`,
      success: (res) => {
        if (res.confirm) {
          this.doSubmit();
        }
      }
    });
  },

  // 自动提交
  autoSubmit() {
    wx.showModal({
      title: '时间到',
      content: '考试时间已结束，系统将自动提交',
      showCancel: false,
      success: () => {
        this.doSubmit();
      }
    });
  },

  // 执行提交
  doSubmit() {
    const { examId, answers, questions } = this.data;

    wx.showLoading({ title: '提交中' });

    // 提交所有答案
    const submitPromises = answers.map((answer, index) => {
      if (answer) {
        return new Promise((resolve) => {
          wx.request({
            url: `${app.globalData.apiBaseUrl}/exams/${examId}/answer`,
            method: 'POST',
            data: {
              questionId: questions[index]._id,
              answer
            },
            success: resolve,
            fail: resolve
          });
        });
      }
      return Promise.resolve();
    });

    Promise.all(submitPromises).then(() => {
      // 提交试卷
      wx.request({
        url: `${app.globalData.apiBaseUrl}/exams/${examId}/submit`,
        method: 'POST',
        success: (res) => {
          wx.hideLoading();
          if (res.data.success) {
            const { score } = res.data.data;
            wx.redirectTo({
              url: `/pages/result/result?score=${JSON.stringify(score)}&examId=${examId}`
            });
          }
        }
      });
    });
  }
});
