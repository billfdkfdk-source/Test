
import React from 'react';
import type { AIErrorExplanation } from '../types';
import LightBulbIcon from './icons/LightBulbIcon';

const ErrorExplanationCard: React.FC<{ explanation: AIErrorExplanation }> = ({ explanation }) => {
  return (
    <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 my-4 text-left space-y-2 animate-fade-in">
      <h4 className="text-md font-bold text-orange-700 flex items-center">
        <LightBulbIcon className="w-6 h-6 mr-2 text-orange-500" />
        AI 老师小提示
      </h4>
      <p className="text-orange-800">
        {explanation.explanation}
      </p>
    </div>
  );
};

export default ErrorExplanationCard;
