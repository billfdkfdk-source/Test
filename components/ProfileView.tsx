
import React, { useState } from 'react';
import type { UserProfile, WrongAnswerEntry, MultipleChoiceExercise } from '../types';
import { getXpNeeded } from '../constants';
import { generateTargetedPractice } from '../services/geminiService';
import TrophyIcon from './icons/TrophyIcon';
import TargetIcon from './icons/TargetIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import EditIcon from './icons/EditIcon';
import SaveIcon from './icons/SaveIcon';
import StarIcon from './icons/StarIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import RefreshIcon from './icons/RefreshIcon';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> = ({ icon, label, value, color }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center">
    <div className={`p-4 rounded-xl mr-5 ${color} shadow-inner`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-slate-800">{value}</p>
    </div>
  </div>
);

const TargetedPractice: React.FC<{ originalEntry: WrongAnswerEntry }> = ({ originalEntry }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [newQuestions, setNewQuestions] = useState<Partial<MultipleChoiceExercise>[]>([]);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [feedback, setFeedback] = useState<Record<number, boolean>>({});

    const handleGenerate = async () => {
        setIsLoading(true);
        setNewQuestions([]);
        setAnswers({});
        setFeedback({});
        try {
          const result = await generateTargetedPractice(
              originalEntry.exercise.prompt,
              originalEntry.userAnswer,
              originalEntry.exercise.correctAnswer
          );
          if (result) setNewQuestions(result);
        } catch (e) {
          console.error(e);
        }
        setIsLoading(false);
    };
    
    const handleAnswer = (index: number, answer: string, correctAnswer: string) => {
        setAnswers(prev => ({...prev, [index]: answer }));
        setFeedback(prev => ({...prev, [index]: answer === correctAnswer }));
    };

    return (
        <div className="mt-4 pt-4 border-t border-slate-100">
            {!newQuestions.length ? (
              <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="flex items-center justify-center w-full md:w-auto bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold py-2 px-6 rounded-full transition-all disabled:opacity-50"
              >
                  {isLoading ? "AI正在生成..." : "举一反三：专项强化练习"}
              </button>
            ) : (
              <div className="space-y-4 animate-fade-in">
                  <h5 className="font-bold text-indigo-600 text-sm flex items-center">
                    <StarIcon className="w-4 h-4 mr-1" /> AI 老师为你定制的巩固题：
                  </h5>
                  {newQuestions.map((q, index) => (
                      <div key={index} className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                          <p className="font-medium text-slate-800 mb-3">{q.prompt}</p>
                          <div className="grid grid-cols-1 gap-2">
                              {q.options?.map(opt => (
                                  <button
                                      key={opt}
                                      onClick={() => handleAnswer(index, opt, q.correctAnswer!)}
                                      disabled={answers[index] !== undefined}
                                      className={`p-3 text-left rounded-lg text-sm transition-all border ${
                                          answers[index] === undefined ? 'bg-white hover:border-indigo-400 border-slate-200 text-slate-600' :
                                          (feedback[index] && answers[index] === opt ? 'bg-green-500 border-green-500 text-white font-bold' :
                                          (answers[index] === opt ? 'bg-red-500 border-red-500 text-white font-bold' : 'bg-white border-slate-100 text-slate-300'))
                                      }`}
                                  >
                                      {opt}
                                  </button>
                              ))}
                          </div>
                          {answers[index] && feedback[index] && (
                            <p className="mt-3 text-green-600 font-bold text-xs">🎉 答对了！这个知识点掌握得更牢固了！</p>
                          )}
                      </div>
                  ))}
              </div>
            )}
        </div>
    );
};


const ProfileView: React.FC<{ profile: UserProfile; onUpdateName: (name: string) => void; }> = ({ profile, onUpdateName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(profile.name);

  const accuracy = profile.totalAnswers > 0 
    ? ((profile.correctAnswers / profile.totalAnswers) * 100).toFixed(0) + '%' 
    : '0%';

  const xpForNextLevel = getXpNeeded(profile.level);
  const xpProgressPercent = (profile.xp / xpForNextLevel) * 100;
  
  const handleSaveName = () => {
    if (editingName.trim()) onUpdateName(editingName.trim());
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-4xl font-black shadow-lg">
            {profile.name.charAt(0)}
          </div>
          <div className="text-center md:text-left mt-4 md:mt-0">
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input 
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="text-2xl font-black text-slate-800 border-b-4 border-blue-500 outline-none w-48"
                  autoFocus
                />
                <button onClick={handleSaveName}><SaveIcon className="w-6 h-6 text-green-500" /></button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h2 className="text-3xl font-black text-slate-800">{profile.name}</h2>
                <button onClick={() => setIsEditing(true)}><EditIcon className="w-5 h-5 text-slate-300 hover:text-blue-500" /></button>
              </div>
            )}
            <p className="text-slate-400 font-medium">勤奋练习，每天进步一点点</p>
          </div>
        </div>
        <div className="text-center md:text-right">
           <div className="inline-block bg-yellow-400 text-white px-6 py-2 rounded-full font-black shadow-md">
             等级 {profile.level}
           </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-xl font-black text-slate-800 flex items-center">
            <StarIcon className="w-6 h-6 mr-2 text-yellow-400" /> 成长进度
          </h3>
          <span className="text-slate-400 text-sm font-bold">{profile.xp} / {xpForNextLevel} XP</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-5 p-1 shadow-inner">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-1000 shadow-sm relative overflow-hidden" 
            style={{ width: `${xpProgressPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<TrophyIcon className="w-7 h-7 text-white"/>} label="任务达人" value={profile.tasksCompleted} color="bg-yellow-400" />
        <StatCard icon={<CheckCircleIcon className="w-7 h-7 text-white"/>} label="正确题数" value={profile.correctAnswers} color="bg-green-500" />
        <StatCard icon={<TargetIcon className="w-7 h-7 text-white"/>} label="掌握程度" value={accuracy} color="bg-blue-500" />
      </div>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center">
          <BookOpenIcon className="w-6 h-6 mr-2 text-red-500"/> 错题本 (AI强化)
        </h3>
        {profile.wrongAnswers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-bold">暂无错题，你真是个天才！</p>
          </div>
        ) : (
          <div className="space-y-6">
            {profile.wrongAnswers.map((entry, index) => (
              <div key={entry.timestamp} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex justify-between items-start mb-3">
                   <span className="bg-white text-slate-500 text-[10px] font-black uppercase px-2 py-1 rounded-md border border-slate-100">
                    {entry.exercise.moduleType} · 选择题
                   </span>
                   <span className="text-slate-300 text-[10px]">{new Date(entry.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="font-black text-slate-800 text-lg mb-4">{entry.exercise.prompt}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                    <p className="text-[10px] font-bold text-red-400 uppercase mb-1">你的答案</p>
                    <p className="text-red-700 font-bold">{entry.userAnswer}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                    <p className="text-[10px] font-bold text-green-400 uppercase mb-1">正确答案</p>
                    <p className="text-green-700 font-bold">{entry.exercise.correctAnswer}</p>
                  </div>
                </div>
                <TargetedPractice originalEntry={entry} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
