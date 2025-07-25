import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Download, Shuffle, Play, Pause, Palette, RotateCcw, Sparkles, PauseCircle, PlayCircle } from 'lucide-react';
import { COLOR_PALETTES } from '../utils/colorPalettes';

interface ControlsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  center: [number, number];
  zoom: number;
  juliaC: [number, number];
  isJulia: boolean;
  colorShift: number;
  animationSpeed: number;
  autoEvolve: boolean;
  currentPalette: string;
  particlesEnabled: boolean;
  animationsPaused: boolean;
  onCenterChange: (center: [number, number]) => void;
  onZoomChange: (zoom: number) => void;
  onJuliaCChange: (juliaC: [number, number]) => void;
  onJuliaToggle: (isJulia: boolean) => void;
  onColorShiftChange: (colorShift: number) => void;
  onAnimationSpeedChange: (speed: number) => void;
  onAutoEvolveToggle: (autoEvolve: boolean) => void;
  onPaletteChange: (paletteName: string) => void;
  onParticlesToggle: (enabled: boolean) => void;
  onAnimationsPauseToggle: (paused: boolean) => void;
  onRandomize: () => void;
  onExport: (resolution: '1080p' | '4K') => void;
  onReset: () => void;
}

const SliderInput: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}> = ({ label, value, min, max, step, onChange, formatValue }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <span className="text-xs text-electric-blue font-mono">
        {formatValue ? formatValue(value) : value.toFixed(3)}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-space-800 rounded-lg appearance-none cursor-pointer slider"
    />
  </div>
);

