export interface FractalPreset {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  params: {
    center: [number, number];
    zoom: number;
    juliaC: [number, number];
    isJulia: boolean;
    colorShift: number;
    animationSpeed: number;
    colorPalette: string;
  };
  createdAt: number;
}

export const BUILT_IN_PRESETS: FractalPreset[] = [
  {
    id: "classic-mandelbrot",
    name: "Classic Mandelbrot",
    description: "The iconic Mandelbrot set view",
    params: {
      center: [-0.75, 0],
      zoom: 0.8,
      juliaC: [-0.7, 0.27015],
      isJulia: false,
      colorShift: 0,
      animationSpeed: 1,
      colorPalette: "Electric Neon"
    },
    createdAt: Date.now()
  },
  {
    id: "seahorse-valley",
    name: "Seahorse Valley",
    description: "Famous seahorse-shaped region",
    params: {
      center: [-0.743643887037151, 0.13182590420533],
      zoom: 150,
      juliaC: [-0.7, 0.27015],
      isJulia: false,
      colorShift: 0.5,
      animationSpeed: 0.8,
      colorPalette: "Ocean Depths"
    },
    createdAt: Date.now()
  },
  {
    id: "julia-spiral",
    name: "Julia Spiral",
    description: "Beautiful Julia set spiral pattern",
    params: {
      center: [0, 0],
      zoom: 1.2,
      juliaC: [-0.4, 0.6],
      isJulia: true,
      colorShift: 0.3,
      animationSpeed: 1.5,
      colorPalette: "Cosmic Purple"
    },
    createdAt: Date.now()
  },
  {
    id: "burning-ship",
    name: "Mini Mandelbrot",
    description: "Tiny replica of the main set",
    params: {
      center: [-0.16070135, 1.0375665],
      zoom: 800,
      juliaC: [-0.7, 0.27015],
      isJulia: false,
      colorShift: 0.8,
      animationSpeed: 1.2,
      colorPalette: "Fire Storm"
    },
    createdAt: Date.now()
  },
  {
    id: "lightning",
    name: "Lightning Bolts",
    description: "Electric fractal patterns",
    params: {
      center: [-0.7269, 0.1889],
      zoom: 2000,
      juliaC: [-0.8, 0.156],
      isJulia: false,
      colorShift: 0.2,
      animationSpeed: 2,
      colorPalette: "Electric Neon"
    },
    createdAt: Date.now()
  }
];

export class PresetManager {
  private static STORAGE_KEY = 'fractal-explorer-presets';

  static savePreset(preset: Omit<FractalPreset, 'id' | 'createdAt'>): FractalPreset {
    const newPreset: FractalPreset = {
      ...preset,
      id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now()
    };

    const existingPresets = this.getUserPresets();
    existingPresets.push(newPreset);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingPresets));
    
    return newPreset;
  }

  static getUserPresets(): FractalPreset[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static getAllPresets(): FractalPreset[] {
    return [...BUILT_IN_PRESETS, ...this.getUserPresets()];
  }

  static deletePreset(id: string): void {
    const userPresets = this.getUserPresets().filter(p => p.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userPresets));
  }

  static exportPresets(): string {
    return JSON.stringify(this.getUserPresets(), null, 2);
  }

  static importPresets(jsonString: string): boolean {
    try {
      const presets = JSON.parse(jsonString);
      if (Array.isArray(presets)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(presets));
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }
}
