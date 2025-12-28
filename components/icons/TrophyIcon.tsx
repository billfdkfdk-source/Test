
import React from 'react';

const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 1011.64-8.03A9.75 9.75 0 0012 2.25c-5.385 0-9.75 4.365-9.75 9.75 0 2.37.84 4.555 2.25 6.312m13.5 0L16.5 12.75m-4.5 6l-1.5-3.75" />
  </svg>
);

export default TrophyIcon;
