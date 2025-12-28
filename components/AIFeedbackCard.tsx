
import React from 'react';
import type { AIFeedback } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import CheckIcon from './icons/CheckIcon';

const AIFeedbackCard: React.FC<{ feedback: AIFeedback }> = ({ feedback }) => {
  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 my-4 text-left space-y-4 animate-fade-in">
      <h4 className="text-lg font-bold text-blue-700 flex items-center">
        <SparklesIcon className="w-6 h-6 mr-2 text-yellow-500" />
        AI 老师点评
      </h4>
      
      <div className="p-3 bg-green-100 border border-green-200 rounded-md">
        <p className="font-semibold text-green-800">闪光点 ✨</p>
        <p className="text-green-700">{feedback.praise}</p>
      </div>
      
      <div className="p-3 bg-orange-100 border border-orange-200 rounded-md">
        <p className="font-semibold text-orange-800">小建议 💡</p>
        <p className="text-orange-700">{feedback.suggestion}</p>
      </div>

      <div className="p-3 bg-white border border-gray-200 rounded-md">
        <p className="font-semibold text-gray-800">可以这样写 ✍️</p>
        <p className="text-gray-700 italic">“{feedback.example}”</p>
      </div>
    </div>
  );
};

export default AIFeedbackCard;
