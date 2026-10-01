
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="256" cy="256" r="240" stroke="#0066FF" strokeWidth="8" />
    <path d="M140 180H220V210H195V350H165V210H140V180Z" fill="#0066FF" />
    <path d="M280 300C280 280 295 270 320 270H350V240H320C280 240 250 265 250 300C250 335 280 360 320 360H350V330H320C295 330 280 320 280 300Z" fill="#0066FF" />
    <path d="M350 180H370V230H350C310 230 280 205 280 170" stroke="#0066FF" strokeWidth="4" />
    <circle cx="200" cy="200" r="12" fill="#00CCFF" />
    <circle cx="320" cy="320" r="12" fill="#00CCFF" />
    <line x1="200" y1="200" x2="320" y2="320" stroke="#00CCFF" strokeWidth="2" strokeDasharray="4 4" />
  </svg>
);
