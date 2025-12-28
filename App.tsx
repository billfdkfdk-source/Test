
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import DailyTaskView from './components/DailyTaskView';
import ProfileView from './components/ProfileView';
import PracticeView from './components/PracticeView';
import { SAMPLE_DAILY_TASK } from './data/tasks';
import { INITIAL_USER_PROFILE, MODULES, XP_PER_CORRECT, XP_PER_TASK, getXpNeeded } from './constants';
import type { DailyTask, UserProfile, TaskResult, ModuleType, WrongAnswerEntry } from './types';
import HomeIcon from './components/icons/HomeIcon';
import ProfileIcon from './components/icons/ProfileIcon';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'dailyTask' | 'profile' | 'practice'>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [selectedModule, setSelectedModule] = useState<ModuleType | null>(null);
  
  // FIX: Added state to track daily task availability to satisfy DashboardProps
  const [isTaskAvailable, setIsTaskAvailable] = useState(true);

  // Persistence (Optional for production-grade)
  useEffect(() => {
    const saved = localStorage.getItem('primary_chinese_ai_profile');
    if (saved) setUserProfile(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('primary_chinese_ai_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const handleTaskComplete = (result: TaskResult) => {
    setUserProfile(prev => {
      let newXp = prev.xp + (result.correctCount * XP_PER_CORRECT) + XP_PER_TASK;
      let newLvl = prev.level;
      let needed = getXpNeeded(newLvl);

      while (newXp >= needed) {
        newXp -= needed;
        newLvl += 1;
        needed = getXpNeeded(newLvl);
      }

      return {
        ...prev,
        tasksCompleted: prev.tasksCompleted + 1,
        correctAnswers: prev.correctAnswers + result.correctCount,
        totalAnswers: prev.totalAnswers + result.totalCount,
        level: newLvl,
        xp: newXp
      };
    });
    
    // FIX: Mark task as completed for this session
    setIsTaskAvailable(false);
    setCurrentView('dashboard');
  };

  const handleWrongAnswer = (entry: Omit<WrongAnswerEntry, 'timestamp'>) => {
    setUserProfile(prev => ({
      ...prev,
      wrongAnswers: [{ ...entry, timestamp: Date.now() }, ...prev.wrongAnswers].slice(0, 50) // Keep last 50
    }));
  };

  const updateName = (name: string) => setUserProfile(prev => ({ ...prev, name }));

  const currentPracticeModule = MODULES.find(m => m.type === selectedModule);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-12">
      <div className="container mx-auto p-4 max-w-4xl">
        <header className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-2">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">语文</div>
             <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">AI伙伴</h1>
          </div>
          <nav className="flex space-x-2">
            <button onClick={() => setCurrentView('dashboard')} className={`p-2 rounded-lg flex items-center space-x-1 ${currentView === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-200'}`}>
              <HomeIcon className="w-5 h-5" />
              <span className="hidden sm:inline">主页</span>
            </button>
            <button onClick={() => setCurrentView('profile')} className={`p-2 rounded-lg flex items-center space-x-1 ${currentView === 'profile' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-200'}`}>
              <ProfileIcon className="w-5 h-5" />
              <span className="hidden sm:inline">档案</span>
            </button>
          </nav>
        </header>

        <main className="animate-fade-in">
          {currentView === 'dashboard' && (
            /* FIX: Updated prop names and added missing isTaskAvailable to match DashboardProps interface */
            <Dashboard 
              userProfile={userProfile} 
              onStartDailyTask={() => setCurrentView('dailyTask')} 
              onStartPractice={(type) => { setSelectedModule(type); setCurrentView('practice'); }}
              isTaskAvailable={isTaskAvailable}
            />
          )}
          {currentView === 'dailyTask' && (
            <DailyTaskView task={SAMPLE_DAILY_TASK} onComplete={handleTaskComplete} onWrong={handleWrongAnswer} />
          )}
          {currentView === 'profile' && (
            <ProfileView profile={userProfile} onUpdateName={updateName} />
          )}
          {currentView === 'practice' && currentPracticeModule && (
            <PracticeView module={currentPracticeModule} onComplete={handleTaskComplete} onWrong={handleWrongAnswer} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
