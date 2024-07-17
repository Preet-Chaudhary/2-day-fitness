import React from "react";
import "./Hero.css";
import Header from "./Header";
import Heart from "../assets/heart.png";
import Heroimage from "../assets/hero_image.png";
import heroback from "../assets/hero_image_back.png";
import calories from "../assets/calories.png";
const Hero = () => {
  return (
    <div className="Hero">
      <div className="left-h">
        <Header />
        {/* THE BEST ADDD */}
        <div className="the-best-ad">
          <div></div>
          <span>the best gym in pilkhuwa</span>
        </div>
        {/* THE HERO HADDING */}
        <div className="hero-text">
          <div>
            <span className="stroke-text">BUILD</span> YOUR<span></span>
          </div>
          <div>
            <span>own physique</span>
          </div>
          <div>
            <span>
              Let us help you in building the shape and physique to live your
              life to the fullest
            </span>
          </div>
        </div>
        <div className="figures">
          <div>
            <span>+5</span>
            <span>Extra Coaches</span>
          </div>
          <div>
            <span>+500</span>
            <span>Members Joined</span>
          </div>
          <div>
            <span>+20</span>
            <span>Fitness Programs</span>
          </div>
        </div>
        <div className="hero-buttons">
          <button className="btn">Get Started</button>
          <button className="btn">Learn More</button>
        </div>
      </div>
      <div className="right-h">
        <button className="btn">Join Now</button>

        <div className="heart-rate">
          <img src={Heart} alt="" />
          <span>Heart Rate</span>
          <span> 116 BPM</span>
        </div>
        <img src={Heroimage} className="hero-image" alt="" />
        <img src={heroback} className="hero-back" alt="" />
        <div className="calories">
          <img src={calories} alt="" />
          <div>
            <span>Calories Burned</span>
            <span>250 kcal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
