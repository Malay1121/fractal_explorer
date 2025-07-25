// Predefined color palettes for the fractal explorer
export interface ColorPalette {
  name: string;
  colors: [number[], number[], number[]];
  description: string;
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    name: "Electric Neon",
    colors: [
      [0, 0.875, 1],        // Electric blue
      [1, 0.173, 0.984],    // Electric magenta  
      [0.557, 0.176, 0.886] // Electric purple
    ],
    description: "Default cyberpunk vibes"
  },
  {
    name: "Fire Storm",
    colors: [
      [1, 0.2, 0],          // Deep red
      [1, 0.6, 0],          // Orange
      [1, 1, 0.2]           // Yellow
    ],
    description: "Burning flames and lava"
  },
  {
    name: "Sunset Glow",
    colors: [
      [0.4, 0.1, 0.6],      // Purple
      [1, 0.4, 0.2],        // Orange
      [1, 0.8, 0.3]         // Yellow
    ],
    description: "Golden hour magic"
  },
  {
    name: "Ice Crystal",
    colors: [
      [0.8, 0.9, 1],        // Light blue
      [0.6, 0.8, 1],        // Ice blue
      [0.9, 0.95, 1]        // Almost white
    ],
    description: "Frozen crystal formations"
  },
  {
    name: "Retro Miami",
    colors: [
      [1, 0.1, 0.5],        // Hot pink
      [0.1, 0.9, 1],        // Cyan
      [1, 0.8, 0.1]         // Gold
    ],
    description: "80s synthwave vibes"
  },
  {
    name: "Toxic Waste",
    colors: [
      [0.5, 1, 0.1],        // Neon green
      [1, 1, 0.1],          // Neon yellow
      [0.1, 1, 0.5]         // Bright green
    ],
    description: "Radioactive glow"
  },
  {
    name: "Royal Gold",
    colors: [
      [0.3, 0.1, 0.8],      // Royal purple
      [1, 0.8, 0.1],        // Gold
      [1, 0.9, 0.6]         // Light gold
    ],
    description: "Luxury and elegance"
  }
];

export const getRandomPalette = (): ColorPalette => {
  return COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
};

export const getPaletteByName = (name: string): ColorPalette | undefined => {
  return COLOR_PALETTES.find(palette => palette.name === name);
};
