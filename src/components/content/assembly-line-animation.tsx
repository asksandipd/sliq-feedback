
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Paintbrush, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

// Updated SVG icons for design tools
const FigmaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Figma logo representation - using multiple paths for colors */}
    <path d="M12 12.75C12 11.2312 13.2312 10 14.75 10C16.2688 10 17.5 11.2312 17.5 12.75V15.5H14.75C13.2312 15.5 12 14.2688 12 12.75Z" fill="#0ACF83"/>
    <path d="M9.25 12.75C9.25 11.2312 10.4812 10 12 10V15.5C10.4812 15.5 9.25 14.2688 9.25 12.75Z" fill="#A259FF"/>
    <path d="M9.25 10C9.25 8.48122 10.4812 7.25 12 7.25C13.5188 7.25 14.75 8.48122 14.75 10H12C10.4812 10 9.25 11.2312 9.25 12.75V10Z" fill="#F24E1E"/>
    <path d="M14.75 10C16.2688 10 17.5 8.76878 17.5 7.25C17.5 5.73122 16.2688 4.5 14.75 4.5C13.2312 4.5 12 5.73122 12 7.25V10H14.75Z" fill="#FF7262"/>
    <path d="M6.5 12.75C6.5 14.2688 7.73122 15.5 9.25 15.5C10.7688 15.5 12 14.2688 12 12.75V10H9.25C7.73122 10 6.5 11.2312 6.5 12.75Z" fill="#1ABCFE"/>
    <path d="M12 18.25C10.4812 18.25 9.25 17.0188 9.25 15.5H12C13.5188 15.5 14.75 16.7312 14.75 18.25C14.75 19.7688 13.5188 21 12 21C10.4812 21 9.25 19.7688 9.25 18.25H6.5C6.5 19.7688 7.73122 21 9.25 21H12V18.25Z" fill="#0ACF83" opacity="0.3"/> {/* Added outer ring part for context */}
    <path d="M18.5 12.75C18.5 11.2312 17.2688 10 15.75 10H14.75V15.5H15.75C17.2688 15.5 18.5 14.2688 18.5 12.75Z" fill="#A259FF" opacity="0.3"/>
  </svg>
);

const CanvaIcon = () => (
 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Canva logo representation - simplified gradient effect */}
    <circle cx="12" cy="12" r="10" fill="url(#canva-gradient)" />
    <path d="M10.7383 14.2168C10.0674 14.2168 9.51855 13.6797 9.51855 13.0088V10.9912C9.51855 10.3203 10.0674 9.7832 10.7383 9.7832C11.4092 9.7832 11.958 10.3203 11.958 10.9912V13.0088C11.958 13.6797 11.4092 14.2168 10.7383 14.2168ZM13.2617 14.2168C12.5908 14.2168 12.042 13.6797 12.042 13.0088V10.9912C12.042 10.3203 12.5908 9.7832 13.2617 9.7832C13.9326 9.7832 14.4814 10.3203 14.4814 10.9912V13.0088C14.4814 13.6797 13.9326 14.2168 13.2617 14.2168Z" fill="white"/>
    <defs>
      <radialGradient id="canva-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 12) rotate(90) scale(12)">
        <stop stopColor="#37C7E7"/>
        <stop offset="1" stopColor="#A259FF"/>
      </radialGradient>
    </defs>
 </svg>
);

// NEW SVG Icons with multi-color
const AtomIcon = ({ size = 18 }: { size?: number }) => (
 <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="2.5" fill="hsl(var(--chart-1))"/> {/* Nucleus */}
    <ellipse cx="12" cy="12" rx="10" ry="4" stroke="hsl(var(--chart-2))" strokeWidth="1.5"/>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" stroke="hsl(var(--chart-3))" strokeWidth="1.5"/>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" stroke="hsl(var(--chart-4))" strokeWidth="1.5"/>
    {/* Electrons */}
    <circle cx="12" cy="8" r="1.5" fill="hsl(var(--chart-5))" /> {/* Top electron */}
    <circle cx="5.93" cy="14.5" r="1.5" fill="hsl(var(--chart-1))" /> {/* Bottom-left electron */}
    <circle cx="18.07" cy="9.5" r="1.5" fill="hsl(var(--chart-3))" /> {/* Top-right electron */}
 </svg>
);

const SugarIcon = ({ size = 18 }: { size?: number }) => (
 <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
   {/* Simple hexagon for glucose/sugar ring */}
   <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" stroke="hsl(var(--chart-4))" strokeWidth="1.5" fill="hsl(var(--chart-4)/0.3)"/>
   {/* Add a simple 'OH' group representation */}
   <line x1="21" y1="7" x2="23" y2="5" stroke="hsl(var(--chart-1))" strokeWidth="1.5"/>
   <circle cx="23.5" cy="4.5" r="1.5" fill="hsl(var(--chart-1))"/> {/* Oxygen */}
   {/* Add another group */}
    <line x1="3" y1="7" x2="1" y2="5" stroke="hsl(var(--chart-2))" strokeWidth="1.5"/>
    <circle cx="0.5" cy="4.5" r="1.5" fill="hsl(var(--chart-2))"/> {/* Another group */}
 </svg>
);

