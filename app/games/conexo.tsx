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

const ACCENT = GameTheme.games.conexo;

const CORES_GRUPO = [
  { base: '#FFD23F', soft: '#3A2E10', texto: '#241B0A' },
  { base: '#3DDC84', soft: '#123626', texto: '#0A2416' },
  { base: '#4EA1FF', soft: '#152A46', texto: '#FFFFFF' },
  { base: '#B98BFF', soft: '#2A1D4E', texto: '#241633' },
];

type Grupo = {
  categoria: string;
  palavras: string[];
};

type Fase = {
  titulo: string;
  grupos: Grupo[];
};

const FASES: Fase[] = [
  {
    titulo: 'Começando',
    grupos: [
      { categoria: 'FRUTAS', palavras: ['MACA', 'BANANA', 'UVA', 'MANGA'] },
      { categoria: 'CORES', palavras: ['AZUL', 'VERDE', 'ROXO', 'ROSA'] },
      { categoria: 'BICHOS DE ESTIMAÇÃO', palavras: ['CACHORRO', 'GATO', 'PEIXE', 'HAMSTER'] },
      { categoria: 'NÚMEROS POR EXTENSO', palavras: ['UM', 'DOIS', 'TRES', 'QUATRO'] },
    ],
  },
  {
    titulo: 'Natureza',
    grupos: [
      { categoria: 'CORPOS D\'ÁGUA', palavras: ['RIO', 'MAR', 'LAGO', 'OCEANO'] },
      { categoria: 'CLIMA', palavras: ['CHUVA', 'VENTO', 'SOL', 'NEVE'] },
      { categoria: 'ÁRVORES', palavras: ['PINHEIRO', 'CARVALHO', 'PALMEIRA', 'IPE'] },
      { categoria: 'ASTROS', palavras: ['LUA', 'ESTRELA', 'COMETA', 'PLANETA'] },
    ],
  },
  {
    titulo: 'Casa',
    grupos: [
      { categoria: 'UTENSÍLIOS', palavras: ['PANELA', 'COPO', 'PRATO', 'GARFO'] },
      { categoria: 'CÔMODOS', palavras: ['SALA', 'QUARTO', 'COZINHA', 'BANHEIRO'] },
      { categoria: 'ELETRODOMÉSTICOS', palavras: ['GELADEIRA', 'FOGAO', 'MICROONDAS', 'LIQUIDIFICADOR'] },
      { categoria: 'MÓVEIS', palavras: ['MESA', 'CADEIRA', 'SOFA', 'CAMA'] },
    ],
  },
  {
    titulo: 'Animais',
    grupos: [
      { categoria: 'FELINOS', palavras: ['LEAO', 'TIGRE', 'GATO', 'ONCA'] },
      { categoria: 'AVES', palavras: ['PATO', 'GALINHA', 'AGUIA', 'CORUJA'] },
      { categoria: 'RÉPTEIS', palavras: ['COBRA', 'JACARE', 'LAGARTO', 'TARTARUGA'] },
      { categoria: 'INSETOS', palavras: ['ABELHA', 'FORMIGA', 'BORBOLETA', 'BESOURO'] },
    ],
  },
  {
    titulo: 'Alimentos',
    grupos: [
      { categoria: 'FRUTAS', palavras: ['LARANJA', 'ABACAXI', 'MORANGO', 'MELANCIA'] },
      { categoria: 'GRÃOS', palavras: ['ARROZ', 'FEIJAO', 'MILHO', 'TRIGO'] },
      { categoria: 'DOCES', palavras: ['BRIGADEIRO', 'PUDIM', 'BOLO', 'SORVETE'] },
      { categoria: 'BEBIDAS', palavras: ['SUCO', 'AGUA', 'CAFE', 'LEITE'] },
    ],
  },
  {
    titulo: 'Cidade',
    grupos: [
      { categoria: 'TRANSPORTE', palavras: ['ONIBUS', 'METRO', 'TAXI', 'BICICLETA'] },
      { categoria: 'LUGARES PÚBLICOS', palavras: ['PRACA', 'PARQUE', 'MUSEU', 'BIBLIOTECA'] },
      { categoria: 'CONSTRUÇÕES', palavras: ['PONTE', 'TORRE', 'PREDIO', 'MURO'] },
      { categoria: 'PROFISSÕES', palavras: ['MEDICO', 'PROFESSOR', 'BOMBEIRO', 'POLICIAL'] },
    ],
  },
  {
    titulo: 'Escola',
    grupos: [
      { categoria: 'MATERIAIS', palavras: ['LAPIS', 'CANETA', 'BORRACHA', 'REGUA'] },
      { categoria: 'MATÉRIAS', palavras: ['MATEMATICA', 'HISTORIA', 'GEOGRAFIA', 'CIENCIAS'] },
      { categoria: 'LUGARES DA ESCOLA', palavras: ['SALA', 'PATIO', 'BIBLIOTECA', 'QUADRA'] },
      { categoria: 'AVALIAÇÃO', palavras: ['PROVA', 'NOTA', 'BOLETIM', 'EXAME'] },
    ],
  },
  {
    titulo: 'Viagem',
    grupos: [
      { categoria: 'MEIOS DE TRANSPORTE', palavras: ['AVIAO', 'TREM', 'BARCO', 'CARRO'] },
      { categoria: 'HOSPEDAGEM', palavras: ['HOTEL', 'POUSADA', 'HOSTEL', 'RESORT'] },
      { categoria: 'ITENS DE VIAGEM', palavras: ['MALA', 'PASSAPORTE', 'MAPA', 'CAMERA'] },
      { categoria: 'LUGARES TURÍSTICOS', palavras: ['PRAIA', 'MONTANHA', 'CACHOEIRA', 'ILHA'] },
    ],
  },
  {
    titulo: 'Esportes',
    grupos: [
      { categoria: 'ESPORTES COM BOLA', palavras: ['FUTEBOL', 'VOLEI', 'BASQUETE', 'HANDEBOL'] },
      { categoria: 'EQUIPAMENTOS', palavras: ['RAQUETE', 'LUVA', 'CAPACETE', 'CHUTEIRA'] },
      { categoria: 'LOCAIS', palavras: ['ESTADIO', 'QUADRA', 'PISCINA', 'PISTA'] },
      { categoria: 'AÇÕES', palavras: ['CORRER', 'NADAR', 'PULAR', 'CHUTAR'] },
    ],
  },
  {
    titulo: 'Desafio Final',
    grupos: [
      { categoria: 'TEMPO', palavras: ['HORA', 'MINUTO', 'SEGUNDO', 'DIA'] },
      { categoria: 'SENTIMENTOS', palavras: ['ALEGRIA', 'MEDO', 'RAIVA', 'AMOR'] },
      { categoria: 'ELEMENTOS', palavras: ['FOGO', 'AGUA', 'TERRA', 'AR'] },
      { categoria: 'CONCEITOS', palavras: ['SONHO', 'IDEIA', 'MEMORIA', 'DESTINO'] },
    ],
  },
];

