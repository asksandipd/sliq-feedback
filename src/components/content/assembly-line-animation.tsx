
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
  const stageLabelY = 10; // Adjusted Y position for stage labels
  const stageIconY = 30; // Y position for stage icons/visuals (lowered slightly)

  const outputX = beltLength + 20;
  const binWidth = 60;
  const binHeight = 70;
  const binX = outputX + 10;
  const binY = 70;
  const binBottomY = binY + binHeight;
  const binCenterX = binX + binWidth / 2;
  const binVortexRadius = binWidth * 0.15; // Reduced radius for vortex movement
  const binVortexSpeed = 2.5; // Controls speed of vortex rotation
  const binVerticalBounce = 2; // Reduced amplitude for vertical bounce
  const binVerticalSpeed = 1.8; // Speed for vertical bounce

  // Item specific animations
  const colorDropY = 15;
  const itemY = 60; // Y position on the belt
  const itemDanceAmount = 5; // Pixels for dancing effect

  const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
  const colorX = getItemPosition(0, 1);
  const colorYOffset = Math.sin(animationTime * 5) * itemDanceAmount;

  // Pentagon color coordinates for Stage 1
  const pentagonCenterX = stageStartX[0] + 40; // Center the pentagon visually
  const pentagonCenterY = stageIconY + 15; // Lowered to avoid label overlap
  const pentagonRadius = 15;
  const pentagonPoints = Array.from({ length: 5 }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2; // Start from top
    return {
      x: pentagonCenterX + pentagonRadius * Math.cos(angle),
      y: pentagonCenterY + pentagonRadius * Math.sin(angle),
    };
  });


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
  // Adjust falling logic for funnel bin
  const paintingRectHeight = 30; // Approx height of the falling rectangle
  const fallTargetY = binY + binHeight * 0.6; // Target Y inside the funnel, slightly lower
  const paintingFallProgress = Math.max(0, Math.min(1, (paintingX - outputX + 10) / (binX - outputX + 20))); // Start falling a bit earlier
  const paintingFallY = itemY + paintingFallProgress * (fallTargetY - itemY);
  const paintingFinalX = paintingFallProgress >= 1 ? binX + binWidth / 2 - 15 : paintingX; // Center the item as it falls into bin (15 is half width of PaintingRect)
  const paintingFinalRotation = paintingFallProgress * 20; // Add slight rotation while falling


  const paintingColorIndex = Math.floor((animationTime * 0.5) % colors.length);
  const paintingColor = colors[paintingColorIndex];

  // Calculate vortex offsets for bin items
  // Use different speeds and offsets for each item for more randomness
  const vortexAngle = (time: number, offset: number, speedMultiplier: number) => (time * binVortexSpeed * speedMultiplier + offset * Math.PI / 2.5) % (2 * Math.PI);
  const verticalOffset = (time: number, offset: number, speedMultiplier: number) => Math.sin(time * binVerticalSpeed * speedMultiplier + offset) * binVerticalBounce;

  // Base positions within the bin's lower area
  const binBaseY = binBottomY - 15; // Slightly above the absolute bottom
  const binBaseRadius = binWidth * 0.2; // Area within which items are initially placed

  const binItemTransforms = [
      { // Circle
          baseX: binCenterX - binBaseRadius * 0.5,
          baseY: binBaseY - binBaseRadius * 0.2,
          angle: vortexAngle(animationTime, 0, 1.0),
          yOffset: verticalOffset(animationTime, 0, 1.0),
          scale: 1 + Math.sin(animationTime * 1.5 + 0) * 0.05, // Smaller scale pulse
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
      const vortexY = Math.sin(angle) * binVortexRadius * 0.5; // Make vortex slightly elliptical

      // Calculate the final translation: base position + vortex offset + vertical bounce
      const translateX = baseX + vortexX;
      const translateY = baseY + vortexY + yOffset;

      // Adjust transform origin for rotation/scaling based on shape type
      let originX = 0; // Relative to the shape's top-left
      let originY = 0;

      if (shapeWidth && shapeHeight) { // Rect/Triangle (approx center)
         originX = shapeWidth / 2;
         originY = shapeHeight / 2;
      } else if (shapeWidth) { // Circle (radius is shapeWidth here)
          originX = shapeWidth; // cx relative to top-left is radius
          originY = shapeWidth; // cy relative to top-left is radius
      }

       // Apply translation first, then rotation and scale around the adjusted origin
       return `translate(${translateX}, ${translateY}) rotate(${rotation}, ${originX}, ${originY}) scale(${scale})`;
  };


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


        {/* Stage Visuals */}
        {/* Stage 1: Colors */}
        <text x={stageStartX[0]} y={stageLabelY} fontSize="10" fill="hsl(var(--foreground))">Stage 1: Colors</text>
        {/* Pentagon of Colors */}
        {pentagonPoints.map((point, i) => (
          <circle
            key={`color-dot-${i}`}
            cx={point.x}
            cy={point.y}
            r="6" // Smaller radius for dots
            fill={colors[i % colors.length]}
            opacity={colorX > stageStartX[0] - 10 && colorX < stageStartX[1] - 10 ? 1 : 0.3}
          />
        ))}


        {/* Stage 2: Brushes */}
        <text x={stageStartX[1]} y={stageLabelY} fontSize="10" fill="hsl(var(--foreground))">Stage 2: Brushes</text>
        <g transform={`translate(${stageStartX[1] + 30}, ${stageIconY + 5})`} opacity={brushX > stageStartX[1] -10 && brushX < stageStartX[2] -10 ? 1 : 0.3}>
           <Paintbrush size={16} />
        </g>

        {/* Stage 3: Pencils */}
        <text x={stageStartX[2]} y={stageLabelY} fontSize="10" fill="hsl(var(--foreground))">Stage 3: Pencils</text>
         <g transform={`translate(${stageStartX[2] + 30}, ${stageIconY + 5})`} opacity={pencilX > stageStartX[2] -10 && pencilX < stageStartX[3] -10 ? 1 : 0.3}>
            <Pencil size={16} />
         </g>

        {/* Stage 4: Design Tools */}
        <text x={stageStartX[3]} y={stageLabelY} fontSize="10" fill="hsl(var(--foreground))">Stage 4: Design Tools</text>
         <g transform={`translate(${stageStartX[3] + 30}, ${stageIconY + 5})`} opacity={designToolX > stageStartX[3] -10 && designToolX < outputX ? 1 : 0.3}>
            {/* Use updated FigmaIcon */}
            <FigmaIcon />
         </g>
         <g transform={`translate(${stageStartX[3] + 60}, ${stageIconY + 5})`} opacity={designToolX > stageStartX[3] -10 && designToolX < outputX ? 1 : 0.3}>
             {/* Use updated CanvaIcon */}
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
             {/* Render the selected DesignTool component */}
             <DesignTool />
           </g>
        )}

        {/* Output Art (Rectangle) falling into bin */}
        {paintingX > 0 && paintingX < binX + binWidth + 10 && paintingFallProgress < 1 && ( // Only render while falling
           <g transform={`translate(${paintingFinalX}, ${paintingFallY}) rotate(${paintingFinalRotation}, 15, ${paintingRectHeight/2})`}>
              <PaintingRect x={0} y={0} color={paintingColor} height={paintingRectHeight} />
           </g>
        )}


        {/* Output Bin (Funnel) */}
        {/* Clip path to contain shapes within the bin */}
        <defs>
           <clipPath id="binClipPath">
               {/* Define the visual area of the bin (funnel + base) */}
               <polygon
                   points={`${binX},${binY} ${binX + binWidth},${binY} ${binX + binWidth - (binWidth - binWidth * 0.6) / 2},${binY + binHeight * 0.8} ${binX + (binWidth - binWidth * 0.6) / 2},${binY + binHeight * 0.8}`}
                />
               <rect
                   x={binX + (binWidth - binWidth * 0.6) / 2}
                   y={binY + binHeight * 0.8}
                   width={binWidth * 0.6}
                   height={binHeight * 0.2 + 5} // Add a little extra height to clip path bottom
                />
           </clipPath>
        </defs>

        {/* Apply clip path to the group containing the dancing shapes */}
        <g clipPath="url(#binClipPath)">
            {/* Items dancing inside the bin using vortex logic */}
            <PaintingCircle
                 cx={0} cy={0} // Base position is handled by transform
                 color={colors[1]} r={8}
                 transform={getBinItemTransform(0, 8, 8)} // Pass radius as width/height for origin calc
             />
             <PaintingTriangle
                 x={0} y={0} // Base position handled by transform
                 color={colors[3]} size={15}
                 transform={getBinItemTransform(1, 15, 15)}
             />
             <PaintingRect
                 x={0} y={0} // Base position handled by transform
                 color={colors[0]} width={12} height={10}
                 transform={getBinItemTransform(2, 12, 10)}
             />
             <PaintingCircle
                 cx={0} cy={0} // Base position handled by transform
                 color={colors[4]} r={6}
                 transform={getBinItemTransform(3, 6, 6)}
             />
             <PaintingTriangle
                 x={0} y={0} // Base position handled by transform
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
