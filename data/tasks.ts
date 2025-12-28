
import type { DailyTask } from '../types';
import { ModuleType, ExerciseType } from '../types';

export const SAMPLE_DAILY_TASK: DailyTask = {
  id: 'task-20240101',
  title: '三年级 · 每日综合练习',
  exercises: [
    {
      id: 1,
      moduleType: ModuleType.Character,
      exerciseType: ExerciseType.MultipleChoice,
      prompt: '请为“已经”的“已”选择正确的读音。',
      options: ['yǐ', 'jǐ', 'sì'],
      correctAnswer: 'yǐ',
    },
    {
      id: 2,
      moduleType: ModuleType.Word,
      exerciseType: ExerciseType.MultipleChoice,
      prompt: '下面哪个词语用在“春天来了，公园里（）”这句话中最合适？',
      options: ['一模一样', '五颜六色', '人山人海'],
      correctAnswer: '五颜六色',
    },
    {
      id: 3,
      moduleType: ModuleType.Sentence,
      exerciseType: ExerciseType.Writing,
      prompt: '请把这个句子写得更生动：小鸟在树上叫。',
      placeholder: '例如：一只美丽的黄鹂鸟在翠绿的柳树上婉转地歌唱。',
    },
    {
      id: 4,
      moduleType: ModuleType.Writing,
      exerciseType: ExerciseType.Writing,
      prompt: '看图写话：图中有一只小猫在做什么？请用一两句话描述一下。',
      placeholder: '发挥你的想象力吧！',
    },
  ],
};
