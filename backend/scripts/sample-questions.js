module.exports = [
  {
    questionNo: '2024-1-001',
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
    tags: ['基础结构', '机器人组成'],
    difficulty: 'easy',
    status: 'active'
  },
  {
    questionNo: '2024-1-002',
    content: '下列没有运用三角形稳定性的是？',
    type: 'single',
    options: [
      { key: 'A', content: '自行车车架' },
      { key: 'B', content: '伸缩门' },
      { key: 'C', content: '屋顶桁架' },
      { key: 'D', content: '起重机吊臂' }
    ],
    answer: 'B',
    explanation: '伸缩门使用的是平行四边形结构，利用的是不稳定性。',
    level: 1,
    year: 2024,
    tags: ['机械结构', '三角形稳定性'],
    difficulty: 'easy',
    status: 'active'
  },
  {
    questionNo: '2024-1-003',
    content: '以下哪个是机器人必需具备的？',
    type: 'single',
    options: [
      { key: 'A', content: '动力来源' },
      { key: 'B', content: '机械手臂' },
      { key: 'C', content: '金属外壳' },
      { key: 'D', content: '人的形象' }
    ],
    answer: 'A',
    explanation: '机器人必须有动力来源才能运动和工作，其他都不是必需的。',
    level: 1,
    year: 2024,
    tags: ['机器人基础', '动力'],
    difficulty: 'easy',
    status: 'active'
  },
  {
    questionNo: '2024-1-004',
    content: '关于吹风扇能降低身体表面温度，错误的是？',
    type: 'single',
    options: [
      { key: 'A', content: '风扇一定吹出的是冷风' },
      { key: 'B', content: '风扇能加快人体表面气流的速度' },
      { key: 'C', content: '实际上是通过汗液的蒸发带走人体热量降温' },
      { key: 'D', content: '空气流动加快散热' }
    ],
    answer: 'A',
    explanation: '风扇只是加快空气流动，不一定吹出冷风。降温原理是加速汗液蒸发散热。',
    level: 1,
    year: 2024,
    tags: ['物理常识', '热学'],
    difficulty: 'medium',
    status: 'active'
  },
  {
    questionNo: '2024-1-005',
    content: '机械手表、电子手表、小汽车、自行车中，都有齿轮的是？',
    type: 'multiple',
    options: [
      { key: 'A', content: '机械手表' },
      { key: 'B', content: '电子手表' },
      { key: 'C', content: '小汽车' },
      { key: 'D', content: '自行车' }
    ],
    answer: 'ACD',
    explanation: '机械手表、小汽车、自行车都有齿轮传动系统。电子手表通常使用电子元件，没有机械齿轮。',
    level: 1,
    year: 2024,
    tags: ['齿轮', '机械传动'],
    difficulty: 'medium',
    status: 'active'
  },
  {
    questionNo: '2024-2-001',
    content: '六足机器人中装有分别控制机器人两边的电机，当左侧电机向前速度为150，右侧电机向前速度为250时，六足机器人会？',
    type: 'single',
    options: [
      { key: 'A', content: '向右转' },
      { key: 'B', content: '向左转，并且是一边前行一边左转' },
      { key: 'C', content: '以左边中间的足部为圆心向左转' },
      { key: 'D', content: '以左边靠前的足部为圆心向左转' }
    ],
    answer: 'B',
    explanation: '差速转向原理：右侧速度大于左侧，机器人会向速度较慢的左侧转弯，同时前进。',
    level: 2,
    year: 2024,
    tags: ['运动控制', '差速转向'],
    difficulty: 'medium',
    status: 'active'
  },
  {
    questionNo: '2024-2-002',
    content: '下列哪个模型中含有凸轮机构？',
    type: 'single',
    options: [
      { key: 'A', content: '跷跷板' },
      { key: 'B', content: '剪刀' },
      { key: 'C', content: '内燃机' },
      { key: 'D', content: '天平' }
    ],
    answer: 'C',
    explanation: '内燃机使用凸轮机构控制气门的开启和关闭。',
    level: 2,
    year: 2024,
    tags: ['凸轮机构', '机械结构'],
    difficulty: 'medium',
    status: 'active'
  },
  {
    questionNo: '2024-2-003',
    content: '齿轮平行啮合时，两齿轮的转向关系是？',
    type: 'single',
    options: [
      { key: 'A', content: '相同' },
      { key: 'B', content: '相反' },
      { key: 'C', content: '无关' },
      { key: 'D', content: '有时相同有时相反' }
    ],
    answer: 'B',
    explanation: '平行轴齿轮啮合时，两齿轮转向相反。外啮合转向相反，内啮合转向相同。',
    level: 2,
    year: 2024,
    tags: ['齿轮', '传动'],
    difficulty: 'easy',
    status: 'active'
  },
  {
    questionNo: '2024-3-001',
    content: '在Arduino编程中，下列哪个函数用于设置引脚模式？',
    type: 'single',
    options: [
      { key: 'A', content: 'digitalWrite()' },
      { key: 'B', content: 'pinMode()' },
      { key: 'C', content: 'analogRead()' },
      { key: 'D', content: 'delay()' }
    ],
    answer: 'B',
    explanation: 'pinMode(pin, mode)用于设置引脚为输入(INPUT)或输出(OUTPUT)模式。',
    level: 3,
    year: 2024,
    tags: ['Arduino', '编程基础'],
    difficulty: 'easy',
    status: 'active'
  },
  {
    questionNo: '2024-3-002',
    content: '超声波传感器的工作原理是？',
    type: 'single',
    options: [
      { key: 'A', content: '发射红外线并接收反射' },
      { key: 'B', content: '发射超声波并接收反射' },
      { key: 'C', content: '检测磁场变化' },
      { key: 'D', content: '检测光线强度' }
    ],
    answer: 'B',
    explanation: '超声波传感器通过发射超声波脉冲并接收反射波，根据时间差计算距离。',
    level: 3,
    year: 2024,
    tags: ['传感器', '超声波'],
    difficulty: 'easy',
    status: 'active'
  },
  {
    questionNo: '2024-3-003',
    content: '舵机的控制信号是？',
    type: 'single',
    options: [
      { key: 'A', content: '模拟电压' },
      { key: 'B', content: 'PWM信号' },
      { key: 'C', content: '数字高低电平' },
      { key: 'D', content: '串口数据' }
    ],
    answer: 'B',
    explanation: '舵机通过PWM（脉宽调制）信号控制角度，通常周期为20ms，脉宽0.5-2.5ms对应0-180度。',
    level: 3,
    year: 2024,
    tags: ['舵机', 'PWM'],
    difficulty: 'medium',
    status: 'active'
  },
  {
    questionNo: '2024-3-004',
    content: 'NPN型三极管导通的条件是？',
    type: 'single',
    options: [
      { key: 'A', content: '基极电压低于发射极' },
      { key: 'B', content: '基极电压高于发射极' },
      { key: 'C', content: '集电极电压低于基极' },
      { key: 'D', content: '发射极电压高于集电极' }
    ],
    answer: 'B',
    explanation: 'NPN三极管导通需要在基极加正向电压（高于发射极约0.7V），使基极-发射极间形成电流。',
    level: 3,
    year: 2024,
    tags: ['电子电路', '三极管'],
    difficulty: 'hard',
    status: 'active'
  }
];
