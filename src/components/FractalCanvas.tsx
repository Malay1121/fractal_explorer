import React, { useRef, useEffect, useCallback, forwardRef } from 'react';

interface FractalCanvasProps {
  center: [number, number];
  zoom: number;
  juliaC: [number, number];
  isJulia: boolean;
  colorShift: number;
  animationSpeed: number;
  colors: [number[], number[], number[]];
  onCenterChange: (center: [number, number]) => void;
  onZoomChange: (zoom: number) => void;
  onSeedPaint: (seed: [number, number], intensity: number) => void;
  autoEvolve: boolean;
}

const FractalCanvas = forwardRef<{ exportCanvas: (resolution?: '1080p' | '4K') => void }, FractalCanvasProps>(({
  center,
  zoom,
  juliaC,
  isJulia,
  colorShift,
  animationSpeed,
  colors,
  onCenterChange,
  onZoomChange,
  onSeedPaint,
  autoEvolve
}, ref) => {
  const localCanvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<any>({});
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());
  const paintSeedRef = useRef<[number, number]>([0, 0]);
  const paintIntensityRef = useRef<number>(0);

  // Refs to hold current state values for render function
  const centerRef = useRef(center);
  const zoomRef = useRef(zoom);
  const juliaCRef = useRef(juliaC);
  const isJuliaRef = useRef(isJulia);
  const colorShiftRef = useRef(colorShift);
  const animationSpeedRef = useRef(animationSpeed);
  const colorsRef = useRef(colors);

  // Update refs when props change
  useEffect(() => {
    centerRef.current = center;
    zoomRef.current = zoom;
    juliaCRef.current = juliaC;
    isJuliaRef.current = isJulia;
    colorShiftRef.current = colorShift;
    animationSpeedRef.current = animationSpeed;
    colorsRef.current = colors;
  }, [center, zoom, juliaC, isJulia, colorShift, animationSpeed, colors]);

  const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;

    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = (a_position + 1.0) * 0.5;
    }
  `;

  const fragmentShaderSource = `
    precision highp float;

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_center;
    uniform float u_zoom;
    uniform vec2 u_juliaC;
    uniform bool u_isJulia;
    uniform float u_colorShift;
    uniform float u_animationSpeed;
    uniform vec3 u_color1;
    uniform vec3 u_color2;
    uniform vec3 u_color3;
    uniform vec2 u_paintSeed;
    uniform float u_paintIntensity;

    varying vec2 v_texCoord;

    vec2 complexSquare(vec2 z) {
        return vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
    }

    float mandelbrot(vec2 c) {
        vec2 z = vec2(0.0);
        int maxIter = 128;
        
        for (int i = 0; i < 128; i++) {
            if (dot(z, z) > 4.0) {
                return float(i) / float(maxIter);
            }
            z = complexSquare(z) + c;
        }
        return 0.0;
    }

    float julia(vec2 z, vec2 c) {
        int maxIter = 128;
        
        for (int i = 0; i < 128; i++) {
            if (dot(z, z) > 4.0) {
                return float(i) / float(maxIter);
            }
            z = complexSquare(z) + c;
        }
        return 0.0;
    }

    void main() {
        vec2 uv = (v_texCoord * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);
        
        uv = uv / u_zoom + u_center;
        
        float breathe = sin(u_time * u_animationSpeed) * 0.1 + 1.0;
        uv *= breathe;
        
        float paintDist = distance(uv, u_paintSeed);
        float paintEffect = exp(-paintDist * 5.0) * u_paintIntensity;
        uv += paintEffect * vec2(sin(u_time * 2.0), cos(u_time * 2.0)) * 0.1;
        
        float fractalValue;
        
        if (u_isJulia) {
            vec2 juliaC = u_juliaC + vec2(
                sin(u_time * u_animationSpeed * 0.7) * 0.2,
                cos(u_time * u_animationSpeed * 0.5) * 0.2
            );
            fractalValue = julia(uv, juliaC);
        } else {
            fractalValue = mandelbrot(uv);
        }
        
        float colorPhase = u_colorShift + u_time * u_animationSpeed * 0.3;
        
        if (fractalValue == 0.0) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        } else {
            vec3 color;
            float t = fractalValue + colorPhase;
            
            if (t < 0.33) {
                color = mix(u_color1, u_color2, t * 3.0);
            } else if (t < 0.66) {
                color = mix(u_color2, u_color3, (t - 0.33) * 3.0);
            } else {
                color = mix(u_color3, u_color1, (t - 0.66) * 3.0);
            }
            
            float intensity = 0.5 + 0.5 * sin(fractalValue * 20.0 + u_time * u_animationSpeed * 2.0);
            color *= intensity;
            
            gl_FragColor = vec4(color, 1.0);
        }
    }
  `;

  const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) {
      console.error('Failed to create shader');
      return null;
    }
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  };    const initWebGL = useCallback(() => {
    const canvas = localCanvasRef.current;
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    const glContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!glContext) {
      console.error('WebGL not supported');
      return;
    }

    const gl = glContext as WebGLRenderingContext;
    glRef.current = gl;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      console.error('Failed to create shaders');
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      console.error('Failed to create program');
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    programRef.current = program;

    // Get uniform locations
    uniformsRef.current = {
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_center: gl.getUniformLocation(program, 'u_center'),
      u_zoom: gl.getUniformLocation(program, 'u_zoom'),
      u_juliaC: gl.getUniformLocation(program, 'u_juliaC'),
      u_isJulia: gl.getUniformLocation(program, 'u_isJulia'),
      u_colorShift: gl.getUniformLocation(program, 'u_colorShift'),
      u_animationSpeed: gl.getUniformLocation(program, 'u_animationSpeed'),
      u_color1: gl.getUniformLocation(program, 'u_color1'),
      u_color2: gl.getUniformLocation(program, 'u_color2'),
      u_color3: gl.getUniformLocation(program, 'u_color3'),
      u_paintSeed: gl.getUniformLocation(program, 'u_paintSeed'),
      u_paintIntensity: gl.getUniformLocation(program, 'u_paintIntensity'),
    };

    // Create buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    console.log('WebGL initialized successfully');
  }, []);

  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    const uniforms = uniformsRef.current;
    
    if (!gl || !program || !uniforms) {
      console.log('WebGL components not ready, retrying...');
      // Retry after a short delay
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(render);
      }, 16);
      return;
    }

    const canvas = localCanvasRef.current;
    if (!canvas) {
      console.log('Canvas not found');
      return;
    }

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      canvas.width = rect.width;
      canvas.height = rect.height;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    gl.clearColor(0.06, 0.06, 0.1, 1.0); // Deep space background
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    const currentTime = (Date.now() - startTimeRef.current) / 1000;

    // Set uniforms
    try {
      gl.uniform2f(uniforms.u_resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.u_time, currentTime);
      gl.uniform2f(uniforms.u_center, centerRef.current[0], centerRef.current[1]);
      gl.uniform1f(uniforms.u_zoom, zoomRef.current);
      gl.uniform2f(uniforms.u_juliaC, juliaCRef.current[0], juliaCRef.current[1]);
      gl.uniform1i(uniforms.u_isJulia, isJuliaRef.current ? 1 : 0);
      gl.uniform1f(uniforms.u_colorShift, colorShiftRef.current);
      gl.uniform1f(uniforms.u_animationSpeed, animationSpeedRef.current);
      gl.uniform3f(uniforms.u_color1, colorsRef.current[0][0], colorsRef.current[0][1], colorsRef.current[0][2]);
      gl.uniform3f(uniforms.u_color2, colorsRef.current[1][0], colorsRef.current[1][1], colorsRef.current[1][2]);
      gl.uniform3f(uniforms.u_color3, colorsRef.current[2][0], colorsRef.current[2][1], colorsRef.current[2][2]);
      gl.uniform2f(uniforms.u_paintSeed, paintSeedRef.current[0], paintSeedRef.current[1]);
      gl.uniform1f(uniforms.u_paintIntensity, paintIntensityRef.current);

      // Decay paint intensity
      paintIntensityRef.current *= 0.98;

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    } catch (error) {
      console.error('WebGL render error:', error);
    }

    animationRef.current = requestAnimationFrame(render);
  }, []); // Empty dependency array so it's stable

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    onZoomChange(zoomRef.current * zoomFactor);
  }, [onZoomChange]);

  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef<[number, number]>([0, 0]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = localCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    if (e.buttons === 1) { // Left mouse button held
      if (!isDraggingRef.current) {
        // Start dragging
        isDraggingRef.current = true;
        lastMousePosRef.current = [x, y];
      } else {
        // Continue dragging - pan the fractal
        const dx = x - lastMousePosRef.current[0];
        const dy = y - lastMousePosRef.current[1];
        
        // Convert screen movement to fractal coordinate movement
        const fractalDx = -dx * 2 / zoomRef.current * (rect.width / rect.height);
        const fractalDy = dy * 2 / zoomRef.current;
        
        onCenterChange([centerRef.current[0] + fractalDx, centerRef.current[1] + fractalDy]);
        lastMousePosRef.current = [x, y];
      }
      
      // Convert to fractal coordinates for painting effect
      const fractalX = ((x * 2 - 1) * (rect.width / rect.height)) / zoomRef.current + centerRef.current[0];
      const fractalY = ((1 - y * 2)) / zoomRef.current + centerRef.current[1];
      
      paintSeedRef.current = [fractalX, fractalY];
      paintIntensityRef.current = Math.min(paintIntensityRef.current + 0.1, 1.0);
      onSeedPaint([fractalX, fractalY], paintIntensityRef.current);
    } else {
      isDraggingRef.current = false;
    }
  }, [onCenterChange, onSeedPaint]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button === 0) { // Left click
      isDraggingRef.current = false; // Reset drag state
      const canvas = localCanvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      lastMousePosRef.current = [x, y];
    }
    if (e.button === 2) { // Right click - prevent context menu
      e.preventDefault();
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    console.log('Initializing WebGL...');
    initWebGL();
    
    const canvas = localCanvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Start render loop after a brief delay to ensure WebGL is ready
    const timeoutId = setTimeout(() => {
      console.log('Starting render loop...');
      console.log('Initial state:', { 
        center: centerRef.current, 
        zoom: zoomRef.current, 
        colors: colorsRef.current 
      });
      render();
    }, 100);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('contextmenu', (e) => e.preventDefault());
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initWebGL, handleWheel, handleMouseMove, handleMouseDown, handleMouseUp]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = localCanvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const exportCanvas = useCallback((resolution: '1080p' | '4K' = '1080p') => {
    const canvas = localCanvasRef.current;
    if (!canvas) return;

    const width = resolution === '4K' ? 3840 : 1920;
    const height = resolution === '4K' ? 2160 : 1080;

    // Create temporary canvas for export
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = width;
    exportCanvas.height = height;

    const link = document.createElement('a');
    link.download = `fractal-${Date.now()}-${resolution}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  // Expose export function
  React.useImperativeHandle(ref, () => ({
    exportCanvas
  }), [exportCanvas]);

  return (
    <canvas
      ref={localCanvasRef}
      className="w-full h-full cursor-crosshair absolute inset-0"
      style={{ touchAction: 'none', width: '100vw', height: '100vh' }}
    />
  );
});

FractalCanvas.displayName = 'FractalCanvas';

export default FractalCanvas;