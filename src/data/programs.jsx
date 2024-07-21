import React from "react";
import "./programs.css";
import  { programsData } from './fixedData/programsData';
import rightArrow from '../assets/rightArrow.png'
const Programs = () => {
  return (
    <div className="programs" id="program">
      <div className="pro-head">
        <span className="stroke-text">Explore our </span>
        <span>Programs </span>
        <span className="stroke-text">to shape you</span>
      </div>
      <div className="pcategory">
  {programsData.map(prop => (
    <div className="cat" key={prop.heading}>
      
      {prop.icons}
      <span>{prop.heading}</span>
      <span>{prop.details}</span>
      <div className="join">
        <span>Join Now</span>
        <img src={rightArrow} alt="" />
      </div>
    </div>
  ))}
</div>

    </div>
  );
};

export default Programs;
