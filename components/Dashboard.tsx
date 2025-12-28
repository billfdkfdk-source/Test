
import React from 'react';
import { MODULES } from '../constants';
import type { Module, ModuleType, UserProfile } from '../types';

interface DashboardProps {
  onStartDailyTask: () => void;
  onStartPractice: (moduleType: ModuleType) => void;
  isTaskAvailable: boolean;
  userProfile: UserProfile;
}

const ModuleCard: React.FC<{ module: Module; onClick: () => void }> = ({ module, onClick }) => (
  <button
    onClick={onClick}
    className={`p-6 rounded-2xl text-white shadow-lg flex flex-col text-left ${module.color} transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl active:scale-95 group relative overflow-hidden`}
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
      <module.Icon className="w-24 h-24" />
    </div>
    <div className="flex items-center mb-4 relative z-10">
      <div className="p-3 bg-white/20 rounded-xl mr-4 backdrop-blur-sm">
        <module.Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-black">{module.title}</h3>
    </div>
    <p className="text-sm font-medium opacity-90 leading-relaxed relative z-10 flex-grow">{module.description}</p>
    <div className="mt-6 flex items-center text-xs font-black uppercase tracking-widest relative z-10">
      <span>前往练习</span>
      <svg className="w-4 h-4 ml-2 animate-bounce-x" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </div>
  </button>
);

const Dashboard: React.FC<DashboardProps> = ({ onStartDailyTask, onStartPractice, isTaskAvailable, userProfile }) => {
  return (
    <div className="space-y-10 py-4 px-2">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-4 text-slate-800">
            👋 你好，<span className="text-blue-600">{userProfile.name}</span>！
          </h2>
          <p className="text-slate-400 font-bold mb-8">今天又是充满活力的一天，让我们开始学习吧！</p>
          
          <div className="flex justify-center mb-10">
            <div className="bg-slate-50 px-8 py-4 rounded-3xl flex items-center space-x-6 border border-slate-100 shadow-inner">
               <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">当前等级</p>
                 <p className="text-2xl font-black text-blue-600">{userProfile.level}</p>
               </div>
               <div className="h-10 w-px bg-slate-200"></div>
               <div className="text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">已学题数</p>
                 <p className="text-2xl font-black text-indigo-600">{userProfile.totalAnswers}</p>
               </div>
            </div>
          </div>

          {isTaskAvailable ? (
            <button
              onClick={onStartDailyTask}
              className="group relative inline-flex items-center justify-center px-12 py-5 font-black text-white bg-blue-600 rounded-2xl shadow-2xl transition-all duration-300 hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                开启今日冒险 <span className="ml-3 text-xl">🚀</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          ) : (
            <div className="inline-flex items-center px-10 py-5 font-black text-green-600 bg-green-50 rounded-2xl border-2 border-green-200">
              🎉 今日挑战已达成，真棒！
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.map((module) => (
          <ModuleCard key={module.id} module={module} onClick={() => onStartPractice(module.type)} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
