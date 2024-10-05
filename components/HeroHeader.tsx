import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform sampler2D u_texture;
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
    vec2 uv = vUv - 0.5;
    uv.x *= u_resolution.x / u_resolution.y;

    float t = 0.001 * u_time;
    
    vec2 mouse = u_mouse;
    float distToMouse = length(vUv - mouse);
    float p = 0.5 + 0.5 * (1.0 - smoothstep(0.0, 0.5, distToMouse));

    float noise = neuro_shape(uv, t, p);

    noise = 1.2 * pow(noise, 3.);
    noise += pow(noise, 10.);
    noise = max(0.0, noise - 0.5);
    noise *= (1.0 - length(vUv - 0.5));

    vec3 color = normalize(vec3(0.2, 0.5 + 0.4 * cos(3.0 * t), 0.5 + 0.5 * sin(3.0 * t)));
    color = color * noise;

    vec4 textColor = texture2D(u_texture, vUv);
    gl_FragColor = vec4(mix(textColor.rgb, color, noise), 1.0);
  }
`;

const HeroHeader: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mousePosition, setMousePosition] = useState<THREE.Vector2>(new THREE.Vector2(0.5, 0.5));

    useEffect(() => {
        if (!canvasRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
        camera.position.z = 1;
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });

        // Create a texture with the text
        const textCanvas = document.createElement('canvas');
        const textCtx = textCanvas.getContext('2d')!;
        const updateTextTexture = () => {
            const { width, height } = canvasRef.current!.getBoundingClientRect();
            textCanvas.width = width;
            textCanvas.height = height;
            textCtx.fillStyle = '#151912';
            textCtx.fillRect(0, 0, width, height);
            textCtx.fillStyle = 'white';
            textCtx.font = `bold ${height / 10}px serif`;
            textCtx.textAlign = 'center';
            textCtx.textBaseline = 'middle';
            textCtx.fillText("Vang's Vital Insights", width / 2, height / 2);
        };
        updateTextTexture();
        const textTexture = new THREE.CanvasTexture(textCanvas);
        textTexture.minFilter = THREE.LinearFilter;
        textTexture.magFilter = THREE.LinearFilter;

        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                u_time: { value: 0 },
                u_resolution: { value: new THREE.Vector2() },
                u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
                u_texture: { value: textTexture },
            },
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const resizeCanvas = () => {
            const { clientWidth, clientHeight } = canvasRef.current!;
            renderer.setSize(clientWidth, clientHeight, false);
            material.uniforms.u_resolution.value.set(clientWidth, clientHeight);
            updateTextTexture();
            textTexture.needsUpdate = true;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvasRef.current!.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            setMousePosition(new THREE.Vector2(
                x / rect.width,
                1 - y / rect.height // Invert Y-axis
            ));
        };

        canvasRef.current.addEventListener('mousemove', handleMouseMove);

        const animate = (time: number) => {
            material.uniforms.u_time.value = time;
            material.uniforms.u_mouse.value.copy(mousePosition);
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            canvasRef.current?.removeEventListener('mousemove', handleMouseMove);
            renderer.dispose();
        };
    }, [mousePosition]);

    return (
        <div className="w-full h-screen bg-[#151912]">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
};

export default HeroHeader;