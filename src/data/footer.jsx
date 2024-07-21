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
        <img src={Github} alt="" />
        <img src={Linkedin} alt="" />
        <img src={Instagram} alt="" />
      </div>
     
     
    </div>
  );
};

export default Footer;
