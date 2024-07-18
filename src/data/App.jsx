import React from "react";
import ReactDOM from "react-dom";
import './App.css'
import Hero from './Hero'
import Programs from "./programs";
import Reasons from "./Reasons";
import Plans from "./plans";
export default function App()

{
    return(
        <div className="App">
          <Hero />
          <Programs/>
          <Reasons/>
          <Plans/>
        </div>
    )

    
}