const BuretteIcon = ({ size = 20 }: { size?: number }) => (
 <svg width={size} height={size ? size*2 : 40} viewBox="0 0 20 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Tube */}
    <rect x="8" y="1" width="4" height="30" stroke="hsl(var(--chart-5))" strokeWidth="1.5" fill="hsl(var(--chart-5)/0.2)"/>
    {/* Graduations */}
    <line x1="7" y1="5" x2="13" y2="5" stroke="hsl(var(--chart-5))" strokeWidth="1"/>
    <line x1="9" y1="7.5" x2="11" y2="7.5" stroke="hsl(var(--chart-5))" strokeWidth="1"/>
    <line x1="7" y1="10" x2="13" y2="10" stroke="hsl(var(--chart-5))" strokeWidth="1"/>
    <line x1="9" y1="12.5" x2="11" y2="12.5" stroke="hsl(var(--chart-5))" strokeWidth="1"/>
    <line x1="7" y1="15" x2="13" y2="15" stroke="hsl(var(--chart-5))" strokeWidth="1"/>
    <line x1="9" y1="17.5" x2="11" y2="17.5" stroke="hsl(var(--chart-5))" strokeWidth="1"/>
    <line x1="7" y1="20" x2="13" y2="20" stroke="hsl(var(--chart-5))" strokeWidth="1"/>
     <line x1="9" y1="22.5" x2="11" y2="22.5" stroke="hsl(var(--chart-5))" strokeWidth="1"/>
    <line x1="7" y1="25" x2="13" y2="25" stroke="hsl(var(--chart-5))" strokeWidth="1"/>
    {/* Tip */}
    <line x1="10" y1="31" x2="10" y2="35" stroke="hsl(var(--chart-5))" strokeWidth="1.5"/>
    {/* Stopcock */}
    <rect x="6" y="29.5" width="8" height="3" fill="hsl(var(--chart-3))" rx="1.5"/>
    <line x1="10" y1="29.5" x2="10" y2="32.5" stroke="hsl(var(--chart-3)/0.5)" strokeWidth="1"/>
 </svg>
);

const PipetteIcon = ({ size = 20 }: { size?: number }) => (
 <svg width={size} height={size ? size*1.5 : 30} viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bulb */}
    <ellipse cx="10" cy="6" rx="5" ry="5" stroke="hsl(var(--chart-1))" strokeWidth="1.5" fill="hsl(var(--chart-1)/0.3)"/>
    {/* Tube */}
    <rect x="8" y="10" width="4" height="15" stroke="hsl(var(--chart-2))" strokeWidth="1.5" fill="hsl(var(--chart-2)/0.2)"/>
    {/* Tip */}
    <line x1="10" y1="25" x2="10" y2="29" stroke="hsl(var(--chart-2))" strokeWidth="1.5"/>
 </svg>
);

