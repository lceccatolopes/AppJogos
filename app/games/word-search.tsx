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
  {
    titulo: 'Família',
    grade: [
      'MAEPZG',
      'PAIXKW',
      'IRMAOF',
      'AVOXVX',
      'TIOKHH',
      'KBKHXW',
    ],
    palavras: [
      'MAE',
      'PAI',
      'IRMAO',
      'AVO',
      'TIO',
    ],
  },

  {
    titulo: 'Corpo',
    grade: [
      'BRACOB',
      'PERNAX',
      'DEDOGX',
      'OLHOBX',
      'BOCAZM',
      'HZWMJW',
    ],
    palavras: [
      'BRACO',
      'PERNA',
      'DEDO',
      'OLHO',
      'BOCA',
    ],
  },

  {
    titulo: 'Roupas',
    grade: [
      'CAMISA',
      'CALCAV',
      'MEIAFW',
      'LUVAKX',
      'BONEVT',
      'HPSSFM',
    ],
    palavras: [
      'CAMISA',
      'CALCA',
      'MEIA',
      'LUVA',
      'BONE',
    ],
  },

  {
    titulo: 'Moveis',
    grade: [
      'MESABJ',
      'SOFABK',
      'CAMAMT',
      'BANCOP',
      'TAPETE',
      'SMKWHJ',
    ],
    palavras: [
      'MESA',
      'SOFA',
      'CAMA',
      'BANCO',
      'TAPETE',
    ],
  },

  {
    titulo: 'Instrumentos',
    grade: [
      'VIOLAO',
      'FLAUTA',
      'TAMBOR',
      'PIANOP',
      'BAIXOZ',
      'THXKPP',
    ],
    palavras: [
      'VIOLAO',
      'FLAUTA',
      'TAMBOR',
      'PIANO',
      'BAIXO',
    ],
  },

  {
    titulo: 'Profissoes',
    grade: [
      'MEDICO',
      'ATORFT',
      'JUIZSK',
      'PILOTO',
      'GARCOM',
      'KNTKXM',
    ],
    palavras: [
      'MEDICO',
      'ATOR',
      'JUIZ',
      'PILOTO',
      'GARCOM',
    ],
  },

  {
    titulo: 'Esportes',
    grade: [
      'JUDOSM',
      'TENISG',
      'BOXEFQ',
      'REMOSF',
      'SURFJW',
      'TXVMZB',
    ],
    palavras: [
      'JUDO',
      'TENIS',
      'BOXE',
      'REMO',
      'SURF',
    ],
  },

  {
    titulo: 'Veiculos',
    grade: [
      'CARROG',
      'MOTOGT',
      'TREMKJ',
      'NAVIOS',
      'AVIAOG',
      'NZHNHF',
    ],
    palavras: [
      'CARRO',
      'MOTO',
      'TREM',
      'NAVIO',
      'AVIAO',
    ],
  },

  {
    titulo: 'Insetos',
    grade: [
      'ABELHA',
      'MOSCAG',
      'PULGAB',
      'GRILOZ',
      'TRACAK',
      'JZBBQT',
    ],
    palavras: [
      'ABELHA',
      'MOSCA',
      'PULGA',
      'GRILO',
      'TRACA',
    ],
  },

  {
    titulo: 'Aves',
    grade: [
      'PATOJN',
      'GALOMQ',
      'CORVOZ',
      'POMBOH',
      'ARARAF',
      'PZXSGG',
    ],
    palavras: [
      'PATO',
      'GALO',
      'CORVO',
      'POMBO',
      'ARARA',
    ],
  },

  {
    titulo: 'Peixes',
    grade: [
      'ATUMGG',
      'BAGREW',
      'TRUTAT',
      'CARPAG',
      'SALMAO',
      'XVKVSJ',
    ],
    palavras: [
      'ATUM',
      'BAGRE',
      'TRUTA',
      'CARPA',
      'SALMAO',
    ],
  },

  {
    titulo: 'Cores',
    grade: [
      'AZULWP',
      'VERDEX',
      'ROXOWQ',
      'PRETOZ',
      'BRANCO',
      'WFQKVG',
    ],
    palavras: [
      'AZUL',
      'VERDE',
      'ROXO',
      'PRETO',
      'BRANCO',
    ],
  },

  {
    titulo: 'Numeros',
    grade: [
      'DOISZN',
      'TRESFF',
      'SEISTW',
      'NOVEWT',
      'DEZSTT',
      'MKZWPN',
    ],
    palavras: [
      'DOIS',
      'TRES',
      'SEIS',
      'NOVE',
      'DEZ',
    ],
  },

  {
    titulo: 'Formas',
    grade: [
      'CUBOTJ',
      'ESFERA',
      'CONEQV',
      'PRISMA',
      'LINHAF',
      'ZQMKNF',
    ],
    palavras: [
      'CUBO',
      'ESFERA',
      'CONE',
      'PRISMA',
      'LINHA',
    ],
  },

  {
    titulo: 'Planetas',
    grade: [
      'MARTEJ',
      'VENUSF',
      'TERRAB',
      'PLUTAO',
      'URANOP',
      'BVBGBV',
    ],
    palavras: [
      'MARTE',
      'VENUS',
      'TERRA',
      'PLUTAO',
      'URANO',
    ],
  },

  {
    titulo: 'Metais',
    grade: [
      'FERROT',
      'OUROFQ',
      'PRATAQ',
      'COBREN',
      'ACOTNV',
      'FSFFKB',
    ],
    palavras: [
      'FERRO',
      'OURO',
      'PRATA',
      'COBRE',
      'ACO',
    ],
  },

  {
    titulo: 'Bebidas',
    grade: [
      'SUCOWB',
      'AGUATV',
      'LEITEP',
      'CAFEVT',
      'VINHOQ',
      'TFKWGV',
    ],
    palavras: [
      'SUCO',
      'AGUA',
      'LEITE',
      'CAFE',
      'VINHO',
    ],
  },

  {
    titulo: 'Doces',
    grade: [
      'BOLOTJ',
      'MELHPK',
      'PUDIMG',
      'BALASG',
      'TORTAK',
      'JJZQZS',
    ],
    palavras: [
      'BOLO',
      'MEL',
      'PUDIM',
      'BALA',
      'TORTA',
    ],
  },

  {
    titulo: 'Ferramentas',
    grade: [
      'SERRAZ',
      'CHAVET',
      'PREGOF',
      'PINCAZ',
      'LIMAZQ',
      'QWZHVV',
    ],
    palavras: [
      'SERRA',
      'CHAVE',
      'PREGO',
      'PINCA',
      'LIMA',
    ],
  },

  {
    titulo: 'Clima',
    grade: [
      'CHUVAQ',
      'VENTON',
      'NEVEVM',
      'CALORB',
      'FRIOPN',
      'HZXFSH',
    ],
    palavras: [
      'CHUVA',
      'VENTO',
      'NEVE',
      'CALOR',
      'FRIO',
    ],
  },

  {
    titulo: 'Tempo',
    grade: [
      'HORAZZ',
      'DIAQSJ',
      'MESQZJ',
      'ANOZTW',
      'SEMANA',
      'XPTWXB',
    ],
    palavras: [
      'HORA',
      'DIA',
      'MES',
      'ANO',
      'SEMANA',
    ],
  },

  {
    titulo: 'Escola',
    grade: [
      'LAPISV',
      'CANETA',
      'PROVAN',
      'AULAXW',
      'NOTASQ',
      'KSPVNS',
    ],
    palavras: [
      'LAPIS',
      'CANETA',
      'PROVA',
      'AULA',
      'NOTA',
    ],
  },

  {
    titulo: 'Casa',
    grade: [
      'PORTAT',
      'JANELA',
      'TETOBN',
      'PAREDE',
      'CHAOVS',
      'ZHWGSP',
    ],
    palavras: [
      'PORTA',
      'JANELA',
      'TETO',
      'PAREDE',
      'CHAO',
    ],
  },

  {
    titulo: 'Natureza',
    grade: [
      'RIOKBH',
      'MARKVM',
      'LAGOWZ',
      'MONTEF',
      'VALEZN',
      'ZSBWGT',
    ],
    palavras: [
      'RIO',
      'MAR',
      'LAGO',
      'MONTE',
      'VALE',
    ],
  },

  {
    titulo: 'Arvores',
    grade: [
      'PINHOJ',
      'CEDROB',
      'IPEJHG',
      'PALMAP',
      'OLMOHV',
      'FPKFQP',
    ],
    palavras: [
      'PINHO',
      'CEDRO',
      'IPE',
      'PALMA',
      'OLMO',
    ],
  },

  {
    titulo: 'Animais Selvagens',
    grade: [
      'LEAOSS',
      'TIGREQ',
      'ZEBRAG',
      'LOBOPM',
      'URSOKW',
      'BWKNNX',
    ],
    palavras: [
      'LEAO',
      'TIGRE',
      'ZEBRA',
      'LOBO',
      'URSO',
    ],
  },

  {
    titulo: 'Animais Aquaticos',
    grade: [
      'BALEIA',
      'FOCAJN',
      'POLVOZ',
      'LULAHN',
      'OSTRAG',
      'ZTPKNX',
    ],
    palavras: [
      'BALEIA',
      'FOCA',
      'POLVO',
      'LULA',
      'OSTRA',
    ],
  },

  {
    titulo: 'Frutas',
    grade: [
      'KIWIJH',
      'AMEIXA',
      'GOIABA',
      'CAJUKN',
      'MELAOQ',
      'KNKBKN',
    ],
    palavras: [
      'KIWI',
      'AMEIXA',
      'GOIABA',
      'CAJU',
      'MELAO',
    ],
  },

  {
    titulo: 'Legumes',
    grade: [
      'BATATA',
      'ALFACE',
      'NABOWS',
      'MILHOQ',
      'CEBOLA',
      'PHNZXB',
    ],
    palavras: [
      'BATATA',
      'ALFACE',
      'NABO',
      'MILHO',
      'CEBOLA',
    ],
  },

  {
    titulo: 'Brinquedos',
    grade: [
      'BONECA',
      'PIAOWJ',
      'IOIONX',
      'BOLAJV',
      'PIPAMM',
      'VMSJNF',
    ],
    palavras: [
      'BONECA',
      'PIAO',
      'IOIO',
      'BOLA',
      'PIPA',
    ],
  },

  {
    titulo: 'Musica',
    grade: [
      'SAMBAQ',
      'ROCKNX',
      'JAZZQQ',
      'FORROV',
      'FUNKTB',
      'SWHTGM',
    ],
    palavras: [
      'SAMBA',
      'ROCK',
      'JAZZ',
      'FORRO',
      'FUNK',
    ],
  },

  {
    titulo: 'Paises',
    grade: [
      'BRASIL',
      'CHINAV',
      'JAPAOB',
      'FRANCA',
      'ITALIA',
      'PVZGFX',
    ],
    palavras: [
      'BRASIL',
      'CHINA',
      'JAPAO',
      'FRANCA',
      'ITALIA',
    ],
  },

  {
    titulo: 'Tecnologia',
    grade: [
      'CHIPZQ',
      'SITEKN',
      'REDEHJ',
      'DADOSX',
      'TECLAK',
      'GMBMXS',
    ],
    palavras: [
      'CHIP',
      'SITE',
      'REDE',
      'DADOS',
      'TECLA',
    ],
  },

  {
    titulo: 'Familia II',
    grade: [
      'PRIMOJ',
      'NETOJN',
      'SOGROS',
      'NORAQN',
      'TIAFPP',
      'BXMVFJ',
    ],
    palavras: [
      'PRIMO',
      'NETO',
      'SOGRO',
      'NORA',
      'TIA',
    ],
  },

  {
    titulo: 'Sentimentos',
    grade: [
      'AMORQP',
      'MEDOGK',
      'RAIVAT',
      'PAZNVB',
      'ODIOQK',
      'NKZGXG',
    ],
    palavras: [
      'AMOR',
      'MEDO',
      'RAIVA',
      'PAZ',
      'ODIO',
    ],
  },

  {
    titulo: 'Verbos de Acao',
    grade: [
      'CORRER',
      'SALTAR',
      'NADARQ',
      'VOARMM',
      'ANDARB',
      'KZGPTZ',
    ],
    palavras: [
      'CORRER',
      'SALTAR',
      'NADAR',
      'VOAR',
      'ANDAR',
    ],
  },

  {
    titulo: 'Higiene',
    grade: [
      'SABAOM',
      'TOALHA',
      'PENTEZ',
      'CREMEX',
      'ESCOVA',
      'HZQBKQ',
    ],
    palavras: [
      'SABAO',
      'TOALHA',
      'PENTE',
      'CREME',
      'ESCOVA',
    ],
  },

  {
    titulo: 'Escritorio',
    grade: [
      'CANETA',
      'PAPELX',
      'CLIPEZ',
      'PASTAF',
      'GRAMPO',
      'WGSXQB',
    ],
    palavras: [
      'CANETA',
      'PAPEL',
      'CLIPE',
      'PASTA',
      'GRAMPO',
    ],
  },

  {
    titulo: 'Mar',
    grade: [
      'ONDATN',
      'PRAIAQ',
      'AREIAS',
      'CONCHA',
      'CORALK',
      'KKTNKN',
    ],
    palavras: [
      'ONDA',
      'PRAIA',
      'AREIA',
      'CONCHA',
      'CORAL',
    ],
  },

  {
    titulo: 'Festa',
    grade: [
      'BALAOB',
      'BRINDE',
      'DANCAV',
      'BOLOBS',
      'VELATG',
      'KTMXVK',
    ],
    palavras: [
      'BALAO',
      'BRINDE',
      'DANCA',
      'BOLO',
      'VELA',
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
    justifyContent: 'center',
    alignItems: 'center',
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

  phaseTitle: {
    color: '#8CA3AE',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
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

  board: {
    backgroundColor: '#162936',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#3b5265',
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
    backgroundColor: '#0F2530',
    borderWidth: 1,
    borderColor: '#3b5265',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cellSelected: {
    backgroundColor: '#27e9b5',
    borderColor: '#27e9b5',
  },

  cellText: {
    color: '#DCE8E6',
    fontSize: 18,
    fontWeight: '900',
  },

  cellTextSelected: {
    color: '#FFFFFF',
  },

  selectionCard: {
    backgroundColor: '#0F2530',
    borderWidth: 1,
    borderColor: '#3b5265',
    borderRadius: 15,
    padding: 15,
    marginTop: 18,
    alignItems: 'center',
  },

  selectionLabel: {
    color: '#5F7683',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  selectionText: {
    color: '#EAF6F2',
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
    borderBottomColor: '#0A1F2C',
    backgroundColor: '#0F2530',
  },

  clearButtonText: {
    color: '#27e9b5',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },

  wordsTitle: {
    color: '#5F7683',
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
    backgroundColor: '#0F2530',
    borderWidth: 1,
    borderColor: '#3b5265',
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  wordBadgeFound: {
    backgroundColor: '#0E3A32',
    borderColor: '#159E82',
  },

  wordText: {
    color: '#8CA3AE',
    fontSize: 11,
    fontWeight: '800',
  },

  wordTextFound: {
    color: '#27e9b5',
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
    justifyContent: 'center',
    alignItems: 'center',
  },

  phaseTileComplete: {
    backgroundColor: '#0E3A32',
    borderColor: '#159E82',
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