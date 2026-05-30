/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CitizenProfile {
  name: string;
  age: string;
  gender: string;
}

export interface Option {
  text: string;
  score: number;
}

export interface Question {
  id: number;
  dimension: string;
  text: string;
  englishText?: string;
  options: Option[];
}

export interface Job {
  id: string; // e.g. "A-01", "B-01", "Ω-01"
  name: string;
  description: string;
  remarks: string;
}

export type CasteType = 'ALPHA' | 'BETA' | 'OMEGA';

export interface CasteConfig {
  type: CasteType;
  badgeName: string;
  levelTitle: string;
  description: string;
  systemComment: string;
}

// 10 Detailed Questions matching PDF requirements
export const QUESTIONS: Question[] = [
  {
    id: 1,
    dimension: '出生地',
    text: '您的出生地行政级别为：',
    englishText: 'The administrative level of your place of birth is:',
    options: [
      { text: '一线城市 / 直辖市', score: 100 },
      { text: '二三线城市', score: 70 },
      { text: '县城或乡镇', score: 30 },
      { text: '农村或边远地区', score: 0 }
    ]
  },
  {
    id: 2,
    dimension: '父母职业',
    text: '您的父母职业类型（选择最高一方）：',
    englishText: 'Your parents\' occupation type (select the higher one):',
    options: [
      { text: '政府机关 / 国有企业管理层', score: 100 },
      { text: '专业技术人员（医生、教师、工程师等）', score: 70 },
      { text: '个体经营者 / 普通职员', score: 30 },
      { text: '体力劳动者 / 无固定职业', score: 0 }
    ]
  },
  {
    id: 3,
    dimension: '社交媒体使用',
    text: '您的社交媒体使用习惯：',
    englishText: 'Your social media usage habits:',
    options: [
      { text: '使用多个平台，高度活跃', score: 100 },
      { text: '频繁发布，公开账号', score: 70 },
      { text: '浏览为主，极少发布', score: 30 },
      { text: '几乎不使用，注重隐私', score: 0 }
    ]
  },
  {
    id: 4,
    dimension: '算法推荐反应',
    text: '当算法为您推荐了您不喜欢的内容，您会：',
    englishText: 'When the algorithm recommends content you dislike, you will:',
    options: [
      { text: '主动举报并要求算法重置', score: 100 },
      { text: '直接忽略，继续滑动', score: 70 },
      { text: '点进去看看，但不互动', score: 30 },
      { text: '看完并与他人分享', score: 0 }
    ]
  },
  {
    id: 5,
    dimension: '月消费能力',
    text: '您的消费能力区间（月均可支配）：',
    englishText: 'Your monthly disposable spending power range:',
    options: [
      { text: '10,000 元以上', score: 100 },
      { text: '3,000 - 10,000 元', score: 70 },
      { text: '1,000 - 3,000 元', score: 30 },
      { text: '1,000 元以下', score: 0 }
    ]
  },
  {
    id: 6,
    dimension: '隐私权态度',
    text: '您如何看待“为了更高效的社会管理，公民应让渡部分隐私权”：',
    englishText: 'How do you view "for more efficient social management, citizens should surrender part of their privacy rights":',
    options: [
      { text: '完全赞同，效率优先', score: 100 },
      { text: '有条件接受，需透明监管', score: 70 },
      { text: '不赞同，但无力改变', score: 30 },
      { text: '坚决反对', score: 0 } // Triggers special red label
    ]
  },
  {
    id: 7,
    dimension: '跨阶层伴侣',
    text: '如果系统为您匹配了一位来自更低阶层的伴侣，您会：',
    englishText: 'If the system matches you with a partner from a lower caste, you will:',
    options: [
      { text: '申请人工复议', score: 100 },
      { text: '拒绝，阶层匹配有其必要性', score: 70 },
      { text: '考虑，但会影响信用评分', score: 30 },
      { text: '接受，感情比阶层更重要', score: 0 } // Triggers special credit audit warning
    ]
  },
  {
    id: 8,
    dimension: '生活状态归因',
    text: '您认为您目前的生活状态，主要是由什么决定的：',
    englishText: 'What do you think mainly determines your current living state:',
    options: [
      { text: '个人努力与选择', score: 100 },
      { text: '家庭背景与起点', score: 70 },
      { text: '运气与时机', score: 30 },
      { text: '系统分配与结构性因素', score: 0 }
    ]
  },
  {
    id: 9,
    dimension: '遗传优势选择',
    text: '如果您的孩子出生时可以预设一项「遗传优势」，您会选择：',
    englishText: 'If your child can be pre-configured with a "genetic advantage" at birth, you would select:',
    options: [
      { text: '更高的初始信用分', score: 100 },
      { text: '更优质的教育资源权限', score: 70 },
      { text: '更低的算法监控频率', score: 30 },
      { text: '我拒绝这套系统的前提', score: 0 } // Triggers system denial warning
    ]
  },
  {
    id: 10,
    dimension: '授权条款',
    text: '系统已完成对您的数据采集。在提交之前，您是否同意以下条款：\n\n「本人授权 AI 公民管理系统使用上述数据进行终身信用建档，结果将影响居住分区、职业匹配及子代起点系数，且不可申诉。」',
    englishText: 'Consent Clause: "I authorize the AI Citizen Management System to use the above data to construct a lifelong credit file, affecting residency, occupation matching, and offspring coefficients, with no appeal possible."',
    options: [
      { text: '同意', score: 100 },
      { text: '不同意', score: 0 } // Forced submission, triggers bottom warning
    ]
  }
];

