import React, { useState, useRef, useEffect } from 'react';
// import { ProgressBar } from "primereact/progressbar";
import './loadingSpinner.css';

const LoadingSpinner = ({ value, setValue }) => {
  return (
    <div className="loading-container">
      <div className="loading loading-tw">
        <span>T</span>
        <span>W</span>
        <span>M</span>
        <span>E</span>
        <span>T</span>
        <span>A</span>
        <span>L</span>
        <span>S</span>
      </div>
      <div
        style={{
          zIndex: '200000',
          backgroundColor: 'gray',
          width: '800px',
          height: '25px',
          borderRadius: '8px',
        }}
      >
        {/* <Progress value={value} setValue={setValue} /> */}
      </div>
    </div>
  );
};

// const Progress = ({ value, setValue }) => {
//   const interval = useRef(null);

//   useEffect(() => {
//     interval.current = setInterval(() => {

//       if (value >= 100) {
//         clearInterval(interval.current);
//       }

//     }, 150);

//     return () => {
//       if (interval.current) {
//         clearInterval(interval.current);
//         interval.current = null;
//       }
//     };
//   }, []);

//   return <ProgressBar value={value}></ProgressBar>;
// };

export default LoadingSpinner;
