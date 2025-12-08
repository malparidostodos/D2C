import { useEffect, useRef, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import * as THREE from "three";
import { vertexShader, fluidShader, displayShader } from "./shaders.js";
import "./InteractiveGradient.css";
import { useSmoothScroll } from "../SmoothScroll";

// Auth Colors (Premium Dark Theme)
const authColors = {
    color1: "#000000", // Deepest Black
    color2: "#143464ff", // Dark Navy
    color3: "#1e3a8a", // Navy
    color4: "#7b90caff", // Dark Blue Accent
};

const InteractiveGradient = ({
    brushSize = 25.0,
    brushStrength = 0.5,
    distortionAmount = 2.5,
    fluidDecay = 0.98,
    trailLength = 0.8,
    stopDecay = 0.85,
    color1 = "#b8cbffff",
    color2 = "#3f62a3ff",
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
    const { lenis } = useSmoothScroll();

    // Check if we are on the home page or auth pages
    // Normalize path to handle potential trailing slashes (e.g., "/en/")
    const normalizedPath = location.pathname.endsWith('/') && location.pathname.length > 1
        ? location.pathname.slice(0, -1)
        : location.pathname;

    const isHomePage = normalizedPath === "/" || normalizedPath === "/en" || normalizedPath === "/inicio" || normalizedPath === "/en/inicio";
    const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password'].some(path => location.pathname.includes(path));
    const shouldRender = isHomePage || isAuthPage;

    const isHomePageRef = useRef(shouldRender);

    // Initial scroll check (only relevant for Home, auth pages are always visible)
    const [isScrollVisible, setIsScrollVisible] = useState(true);

    const currentColors = useMemo(() => {
        return isAuthPage ? authColors : { color1, color2, color3, color4 };
    }, [isAuthPage, color1, color2, color3, color4]);

    useEffect(() => {
        isHomePageRef.current = shouldRender;
        // Reset scroll visibility check on location change
        if (shouldRender) {
            // Optimistically set visible to ensure entry animation. 
            // The scroll event listener will correct this if we are actually scrolled down.
            setIsScrollVisible(true);
        }
    }, [location, shouldRender, isAuthPage]);

    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return [r, g, b];
    };

    useEffect(() => {
        if (!shouldRender) return;

        if (!canvasRef.current) return;

        while (canvasRef.current.firstChild) {
            canvasRef.current.removeChild(canvasRef.current.firstChild);
        }

        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        // OPTIMIZATION: Disable antialias (not needed for fluids), high-performance mode, medium precision
        const renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: true,
            powerPreference: "high-performance",
            precision: "mediump",
            depth: false,
            stencil: false
        });
        rendererRef.current = renderer;

        renderer.setSize(window.innerWidth, window.innerHeight);
        // Force pixel ratio to 1 for performance (retina screens kill texturing performance)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        canvasRef.current.appendChild(renderer.domElement);

        // OPTIMIZATION: Run simulation at lower resolution
        const simScale = 0.5;
        const simWidth = Math.floor(window.innerWidth * simScale);
        const simHeight = Math.floor(window.innerHeight * simScale);

        const fluidTarget1 = new THREE.WebGLRenderTarget(
            simWidth,
            simHeight,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.HalfFloatType, // Optimization: Use HalfFloat if supported
            }
        );

        const fluidTarget2 = new THREE.WebGLRenderTarget(
            simWidth,
            simHeight,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                type: THREE.HalfFloatType,
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
            if (!isHomePageRef.current) return;
            if (!canvasRef.current) return;

            const target = e.target;
            const isInteractive = target.closest('button') ||
                target.closest('a') ||
                target.closest('._navbar') ||
                target.closest('.interactive-hover');

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
            displayMaterial.uniforms.uColor1.value.set(...hexToRgb(currentColors.color1));
            displayMaterial.uniforms.uColor2.value.set(...hexToRgb(currentColors.color2));
            displayMaterial.uniforms.uColor3.value.set(...hexToRgb(currentColors.color3));
            displayMaterial.uniforms.uColor4.value.set(...hexToRgb(currentColors.color4));

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

            // OPTIMIZATION: Check window scroll directly
            // Only continue animation if shouldRender (Home or Auth) AND (Auth Page OR near top of Home)
            const shouldAnimate = isHomePageRef.current && (isAuthPage ? true : window.scrollY < window.innerHeight + 100);

            if (shouldAnimate) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
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
        shouldRender, // ADDED: Re-init when shouldRender changes
        colorIntensity,
        softness,
        currentColors // Re-init if colors change
    ]);

    // Scroll handler to update visibility state and restart animation
    useEffect(() => {
        const handleScroll = (e) => {
            // Support both lenis event object and native window fallback
            const currentScrollY = e && typeof e.scroll === 'number' ? e.scroll : window.scrollY;

            if (isAuthPage) {
                setIsScrollVisible(true);
                return;
            }
            const isVisible = currentScrollY <= window.innerHeight;
            setIsScrollVisible(isVisible);

            // Restart animation if we just became visible and allowed to render
            if (isVisible && isHomePageRef.current && !animationRef.current && animationLoopRef.current) {
                animationLoopRef.current();
            }
        };

        // Initial check
        handleScroll();

        // Add a small delay check to handle ScrollToTop race condition
        const checkTimer = setTimeout(() => {
            handleScroll({ scroll: window.scrollY });
        }, 100);

        window.addEventListener('scroll', handleScroll, { passive: true });

        if (lenis) {
            lenis.on('scroll', handleScroll);
        }

        return () => {
            clearTimeout(checkTimer);
            window.removeEventListener('scroll', handleScroll);
            if (lenis) {
                lenis.off('scroll', handleScroll);
            }
        };
    }, [lenis, isAuthPage, location.pathname]);

    // Ensure animation restarts if we navigate back
    useEffect(() => {
        if (shouldRender && isScrollVisible) {
            if (!animationRef.current && animationLoopRef.current) {
                animationLoopRef.current();
            }
        }
    }, [shouldRender, isScrollVisible, location.pathname]);

    return (
        <div
            ref={canvasRef}
            className="gradient-canvas"
            style={{
                opacity: shouldRender && isScrollVisible ? 1 : 0,
                // visibility: shouldRender && isScrollVisible ? 'visible' : 'hidden',
                pointerEvents: shouldRender && isScrollVisible ? 'auto' : 'none',
                transition: 'opacity 0.6s ease',
                // Delay hiding when leaving valid pages so curtain has time to cover
                transitionDelay: !shouldRender ? '0.6s' : '0s'
            }}
        />
    );
};

export default InteractiveGradient;
