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

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

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
    
    // Apply zoom and center
    uv = uv / u_zoom + u_center;
    
    // Add subtle breathing effect
    float breathe = sin(u_time * u_animationSpeed) * 0.1 + 1.0;
    uv *= breathe;
    
    // Add paint seed influence
    float paintDist = distance(uv, u_paintSeed);
    float paintEffect = exp(-paintDist * 5.0) * u_paintIntensity;
    uv += paintEffect * vec2(sin(u_time * 2.0), cos(u_time * 2.0)) * 0.1;
    
    float fractalValue;
    
    if (u_isJulia) {
        // Animated Julia set parameters
        vec2 juliaC = u_juliaC + vec2(
            sin(u_time * u_animationSpeed * 0.7) * 0.2,
            cos(u_time * u_animationSpeed * 0.5) * 0.2
        );
        fractalValue = julia(uv, juliaC);
    } else {
        fractalValue = mandelbrot(uv);
    }
    
    // Color mapping with animation
    float colorPhase = u_colorShift + u_time * u_animationSpeed * 0.3;
    
    if (fractalValue == 0.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        // Multi-color gradient
        vec3 color;
        float t = fractalValue + colorPhase;
        
        if (t < 0.33) {
            color = mix(u_color1, u_color2, t * 3.0);
        } else if (t < 0.66) {
            color = mix(u_color2, u_color3, (t - 0.33) * 3.0);
        } else {
            color = mix(u_color3, u_color1, (t - 0.66) * 3.0);
        }
        
        // Add intensity variation
        float intensity = 0.5 + 0.5 * sin(fractalValue * 20.0 + u_time * u_animationSpeed * 2.0);
        color *= intensity;
        
        gl_FragColor = vec4(color, 1.0);
    }
}