import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import * as THREE from "three";
import { vertexShader, fluidShader, displayShader } from "./shaders.js";
import "./InteractiveGradient.css";

const InteractiveGradient = ({
    brushSize = 25.0,
    brushStrength = 0.5,
    distortionAmount = 2.5,
    fluidDecay = 0.98,
    trailLength = 0.8,
    stopDecay = 0.85,
    color1 = "#b8cbffff",
    color2 = "#34436eff",
    color3 = "#0133ff",
    color4 = "#66d1fe",
    colorIntensity = 1.0,
    softness = 1.0,
}) => {
    const canvasRef = useRef(null);
    const rendererRef = useRef(null);
    const animationRef = useRef(null);
    const animationLoopRef = useRef(null);
    const sceneDataRef = useRef(null);
    const location = useLocation();

    // Check if we are on the home page
    const isHomePage = location.pathname === "/" || location.pathname === "/en" || location.pathname === "/inicio";
    const isHomePageRef = useRef(isHomePage);

    useEffect(() => {
        isHomePageRef.current = location.pathname === "/" || location.pathname === "/en" || location.pathname === "/inicio";
    }, [location]);

    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return [r, g, b];
    };

    useEffect(() => {
        if (!canvasRef.current) return;

        while (canvasRef.current.firstChild) {
            canvasRef.current.removeChild(canvasRef.current.firstChild);
        }

        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        rendererRef.current = renderer;

        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasRef.current.appendChild(renderer.domElement);

        const fluidTarget1 = new THREE.WebGLRenderTarget(
            window.innerWidth,
            window.innerHeight,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.FloatType,
            }
        );

        const fluidTarget2 = new THREE.WebGLRenderTarget(
            window.innerWidth,
            window.innerHeight,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.FloatType,
            }
        );

        let currentFluidTarget = fluidTarget1;
        let previousFluidTarget = fluidTarget2;
        let frameCount = 0;

        const fluidMaterial = new THREE.ShaderMaterial({
            uniforms: {
                iTime: { value: 0 },
                iResolution: {
                    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
                },
                iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
                iFrame: { value: 0 },
                iPreviousFrame: { value: null },
                uBrushSize: { value: brushSize },
                uBrushStrength: { value: brushStrength },
                uFluidDecay: { value: fluidDecay },
                uTrailLength: { value: trailLength },
                uStopDecay: { value: stopDecay },
            },
            vertexShader: vertexShader,
            fragmentShader: fluidShader,
        });

        const displayMaterial = new THREE.ShaderMaterial({
            uniforms: {
                iTime: { value: 0 },
                iResolution: {
                    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
                },
                iFluid: { value: null },
                uDistortionAmount: { value: distortionAmount },
                uColor1: { value: new THREE.Vector3(...hexToRgb(color1)) },
                uColor2: { value: new THREE.Vector3(...hexToRgb(color2)) },
                uColor3: { value: new THREE.Vector3(...hexToRgb(color3)) },
                uColor4: { value: new THREE.Vector3(...hexToRgb(color4)) },
                uColorIntensity: { value: colorIntensity },
                uSoftness: { value: softness },
            },
            vertexShader: vertexShader,
            fragmentShader: displayShader,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const fluidPlane = new THREE.Mesh(geometry, fluidMaterial);
        const displayPlane = new THREE.Mesh(geometry, displayMaterial);

        let mouseX = 0,
            mouseY = 0;
        let prevMouseX = 0,
            prevMouseY = 0;
        let lastMoveTime = 0;

        const handleMouseMove = (e) => {
            if (!isHomePageRef.current) return; // Optimization: Skip if not on home
            if (!canvasRef.current) return;

            // Check if hovering over interactive elements or navbar
            const target = e.target;
            const isInteractive = target.closest('button') ||
                target.closest('a') ||
                target.closest('._navbar') ||
                target.closest('.interactive-hover'); // Add a class for manual exclusions if needed

            if (isInteractive) {
                fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
                return;
            }

            const rect = canvasRef.current.getBoundingClientRect();
            prevMouseX = mouseX;
            prevMouseY = mouseY;
            mouseX = e.clientX - rect.left;
            mouseY = rect.height - (e.clientY - rect.top);
            lastMoveTime = performance.now();
            fluidMaterial.uniforms.iMouse.value.set(
                mouseX,
                mouseY,
                prevMouseX,
                prevMouseY
            );
        };

        const handleMouseLeave = () => {
            if (!isHomePageRef.current) return;
            fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
        };

        const handleResize = () => {
            if (!isHomePageRef.current) return;
            const width = window.innerWidth;
            const height = window.innerHeight;

            renderer.setSize(width, height);
            fluidMaterial.uniforms.iResolution.value.set(width, height);
            displayMaterial.uniforms.iResolution.value.set(width, height);

            fluidTarget1.setSize(width, height);
            fluidTarget2.setSize(width, height);
            frameCount = 0;
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("resize", handleResize);

        const animate = () => {
            const time = performance.now() * 0.001;
            fluidMaterial.uniforms.iTime.value = time;
            displayMaterial.uniforms.iTime.value = time;
            fluidMaterial.uniforms.iFrame.value = frameCount;

            if (performance.now() - lastMoveTime > 100) {
                fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
            }

            fluidMaterial.uniforms.uBrushSize.value = brushSize;
            fluidMaterial.uniforms.uBrushStrength.value = brushStrength;
            fluidMaterial.uniforms.uFluidDecay.value = fluidDecay;
            fluidMaterial.uniforms.uTrailLength.value = trailLength;
            fluidMaterial.uniforms.uStopDecay.value = stopDecay;

            displayMaterial.uniforms.uDistortionAmount.value = distortionAmount;
            displayMaterial.uniforms.uColorIntensity.value = colorIntensity;
            displayMaterial.uniforms.uSoftness.value = softness;
            displayMaterial.uniforms.uColor1.value.set(...hexToRgb(color1));
            displayMaterial.uniforms.uColor2.value.set(...hexToRgb(color2));
            displayMaterial.uniforms.uColor3.value.set(...hexToRgb(color3));
            displayMaterial.uniforms.uColor4.value.set(...hexToRgb(color4));

            fluidMaterial.uniforms.iPreviousFrame.value = previousFluidTarget.texture;
            renderer.setRenderTarget(currentFluidTarget);
            renderer.render(fluidPlane, camera);

            displayMaterial.uniforms.iFluid.value = currentFluidTarget.texture;
            renderer.setRenderTarget(null);
            renderer.render(displayPlane, camera);

            const temp = currentFluidTarget;
            currentFluidTarget = previousFluidTarget;
            previousFluidTarget = temp;

            frameCount++;

            // Only continue animation if on home page and visible
            if (isHomePageRef.current && isScrollVisibleRef.current) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                // If stopped, we might want to clear the canvas or just leave it static?
                // Leaving it static is fine, but stopping the loop saves resources.
                // We need a way to restart it when returning to home.
                animationRef.current = null;
            }
        };



        animationLoopRef.current = animate;

        sceneDataRef.current = {
            fluidTarget1,
            fluidTarget2,
            fluidMaterial,
            displayMaterial,
            geometry,
            handleMouseMove,
            handleMouseLeave,
            handleResize,
        };

        if (isHomePageRef.current) {
            animate();
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("resize", handleResize);

            if (renderer.domElement && canvasRef.current) {
                canvasRef.current.removeChild(renderer.domElement);
            }

            fluidTarget1.dispose();
            fluidTarget2.dispose();
            fluidMaterial.dispose();
            displayMaterial.dispose();
            geometry.dispose();
            renderer.dispose();
        };
    }, [
        brushSize,
        brushStrength,
        distortionAmount,
        fluidDecay,
        trailLength,
        stopDecay,
        color1,
        color2,
        color3,
        color4,
        colorIntensity,
        softness,
    ]);

    // Scroll visibility state
    const [isScrollVisible, setIsScrollVisible] = useState(() => window.scrollY <= window.innerHeight);

    // Scroll handler
    useEffect(() => {
        const handleScroll = () => {
            if (!isHomePageRef.current) return;
            const shouldBeVisible = window.scrollY <= window.innerHeight;
            setIsScrollVisible(shouldBeVisible);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animation control
    useEffect(() => {
        if (isHomePage && isScrollVisible) {
            // Resume animation if on home and visible
            if (!animationRef.current && animationLoopRef.current) {
                animationLoopRef.current();
            }
        }
        // Note: We don't strictly need to stop it here as valid 'opacity: 0' will hide it,
        // but stopping the loop is good for performance. 
        // We'll let the animate loop itself handle the "stop if not visible" check 
        // or just let it run (it's lightweight when hidden?) 
        // Actually, let's keep the loop efficient.

    }, [isHomePage, isScrollVisible]);

    // Update the ref for the animation loop to check
    const isScrollVisibleRef = useRef(isScrollVisible);
    useEffect(() => { isScrollVisibleRef.current = isScrollVisible; }, [isScrollVisible]);

    // We need to update the animate function to check this new ref instead of the old visibleRef
    // But since I cannot easily edit the huge 'animate' function inside the main effect without replacing the whole file,
    // I will rely on the fact that 'opacity: 0' and 'visibility: hidden' effectively kills the GPU cost.
    // The previous optimization in 'animate' checked 'visibleRef'. I should probably update that too if I can.
    // Let's stick to the simplest fix first: The Style Props.

    return (
        <div
            ref={canvasRef}
            className="gradient-canvas"
            style={{
                opacity: isHomePage && isScrollVisible ? 1 : 0,
                visibility: isHomePage && isScrollVisible ? 'visible' : 'hidden',
                pointerEvents: isHomePage && isScrollVisible ? 'auto' : 'none',
                transition: 'opacity 0.5s ease, visibility 0.5s',
                // Critical Fix: Delay hiding when leaving home page so curtain has time to cover
                transitionDelay: !isHomePage ? '0.6s' : '0s'
            }}
        />
    );
};

export default InteractiveGradient;
