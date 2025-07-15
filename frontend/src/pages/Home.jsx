import React from "react";
import axios from "axios"

function Home() {
  return (
    <div id="main-container" className="min-h-screen bg-gradient-to-br from-blue-50 to-white ">
      <nav id="main-nav" className="bg-white shadow-lg border-b-2 border-blue-500">
          <div id="main-nav-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div id="nav-content" className="flex justify-between items-center h-16 ">
              <div id="logo-section" className="flex items-center">
                <h1 id="logo-text" className="text-2xl font-bold text-blue-" >HAP</h1>
                <span id="description">Hospital Management System</span>
              </div>
              <button id="login-button" className="">
                Login
              </button>
            </div>    
          </div>
      </nav>
      <div id="main-content-container"></div>

    </div>
  );
}

export default Home;