const MAX_ERROS = 4;

function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}

export default function ConexoScreen() {
  const {
    fasesConexoConcluidas,
    concluirFaseConexo,
    faseConexoEstaConcluida,
  } = useGame();

  const primeiraNaoConcluida = useMemo(() => {
    const indice = FASES.findIndex(
      (_, index) => !fasesConexoConcluidas.includes(index + 1)
    );

    return indice === -1 ? FASES.length : indice;
  }, [fasesConexoConcluidas]);

  const [faseAtual, setFaseAtual] = useState(
    Math.min(primeiraNaoConcluida, FASES.length - 1)
  );

  const numeroFase = faseAtual + 1;
  const fase = FASES[faseAtual];

  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [gruposResolvidos, setGruposResolvidos] = useState<number[]>([]);
  const [erros, setErros] = useState(0);
  const [falhou, setFalhou] = useState(false);

  const embaralhadas = useMemo(
    () => embaralhar(fase.grupos.flatMap((g) => g.palavras)),
    [fase]
  );

  const progresso = fasesConexoConcluidas.length;
  const porcentagem = Math.round((progresso / FASES.length) * 100);
  const faseConcluida = faseConexoEstaConcluida(numeroFase);

  const jogoEncerrado =
    gruposResolvidos.length === fase.grupos.length || falhou;

  const palavrasVisiveis = embaralhadas.filter((palavra) =>
    !fase.grupos.some(
      (grupo, index) =>
        gruposResolvidos.includes(index) &&
        grupo.palavras.includes(palavra)
    )
  );

  function limparFase() {
    setSelecionadas([]);
    setGruposResolvidos([]);
    setErros(0);
    setFalhou(false);
  }

  function alternarSelecao(palavra: string) {
    if (jogoEncerrado) {
      return;
    }

    if (selecionadas.includes(palavra)) {
      setSelecionadas(selecionadas.filter((item) => item !== palavra));
      return;
    }

    if (selecionadas.length >= 4) {
      return;
    }

    setSelecionadas([...selecionadas, palavra]);
  }

  async function submeter() {
    if (selecionadas.length !== 4 || jogoEncerrado) {
      return;
    }

    const indiceGrupo = fase.grupos.findIndex(
      (grupo) =>
        grupo.palavras.length === selecionadas.length &&
        grupo.palavras.every((palavra) => selecionadas.includes(palavra))
    );

    if (indiceGrupo !== -1) {
      const novosResolvidos = [...gruposResolvidos, indiceGrupo];
      setGruposResolvidos(novosResolvidos);
      setSelecionadas([]);

      if (novosResolvidos.length === fase.grupos.length) {
        const primeiraConclusao = await concluirFaseConexo(numeroFase);

        setTimeout(() => {
          Alert.alert(
            primeiraConclusao ? 'Fase concluída!' : 'Muito bem!',
            primeiraConclusao
              ? `Você encontrou todos os grupos da fase ${numeroFase}.`
              : 'Você já havia concluído esta fase.'
          );
        }, 250);
      }

      return;
    }

    const novosErros = erros + 1;
    setErros(novosErros);
    setSelecionadas([]);

    if (novosErros >= MAX_ERROS) {
      setFalhou(true);

      setTimeout(() => {
        Alert.alert(
          'Tentativas esgotadas',
          'Veja os grupos corretos abaixo e tente novamente.'
        );
      }, 200);

      return;
    }

    Alert.alert(
      'Grupo incorreto',
      `Essas palavras não formam um grupo. Vidas restantes: ${MAX_ERROS - novosErros}.`
    );
  }

  function proximaFase() {
    if (faseAtual >= FASES.length - 1) {
      Alert.alert('Parabéns!', 'Você chegou à última fase do Conexo.');
      return;
    }

    setFaseAtual((valor) => valor + 1);
    limparFase();
  }

  function faseAnterior() {
    if (faseAtual === 0) {
      return;
    }

    setFaseAtual((valor) => valor - 1);
    limparFase();
  }

  function irParaFase(index: number) {
    const numero = index + 1;

    const desbloqueada =
      numero === 1 ||
      fasesConexoConcluidas.includes(numero - 1) ||
      fasesConexoConcluidas.includes(numero);

    if (!desbloqueada) {
      Alert.alert('Fase bloqueada', 'Conclua a fase anterior primeiro.');
      return;
    }

    setFaseAtual(index);
    limparFase();
  }

  const podeAvancar =
    faseConcluida || gruposResolvidos.length === fase.grupos.length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>

        <Text style={styles.eyebrow}>CONEXO</Text>

        <Text style={styles.title}>Fase {numeroFase}</Text>

        <Text style={styles.phaseTitle}>{fase.titulo}</Text>

        <View style={styles.progressCard}>
          <View>
            <Text style={styles.progressLabel}>PROGRESSO</Text>

            <Text style={styles.progressValue}>
              {progresso} / {FASES.length}
            </Text>
          </View>

          <Text style={styles.progressPercent}>{porcentagem}%</Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${porcentagem}%` }]} />
        </View>

        <View style={styles.phaseNavigation}>
          <Pressable
            style={[styles.phaseButton, faseAtual === 0 && styles.phaseButtonDisabled]}
            disabled={faseAtual === 0}
            onPress={faseAnterior}
          >
            <Text style={styles.phaseButtonText}>‹</Text>
          </Pressable>

          <View style={styles.phaseCenter}>
            <Text style={styles.phaseNumber}>
              {numeroFase} / {FASES.length}
            </Text>

            <Text
              style={[
                styles.phaseState,
                faseConcluida ? styles.completeText : styles.pendingText,
              ]}
            >
              {faseConcluida ? 'CONCLUÍDA ✓' : 'EM ANDAMENTO'}
            </Text>
          </View>

          <Pressable
            style={[styles.phaseButton, !podeAvancar && styles.phaseButtonDisabled]}
            disabled={!podeAvancar}
            onPress={proximaFase}
          >
            <Text style={styles.phaseButtonText}>›</Text>
          </Pressable>
        </View>

        <View style={styles.livesRow}>
          <Text style={styles.livesLabel}>VIDAS</Text>

          <View style={styles.livesDots}>
            {Array.from({ length: MAX_ERROS }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.lifeDot,
                  index < MAX_ERROS - erros
                    ? styles.lifeDotActive
                    : styles.lifeDotLost,
                ]}
              />
            ))}
          </View>
        </View>

        <Text style={styles.instructions}>
          Selecione 4 palavras que compartilham uma conexão e toque em CONFIRMAR.
        </Text>

        <View style={styles.solvedGroups}>
          {fase.grupos.map((grupo, index) => {
            if (!gruposResolvidos.includes(index) && !falhou) {
              return null;
            }

            const cor = CORES_GRUPO[index % CORES_GRUPO.length];
            const eraDesconhecido = !gruposResolvidos.includes(index);

            return (
              <View
                key={grupo.categoria}
                style={[
                  styles.solvedGroup,
                  {
                    backgroundColor: cor.soft,
                    borderColor: cor.base,
                    opacity: eraDesconhecido ? 0.6 : 1,
                  },
                ]}
              >
                <Text style={[styles.solvedGroupTitle, { color: cor.base }]}>
                  {grupo.categoria}
                </Text>

                <Text style={styles.solvedGroupWords}>
                  {grupo.palavras.join(' • ')}
                </Text>
              </View>
            );
          })}
        </View>

        {!jogoEncerrado && (
          <>
            <View style={styles.wordGrid}>
              {palavrasVisiveis.map((palavra) => {
                const selecionada = selecionadas.includes(palavra);

                return (
                  <Pressable
                    key={palavra}
                    style={[styles.wordTile, selecionada && styles.wordTileSelected]}
                    onPress={() => alternarSelecao(palavra)}
                  >
                    <Text
                      style={[
                        styles.wordTileText,
                        selecionada && styles.wordTileTextSelected,
                      ]}
                    >
                      {palavra}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={[
                styles.confirmButton,
                selecionadas.length !== 4 && styles.confirmButtonDisabled,
              ]}
              disabled={selecionadas.length !== 4}
              onPress={submeter}
            >
              <Text style={styles.confirmButtonText}>
                CONFIRMAR ({selecionadas.length}/4)
              </Text>
            </Pressable>
          </>
        )}

        {jogoEncerrado && (
          <View style={styles.resultContainer}>
            <Text
              style={[
                styles.resultTitle,
                falhou ? styles.loseText : styles.winText,
              ]}
            >
              {falhou ? 'TENTATIVAS ESGOTADAS' : 'FASE CONCLUÍDA ✓'}
            </Text>

            <Pressable style={styles.restartButton} onPress={limparFase}>
              <Text style={styles.restartButtonText}>TENTAR NOVAMENTE</Text>
            </Pressable>

            {!falhou && faseAtual < FASES.length - 1 && (
              <Pressable style={styles.nextButton} onPress={proximaFase}>
                <Text style={styles.nextButtonText}>PRÓXIMA FASE</Text>
              </Pressable>
            )}
          </View>
        )}

        <Text style={styles.phaseListTitle}>SELECIONAR FASE</Text>

        <View style={styles.phaseGrid}>
          {FASES.map((_, index) => {
            const numero = index + 1;
            const concluida = fasesConexoConcluidas.includes(numero);

            const desbloqueada =
              numero === 1 ||
              fasesConexoConcluidas.includes(numero - 1) ||
              concluida;

            const atual = faseAtual === index;

            return (
              <Pressable
                key={numero}
                style={[
                  styles.phaseTile,
                  concluida && styles.phaseTileComplete,
                  !desbloqueada && styles.phaseTileLocked,
                  atual && styles.phaseTileCurrent,
                ]}
                onPress={() => irParaFase(index)}
              >
                <Text
                  style={[
                    styles.phaseTileText,
                    concluida && styles.phaseTileTextComplete,
                  ]}
                >
                  {numero}
                </Text>

                <Text style={styles.phaseTileStatus}>
                  {concluida ? '✓' : desbloqueada ? '•' : '🔒'}
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
    backgroundColor: GameTheme.bg,
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
    backgroundColor: GameTheme.surface,
    borderWidth: 2,
    borderColor: GameTheme.outline,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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

  phaseTitle: {
    color: GameTheme.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 18,
  },

  progressCard: {
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

  phaseNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  phaseButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: GameTheme.surfaceAlt,
    borderWidth: 2,
    borderColor: GameTheme.outline,
    justifyContent: 'center',
    alignItems: 'center',
  },

  phaseButtonDisabled: {
    opacity: 0.3,
  },

  phaseButtonText: {
    color: GameTheme.title,
    fontSize: 30,
    lineHeight: 32,
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
    marginTop: 3,
  },

  completeText: {
    color: GameTheme.success,
  },

  pendingText: {
    color: GameTheme.textMuted,
  },

  livesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 14,
  },

  livesLabel: {
    color: GameTheme.textDim,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  livesDots: {
    flexDirection: 'row',
    gap: 6,
  },

  lifeDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },

  lifeDotActive: {
    backgroundColor: GameTheme.danger,
  },

  lifeDotLost: {
    backgroundColor: GameTheme.outline,
  },

  instructions: {
    color: GameTheme.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },

  solvedGroups: {
    gap: 8,
    marginBottom: 8,
  },

  solvedGroup: {
    borderWidth: 2,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },

  solvedGroupTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },

  solvedGroupWords: {
    color: GameTheme.text,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },

  wordGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 8,
  },

  wordTile: {
    width: '31%',
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: GameTheme.surface,
    borderWidth: 2,
    borderColor: GameTheme.outline,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },

  wordTileSelected: {
    backgroundColor: ACCENT.soft,
    borderColor: ACCENT.base,
  },

  wordTileText: {
    color: GameTheme.text,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },

  wordTileTextSelected: {
    color: ACCENT.base,
  },

  confirmButton: {
    height: 52,
    backgroundColor: ACCENT.base,
    borderRadius: 18,
    borderBottomWidth: 5,
    borderBottomColor: ACCENT.dark,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  confirmButtonDisabled: {
    opacity: 0.4,
  },

  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  resultContainer: {
    alignItems: 'center',
    marginTop: 10,
  },

  resultTitle: {
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 1,
  },

  winText: {
    color: GameTheme.success,
  },

  loseText: {
    color: GameTheme.danger,
  },

  restartButton: {
    backgroundColor: GameTheme.surfaceAlt,
    borderWidth: 2,
    borderColor: GameTheme.outline,
    borderBottomWidth: 5,
    borderBottomColor: GameTheme.bgSoft,
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
    backgroundColor: ACCENT.base,
    borderRadius: 16,
    borderBottomWidth: 5,
    borderBottomColor: ACCENT.dark,
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
    color: GameTheme.textDim,
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
    backgroundColor: GameTheme.surface,
    borderWidth: 2,
    borderColor: GameTheme.outline,
    justifyContent: 'center',
    alignItems: 'center',
  },

  phaseTileComplete: {
    backgroundColor: '#123626',
    borderColor: GameTheme.success,
  },

  phaseTileLocked: {
    opacity: 0.35,
  },

  phaseTileCurrent: {
    borderColor: ACCENT.base,
    borderWidth: 2.5,
  },

  phaseTileText: {
    color: GameTheme.title,
    fontSize: 15,
    fontWeight: '900',
  },

  phaseTileTextComplete: {
    color: GameTheme.success,
  },

  phaseTileStatus: {
    color: GameTheme.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
});
