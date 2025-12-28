
import React from 'react';

const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311a15.044 15.044 0 01-7.5 0C5.093 19.311 3.75 16.533 3.75 12.75c0-4.032 2.13-7.5 5.25-7.5h.01c.257 0 .512.01.764.031a6.01 6.01 0 013.481 3.481c.02.252.03.507.031.764v.01c0 3.782-1.343 6.56-3.75 8.219z" />
  </svg>
);

export default LightBulbIcon;