export default function ControlsPanel({
  isOpen,
  onToggle,
  center,
  zoom,
  juliaC,
  isJulia,
  colorShift,
  animationSpeed,
  autoEvolve,
  currentPalette,
  particlesEnabled,
  animationsPaused,
  onCenterChange,
  onZoomChange,
  onJuliaCChange,
  onJuliaToggle,
  onColorShiftChange,
  onAnimationSpeedChange,
  onAutoEvolveToggle,
  onPaletteChange,
  onParticlesToggle,
  onAnimationsPauseToggle,
  onRandomize,
  onExport,
  onReset
}: ControlsPanelProps) {
  return (
    <>
      <motion.button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-glass-bg backdrop-blur-glass border border-glass-border text-white hover:bg-glass-hover transition-all duration-300 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Settings className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-4 right-20 z-40 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto bg-glass-bg backdrop-blur-glass border border-glass-border rounded-2xl p-6 text-white shadow-2xl"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold bg-gradient-to-r from-electric-blue to-electric-magenta bg-clip-text text-transparent">
                  Fractal Controls
                </h2>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => onAnimationsPauseToggle(!animationsPaused)}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      animationsPaused 
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' 
                        : 'bg-glass-bg border border-glass-border hover:bg-glass-hover'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={animationsPaused ? "Resume Animations" : "Pause Animations"}
                  >
                    {animationsPaused ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
                  </motion.button>
                  <motion.button
                    onClick={() => onAutoEvolveToggle(!autoEvolve)}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      autoEvolve 
                        ? 'bg-electric-blue/20 text-electric-blue border border-electric-blue/50' 
                        : 'bg-glass-bg border border-glass-border hover:bg-glass-hover'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={autoEvolve ? "Pause Evolution" : "Start Evolution"}
                  >
                    {autoEvolve ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </motion.button>
                  <motion.button
                    onClick={() => onParticlesToggle(!particlesEnabled)}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      particlesEnabled 
                        ? 'bg-electric-magenta/20 text-electric-magenta border border-electric-magenta/50' 
                        : 'bg-glass-bg border border-glass-border hover:bg-glass-hover'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={particlesEnabled ? "Hide Particles" : "Show Particles"}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={onReset}
                    className="p-2 rounded-lg bg-glass-bg border border-glass-border hover:bg-glass-hover transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Reset to Default"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Fractal Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    onClick={() => onJuliaToggle(false)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      !isJulia
                        ? 'bg-electric-blue/20 text-electric-blue border border-electric-blue/50'
                        : 'bg-glass-bg border border-glass-border hover:bg-glass-hover'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Mandelbrot
                  </motion.button>
                  <motion.button
                    onClick={() => onJuliaToggle(true)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isJulia
                        ? 'bg-electric-magenta/20 text-electric-magenta border border-electric-magenta/50'
                        : 'bg-glass-bg border border-glass-border hover:bg-glass-hover'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Julia Set
                  </motion.button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <span>Navigation</span>
                </h3>
                <SliderInput
                  label="Zoom"
                  value={Math.log10(zoom)}
                  min={-2}
                  max={4}
                  step={0.1}
                  onChange={(value) => onZoomChange(Math.pow(10, value))}
                  formatValue={(value) => `${Math.pow(10, value).toFixed(1)}x`}
                />
                <div className="grid grid-cols-2 gap-4">
                  <SliderInput
                    label="Center X"
                    value={center[0]}
                    min={-2}
                    max={2}
                    step={0.01}
                    onChange={(value) => onCenterChange([value, center[1]])}
                  />
                  <SliderInput
                    label="Center Y"
                    value={center[1]}
                    min={-2}
                    max={2}
                    step={0.01}
                    onChange={(value) => onCenterChange([center[0], value])}
                  />
                </div>
              </div>

              {}
              {isJulia && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-300">Julia Parameters</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <SliderInput
                      label="Julia C (Real)"
                      value={juliaC[0]}
                      min={-2}
                      max={2}
                      step={0.01}
                      onChange={(value) => onJuliaCChange([value, juliaC[1]])}
                    />
                    <SliderInput
                      label="Julia C (Imag)"
                      value={juliaC[1]}
                      min={-2}
                      max={2}
                      step={0.01}
                      onChange={(value) => onJuliaCChange([juliaC[0], value])}
                    />
                  </div>
                </div>
              )}

              {}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-300">Animation</h3>
                <SliderInput
                  label="Animation Speed"
                  value={animationSpeed}
                  min={0}
                  max={3}
                  step={0.1}
                  onChange={onAnimationSpeedChange}
                  formatValue={(value) => `${value.toFixed(1)}x`}
                />
                <SliderInput
                  label="Color Shift"
                  value={colorShift}
                  min={0}
                  max={6.28}
                  step={0.1}
                  onChange={onColorShiftChange}
                  formatValue={(value) => `${(value * 180 / Math.PI).toFixed(0)}°`}
                />
              </div>

              {}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-electric-blue" />
                  <label className="text-sm font-medium text-gray-300">Color Palette</label>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {COLOR_PALETTES.map((palette) => (
                    <motion.button
                      key={palette.name}
                      onClick={() => onPaletteChange(palette.name)}
                      className={`p-2 rounded-lg text-xs font-medium transition-all duration-300 border ${
                        currentPalette === palette.name
                          ? 'bg-electric-blue bg-opacity-20 border-electric-blue text-electric-blue'
                          : 'bg-space-800 border-space-600 text-gray-300 hover:bg-space-700 hover:border-electric-blue hover:text-electric-blue'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        {}
                        {palette.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: `rgb(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255})`
                            }}
                          />
                        ))}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{palette.name}</div>
                        <div className="text-xs opacity-60">{palette.description}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {}
              <div className="space-y-3">
                <motion.button
                  onClick={onRandomize}
                  className="w-full p-3 rounded-lg bg-gradient-to-r from-electric-purple to-electric-magenta text-white font-medium hover:from-electric-magenta hover:to-electric-purple transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Shuffle className="w-4 h-4" />
                  Randomize Seeds
                </motion.button>

                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    onClick={() => onExport('1080p')}
                    className="p-3 rounded-lg bg-glass-bg border border-glass-border hover:bg-glass-hover transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-4 h-4" />
                    1080p
                  </motion.button>
                  <motion.button
                    onClick={() => onExport('4K')}
                    className="p-3 rounded-lg bg-electric-blue/20 border border-electric-blue/50 text-electric-blue hover:bg-electric-blue/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-4 h-4" />
                    4K
                  </motion.button>
                </div>
              </div>

              {}
              <div className="p-3 rounded-lg bg-space-900/50 border border-space-700">
                <p className="text-xs text-gray-400 leading-relaxed">
                  <strong className="text-electric-blue">Scroll</strong> to zoom • 
                  <strong className="text-electric-magenta"> Drag</strong> to paint seeds • 
                  <strong className="text-electric-purple"> Auto-evolve</strong> for continuous animation
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
