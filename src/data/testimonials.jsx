import React, { useState } from "react";
import "./testimonials.css";
 import { testimonialsData } from './fixedData/testimonialData';
 import rightArrow from '../assets/rightArrow.png';
 import leftArrow from '../assets/leftArrow.png';

const Testimonials = () => {
     const [selected,setSelected]=useState(0);
    const tLength=testimonialsData.length;
  return (
    <div className="test">
      <div className="left-t">
        <span>Testimonials</span>
        <span>What Others</span>
        <span className="stroke-text"> say about us</span>
        { <span>{testimonialsData[selected].review}</span> }
        <span><span style={{color: "red"}}>
            {testimonialsData[selected].name} </span>
           - {testimonialsData[selected].status}</span>

      </div>
      <div className="right-t">
      <div></div>
      <div></div>
        <img src={testimonialsData[selected].image} alt="" />
        <div className="arrows"><img onClick={()=>{selected===0?setSelected(tLength-1):setSelected((prev)=>prev-1)}} src={leftArrow } alt="" /><img onClick={()=>{selected===tLength-1?setSelected(0):setSelected((prev)=>prev+1)}} src={rightArrow}alt="" /></div>
      </div>
    </div>
  );
};

export default Testimonials;
