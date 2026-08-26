import { router } from 'expo-router';
import {
    useMemo,
    useState,
} from 'react';

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

const FASES = [
  'AMIGO',
  'BANCO',
  'CARTA',
  'DENTE',
  'FESTA',
  'GRAMA',
  'HOTEL',
  'JOVEM',
  'LIMAO',
  'MUNDO',
  'NOITE',
  'PEDRA',
  'QUASE',
  'ROUPA',
  'SALTO',
  'TERRA',
  'VERDE',
  'CARRO',
  'FRUTA',
  'LIVRO',
  'NUVEM',
  'PORTA',
  'CAMPO',
  'PRAIA',
  'SONHO',
  'VENTO',
  'BARCO',
  'FAROL',
  'VIDRO',
  'LINHA',
  'PRATO',
  'CORPO',
  'TEMPO',
  'FORTE',
  'PLANO',
  'BRISA',
  'TRONO',
  'CLARO',
  'CINZA',
  'MAGIA',
  'HONRA',
  'RAIOS',
  'RISOS',
  'BOLSA',
  'CANTO',
  'MARCA',
  'FALAR',
  'PEDIR',
  'MORAR',
  'PODER',
];

function embaralharPalavra(
  palavra: string
) {
  const original = palavra.split('');

  for (let tentativa = 0; tentativa < 20; tentativa++) {
    const letras = [...original];

    for (
      let i = letras.length - 1;
      i > 0;
      i--
    ) {
      const j = Math.floor(
        Math.random() * (i + 1)
      );

      [letras[i], letras[j]] = [
        letras[j],
        letras[i],
      ];
    }

    const resultado = letras.join('');

    if (resultado !== palavra) {
      return resultado;
    }
  }

  return (
    palavra.slice(1) +
    palavra.charAt(0)
  );
}

