// 简易内存数据库（开发测试用）
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/db.json');

// 确保数据目录存在
if (!fs.existsSync(path.dirname(DB_FILE))) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}

// 加载数据
let data = {
  questions: [],
  users: [],
  exams: []
};

try {
  if (fs.existsSync(DB_FILE)) {
    data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  }
} catch (e) {
  console.log('创建新数据库文件');
}

// 保存数据
function save() {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// 生成ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = {
  // 用户操作
  users: {
    find: (query = {}) => {
      return data.users.filter(u => {
        for (let key in query) {
          if (u[key] !== query[key]) return false;
        }
        return true;
      });
    },
    findOne: (query) => {
      return data.users.find(u => {
        for (let key in query) {
          if (u[key] !== query[key]) return false;
        }
        return true;
      });
    },
    findById: (id) => data.users.find(u => u._id === id),
    create: (userData) => {
      const user = { _id: generateId(), ...userData, createdAt: new Date() };
      data.users.push(user);
      save();
      return user;
    },
    save: (user) => {
      const index = data.users.findIndex(u => u._id === user._id);
      if (index !== -1) {
        data.users[index] = { ...data.users[index], ...user };
        save();
        return data.users[index];
      }
      return null;
    }
  },

  // 题目操作
  questions: {
    find: (query = {}, options = {}) => {
      let results = data.questions.filter(q => {
        for (let key in query) {
          if (key === 'tags' && query[key].$in) {
            if (!query[key].$in.some(tag => q.tags?.includes(tag))) return false;
          } else if (q[key] !== query[key]) {
            return false;
          }
        }
        return true;
      });
      
      if (options.sort) {
        const [field, order] = Object.entries(options.sort)[0];
        results.sort((a, b) => order === -1 ? b[field] - a[field] : a[field] - b[field]);
      }
      
      if (options.limit) {
        results = results.slice(0, options.limit);
      }
      
      return results;
    },
    findById: (id) => data.questions.find(q => q._id === id),
    countDocuments: (query = {}) => {
      return module.exports.questions.find(query).length;
    },
    create: (questionData) => {
      const question = { _id: generateId(), ...questionData };
      data.questions.push(question);
      save();
      return question;
    },
    insertMany: (questions) => {
      const newQuestions = questions.map(q => ({ _id: generateId(), ...q }));
      data.questions.push(...newQuestions);
      save();
      return newQuestions;
    },
    deleteMany: () => {
      data.questions = [];
      save();
    },
    distinct: (field) => [...new Set(data.questions.map(q => q[field]))].filter(Boolean)
  },

  // 考试操作
  exams: {
    find: (query = {}) => data.exams.filter(e => {
      for (let key in query) {
        if (e[key] !== query[key]) return false;
      }
      return true;
    }),
    findById: (id) => data.exams.find(e => e._id === id),
    create: (examData) => {
      const exam = { _id: generateId(), ...examData, createdAt: new Date() };
      data.exams.push(exam);
      save();
      return exam;
    },
    save: (exam) => {
      const index = data.exams.findIndex(e => e._id === exam._id);
      if (index !== -1) {
        data.exams[index] = { ...data.exams[index], ...exam };
        save();
        return data.exams[index];
      }
      return null;
    },
    countDocuments: (query = {}) => module.exports.exams.find(query).length
  },

  // 初始化数据
  init: () => {
    // 添加示例题目
    const sampleQuestions = require('../scripts/sample-questions');
    if (data.questions.length === 0) {
      module.exports.questions.insertMany(sampleQuestions);
      console.log(`✅ 已加载 ${sampleQuestions.length} 道示例题目`);
    }
  }
};
