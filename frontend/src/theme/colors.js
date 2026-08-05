// TechCare Service — Premium Dark Theme Color Palette

export const COLORS = {
  // Primary Colors
  primary: '#1E88E5',        // Vibrant Blue
  primaryDark: '#1565C0',    // Deep Blue
  primaryLight: '#42A5F5',   // Light Blue

  // Secondary / Accent
  secondary: '#00BFA5',      // Teal Accent
  secondaryDark: '#00897B',  // Deep Teal
  secondaryLight: '#64FFDA', // Light Teal

  // Background
  background: '#0D1B2A',     // Dark Navy
  backgroundLight: '#1B2838', // Slightly lighter navy
  surface: '#162032',        // Card surface
  surfaceLight: '#1E2D42',   // Elevated surface

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#B0BEC5',
  textMuted: '#607D8B',
  textDark: '#0D1B2A',

  // Status Colors
  success: '#4CAF50',
  successLight: '#81C784',
  warning: '#FFB300',
  warningLight: '#FFD54F',
  error: '#EF5350',
  errorLight: '#EF9A9A',
  info: '#29B6F6',
  infoLight: '#81D4FA',

  // Booking Status Colors
  statusReceived: '#FFB300',
  statusConfirmed: '#29B6F6',
  statusAssigned: '#7E57C2',
  statusPickedUp: '#AB47BC',
  statusUnderRepair: '#1E88E5',
  statusReady: '#66BB6A',
  statusCompleted: '#4CAF50',
  statusCancelled: '#EF5350',

  // Glassmorphism
  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassHighlight: 'rgba(255, 255, 255, 0.15)',

  // Other
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
  divider: 'rgba(255, 255, 255, 0.08)',
  inputBg: 'rgba(255, 255, 255, 0.06)',
  inputBorder: 'rgba(255, 255, 255, 0.12)',
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  glow: (color) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  }),
};

export const SIZES = {
  // Font Sizes
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  title: 36,

  // Spacing
  padding: 16,
  paddingSm: 8,
  paddingLg: 24,
  margin: 16,
  marginSm: 8,
  marginLg: 24,

  // Border Radius
  radius: 12,
  radiusSm: 8,
  radiusLg: 16,
  radiusXl: 24,
  radiusFull: 999,
};

// Map status to colors
export const getStatusColor = (status) => {
  const map = {
    received: COLORS.statusReceived,
    confirmed: COLORS.statusConfirmed,
    assigned: COLORS.statusAssigned,
    'picked-up': COLORS.statusPickedUp,
    'under-repair': COLORS.statusUnderRepair,
    ready: COLORS.statusReady,
    completed: COLORS.statusCompleted,
    cancelled: COLORS.statusCancelled,
  };
  return map[status] || COLORS.textMuted;
};

// Category info mapping
export const CATEGORY_INFO = {
  smartphone: { label: 'Smartphones', icon: 'smartphone', color: '#42A5F5' },
  laptop: { label: 'Laptops', icon: 'laptop', color: '#AB47BC' },
  television: { label: 'Televisions', icon: 'tv', color: '#EF5350' },
  'air-conditioner': { label: 'Air Conditioners', icon: 'ac-unit', color: '#29B6F6' },
  refrigerator: { label: 'Refrigerators', icon: 'kitchen', color: '#66BB6A' },
  'washing-machine': { label: 'Washing Machines', icon: 'local-laundry-service', color: '#FFB300' },
};
