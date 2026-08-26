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

import { useGame } from '@/context/GameContext';

type Posicao = {
  linha: number;
  coluna: number;
};

type Fase = {
  titulo: string;
  grade: string[];
  palavras: string[];
};

const FASES: Fase[] = [
  {
    titulo: 'Animais',
    grade: [
      'GATOPQ',
      'CACHOR',
      'RATOXY',
      'PATOAB',
      'LOBOMN',
      'URSOKL',
    ],
    palavras: [
      'GATO',
      'RATO',
      'PATO',
      'LOBO',
      'URSO',
    ],
  },

  {
    titulo: 'Natureza',
    grade: [
      'FLORAZ',
      'RIOABC',
      'SOLXYZ',
      'MATAPQ',
      'MARDEF',
      'LUAGHI',
    ],
    palavras: [
      'FLOR',
      'RIO',
      'SOL',
      'MATA',
      'MAR',
      'LUA',
    ],
  },

  {
    titulo: 'Casa',
    grade: [
      'MESABC',
      'CADEIR',
      'PORTAX',
      'COPOMN',
      'CAMAPQ',
      'SOFAKL',
    ],
    palavras: [
      'MESA',
      'PORTA',
      'COPO',
      'CAMA',
      'SOFA',
    ],
  },

  {
    titulo: 'Comida',
    grade: [
      'ARROZX',
      'FEIJAO',
      'PAOABC',
      'MELXYZ',
      'UVAPQR',
      'OVOKLM',
    ],
    palavras: [
      'ARROZ',
      'FEIJAO',
      'PAO',
      'MEL',
      'UVA',
      'OVO',
    ],
  },

  {
    titulo: 'Cidade',
    grade: [
      'RUAXYZ',
      'PRACAB',
      'PONTEC',
      'METROD',
      'PARQUE',
      'LOJAFG',
    ],
    palavras: [
      'RUA',
      'PRACA',
      'PONTE',
      'METRO',
      'PARQUE',
      'LOJA',
    ],
  },

  {
    titulo: 'Escola',
    grade: [
      'LAPISX',
      'AULABC',
      'PROVAD',
      'NOTAEF',
      'LIVROG',
      'CANETK',
    ],
    palavras: [
      'LAPIS',
      'AULA',
      'PROVA',
      'NOTA',
      'LIVRO',
    ],
  },

  {
    titulo: 'Viagem',
    grade: [
      'AVIAOX',
      'HOTELB',
      'MAPACD',
      'MALAEF',
      'CARROG',
      'BARCOH',
    ],
    palavras: [
      'AVIAO',
      'HOTEL',
      'MAPA',
      'MALA',
      'CARRO',
      'BARCO',
    ],
  },

  {
    titulo: 'Clima',
    grade: [
      'CHUVAX',
      'VENTOB',
      'NUVEMC',
      'FRIODE',
      'CALORF',
      'NEVEGH',
    ],
    palavras: [
      'CHUVA',
      'VENTO',
      'NUVEM',
      'FRIO',
      'CALOR',
      'NEVE',
    ],
  },

  {
    titulo: 'Cores',
    grade: [
      'VERDEX',
      'AZULAB',
      'ROXOCD',
      'PRETOE',
      'CINZAF',
      'ROSAGH',
    ],
    palavras: [
      'VERDE',
      'AZUL',
      'ROXO',
      'PRETO',
      'CINZA',
      'ROSA',
    ],
  },

  {
    titulo: 'Desafio Final',
    grade: [
      'SONHOX',
      'TEMPOB',
      'MUNDOC',
      'IDEIAD',
      'PODERE',
      'HONRAF',
    ],
    palavras: [
      'SONHO',
      'TEMPO',
      'MUNDO',
      'IDEIA',
      'PODER',
      'HONRA',
    ],
  },
];

