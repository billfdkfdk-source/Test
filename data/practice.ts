
import { ModuleType, ExerciseType, type Exercise } from '../types';

export const QUESTION_BANK: Record<ModuleType, Exercise[]> = {
  [ModuleType.Character]: [
    {
      id: 101,
      moduleType: ModuleType.Character,
      exerciseType: ExerciseType.MultipleChoice,
      prompt: '“蓝天”的“蓝”字，下面是“监”，上面是什么部首？',
      options: ['艹', '王', '月'],
      correctAnswer: '艹',
    },
    {
      id: 102,
      moduleType: ModuleType.Character,
      exerciseType: ExerciseType.MultipleChoice,
      prompt: '下面哪个字不是多音字？',
      options: ['行', '好', '我'],
      correctAnswer: '我',
    },
  ],
  [ModuleType.Word]: [
    {
      id: 201,
      moduleType: ModuleType.Word,
      exerciseType: ExerciseType.MultipleChoice,
      prompt: '“美丽”的近义词是什么？',
      options: ['丑陋', '漂亮', '可爱'],
      correctAnswer: '漂亮',
    },
    {
      id: 202,
      moduleType: ModuleType.Word,
      exerciseType: ExerciseType.MultipleChoice,
      prompt: '形容人非常多，应该用哪个成语？',
      options: ['人山人海', '一模一样', '五颜六色'],
      correctAnswer: '人山人海',
    },
     {
      id: 203,
      moduleType: ModuleType.Word,
      exerciseType: ExerciseType.MultipleChoice,
      prompt: '“寒冷”的反义词是什么？',
      options: ['炎热', '冰冷', '凉快'],
      correctAnswer: '炎热',
    },
  ],
  [ModuleType.Sentence]: [
      {
      id: 301,
      moduleType: ModuleType.Sentence,
      exerciseType: ExerciseType.Writing,
      prompt: '扩写句子：叶子落下来了。',
      placeholder: '例如：秋天到了，黄色的叶子一片片从树上飘落下来。',
    },
    {
      id: 302,
      moduleType: ModuleType.Sentence,
      exerciseType: ExerciseType.Writing,
      prompt: '把下面的句子改成“被”字句：我打破了花瓶。',
      placeholder: '花瓶被...',
    }
  ],
  [ModuleType.Paragraph]: [
    {
      id: 401,
      moduleType: ModuleType.Paragraph,
      exerciseType: ExerciseType.MultipleChoice,
      prompt: '请读下面的段落，找出中心句：春天来了，天气变暖了。小草从地下探出头来，柳树也发芽了。公园里的花都开了，有红的、有黄的、还有白的。春天真是一个美丽的季节。',
      options: ['小草从地下探出头来。', '公园里的花都开了。', '春天真是一个美丽的季节。'],
      correctAnswer: '春天真是一个美丽的季节。',
    },
    {
      id: 402,
      moduleType: ModuleType.Paragraph,
      exerciseType: ExerciseType.Writing,
      prompt: '请把下面的句子排成通顺的一段话：① 他先拿起画笔，蘸了点颜料。 ② 小明正在画画。 ③ 不一会儿，一匹奔跑的骏马就画好了。',
      placeholder: '写下正确的顺序，例如：②①③',
    },
  ],
  [ModuleType.Text]: [
    {
      id: 501,
      moduleType: ModuleType.Text,
      exerciseType: ExerciseType.MultipleChoice,
      prompt: '阅读短文，然后回答问题：小松鼠很早就起床了。它要出门去找些吃的。它在树林里跑来跑去，找到了一些松果，又发现了几颗榛子。小松鼠把找到的食物都搬回了家，整齐地放好。看着满满的食物，它开心地笑了。\n\n问题：小松鼠找到了什么食物？',
      options: ['苹果和香蕉', '松果和榛子', '蘑菇和花生'],
      correctAnswer: '松果和榛子',
    },
    {
      id: 502,
      moduleType: ModuleType.Text,
      exerciseType: ExerciseType.Writing,
      prompt: '阅读短文，然后回答问题：小松鼠很早就起床了。它要出门去找些吃的。它在树林里跑来跑去，找到了一些松果，又发现了几颗榛子。小松鼠把找到的食物都搬回了家，整齐地放好。看着满满的食物，它开心地笑了。\n\n问题：你觉得小松鼠是一只怎样的松鼠？',
      placeholder: '例如：我觉得它是一只勤劳的松鼠。',
    },
  ],
  [ModuleType.Writing]: [
      {
      id: 601,
      moduleType: ModuleType.Writing,
      exerciseType: ExerciseType.Writing,
      prompt: '你的好朋友是谁？请用几句话介绍一下他/她。',
      placeholder: '可以写他/她的样子、性格，或者你们之间发生的一件有趣的事。',
    },
  ],
};
