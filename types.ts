
import type * as React from 'react';

export enum ModuleType {
  Character = '字',
  Word = '词',
  Sentence = '句',
  Paragraph = '段',
  Text = '篇',
  Writing = '输出',
}

export interface Module {
  id: string;
  type: ModuleType;
  title: string;
  description: string;
  color: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export enum ExerciseType {
  MultipleChoice = 'MultipleChoice',
  Writing = 'Writing',
}

export interface BaseExercise {
  id: number;
  moduleType: ModuleType;
  exerciseType: ExerciseType;
  prompt: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
  exerciseType: ExerciseType.MultipleChoice;
  options: string[];
  correctAnswer: string;
}

export interface WritingExercise extends BaseExercise {
  exerciseType: ExerciseType.Writing;
  placeholder?: string;
}

export type Exercise = MultipleChoiceExercise | WritingExercise;

export interface DailyTask {
  id: string;
  title: string;
  exercises: Exercise[];
}

export interface AIFeedback {
  praise: string;
  suggestion: string;
  example: string;
}

export interface AIErrorExplanation {
  explanation: string;
}

export interface WrongAnswerEntry {
  exercise: MultipleChoiceExercise;
  userAnswer: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  tasksCompleted: number;
  correctAnswers: number;
  totalAnswers: number;
  level: number;
  xp: number;
  wrongAnswers: WrongAnswerEntry[];
}

export interface TaskResult {
  correctCount: number;
  totalCount: number;
}