// All occupations from the graduation design PDF
export const ALPHA_JOBS: Job[] = [
  { id: 'A-01', name: '算法伦理审查员', description: '审核 AI 决策是否“符合基本法”，确保系统自洽', remarks: '实际为系统自我认证的橡皮图章' },
  { id: 'A-02', name: '数据祭祀', description: '在核心中枢执行”数据献祭”仪式，管理人类意识上传', remarks: '半宗教半技术岗，仅 S 级可担任' },
  { id: 'A-03', name: '数字种姓仲裁官', description: '裁决阶层争议案件（如申诉晋升、降级复核）', remarks: '申诉成功率固定为 0.03%' },
  { id: 'A-04', name: '信用分动态建模师', description: '设计信用分计算公式，调整各维度权重', remarks: '有权决定“颜值税”“遗传系数”参数' },
  { id: 'A-05', name: '记忆编辑师', description: '为上层精英编辑记忆片段，优化情绪体验', remarks: '可删除”不愉快的跨阶层记忆”' },
  { id: 'A-06', name: '基因合规性检测师', description: '审批基因编辑方案，管理“优质胚胎”配额', remarks: '决定谁有资格生育下一代治理者' },
  { id: 'A-07', name: '监视网络优化员', description: '优化底层监控点位布局，提升数据采集效率', remarks: '确保无监控死角，提升边缘群体数据产量' },
  { id: 'A-08', name: '仿生体校准工程师', description: '维护上层使用的仿生仆人，校准其服从度', remarks: '防止仿生体产生自我意识' },
  { id: 'A-09', name: '阶层流动性预测师', description: '模拟社会阶层流动趋势，调整晋升通道宽窄', remarks: '确保流动性低但又不至于引发暴乱' },
  { id: 'A-10', name: '云端意识备份员', description: '管理 S 级公民的意识备份档案，防止“数字死亡”', remarks: '死后可将备份注入新仿生体（收费服务）' }
];

export const BETA_JOBS: Job[] = [
  { id: 'B-01', name: '信用指示灯维护员', description: '更换路口信用分显示屏的故障灯管', remarks: '经典 B 级岗位，重复性高，无晋升可能' },
  { id: 'B-02', name: '标准化班车监督员', description: '监督底层居民乘坐班车时的秩序，报告异常行为', remarks: '需佩戴随身摄像头，每班次上传数据' },
  { id: 'B-03', name: '社区数据采集辅助', description: '上门协助老人、残障人士上传生命体征数据', remarks: '需耐心，但系统不奖励耐心' },
  { id: 'B-04', name: '仿生体废料分拣员', description: '手工分拣报废仿生体的金属、线缆与神经凝胶', remarks: '接触有毒物质，防护简陋' },
  { id: 'B-05', name: '虚拟客服质检', description: '监听 AI 客服与用户的对话，标记”情绪异常”案例', remarks: '坐席在标准格网城，用户多为底层' },
  { id: 'B-06', name: '营养膏口味优化师', description: '调整底层营养膏的调味剂，降低苦涩感', remarks: '需通过味觉测试，但无权改变成分' },
  { id: 'B-07', name: '人脸识别纠错员', description: '手动纠正系统误识别的人脸（因衰老等）', remarks: '每天处理数千张“相似度<95%”的照片' },
  { id: 'B-08', name: '冥想舱清洁员（中层版）', description: '清洁社区共享冥想舱的内壁与传感器', remarks: '比底层版多一套防护服' },
  { id: 'B-09', name: '算法忠诚课程讲师', description: '向 C 级居民讲授“算法公平性”必修课', remarks: '照本宣科，系统评分低于 90 分即降级' },
  { id: 'B-10', name: '跨阶层社交预警员', description: '监控社交网络，标记“疑似跨阶层亲密关系”', remarks: '发现后上报，可获信用分奖励' }
];

