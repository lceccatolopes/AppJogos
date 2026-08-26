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

const MAX_TENTATIVAS = 6;

const FASES = [
  'CASAS',
  'PEDRA',
  'FOLHA',
  'LIVRO',
  'NUVEM',
  'CHUVA',
  'CAMPO',
  'PORTA',
  'PRATO',
  'MUNDO',
  'NOITE',
  'VERDE',
  'TERRA',
  'PRAIA',
  'FESTA',
  'CARTA',
  'PONTE',
  'GRAMA',
  'CORPO',
  'TEMPO',
  'FORTE',
  'PLANO',
  'SONHO',
  'LUZES',
  'VENTO',
  'BOLSA',
  'LINHA',
  'FRUTA',
  'RISOS',
  'CARRO',
  'BARCO',
  'FAROL',
  'MARCA',
  'CANTO',
  'PODER',
  'VIDRO',
  'SALTO',
  'PEDIR',
  'FALAR',
  'MORAR',
  'BRISA',
  'TRONO',
  'FLORA',
  'NEGRO',
  'CLARO',
  'CINZA',
  'MAGIA',
  'HONRA',
  'RAIOS',
  'ARCAN',
];

type ResultadoLetra = 'correta' | 'existe' | 'errada';

type Tentativa = {
  palavra: string;
  resultado: ResultadoLetra[];
};

