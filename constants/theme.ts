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
 * Paleta "de jogo": fundo indigo escuro, título creme e uma cor de destaque
 * própria para cada modo de jogo (usada nos cards, tabuleiros e botões).
 * Os botões usam `dark` como borderBottomColor para simular um botão 3D
 * "prensável", estilo jogo casual mobile.
 */
export const GameTheme = {
  bg: '#100C24',
  bgSoft: '#170F35',
  surface: '#1D1846',
  surfaceAlt: '#241B57',
  outline: '#372C6E',
  title: '#FFECB3',
  text: '#EDEBFF',
  textMuted: '#ABA4D9',
  textDim: '#756FA3',
  locked: '#4B4678',
  success: '#3ED598',
  successDark: '#1E8F63',
  danger: '#FF5C7A',
  dangerDark: '#B23A52',

  games: {
    oculta: { base: '#FF5D73', dark: '#B23349', soft: '#3A1830' },
    embaralhada: { base: '#FF9F45', dark: '#C36F1E', soft: '#3A2414' },
    cruzadas: { base: '#4EA1FF', dark: '#2A6FC2', soft: '#152A46' },
    cacaPalavras: { base: '#3DDC84', dark: '#1F9958', soft: '#123626' },
    sudoku: { base: '#FFD23F', dark: '#C79A17', soft: '#3A2E10' },
    conexo: { base: '#B98BFF', dark: '#7A4FD1', soft: '#2A1D4E' },
  },
} as const;
