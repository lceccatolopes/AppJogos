import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { GameTheme } from '@/constants/theme';

type Accent = {
  base: string;
  dark: string;
  soft: string;
};

type GameCardProps = {
  title: string;
  emoji: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  info?: string;
  accent: Accent;
  enabled?: boolean;
  rotate?: string;
  onPress?: () => void;
};

function GameCard({
  title,
  emoji,
  description,
  icon,
  info,
  accent,
  enabled = false,
  rotate = '0deg',
  onPress,
}: GameCardProps) {
  return (
    <View
      style={[
        styles.gameCard,
        { transform: [{ rotate }] },
        enabled
          ? { borderColor: accent.base }
          : styles.gameCardDisabled,
      ]}
    >
      <View style={styles.gameTop}>
        <View
          style={[
            styles.gameIcon,
            {
              backgroundColor: enabled
                ? accent.base
                : '#2A2160',
            },
          ]}
        >
          <Text style={styles.gameEmoji}>
            {emoji}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            enabled
              ? {
                  backgroundColor: accent.soft,
                  borderColor: accent.base,
                }
              : styles.comingBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: enabled
                  ? accent.base
                  : '#756FA3',
              },
            ]}
          >
            {enabled ? 'DISPONÍVEL' : 'EM BREVE'}
          </Text>
        </View>
      </View>

      <View style={styles.gameTitleRow}>
        <Ionicons
          name={icon}
          size={18}
          color={enabled ? accent.base : '#756FA3'}
        />

        <Text
          style={[
            styles.gameTitle,
            !enabled && styles.gameTitleDisabled,
          ]}
        >
          {title}
        </Text>
      </View>

      <Text
        style={[
          styles.gameDescription,
          !enabled && styles.gameDescriptionDisabled,
        ]}
      >
        {description}
      </Text>

      {info && (
        <Text style={styles.gameInfo}>
          {info}
        </Text>
      )}

      {enabled ? (
        <Pressable
          style={({ pressed }) => [
            styles.playButton,
            {
              backgroundColor: accent.base,
              borderBottomColor: accent.dark,
            },
            pressed && styles.playButtonPressed,
          ]}
          onPress={onPress}
        >
          <Text style={styles.playButtonText}>
            JOGAR
          </Text>

          <Ionicons
            name="play"
            size={14}
            color="#FFFFFF"
          />
        </Pressable>
      ) : (
        <View style={styles.disabledButton}>
          <Text style={styles.disabledButtonText}>
            🔒 EM BREVE
          </Text>
        </View>
      )}
    </View>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              ✨ COLEÇÃO DE DESAFIOS
            </Text>

            <Text style={styles.title}>
              Jogos
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Text style={styles.headerEmoji}>
              🎮
            </Text>
          </View>
        </View>

        <Text style={styles.description}>
          Escolha um modo, desafie sua mente e avance no seu ritmo.
        </Text>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            MODOS DE JOGO
          </Text>

          <Text style={styles.sectionCount}>
            6 jogos
          </Text>
        </View>

        <View style={styles.games}>
          <GameCard
            title="Palavra Oculta"
            emoji="🕵️"
            description="Descubra a palavra escondida usando as pistas de posição das letras."
            icon="text"
            info="50 fases • 5 letras • 6 tentativas"
            accent={GameTheme.games.oculta}
            enabled
            rotate="-0.6deg"
            onPress={() =>
              router.push('/games/word-game')
            }
          />

          <GameCard
            title="Palavra Embaralhada"
            emoji="🔀"
            description="Reorganize as letras para descobrir a palavra correta."
            icon="shuffle"
            info="50 fases • 5 letras"
            accent={GameTheme.games.embaralhada}
            enabled
            rotate="0.6deg"
            onPress={() =>
              router.push('/games/scrambled-word')
            }
          />

          <GameCard
            title="Palavras Cruzadas"
            emoji="✏️"
            description="Resolva as pistas e complete todas as palavras da fase."
            icon="grid"
            info="10 fases • pistas e respostas"
            accent={GameTheme.games.cruzadas}
            enabled
            rotate="-0.6deg"
            onPress={() =>
              router.push('/games/crossword')
            }
          />

          <GameCard
            title="Caça-Palavras"
            emoji="🔎"
            description="Encontre todas as palavras escondidas no tabuleiro."
            icon="search"
            info="10 fases • vários temas"
            accent={GameTheme.games.cacaPalavras}
            enabled
            rotate="0.6deg"
            onPress={() =>
              router.push('/games/word-search')
            }
          />

          <GameCard
            title="Sudoku"
            emoji="🔢"
            description="Complete a grade usando lógica e raciocínio sem repetir números."
            icon="apps"
            info="Fácil • Médio • Difícil"
            accent={GameTheme.games.sudoku}
            enabled
            rotate="-0.6deg"
            onPress={() =>
              router.push('/games/sudoku')
            }
          />

          <GameCard
            title="Conexo"
            emoji="🧩"
            description="Encontre grupos de palavras que compartilham uma conexão em comum."
            icon="git-network"
            info="10 fases • categorias e associações"
            accent={GameTheme.games.conexo}
            enabled
            rotate="0.6deg"
            onPress={() =>
              router.push('/games/conexo')
            }
          />
        </View>

        <Text style={styles.footer}>
          Novos modos poderão ser adicionados no futuro. 🚀
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GameTheme.bg,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  eyebrow: {
    color: GameTheme.games.conexo.base,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },

  title: {
    color: GameTheme.title,
    fontSize: 38,
    fontWeight: '900',
    marginTop: 4,
  },

  headerIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: GameTheme.surfaceAlt,
    borderWidth: 2,
    borderColor: GameTheme.outline,
    borderBottomWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '6deg' }],
  },

  headerEmoji: {
    fontSize: 28,
  },

  description: {
    color: GameTheme.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 14,
    maxWidth: 330,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 14,
  },

  sectionTitle: {
    color: GameTheme.textDim,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.8,
  },

  sectionCount: {
    color: GameTheme.locked,
    fontSize: 11,
    fontWeight: '700',
  },

  games: {
    gap: 20,
  },

  gameCard: {
    backgroundColor: GameTheme.surface,
    borderWidth: 2.5,
    borderRadius: 26,
    padding: 19,
  },

  gameCardDisabled: {
    borderColor: GameTheme.outline,
  },

  gameTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  gameIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  gameEmoji: {
    fontSize: 24,
  },

  statusBadge: {
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },

  comingBadge: {
    backgroundColor: GameTheme.bgSoft,
    borderColor: GameTheme.outline,
  },

  statusText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  gameTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 17,
  },

  gameTitle: {
    color: GameTheme.title,
    fontSize: 21,
    fontWeight: '900',
  },

  gameTitleDisabled: {
    color: GameTheme.textMuted,
  },

  gameDescription: {
    color: GameTheme.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },

  gameDescriptionDisabled: {
    color: GameTheme.textDim,
  },

  gameInfo: {
    color: GameTheme.textDim,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 13,
  },

  playButton: {
    height: 50,
    borderRadius: 16,
    borderBottomWidth: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
  },

  playButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  playButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },

  disabledButton: {
    height: 48,
    backgroundColor: GameTheme.bgSoft,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },

  disabledButtonText: {
    color: GameTheme.locked,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  footer: {
    color: GameTheme.locked,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 30,
  },
});
