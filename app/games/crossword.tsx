import { router } from 'expo-router';
import { useMemo, useState } from 'react';

import {
    Alert,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { useGame } from '@/context/GameContext';

type Palavra = {
  resposta: string;
  pista: string;
};

type Fase = {
  titulo: string;
  palavras: Palavra[];
};

const FASES: Fase[] = [
  {
    titulo: 'Começando',
    palavras: [
      {
        resposta: 'CASA',
        pista: 'Lugar onde uma pessoa mora.',
      },
      {
        resposta: 'GATO',
        pista: 'Animal doméstico que mia.',
      },
      {
        resposta: 'LUA',
        pista: 'Satélite natural da Terra.',
      },
      {
        resposta: 'MAR',
        pista: 'Grande extensão de água salgada.',
      },
    ],
  },

  {
    titulo: 'Natureza',
    palavras: [
      {
        resposta: 'FLOR',
        pista: 'Parte colorida de muitas plantas.',
      },
      {
        resposta: 'RIO',
        pista: 'Curso natural de água.',
      },
      {
        resposta: 'SOL',
        pista: 'Estrela do nosso sistema.',
      },
      {
        resposta: 'MATA',
        pista: 'Área coberta por vegetação.',
      },
    ],
  },

  {
    titulo: 'Objetos',
    palavras: [
      {
        resposta: 'MESA',
        pista: 'Móvel usado para apoiar objetos.',
      },
      {
        resposta: 'COPO',
        pista: 'Usado para beber líquidos.',
      },
      {
        resposta: 'LIVRO',
        pista: 'Possui páginas para leitura.',
      },
      {
        resposta: 'CHAVE',
        pista: 'Pode abrir uma fechadura.',
      },
    ],
  },

  {
    titulo: 'Animais',
    palavras: [
      {
        resposta: 'LOBO',
        pista: 'Canídeo selvagem.',
      },
      {
        resposta: 'URSO',
        pista: 'Grande mamífero peludo.',
      },
      {
        resposta: 'PATO',
        pista: 'Ave que costuma nadar.',
      },
      {
        resposta: 'RATO',
        pista: 'Pequeno roedor.',
      },
    ],
  },

  {
    titulo: 'Alimentos',
    palavras: [
      {
        resposta: 'ARROZ',
        pista: 'Grão muito consumido no Brasil.',
      },
      {
        resposta: 'PAO',
        pista: 'Alimento feito geralmente com farinha.',
      },
      {
        resposta: 'MEL',
        pista: 'Alimento doce produzido por abelhas.',
      },
      {
        resposta: 'UVA',
        pista: 'Fruta utilizada para produzir vinho.',
      },
    ],
  },

  {
    titulo: 'Cidade',
    palavras: [
      {
        resposta: 'RUA',
        pista: 'Via pública entre prédios e casas.',
      },
      {
        resposta: 'PONTE',
        pista: 'Estrutura que atravessa rios ou vales.',
      },
      {
        resposta: 'PRACA',
        pista: 'Espaço público aberto numa cidade.',
      },
      {
        resposta: 'METRO',
        pista: 'Transporte urbano sobre trilhos.',
      },
    ],
  },

  {
    titulo: 'Escola',
    palavras: [
      {
        resposta: 'LAPIS',
        pista: 'Usado para escrever ou desenhar.',
      },
      {
        resposta: 'AULA',
        pista: 'Momento dedicado ao ensino.',
      },
      {
        resposta: 'PROVA',
        pista: 'Avaliação de conhecimentos.',
      },
      {
        resposta: 'NOTA',
        pista: 'Resultado de uma avaliação.',
      },
    ],
  },

  {
    titulo: 'Viagem',
    palavras: [
      {
        resposta: 'AVIAO',
        pista: 'Meio de transporte que voa.',
      },
      {
        resposta: 'MAPA',
        pista: 'Representação de uma região.',
      },
      {
        resposta: 'HOTEL',
        pista: 'Lugar para hospedagem.',
      },
      {
        resposta: 'MALA',
        pista: 'Usada para transportar roupas numa viagem.',
      },
    ],
  },

  {
    titulo: 'Tempo',
    palavras: [
      {
        resposta: 'CHUVA',
        pista: 'Água que cai das nuvens.',
      },
      {
        resposta: 'VENTO',
        pista: 'Movimento do ar.',
      },
      {
        resposta: 'NUVEM',
        pista: 'Conjunto de gotículas suspensas no céu.',
      },
      {
        resposta: 'FRIO',
        pista: 'Contrário de calor.',
      },
    ],
  },

  {
    titulo: 'Desafio Final',
    palavras: [
      {
        resposta: 'TEMPO',
        pista: 'Pode ser medido em horas e minutos.',
      },
      {
        resposta: 'MUNDO',
        pista: 'O planeta ou tudo que existe nele.',
      },
      {
        resposta: 'SONHO',
        pista: 'Pode acontecer enquanto dormimos.',
      },
      {
        resposta: 'IDEIA',
        pista: 'Pensamento ou conceito criado pela mente.',
      },
    ],
  },
];

export default function CrosswordScreen() {
  const {
    fasesCruzadasConcluidas,
    concluirFaseCruzada,
    faseCruzadaEstaConcluida,
  } = useGame();

  const primeiraNaoConcluida =
    useMemo(() => {
      const indice = FASES.findIndex(
        (_, index) =>
          !fasesCruzadasConcluidas.includes(
            index + 1
          )
      );

      return indice === -1
        ? FASES.length
        : indice;
    }, [fasesCruzadasConcluidas]);

  const [faseAtual, setFaseAtual] =
    useState(
      Math.min(
        primeiraNaoConcluida,
        FASES.length - 1
      )
    );

  const [indiceSelecionado, setIndiceSelecionado] =
    useState(0);

  const [entrada, setEntrada] =
    useState('');

  const [resolvidas, setResolvidas] =
    useState<number[]>([]);

  const numeroFase = faseAtual + 1;

  const fase = FASES[faseAtual];

  const faseConcluida =
    faseCruzadaEstaConcluida(
      numeroFase
    );

  const progresso =
    fasesCruzadasConcluidas.length;

  const porcentagem = Math.round(
    (progresso / FASES.length) * 100
  );

  const todasResolvidas =
    resolvidas.length ===
    fase.palavras.length;

  function limparFase() {
    setEntrada('');
    setResolvidas([]);
    setIndiceSelecionado(0);
  }

  async function verificarResposta() {
    const palavra =
      fase.palavras[indiceSelecionado];

    const resposta =
      entrada
        .trim()
        .toUpperCase()
        .normalize('NFD')
        .replace(
          /[\u0300-\u036f]/g,
          ''
        );

    const correta =
      palavra.resposta
        .toUpperCase()
        .normalize('NFD')
        .replace(
          /[\u0300-\u036f]/g,
          ''
        );

    if (!resposta) {
      Alert.alert(
        'Digite uma resposta',
        'Preencha a palavra antes de confirmar.'
      );

      return;
    }

    if (resposta !== correta) {
      Alert.alert(
        'Resposta incorreta',
        'Tente novamente.'
      );

      return;
    }

    const novasResolvidas =
      resolvidas.includes(
        indiceSelecionado
      )
        ? resolvidas
        : [
            ...resolvidas,
            indiceSelecionado,
          ];

    setResolvidas(
      novasResolvidas
    );

    setEntrada('');

    const proximoIndice =
      fase.palavras.findIndex(
        (_, index) =>
          !novasResolvidas.includes(
            index
          )
      );

    if (proximoIndice !== -1) {
      setIndiceSelecionado(
        proximoIndice
      );
    }

    if (
      novasResolvidas.length ===
      fase.palavras.length
    ) {
      await concluirFaseCruzada(
        numeroFase
      );

      setTimeout(() => {
        Alert.alert(
          'Fase concluída!',
          'Você resolveu todas as palavras.'
        );
      }, 250);
    }
  }

  function proximaFase() {
    if (
      faseAtual >=
      FASES.length - 1
    ) {
      Alert.alert(
        'Parabéns!',
        'Você chegou à última fase.'
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
      fasesCruzadasConcluidas.includes(
        numero - 1
      ) ||
      fasesCruzadasConcluidas.includes(
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
    todasResolvidas ||
    faseConcluida;

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
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
          PALAVRAS CRUZADAS
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

        <View
          style={
            styles.crosswordBoard
          }
        >
          {fase.palavras.map(
            (palavra, index) => {
              const resolvida =
                resolvidas.includes(
                  index
                );

              const selecionada =
                indiceSelecionado ===
                index;

              return (
                <Pressable
                  key={index}
                  style={[
                    styles.wordRow,
                    selecionada &&
                      styles.wordRowSelected,
                    resolvida &&
                      styles.wordRowSolved,
                  ]}
                  onPress={() => {
                    setIndiceSelecionado(
                      index
                    );

                    setEntrada('');
                  }}
                >
                  <View
                    style={
                      styles.wordNumber
                    }
                  >
                    <Text
                      style={
                        styles.wordNumberText
                      }
                    >
                      {index + 1}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.cellsRow
                    }
                  >
                    {palavra.resposta
                      .split('')
                      .map(
                        (
                          letra,
                          cellIndex
                        ) => (
                          <View
                            key={
                              cellIndex
                            }
                            style={[
                              styles.cell,
                              resolvida &&
                                styles.cellSolved,
                            ]}
                          >
                            <Text
                              style={
                                styles.cellText
                              }
                            >
                              {resolvida
                                ? letra
                                : ''}
                            </Text>
                          </View>
                        )
                      )}
                  </View>
                </Pressable>
              );
            }
          )}
        </View>

        <View
          style={styles.clueCard}
        >
          <Text
            style={styles.clueLabel}
          >
            PISTA{' '}
            {indiceSelecionado + 1}
          </Text>

          <Text
            style={styles.clueText}
          >
            {
              fase.palavras[
                indiceSelecionado
              ].pista
            }
          </Text>
        </View>

        {!todasResolvidas && (
          <>
            <TextInput
              style={styles.input}
              value={entrada}
              onChangeText={(texto) =>
                setEntrada(
                  texto
                    .replace(
                      /[^a-zA-ZÀ-ÿ]/g,
                      ''
                    )
                    .toUpperCase()
                )
              }
              placeholder="DIGITE A RESPOSTA"
              placeholderTextColor="#756FA3"
              autoCapitalize="characters"
              returnKeyType="done"
              onSubmitEditing={
                verificarResposta
              }
            />

            <Pressable
              style={
                styles.confirmButton
              }
              onPress={
                verificarResposta
              }
            >
              <Text
                style={
                  styles.confirmButtonText
                }
              >
                CONFIRMAR
              </Text>
            </Pressable>
          </>
        )}

        {todasResolvidas && (
          <View
            style={
              styles.completeCard
            }
          >
            <Text
              style={
                styles.completeTitle
              }
            >
              FASE CONCLUÍDA ✓
            </Text>

            <Text
              style={
                styles.completeDescription
              }
            >
              Todas as palavras foram resolvidas.
            </Text>

            {faseAtual <
              FASES.length - 1 && (
              <Pressable
                style={
                  styles.nextButton
                }
                onPress={
                  proximaFase
                }
              >
                <Text
                  style={
                    styles.nextButtonText
                  }
                >
                  PRÓXIMA FASE
                </Text>
              </Pressable>
            )}
          </View>
        )}

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
                fasesCruzadasConcluidas.includes(
                  numero
                );

              const desbloqueada =
                numero === 1 ||
                fasesCruzadasConcluidas.includes(
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
                    irParaFase(
                      index
                    )
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
    color: '#4EA1FF',
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
    color: '#4EA1FF',
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
    backgroundColor: '#4EA1FF',
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

  crosswordBoard: {
    gap: 10,
  },

  wordRow: {
    backgroundColor: '#241B57',
    borderWidth: 1,
    borderColor: '#372C6E',
    borderRadius: 14,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  wordRowSelected: {
    borderColor: '#4EA1FF',
  },

  wordRowSolved: {
    borderColor: '#1E8F63',
    backgroundColor: '#123626',
  },

  wordNumber: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#2A2160',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  wordNumberText: {
    color: '#4EA1FF',
    fontSize: 11,
    fontWeight: '900',
  },

  cellsRow: {
    flexDirection: 'row',
    gap: 4,
    flexShrink: 1,
  },

  cell: {
    width: 32,
    height: 36,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#372C6E',
    backgroundColor: '#1D1846',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cellSolved: {
    backgroundColor: '#123626',
    borderColor: '#1E8F63',
  },

  cellText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  clueCard: {
    backgroundColor: '#1D1846',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#372C6E',
    padding: 17,
    marginTop: 22,
  },

  clueLabel: {
    color: '#4EA1FF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  clueText: {
    color: '#FFECB3',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
    marginTop: 7,
  },

  input: {
    height: 54,
    backgroundColor: '#1D1846',
    borderWidth: 1,
    borderColor: '#372C6E',
    borderRadius: 14,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 15,
  },

  confirmButton: {
    height: 54,
    backgroundColor: '#4EA1FF',
    borderRadius: 18,
    borderBottomWidth: 5,
    borderBottomColor: '#2A6FC2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },

  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  completeCard: {
    alignItems: 'center',
    marginTop: 25,
  },

  completeTitle: {
    color: '#3ED598',
    fontSize: 19,
    fontWeight: '900',
  },

  completeDescription: {
    color: '#ABA4D9',
    fontSize: 13,
    marginTop: 7,
  },

  nextButton: {
    backgroundColor: '#4EA1FF',
    borderRadius: 16,
    borderBottomWidth: 5,
    borderBottomColor: '#2A6FC2',
    paddingHorizontal: 28,
    paddingVertical: 14,
    marginTop: 15,
  },

  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
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
    borderColor: '#4EA1FF',
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