export default function WordSearchScreen() {
  const {
    fasesCacaPalavrasConcluidas,
    concluirFaseCacaPalavras,
    faseCacaPalavrasEstaConcluida,
  } = useGame();

  const primeiraNaoConcluida =
    useMemo(() => {
      const indice = FASES.findIndex(
        (_, index) =>
          !fasesCacaPalavrasConcluidas.includes(
            index + 1
          )
      );

      return indice === -1
        ? FASES.length
        : indice;
    }, [fasesCacaPalavrasConcluidas]);

  const [faseAtual, setFaseAtual] =
    useState(
      Math.min(
        primeiraNaoConcluida,
        FASES.length - 1
      )
    );

  const [
    selecao,
    setSelecao,
  ] = useState<Posicao[]>([]);

  const [
    palavrasEncontradas,
    setPalavrasEncontradas,
  ] = useState<string[]>([]);

  const numeroFase = faseAtual + 1;
  const fase = FASES[faseAtual];

  const progresso =
    fasesCacaPalavrasConcluidas.length;

  const porcentagem = Math.round(
    (progresso / FASES.length) * 100
  );

  const faseConcluida =
    faseCacaPalavrasEstaConcluida(
      numeroFase
    );

  function limparFase() {
    setSelecao([]);
    setPalavrasEncontradas([]);
  }

  function letraDaPosicao(
    posicao: Posicao
  ) {
    return fase.grade[
      posicao.linha
    ][posicao.coluna];
  }

  function posicoesSaoVizinhas(
    anterior: Posicao,
    atual: Posicao
  ) {
    const diferencaLinha =
      Math.abs(
        anterior.linha - atual.linha
      );

    const diferencaColuna =
      Math.abs(
        anterior.coluna - atual.coluna
      );

    return (
      diferencaLinha <= 1 &&
      diferencaColuna <= 1 &&
      !(
        diferencaLinha === 0 &&
        diferencaColuna === 0
      )
    );
  }

  function posicaoSelecionada(
    linha: number,
    coluna: number
  ) {
    return selecao.some(
      (item) =>
        item.linha === linha &&
        item.coluna === coluna
    );
  }

  async function tocarLetra(
    linha: number,
    coluna: number
  ) {
    const novaPosicao = {
      linha,
      coluna,
    };

    if (
      posicaoSelecionada(
        linha,
        coluna
      )
    ) {
      setSelecao([]);
      return;
    }

    if (selecao.length > 0) {
      const ultima =
        selecao[
          selecao.length - 1
        ];

      if (
        !posicoesSaoVizinhas(
          ultima,
          novaPosicao
        )
      ) {
        setSelecao([
          novaPosicao,
        ]);

        return;
      }
    }

    const novaSelecao = [
      ...selecao,
      novaPosicao,
    ];

    setSelecao(novaSelecao);

    const palavraFormada =
      novaSelecao
        .map(letraDaPosicao)
        .join('');

    const palavraInvertida =
      palavraFormada
        .split('')
        .reverse()
        .join('');

    const palavraEncontrada =
      fase.palavras.find(
        (palavra) =>
          palavra ===
            palavraFormada ||
          palavra ===
            palavraInvertida
      );

    if (
      palavraEncontrada &&
      !palavrasEncontradas.includes(
        palavraEncontrada
      )
    ) {
      const novasEncontradas = [
        ...palavrasEncontradas,
        palavraEncontrada,
      ];

      setPalavrasEncontradas(
        novasEncontradas
      );

      setSelecao([]);

      if (
        novasEncontradas.length ===
        fase.palavras.length
      ) {
        await concluirFaseCacaPalavras(
          numeroFase
        );

        setTimeout(() => {
          Alert.alert(
            'Fase concluída!',
            'Você encontrou todas as palavras.'
          );
        }, 250);
      }
    }
  }

  function proximaFase() {
    if (
      faseAtual >=
      FASES.length - 1
    ) {
      Alert.alert(
        'Parabéns!',
        'Você chegou à última fase do Caça-Palavras.'
      );

      return;
    }

    setFaseAtual(
      (fase) => fase + 1
    );

    limparFase();
  }

  function faseAnterior() {
    if (faseAtual === 0) {
      return;
    }

    setFaseAtual(
      (fase) => fase - 1
    );

    limparFase();
  }

  function irParaFase(
    index: number
  ) {
    const numero =
      index + 1;

    const desbloqueada =
      numero === 1 ||
      fasesCacaPalavrasConcluidas.includes(
        numero - 1
      ) ||
      fasesCacaPalavrasConcluidas.includes(
        numero
      );

    if (!desbloqueada) {
      Alert.alert(
        'Fase bloqueada',
        'Conclua a fase anterior primeiro.'
      );

      return;
    }

    setFaseAtual(index);
    limparFase();
  }

  const podeAvancar =
    faseConcluida ||
    palavrasEncontradas.length ===
      fase.palavras.length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.backButton}
          onPress={() =>
            router.back()
          }
        >
          <Text
            style={
              styles.backButtonText
            }
          >
            ‹
          </Text>
        </Pressable>

        <Text style={styles.eyebrow}>
          CAÇA-PALAVRAS
        </Text>

        <Text style={styles.title}>
          Fase {numeroFase}
        </Text>

        <Text
          style={styles.phaseTitle}
        >
          {fase.titulo}
        </Text>

        <View
          style={styles.progressCard}
        >
          <View>
            <Text
              style={
                styles.progressLabel
              }
            >
              PROGRESSO
            </Text>

            <Text
              style={
                styles.progressValue
              }
            >
              {progresso} /{' '}
              {FASES.length}
            </Text>
          </View>

          <Text
            style={
              styles.progressPercent
            }
          >
            {porcentagem}%
          </Text>
        </View>

        <View
          style={styles.progressBar}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${porcentagem}%`,
              },
            ]}
          />
        </View>

        <View
          style={
            styles.phaseNavigation
          }
        >
          <Pressable
            style={[
              styles.phaseButton,
              faseAtual === 0 &&
                styles.phaseButtonDisabled,
            ]}
            disabled={
              faseAtual === 0
            }
            onPress={faseAnterior}
          >
            <Text
              style={
                styles.phaseButtonText
              }
            >
              ‹
            </Text>
          </Pressable>

          <View
            style={
              styles.phaseCenter
            }
          >
            <Text
              style={
                styles.phaseNumber
              }
            >
              {numeroFase} /{' '}
              {FASES.length}
            </Text>

            <Text
              style={[
                styles.phaseState,
                faseConcluida
                  ? styles.completeText
                  : styles.pendingText,
              ]}
            >
              {faseConcluida
                ? 'CONCLUÍDA ✓'
                : 'EM ANDAMENTO'}
            </Text>
          </View>

          <Pressable
            style={[
              styles.phaseButton,
              !podeAvancar &&
                styles.phaseButtonDisabled,
            ]}
            disabled={
              !podeAvancar
            }
            onPress={proximaFase}
          >
            <Text
              style={
                styles.phaseButtonText
              }
            >
              ›
            </Text>
          </Pressable>
        </View>

        <View style={styles.board}>
          {fase.grade.map(
            (linha, linhaIndex) => (
              <View
                key={linhaIndex}
                style={styles.boardRow}
              >
                {linha
                  .split('')
                  .map(
                    (
                      letra,
                      colunaIndex
                    ) => {
                      const selecionada =
                        posicaoSelecionada(
                          linhaIndex,
                          colunaIndex
                        );

                      return (
                        <Pressable
                          key={
                            colunaIndex
                          }
                          style={[
                            styles.cell,
                            selecionada &&
                              styles.cellSelected,
                          ]}
                          onPress={() =>
                            tocarLetra(
                              linhaIndex,
                              colunaIndex
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.cellText,
                              selecionada &&
                                styles.cellTextSelected,
                            ]}
                          >
                            {letra}
                          </Text>
                        </Pressable>
                      );
                    }
                  )}
              </View>
            )
          )}
        </View>

        <View
          style={styles.selectionCard}
        >
          <Text
            style={
              styles.selectionLabel
            }
          >
            SELEÇÃO
          </Text>

          <Text
            style={
              styles.selectionText
            }
          >
            {selecao.length > 0
              ? selecao
                  .map(
                    letraDaPosicao
                  )
                  .join('')
              : 'Toque nas letras em sequência'}
          </Text>

          {selecao.length > 0 && (
            <Pressable
              style={
                styles.clearButton
              }
              onPress={() =>
                setSelecao([])
              }
            >
              <Text
                style={
                  styles.clearButtonText
                }
              >
                LIMPAR
              </Text>
            </Pressable>
          )}
        </View>

        <Text
          style={styles.wordsTitle}
        >
          PALAVRAS
        </Text>

        <View
          style={styles.wordsContainer}
        >
          {fase.palavras.map(
            (palavra) => {
              const encontrada =
                palavrasEncontradas.includes(
                  palavra
                );

              return (
                <View
                  key={palavra}
                  style={[
                    styles.wordBadge,
                    encontrada &&
                      styles.wordBadgeFound,
                  ]}
                >
                  <Text
                    style={[
                      styles.wordText,
                      encontrada &&
                        styles.wordTextFound,
                    ]}
                  >
                    {encontrada
                      ? `✓ ${palavra}`
                      : palavra}
                  </Text>
                </View>
              );
            }
          )}
        </View>

        <Text
          style={
            styles.phaseListTitle
          }
        >
          SELECIONAR FASE
        </Text>

        <View
          style={styles.phaseGrid}
        >
          {FASES.map(
            (_, index) => {
              const numero =
                index + 1;

              const concluida =
                fasesCacaPalavrasConcluidas.includes(
                  numero
                );

              const desbloqueada =
                numero === 1 ||
                fasesCacaPalavrasConcluidas.includes(
                  numero - 1
                ) ||
                concluida;

              const atual =
                faseAtual === index;

              return (
                <Pressable
                  key={numero}
                  style={[
                    styles.phaseTile,
                    concluida &&
                      styles.phaseTileComplete,
                    !desbloqueada &&
                      styles.phaseTileLocked,
                    atual &&
                      styles.phaseTileCurrent,
                  ]}
                  onPress={() =>
                    irParaFase(index)
                  }
                >
                  <Text
                    style={[
                      styles.phaseTileText,
                      concluida &&
                        styles.phaseTileTextComplete,
                    ]}
                  >
                    {numero}
                  </Text>

                  <Text
                    style={
                      styles.phaseTileStatus
                    }
                  >
                    {concluida
                      ? '✓'
                      : desbloqueada
                      ? '•'
                      : '🔒'}
                  </Text>
                </Pressable>
              );
            }
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100C24',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 45,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#1D1846',
    borderWidth: 1,
    borderColor: '#372C6E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  backButtonText: {
    color: '#FFECB3',
    fontSize: 34,
    lineHeight: 36,
  },

  eyebrow: {
    color: '#3DDC84',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },

  title: {
    color: '#FFECB3',
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 5,
  },

  phaseTitle: {
    color: '#ABA4D9',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 18,
  },

  progressCard: {
    backgroundColor: '#1D1846',
    borderWidth: 1,
    borderColor: '#372C6E',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  progressLabel: {
    color: '#ABA4D9',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  progressValue: {
    color: '#FFECB3',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 3,
  },

  progressPercent: {
    color: '#3DDC84',
    fontSize: 21,
    fontWeight: '900',
  },

  progressBar: {
    height: 7,
    backgroundColor: '#332B66',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 9,
    marginBottom: 20,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#3DDC84',
  },

  phaseNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },

  phaseButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#241B57',
    borderWidth: 1,
    borderColor: '#372C6E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  phaseButtonDisabled: {
    opacity: 0.3,
  },

  phaseButtonText: {
    color: '#FFECB3',
    fontSize: 30,
  },

  phaseCenter: {
    alignItems: 'center',
  },

  phaseNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  phaseState: {
    fontSize: 9,
    fontWeight: '900',
    marginTop: 4,
  },

  completeText: {
    color: '#3ED598',
  },

  pendingText: {
    color: '#ABA4D9',
  },

  board: {
    backgroundColor: '#241B57',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#372C6E',
    padding: 10,
    alignItems: 'center',
  },

  boardRow: {
    flexDirection: 'row',
  },

  cell: {
    width: 45,
    height: 45,
    margin: 2,
    borderRadius: 9,
    backgroundColor: '#1D1846',
    borderWidth: 1,
    borderColor: '#372C6E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cellSelected: {
    backgroundColor: '#3DDC84',
    borderColor: '#3DDC84',
  },

  cellText: {
    color: '#EDEBFF',
    fontSize: 18,
    fontWeight: '900',
  },

  cellTextSelected: {
    color: '#FFFFFF',
  },

  selectionCard: {
    backgroundColor: '#1D1846',
    borderWidth: 1,
    borderColor: '#372C6E',
    borderRadius: 15,
    padding: 15,
    marginTop: 18,
    alignItems: 'center',
  },

  selectionLabel: {
    color: '#756FA3',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  selectionText: {
    color: '#FFECB3',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 7,
  },

  clearButton: {
    marginTop: 10,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 14,
    borderBottomWidth: 3,
    borderBottomColor: '#170F35',
    backgroundColor: '#2A2160',
  },

  clearButtonText: {
    color: '#3DDC84',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  wordsTitle: {
    color: '#756FA3',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginTop: 25,
    marginBottom: 10,
  },

  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  wordBadge: {
    backgroundColor: '#1D1846',
    borderWidth: 1,
    borderColor: '#372C6E',
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  wordBadgeFound: {
    backgroundColor: '#123626',
    borderColor: '#1E8F63',
  },

  wordText: {
    color: '#ABA4D9',
    fontSize: 11,
    fontWeight: '800',
  },

  wordTextFound: {
    color: '#3ED598',
  },

  phaseListTitle: {
    color: '#756FA3',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginTop: 32,
    marginBottom: 12,
  },

  phaseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },

  phaseTile: {
    width: '17.5%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#1D1846',
    borderWidth: 1,
    borderColor: '#372C6E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  phaseTileComplete: {
    backgroundColor: '#123626',
    borderColor: '#1E8F63',
  },

  phaseTileLocked: {
    opacity: 0.35,
  },

  phaseTileCurrent: {
    borderColor: '#3DDC84',
    borderWidth: 2,
  },

  phaseTileText: {
    color: '#FFECB3',
    fontSize: 15,
    fontWeight: '900',
  },

  phaseTileTextComplete: {
    color: '#3ED598',
  },

  phaseTileStatus: {
    color: '#ABA4D9',
    fontSize: 10,
    marginTop: 2,
  },
});