
export interface ColorPalette {
  name: string;
  colors: [number[], number[], number[]];
  description: string;
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    name: "Electric Neon",
    colors: [
      [0, 0.875, 1],        
      [1, 0.173, 0.984],    
      [0.557, 0.176, 0.886] 
    ],
    description: "Default cyberpunk vibes"
  },
  {
    name: "Fire Storm",
    colors: [
      [1, 0.2, 0],          
      [1, 0.6, 0],          
      [1, 1, 0.2]           
    ],
    description: "Burning flames and lava"
  },
  {
    name: "Sunset Glow",
    colors: [
      [0.4, 0.1, 0.6],      
      [1, 0.4, 0.2],        
      [1, 0.8, 0.3]         
    ],
    description: "Golden hour magic"
  },
  {
    name: "Ice Crystal",
    colors: [
      [0.8, 0.9, 1],        
      [0.6, 0.8, 1],        
      [0.9, 0.95, 1]        
    ],
    description: "Frozen crystal formations"
  },
  {
    name: "Retro Miami",
    colors: [
      [1, 0.1, 0.5],        
      [0.1, 0.9, 1],        
      [1, 0.8, 0.1]         
    ],
    description: "80s synthwave vibes"
  },
  {
    name: "Toxic Waste",
    colors: [
      [0.5, 1, 0.1],        
      [1, 1, 0.1],          
      [0.1, 1, 0.5]         
    ],
    description: "Radioactive glow"
  },
  {
    name: "Royal Gold",
    colors: [
      [0.3, 0.1, 0.8],      
      [1, 0.8, 0.1],        
      [1, 0.9, 0.6]         
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
