export type MotionPreset = 
  | 'broadcast_news' 
  | 'fluid_waves' 
  | 'pollution_crisis' 
  | 'kinetic_impact' 
  | 'interactive_physics';

export type AspectRatioType = '2:1' | '16:9' | '9:16' | '1:1';

export type ColorPalette = {
  id: string;
  name: string;
  topBg: string;
  bottomBg: string;
  waveBorder: string;
  waveSecondary?: string;
  topText: string;
  bottomText: string;
  badgeBg: string;
  badgeText: string;
  accent: string;
};

export type MotionConfig = {
  topText: string;
  bottomText: string;
  categoryBadge: string;
  showBadge: boolean;
  
  // Font & Typography
  fontFamily: 'Montserrat' | 'Be Vietnam Pro' | 'Plus Jakarta Sans';
  fontSizeTop: number;
  fontSizeBottom: number;
  letterSpacing: number;
  lineHeight: number;
  
  // Wave physics
  waveSpeed: number;        // 0.2 to 2.5
  waveFrequency: number;    // 0.5 to 2.5
  waveAmplitude: number;    // 10 to 80
  waveElevation: number;    // 0.3 to 0.7 (vertical position)
  waveLayers: number;       // 1, 2, or 3 layers
  waveTurbulence: number;   // additional noise/jitter
  
  // Particles & Effects
  particleType: 'bubbles_smog' | 'smog_toxic' | 'clean_breeze' | 'none';
  particleDensity: number;  // 10 to 100
  showWaveFoam: boolean;
  glowEffect: boolean;
  
  // Kinetic animation style
  kineticStyle: 'stagger_slide' | 'wave_bounce' | 'breathing_pulse' | 'smooth_float';
  
  // Color scheme
  paletteId: string;
  customPalette?: Partial<ColorPalette>;
  
  // Layout
  aspectRatio: AspectRatioType;
  
  // Audio
  soundEnabled: boolean;
};

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'bubble' | 'smog' | 'sparkle';
}

export interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
  alpha: number;
}
