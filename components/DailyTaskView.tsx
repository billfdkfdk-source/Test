
import React, { useState, useEffect } from 'react';
import type { DailyTask, Exercise, MultipleChoiceExercise, WritingExercise, AIFeedback, TaskResult, AIErrorExplanation, WrongAnswerEntry } from '../types';
import { ExerciseType } from '../types';
import { evaluateWriting, explainError } from '../services/geminiService';
import AIFeedbackCard from './AIFeedbackCard';
import ErrorExplanationCard from './ErrorExplanationCard';

interface DailyTaskViewProps {
  task: DailyTask;
  onComplete: (result: TaskResult) => void;
  onWrong: (entry: Omit<WrongAnswerEntry, 'timestamp'>) => void;
}

const DailyTaskView: React.FC<DailyTaskViewProps> = ({ task, onComplete, onWrong }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);
  const [mcExplanation, setMcExplanation] = useState<AIErrorExplanation | null>(null);
  const [taskSummary, setTaskSummary] = useState({ correctCount: 0, totalCount: 0 });

  const currentExercise = task.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === task.exercises.length - 1;

  useEffect(() => {
    setFeedback(null);
    setAiFeedback(null);
    setMcExplanation(null);
  }, [currentExerciseIndex]);

  const handleAnswerChange = (exerciseId: number, answer: string) => {
    setAnswers({ ...answers, [exerciseId]: answer });
    setFeedback(null);
    setMcExplanation(null);
  };

  const handleSubmit = async () => {
    if (!currentExercise) return;
    const answer = answers[currentExercise.id] || '';
    if (!answer) {
      setFeedback("别着急，先完成练习哦！");
      return;
    }

    setIsLoading(true);

    if (currentExercise.exerciseType === ExerciseType.Writing) {
      setAiFeedback(null);
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
        setMcExplanation(null);
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

  const renderExercise = (exercise: Exercise) => {
    const userAnswer = answers[exercise.id] || '';
    const isSubmitted = mcExplanation !== null || feedback?.includes('正确');

    switch (exercise.exerciseType) {
      case ExerciseType.MultipleChoice:
        const mcExercise = exercise as MultipleChoiceExercise;
        return (
          <div className="animate-fade-in">
            <p className="text-xl mb-6 font-medium text-slate-800 leading-relaxed">{mcExercise.prompt}</p>
            <div className="grid grid-cols-1 gap-3">
              {mcExercise.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerChange(mcExercise.id, option)}
                  disabled={isSubmitted || isLoading}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    userAnswer === option && isSubmitted && option === mcExercise.correctAnswer 
                    ? 'bg-green-500 border-green-500 text-white shadow-lg' 
                    : userAnswer === option && isSubmitted && option !== mcExercise.correctAnswer 
                    ? 'bg-red-500 border-red-500 text-white shadow-lg' 
                    : userAnswer === option && !isSubmitted 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  } disabled:opacity-80`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + mcExercise.options.indexOf(option))}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      case ExerciseType.Writing:
        const writingExercise = exercise as WritingExercise;
        return (
          <div className="animate-fade-in">
            <p className="text-xl mb-4 font-medium text-slate-800">{writingExercise.prompt}</p>
            {writingExercise.prompt.includes("看图写话") && 
              <div className="flex justify-center mb-6">
                <img src={`https://picsum.photos/seed/${exercise.id}/480/300`} alt="练习图片" className="rounded-xl shadow-lg border-4 border-white"/>
              </div>
            }
            <textarea
              value={userAnswer}
              onChange={(e) => handleAnswerChange(writingExercise.id, e.target.value)}
              placeholder={writingExercise.placeholder}
              className="w-full h-40 p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-slate-700 text-lg"
              disabled={!!aiFeedback || isLoading}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const progress = ((currentExerciseIndex + 1) / task.exercises.length) * 100;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-slate-500 font-bold tracking-wide uppercase text-sm">{task.title}</h3>
          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
            进度 {currentExerciseIndex + 1} / {task.exercises.length}
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      
      <div className="min-h-[350px] flex flex-col justify-center">
        {renderExercise(currentExercise)}
      </div>

      <div className="mt-8">
        {feedback && (
          <div className={`mb-6 p-4 rounded-xl text-center font-bold animate-bounce ${feedback.includes('正确') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {feedback}
          </div>
        )}
        
        {isLoading && (
            <div className="flex items-center justify-center space-x-3 py-4 text-blue-600">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="font-bold">AI老师正在点评中...</span>
            </div>
        )}

        {aiFeedback && <AIFeedbackCard feedback={aiFeedback} />}
        {mcExplanation && <ErrorExplanationCard explanation={mcExplanation} />}

        <div className="flex justify-center pt-4">
            {aiFeedback || mcExplanation || feedback?.includes('正确') ? (
                <button 
                    onClick={goToNext}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                    {isLastExercise ? '完成练习，领取奖励 🎁' : '下一题'}
                </button>
            ) : (
                <button 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:bg-slate-300 disabled:transform-none"
                >
                    {currentExercise.exerciseType === ExerciseType.Writing ? '请AI老师指点' : '确认答案'}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default DailyTaskView;