const BeakerIcon = ({ size = 18 }: { size?: number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 3H19" stroke="hsl(var(--chart-3))" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 3V9C7 10.1046 7.89543 11 9 11H15C16.1046 11 17 10.1046 17 9V3" stroke="hsl(var(--chart-3))" strokeWidth="1.5"/>
        <path d="M7 21H17" stroke="hsl(var(--chart-3))" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 11V21" stroke="hsl(var(--chart-3))" strokeWidth="1.5"/>
        <path d="M17 11V21" stroke="hsl(var(--chart-3))" strokeWidth="1.5"/>
        {/* Liquid */}
        <path d="M9 15H15" stroke="hsl(var(--chart-2))" strokeWidth="1.5" strokeLinecap="round"/>
         <path d="M9 18H13" stroke="hsl(var(--chart-4))" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

const FunnelIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 4H21" stroke="hsl(var(--chart-1))" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 8L10 14" stroke="hsl(var(--chart-1))" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M17 8L14 14" stroke="hsl(var(--chart-1))" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 14H14" stroke="hsl(var(--chart-1))" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 14V20" stroke="hsl(var(--chart-1))" strokeWidth="1.5" strokeLinecap="round"/>
         {/* Pouring liquid visual */}
        <path d="M12 4V6" stroke="hsl(var(--chart-5))" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 6H14" stroke="hsl(var(--chart-5))" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);


// NEW Robot Figure
const RobotIcon = ({ size = 30, armRotation = 0, eyeGlowOpacity = 1 }: { size?: number; armRotation?: number; eyeGlowOpacity?: number }) => (
 <svg width={size} height={size * 1.5} viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Glowing eye effect */}
      <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    {/* Head */}
    <rect x="6" y="1" width="8" height="6" rx="1" fill="hsl(var(--muted-foreground))" stroke="hsl(var(--foreground))" strokeWidth="1"/>
    {/* Antennae */}
    <line x1="8" y1="1" x2="7" y2="-2" stroke="hsl(var(--foreground))" strokeWidth="1"/>
    <circle cx="7" cy="-2" r="1" fill="hsl(var(--foreground))" />
    <line x1="12" y1="1" x2="13" y2="-2" stroke="hsl(var(--foreground))" strokeWidth="1"/>
    <circle cx="13" cy="-2" r="1" fill="hsl(var(--foreground))" />
    {/* Eyes */}
    <circle cx="9" cy="4" r="1" fill="red" filter="url(#glow-red)" style={{ opacity: eyeGlowOpacity }} />
    <circle cx="11" cy="4" r="1" fill="red" filter="url(#glow-red)" style={{ opacity: eyeGlowOpacity }} />
    {/* Body */}
    <rect x="4" y="8" width="12" height="10" rx="1.5" fill="yellow" stroke="hsl(var(--foreground))" strokeWidth="1"/>
    {/* Legs */}
    <rect x="6" y="19" width="3" height="6" fill="hsl(var(--muted-foreground))" stroke="hsl(var(--foreground))" strokeWidth="0.5"/>
    <rect x="11" y="19" width="3" height="6" fill="hsl(var(--muted-foreground))" stroke="hsl(var(--foreground))" strokeWidth="0.5"/>
    {/* Arms (Animated) */}
    <g transform={`rotate(${armRotation}, 4, 10)`}> {/* Left Arm */}
      <rect x="1" y="9" width="3" height="8" rx="1" fill="hsl(var(--muted-foreground))" stroke="hsl(var(--foreground))" strokeWidth="0.5"/>
    </g>
    <g transform={`rotate(${-armRotation}, 16, 10)`}> {/* Right Arm */}
      <rect x="16" y="9" width="3" height="8" rx="1" fill="hsl(var(--muted-foreground))" stroke="hsl(var(--foreground))" strokeWidth="0.5"/>
    </g>
 </svg>
);

// NEW Android Figure
const AndroidIcon = ({ size = 30, armRotation = 0, eyeGlowOpacity = 1 }: { size?: number; armRotation?: number; eyeGlowOpacity?: number }) => (
 <svg width={size} height={size * 1.5} viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg">
     <defs>
        {/* Glowing eye effect */}
        <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
     </defs>
    {/* Head (rounded top) */}
    <path d="M6 4C6 2.34315 7.34315 1 9 1H11C12.6569 1 14 2.34315 14 4V7H6V4Z" fill="lightgreen" stroke="hsl(var(--foreground))" strokeWidth="1"/>
    {/* Eyes */}
    <circle cx="9" cy="4" r="1" fill="blue" filter="url(#glow-blue)" style={{ opacity: eyeGlowOpacity }} />
    <circle cx="11" cy="4" r="1" fill="blue" filter="url(#glow-blue)" style={{ opacity: eyeGlowOpacity }} />
    {/* Antennae */}
    <line x1="8" y1="1" x2="7" y2="-2" stroke="hsl(var(--foreground))" strokeWidth="1"/>
    <circle cx="7" cy="-2" r="1" fill="hsl(var(--foreground))" />
    <line x1="12" y1="1" x2="13" y2="-2" stroke="hsl(var(--foreground))" strokeWidth="1"/>
    <circle cx="13" cy="-2" r="1" fill="hsl(var(--foreground))" />
    {/* Body */}
    <rect x="4" y="8" width="12" height="10" rx="1.5" fill="green" stroke="hsl(var(--foreground))" strokeWidth="1"/>
    {/* Legs */}
    <rect x="6" y="19" width="3" height="6" rx="1" fill="lightgreen" stroke="hsl(var(--foreground))" strokeWidth="0.5"/>
    <rect x="11" y="19" width="3" height="6" rx="1" fill="lightgreen" stroke="hsl(var(--foreground))" strokeWidth="0.5"/>
    {/* Arms (Animated) */}
    <g transform={`rotate(${armRotation}, 4, 10)`}> {/* Left Arm */}
      <rect x="1" y="9" width="3" height="8" rx="1.5" fill="lightgreen" stroke="hsl(var(--foreground))" strokeWidth="0.5"/>
    </g>
    <g transform={`rotate(${-armRotation}, 16, 10)`}> {/* Right Arm */}
       <rect x="16" y="9" width="3" height="8" rx="1.5" fill="lightgreen" stroke="hsl(var(--foreground))" strokeWidth="0.5"/>
    </g>
 </svg>
);


// Simple Painting representation (Rectangle)
const PaintingRect = ({ x, y, color, width = 30, height = 40, transform }: { x: number; y: number; color: string; width?: number; height?: number; transform?: string }) => (
  <rect x={x} y={y} width={width} height={height} fill={color} stroke="black" strokeWidth="1" rx="2" transform={transform} />
);

// Simple Art representation (Circle)
const PaintingCircle = ({ cx, cy, color, r = 15, transform }: { cx: number; cy: number; color: string; r?: number; transform?: string }) => (
    <circle cx={cx} cy={cy} r={r} fill={color} stroke="black" strokeWidth="1" transform={transform} />
);

// Simple Art representation (Triangle)
const PaintingTriangle = ({ x, y, color, size=30, transform }: { x: number; y: number; color: string; size?:number; transform?: string }) => (
    <polygon points={`${x},${y+size} ${x+size/2},${y} ${x+size},${y+size}`} fill={color} stroke="black" strokeWidth="1" transform={transform} />
);

// Funnel Bin component
const FunnelBin = ({ x, y, width, height, stripeColor }: { x: number; y: number; width: number; height: number; stripeColor: string }) => {
    const topWidth = width;
    const bottomWidth = width * 0.6; // Make bottom narrower
    const topY = y;
    const bottomY = y + height;
    const midY = y + height * 0.8; // Where the funnel shape ends

    return (
        <g>
            {/* Funnel Shape */}
            <polygon
                points={`${x},${topY} ${x + topWidth},${topY} ${x + topWidth - (topWidth - bottomWidth) / 2},${midY} ${x + (topWidth - bottomWidth) / 2},${midY}`}
                fill="hsl(var(--muted))"
                stroke="hsl(var(--secondary-foreground))"
                strokeWidth="2"
            />
             {/* Base Rectangle */}
            <rect
                x={x + (topWidth - bottomWidth) / 2}
                y={midY}
                width={bottomWidth}
                height={height * 0.2}
                fill="hsl(var(--muted))"
                stroke="hsl(var(--secondary-foreground))"
                strokeWidth="2"
             />

            {/* Stripes */}
            {[...Array(5)].map((_, i) => (
                <line
                    key={`stripe-${i}`}
                    x1={x + i * (topWidth / 4)}
                    y1={topY}
                    x2={x + (topWidth - bottomWidth) / 2 + i * (bottomWidth / 4)}
                    y2={midY}
                    stroke={stripeColor}
                    strokeWidth="1.5"
                    strokeDasharray="4 2" // Dashed stripes
                />
            ))}
             {/* Base stripes */}
             {[...Array(5)].map((_, i) => (
                 <line
                     key={`base-stripe-${i}`}
                     x1={x + (topWidth - bottomWidth) / 2 + i * (bottomWidth / 4)}
                     y1={midY}
                     x2={x + (topWidth - bottomWidth) / 2 + i * (bottomWidth / 4)}
                     y2={bottomY}
                     stroke={stripeColor}
                     strokeWidth="1.5"
                     strokeDasharray="4 2"
                 />
             ))}
        </g>
    );
};


export function AssemblyLineAnimation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [animationTime, setAnimationTime] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000; // Time in seconds
      setAnimationTime(elapsed);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const beltSpeed = 40; // Reduced speed slightly
  const beltLength = 600; // Increased belt length for more stages
  const cycleDuration = beltLength / beltSpeed; // Time for one item to cross
  const svgWidth = beltLength + 100; // Adjusted SVG width to accommodate the bin

  // Calculate item positions based on time - adding a random offset for less uniformity
  const getItemPosition = (stageStartTime: number, stageDuration: number, initialOffset = 0) => {
    const timeInCycle = (animationTime - stageStartTime + initialOffset) % (cycleDuration + stageDuration);
    if (timeInCycle < 0 || timeInCycle > cycleDuration) {
      return -50; // Off-screen
    }
    return (timeInCycle / cycleDuration) * beltLength;
  };


  // Define stages and timing - adjusted for more stages
  const numStages = 6;
  const stageWidth = beltLength / numStages;
  const stageStartX = Array.from({ length: numStages }, (_, i) => 20 + i * stageWidth);
  const stageLabelY = 15; // Adjusted Y position for labels
  const stageIconY = 35; // Adjusted Y position for stage icons/visuals


  const outputX = beltLength + 20;
  const binWidth = 60;
  const binHeight = 70;
  const binX = outputX + 10; // Position bin relative to outputX
  const binY = 70;
  const binBottomY = binY + binHeight;
  const binCenterX = binX + binWidth / 2;
  const binVortexRadius = binWidth * 0.15;
  const binVortexSpeed = 2.5;
  const binVerticalBounce = 2;
  const binVerticalSpeed = 1.8;

  // Item specific animations
  const colorDropY = 20; // Adjusted drop Y
  const itemY = 65; // Adjusted item Y
  const itemDanceAmount = 5;

  const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
  const colorX = getItemPosition(0, 1);
  const colorYOffset = Math.sin(animationTime * 5) * itemDanceAmount;

  // Atom & Sugar animation
  const atomX = getItemPosition(cycleDuration * 0.1, 1, 1);
  const atomRotation = animationTime * 50; // Continuous rotation
  const atomYOffset = Math.sin(animationTime * 3 + 1) * (itemDanceAmount * 0.8);

  const sugarX = getItemPosition(cycleDuration * 0.15, 1, 0.5);
  const sugarRotation = Math.cos(animationTime * 40) * 10; // Wobble rotation
  const sugarYOffset = Math.cos(animationTime * 3.5 + 2) * (itemDanceAmount * 0.7);

  // Lab equipment animation
  const buretteX = getItemPosition(cycleDuration * 0.3, 1, 0.8);
  const buretteRotation = Math.sin(animationTime * 2) * 5; // Gentle sway
  const buretteYOffset = Math.sin(animationTime * 2.5 + 3) * (itemDanceAmount * 0.5);

  const pipetteX = getItemPosition(cycleDuration * 0.35, 1, 0.2);
  const pipetteRotation = Math.cos(animationTime * 2.5 + 0.5) * 6;
  const pipetteYOffset = Math.cos(animationTime * 3 + 4) * (itemDanceAmount * 0.6);

  const beakerX = getItemPosition(cycleDuration * 0.4, 1, 1.1);
  const beakerRotation = 0; // Keep beaker upright
  const beakerYOffset = Math.sin(animationTime * 1.5 + 5) * (itemDanceAmount * 0.4); // Slight vertical bob

  const funnelX = getItemPosition(cycleDuration * 0.45, 1, 0.4);
  const funnelRotation = Math.sin(animationTime * 3) * 8;
  const funnelYOffset = Math.cos(animationTime * 2 + 6) * (itemDanceAmount * 0.5);


  // Art tools animation
  const brushX = getItemPosition(cycleDuration * 0.6, 1, 0.6);
  const brushRotation = Math.sin(animationTime * 6) * 15;
  const brushYOffset = Math.cos(animationTime * 4) * itemDanceAmount;

  const pencilX = getItemPosition(cycleDuration * 0.65, 1, 0.9);
  const pencilRotation = Math.cos(animationTime * 7) * 20;
  const pencilYOffset = Math.sin(animationTime * 5 + 1) * itemDanceAmount;

  // Design tools animation
  const designToolX = getItemPosition(cycleDuration * 0.8, 1, 0.3);
  const designToolRotation = Math.sin(animationTime * 5 - 1) * 10;
  const designToolYOffset = Math.cos(animationTime * 6 + 2) * itemDanceAmount;
  const DesignTool = animationTime % 4 < 2 ? FigmaIcon : CanvaIcon;

  // Final Output animation
  const paintingX = getItemPosition(cycleDuration * 0.95, 1, 0.7);
  const paintingRectHeight = 30;
  const fallTargetY = binY + binHeight * 0.6;
  const paintingFallProgress = Math.max(0, Math.min(1, (paintingX - outputX + 10) / (binX - outputX + 20)));
  const paintingFallY = itemY + paintingFallProgress * (fallTargetY - itemY);
  const paintingFinalX = paintingFallProgress >= 1 ? binX + binWidth / 2 - 15 : paintingX;
  const paintingFinalRotation = paintingFallProgress * 20;

  const paintingColorIndex = Math.floor((animationTime * 0.5) % colors.length);
  const paintingColor = colors[paintingColorIndex];


  // Pentagon color coordinates for Stage 1
  const pentagonCenterX = stageStartX[0] + stageWidth / 2 - 10; // Center the pentagon
  const pentagonCenterY = stageIconY + 15;
  const pentagonRadius = 15;
  const pentagonPoints = Array.from({ length: 5 }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2; // Start from top
    return {
      x: pentagonCenterX + pentagonRadius * Math.cos(angle),
      y: pentagonCenterY + pentagonRadius * Math.sin(angle),
    };
  });


  // Calculate vortex offsets for bin items
  const vortexAngle = (time: number, offset: number, speedMultiplier: number) => (time * binVortexSpeed * speedMultiplier + offset * Math.PI / 2.5) % (2 * Math.PI);
  const verticalOffset = (time: number, offset: number, speedMultiplier: number) => Math.sin(time * binVerticalSpeed * speedMultiplier + offset) * binVerticalBounce;

  const binBaseY = binBottomY - 15;
  const binBaseRadius = binWidth * 0.2;

  const binItemTransforms = [
      { // Circle
          baseX: binCenterX - binBaseRadius * 0.5,
          baseY: binBaseY - binBaseRadius * 0.2,
          angle: vortexAngle(animationTime, 0, 1.0),
          yOffset: verticalOffset(animationTime, 0, 1.0),
          scale: 1 + Math.sin(animationTime * 1.5 + 0) * 0.05,
          rotation: Math.sin(animationTime * 1.1 + 0) * 15,
      },
      { // Triangle
          baseX: binCenterX + binBaseRadius * 0.3,
          baseY: binBaseY + binBaseRadius * 0.4,
          angle: vortexAngle(animationTime, 1, 1.2),
          yOffset: verticalOffset(animationTime, 1, 1.1),
          scale: 1 + Math.sin(animationTime * 1.6 + 1) * 0.04,
          rotation: Math.cos(animationTime * 1.3 + 1) * 20,
      },
      { // Rect
          baseX: binCenterX + binBaseRadius * 0.6,
          baseY: binBaseY - binBaseRadius * 0.5,
          angle: vortexAngle(animationTime, 2, 0.9),
          yOffset: verticalOffset(animationTime, 2, 0.9),
          scale: 1 + Math.sin(animationTime * 1.4 + 2) * 0.06,
          rotation: Math.sin(animationTime * 1.0 + 2) * 10,
      },
      { // Small Circle
          baseX: binCenterX + binBaseRadius * 0.1,
          baseY: binBaseY + binBaseRadius * 0.1,
          angle: vortexAngle(animationTime, 3, 1.3),
          yOffset: verticalOffset(animationTime, 3, 1.2),
          scale: 1 + Math.sin(animationTime * 1.7 + 3) * 0.045,
          rotation: Math.cos(animationTime * 1.2 + 3) * 25,
      },
      { // Small Triangle
          baseX: binCenterX - binBaseRadius * 0.7,
          baseY: binBaseY + binBaseRadius * 0.3,
          angle: vortexAngle(animationTime, 4, 1.1),
          yOffset: verticalOffset(animationTime, 4, 1.05),
          scale: 1 + Math.sin(animationTime * 1.55 + 4) * 0.055,
          rotation: Math.sin(animationTime * 1.4 + 4) * 18,
      },
  ];

  const getBinItemTransform = (index: number, shapeWidth = 0, shapeHeight = 0) => {
      const { baseX, baseY, angle, yOffset, scale, rotation } = binItemTransforms[index];
      const vortexX = Math.cos(angle) * binVortexRadius;
      const vortexY = Math.sin(angle) * binVortexRadius * 0.5;

      const translateX = baseX + vortexX;
      const translateY = baseY + vortexY + yOffset;

      let originX = 0;
      let originY = 0;

      if (shapeWidth && shapeHeight) {
         originX = shapeWidth / 2;
         originY = shapeHeight / 2;
      } else if (shapeWidth) {
          // For circle and triangle, assuming width is the primary dimension or radius
          originX = shapeWidth / 2; // Use center for rotation
          originY = shapeHeight ? shapeHeight / 2 : shapeWidth / 2;
      }

       return `translate(${translateX}, ${translateY}) rotate(${rotation}, ${originX}, ${originY}) scale(${scale})`;
  };


  // Helper function to check if an item is within a specific stage
  const isItemInStage = (itemX: number, stageIndex: number) => {
    const stageStart = stageStartX[stageIndex] - 10; // Small buffer
    const stageEnd = stageStartX[stageIndex + 1] ? stageStartX[stageIndex + 1] - 10 : beltLength + 10; // Handle last stage
    return itemX >= stageStart && itemX < stageEnd;
  };

  // Stage Activation States
  const stage1Active = isItemInStage(colorX, 0);
  const stage2Active = isItemInStage(atomX, 1) || isItemInStage(sugarX, 1);
  const stage3Active = isItemInStage(buretteX, 2) || isItemInStage(pipetteX, 2) || isItemInStage(beakerX, 2) || isItemInStage(funnelX, 2);
  const stage4Active = isItemInStage(brushX, 3) || isItemInStage(pencilX, 3);
  const stage5Active = isItemInStage(designToolX, 4);
  // Stage 6 (Output) doesn't need an active state for highlight


   // Robot/Android animation parameters
   const supervisorY = 20; // Position them above the belt
   const supervisorArmFlapAngle = Math.sin(animationTime * 5) * 25; // Flapping motion
   const supervisorEyeGlow = (Math.sin(animationTime * 3) + 1) / 2; // Pulsing glow
   const supervisorSize = 30; // Increased size


  return (
    <div className="w-full aspect-video bg-muted/50 rounded-md overflow-hidden flex items-center justify-center p-4">
      <svg ref={svgRef} viewBox={`0 0 ${svgWidth} 150`} width="100%" height="100%" className="overflow-visible"> {/* Adjusted viewbox width */}
        {/* Conveyor Belt */}
        <rect x="10" y="80" width={beltLength + 20} height="10" fill="hsl(var(--muted-foreground))" rx="3" />
        <rect x="10" y="50" width={beltLength + 20} height="10" fill="hsl(var(--muted-foreground))" rx="3" />
        {/* Belt movement illusion */}
         {[...Array(15)].map((_, i) => { // Increased number of lines for longer belt
            const lineX = 15 + ((animationTime * beltSpeed + i * (beltLength/15)) % beltLength);
            return <line key={i} x1={lineX} y1="50" x2={lineX} y2="60" stroke="hsl(var(--background))" strokeWidth="1" />;
         })}
        {[...Array(15)].map((_, i) => {
            const lineX = 15 + ((animationTime * beltSpeed + i * (beltLength/15)) % beltLength);
            return <line key={i+15} x1={lineX} y1="80" x2={lineX} y2="90" stroke="hsl(var(--background))" strokeWidth="1" />;
         })}

        {/* Supervising Figures */}
        <g transform={`translate(10, ${supervisorY})`}>
            <RobotIcon size={supervisorSize} armRotation={supervisorArmFlapAngle} eyeGlowOpacity={supervisorEyeGlow}/>
        </g>
        <g transform={`translate(${beltLength - supervisorSize - 5}, ${supervisorY})`}> {/* Adjusted x pos for size */}
             <AndroidIcon size={supervisorSize} armRotation={-supervisorArmFlapAngle} eyeGlowOpacity={supervisorEyeGlow}/>
        </g>


        {/* Stage Visuals */}
        {/* Stage 1: Colors */}
        <text
          x={stageStartX[0]}
          y={stageLabelY}
          fontSize="10"
          fill="hsl(var(--foreground))"
          className={cn(
            "transition-all duration-200",
            stage1Active ? "font-bold scale-110 opacity-100 fill-primary" : "opacity-70"
          )}
          style={{ transformOrigin: `${stageStartX[0]}px ${stageLabelY}px` }} // Center scaling transform
        >
          Colors
        </text>
        <g
         className={cn("transition-all duration-200", stage1Active ? "scale-110 opacity-100" : "opacity-70")}
         style={{ transformOrigin: `${pentagonCenterX}px ${pentagonCenterY}px` }}
        >
          {pentagonPoints.map((point, i) => (
            <circle
              key={`color-dot-${i}`}
              cx={point.x}
              cy={point.y}
              r="6"
              fill={colors[i % colors.length]}
              className={cn("transition-opacity duration-200", stage1Active ? "opacity-100" : "opacity-50")} // Adjust opacity within the group
            />
          ))}
        </g>

        {/* Stage 2: Basics (Atoms, Sugar) */}
         <text
          x={stageStartX[1]}
          y={stageLabelY}
          fontSize="10"
          fill="hsl(var(--foreground))"
          className={cn(
            "transition-all duration-200",
            stage2Active ? "font-bold scale-110 opacity-100 fill-primary" : "opacity-70"
          )}
           style={{ transformOrigin: `${stageStartX[1]}px ${stageLabelY}px` }}
         >
           Basics
         </text>
        <g
          transform={`translate(${stageStartX[1] + stageWidth / 2 - 20}, ${stageIconY + 5})`}
          className={cn("transition-all duration-200", stage2Active ? "scale-110 opacity-100" : "opacity-70")}
           style={{ transformOrigin: `center center` }}
        >
           <AtomIcon size={16} />
        </g>
         <g
          transform={`translate(${stageStartX[1] + stageWidth / 2 + 10}, ${stageIconY + 5})`}
          className={cn("transition-all duration-200", stage2Active ? "scale-110 opacity-100" : "opacity-70")}
          style={{ transformOrigin: `center center` }}
        >
           <SugarIcon size={16} />
        </g>

        {/* Stage 3: Lab Gear */}
        <text
          x={stageStartX[2]}
          y={stageLabelY}
          fontSize="10"
          fill="hsl(var(--foreground))"
          className={cn(
            "transition-all duration-200",
            stage3Active ? "font-bold scale-110 opacity-100 fill-primary" : "opacity-70"
          )}
           style={{ transformOrigin: `${stageStartX[2]}px ${stageLabelY}px` }}
        >
          Lab Gear
        </text>
         <g
          transform={`translate(${stageStartX[2] + stageWidth / 2 - 30}, ${stageIconY})`}
          className={cn("transition-all duration-200", stage3Active ? "scale-110 opacity-100" : "opacity-70")}
           style={{ transformOrigin: `center bottom` }} // Adjust origin for taller icons
         >
            <BuretteIcon size={12}/>
         </g>
         <g
            transform={`translate(${stageStartX[2] + stageWidth / 2 - 5}, ${stageIconY})`}
            className={cn("transition-all duration-200", stage3Active ? "scale-110 opacity-100" : "opacity-70")}
            style={{ transformOrigin: `center bottom` }}
         >
             <PipetteIcon size={12}/>
         </g>
         <g
             transform={`translate(${stageStartX[2] + stageWidth / 2 + 20}, ${stageIconY + 5})`}
             className={cn("transition-all duration-200", stage3Active ? "scale-110 opacity-100" : "opacity-70")}
             style={{ transformOrigin: `center center` }}
         >
             <BeakerIcon size={16}/>
         </g>
         <g
            transform={`translate(${stageStartX[2] + stageWidth / 2 + 45}, ${stageIconY + 5})`}
            className={cn("transition-all duration-200", stage3Active ? "scale-110 opacity-100" : "opacity-70")}
            style={{ transformOrigin: `center center` }}
         >
             <FunnelIcon size={16}/>
         </g>


        {/* Stage 4: Art Tools */}
        <text
          x={stageStartX[3]}
          y={stageLabelY}
          fontSize="10"
          fill="hsl(var(--foreground))"
          className={cn(
            "transition-all duration-200",
            stage4Active ? "font-bold scale-110 opacity-100 fill-primary" : "opacity-70"
          )}
          style={{ transformOrigin: `${stageStartX[3]}px ${stageLabelY}px` }}
        >
          Art Tools
        </text>
         <g
          transform={`translate(${stageStartX[3] + stageWidth / 2 - 15}, ${stageIconY + 5})`}
          className={cn("transition-all duration-200", stage4Active ? "scale-110 opacity-100" : "opacity-70")}
          style={{ transformOrigin: `center center` }}
         >
            <Paintbrush size={16} color="hsl(var(--chart-2))"/> {/* Added color */}
         </g>
         <g
            transform={`translate(${stageStartX[3] + stageWidth / 2 + 15}, ${stageIconY + 5})`}
            className={cn("transition-all duration-200", stage4Active ? "scale-110 opacity-100" : "opacity-70")}
            style={{ transformOrigin: `center center` }}
         >
             <Pencil size={16} color="hsl(var(--chart-4))"/> {/* Added color */}
         </g>

        {/* Stage 5: Design Apps */}
        <text
          x={stageStartX[4]}
          y={stageLabelY}
          fontSize="10"
          fill="hsl(var(--foreground))"
          className={cn(
            "transition-all duration-200",
            stage5Active ? "font-bold scale-110 opacity-100 fill-primary" : "opacity-70"
          )}
          style={{ transformOrigin: `${stageStartX[4]}px ${stageLabelY}px` }}
        >
          Design Apps
        </text>
         <g
            transform={`translate(${stageStartX[4] + stageWidth / 2 - 20}, ${stageIconY + 5})`}
            className={cn("transition-all duration-200", stage5Active ? "scale-110 opacity-100" : "opacity-70")}
            style={{ transformOrigin: `center center` }}
         >
            <FigmaIcon />
         </g>
         <g
            transform={`translate(${stageStartX[4] + stageWidth / 2 + 10}, ${stageIconY + 5})`}
            className={cn("transition-all duration-200", stage5Active ? "scale-110 opacity-100" : "opacity-70")}
            style={{ transformOrigin: `center center` }}
         >
             <CanvaIcon />
         </g>

        {/* Stage 6: Output (implicit, represented by the bin) */}
         {/* No specific icon needed here, the bin serves as the visual */}


        {/* Animated Items */}
        {/* Colors Pouring */}
        {colorX > 0 && colorX < beltLength && (
          <>
            <circle cx={colorX + 15} cy={colorDropY} r="5" fill={colors[0]} />
            <circle cx={colorX + 25} cy={colorDropY + 5} r="4" fill={colors[1]} />
            <ellipse cx={colorX + 20} cy={itemY + 5 + colorYOffset} rx="15" ry="5" fill={colors[0]} opacity="0.8" />
          </>
        )}

        {/* Atoms & Sugars Dancing */}
        {atomX > 0 && atomX < beltLength && (
           <g transform={`translate(${atomX + 10}, ${itemY + atomYOffset}) rotate(${atomRotation}, 9, 9)`}>
             <AtomIcon />
           </g>
        )}
         {sugarX > 0 && sugarX < beltLength && (
           <g transform={`translate(${sugarX + 10}, ${itemY + sugarYOffset}) rotate(${sugarRotation}, 9, 9)`}>
             <SugarIcon />
           </g>
         )}

        {/* Lab Equipment Dancing */}
         {buretteX > 0 && buretteX < beltLength && (
            <g transform={`translate(${buretteX + 5}, ${itemY - 15 + buretteYOffset}) rotate(${buretteRotation}, 10, 20)`}>
              <BuretteIcon />
            </g>
         )}
         {pipetteX > 0 && pipetteX < beltLength && (
             <g transform={`translate(${pipetteX + 5}, ${itemY - 5 + pipetteYOffset}) rotate(${pipetteRotation}, 10, 15)`}>
               <PipetteIcon />
             </g>
          )}
         {beakerX > 0 && beakerX < beltLength && (
            <g transform={`translate(${beakerX + 10}, ${itemY + beakerYOffset}) rotate(${beakerRotation}, 8, 8)`}>
              <BeakerIcon size={16} />
            </g>
         )}
         {funnelX > 0 && funnelX < beltLength && (
             <g transform={`translate(${funnelX + 10}, ${itemY + funnelYOffset}) rotate(${funnelRotation}, 8, 8)`}>
               <FunnelIcon size={16} />
             </g>
          )}


        {/* Art Tools Dancing */}
        {brushX > 0 && brushX < beltLength && (
          <g transform={`translate(${brushX + 10}, ${itemY + brushYOffset}) rotate(${brushRotation}, 8, 8)`}>
            <Paintbrush size={16} color="hsl(var(--chart-2))" /> {/* Match stage icon color */}
          </g>
        )}
        {pencilX > 0 && pencilX < beltLength && (
          <g transform={`translate(${pencilX + 10}, ${itemY + pencilYOffset}) rotate(${pencilRotation}, 8, 8)`}>
            <Pencil size={16} color="hsl(var(--chart-4))" /> {/* Match stage icon color */}
          </g>
        )}

        {/* Design Tools Dancing */}
        {designToolX > 0 && designToolX < beltLength && (
           <g transform={`translate(${designToolX + 10}, ${itemY + designToolYOffset}) rotate(${designToolRotation}, 12, 12)`}>
             <DesignTool />
           </g>
        )}

        {/* Output Art (Rectangle) falling into bin */}
        {paintingX > 0 && paintingX < binX + binWidth + 10 && paintingFallProgress < 1 && (
           <g transform={`translate(${paintingFinalX}, ${paintingFallY}) rotate(${paintingFinalRotation}, 15, ${paintingRectHeight/2})`}>
              <PaintingRect x={0} y={0} color={paintingColor} height={paintingRectHeight} />
           </g>
        )}


        {/* Output Bin (Funnel) */}
        <defs>
            <clipPath id="binClipPath">
                {/* Define the exact shape of the funnel bin for clipping */}
                <polygon
                    points={`${binX},${binY} ${binX + binWidth},${binY} ${binX + binWidth - (binWidth - binWidth * 0.6) / 2},${binY + binHeight * 0.8} ${binX + (binWidth - binWidth * 0.6) / 2},${binY + binHeight * 0.8}`}
                />
                <rect
                    x={binX + (binWidth - binWidth * 0.6) / 2}
                    y={binY + binHeight * 0.8}
                    width={binWidth * 0.6}
                    height={binHeight * 0.2} // Match the base rectangle height
                />
            </clipPath>
        </defs>

        <g clipPath="url(#binClipPath)">
            {/* Items dancing inside the bin */}
             {/* Use getBinItemTransform with correct dimensions for each shape */}
             <PaintingCircle
                 cx={0} cy={0} // Center origin for circle
                 color={colors[1]} r={8}
                 transform={getBinItemTransform(0, 16, 16)} // Use diameter for width/height
             />
             <PaintingTriangle
                 x={-7.5} y={-7.5} // Adjust origin for triangle based on size
                 color={colors[3]} size={15}
                 transform={getBinItemTransform(1, 15, 15)}
             />
             <PaintingRect
                 x={-6} y={-5} // Adjust origin for rectangle based on size
                 color={colors[0]} width={12} height={10}
                 transform={getBinItemTransform(2, 12, 10)}
             />
             <PaintingCircle
                 cx={0} cy={0} // Center origin
                 color={colors[4]} r={6}
                 transform={getBinItemTransform(3, 12, 12)} // Use diameter
             />
             <PaintingTriangle
                 x={-9} y={-9} // Adjust origin
                 color={colors[2]} size={18}
                 transform={getBinItemTransform(4, 18, 18)}
              />
        </g>


        {/* Render the Bin itself above the clipped shapes */}
        <FunnelBin x={binX} y={binY} width={binWidth} height={binHeight} stripeColor="hsl(var(--secondary-foreground) / 0.5)" />
        <text x={binX + binWidth / 2} y={binBottomY + 12} textAnchor="middle" fontSize="10" fill="hsl(var(--secondary-foreground))">Output</text>

      </svg>
    </div>
  );
}

