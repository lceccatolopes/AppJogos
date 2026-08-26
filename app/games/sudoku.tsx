import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { GameTheme } from '@/constants/theme';
import { useGame } from '@/context/GameContext';

const ACCENT = GameTheme.games.sudoku;

type Fase = {
  nome: string;
  puzzle: string[];
  solucao: string[];
};

const FASES: Fase[] = [
  {
    nome: 'Fácil',
    puzzle: [
      '083007060',
      '915002748',
      '207100000',
      '190000030',
      '652800070',
      '004001500',
      '501046097',
      '840709300',
      '729000006',
    ],
    solucao: [
      '483957261',
      '915362748',
      '267184953',
      '198475632',
      '652893174',
      '374621589',
      '531246897',
      '846719325',
      '729538416',
    ],
  },
  {
    nome: 'Médio',
    puzzle: [
      '940168000',
      '750230069',
      '200000000',
      '010700006',
      '300490500',
      '804356000',
      '000800100',
      '090010000',
      '070009602',
    ],
    solucao: [
      '943168257',
      '751234869',
      '286975413',
      '519782346',
      '367491528',
      '824356971',
      '635827194',
      '492613785',
      '178549632',
    ],
  },
  {
    nome: 'Difícil',
    puzzle: [
      '000205906',
      '008006700',
      '100030000',
      '806050200',
      '005007000',
      '200008500',
      '000940000',
      '002000150',
      '000002609',
    ],
    solucao: [
      '743285916',
      '528196734',
      '169734825',
      '836459271',
      '915327468',
      '274618593',
      '657941382',
      '492863157',
      '381572649',
    ],
  },
];

type Posicao = {
  linha: number;
  coluna: number;
};

function gradeInicial(puzzle: string[]): string[][] {
  return puzzle.map((linha) => linha.split(''));
}

