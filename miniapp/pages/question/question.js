const app = getApp();

Page({
  data: {
    mode: 'sequence', // sequence-顺序, wrong-错题, favorite-收藏, mock-模拟考
    level: 1,
    questions: [],
    currentIndex: 0,
    currentQuestion: null,
    selectedAnswer: '',
    showResult: false,
    isFavorited: false,
    progress: 0,
    answers: [], // 记录所有答案
    examId: null,
    typeMap: {
      'single': '单选',
      'multiple': '多选',
      'judge': '判断'
    }
  },

  onLoad(options) {
    const { mode = 'sequence', level = 1, examId } = options;
    this.setData({ mode, level: parseInt(level), examId });
    
    if (mode === 'mock' && examId) {
      this.loadExam(examId);
    } else {
      this.loadQuestions();
    }
  },

  // 加载题目
  loadQuestions() {
    const { level, mode } = this.data;

    wx.request({
      url: `${app.globalData.apiBaseUrl}/questions`,
      data: { level, limit: 50 },
      success: (res) => {
        if (res.data.success) {
          const questions = res.data.data;
          this.setData({
            questions,
            currentQuestion: questions[0],
            progress: questions.length > 0 ? (1 / questions.length * 100) : 0
          });
          this.checkFavorite();
        }
      },
      fail: () => {
        // 临时：显示示例题目
        const sampleQuestions = [
          {
            _id: '1',
            content: '机器人结构中，起着支撑作用的部件是？',
            type: 'single',
            options: [
              { key: 'A', content: '机座' },
              { key: 'B', content: '电机' },
              { key: 'C', content: '腰部' },
              { key: 'D', content: '手臂' }
            ],
            answer: 'A',
            explanation: '机座是机器人的基础部件，起到支撑整个机器人的作用。',
            level: 1,
            year: 2024,
            difficulty: 'easy'
          }
        ];
        this.setData({
          questions: sampleQuestions,
          currentQuestion: sampleQuestions[0],
          progress: 100
        });
      }
    });
  },

  // 加载考试
  loadExam(examId) {
    // 这里应该从服务器获取考试信息
    this.loadQuestions();
  },

  // 选择选项
  selectOption(e) {
    if (this.data.showResult) return;
    
    const key = e.currentTarget.dataset.key;
    this.setData({ selectedAnswer: key });
  },

  // 提交答案
  submitAnswer() {
    const { selectedAnswer, currentQuestion, currentIndex, questions } = this.data;
    
    if (!selectedAnswer) {
      wx.showToast({ title: '请选择答案', icon: 'none' });
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.answer;
    
    // 记录答案
    const answers = this.data.answers;
    answers[currentIndex] = {
      questionId: currentQuestion._id,
      answer: selectedAnswer,
      isCorrect
    };

    this.setData({ 
      showResult: true,
      answers
    });

    // 如果答错，加入错题本
    if (!isCorrect) {
      this.addToWrong(currentQuestion._id);
    }
  },

  // 下一题
  nextQuestion() {
    const { currentIndex, questions } = this.data;
    
    if (currentIndex >= questions.length - 1) {
      // 完成
      this.finishPractice();
      return;
    }

    const nextIndex = currentIndex + 1;
    this.setData({
      currentIndex: nextIndex,
      currentQuestion: questions[nextIndex],
      selectedAnswer: '',
      showResult: false,
      progress: ((nextIndex + 1) / questions.length * 100)
    });
    
    this.checkFavorite();
  },

  // 完成练习
  finishPractice() {
    const { answers, mode } = this.data;
    const correct = answers.filter(a => a?.isCorrect).length;
    const total = answers.length;
    
    wx.showModal({
      title: '练习完成',
      content: `答对 ${correct}/${total} 题，正确率 ${Math.round(correct/total*100)}%`,
      showCancel: false,
      success: () => {
        wx.navigateBack();
      }
    });
  },

  // 收藏/取消收藏
  toggleFavorite() {
    const { currentQuestion, isFavorited } = this.data;
    const userId = app.globalData.userInfo?.id;
    
    if (!userId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    wx.request({
      url: `${app.globalData.apiBaseUrl}/user/${userId}/favorite`,
      method: 'POST',
      data: { questionId: currentQuestion._id },
      success: (res) => {
        if (res.data.success) {
          this.setData({ isFavorited: !isFavorited });
          wx.showToast({ 
            title: isFavorited ? '已取消收藏' : '已收藏',
            icon: 'success'
          });
        }
      }
    });
  },

  // 检查是否已收藏
  checkFavorite() {
    const { currentQuestion } = this.data;
    const userInfo = app.globalData.userInfo;
    
    if (userInfo?.favorites) {
      const isFavorited = userInfo.favorites.some(
        f => f._id === currentQuestion._id
      );
      this.setData({ isFavorited });
    }
  },

  // 添加到错题本
  addToWrong(questionId) {
    const userId = app.globalData.userInfo?.id;
    if (!userId) return;

    wx.request({
      url: `${app.globalData.apiBaseUrl}/user/${userId}/wrong`,
      method: 'POST',
      data: { questionId }
    });
  },

  // 计算属性
  isLast() {
    return this.data.currentIndex >= this.data.questions.length - 1;
  }
});
