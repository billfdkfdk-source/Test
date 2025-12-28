
import React, { useState, useEffect } from 'react';
import type { Module, Exercise, MultipleChoiceExercise, WritingExercise, AIFeedback, TaskResult, AIErrorExplanation, WrongAnswerEntry } from '../types';
import { ExerciseType } from '../types';
import { evaluateWriting, explainError } from '../services/geminiService';
import { QUESTION_BANK } from '../data/practice';
import AIFeedbackCard from './AIFeedbackCard';
import ErrorExplanationCard from './ErrorExplanationCard';

interface PracticeViewProps {
  module: Module;
  onComplete: (result: TaskResult) => void;
  onWrong: (entry: Omit<WrongAnswerEntry, 'timestamp'>) => void;
}

const PracticeView: React.FC<PracticeViewProps> = ({ module, onComplete, onWrong }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [mcExplanation, setMcExplanation] = useState<AIErrorExplanation | null>(null);
  const [taskSummary, setTaskSummary] = useState({ correctCount: 0, totalCount: 0 });

  useEffect(() => {
    setExercises(QUESTION_BANK[module.type] || []);
  }, [module.type]);

  const currentExercise = exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === exercises.length - 1;

  useEffect(() => {
    setFeedback(null);
    setAiFeedback(null);
    setMcExplanation(null);
  }, [currentExerciseIndex]);

  const handleAnswerChange = (exerciseId: number, answer: string) => {
    setAnswers({ ...answers, [exerciseId]: answer });
    setFeedback(null);
  };

  const handleSubmit = async () => {
    if (!currentExercise) return;
    const answer = answers[currentExercise.id] || '';
    if (!answer) return;
    
    setIsLoading(true);

    if (currentExercise.exerciseType === ExerciseType.Writing) {
      const result = await evaluateWriting(currentExercise.prompt, answer);
      setAiFeedback(result);
      setTaskSummary(prev => ({ ...prev, correctCount: prev.correctCount + 1 }));
    } else {
      const mcExercise = currentExercise as MultipleChoiceExercise;
      if (answer === mcExercise.correctAnswer) {
        setTaskSummary(prev => ({ ...prev, correctCount: prev.correctCount + 1 }));
        setFeedback("太棒了，回答正确！");
        setTimeout(goToNext, 1200);
      } else {
        onWrong({ exercise: mcExercise, userAnswer: answer });
        const explanation = await explainError(mcExercise.prompt, answer, mcExercise.correctAnswer);
        setMcExplanation(explanation);
      }
    }
    setTaskSummary(prev => ({ ...prev, totalCount: prev.totalCount + 1 }));
    setIsLoading(false);
  };

  const goToNext = () => {
    if (isLastExercise) {
      onComplete(taskSummary);
    } else {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  if (exercises.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
        <h3 className="text-xl font-bold text-slate-800 mb-4">{module.title}</h3>
        <p className="text-slate-500">该模块的练习题库正在建设中，敬请期待！</p>
      </div>
    );
  }

  const progress = ((currentExerciseIndex + 1) / exercises.length) * 100;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-blue-600 font-bold text-sm tracking-widest">{module.type} · 专项练习</h3>
          <span className="text-slate-400 text-xs font-bold">{currentExerciseIndex + 1} / {exercises.length}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      
      <div className="min-h-[300px] flex flex-col justify-center">
        {currentExercise && (
          <div className="animate-fade-in">
            <p className="text-xl mb-6 font-medium text-slate-800 leading-relaxed">{currentExercise.prompt}</p>
            {currentExercise.exerciseType === ExerciseType.MultipleChoice ? (
              <div className="grid grid-cols-1 gap-3">
                {(currentExercise as MultipleChoiceExercise).options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerChange(currentExercise.id, option)}
                    disabled={mcExplanation !== null || isLoading}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      answers[currentExercise.id] === option 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    } disabled:opacity-80`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <textarea
                value={answers[currentExercise.id] || ''}
                onChange={(e) => handleAnswerChange(currentExercise.id, e.target.value)}
                placeholder={(currentExercise as WritingExercise).placeholder}
                className="w-full h-40 p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-700 text-lg"
                disabled={!!aiFeedback || isLoading}
              />
            )}
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        {feedback && <p className="mb-4 text-green-600 font-bold animate-bounce">{feedback}</p>}
        {isLoading && <p className="text-blue-500 font-bold py-4">AI老师分析中...</p>}
        {aiFeedback && <AIFeedbackCard feedback={aiFeedback} />}
        {mcExplanation && <ErrorExplanationCard explanation={mcExplanation} />}

        <div className="mt-6">
            {aiFeedback || mcExplanation || feedback?.includes('正确') ? (
                <button onClick={goToNext} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all">
                    {isLastExercise ? '完成练习' : '继续挑战'}
                </button>
            ) : (
                <button 
                  onClick={handleSubmit} 
                  disabled={isLoading || !answers[currentExercise.id]} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:bg-slate-300"
                >
                    {currentExercise?.exerciseType === ExerciseType.Writing ? '提交作业' : '确定'}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default PracticeView;
