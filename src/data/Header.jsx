import React from 'react'
import './Header.css'
import Logo from '../assets/new logo.png'

const Header = () => {
  return (
    <div>
      <div className="header">
        <img className='logo' src={Logo} alt="" />
        <ul className='header-menu'>
            <li>Home</li>
            <li>Programs</li>
            <li>Why Us</li>
            <li>Plans</li>
            <li>Testimonials</li>
        </ul>
      </div>
    </div>
  )
}

export default Header
