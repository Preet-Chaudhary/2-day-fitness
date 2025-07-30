import React from "react";
import './App.css'
import Header from './Header'
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
          <Header />
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
