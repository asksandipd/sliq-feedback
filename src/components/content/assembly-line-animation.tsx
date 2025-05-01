"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Paintbrush, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

// Simple SVG icons for design tools (replace with actual SVGs if available)
const FigmaIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    {/* Basic representation of Figma logo */}
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    <path d="M15.5 12c0-1.93-1.57-3.5-3.5-3.5s-3.5 1.57-3.5 3.5 1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5zm-3.5-2c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"/>
    <path d="M12 8.5c-1.93 0-3.5 1.57-3.5 3.5H10c0-.83.67-1.5 1.5-1.5V8.5zm0 5c1.93 0 3.5-1.57 3.5-3.5H14c0 .83-.67 1.5-1.5 1.5v2z"/>
    <path d="M8.5 12c0 1.93 1.57 3.5 3.5 3.5V14c-.83 0-1.5-.67-1.5-1.5H8.5zm5 0c0-1.93-1.57-3.5-3.5-3.5V10c.83 0 1.5.67 1.5 1.5h2z"/>
  </svg>
);

const CanvaIcon = () => (
 <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
  {/* Basic representation of Canva logo */}
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3-8.5h6v2h-6zm0 3h6v2h-6z"/>
 </svg>
);


// Simple Painting representation
const Painting = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <rect x={x} y={y} width="30" height="40" fill={color} stroke="black" strokeWidth="1" rx="2" />
);

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

  const beltSpeed = 50; // Pixels per second
  const beltLength = 500; // Corresponds to the width of the belt path
  const cycleDuration = beltLength / beltSpeed; // Time for one item to cross

  // Calculate item positions based on time
  const getItemPosition = (stageStartTime: number, stageDuration: number) => {
    const timeInCycle = (animationTime - stageStartTime) % (cycleDuration + stageDuration);
    if (timeInCycle < 0 || timeInCycle > cycleDuration) {
      return -50; // Off-screen
    }
    return (timeInCycle / cycleDuration) * beltLength;
  };

  // Define stages and timing
  const stageStartX = [20, 150, 280, 410]; // X position for start of each stage visual
  const outputX = beltLength + 20;
  const binX = outputX + 10;
  const binY = 70;

  // Item specific animations
  const colorDropY = 15;
  const itemY = 60; // Y position on the belt
  const itemDanceAmount = 5; // Pixels for dancing effect

  const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
  const colorX = getItemPosition(0, 1);
  const colorYOffset = Math.sin(animationTime * 5) * itemDanceAmount;

  const brushX = getItemPosition(cycleDuration * 0.2, 1);
  const brushRotation = Math.sin(animationTime * 6) * 15; // Degrees
  const brushYOffset = Math.cos(animationTime * 4) * itemDanceAmount;

  const pencilX = getItemPosition(cycleDuration * 0.4, 1);
  const pencilRotation = Math.cos(animationTime * 7) * 20;
  const pencilYOffset = Math.sin(animationTime * 5 + 1) * itemDanceAmount;

  const designToolX = getItemPosition(cycleDuration * 0.6, 1);
  const designToolRotation = Math.sin(animationTime * 5 - 1) * 10;
  const designToolYOffset = Math.cos(animationTime * 6 + 2) * itemDanceAmount;
  const DesignTool = animationTime % 4 < 2 ? FigmaIcon : CanvaIcon; // Alternate tools

  const paintingX = getItemPosition(cycleDuration * 0.8, 1);
  const paintingFallProgress = Math.max(0, Math.min(1, (paintingX - outputX) / (binX - outputX + 30))); // 0 to 1 as it passes outputX
  const paintingFallY = itemY + paintingFallProgress * (binY - itemY + 30); // 30 is approx height of painting
  const paintingFinalX = paintingFallProgress >= 1 ? binX + 5 : paintingX; // Settle in bin
   const paintingColorIndex = Math.floor((animationTime * 0.5) % colors.length);
   const paintingColor = colors[paintingColorIndex];

  return (
    <div className="w-full aspect-video bg-muted/50 rounded-md overflow-hidden flex items-center justify-center p-4">
      <svg ref={svgRef} viewBox="0 0 600 150" width="100%" height="100%" className="overflow-visible">
        {/* Conveyor Belt */}
        <rect x="10" y="80" width={beltLength + 20} height="10" fill="hsl(var(--muted-foreground))" rx="3" />
        <rect x="10" y="50" width={beltLength + 20} height="10" fill="hsl(var(--muted-foreground))" rx="3" />
        {/* Add lines for belt movement illusion */}
         {[...Array(10)].map((_, i) => {
            const lineX = 15 + ((animationTime * beltSpeed + i * (beltLength/10)) % beltLength);
            return <line key={i} x1={lineX} y1="50" x2={lineX} y2="60" stroke="hsl(var(--background))" strokeWidth="1" />;
         })}
        {[...Array(10)].map((_, i) => {
            const lineX = 15 + ((animationTime * beltSpeed + i * (beltLength/10)) % beltLength);
            return <line key={i+10} x1={lineX} y1="80" x2={lineX} y2="90" stroke="hsl(var(--background))" strokeWidth="1" />;
         })}


        {/* Stage Visuals (simple markers) */}
        <text x={stageStartX[0]} y="40" fontSize="10" fill="hsl(var(--foreground))">Stage 1: Colors</text>
        <circle cx={stageStartX[0] + 30} cy={20} r="8" fill={colors[0]} opacity={colorX > stageStartX[0] - 10 && colorX < stageStartX[1] -10 ? 1 : 0.3} />
        <circle cx={stageStartX[0] + 50} cy={20} r="8" fill={colors[1]} opacity={colorX > stageStartX[0] - 10 && colorX < stageStartX[1] -10 ? 1 : 0.3} />

        <text x={stageStartX[1]} y="40" fontSize="10" fill="hsl(var(--foreground))">Stage 2: Brushes</text>
        <Paintbrush x={stageStartX[1] + 30} y={15} size={16} opacity={brushX > stageStartX[1] -10 && brushX < stageStartX[2] -10 ? 1 : 0.3} />

        <text x={stageStartX[2]} y="40" fontSize="10" fill="hsl(var(--foreground))">Stage 3: Pencils</text>
        <Pencil x={stageStartX[2] + 30} y={15} size={16} opacity={pencilX > stageStartX[2] -10 && pencilX < stageStartX[3] -10 ? 1 : 0.3}/>

        <text x={stageStartX[3]} y="40" fontSize="10" fill="hsl(var(--foreground))">Stage 4: Design Tools</text>
         <g transform={`translate(${stageStartX[3] + 30}, 15)`} opacity={designToolX > stageStartX[3] -10 && designToolX < outputX ? 1 : 0.3}>
            <FigmaIcon />
         </g>
         <g transform={`translate(${stageStartX[3] + 60}, 15)`} opacity={designToolX > stageStartX[3] -10 && designToolX < outputX ? 1 : 0.3}>
             <CanvaIcon />
         </g>


        {/* Animated Items */}
        {/* Colors Pouring (simplified) */}
        {colorX > 0 && colorX < beltLength && (
          <>
            <circle cx={colorX + 15} cy={colorDropY} r="5" fill={colors[0]} />
            <circle cx={colorX + 25} cy={colorDropY + 5} r="4" fill={colors[1]} />
            {/* Splash on belt */}
            <ellipse cx={colorX + 20} cy={itemY + 5 + colorYOffset} rx="15" ry="5" fill={colors[0]} opacity="0.8" />
          </>
        )}

        {/* Brushes Dancing */}
        {brushX > 0 && brushX < beltLength && (
          <g transform={`translate(${brushX + 10}, ${itemY + brushYOffset}) rotate(${brushRotation}, 8, 8)`}>
            <Paintbrush size={16} color="hsl(var(--foreground))" />
          </g>
        )}

        {/* Pencils Dancing */}
        {pencilX > 0 && pencilX < beltLength && (
          <g transform={`translate(${pencilX + 10}, ${itemY + pencilYOffset}) rotate(${pencilRotation}, 8, 8)`}>
            <Pencil size={16} color="hsl(var(--foreground))" />
          </g>
        )}

        {/* Design Tools Dancing */}
        {designToolX > 0 && designToolX < beltLength && (
           <g transform={`translate(${designToolX + 10}, ${itemY + designToolYOffset}) rotate(${designToolRotation}, 12, 12)`}>
             <DesignTool />
           </g>
        )}

        {/* Output Painting */}
        {paintingX > 0 && paintingX < binX + 40 && (
          <Painting x={paintingFinalX} y={paintingFallY} color={paintingColor} />
        )}

        {/* Output Bin */}
        <rect x={binX} y={binY} width="50" height="60" fill="none" stroke="hsl(var(--secondary-foreground))" strokeWidth="2" rx="5" />
        <text x={binX + 5} y={binY + 75} fontSize="10" fill="hsl(var(--secondary-foreground))">Output</text>
        {/* Static paintings in bin */}
        <Painting x={binX + 5} y={binY + 15} color={colors[1]} />
        <Painting x={binX + 15} y={binY + 25} color={colors[3]} />
      </svg>
    </div>
  );
}
