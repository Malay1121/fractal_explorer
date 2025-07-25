import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PerformanceStats {
  fps: number;
  frameTime: number;
  renderTime: number;
  memoryUsage?: number;
}

interface PerformanceMonitorProps {
  onStatsUpdate?: (stats: PerformanceStats) => void;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ onStatsUpdate }) => {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    frameTime: 0,
    renderTime: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const [frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(performance.now());

  useEffect(() => {
    let animationId: number;
    let fpsCounter = 0;
    let fpsStartTime = performance.now();

    const measurePerformance = () => {
      const now = performance.now();
      const deltaTime = now - lastTime;
      
      fpsCounter++;
      
      // Calculate FPS every second
      if (now - fpsStartTime >= 1000) {
        const fps = Math.round((fpsCounter * 1000) / (now - fpsStartTime));
        const frameTime = deltaTime;
        
        // Get memory usage if available
        const memoryUsage = (performance as any).memory?.usedJSHeapSize 
          ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) // Convert to MB
          : undefined;

        const newStats = {
          fps,
          frameTime: Math.round(frameTime * 100) / 100,
          renderTime: Math.round(deltaTime * 100) / 100,
          memoryUsage
        };

        setStats(newStats);
        onStatsUpdate?.(newStats);
        
        fpsCounter = 0;
        fpsStartTime = now;
      }
      
      setLastTime(now);
      setFrameCount(prev => prev + 1);
      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [lastTime, onStatsUpdate]);

  // Toggle visibility with Ctrl+Shift+P
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) {
    return null;
  }

  const getFpsColor = (fps: number) => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg font-mono text-sm z-50 min-w-[200px]"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-electric-blue font-semibold">Performance</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={getFpsColor(stats.fps)}>{stats.fps}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Frame Time:</span>
          <span className="text-gray-300">{stats.frameTime}ms</span>
        </div>
        
        <div className="flex justify-between">
          <span>Render Time:</span>
          <span className="text-gray-300">{stats.renderTime}ms</span>
        </div>
        
        {stats.memoryUsage && (
          <div className="flex justify-between">
            <span>Memory:</span>
            <span className="text-gray-300">{stats.memoryUsage}MB</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span>Frames:</span>
          <span className="text-gray-300">{frameCount.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-400">
        Ctrl+Shift+P to toggle
      </div>
    </motion.div>
  );
};

export default PerformanceMonitor;
