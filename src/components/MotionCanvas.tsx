import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MotionConfig, Particle, Ripple } from '../types.ts';
import { COLOR_PALETTES } from '../data/presets.ts';
import { audioEngine } from '../utils/audioSynthesizer.ts';

interface MotionCanvasProps {
  config: MotionConfig;
  isPlaying: boolean;
  playbackSpeed: number;
  currentTime: number; // 0 to 6 seconds loop
  onTimeUpdate: (time: number) => void;
  interactiveMode?: boolean;
}

export const MotionCanvas: React.FC<MotionCanvasProps> = ({
  config,
  isPlaying,
  playbackSpeed,
  currentTime,
  onTimeUpdate,
  interactiveMode = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Animation state references (to avoid re-binding loops)
  const animFrameId = useRef<number | null>(null);
  const timeRef = useRef<number>(currentTime);
  const lastTimestampRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const mouseRef = useRef<{ x: number; y: number; isDown: boolean; vx: number; vy: number; lastX: number; lastY: number }>({
    x: -9999,
    y: -9999,
    isDown: false,
    vx: 0,
    vy: 0,
    lastX: -9999,
    lastY: -9999,
  });

  const [canvasDimensions, setCanvasDimensions] = useState({ width: 1200, height: 600 });

  // Update timeRef when currentTime prop changes from scrubber
  useEffect(() => {
    timeRef.current = currentTime;
  }, [currentTime]);

  // Determine active palette
  const activePalette = COLOR_PALETTES.find((p) => p.id === config.paletteId) || COLOR_PALETTES[0];
  const topBg = config.customPalette?.topBg || activePalette.topBg;
  const bottomBg = config.customPalette?.bottomBg || activePalette.bottomBg;
  const waveBorder = config.customPalette?.waveBorder || activePalette.waveBorder;
  const waveSecondary = config.customPalette?.waveSecondary || activePalette.waveSecondary || '#05475A';
  const topText = config.customPalette?.topText || activePalette.topText;
  const bottomText = config.customPalette?.bottomText || activePalette.bottomText;
  const badgeBg = config.customPalette?.badgeBg || activePalette.badgeBg;
  const badgeTextColor = config.customPalette?.badgeText || activePalette.badgeText;

  // Responsive Full-Screen Dimensions via ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round((rect.width || window.innerWidth) * dpr);
      const h = Math.round((rect.height || window.innerHeight) * dpr);
      if (w > 0 && h > 0) {
        setCanvasDimensions({ width: w, height: h });
      }
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(container);
    window.addEventListener('resize', updateSize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Initialize Particles
  const initParticles = useCallback((w: number, h: number) => {
    const count = config.particleType === 'none' ? 0 : Math.floor(config.particleDensity);
    const newParticles: Particle[] = [];
    const waveY = h * config.waveElevation;

    for (let i = 0; i < count; i++) {
      const isBottom = Math.random() > 0.15; // 85% in bottom polluted water zone
      const yMin = isBottom ? waveY + 20 : 20;
      const yMax = isBottom ? h - 10 : waveY - 20;
      
      const type: 'bubble' | 'smog' | 'sparkle' = 
        config.particleType === 'clean_breeze'
          ? 'sparkle'
          : config.particleType === 'smog_toxic'
          ? 'smog'
          : Math.random() > 0.4 ? 'bubble' : 'smog';

      newParticles.push({
        x: Math.random() * w,
        y: yMin + Math.random() * Math.max(10, yMax - yMin),
        vx: (Math.random() - 0.5) * 0.8,
        vy: type === 'bubble' ? -(0.6 + Math.random() * 1.4) : (Math.random() - 0.5) * 0.4,
        radius: type === 'bubble' ? 2 + Math.random() * 6 : 4 + Math.random() * 14,
        alpha: 0.1 + Math.random() * 0.4,
        maxAlpha: 0.2 + Math.random() * 0.5,
        color: type === 'bubble' ? '#80DEEA' : type === 'smog' ? '#061D24' : '#E0F7FA',
        life: Math.random() * 100,
        maxLife: 80 + Math.random() * 120,
        type,
      });
    }
    particlesRef.current = newParticles;
  }, [config.particleType, config.particleDensity, config.waveElevation]);

  useEffect(() => {
    initParticles(canvasDimensions.width, canvasDimensions.height);
  }, [canvasDimensions, initParticles]);

  // Interactive mouse events
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactiveMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasDimensions.width / rect.width;
    const scaleY = canvasDimensions.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    mouseRef.current.isDown = true;
    mouseRef.current.x = x;
    mouseRef.current.y = y;

    // Add ripple
    ripplesRef.current.push({
      x,
      y,
      radius: 5,
      maxRadius: 160,
      strength: 28,
      alpha: 0.8,
    });

    audioEngine.playRipple();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactiveMode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasDimensions.width / rect.width;
    const scaleY = canvasDimensions.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    mouseRef.current.vx = x - (mouseRef.current.lastX === -9999 ? x : mouseRef.current.lastX);
    mouseRef.current.vy = y - (mouseRef.current.lastY === -9999 ? y : mouseRef.current.lastY);
    mouseRef.current.lastX = x;
    mouseRef.current.lastY = y;
    mouseRef.current.x = x;
    mouseRef.current.y = y;

    // Repel nearby particles
    particlesRef.current.forEach((p) => {
      const dx = p.x - x;
      const dy = p.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90 && dist > 1) {
        const force = (90 - dist) / 90;
        p.vx += (dx / dist) * force * 1.5;
        p.vy += (dy / dist) * force * 1.5;
      }
    });
  };

  const handlePointerLeave = () => {
    mouseRef.current.isDown = false;
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
    mouseRef.current.lastX = -9999;
    mouseRef.current.lastY = -9999;
  };

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const render = (timestamp: number) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const delta = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      // Progress time if playing
      if (isPlaying) {
        timeRef.current += delta * playbackSpeed;
        if (timeRef.current >= 6.0) {
          timeRef.current = timeRef.current % 6.0;
        }
        onTimeUpdate(timeRef.current);
      }

      const t = timeRef.current;
      const W = canvasDimensions.width;
      const H = canvasDimensions.height;

      // Responsive scale relative to standard 1200x600 viewport
      const scaleFactor = Math.min(W / 1200, H / 600);
      const fontScale = Math.max(0.65, Math.min(2.0, scaleFactor));

      // 1. Draw Upper Section (Top Background)
      ctx.fillStyle = topBg;
      ctx.fillRect(0, 0, W, H);

      // Subtle atmospheric texture / light gradient on top
      const topGrad = ctx.createLinearGradient(0, 0, 0, H * config.waveElevation);
      topGrad.addColorStop(0, 'rgba(255,255,255,0.4)');
      topGrad.addColorStop(1, 'rgba(0,0,0,0.02)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, W, H * config.waveElevation);

      // 2. Compute Wave Baseline and Profile
      const baseWaveY = H * config.waveElevation;
      const waveFreq = config.waveFrequency * (Math.PI * 2) / W;
      const waveSpeed = config.waveSpeed;
      const amp = config.waveAmplitude * fontScale;

      // Function to calculate wave height at x with fluid harmonics
      const getWaveY = (x: number, layerOffset: number = 0, timeVal: number = t) => {
        // Base S-curve matching original image (dips on left, rises in mid-right, dips right)
        const normalizedX = x / W;
        // Asymmetric slant: left side dips slightly lower, right rises
        const contourSlant = Math.sin(normalizedX * Math.PI - 0.2) * (amp * 0.4);

        // Harmonics for fluid motion
        const primary = Math.sin(x * waveFreq + timeVal * waveSpeed * 2.2 + layerOffset) * amp;
        const secondary = Math.cos(x * waveFreq * 1.8 - timeVal * waveSpeed * 1.5 + layerOffset * 1.5) * (amp * 0.35);
        const tertiary = Math.sin(x * waveFreq * 0.5 + timeVal * waveSpeed * 0.8) * (amp * 0.2);

        let y = baseWaveY + contourSlant + primary + secondary + tertiary;

        // Interaction ripple displacement
        ripplesRef.current.forEach((r) => {
          const dist = Math.abs(x - r.x);
          if (dist < r.radius) {
            const rippleAmp = Math.sin((dist / r.radius) * Math.PI * 2) * r.strength * (1 - r.radius / r.maxRadius);
            y += rippleAmp;
          }
        });

        // Mouse proximity push
        if (mouseRef.current.x !== -9999) {
          const mDist = Math.abs(x - mouseRef.current.x);
          if (mDist < 120) {
            const push = (1 - mDist / 120) * (mouseRef.current.isDown ? 35 : 18);
            y += push * Math.sin((x - mouseRef.current.x) * 0.05);
          }
        }

        return y;
      };

      // 3. Render Secondary Deep Layer (Parallax / Depth wave)
      if (config.waveLayers >= 2) {
        ctx.beginPath();
        ctx.moveTo(0, H);
        ctx.lineTo(0, getWaveY(0, 1.2, t * 0.8) - 14);
        for (let x = 0; x <= W; x += 12) {
          ctx.lineTo(x, getWaveY(x, 1.2, t * 0.8) - 14);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = waveSecondary;
        ctx.globalAlpha = 0.55;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Third background wave if 3 layers
      if (config.waveLayers >= 3) {
        ctx.beginPath();
        ctx.moveTo(0, H);
        ctx.lineTo(0, getWaveY(0, 2.5, t * 0.6) - 26);
        for (let x = 0; x <= W; x += 15) {
          ctx.lineTo(x, getWaveY(x, 2.5, t * 0.6) - 26);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fillStyle = waveSecondary;
        ctx.globalAlpha = 0.28;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // 4. Render Primary Bottom Area (Dark Teal/Oceanic)
      ctx.beginPath();
      ctx.moveTo(0, H);
      ctx.lineTo(0, getWaveY(0, 0, t));
      for (let x = 0; x <= W; x += 8) {
        ctx.lineTo(x, getWaveY(x, 0, t));
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = bottomBg;
      ctx.fill();

      // Deep volumetric underwater gradient
      const underGrad = ctx.createLinearGradient(0, baseWaveY, 0, H);
      underGrad.addColorStop(0, 'rgba(0,0,0,0)');
      underGrad.addColorStop(0.6, 'rgba(0,0,0,0.18)');
      underGrad.addColorStop(1, 'rgba(0,0,0,0.4)');
      ctx.fillStyle = underGrad;
      ctx.fill();

      // 5. Render Distinctive Cyan Wave Ribbon/Border (The key visual from user image!)
      ctx.beginPath();
      ctx.moveTo(0, getWaveY(0, 0, t));
      for (let x = 0; x <= W; x += 6) {
        ctx.lineTo(x, getWaveY(x, 0, t));
      }
      ctx.strokeStyle = waveBorder;
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Subtle wave crest shimmer/highlight
      if (config.showWaveFoam) {
        ctx.beginPath();
        ctx.moveTo(0, getWaveY(0, 0, t) - 3);
        for (let x = 0; x <= W; x += 10) {
          ctx.lineTo(x, getWaveY(x, 0, t) - 3);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // 6. Update and Draw Particles (Bubbles, Smog, Sparkles)
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += delta * 20;

        const currentWaveY = getWaveY(p.x, 0, t);

        // If bubble hits the wave surface, it pops with a tiny splash!
        if (p.type === 'bubble' && p.y <= currentWaveY + 8) {
          p.y = H + 10;
          p.x = Math.random() * W;
          p.life = 0;
        }

        // Wrap around bounds
        if (p.y > H + 20) p.y = currentWaveY + 15;
        if (p.x < -20) p.x = W + 10;
        if (p.x > W + 20) p.x = -10;

        // Life fading
        const lifeRatio = p.life / p.maxLife;
        const currentAlpha = p.maxAlpha * (1 - Math.abs(lifeRatio - 0.5) * 2);

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));

        if (p.type === 'bubble') {
          // Glassy water bubble with specular glint
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.strokeStyle = waveBorder;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Highlight
          ctx.beginPath();
          ctx.arc(p.x - p.radius * 0.35, p.y - p.radius * 0.35, p.radius * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        } else if (p.type === 'smog') {
          // Soft atmospheric smog puff
          const smogGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          smogGrad.addColorStop(0, p.color);
          smogGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = smogGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Star / Sparkle
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // 7. Update and Draw Interactive Ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += delta * 120;
        r.alpha *= 0.94;

        if (r.radius >= r.maxRadius || r.alpha < 0.02) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = waveBorder;
        ctx.globalAlpha = r.alpha * 0.5;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();
      }

      // 8. Kinetic Typography Rendering
      // Entrance timing: 0s to 1.5s is entrance, 1.5s to 5.2s is hold/oscillation, 5.2s to 6.0s is cycle loop
      const entranceTimeTop = Math.min(1.0, Math.max(0, t / 0.8));
      const entranceTimeBottom = Math.min(1.0, Math.max(0, (t - 0.25) / 0.8));

      // Ease out cubic
      const easeTop = 1 - Math.pow(1 - entranceTimeTop, 3);
      const easeBottom = 1 - Math.pow(1 - entranceTimeBottom, 3);

      // Kinetic idle float
      let idleOffsetYTop = 0;
      let idleOffsetYBottom = 0;
      let idleScale = 1.0;

      if (config.kineticStyle === 'wave_bounce') {
        idleOffsetYTop = Math.sin(t * 3.0) * 6;
        idleOffsetYBottom = Math.cos(t * 3.0) * 6;
      } else if (config.kineticStyle === 'breathing_pulse') {
        idleScale = 1.0 + Math.sin(t * 2.2) * 0.025;
      } else if (config.kineticStyle === 'smooth_float') {
        idleOffsetYTop = Math.sin(t * 1.5) * 4;
        idleOffsetYBottom = Math.sin(t * 1.5 + 1.0) * 4;
      }

      // 8A. Top Text: "QUY HOẠCH QUÁ CHẬM"
      // User request: "khoảng cách chữ Quy hoạch và quá chậm gần quá, cho nhích chữ quy hoạch lên 1 xíu"
      ctx.save();
      const topLines = config.topText.split('\n');
      const fontName = config.fontFamily;
      const scaledFontSizeTop = Math.round(config.fontSizeTop * fontScale);
      const scaledFontSizeBottom = Math.round(config.fontSizeBottom * fontScale);

      ctx.font = `900 ${scaledFontSizeTop}px "${fontName}", sans-serif`;
      ctx.fillStyle = topText;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';

      // Position top text in upper-mid, brought down close to wave and bottom text
      const isPortrait = H > W;
      const topStartX = isPortrait ? W * 0.08 : W * 0.12;
      const topStartY = (isPortrait ? H * 0.28 : H * 0.31) - (1 - easeTop) * 40 + idleOffsetYTop;

      ctx.globalAlpha = Math.min(1, easeTop * 1.5);
      // Optical leading: comfortable breathing room with wider tracking
      const topLeading = scaledFontSizeTop * 1.18;
      topLines.forEach((line, idx) => {
        const lineOffset = (1 - easeTop) * (idx * 25);
        const y = topStartY + idx * topLeading + lineOffset;
        
        // User request: "giãn xíu nữa" -> widen letter-spacing (tracking) for QUY HOẠCH
        const charSpacing = idx === 0 ? Math.max(3, Math.round(5.5 * fontScale)) : Math.max(1.5, Math.round(2.5 * fontScale));
        
        ctx.letterSpacing = `${charSpacing}px`;
        ctx.fillText(line, topStartX, y);
        ctx.letterSpacing = '0px';
      });
      ctx.restore();

      // 8B. Bottom Text: "VÀ Ô NHIỄM MÔI TRƯỜNG"
      ctx.save();
      const bottomLines = config.bottomText.split('\n');
      ctx.font = `900 ${scaledFontSizeBottom}px "${fontName}", sans-serif`;
      ctx.fillStyle = bottomText;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';

      // Position bottom text in the lower right/center-right region matching the reference image
      const bottomStartX = isPortrait ? W * 0.08 : W * 0.44;
      const bottomStartY = (isPortrait ? H * 0.54 : H * 0.50) + (1 - easeBottom) * 50 + idleOffsetYBottom;

      ctx.globalAlpha = Math.min(1, easeBottom * 1.5);
      bottomLines.forEach((line, idx) => {
        const lineOffset = (1 - easeBottom) * (idx * 20);
        const y = bottomStartY + idx * (scaledFontSizeBottom * config.lineHeight) - lineOffset;
        
        // Slight subtle text shadow for television broadcast pop
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 12 * fontScale;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4 * fontScale;
        
        ctx.fillText(line, bottomStartX, y);
      });
      ctx.restore();

      // Request next animation frame
      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [
    isPlaying,
    playbackSpeed,
    canvasDimensions,
    topBg,
    bottomBg,
    waveBorder,
    waveSecondary,
    topText,
    bottomText,
    badgeBg,
    badgeTextColor,
    config,
    onTimeUpdate,
  ]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-white select-none m-0 p-0"
    >
      <canvas
        ref={canvasRef}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="w-full h-full block select-none cursor-default"
      />
    </div>
  );
};
