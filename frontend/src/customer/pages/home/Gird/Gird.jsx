import React, { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { grid as fallbackGrid } from "../../../../data/homeCategories";
import { logo } from "../../../json/common";
import { useAppSelector } from "../../../../Redux Toolkit/store";

// ✅ Vertex Shader
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// 🌊 Liquid Wave + Zoom Fragment Shader
const fragmentShader = `
  varying vec2 vUv;

  uniform sampler2D texture1;
  uniform sampler2D texture2;
  uniform float progress;
  uniform vec2 resolution;
  uniform vec2 imageResolution;

  vec2 getCoverUv(vec2 uv) {
    vec2 ratio = vec2(
      min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),
      min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)
    );
    return vec2(
      uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
  }

  void main() {
    vec2 uv = getCoverUv(vUv);

    float p = smoothstep(0.0, 1.0, progress);

    // 👑 Vertical silk motion
    vec2 uv1 = uv + vec2(0.0, p * 0.05);
    vec2 uv2 = uv - vec2(0.0, (1.0 - p) * 0.05);

    // 👑 Elegant zoom (depth feel)
    float scale1 = 1.0 + p * 0.08;
    float scale2 = 1.08 - p * 0.08;

    vec2 center = vec2(0.5);

    uv1 = (uv1 - center) / scale1 + center;
    uv2 = (uv2 - center) / scale2 + center;

    vec4 tex1 = texture2D(texture1, uv1);
    vec4 tex2 = texture2D(texture2, uv2);

    // 👑 ultra smooth blend
    gl_FragColor = mix(tex1, tex2, p);
  }
`;

const Grid = () => {
  const containerRef = useRef(null);
  const apiRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const reduxGridData = useAppSelector(
    (store) => store.homeCategory?.homeCategories?.grid || [],
  );

  const grid = reduxGridData.length > 0 ? reduxGridData : fallbackGrid;

  const getOptimizedImage = (url) => {
    if (!url) return "";
    const base = url.split("?")[0];
    const dpr = window.devicePixelRatio || 1;
    const width = Math.min(window.innerWidth * dpr, 2000);
    return `${base}?w=${width}&q=80&auto=format&fit=crop`;
  };

  // ✅ FIXED dependency
  const normalizedGrid = useMemo(() => {
    return grid.map((item) => ({
      title: item.name,
      image: getOptimizedImage(item.image.desktop),
    }));
  }, [grid]);

  useEffect(() => {
    if (!containerRef.current || normalizedGrid.length === 0) return;

    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    let loaded = 0;

    const textures = normalizedGrid.map((item) =>
      loader.load(item.image, (tex) => {
        tex.minFilter = THREE.LinearFilter;

        loaded++;
        if (loaded === normalizedGrid.length) {
          setIsReady(true);
        }
      }),
    );

    const material = new THREE.ShaderMaterial({
      uniforms: {
        texture1: { value: textures[0] },
        texture2: { value: textures[1] || textures[0] },
        progress: { value: 0 },
        direction: { value: 1 },
        resolution: {
          value: new THREE.Vector2(
            container.offsetWidth,
            container.offsetHeight,
          ),
        },
        imageResolution: {
          value: new THREE.Vector2(1600, 900),
        },
      },
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const resize = () => {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      material.uniforms.resolution.value.set(
        container.offsetWidth,
        container.offsetHeight,
      );
    };

    window.addEventListener("resize", resize);

    let current = 0;
    let next = 1;
    let progress = 0;
    let target = 0;
    let direction = 1;

    apiRef.current = {
      next: () => {
        if (target !== 0) return;

        direction = 1;
        next = (current + 1) % normalizedGrid.length;

        material.uniforms.texture2.value = textures[next];
        material.uniforms.direction.value = direction;

        target = 1;
        setActiveIndex(next);
      },
      prev: () => {
        if (target !== 0) return;

        direction = -1;
        next = (current - 1 + normalizedGrid.length) % normalizedGrid.length;

        material.uniforms.texture2.value = textures[next];
        material.uniforms.direction.value = direction;

        target = 1;
        setActiveIndex(next);
      },
    };

    // 🔥 Auto Play
    const autoPlay = setInterval(() => {
      apiRef.current?.next();
    }, 5000);

    let raf;
    const animate = () => {
      progress += (target - progress) * 0.06;
      material.uniforms.progress.value = progress;

      if (progress > 0.99 && target === 1) {
        current = next;
        material.uniforms.texture1.value = textures[current];
        progress = 0;
        target = 0;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      clearInterval(autoPlay);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
      textures.forEach((t) => t.dispose());
    };
  }, [normalizedGrid]);

  return (
    <div className="relative w-full h-[70vh] bg-black overflow-hidden rounded-3xl">
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          Loading Experience...
        </div>
      )}

      <div ref={containerRef} className="absolute inset-0" />

      {/* UI */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 text-white z-10">
        <div className="relative h-[260px] md:h-[320px] overflow-hidden">
          {normalizedGrid.map((item, i) => {
            const isActive = i === activeIndex;

            return (
              <div
                key={i}
                className="absolute inset-0 flex flex-col justify-center"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: `translateY(${isActive ? 0 : 20}px)`,
                  transition: "all 900ms cubic-bezier(0.25,1,0.5,1)",
                }}
              >
                {/* TITLE */}
                <h1
                  style={{
                    transform: `translateY(${isActive ? 0 : 40}px)`,
                    opacity: isActive ? 1 : 0,
                    transition: "all 1000ms cubic-bezier(0.25,1,0.5,1)",
                  }}
                  className="text-4xl sm:text-6xl brand lg:text-[90px] font-black leading-[0.9]"
                >
                  {item.title}
                </h1>

                {/* DESCRIPTION */}
                <p
                  style={{
                    transform: `translateY(${isActive ? 0 : 30}px)`,
                    opacity: isActive ? 1 : 0,
                    transition: "all 1100ms cubic-bezier(0.25,1,0.5,1)",
                  }}
                  className="mt-6 text-white/70 max-w-md text-sm md:text-lg"
                >
                  Discover premium curated fashion pieces crafted with elegance
                  and modern luxury.
                </p>

                {/* BUTTON */}
                <button
                  style={{
                    transform: `translateY(${isActive ? 0 : 20}px) scale(${
                      isActive ? 1 : 0.95
                    })`,
                    opacity: isActive ? 1 : 0,
                    transition: "all 1200ms cubic-bezier(0.25,1,0.5,1)",
                  }}
                  className="mt-8 px-6 py-3 w-32 bg-white text-black text-xs tracking-widest uppercase rounded-full"
                >
                  Explore Collection
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between">
          <button onClick={() => apiRef.current?.prev()}>
            <ArrowLeft />
          </button>
          <button onClick={() => apiRef.current?.next()}>
            <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Grid;
