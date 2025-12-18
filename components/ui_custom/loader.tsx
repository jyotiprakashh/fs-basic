'use client';

// import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LoaderFs() {
  // State for overall animation control
//   const [isAnimating, setIsAnimating] = useState(true);
  
//   useEffect(() => {
//     // Keep animation running
//     if (!isAnimating) setIsAnimating(true);
//   }, [isAnimating]);

  // Function to create randomized connection timings
  const getConnectionTimings = (baseDelay = 0) => {
    return {
      opacity: [0, 0.7, 0.7, 0],
      pathLength: [0, 1, 1, 0],
      transition: { 
        duration: 3 + Math.random() * 2,
        times: [0, 0.3, 0.7, 1],
        repeat: Infinity,
        delay: baseDelay + Math.random() * 2
      }
    };
  };

  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-50 overflow-hidden">
      {/* Main Node Network */}
      <div className="relative w-80 h-80">
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          {/* Central Node */}
          <motion.circle
            cx="50"
            cy="50"
            r="8"
            fill="url(#orangeGradient)"
            initial={{ scale: 1 }}
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
          
          {/* First orbit nodes */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            // Calculate position on the orbit
            const orbitRadius = 22;
            const x = 50 + orbitRadius * Math.cos((angle * Math.PI) / 180);
            const y = 50 + orbitRadius * Math.sin((angle * Math.PI) / 180);
            
            return (
              <g key={`node-group-${i}`}>
                {/* Connection line to central node with connect/disconnect animation */}
                <motion.line
                  x1="50"
                  y1="50"
                  x2={x}
                  y2={y}
                  stroke="#FF9D71"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={getConnectionTimings(i * 0.5)}
                />
                
                {/* Orbiting node */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={i % 2 === 0 ? 4 : 5}
                  fill="url(#orangeGradient)"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    x: [0, Math.random() * 2 - 1, 0],
                    y: [0, Math.random() * 2 - 1, 0]
                  }}
                  transition={{
                    opacity: { duration: 0.5, delay: i * 0.1 },
                    x: { duration: 3, repeat: Infinity, repeatType: "reverse" },
                    y: { duration: 2.5, repeat: Infinity, repeatType: "reverse" }
                  }}
                />
                
                {/* Secondary nodes */}
                {i % 2 === 0 && (
                  <>
                    {[30, -30].map((subAngle, j) => {
                      const subRadius = 12;
                      const subAngleRad = ((angle + subAngle) * Math.PI) / 180;
                      const subX = x + subRadius * Math.cos(subAngleRad);
                      const subY = y + subRadius * Math.sin(subAngleRad);
                      
                      return (
                        <g key={`sub-node-${i}-${j}`}>
                          <motion.line
                            x1={x}
                            y1={y}
                            x2={subX}
                            y2={subY}
                            stroke="#FF9D71"
                            strokeWidth="1"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={getConnectionTimings(i * 0.3 + j * 0.8)}
                          />
                          <motion.circle
                            cx={subX}
                            cy={subY}
                            r="2.5"
                            fill="url(#orangeGradient)"
                            initial={{ opacity: 0 }}
                            animate={{ 
                              opacity: 1,
                              x: [0, Math.random() * 1.5 - 0.75, 0],
                              y: [0, Math.random() * 1.5 - 0.75, 0]
                            }}
                            transition={{
                              opacity: { duration: 0.5, delay: i * 0.1 + j * 0.1 + 0.5 },
                              x: { duration: 2, repeat: Infinity, repeatType: "reverse" },
                              y: { duration: 2.2, repeat: Infinity, repeatType: "reverse" }
                            }}
                          />
                        </g>
                      );
                    })}
                  </>
                )}
              </g>
            );
          })}
          
          {/* Gradient definition for nodes */}
          <defs>
            <radialGradient id="orangeGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#FFBF80" />
              <stop offset="100%" stopColor="#FF7E35" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      
      {/* Small disconnected network in top right corner */}
      <div className="absolute top-8 right-8 w-32 h-32">
        <svg width="100%" height="100%" viewBox="0 0 50 50">
          {/* Small network central node */}
          <motion.circle
            cx="25"
            cy="25"
            r="4"
            fill="url(#smallOrangeGradient)"
            animate={{ 
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          
          {/* Small network satellite nodes */}
          {[0, 72, 144, 216, 288].map((angle, i) => {
            const smallRadius = 10;
            const x = 25 + smallRadius * Math.cos((angle * Math.PI) / 180);
            const y = 25 + smallRadius * Math.sin((angle * Math.PI) / 180);
            
            return (
              <g key={`small-node-${i}`}>
                {/* Connection line with connect/disconnect animation */}
                <motion.line
                  x1="25"
                  y1="25"
                  x2={x}
                  y2={y}
                  stroke="#FF9D71"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    opacity: [0, 0.7, 0.7, 0],
                    pathLength: [0, 1, 1, 0],
                    transition: { 
                      duration: 2 + Math.random() * 1.5,
                      times: [0, 0.3, 0.7, 1],
                      repeat: Infinity,
                      delay: i * 0.4 + Math.random()
                    }
                  }}
                />
                
                {/* Small satellite node */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r="2"
                  fill="url(#smallOrangeGradient)"
                  animate={{ 
                    x: [0, Math.random() * 1 - 0.5, 0],
                    y: [0, Math.random() * 1 - 0.5, 0],
                  }}
                  transition={{
                    duration: 2.5, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </g>
            );
          })}
          
          {/* Gradient for small network */}
          <defs>
            <radialGradient id="smallOrangeGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#FFBF80" />
              <stop offset="100%" stopColor="#FF7E35" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}