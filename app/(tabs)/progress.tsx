import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { GameTheme } from '@/constants/theme';
import { useGame } from '@/context/GameContext';

const TOTAL_FASES_PALAVRA_OCULTA = 50;
const TOTAL_FASES_PALAVRA_EMBARALHADA = 50;
const TOTAL_FASES_PALAVRAS_CRUZADAS = 10;
const TOTAL_FASES_CACA_PALAVRAS = 10;
const TOTAL_FASES_SUDOKU = 3;
const TOTAL_FASES_CONEXO = 10;

type GameProgressCardProps = {
  emoji: string;
  title: string;
  concluidas: number;
  total: number;
  accent: string;
};

function GameProgressCard({
  emoji,
  title,
  concluidas,
  total,
  accent,
}: GameProgressCardProps) {
  const porcentagem = Math.round(
    (concluidas / total) * 100
  );

  return (
    <View style={[styles.gameCard, { borderColor: accent }]}>
      <View style={styles.gameHeader}>
        <Text style={styles.gameTitle}>
          {emoji} {title}
        </Text>

        <Text style={[styles.gamePercentage, { color: accent }]}>
          {porcentagem}%
        </Text>
      </View>

      <Text style={styles.gameProgress}>
        {concluidas} de {total} fases concluídas
      </Text>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${porcentagem}%`,
              backgroundColor: accent,
            },
          ]}
        />
      </View>
    </View>
  );
}

export default function ProgressScreen() {
  const {
    fasesPalavraConcluidas,
    fasesEmbaralhadaConcluidas,
    fasesCruzadasConcluidas,
    fasesCacaPalavrasConcluidas,
    fasesSudokuConcluidas,
    fasesConexoConcluidas,
  } = useGame();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>
          🏆 SEU PROGRESSO
        </Text>

        <Text style={styles.title}>
          Progresso
        </Text>

        <Text style={styles.description}>
          Acompanhe seu avanço em todos os modos de jogo.
        </Text>

        <GameProgressCard
          emoji="🕵️"
          title="Palavra Oculta"
          concluidas={fasesPalavraConcluidas.length}
          total={TOTAL_FASES_PALAVRA_OCULTA}
          accent={GameTheme.games.oculta.base}
        />

        <GameProgressCard
          emoji="🔀"
          title="Palavra Embaralhada"
          concluidas={fasesEmbaralhadaConcluidas.length}
          total={TOTAL_FASES_PALAVRA_EMBARALHADA}
          accent={GameTheme.games.embaralhada.base}
        />

        <GameProgressCard
          emoji="✏️"
          title="Palavras Cruzadas"
          concluidas={fasesCruzadasConcluidas.length}
          total={TOTAL_FASES_PALAVRAS_CRUZADAS}
          accent={GameTheme.games.cruzadas.base}
        />

        <GameProgressCard
          emoji="🔎"
          title="Caça-Palavras"
          concluidas={fasesCacaPalavrasConcluidas.length}
          total={TOTAL_FASES_CACA_PALAVRAS}
          accent={GameTheme.games.cacaPalavras.base}
        />

        <GameProgressCard
          emoji="🔢"
          title="Sudoku"
          concluidas={fasesSudokuConcluidas.length}
          total={TOTAL_FASES_SUDOKU}
          accent={GameTheme.games.sudoku.base}
        />

        <GameProgressCard
          emoji="🧩"
          title="Conexo"
          concluidas={fasesConexoConcluidas.length}
          total={TOTAL_FASES_CONEXO}
          accent={GameTheme.games.conexo.base}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GameTheme.bg,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 40,
  },

  eyebrow: {
    color: GameTheme.games.conexo.base,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },

  title: {
    color: GameTheme.title,
    fontSize: 34,
    fontWeight: '900',
    marginTop: 4,
  },

  description: {
    color: GameTheme.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 6,
  },

  gameCard: {
    backgroundColor: GameTheme.surface,
    borderWidth: 2,
    borderRadius: 22,
    padding: 18,
    marginTop: 18,
  },

  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  gameTitle: {
    color: GameTheme.title,
    fontSize: 18,
    fontWeight: '900',
  },

  gamePercentage: {
    fontSize: 18,
    fontWeight: '900',
  },

  gameProgress: {
    color: GameTheme.textMuted,
    fontSize: 12,
    marginTop: 8,
  },

  progressBar: {
    height: 10,
    backgroundColor: GameTheme.bgSoft,
    borderRadius: 20,
    marginTop: 15,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 20,
  },
});
