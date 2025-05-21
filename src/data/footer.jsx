import React from "react";
import "./footer.css";
import Github from '../assets/github.png'
import Instagram from '../assets/instagram.png'
import Linkedin from '../assets/linkedin.png'
const Footer = () => {
  return (
    <div className="foot">
      <div className="blur"></div>
      <hr />
      <div className="footer">
       <a href="https://github.com/Preet-Chaudhary"> <img src={Github} alt="" /></a> 
       <a href="https://www.linkedin.com/in/preet-chaudhary/"> <img src={Linkedin} alt="" /></a> 
       <a href="https://www.instagram.com/preetchaudhary110/"> <img src={Instagram} alt="" /></a> 
       
      </div>
     
     
    </div>
  );
};

export default Footer;
