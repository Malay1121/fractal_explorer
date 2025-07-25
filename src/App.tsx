import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import FractalCanvas from './components/FractalCanvas';
import ControlsPanel from './components/ControlsPanel';
import Header from './components/Header';
import { generateRandomFractalParams } from './utils/exportImage';

const DEFAULT_COLORS: [number[], number[], number[]] = [
  [0, 0.875, 1], // Electric blue
  [1, 0.173, 0.984], // Electric magenta  
  [0.557, 0.176, 0.886] // Electric purple
];

const DEFAULT_PARAMS = {
  center: [-0.75, 0] as [number, number],
  zoom: 0.8,
  juliaC: [-0.7, 0.27015] as [number, number],
  isJulia: false,
  colorShift: 0,
  animationSpeed: 1,
  autoEvolve: false
};

function App() {
  const [controlsOpen, setControlsOpen] = useState(false);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_PARAMS.center);
  const [zoom, setZoom] = useState(DEFAULT_PARAMS.zoom);
  const [juliaC, setJuliaC] = useState<[number, number]>(DEFAULT_PARAMS.juliaC);
  const [isJulia, setIsJulia] = useState(DEFAULT_PARAMS.isJulia);
  const [colorShift, setColorShift] = useState(DEFAULT_PARAMS.colorShift);
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_PARAMS.animationSpeed);
  const [autoEvolve, setAutoEvolve] = useState(DEFAULT_PARAMS.autoEvolve);
  const [colors] = useState<[number[], number[], number[]]>(DEFAULT_COLORS);
  
  const canvasRef = useRef<any>(null);
  const autoEvolveRef = useRef<NodeJS.Timeout>();

  // Auto-evolution effect
  useEffect(() => {
    if (autoEvolve) {
      autoEvolveRef.current = setInterval(() => {
        setCenter(prev => [
          prev[0] + (Math.random() - 0.5) * 0.01,
          prev[1] + (Math.random() - 0.5) * 0.01
        ]);
        setZoom(prev => prev * (0.98 + Math.random() * 0.04));
        setColorShift(prev => prev + 0.05);
        
        if (isJulia) {
          setJuliaC(prev => [
            prev[0] + (Math.random() - 0.5) * 0.01,
            prev[1] + (Math.random() - 0.5) * 0.01
          ]);
        }
      }, 100);
    } else {
      if (autoEvolveRef.current) {
        clearInterval(autoEvolveRef.current);
      }
    }

    return () => {
      if (autoEvolveRef.current) {
        clearInterval(autoEvolveRef.current);
      }
    };
  }, [autoEvolve, isJulia]);

  const handleRandomize = useCallback(() => {
    const params = generateRandomFractalParams();
    setCenter(params.center);
    setZoom(params.zoom);
    setJuliaC(params.juliaC);
    setColorShift(params.colorShift);
    setAnimationSpeed(params.animationSpeed);
    setIsJulia(params.isJulia);
  }, []);

  const handleReset = useCallback(() => {
    setCenter(DEFAULT_PARAMS.center);
    setZoom(DEFAULT_PARAMS.zoom);
    setJuliaC(DEFAULT_PARAMS.juliaC);
    setIsJulia(DEFAULT_PARAMS.isJulia);
    setColorShift(DEFAULT_PARAMS.colorShift);
    setAnimationSpeed(DEFAULT_PARAMS.animationSpeed);
    setAutoEvolve(DEFAULT_PARAMS.autoEvolve);
  }, []);

  const handleExport = useCallback((resolution: '1080p' | '4K') => {
    if (canvasRef.current?.exportCanvas) {
      canvasRef.current.exportCanvas(resolution);
    }
  }, []);

  const handleSeedPaint = useCallback((seed: [number, number], intensity: number) => {
    // This is handled internally by the canvas component
  }, []);

  return (
    <div className="min-h-screen bg-space-950 font-inter overflow-hidden relative">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-space-950 via-space-900 to-space-950 pointer-events-none z-0" />
      
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-electric-blue rounded-full opacity-20"
            animate={{
              x: [Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920), Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920)],
              y: [Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080), Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1920,
              top: typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 1080,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Main Fractal Canvas */}
      <motion.div 
        className="fixed inset-0 w-full h-full z-0"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <FractalCanvas
          ref={canvasRef}
          center={center}
          zoom={zoom}
          juliaC={juliaC}
          isJulia={isJulia}
          colorShift={colorShift}
          animationSpeed={animationSpeed}
          colors={colors}
          onCenterChange={setCenter}
          onZoomChange={setZoom}
          onSeedPaint={handleSeedPaint}
          autoEvolve={autoEvolve}
        />
      </motion.div>

      {/* Controls Panel */}
      <div className="relative z-30">
        <ControlsPanel
          isOpen={controlsOpen}
          onToggle={() => setControlsOpen(!controlsOpen)}
          center={center}
          zoom={zoom}
          juliaC={juliaC}
          isJulia={isJulia}
          colorShift={colorShift}
          animationSpeed={animationSpeed}
          autoEvolve={autoEvolve}
          onCenterChange={setCenter}
          onZoomChange={setZoom}
          onJuliaCChange={setJuliaC}
          onJuliaToggle={setIsJulia}
          onColorShiftChange={setColorShift}
          onAnimationSpeedChange={setAnimationSpeed}
          onAutoEvolveToggle={setAutoEvolve}
          onRandomize={handleRandomize}
          onExport={handleExport}
          onReset={handleReset}
        />
      </div>

      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: controlsOpen ? 0 : 1 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none z-40"
      >
        <div className="text-center space-y-2">
          <motion.p 
            className="text-gray-400 text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Scroll to zoom • Drag to paint • Click settings to explore
          </motion.p>
        </div>
      </motion.div>

      {/* Debug Info */}
      <div className="fixed top-20 left-4 text-white text-xs font-mono bg-black bg-opacity-50 p-2 rounded z-50">
        <div>Center: [{center[0].toFixed(3)}, {center[1].toFixed(3)}]</div>
        <div>Zoom: {zoom.toFixed(3)}</div>
        <div>Julia: {isJulia ? 'On' : 'Off'}</div>
        <div>Color Shift: {colorShift.toFixed(2)}</div>
      </div>

      {/* Custom CSS for sliders */}
      <style>{`
        .slider {
          background: linear-gradient(to right, #00E0FF 0%, #FF2CFB 50%, #8E2DE2 100%);
          height: 8px;
          border-radius: 4px;
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00E0FF, #FF2CFB);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 10px rgba(0, 224, 255, 0.5);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00E0FF, #FF2CFB);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 10px rgba(0, 224, 255, 0.5);
        }
      `}</style>
    </div>
  );
}

export default App;