export default function ScrambledWordScreen() {
  const {
    fasesEmbaralhadaConcluidas,
    concluirFaseEmbaralhada,
    faseEmbaralhadaEstaConcluida,
  } = useGame();

  const primeiraNaoConcluida = useMemo(() => {
    const indice = FASES.findIndex(
      (_, index) =>
        !fasesEmbaralhadaConcluidas.includes(
          index + 1
        )
    );

    return indice === -1
      ? FASES.length
      : indice;
  }, [fasesEmbaralhadaConcluidas]);

  const [faseAtual, setFaseAtual] =
    useState(
      Math.min(
        primeiraNaoConcluida,
        FASES.length - 1
      )
    );

  const [entrada, setEntrada] =
    useState('');

  const [venceu, setVenceu] =
    useState(false);

  const [erros, setErros] =
    useState(0);

  const numeroFase =
    faseAtual + 1;

  const palavraSecreta =
    FASES[faseAtual];

  const palavraEmbaralhada =
    useMemo(
      () =>
        embaralharPalavra(
          palavraSecreta
        ),
      [palavraSecreta]
    );

  const faseConcluida =
    faseEmbaralhadaEstaConcluida(
      numeroFase
    );

  const progresso =
    fasesEmbaralhadaConcluidas.length;

  const porcentagem =
    Math.round(
      (progresso / FASES.length) *
        100
    );

  function limparRodada() {
    setEntrada('');
    setVenceu(false);
    setErros(0);
  }

  async function verificarResposta() {
    if (venceu) {
      return;
    }

    const resposta =
      entrada
        .trim()
        .toUpperCase();

    if (resposta.length !== 5) {
      Alert.alert(
        'Resposta inválida',
        'Digite uma palavra com exatamente 5 letras.'
      );

      return;
    }

    if (
      resposta !== palavraSecreta
    ) {
      setErros(
        (valor) => valor + 1
      );

      setEntrada('');

      Alert.alert(
        'Ainda não!',
        'Tente reorganizar as letras novamente.'
      );

      return;
    }

    setVenceu(true);

    const primeiraConclusao =
      await concluirFaseEmbaralhada(
        numeroFase
      );

    setTimeout(() => {
      Alert.alert(
        primeiraConclusao
          ? 'Fase concluída!'
          : 'Muito bem!',
        primeiraConclusao
          ? `Você concluiu a fase ${numeroFase}.`
          : 'Você já havia concluído esta fase.'
      );
    }, 250);
  }

  function proximaFase() {
    if (
      faseAtual >=
      FASES.length - 1
    ) {
      Alert.alert(
        'Parabéns!',
        'Você concluiu a última fase do Palavra Embaralhada.'
      );

      return;
    }

    setFaseAtual(
      (fase) => fase + 1
    );

    limparRodada();
  }

  function faseAnterior() {
    if (faseAtual === 0) {
      return;
    }

    setFaseAtual(
      (fase) => fase - 1
    );

    limparRodada();
  }

  function irParaFase(
    index: number
  ) {
    const numero =
      index + 1;

    const desbloqueada =
      numero === 1 ||
      fasesEmbaralhadaConcluidas.includes(
        numero - 1
      ) ||
      fasesEmbaralhadaConcluidas.includes(
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

    limparRodada();
  }

  const podeAvancar =
    venceu ||
    faseEmbaralhadaEstaConcluida(
      numeroFase
    );

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

        <Text
          style={styles.eyebrow}
        >
          PALAVRA EMBARALHADA
        </Text>

        <Text
          style={styles.title}
        >
          Fase {numeroFase}
        </Text>

        <Text
          style={styles.description}
        >
          Reorganize as letras e descubra a palavra correta.
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
                styles.disabledPhaseButton,
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
                : 'NÃO CONCLUÍDA'}
            </Text>
          </View>

          <Pressable
            style={[
              styles.phaseButton,
              !podeAvancar &&
                styles.disabledPhaseButton,
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
            styles.scrambledArea
          }
        >
          <Text
            style={
              styles.scrambledLabel
            }
          >
            ORGANIZE AS LETRAS
          </Text>

          <View
            style={
              styles.lettersRow
            }
          >
            {palavraEmbaralhada
              .split('')
              .map(
                (
                  letra,
                  index
                ) => (
                  <View
                    key={index}
                    style={
                      styles.letterBox
                    }
                  >
                    <Text
                      style={
                        styles.letter
                      }
                    >
                      {letra}
                    </Text>
                  </View>
                )
              )}
          </View>
        </View>

        {!venceu ? (
          <>
            <TextInput
              style={styles.input}
              value={entrada}
              onChangeText={(
                texto
              ) =>
                setEntrada(
                  texto
                    .replace(
                      /[^a-zA-ZÀ-ÿ]/g,
                      ''
                    )
                    .slice(0, 5)
                    .toUpperCase()
                )
              }
              placeholder="DIGITE A PALAVRA"
              placeholderTextColor="#5F7683"
              maxLength={5}
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

            <Text
              style={
                styles.errorCounter
              }
            >
              Tentativas erradas:{' '}
              {erros}
            </Text>
          </>
        ) : (
          <View
            style={
              styles.resultContainer
            }
          >
            <Text
              style={
                styles.resultTitle
              }
            >
              FASE CONCLUÍDA ✓
            </Text>

            <Text
              style={
                styles.answerText
              }
            >
              {palavraSecreta}
            </Text>

            <Pressable
              style={
                styles.retryButton
              }
              onPress={
                limparRodada
              }
            >
              <Text
                style={
                  styles.retryButtonText
                }
              >
                JOGAR NOVAMENTE
              </Text>
            </Pressable>

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
                fasesEmbaralhadaConcluidas.includes(
                  numero
                );

              const desbloqueada =
                numero === 1 ||
                fasesEmbaralhadaConcluidas.includes(
                  numero - 1
                ) ||
                concluida;

              const atual =
                index ===
                faseAtual;

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

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#051824',
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
      backgroundColor: '#0F2530',
      borderWidth: 1,
      borderColor: '#3b5265',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },

    backButtonText: {
      color: '#EAF6F2',
      fontSize: 34,
      lineHeight: 36,
    },

    eyebrow: {
      color: '#27e9b5',
      fontSize: 11,
      fontWeight: '900',
      letterSpacing: 2,
      textAlign: 'center',
    },

    title: {
      color: '#EAF6F2',
      fontSize: 30,
      fontWeight: '900',
      textAlign: 'center',
      marginTop: 5,
    },

    description: {
      color: '#8CA3AE',
      fontSize: 14,
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 18,
    },

    progressCard: {
      backgroundColor: '#0F2530',
      borderWidth: 1,
      borderColor: '#3b5265',
      borderRadius: 15,
      padding: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    progressLabel: {
      color: '#8CA3AE',
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 1.3,
    },

    progressValue: {
      color: '#EAF6F2',
      fontSize: 20,
      fontWeight: '900',
      marginTop: 3,
    },

    progressPercent: {
      color: '#27e9b5',
      fontSize: 21,
      fontWeight: '900',
    },

    progressBar: {
      height: 7,
      backgroundColor: '#3b5265',
      borderRadius: 20,
      overflow: 'hidden',
      marginTop: 9,
      marginBottom: 20,
    },

    progressFill: {
      height: '100%',
      backgroundColor: '#27e9b5',
      borderRadius: 20,
    },

    phaseNavigation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 25,
    },

    phaseButton: {
      width: 46,
      height: 46,
      borderRadius: 14,
      backgroundColor: '#162936',
      borderWidth: 1,
      borderColor: '#3b5265',
      alignItems: 'center',
      justifyContent: 'center',
    },

    disabledPhaseButton: {
      opacity: 0.3,
    },

    phaseButtonText: {
      color: '#EAF6F2',
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
      color: '#27e9b5',
    },

    pendingText: {
      color: '#8CA3AE',
    },

    scrambledArea: {
      backgroundColor: '#162936',
      borderWidth: 1,
      borderColor: '#3b5265',
      borderRadius: 20,
      padding: 22,
      alignItems: 'center',
    },

    scrambledLabel: {
      color: '#5F7683',
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 1.5,
      marginBottom: 18,
    },

    lettersRow: {
      flexDirection: 'row',
      gap: 8,
    },

    letterBox: {
      width: 49,
      height: 55,
      borderRadius: 12,
      backgroundColor: '#27e9b5',
      alignItems: 'center',
      justifyContent: 'center',
    },

    letter: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: '900',
    },

    input: {
      height: 54,
      backgroundColor: '#0F2530',
      borderWidth: 1,
      borderColor: '#3b5265',
      borderRadius: 14,
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '800',
      letterSpacing: 2,
      textAlign: 'center',
      marginTop: 22,
    },

    confirmButton: {
      height: 54,
      backgroundColor: '#27e9b5',
      borderRadius: 18,
      borderBottomWidth: 5,
      borderBottomColor: '#159E82',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 12,
    },

    confirmButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '900',
      letterSpacing: 1.5,
    },

    errorCounter: {
      color: '#5F7683',
      fontSize: 11,
      textAlign: 'center',
      marginTop: 12,
    },

    resultContainer: {
      alignItems: 'center',
      marginTop: 25,
    },

    resultTitle: {
      color: '#27e9b5',
      fontSize: 19,
      fontWeight: '900',
    },

    answerText: {
      color: '#EAF6F2',
      fontSize: 27,
      fontWeight: '900',
      letterSpacing: 3,
      marginTop: 10,
    },

    retryButton: {
      backgroundColor: '#162936',
      borderWidth: 2,
      borderColor: '#3b5265',
      borderBottomWidth: 5,
      borderBottomColor: '#0A1F2C',
      borderRadius: 16,
      paddingHorizontal: 24,
      paddingVertical: 14,
      marginTop: 18,
    },

    retryButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '900',
      letterSpacing: 1,
    },

    nextButton: {
      backgroundColor: '#27e9b5',
      borderRadius: 16,
      borderBottomWidth: 5,
      borderBottomColor: '#159E82',
      paddingHorizontal: 28,
      paddingVertical: 14,
      marginTop: 10,
    },

    nextButtonText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '900',
      letterSpacing: 1,
    },

    phaseListTitle: {
      color: '#5F7683',
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
      backgroundColor: '#0F2530',
      borderWidth: 1,
      borderColor: '#3b5265',
      alignItems: 'center',
      justifyContent: 'center',
    },

    phaseTileComplete: {
      borderColor: '#159E82',
      backgroundColor: '#0E3A32',
    },

    phaseTileLocked: {
      opacity: 0.35,
    },

    phaseTileCurrent: {
      borderColor: '#27e9b5',
      borderWidth: 2,
    },

    phaseTileText: {
      color: '#EAF6F2',
      fontSize: 15,
      fontWeight: '900',
    },

    phaseTileTextComplete: {
      color: '#27e9b5',
    },

    phaseTileStatus: {
      color: '#8CA3AE',
      fontSize: 10,
      marginTop: 2,
    },
  });