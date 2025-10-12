import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Images/PLogo.png';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out">
      <div className={`container mx-auto px-6 py-4 flex items-center ${isScrolled ? 'justify-center' : 'justify-between'}`}>
        {/* Logo */}
        {!isScrolled && (
          <div className="text-3xl font-bold text-black">
            <img
              className="w-36 h-auto"
              src={Logo}
              alt="Rest & Relax logo"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}

        {/* Navigation Links with Conditional Blur Background */}
        <nav
          role="navigation"
          aria-label="Main navigation"
          className={`transition-all duration-300 ease-in-out ${
            isScrolled
              ? 'bg-white/30 backdrop-blur-md rounded-full shadow-md px-8 py-3'
              : 'bg-transparent'
          }`}
        >
          <ul className="flex space-x-8 text-lg text-black">
            <li><Link to="/" className="hover:text-[#008DDA] transition-colors whitespace-nowrap">Home</Link></li>
            <li><Link to="/locations" className="hover:text-[#008DDA] transition-colors whitespace-nowrap">Locations</Link></li>
            <li><Link to="/rates" className="hover:text-[#008DDA] transition-colors whitespace-nowrap">Rates</Link></li>
            <li><Link to="/memories" className="hover:text-[#008DDA] transition-colors whitespace-nowrap">Memories</Link></li>
            <li><Link to="/contact-us" className="hover:text-[#008DDA] transition-colors whitespace-nowrap">Contact Us</Link></li>
          </ul>
        </nav>

        {/* CTA Button */}
        {!isScrolled && (
          <button className="bg-[#008DDA] text-white px-6 py-2 rounded-full font-medium hover:bg-[#0480c3] transition-colors shadow-md whitespace-nowrap">
            Book Now →
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;