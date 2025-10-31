'use client';
import { useRef, useEffect } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2 } from "ogl";

const vertex = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragment = `
precision mediump float;
uniform vec2 uResolution;
uniform float uTime;

void main() {
  vec2 st = gl_FragCoord.xy / uResolution.xy;
  float r = 0.5 + 0.5 * sin(uTime + st.x * 6.2831);
  float g = 0.5 + 0.5 * sin(uTime + st.y * 6.2831);
  float b = 0.5 + 0.5 * sin(uTime);
  gl_FragColor = vec4(r, g, b, 1.0);
}
`;

export default function DarkVeil() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const parent = canvas.parentElement as HTMLElement;

    // --- Create renderer
    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      canvas,
      alpha: true,
      antialias: true,
    });

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0); // transparent background

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uResolution: { value: new Vec2() },
        uTime: { value: 0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    // --- Resize handler
    const resize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value.set(w, h);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };
    window.addEventListener("resize", resize);
    resize();

    // --- Animation loop
    const start = performance.now();
    let frame: number;
    const animate = () => {
      program.uniforms.uTime.value = (performance.now() - start) / 1000;
      renderer.render({ scene: mesh });
      frame = requestAnimationFrame(animate);
    };
    
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
      } else {
        animate();
      }
    });

    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full block -z-10"
      style={{ background: "transparent" }}
    />
  );
}