export default function WordGameScreen() {
  const {
    fasesPalavraConcluidas,
    concluirFasePalavra,
    fasePalavraEstaConcluida,
  } = useGame();

  const primeiraFaseNaoConcluida = useMemo(() => {
    const indice = FASES.findIndex(
      (_, index) =>
        !fasesPalavraConcluidas.includes(index + 1)
    );

    return indice === -1 ? FASES.length : indice;
  }, [fasesPalavraConcluidas]);

  const [faseAtual, setFaseAtual] = useState(
    Math.min(
      primeiraFaseNaoConcluida,
      FASES.length - 1
    )
  );

  const [entrada, setEntrada] = useState('');
  const [tentativas, setTentativas] = useState<Tentativa[]>([]);
  const [venceu, setVenceu] = useState(false);

  const numeroFase = faseAtual + 1;
  const palavraSecreta = FASES[faseAtual];

  const faseJaConcluida =
    fasePalavraEstaConcluida(numeroFase);

  function verificarPalavra(
    palavra: string
  ): ResultadoLetra[] {
    const palavraDigitada = palavra.toUpperCase();
    const secreta = palavraSecreta.toUpperCase();

    const resultado: ResultadoLetra[] =
      Array(5).fill('errada');

    const letrasDisponiveis = secreta.split('');

    for (let i = 0; i < 5; i++) {
      if (palavraDigitada[i] === secreta[i]) {
        resultado[i] = 'correta';
        letrasDisponiveis[i] = '';
      }
    }

    for (let i = 0; i < 5; i++) {
      if (resultado[i] === 'correta') {
        continue;
      }

      const indice =
        letrasDisponiveis.indexOf(
          palavraDigitada[i]
        );

      if (indice !== -1) {
        resultado[i] = 'existe';
        letrasDisponiveis[indice] = '';
      }
    }

    return resultado;
  }

  function limparTentativaAtual() {
    setEntrada('');
    setTentativas([]);
    setVenceu(false);
  }

  async function enviarTentativa() {
    if (venceu) {
      return;
    }

    const palavra =
      entrada.trim().toUpperCase();

    if (palavra.length !== 5) {
      Alert.alert(
        'Palavra inválida',
        'Digite uma palavra com exatamente 5 letras.'
      );

      return;
    }

    const resultado =
      verificarPalavra(palavra);

    const novasTentativas = [
      ...tentativas,
      {
        palavra,
        resultado,
      },
    ];

    setTentativas(novasTentativas);
    setEntrada('');

    if (palavra === palavraSecreta) {
      setVenceu(true);

      const foiPrimeiraConclusao =
        await concluirFasePalavra(
          numeroFase
        );

      setTimeout(() => {
        Alert.alert(
          foiPrimeiraConclusao
            ? 'Fase concluída!'
            : 'Fase concluída novamente!',
          foiPrimeiraConclusao
            ? `Você concluiu a fase ${numeroFase}.`
            : 'Esta fase já fazia parte do seu progresso.'
        );
      }, 300);

      return;
    }

    if (
      novasTentativas.length >=
      MAX_TENTATIVAS
    ) {
      setTimeout(() => {
        Alert.alert(
          'Fim da tentativa',
          `A palavra era ${palavraSecreta}.`
        );
      }, 300);
    }
  }

  function proximaFase() {
    if (faseAtual >= FASES.length - 1) {
      Alert.alert(
        'Parabéns!',
        'Você chegou à última fase do Palavra Oculta.'
      );

      return;
    }

    setFaseAtual((fase) => fase + 1);
    limparTentativaAtual();
  }

  function faseAnterior() {
    if (faseAtual <= 0) {
      return;
    }

    setFaseAtual((fase) => fase - 1);
    limparTentativaAtual();
  }

  function irParaFase(index: number) {
    const numero = index + 1;

    const desbloqueada =
      numero === 1 ||
      fasesPalavraConcluidas.includes(
        numero - 1
      ) ||
      fasesPalavraConcluidas.includes(
        numero
      );

    if (!desbloqueada) {
      Alert.alert(
        'Fase bloqueada',
        'Conclua a fase anterior para desbloquear esta.'
      );

      return;
    }

    setFaseAtual(index);
    limparTentativaAtual();
  }

  function corDaLetra(
    resultado: ResultadoLetra
  ) {
    if (resultado === 'correta') {
      return '#27e9b5';
    }

    if (resultado === 'existe') {
      return '#3b5265';
    }

    return '#162936';
  }

  const perdeu =
    tentativas.length >=
      MAX_TENTATIVAS &&
    !venceu;

  const jogoFinalizado =
    venceu || perdeu;

  const podeIrParaProxima =
    venceu ||
    fasePalavraEstaConcluida(
      numeroFase
    );

  const progresso =
    fasesPalavraConcluidas.length;

  const porcentagem =
    Math.round(
      (progresso / FASES.length) * 100
    );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topBar}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>
              ‹
            </Text>
          </Pressable>
        </View>

        <Text style={styles.smallTitle}>
          PALAVRA OCULTA
        </Text>

        <Text style={styles.title}>
          Fase {numeroFase}
        </Text>

        <Text style={styles.description}>
          Descubra a palavra de 5 letras em até 6 tentativas.
        </Text>

        <View style={styles.progressCard}>
          <View>
            <Text style={styles.progressLabel}>
              PROGRESSO
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
              {
                width: `${porcentagem}%`,
              },
            ]}
          />
        </View>

        <View style={styles.phaseNavigation}>
          <Pressable
            style={[
              styles.phaseButton,
              faseAtual === 0 &&
                styles.phaseButtonDisabled,
            ]}
            onPress={faseAnterior}
            disabled={faseAtual === 0}
          >
            <Text style={styles.phaseButtonText}>
              ‹
            </Text>
          </Pressable>

          <View style={styles.phaseStatus}>
            <Text style={styles.phaseStatusLabel}>
              FASE
            </Text>

            <Text style={styles.phaseStatusValue}>
              {numeroFase} / {FASES.length}
            </Text>

            <Text
              style={[
                styles.phaseState,
                faseJaConcluida
                  ? styles.phaseComplete
                  : styles.phasePending,
              ]}
            >
              {faseJaConcluida
                ? 'CONCLUÍDA ✓'
                : 'NÃO CONCLUÍDA'}
            </Text>
          </View>

          <Pressable
            style={[
              styles.phaseButton,
              !podeIrParaProxima &&
                styles.phaseButtonDisabled,
            ]}
            onPress={proximaFase}
            disabled={!podeIrParaProxima}
          >
            <Text style={styles.phaseButtonText}>
              ›
            </Text>
          </Pressable>
        </View>

        <View style={styles.board}>
          {Array.from({
            length: MAX_TENTATIVAS,
          }).map((_, linha) => {
            const tentativa =
              tentativas[linha];

            return (
              <View
                key={linha}
                style={styles.row}
              >
                {Array.from({
                  length: 5,
                }).map((_, coluna) => {
                  const letra =
                    tentativa?.palavra[
                      coluna
                    ] ?? '';

                  const resultado =
                    tentativa?.resultado[
                      coluna
                    ];

                  return (
                    <View
                      key={coluna}
                      style={[
                        styles.letterBox,
                        resultado && {
                          backgroundColor:
                            corDaLetra(
                              resultado
                            ),
                          borderColor:
                            corDaLetra(
                              resultado
                            ),
                        },
                      ]}
                    >
                      <Text
                        style={styles.letter}
                      >
                        {letra}
                      </Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>

        {!jogoFinalizado ? (
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
                    .slice(0, 5)
                    .toUpperCase()
                )
              }
              placeholder="DIGITE UMA PALAVRA"
              placeholderTextColor="#5F7683"
              autoCapitalize="characters"
              maxLength={5}
              returnKeyType="done"
              onSubmitEditing={
                enviarTentativa
              }
            />

            <Pressable
              style={styles.button}
              onPress={enviarTentativa}
            >
              <Text style={styles.buttonText}>
                CONFIRMAR
              </Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.resultContainer}>
            <Text
              style={[
                styles.resultTitle,
                venceu
                  ? styles.winText
                  : styles.loseText,
              ]}
            >
              {venceu
                ? 'FASE CONCLUÍDA'
                : 'TENTATIVA ENCERRADA'}
            </Text>

            {venceu && (
              <Text style={styles.completedText}>
                Progresso salvo
              </Text>
            )}

            {!venceu && (
              <Text style={styles.secretWord}>
                Palavra: {palavraSecreta}
              </Text>
            )}

            <Pressable
              style={styles.restartButton}
              onPress={
                limparTentativaAtual
              }
            >
              <Text
                style={
                  styles.restartButtonText
                }
              >
                TENTAR NOVAMENTE
              </Text>
            </Pressable>

            {venceu &&
              faseAtual <
                FASES.length - 1 && (
                <Pressable
                  style={styles.nextButton}
                  onPress={proximaFase}
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

        <Text style={styles.phaseListTitle}>
          SELECIONAR FASE
        </Text>

        <View style={styles.phaseGrid}>
          {FASES.map((_, index) => {
            const numero =
              index + 1;

            const concluida =
              fasesPalavraConcluidas.includes(
                numero
              );

            const desbloqueada =
              numero === 1 ||
              fasesPalavraConcluidas.includes(
                numero - 1
              ) ||
              concluida;

            const atual =
              index === faseAtual;

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
                    !desbloqueada &&
                      styles.phaseTileTextLocked,
                  ]}
                >
                  {numero}
                </Text>

                <Text
                  style={[
                    styles.phaseTileStatus,
                    concluida &&
                      styles.phaseTileStatusComplete,
                  ]}
                >
                  {concluida
                    ? '✓'
                    : desbloqueada
                    ? '•'
                    : '🔒'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#051824',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 45,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  },

  backButtonText: {
    color: '#EAF6F2',
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '500',
  },

  smallTitle: {
    color: '#27e9b5',
    fontSize: 11,
    fontWeight: '800',
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  phaseButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#162936',
    borderWidth: 1,
    borderColor: '#3b5265',
    justifyContent: 'center',
    alignItems: 'center',
  },

  phaseButtonDisabled: {
    opacity: 0.3,
  },

  phaseButtonText: {
    color: '#EAF6F2',
    fontSize: 30,
    lineHeight: 32,
  },

  phaseStatus: {
    alignItems: 'center',
  },

  phaseStatusLabel: {
    color: '#5F7683',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  phaseStatusValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },

  phaseState: {
    fontSize: 9,
    fontWeight: '900',
    marginTop: 3,
  },

  phaseComplete: {
    color: '#27e9b5',
  },

  phasePending: {
    color: '#8CA3AE',
  },

  board: {
    gap: 8,
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    gap: 8,
  },

  letterBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#3b5265',
    backgroundColor: '#0F2530',
    justifyContent: 'center',
    alignItems: 'center',
  },

  letter: {
    color: '#FFFFFF',
    fontSize: 23,
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
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 22,
  },

  button: {
    height: 54,
    borderRadius: 18,
    backgroundColor: '#27e9b5',
    borderBottomWidth: 5,
    borderBottomColor: '#159E82',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  resultContainer: {
    alignItems: 'center',
    marginTop: 24,
  },

  resultTitle: {
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 1,
  },

  winText: {
    color: '#27e9b5',
  },

  loseText: {
    color: '#8CA3AE',
  },

  completedText: {
    color: '#8CA3AE',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 8,
  },

  secretWord: {
    color: '#EAF6F2',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },

  restartButton: {
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

  restartButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
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

  phaseTileTextLocked: {
    color: '#3E5462',
  },

  phaseTileStatus: {
    color: '#8CA3AE',
    fontSize: 10,
    marginTop: 2,
  },

  phaseTileStatusComplete: {
    color: '#27e9b5',
  },
});