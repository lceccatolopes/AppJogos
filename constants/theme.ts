/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

/**
 * Paleta minimalista: fundo azul-petróleo bem escuro e um único tom de
 * destaque (verde-menta) usado em todo o app, sem uma cor por jogo.
 * Baseada na referência "Green Gray Color Palettes" (#162936 / #3b5265 /
 * #27e9b5 / #051824).
 */
export const GameTheme = {
  bg: '#051824',
  bgSoft: '#0A1F2C',
  surface: '#0F2530',
  surfaceAlt: '#162936',
  outline: '#3b5265',
  title: '#EAF6F2',
  text: '#DCE8E6',
  textMuted: '#8CA3AE',
  textDim: '#5F7683',
  locked: '#3E5462',
  success: '#27e9b5',
  successDark: '#159E82',
  danger: '#8CA3AE',
  dangerDark: '#3b5265',

  accent: '#27e9b5',
  accentDark: '#159E82',
  accentSoft: '#0E3A32',

  games: {
    oculta: { base: '#27e9b5', dark: '#159E82', soft: '#0E3A32' },
    embaralhada: { base: '#27e9b5', dark: '#159E82', soft: '#0E3A32' },
    cruzadas: { base: '#27e9b5', dark: '#159E82', soft: '#0E3A32' },
    cacaPalavras: { base: '#27e9b5', dark: '#159E82', soft: '#0E3A32' },
    sudoku: { base: '#27e9b5', dark: '#159E82', soft: '#0E3A32' },
    conexo: { base: '#27e9b5', dark: '#159E82', soft: '#0E3A32' },
  },
} as const;
