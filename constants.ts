
import { ModuleType, type UserProfile, type Module } from './types';
import CharacterIcon from './components/icons/CharacterIcon';
import WordIcon from './components/icons/WordIcon';
import SentenceIcon from './components/icons/SentenceIcon';
import ParagraphIcon from './components/icons/ParagraphIcon';
import TextIcon from './components/icons/TextIcon';
import WritingIcon from './components/icons/WritingIcon';

export const MODULES: Module[] = [
  { id: 'character', type: ModuleType.Character, title: '字 · 识字', description: '辨析字形，理解字义。', color: 'bg-red-400', Icon: CharacterIcon },
  { id: 'word', type: ModuleType.Word, title: '词 · 积累', description: '学习常用词与成语。', color: 'bg-orange-400', Icon: WordIcon },
  { id: 'sentence', type: ModuleType.Sentence, title: '句 · 表达', description: '练习结构，生动描述。', color: 'bg-yellow-400', Icon: SentenceIcon },
  { id: 'paragraph', type: ModuleType.Paragraph, title: '段 · 组织', description: '理清逻辑，把握中心。', color: 'bg-green-400', Icon: ParagraphIcon },
  { id: 'text', type: ModuleType.Text, title: '篇 · 阅读', description: '整体理解，关键分析。', color: 'bg-blue-400', Icon: TextIcon },
  { id: 'writing', type: ModuleType.Writing, title: '输出 · 创作', description: '看图写话，自由表达。', color: 'bg-purple-400', Icon: WritingIcon },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: "小萌学霸",
  tasksCompleted: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  level: 1,
  xp: 0,
  wrongAnswers: [],
};

export const XP_PER_CORRECT = 10;
export const XP_PER_TASK = 50;
export const getXpNeeded = (lvl: number) => 100 + (lvl - 1) * 50;
