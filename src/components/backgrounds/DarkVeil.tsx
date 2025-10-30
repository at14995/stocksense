import { useRef, useEffect } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2 } from "ogl";

// Temporary simplified fragment for testing
const vertex = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const testFragment = `
precision mediump float;
uniform vec2 uResolution;
void main() {
  vec2 st = gl_FragCoord.xy / uResolution.xy;
  gl_FragColor = vec4(st.x, st.y, 0.5, 1.0); // gradient output
}`;

export default function DarkVeilDiagnostic() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const parent = canvas.parentElement as HTMLElement;

    console.log("DarkVeil Diagnostic: Canvas initialized");

    // Step 1: Setup transparent WebGL renderer
    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      canvas,
      alpha: true,
      antialias: true,
    });

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    console.log("GL Context created:", gl);

    const geometry = new Triangle(gl);

    // Step 2: Simple program that must produce a colored gradient
    const program = new Program(gl, {
      vertex,
      fragment: testFragment,
      uniforms: { uResolution: { value: new Vec2() } },
    });

    const mesh = new Mesh(gl, { geometry, program });

    // Step 3: Proper viewport resize
    const resize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value.set(w, h);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      console.log("Canvas resized:", w, h);
    };

    window.addEventListener("resize", resize);
    resize();

    // Step 4: Render once
    renderer.render({ scene: mesh });
    console.log("Rendered test frame.");

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full block -z-10"
      style={{ background: "transparent" }}
    />
  );
}
