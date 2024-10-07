import React, { useRef, useEffect, useState, useContext } from 'react';
import * as THREE from 'three';
import styles from './HeroHeader.module.css';
import { DarkModeContext } from '@/lib/use-dark-mode';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_pointer_position;
  uniform float u_scroll_progress;
  varying vec2 vUv;

  vec2 rotate(vec2 uv, float th) {
    return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
  }

  float neuro_shape(vec2 uv, float t, float p) {
    vec2 sine_acc = vec2(0.);
    vec2 res = vec2(0.);
    float scale = 8.;

    for (int j = 0; j < 15; j++) {
      uv = rotate(uv, 1.);
      sine_acc = rotate(sine_acc, 1.);
      vec2 layer = uv * scale + float(j) + sine_acc - t;
      sine_acc += sin(layer);
      res += (.5 + .5 * cos(layer)) / scale;
      scale *= (1.2 - .07 * p);
    }
    return res.x + res.y;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = u_resolution.x / u_resolution.y;
    uv.x *= aspect;

    // Zoom factor (adjust this value to control the zoom level)
    float zoom = 0.5;
    
    // Center the UV coordinates
    uv = (uv - 0.5) * zoom + 0.5;

    float t = 0.001 * u_time;
    
    vec2 mouse = u_pointer_position;
    mouse.x *= aspect;
    // Adjust mouse position for zoom
    mouse = (mouse - 0.5) * zoom + 0.5;
    
    float distToMouse = length(uv - mouse);
    float p = 0.5 + 0.5 * (1.0 - smoothstep(0.0, 0.5, distToMouse));

    float noise = neuro_shape(uv, t, p);

    noise = 1.2 * pow(noise, 3.);
    noise += pow(noise, 10.);
    noise = max(0.0, noise - 0.5);
    noise *= (1.0 - length(vUv - 0.5));

    vec3 color = normalize(vec3(0.2, 0.5 + 0.4 * cos(3.0 * t), 0.5 + 0.5 * sin(3.0 * t)));
    color = color * noise;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const HeroHeader: React.FC<{ className?: string }> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDarkMode } = useContext(DarkModeContext) || { isDarkMode: false };
  const [mousePosition, setMousePosition] = useState<THREE.Vector2>(new THREE.Vector2(0.5, 0.5));
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) {
      console.warn('Container or canvas ref is null');
      return;
    }

    let animationFrameId: number;

    try {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
      rendererRef.current = renderer;

      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          u_time: { value: 0 },
          u_resolution: { value: new THREE.Vector2() },
          u_pointer_position: { value: new THREE.Vector2(0.5, 0.5) },
          u_scroll_progress: { value: 0 },
        },
      });
      materialRef.current = material;

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const resizeCanvas = () => {
        if (!containerRef.current || !renderer || !material) return;
        const { clientWidth, clientHeight } = containerRef.current;
        const devicePixelRatio = Math.min(window.devicePixelRatio, 2);

        renderer.setSize(clientWidth, clientHeight);
        renderer.setPixelRatio(devicePixelRatio);

        material.uniforms.u_resolution.value.set(clientWidth * devicePixelRatio, clientHeight * devicePixelRatio);
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      const handleMouseMove = (event: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setMousePosition(new THREE.Vector2(
          x / rect.width,
          1 - y / rect.height // Invert Y-axis
        ));
      };

      const handleScroll = () => {
        if (material) {
          material.uniforms.u_scroll_progress.value = window.pageYOffset / (2 * window.innerHeight);
        }
      };

      containerRef.current.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('scroll', handleScroll);

      const animate = (time: number) => {
        if (!material || !renderer || !scene || !camera) {
          console.warn('Missing required objects for animation');
          return;
        }
        try {
          material.uniforms.u_time.value = time;
          material.uniforms.u_pointer_position.value.copy(mousePosition);
          renderer.render(scene, camera);
          animationFrameId = requestAnimationFrame(animate);
        } catch (error) {
          console.error('Error in animation loop:', error);
        }
      };

      animationFrameId = requestAnimationFrame(animate);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        containerRef.current?.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
        cancelAnimationFrame(animationFrameId);
        renderer.dispose();
      };
    } catch (error) {
      console.error('Error in HeroHeader setup:', error);
    }
  }, [mousePosition, isDarkMode]);

  return (
    <div
      ref={containerRef}
      className={`${styles.heroHeader} ${isDarkMode ? styles.heroHeaderDark : styles.heroHeaderLight
        } ${className || ''}`}
    >
      <canvas ref={canvasRef} className={styles.heroCanvas} />
    </div>
  );
};

export default HeroHeader;