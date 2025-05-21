import React, { useRef } from "react";
import "./join.css";
import emailjs from "@emailjs/browser";


const Join = () => {
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();
    alert('Your Request Was Sent Successfully')
    emailjs
      .sendForm(
        "service_b72nwel",
        "template_dz9pr5n",
        form.current,
        "Xv4IMuqZZtEv_h4n_"
      )
      .then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  return (
    <div className="join" id="join">
      <div className="left-j">
        <hr />
        <div>
          <span className="stroke-text">Ready To </span>
          <span>Level Up </span>
        </div>
        <div>
          <span>Your Body </span>
          <span className="stroke-text">With us</span>
        </div>
      </div>
      <div className="right-join">
        <form ref={form} action="" className="email" onSubmit={sendEmail}>
          <input
            type="email"
            name="user-email"
            placeholder="Enter your E-mail address"
          />
          <button  className="btn btn-j">Join now</button>
        </form>
      </div>
    </div>
  );
};

export default Join;
