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
  {
    titulo: 'Família',
    palavras: [
      {
        resposta: 'PAI',
        pista: 'Progenitor do sexo masculino.',
      },
      {
        resposta: 'MAE',
        pista: 'Progenitora, cuida dos filhos.',
      },
      {
        resposta: 'AVO',
        pista: 'Pai do seu pai ou da sua mãe.',
      },
      {
        resposta: 'NETO',
        pista: 'Filho do seu filho ou filha.',
      },
    ],
  },

  {
    titulo: 'Corpo Humano',
    palavras: [
      {
        resposta: 'BRACO',
        pista: 'Membro superior do corpo.',
      },
      {
        resposta: 'PERNA',
        pista: 'Membro usado para caminhar.',
      },
      {
        resposta: 'OLHO',
        pista: 'Órgão da visão.',
      },
      {
        resposta: 'NARIZ',
        pista: 'Órgão usado para respirar e sentir cheiro.',
      },
    ],
  },

  {
    titulo: 'Roupas',
    palavras: [
      {
        resposta: 'CAMISA',
        pista: 'Peça de roupa para a parte de cima do corpo.',
      },
      {
        resposta: 'CALCA',
        pista: 'Peça de roupa que cobre as pernas.',
      },
      {
        resposta: 'MEIA',
        pista: 'Veste-se no pé, antes do sapato.',
      },
      {
        resposta: 'LUVA',
        pista: 'Protege as mãos do frio.',
      },
    ],
  },

  {
    titulo: 'Profissões',
    palavras: [
      {
        resposta: 'MEDICO',
        pista: 'Cuida da saúde das pessoas.',
      },
      {
        resposta: 'ATOR',
        pista: 'Representa personagens no cinema ou teatro.',
      },
      {
        resposta: 'BOMBEIRO',
        pista: 'Apaga incêndios e faz resgates.',
      },
      {
        resposta: 'POLICIAL',
        pista: 'Cuida da segurança e da ordem pública.',
      },
    ],
  },

  {
    titulo: 'Instrumentos Musicais',
    palavras: [
      {
        resposta: 'VIOLAO',
        pista: 'Instrumento de cordas dedilhado.',
      },
      {
        resposta: 'PIANO',
        pista: 'Instrumento de teclas.',
      },
      {
        resposta: 'TAMBOR',
        pista: 'Instrumento de percussão.',
      },
      {
        resposta: 'FLAUTA',
        pista: 'Instrumento de sopro fino e longo.',
      },
    ],
  },

  {
    titulo: 'Esportes',
    palavras: [
      {
        resposta: 'FUTEBOL',
        pista: 'Esporte jogado com os pés e uma bola redonda.',
      },
      {
        resposta: 'NATACAO',
        pista: 'Esporte praticado na água.',
      },
      {
        resposta: 'TENIS',
        pista: 'Esporte jogado com raquete e bolinha.',
      },
      {
        resposta: 'CICLISMO',
        pista: 'Esporte praticado de bicicleta.',
      },
    ],
  },

  {
    titulo: 'Veículos',
    palavras: [
      {
        resposta: 'CARRO',
        pista: 'Veículo com quatro rodas para poucas pessoas.',
      },
      {
        resposta: 'ONIBUS',
        pista: 'Veículo grande de transporte coletivo.',
      },
      {
        resposta: 'AVIAO',
        pista: 'Voa para transportar passageiros.',
      },
      {
        resposta: 'MOTO',
        pista: 'Veículo de duas rodas com motor.',
      },
    ],
  },

  {
    titulo: 'Insetos',
    palavras: [
      {
        resposta: 'ABELHA',
        pista: 'Produz mel e pode picar.',
      },
      {
        resposta: 'FORMIGA',
        pista: 'Inseto pequeno que vive em colônias.',
      },
      {
        resposta: 'JOANINHA',
        pista: 'Inseto pequeno, vermelho com bolinhas pretas.',
      },
      {
        resposta: 'MOSQUITO',
        pista: 'Inseto que pica e pode transmitir doenças.',
      },
    ],
  },

  {
    titulo: 'Aves',
    palavras: [
      {
        resposta: 'PATO',
        pista: 'Ave que gosta de nadar.',
      },
      {
        resposta: 'GALINHA',
        pista: 'Ave que põe ovos na fazenda.',
      },
      {
        resposta: 'CORUJA',
        pista: 'Ave de rapina que voa à noite.',
      },
      {
        resposta: 'PAPAGAIO',
        pista: 'Ave colorida que pode repetir palavras.',
      },
    ],
  },

  {
    titulo: 'Peixes e Mar',
    palavras: [
      {
        resposta: 'ATUM',
        pista: 'Peixe comum em conservas.',
      },
      {
        resposta: 'TUBARAO',
        pista: 'Peixe grande e temido dos mares.',
      },
      {
        resposta: 'POLVO',
        pista: 'Animal marinho com oito braços.',
      },
      {
        resposta: 'BALEIA',
        pista: 'Maior mamífero marinho.',
      },
    ],
  },

  {
    titulo: 'Cores',
    palavras: [
      {
        resposta: 'AZUL',
        pista: 'Cor do céu em dia claro.',
      },
      {
        resposta: 'VERDE',
        pista: 'Cor das folhas.',
      },
      {
        resposta: 'AMARELO',
        pista: 'Cor do sol e da banana.',
      },
      {
        resposta: 'VERMELHO',
        pista: 'Cor do sangue e do morango.',
      },
    ],
  },

  {
    titulo: 'Números',
    palavras: [
      {
        resposta: 'QUATRO',
        pista: 'Vem depois do três.',
      },
      {
        resposta: 'CINCO',
        pista: 'Número de dedos em uma mão.',
      },
      {
        resposta: 'DEZ',
        pista: 'Número de dedos das duas mãos.',
      },
      {
        resposta: 'CEM',
        pista: 'Número redondo, dez vezes dez.',
      },
    ],
  },

  {
    titulo: 'Formas Geométricas',
    palavras: [
      {
        resposta: 'CIRCULO',
        pista: 'Forma redonda sem pontas.',
      },
      {
        resposta: 'QUADRADO',
        pista: 'Forma com quatro lados iguais.',
      },
      {
        resposta: 'CUBO',
        pista: 'Forma geométrica com seis faces quadradas.',
      },
      {
        resposta: 'CONE',
        pista: 'Forma que lembra um chapéu de festa.',
      },
    ],
  },

  {
    titulo: 'Planetas',
    palavras: [
      {
        resposta: 'MARTE',
        pista: 'Conhecido como o planeta vermelho.',
      },
      {
        resposta: 'VENUS',
        pista: 'Planeta mais próximo da Terra.',
      },
      {
        resposta: 'JUPITER',
        pista: 'Maior planeta do sistema solar.',
      },
      {
        resposta: 'SATURNO',
        pista: 'Planeta famoso pelos seus anéis.',
      },
    ],
  },

  {
    titulo: 'Metais',
    palavras: [
      {
        resposta: 'FERRO',
        pista: 'Metal usado para fazer aço.',
      },
      {
        resposta: 'OURO',
        pista: 'Metal precioso e brilhante, de cor amarela.',
      },
      {
        resposta: 'PRATA',
        pista: 'Metal precioso de cor branca.',
      },
      {
        resposta: 'COBRE',
        pista: 'Metal usado em fios elétricos.',
      },
    ],
  },

  {
    titulo: 'Bebidas',
    palavras: [
      {
        resposta: 'SUCO',
        pista: 'Bebida feita de frutas.',
      },
      {
        resposta: 'AGUA',
        pista: 'Bebida essencial para a vida.',
      },
      {
        resposta: 'LEITE',
        pista: 'Bebida branca tirada da vaca.',
      },
      {
        resposta: 'CAFE',
        pista: 'Bebida escura que ajuda a acordar.',
      },
    ],
  },

  {
    titulo: 'Doces',
    palavras: [
      {
        resposta: 'BOLO',
        pista: 'Sobremesa assada, comum em aniversários.',
      },
      {
        resposta: 'PUDIM',
        pista: 'Sobremesa mole com calda de caramelo.',
      },
      {
        resposta: 'SORVETE',
        pista: 'Sobremesa gelada e cremosa.',
      },
      {
        resposta: 'COCADA',
        pista: 'Doce feito com coco e açúcar.',
      },
    ],
  },

  {
    titulo: 'Ferramentas',
    palavras: [
      {
        resposta: 'MARTELO',
        pista: 'Ferramenta usada para bater pregos.',
      },
      {
        resposta: 'CHAVE',
        pista: 'Ferramenta usada para apertar ou abrir.',
      },
      {
        resposta: 'SERRA',
        pista: 'Ferramenta usada para cortar madeira.',
      },
      {
        resposta: 'ALICATE',
        pista: 'Ferramenta usada para segurar ou cortar fios.',
      },
    ],
  },

  {
    titulo: 'Clima',
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
        resposta: 'NEVE',
        pista: 'Precipitação branca e fria.',
      },
      {
        resposta: 'CALOR',
        pista: 'Sensação de temperatura alta.',
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
        resposta: 'CANETA',
        pista: 'Usada para escrever com tinta.',
      },
      {
        resposta: 'MOCHILA',
        pista: 'Usada para carregar os materiais escolares.',
      },
      {
        resposta: 'QUADRO',
        pista: 'Onde o professor escreve na sala de aula.',
      },
    ],
  },

  {
    titulo: 'Casa',
    palavras: [
      {
        resposta: 'PORTA',
        pista: 'Usada para entrar e sair de um cômodo.',
      },
      {
        resposta: 'JANELA',
        pista: 'Deixa a luz entrar no cômodo.',
      },
      {
        resposta: 'TELHADO',
        pista: 'Cobre a casa por cima.',
      },
      {
        resposta: 'PAREDE',
        pista: 'Divide os cômodos de uma casa.',
      },
    ],
  },

  {
    titulo: 'Natureza',
    palavras: [
      {
        resposta: 'MONTANHA',
        pista: 'Elevação natural muito alta do terreno.',
      },
      {
        resposta: 'FLORESTA',
        pista: 'Área com muitas árvores.',
      },
      {
        resposta: 'DESERTO',
        pista: 'Área seca com pouca chuva.',
      },
      {
        resposta: 'VULCAO',
        pista: 'Montanha que pode expelir lava.',
      },
    ],
  },

  {
    titulo: 'Animais Selvagens',
    palavras: [
      {
        resposta: 'LEAO',
        pista: 'Conhecido como o rei da selva.',
      },
      {
        resposta: 'TIGRE',
        pista: 'Felino grande com listras.',
      },
      {
        resposta: 'ELEFANTE',
        pista: 'Maior mamífero terrestre, tem tromba.',
      },
      {
        resposta: 'GIRAFA',
        pista: 'Animal de pescoço muito comprido.',
      },
    ],
  },

  {
    titulo: 'Frutas',
    palavras: [
      {
        resposta: 'ABACAXI',
        pista: 'Fruta tropical com casca espinhosa.',
      },
      {
        resposta: 'MELANCIA',
        pista: 'Fruta grande, verde por fora e vermelha por dentro.',
      },
      {
        resposta: 'MORANGO',
        pista: 'Fruta pequena e vermelha.',
      },
      {
        resposta: 'MAMAO',
        pista: 'Fruta alaranjada, boa para a digestão.',
      },
    ],
  },

  {
    titulo: 'Legumes e Verduras',
    palavras: [
      {
        resposta: 'CENOURA',
        pista: 'Legume alaranjado e crocante.',
      },
      {
        resposta: 'BATATA',
        pista: 'Tubérculo usado em várias receitas.',
      },
      {
        resposta: 'ALFACE',
        pista: 'Verdura usada em saladas.',
      },
      {
        resposta: 'TOMATE',
        pista: 'Fruto vermelho usado em molhos.',
      },
    ],
  },

  {
    titulo: 'Brinquedos',
    palavras: [
      {
        resposta: 'BONECA',
        pista: 'Brinquedo em forma de pessoa.',
      },
      {
        resposta: 'PIAO',
        pista: 'Brinquedo que gira sobre a ponta.',
      },
      {
        resposta: 'PIPA',
        pista: 'Brinquedo que voa preso a uma linha.',
      },
      {
        resposta: 'BOLA',
        pista: 'Brinquedo redondo usado em vários esportes.',
      },
    ],
  },

  {
    titulo: 'Música',
    palavras: [
      {
        resposta: 'SAMBA',
        pista: 'Ritmo brasileiro tocado no carnaval.',
      },
      {
        resposta: 'ROCK',
        pista: 'Estilo musical com guitarras elétricas.',
      },
      {
        resposta: 'FORRO',
        pista: 'Ritmo típico do nordeste brasileiro.',
      },
      {
        resposta: 'VIOLINO',
        pista: 'Instrumento de cordas tocado com arco.',
      },
    ],
  },

  {
    titulo: 'Países',
    palavras: [
      {
        resposta: 'BRASIL',
        pista: 'País onde se fala português, na América do Sul.',
      },
      {
        resposta: 'JAPAO',
        pista: 'País asiático conhecido pela tecnologia.',
      },
      {
        resposta: 'FRANCA',
        pista: 'País europeu famoso pela Torre Eiffel.',
      },
      {
        resposta: 'EGITO',
        pista: 'País africano famoso pelas pirâmides.',
      },
    ],
  },

  {
    titulo: 'Tecnologia',
    palavras: [
      {
        resposta: 'CELULAR',
        pista: 'Aparelho usado para ligar e navegar na internet.',
      },
      {
        resposta: 'MOUSE',
        pista: 'Usado para clicar e mover o cursor no computador.',
      },
      {
        resposta: 'INTERNET',
        pista: 'Rede que conecta o mundo todo.',
      },
      {
        resposta: 'TECLADO',
        pista: 'Usado para digitar no computador.',
      },
    ],
  },

  {
    titulo: 'Sentimentos',
    palavras: [
      {
        resposta: 'ALEGRIA',
        pista: 'Sentimento de felicidade.',
      },
      {
        resposta: 'MEDO',
        pista: 'Sentimento de receio ou temor.',
      },
      {
        resposta: 'RAIVA',
        pista: 'Sentimento de forte irritação.',
      },
      {
        resposta: 'SAUDADE',
        pista: 'Sentimento de falta de alguém ou de algo.',
      },
    ],
  },

  {
    titulo: 'Higiene',
    palavras: [
      {
        resposta: 'SABONETE',
        pista: 'Usado para lavar o corpo no banho.',
      },
      {
        resposta: 'ESCOVA',
        pista: 'Usada para escovar os dentes ou o cabelo.',
      },
      {
        resposta: 'XAMPU',
        pista: 'Usado para lavar o cabelo.',
      },
      {
        resposta: 'TOALHA',
        pista: 'Usada para se secar depois do banho.',
      },
    ],
  },

  {
    titulo: 'Escritório',
    palavras: [
      {
        resposta: 'PAPEL',
        pista: 'Usado para escrever ou imprimir.',
      },
      {
        resposta: 'GRAMPO',
        pista: 'Peça de metal usada para prender papéis.',
      },
      {
        resposta: 'TESOURA',
        pista: 'Usada para cortar papel.',
      },
      {
        resposta: 'PASTA',
        pista: 'Usada para guardar documentos.',
      },
    ],
  },

  {
    titulo: 'Praia',
    palavras: [
      {
        resposta: 'AREIA',
        pista: 'Cobre o chão da praia.',
      },
      {
        resposta: 'ONDA',
        pista: 'Movimento da água do mar.',
      },
      {
        resposta: 'BIQUINI',
        pista: 'Roupa de banho feminina.',
      },
      {
        resposta: 'BOIA',
        pista: 'Objeto inflável usado para boiar na água.',
      },
    ],
  },

  {
    titulo: 'Inverno',
    palavras: [
      {
        resposta: 'FRIO',
        pista: 'Sensação de temperatura baixa.',
      },
      {
        resposta: 'CACHECOL',
        pista: 'Usado no pescoço para se proteger do frio.',
      },
      {
        resposta: 'LUVA',
        pista: 'Protege as mãos do frio.',
      },
      {
        resposta: 'COBERTOR',
        pista: 'Usado na cama para se aquecer.',
      },
    ],
  },

  {
    titulo: 'Verão',
    palavras: [
      {
        resposta: 'CALOR',
        pista: 'Sensação de temperatura alta.',
      },
      {
        resposta: 'PISCINA',
        pista: 'Lugar para nadar e se refrescar.',
      },
      {
        resposta: 'SORVETE',
        pista: 'Sobremesa gelada, muito pedida no calor.',
      },
      {
        resposta: 'OCULOS',
        pista: 'Usados para proteger os olhos do sol.',
      },
    ],
  },

  {
    titulo: 'Transporte Público',
    palavras: [
      {
        resposta: 'ONIBUS',
        pista: 'Transporte coletivo que roda pelas ruas.',
      },
      {
        resposta: 'METRO',
        pista: 'Roda em trilhos, geralmente embaixo da terra.',
      },
      {
        resposta: 'TREM',
        pista: 'Anda sobre trilhos e liga cidades.',
      },
      {
        resposta: 'TAXI',
        pista: 'Transporte pago, dirigido por um motorista.',
      },
    ],
  },

  {
    titulo: 'Corpo Humano II',
    palavras: [
      {
        resposta: 'CORACAO',
        pista: 'Órgão que bombeia o sangue.',
      },
      {
        resposta: 'PULMAO',
        pista: 'Órgão usado para respirar.',
      },
      {
        resposta: 'ESTOMAGO',
        pista: 'Órgão que ajuda a digerir os alimentos.',
      },
      {
        resposta: 'CEREBRO',
        pista: 'Órgão que controla o corpo, fica na cabeça.',
      },
    ],
  },

  {
    titulo: 'Objetos de Cozinha',
    palavras: [
      {
        resposta: 'PANELA',
        pista: 'Usada para cozinhar os alimentos.',
      },
      {
        resposta: 'GARFO',
        pista: 'Talher usado para espetar a comida.',
      },
      {
        resposta: 'FACA',
        pista: 'Talher usado para cortar.',
      },
      {
        resposta: 'COLHER',
        pista: 'Talher usado para comer sopa.',
      },
    ],
  },

  {
    titulo: 'Relevo',
    palavras: [
      {
        resposta: 'MONTANHA',
        pista: 'Elevação natural muito alta.',
      },
      {
        resposta: 'VALE',
        pista: 'Terreno baixo entre montanhas.',
      },
      {
        resposta: 'SERRA',
        pista: 'Conjunto de montanhas.',
      },
      {
        resposta: 'PLANALTO',
        pista: 'Terreno alto e relativamente plano.',
      },
    ],
  },

  {
    titulo: 'Desafio Supremo',
    palavras: [
      {
        resposta: 'DESTINO',
        pista: 'Aquilo que o futuro reserva para alguém.',
      },
      {
        resposta: 'CORAGEM',
        pista: 'Força para enfrentar o medo.',
      },
      {
        resposta: 'MEMORIA',
        pista: 'Capacidade de lembrar do passado.',
      },
      {
        resposta: 'VITORIA',
        pista: 'Resultado de quem vence um desafio.',
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
              placeholderTextColor="#5F7683"
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

  crosswordBoard: {
    gap: 10,
  },

  wordRow: {
    backgroundColor: '#162936',
    borderWidth: 1,
    borderColor: '#3b5265',
    borderRadius: 14,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  wordRowSelected: {
    borderColor: '#27e9b5',
  },

  wordRowSolved: {
    borderColor: '#159E82',
    backgroundColor: '#0E3A32',
  },

  wordNumber: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#0F2530',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  wordNumberText: {
    color: '#27e9b5',
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
    borderColor: '#3b5265',
    backgroundColor: '#0F2530',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cellSolved: {
    backgroundColor: '#0E3A32',
    borderColor: '#159E82',
  },

  cellText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  clueCard: {
    backgroundColor: '#0F2530',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3b5265',
    padding: 17,
    marginTop: 22,
  },

  clueLabel: {
    color: '#27e9b5',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  clueText: {
    color: '#EAF6F2',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 23,
    marginTop: 7,
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
    letterSpacing: 1.5,
    textAlign: 'center',
    marginTop: 15,
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
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  completeCard: {
    alignItems: 'center',
    marginTop: 25,
  },

  completeTitle: {
    color: '#27e9b5',
    fontSize: 19,
    fontWeight: '900',
  },

  completeDescription: {
    color: '#8CA3AE',
    fontSize: 13,
    marginTop: 7,
  },

  nextButton: {
    backgroundColor: '#27e9b5',
    borderRadius: 16,
    borderBottomWidth: 5,
    borderBottomColor: '#159E82',
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