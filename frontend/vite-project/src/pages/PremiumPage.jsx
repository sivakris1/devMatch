import { useEffect } from "react";
import { useState } from "react";

import React from 'react'

const PremiumPage = () => {

    const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};


  return (
    <div>
      
    </div>
  )
}

export default PremiumPage
