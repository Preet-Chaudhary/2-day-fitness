import React from "react";
import "./Hero.css";
import Heart from "../assets/heart.png";
import Heroimage from "../assets/hero_image.png";
import heroback from "../assets/hero_image_back.png";
import { Link } from "react-scroll";
import calories from "../assets/calories.png";
import { motion } from "framer-motion";
const Hero = () => {
  const transition = { type: "spring", duration: 3 };
  return (
    <div className="Hero">
      <div className="blur blur-h"></div>
      <div className="left-h">
        {/* THE BEST ADDD */}
        <div className="the-best-ad">
          <motion.div
            initial={{ left: "180px" }}
            whileInView={{ left: "10px" }}
            transition={transition}
          ></motion.div>
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
          <button className="btn"> <Link
              to="planscon"
              spy={true}
              smooth={true}
            >
            
           Get Started
            </Link></button>
          <button className="btn">
            <Link
              to="programs"
              spy={true}
              smooth={true}
            >
            
           Learn More
            </Link>
          </button>
        </div>
      </div>
      
      {/* View Gym Button - Outside container to avoid positioning issues */}
      <button 
        className="view-gym-btn" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.open('https://www.instagram.com/2_day_fitness/', '_blank');
        }}
      >
        View Gym
      </button>
      
      <div className="right-h">
        <div className="heart-rate">
          <img src={Heart} alt="" />
          <span>Heart Rate</span>
          <span> 116 BPM</span>
        </div>
        <img src={Heroimage} className="hero-image" alt="" />

        <motion.img
          initial={{ right: "5rem" }}
          whileInView={{ right: "10rem" }}
          transition={transition}
          src={heroback}
          className="hero-back"
          alt=""
        />
        <motion.div
          initial={{ right: "50rem" }}
          whileInView={{ right: "30rem" }}
          transition={transition}
          className="calories"
        >
          <img src={calories} alt="" />
          <div>
            <span>Calories Burned</span>
            <span>250 kcal</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
