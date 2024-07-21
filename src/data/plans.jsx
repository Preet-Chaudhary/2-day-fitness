import React from "react";
import "./plans.css";
import { plansData } from "./fixedData/plansData";
import whiteTick from "../assets/whiteTick.png";
const Plans = () => {
  return (
    <div className="planscon">
      <div className="blur blur-p"></div>
      <div className="pro-head">
        <span className="stroke-text">Ready </span>
        <span>To </span>
        <span className="stroke-text">Join Us</span>
      </div>
      <div className="pcards">
        {plansData.map((prop, i) => (
          <div className="plan" key={i}>
            {prop.icon}
            <span>{prop.name}</span>
            <span>₹ {prop.price}</span>
            <div className="features">
              {prop.features.map((feature, i) => (
                <div className="feature">
                  <img src={whiteTick} alt="" />
                  <span key={i}>{feature}</span>
                </div>
              ))}
            </div>
            <div>
              <span>See More Benefits</span>
            </div>
            <button className="btn">Join now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