export default function SudokuScreen() {
  const {
    fasesSudokuConcluidas,
    concluirFaseSudoku,
    faseSudokuEstaConcluida,
  } = useGame();

  const [faseAtual, setFaseAtual] = useState(0);

  const fase = FASES[faseAtual];
  const numeroFase = faseAtual + 1;

  const [grade, setGrade] = useState<string[][]>(() =>
    gradeInicial(fase.puzzle)
  );

  const [selecionada, setSelecionada] =
    useState<Posicao | null>(null);

  const [venceu, setVenceu] = useState(
    faseSudokuEstaConcluida(numeroFase)
  );

  const progresso = fasesSudokuConcluidas.length;
  const porcentagem = Math.round(
    (progresso / FASES.length) * 100
  );

  function trocarFase(index: number) {
    setFaseAtual(index);
    setGrade(gradeInicial(FASES[index].puzzle));
    setSelecionada(null);
    setVenceu(
      faseSudokuEstaConcluida(index + 1)
    );
  }

  function reiniciar() {
    setGrade(gradeInicial(fase.puzzle));
    setSelecionada(null);
    setVenceu(false);
  }

  function ehFixa(linha: number, coluna: number) {
    return fase.puzzle[linha][coluna] !== '0';
  }

  function temConflito(
    grade: string[][],
    linha: number,
    coluna: number
  ) {
    const valor = grade[linha][coluna];

    if (!valor) {
      return false;
    }

    for (let i = 0; i < 9; i++) {
      if (i !== coluna && grade[linha][i] === valor) {
        return true;
      }

      if (i !== linha && grade[i][coluna] === valor) {
        return true;
      }
    }

    const boxLinha = Math.floor(linha / 3) * 3;
    const boxColuna = Math.floor(coluna / 3) * 3;

    for (let i = boxLinha; i < boxLinha + 3; i++) {
      for (let j = boxColuna; j < boxColuna + 3; j++) {
        if (
          (i !== linha || j !== coluna) &&
          grade[i][j] === valor
        ) {
          return true;
        }
      }
    }

    return false;
  }

  const relacionada = (linha: number, coluna: number) => {
    if (!selecionada) {
      return false;
    }

    if (
      selecionada.linha === linha &&
      selecionada.coluna === coluna
    ) {
      return false;
    }

    const mesmaLinha = selecionada.linha === linha;
    const mesmaColuna = selecionada.coluna === coluna;

    const mesmoBox =
      Math.floor(selecionada.linha / 3) ===
        Math.floor(linha / 3) &&
      Math.floor(selecionada.coluna / 3) ===
        Math.floor(coluna / 3);

    return mesmaLinha || mesmaColuna || mesmoBox;
  };

  async function verificarVitoria(novaGrade: string[][]) {
    const completa = novaGrade.every((linha) =>
      linha.every((valor) => valor !== '')
    );

    if (!completa) {
      return;
    }

    const correta = novaGrade.every((linha, i) =>
      linha.every(
        (valor, j) => valor === fase.solucao[i][j]
      )
    );

    if (!correta) {
      setTimeout(() => {
        Alert.alert(
          'Quase lá!',
          'A grade está completa, mas há números errados.'
        );
      }, 200);

      return;
    }

    setVenceu(true);

    const primeiraConclusao = await concluirFaseSudoku(
      numeroFase
    );

    setTimeout(() => {
      Alert.alert(
        primeiraConclusao
          ? 'Sudoku resolvido!'
          : 'Muito bem!',
        primeiraConclusao
          ? `Você concluiu o nível ${fase.nome}.`
          : 'Você já havia concluído este nível.'
      );
    }, 250);
  }

  function digitarNumero(numero: string) {
    if (!selecionada || venceu) {
      return;
    }

    if (ehFixa(selecionada.linha, selecionada.coluna)) {
      return;
    }

    const novaGrade = grade.map((linha) => [...linha]);
    novaGrade[selecionada.linha][selecionada.coluna] =
      numero;

    setGrade(novaGrade);
    verificarVitoria(novaGrade);
  }

  function apagar() {
    if (!selecionada || venceu) {
      return;
    }

    if (ehFixa(selecionada.linha, selecionada.coluna)) {
      return;
    }

    const novaGrade = grade.map((linha) => [...linha]);
    novaGrade[selecionada.linha][selecionada.coluna] = '';
    setGrade(novaGrade);
  }

  const conflitos = useMemo(() => {
    const mapa = new Set<string>();

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (temConflito(grade, i, j)) {
          mapa.add(`${i}-${j}`);
        }
      }
    }

    return mapa;
  }, [grade]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>

        <Text style={styles.eyebrow}>SUDOKU</Text>

        <Text style={styles.title}>{fase.nome}</Text>

        <Text style={styles.description}>
          Complete a grade usando os números de 1 a 9, sem repetir na linha, coluna ou quadrante.
        </Text>

        <View style={styles.progressCard}>
          <View>
            <Text style={styles.progressLabel}>
              NÍVEIS CONCLUÍDOS
            </Text>

            <Text style={styles.progressValue}>
              {progresso} / {FASES.length}
            </Text>
          </View>

          <Text style={styles.progressPercent}>
            {porcentagem}%
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${porcentagem}%` },
            ]}
          />
        </View>

        <View style={styles.difficultyRow}>
          {FASES.map((item, index) => {
            const atual = index === faseAtual;
            const concluida = faseSudokuEstaConcluida(
              index + 1
            );

            return (
              <Pressable
                key={item.nome}
                style={[
                  styles.difficultyPill,
                  atual && styles.difficultyPillActive,
                ]}
                onPress={() => trocarFase(index)}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    atual && styles.difficultyTextActive,
                  ]}
                >
                  {concluida ? '✓ ' : ''}
                  {item.nome}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.board}>
          {grade.map((linha, linhaIndex) => (
            <View key={linhaIndex} style={styles.boardRow}>
              {linha.map((valor, colunaIndex) => {
                const fixa = ehFixa(
                  linhaIndex,
                  colunaIndex
                );

                const selecionadaAtual =
                  selecionada?.linha === linhaIndex &&
                  selecionada?.coluna === colunaIndex;

                const conflito = conflitos.has(
                  `${linhaIndex}-${colunaIndex}`
                );

                return (
                  <Pressable
                    key={colunaIndex}
                    style={[
                      styles.cell,
                      colunaIndex % 3 === 2 &&
                        colunaIndex !== 8 &&
                        styles.cellBorderRight,
                      linhaIndex % 3 === 2 &&
                        linhaIndex !== 8 &&
                        styles.cellBorderBottom,
                      relacionada(
                        linhaIndex,
                        colunaIndex
                      ) && styles.cellRelated,
                      selecionadaAtual &&
                        styles.cellSelected,
                    ]}
                    onPress={() =>
                      !venceu &&
                      setSelecionada({
                        linha: linhaIndex,
                        coluna: colunaIndex,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.cellText,
                        fixa && styles.cellTextFixed,
                        conflito && styles.cellTextConflito,
                      ]}
                    >
                      {valor}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        {venceu ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>
              NÍVEL CONCLUÍDO ✓
            </Text>

            <Pressable
              style={styles.restartButton}
              onPress={reiniciar}
            >
              <Text style={styles.restartButtonText}>
                JOGAR NOVAMENTE
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.numberPad}>
              {Array.from({ length: 9 }).map((_, i) => (
                <Pressable
                  key={i}
                  style={styles.numberKey}
                  onPress={() =>
                    digitarNumero(String(i + 1))
                  }
                >
                  <Text style={styles.numberKeyText}>
                    {i + 1}
                  </Text>
                </Pressable>
              ))}

              <Pressable
                style={styles.eraseKey}
                onPress={apagar}
              >
                <Ionicons
                  name="backspace-outline"
                  size={20}
                  color={GameTheme.text}
                />
              </Pressable>
            </View>

            <Pressable
              style={styles.restartButtonOutline}
              onPress={reiniciar}
            >
              <Text style={styles.restartButtonOutlineText}>
                REINICIAR NÍVEL
              </Text>
            </Pressable>
          </>
        )}
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
    paddingTop: 24,
    paddingBottom: 110,
    alignItems: 'center',
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: GameTheme.surface,
    borderWidth: 2,
    borderColor: GameTheme.outline,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },

  backButtonText: {
    color: GameTheme.title,
    fontSize: 34,
    lineHeight: 36,
  },

  eyebrow: {
    color: ACCENT.base,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },

  title: {
    color: GameTheme.title,
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 5,
  },

  description: {
    color: GameTheme.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 18,
    maxWidth: 320,
  },

  progressCard: {
    width: '100%',
    backgroundColor: GameTheme.surface,
    borderWidth: 2,
    borderColor: GameTheme.outline,
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  progressLabel: {
    color: GameTheme.textMuted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  progressValue: {
    color: GameTheme.title,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 3,
  },

  progressPercent: {
    color: ACCENT.base,
    fontSize: 21,
    fontWeight: '900',
  },

  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: GameTheme.bgSoft,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 9,
    marginBottom: 20,
  },

  progressFill: {
    height: '100%',
    backgroundColor: ACCENT.base,
    borderRadius: 20,
  },

  difficultyRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },

  difficultyPill: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: GameTheme.outline,
    backgroundColor: GameTheme.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  difficultyPillActive: {
    borderColor: ACCENT.base,
    backgroundColor: ACCENT.soft,
  },

  difficultyText: {
    color: GameTheme.textMuted,
    fontSize: 12,
    fontWeight: '900',
  },

  difficultyTextActive: {
    color: ACCENT.base,
  },

  board: {
    backgroundColor: GameTheme.surfaceAlt,
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: GameTheme.outline,
    padding: 6,
  },

  boardRow: {
    flexDirection: 'row',
  },

  cell: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: GameTheme.outline,
  },

  cellBorderRight: {
    borderRightWidth: 2.5,
    borderRightColor: GameTheme.outline,
  },

  cellBorderBottom: {
    borderBottomWidth: 2.5,
    borderBottomColor: GameTheme.outline,
  },

  cellRelated: {
    backgroundColor: GameTheme.bgSoft,
  },

  cellSelected: {
    backgroundColor: ACCENT.soft,
  },

  cellText: {
    color: ACCENT.base,
    fontSize: 16,
    fontWeight: '700',
  },

  cellTextFixed: {
    color: GameTheme.text,
    fontWeight: '900',
  },

  cellTextConflito: {
    color: GameTheme.danger,
  },

  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    width: '100%',
  },

  numberKey: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: ACCENT.base,
    borderBottomWidth: 4,
    borderBottomColor: ACCENT.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },

  numberKeyText: {
    color: '#241B0A',
    fontSize: 18,
    fontWeight: '900',
  },

  eraseKey: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: GameTheme.surfaceAlt,
    borderWidth: 2,
    borderColor: GameTheme.outline,
    borderBottomWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  restartButtonOutline: {
    marginTop: 22,
    borderWidth: 2,
    borderColor: GameTheme.outline,
    borderBottomWidth: 4,
    backgroundColor: GameTheme.surface,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },

  restartButtonOutlineText: {
    color: GameTheme.textMuted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },

  resultContainer: {
    alignItems: 'center',
    marginTop: 24,
  },

  resultTitle: {
    color: GameTheme.success,
    fontSize: 19,
    fontWeight: '900',
  },

  restartButton: {
    backgroundColor: ACCENT.base,
    borderBottomWidth: 5,
    borderBottomColor: ACCENT.dark,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 16,
  },

  restartButtonText: {
    color: '#241B0A',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