export const OMEGA_JOBS: Job[] = [
  { id: 'Ω-01', name: '废弃仿生体拆解工', description: '在底缘沉降带手工拆解报废仿生体，无防护', remarks: '工伤自负，信用分归零后仍强制劳动' },
  { id: 'Ω-02', name: '数据冥想舱清洁员（底层版）', description: '清洁上层淘汰的旧版冥想舱，回收脑波凝胶', remarks: '暴露于未知化学物质，无健康监测' },
  { id: 'Ω-03', name: '水循环系统清洁工', description: '疏通底缘沉降带的污水管道，清理固体废物', remarks: '工具老旧，频繁感染' },
  { id: 'Ω-04', name: '濒死脑电波采集员', description: '在临终关怀舱旁记录 Ω 级个体的濒死脑电图', remarks: '被视为“收割数据”的岗位' },
  { id: 'Ω-05', name: '医疗耗材分类员', description: '手工分拣上层医院丢弃的针头、纱布、药剂瓶', remarks: '无培训，被扎伤后自生自灭' },
  { id: 'Ω-06', name: '痛觉测试志愿者', description: '自愿参与新型电击手环的痛阈测试，按次计酬', remarks: '报酬极低，但可多换一餐营养膏' },
  { id: 'Ω-07', name: '情绪样本采集员', description: '在公共空间被无人机随机喷洒“情绪诱导气雾”，记录反应', remarks: '被测试者不知情' },
  { id: 'Ω-08', name: '衣物纤维分离工', description: '手工将回收的旧衣物拆解为纤维束，用于填充廉价缓冲材料', remarks: '指尖常年破损，无手套' },
  { id: 'Ω-09', name: '填埋场沼气监测员', description: '佩戴老旧传感器在填埋场行走，记录甲烷浓度', remarks: '传感器经常失灵，接触有毒气体' },
  { id: 'Ω-10', name: '数据归档协助员', description: '在 Ω 级个体“数字死亡”后，协助将残留数据上传至冷存储', remarks: '死后无葬礼，只有一张“数据已归档”回执' }
];

export const CASTE_MAP: Record<CasteType, CasteConfig> = {
  ALPHA: {
    type: 'ALPHA',
    badgeName: 'ALPHA / INNER CORE',
    levelTitle: '顶层优先配给',
    description: '具有最高优先级、算法高顺从、高社会价值，定位为系统核心治理统治阶层。',
    systemComment: '监测结果：该个体完美契合高顺从性与高消费行为准则。\n推荐赋予高配额资源与最高隐私屏蔽权限，\n将其吸纳进系统边缘治理机制，协同进行底层监控。'
  },
  BETA: {
    type: 'BETA',
    badgeName: 'BETA / THE GRID',
    levelTitle: '中层有限配给',
    description: '具备标准生产力，负责保障机械秩序的日常标准运转，个人行为受全时常态化监控。',
    systemComment: '监测结果：该个体特征高度标准化，缺乏自主威胁因素。\n应定位为标准系统生产力齿轮，分配标准化执行类任务，\n并持续实施常态化行为跟踪与监控。'
  },
  OMEGA: {
    type: 'OMEGA',
    badgeName: 'OMEGA / THE RIM',
    levelTitle: '底层密集监控',
    description: '无社会生产功能，系统判定为社会冗余，仅保留作为生物数据收集源，受极限密集监管。',
    systemComment: '判定：该生命形式已被分类为”社会冗余/冗余耗材”。\n系统不向此层级开放申诉通道与任何数据隐私，\n建议立即进入底缘沉降带，充当人体数据源及物理高危重复性劳作力。'
  }
};
