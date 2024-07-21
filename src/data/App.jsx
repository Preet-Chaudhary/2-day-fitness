import React from "react";
import ReactDOM from "react-dom";
import './App.css'
import Hero from './Hero'
import Programs from "./programs";
import Reasons from "./Reasons";
import Plans from "./plans";
import Testimonials from "./testimonials";
import Join from "./join";
import Footer from "./footer";
export default function App()

{
    return(
        <div className="App">
          <Hero />
          <Programs/>
          <Reasons/>
          <Plans/>
          <Testimonials/>
          <Join/>
          <Footer/>
        </div>
    )

    
}
