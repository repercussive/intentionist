const theme = {
  breakpoints: ['501px', '1251px'],
  colors: {
    text: 'var(--color-text)',
    textAccent: 'var(--color-text-accent)',
    textAccentAlt: 'var(--color-text-accent-alt)',
    bg: 'var(--color-bg)',
    divider: 'var(--color-divider)',
    button: 'var(--color-button)',
    buttonAccent: 'var(--color-button-accent)',
    buttonAccentAlt: 'var(--color-button-accent-alt)',
    buttonWarning: 'var(--color-button-warning)',
    buttonHighlight: 'var(--color-button-highlight)',
    warning: 'var(--color-warning)',
    accent: 'var(--color-accent)',
    accentAlt: 'var(--color-accent-alt)',
    nav: 'var(--color-nav)',
    whiteAlpha: {
      0: 'rgba(255, 255, 255, 0)',
      3: 'rgba(255, 255, 255, 0.03)',
      5: 'rgba(255, 255, 255, 0.05)',
      8: 'rgba(255, 255, 255, 0.08)',
      10: 'rgba(255, 255, 255, 0.1)',
      20: 'rgba(255, 255, 255, 0.2)',
      25: 'rgba(255, 255, 255, 0.25)',
      30: 'rgba(255, 255, 255, 0.3)',
      40: 'rgba(255, 255, 255, 0.4)',
      50: 'rgba(255, 255, 255, 0.5)',
      60: 'rgba(255, 255, 255, 0.6)',
      70: 'rgba(255, 255, 255, 0.7)',
      80: 'rgba(255, 255, 255, 0.8)',
      90: 'rgba(255, 255, 255, 0.9)',
      100: 'rgba(255, 255, 255, 1)',
    }
  },
  fonts: {
    body: 'sans-serif',
    heading: 'sans-serif'
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  radii: {
    default: '4px',
    trackerStatus: '8px'
  },
  sizes: {
    max: '1200px',
    habits: '800px',
    row: '2.35rem',
  },
  space: ['0', '0.25rem', '0.5rem', '0.75rem', '1rem', '1.25rem', '1.5rem', '1.75rem', '2rem'],
}

export const windowsScrollbarStyle = '::-webkit-scrollbar{width:10px;}::-webkit-scrollbar-track{background:rgba(255,255,255,0.1);}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.3);}::-webkit-scrollbar-thumb:hover{background:rgba(255, 255, 255, 0.5);}'

export default theme