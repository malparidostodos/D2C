import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D u_texture;
  uniform vec2 u_mouse;
  uniform vec2 u_prevMouse;

  void main() {
    vec2 gridUV = floor(vUv * vec2(40.0, 40.0)) / vec2(40.0, 40.0);
    vec2 centerOfPixel = gridUV + vec2(1.0/40.0, 1.0/40.0);

    vec2 mouseDirection = u_mouse - u_prevMouse;

    vec2 pixelToMouseDirection = centerOfPixel - u_mouse;
    float pixelDistanceToMouse = length(pixelToMouseDirection);
    float strength = smoothstep(0.3, 0.0, pixelDistanceToMouse);

    vec2 uvOffset = strength * -mouseDirection * 0.4;
    vec2 uv = vUv - uvOffset;

    vec4 color = texture2D(u_texture, uv);
    gl_FragColor = color;
  }
`;

const PixelatedHoverText = ({ text = "NUVEN" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scene, camera, renderer, planeMesh;
    let easeFactor = 0.02;
    let mousePosition = { x: 0.5, y: 0.5 };
    let targetMousePosition = { x: 0.5, y: 0.5 };
    let prevPosition = { x: 0.5, y: 0.5 };
    let animationFrameId;

    const createTextTexture = (text, font, size, color, fontWeight = "100") => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const canvasWidth = window.innerWidth * 2; // Increase resolution
      const canvasHeight = window.innerHeight * 2;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.fillStyle = color || "#ffffff";
      // Use transparent background if needed, but the shard uses the texture color directly.
      // The reference implementation fills with white background.
      ctx.fillStyle = "rgba(255, 255, 255, 0)";
      // Actually, reference uses white background: ctx.fillStyle = color || "#ffffff"; ctx.fillRect(...)
      // But we probably want it to blend with our footer background which is white.
      // Let's stick to reference logic but ensure colors match our theme.

      // Our footer background is white, text is #0046b8.
      // Reference: background #ffffff, text #1a1a1a.
      // We want background transparent or white?
      // Since it's a shader on a plane, transparency might be tricky if not handled.
      // Let's use white background to match footer locally.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fontSize = size || Math.floor(canvasWidth * 1.5); // Adjusted scale

      ctx.fillStyle = "#0046b8"; // Footer blue
      // Font Poppins
      ctx.font = `${fontWeight} ${fontSize}px "Poppins", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;

      const scaleFactor = Math.min(1, (canvasWidth * 0.8) / textWidth); // Fit within width with padding
      const aspectCorrection = canvasWidth / canvasHeight;

      ctx.setTransform(
        scaleFactor,
        0,
        0,
        scaleFactor / aspectCorrection,
        canvasWidth / 2,
        canvasHeight / 2
      );

      ctx.strokeStyle = "#0046b8";
      ctx.lineWidth = fontSize * 0.005;
      for (let i = 0; i < 3; i++) {
        ctx.strokeText(text, 0, 0);
      }
      ctx.fillText(text, 0, 0);

      const texture = new THREE.CanvasTexture(canvas);

      // Important to avoid black borders or artifacts
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      return texture;
    };

    const initializeScene = (texture) => {
      // Cleanup previous if exists?
      // In React strict mode, mount/unmount happens. We should handle cleanup in return.

      scene = new THREE.Scene();

      const aspectRatio = container.offsetWidth / container.offsetHeight;
      camera = new THREE.OrthographicCamera(
        -1,
        1,
        1 / aspectRatio,
        -1 / aspectRatio,
        0.1,
        1000
      );
      camera.position.z = 1;

      let shaderUniforms = {
        u_mouse: { type: "v2", value: new THREE.Vector2(0.5, 0.5) },
        u_prevMouse: { type: "v2", value: new THREE.Vector2(0.5, 0.5) },
        u_texture: { type: "t", value: texture },
      };

      planeMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({
          uniforms: shaderUniforms,
          vertexShader,
          fragmentShader,
        })
      );

      scene.add(planeMesh);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setClearColor(0xffffff, 1); // White background
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      renderer.setPixelRatio(window.devicePixelRatio);

      container.innerHTML = ''; // Clear container
      container.appendChild(renderer.domElement);
    };

    const init = () => {
      const texture = createTextTexture(text, "Poppins", null, "#ffffff", "700");
      initializeScene(texture);
    }

    init();

    const animateScene = () => {
      animationFrameId = requestAnimationFrame(animateScene);

      mousePosition.x += (targetMousePosition.x - mousePosition.x) * easeFactor;
      mousePosition.y += (targetMousePosition.y - mousePosition.y) * easeFactor;

      if (planeMesh && planeMesh.material.uniforms) {
        planeMesh.material.uniforms.u_mouse.value.set(
          mousePosition.x,
          1.0 - mousePosition.y
        );

        planeMesh.material.uniforms.u_prevMouse.value.set(
          prevPosition.x,
          1.0 - prevPosition.y
        );
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    animateScene();

    const handleMouseMove = (event) => {
      easeFactor = 0.035;
      const rect = container.getBoundingClientRect();
      prevPosition = { ...targetMousePosition };

      targetMousePosition.x = (event.clientX - rect.left) / rect.width;
      targetMousePosition.y = (event.clientY - rect.top) / rect.height;
    };

    const handleMouseEnter = (event) => {
      easeFactor = 0.01;
      const rect = container.getBoundingClientRect();

      mousePosition.x = targetMousePosition.x =
        (event.clientX - rect.left) / rect.width;
      mousePosition.y = targetMousePosition.y =
        (event.clientY - rect.top) / rect.height;
    };

    const handleMouseLeave = () => {
      easeFactor = 0.01;
      targetMousePosition = { ...prevPosition };
    };

    const onWindowResize = () => {
      if (!container || !renderer || !camera || !planeMesh) return;

      const aspectRatio = container.offsetWidth / container.offsetHeight;
      camera.left = -1;
      camera.right = 1;
      camera.top = 1 / aspectRatio;
      camera.bottom = -1 / aspectRatio;
      camera.updateProjectionMatrix();

      renderer.setSize(container.offsetWidth, container.offsetHeight);

      // Reload texture
      const newTexture = createTextTexture(text, "Poppins", null, "#ffffff", "700");
      planeMesh.material.uniforms.u_texture.value = newTexture;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", onWindowResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", onWindowResize);

      if (renderer) {
        renderer.dispose();
      }
      if (scene) {
        scene.clear();
      }
    };
  }, [text]);

  return <div ref={containerRef} className="w-full h-full absolute inset-0" />;
};

export default PixelatedHoverText;
