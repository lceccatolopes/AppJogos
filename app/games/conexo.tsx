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
  { base: '#27e9b5', soft: '#0E3A32', texto: '#051824' },
  { base: '#22CFA0', soft: '#0C332C', texto: '#051824' },
  { base: '#1CAE86', soft: '#0A2B26', texto: '#EAF6F2' },
  { base: '#16876A', soft: '#081F1C', texto: '#EAF6F2' },
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
  {
    titulo: 'Fazenda e Campo',
    grupos: [
      { categoria: 'BEBIDAS QUENTES', palavras: ['CAFE', 'CHA', 'CHOCOLATE', 'CAPUCHINO'] },
      { categoria: 'GÊNEROS MUSICAIS', palavras: ['ROCK', 'JAZZ', 'REGGAE', 'POP'] },
      { categoria: 'ELETRODOMÉSTICOS', palavras: ['GELADEIRA', 'FOGAO', 'LIQUIDIFICADOR', 'MICROONDAS'] },
      { categoria: 'SINAIS DE TRÂNSITO', palavras: ['SEMAFORO', 'PLACA', 'FAIXA', 'LOMBADA'] },
    ],
  },

  {
    titulo: 'Frutas e Sabores',
    grupos: [
      { categoria: 'PARTES DA CASA', palavras: ['SALA', 'COZINHA', 'QUARTO', 'BANHEIRO'] },
      { categoria: 'VEÍCULOS AÉREOS', palavras: ['AVIAO', 'HELICOPTERO', 'BALAO', 'FOGUETE'] },
      { categoria: 'VEÍCULOS AQUÁTICOS', palavras: ['BARCO', 'NAVIO', 'CANOA', 'JANGADA'] },
      { categoria: 'ESTAÇÕES DO ANO', palavras: ['VERAO', 'INVERNO', 'OUTONO', 'PRIMAVERA'] },
    ],
  },

  {
    titulo: 'Sons e Instrumentos',
    grupos: [
      { categoria: 'UNIDADES DE TEMPO', palavras: ['SEGUNDO', 'MINUTO', 'HORA', 'SEMANA'] },
      { categoria: 'METAIS', palavras: ['FERRO', 'OURO', 'PRATA', 'COBRE'] },
      { categoria: 'ANIMAIS DA SAVANA', palavras: ['LEAO', 'ZEBRA', 'GIRAFA', 'ELEFANTE'] },
      { categoria: 'FENÔMENOS NATURAIS', palavras: ['TERREMOTO', 'FURACAO', 'TSUNAMI', 'VULCAO'] },
    ],
  },

  {
    titulo: 'Melodias do Mundo',
    grupos: [
      { categoria: 'GÊNEROS MUSICAIS', palavras: ['ROCK', 'JAZZ', 'REGGAE', 'POP'] },
      { categoria: 'PROFISSÕES DA SAÚDE', palavras: ['MEDICO', 'ENFERMEIRO', 'DENTISTA', 'FARMACEUTICO'] },
      { categoria: 'ÓRGÃOS DO CORPO', palavras: ['CORACAO', 'PULMAO', 'FIGADO', 'RIM'] },
      { categoria: 'DOENÇAS COMUNS', palavras: ['GRIPE', 'RESFRIADO', 'FEBRE', 'TOSSE'] },
    ],
  },

  {
    titulo: 'Espaço Sideral',
    grupos: [
      { categoria: 'PROFISSÕES DE EMERGÊNCIA', palavras: ['BOMBEIRO', 'POLICIAL', 'PARAMEDICO', 'SALVAVIDAS'] },
      { categoria: 'METAIS', palavras: ['FERRO', 'OURO', 'PRATA', 'COBRE'] },
      { categoria: 'COBERTURAS DE CABEÇA', palavras: ['BONE', 'BOINA', 'TOUCA', 'CAPACETE'] },
      { categoria: 'FERRAMENTAS DE ESCRITA', palavras: ['CANETA', 'LAPIS', 'GIZ', 'MARCADOR'] },
    ],
  },

  {
    titulo: 'Riquezas da Terra',
    grupos: [
      { categoria: 'ELETRODOMÉSTICOS', palavras: ['GELADEIRA', 'FOGAO', 'LIQUIDIFICADOR', 'MICROONDAS'] },
      { categoria: 'BEBIDAS FRIAS', palavras: ['SUCO', 'REFRIGERANTE', 'AGUA', 'LIMONADA'] },
      { categoria: 'FENÔMENOS NATURAIS', palavras: ['TERREMOTO', 'FURACAO', 'TSUNAMI', 'VULCAO'] },
      { categoria: 'COBERTURAS DE CABEÇA', palavras: ['BONE', 'BOINA', 'TOUCA', 'CAPACETE'] },
    ],
  },

  {
    titulo: 'Formas e Figuras',
    grupos: [
      { categoria: 'PARTES DO CARRO', palavras: ['VOLANTE', 'MOTOR', 'PNEU', 'FREIO'] },
      { categoria: 'FERRAMENTAS', palavras: ['MARTELO', 'CHAVE', 'SERROTE', 'ALICATE'] },
      { categoria: 'PEÇAS DE XADREZ', palavras: ['REI', 'RAINHA', 'TORRE', 'BISPO'] },
      { categoria: 'TIPOS DE DANÇA', palavras: ['SAMBA', 'FORRO', 'BALLET', 'TANGO'] },
    ],
  },

  {
    titulo: 'Ciclos da Natureza',
    grupos: [
      { categoria: 'INSTRUMENTOS DE MEDIÇÃO', palavras: ['BALANCA', 'TRENA', 'CRONOMETRO', 'TERMOSTATO'] },
      { categoria: 'GÊNEROS MUSICAIS', palavras: ['ROCK', 'JAZZ', 'REGGAE', 'POP'] },
      { categoria: 'ÓRGÃOS DO CORPO', palavras: ['CORACAO', 'PULMAO', 'FIGADO', 'RIM'] },
      { categoria: 'FERRAMENTAS', palavras: ['MARTELO', 'CHAVE', 'SERROTE', 'ALICATE'] },
    ],
  },

  {
    titulo: 'Calendário',
    grupos: [
      { categoria: 'DIAS DA SEMANA', palavras: ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA'] },
      { categoria: 'GRÃOS', palavras: ['ARROZ', 'FEIJAO', 'MILHO', 'TRIGO'] },
      { categoria: 'PARTES DO ROSTO', palavras: ['OLHO', 'NARIZ', 'BOCA', 'ORELHA'] },
      { categoria: 'PARTES DA CASA', palavras: ['SALA', 'COZINHA', 'QUARTO', 'BANHEIRO'] },
    ],
  },

  {
    titulo: 'Vida em Casa',
    grupos: [
      { categoria: 'PONTOS CARDEAIS', palavras: ['NORTE', 'SUL', 'LESTE', 'OESTE'] },
      { categoria: 'MÓVEIS DE SALA', palavras: ['SOFA', 'POLTRONA', 'ESTANTE', 'TAPETE'] },
      { categoria: 'ESPORTES COM RAQUETE OU TACO', palavras: ['TENIS', 'GOLFE', 'RUGBI', 'POLO'] },
      { categoria: 'METAIS', palavras: ['FERRO', 'OURO', 'PRATA', 'COBRE'] },
    ],
  },

  {
    titulo: 'Cozinha Moderna',
    grupos: [
      { categoria: 'CUIDADOS DE SAÚDE', palavras: ['XAROPE', 'CURATIVO', 'TERMOMETRO', 'VITAMINA'] },
      { categoria: 'PROFISSÕES DA SAÚDE', palavras: ['MEDICO', 'ENFERMEIRO', 'DENTISTA', 'FARMACEUTICO'] },
      { categoria: 'ÓRGÃOS DO CORPO', palavras: ['CORACAO', 'PULMAO', 'FIGADO', 'RIM'] },
      { categoria: 'UNIDADES DE MEDIDA', palavras: ['METRO', 'LITRO', 'GRAMA', 'QUILO'] },
    ],
  },

  {
    titulo: 'Caixa de Ferramentas',
    grupos: [
      { categoria: 'METAIS', palavras: ['FERRO', 'OURO', 'PRATA', 'COBRE'] },
      { categoria: 'TEMPEROS', palavras: ['SAL', 'PIMENTA', 'ALHO', 'CEBOLA'] },
      { categoria: 'ESPORTES OLÍMPICOS', palavras: ['ATLETISMO', 'NATACAO', 'GINASTICA', 'JUDO'] },
      { categoria: 'BEBIDAS QUENTES', palavras: ['CAFE', 'CHA', 'CHOCOLATE', 'CAPUCHINO'] },
    ],
  },

  {
    titulo: 'No Ar e no Mar',
    grupos: [
      { categoria: 'INSTRUMENTOS DE CORDA', palavras: ['VIOLAO', 'VIOLINO', 'HARPA', 'GUITARRA'] },
      { categoria: 'ANIMAIS POLARES', palavras: ['PINGUIM', 'FOCA', 'MORSA', 'RENA'] },
      { categoria: 'MÓVEIS DE QUARTO', palavras: ['CAMA', 'ARMARIO', 'TRAVESSEIRO', 'COBERTOR'] },
      { categoria: 'ANIMAIS DE FAZENDA', palavras: ['VACA', 'PORCO', 'OVELHA', 'CAVALO'] },
    ],
  },

  {
    titulo: 'Reino Animal',
    grupos: [
      { categoria: 'TIPOS DE MASSA', palavras: ['MACARRAO', 'LASANHA', 'NHOQUE', 'RAVIOLI'] },
      { categoria: 'FERRAMENTAS', palavras: ['MARTELO', 'CHAVE', 'SERROTE', 'ALICATE'] },
      { categoria: 'TIPOS DE DANÇA', palavras: ['SAMBA', 'FORRO', 'BALLET', 'TANGO'] },
      { categoria: 'PROFISSÕES DE EMERGÊNCIA', palavras: ['BOMBEIRO', 'POLICIAL', 'PARAMEDICO', 'SALVAVIDAS'] },
    ],
  },

  {
    titulo: 'Terras Geladas',
    grupos: [
      { categoria: 'METAIS', palavras: ['FERRO', 'OURO', 'PRATA', 'COBRE'] },
      { categoria: 'GRÃOS', palavras: ['ARROZ', 'FEIJAO', 'MILHO', 'TRIGO'] },
      { categoria: 'PROFISSÕES DA SAÚDE', palavras: ['MEDICO', 'ENFERMEIRO', 'DENTISTA', 'FARMACEUTICO'] },
      { categoria: 'ELETRODOMÉSTICOS', palavras: ['GELADEIRA', 'FOGAO', 'LIQUIDIFICADOR', 'MICROONDAS'] },
    ],
  },

  {
    titulo: 'Bichos Diferentes',
    grupos: [
      { categoria: 'SINAIS DE TRÂNSITO', palavras: ['SEMAFORO', 'PLACA', 'FAIXA', 'LOMBADA'] },
      { categoria: 'GRÃOS', palavras: ['ARROZ', 'FEIJAO', 'MILHO', 'TRIGO'] },
      { categoria: 'INSTRUMENTOS DE SOPRO', palavras: ['FLAUTA', 'TROMPETE', 'SAXOFONE', 'CLARINETE'] },
      { categoria: 'INSTRUMENTOS DE PERCUSSÃO', palavras: ['TAMBOR', 'BATERIA', 'PANDEIRO', 'XILOFONE'] },
    ],
  },

  {
    titulo: 'Jogos Olímpicos',
    grupos: [
      { categoria: 'ESTAÇÕES DO ANO', palavras: ['VERAO', 'INVERNO', 'OUTONO', 'PRIMAVERA'] },
      { categoria: 'FERRAMENTAS', palavras: ['MARTELO', 'CHAVE', 'SERROTE', 'ALICATE'] },
      { categoria: 'CUIDADOS DE SAÚDE', palavras: ['XAROPE', 'CURATIVO', 'TERMOMETRO', 'VITAMINA'] },
      { categoria: 'MESES', palavras: ['JANEIRO', 'FEVEREIRO', 'MARCO', 'ABRIL'] },
    ],
  },

  {
    titulo: 'Competições',
    grupos: [
      { categoria: 'CORPOS CELESTES', palavras: ['ESTRELA', 'COMETA', 'ASTEROIDE', 'GALAXIA'] },
      { categoria: 'PEÇAS DE XADREZ', palavras: ['REI', 'RAINHA', 'TORRE', 'BISPO'] },
      { categoria: 'CARNES', palavras: ['FRANGO', 'BOI', 'PATO', 'PEIXE'] },
      { categoria: 'SINAIS DE TRÂNSITO', palavras: ['SEMAFORO', 'PLACA', 'FAIXA', 'LOMBADA'] },
    ],
  },

  {
    titulo: 'Ritmo e Batida',
    grupos: [
      { categoria: 'PARTES DA CASA', palavras: ['SALA', 'COZINHA', 'QUARTO', 'BANHEIRO'] },
      { categoria: 'MATERIAL ESCOLAR', palavras: ['CADERNO', 'BORRACHA', 'REGUA', 'MOCHILA'] },
      { categoria: 'PARTES DO ROSTO', palavras: ['OLHO', 'NARIZ', 'BOCA', 'ORELHA'] },
      { categoria: 'INSTRUMENTOS DE CORDA', palavras: ['VIOLAO', 'VIOLINO', 'HARPA', 'GUITARRA'] },
    ],
  },

  {
    titulo: 'Pista de Dança',
    grupos: [
      { categoria: 'FIGURAS GEOMÉTRICAS', palavras: ['CIRCULO', 'QUADRADO', 'TRIANGULO', 'RETANGULO'] },
      { categoria: 'FRUTAS CÍTRICAS', palavras: ['LARANJA', 'LIMAO', 'TANGERINA', 'LIMA'] },
      { categoria: 'MESES', palavras: ['JANEIRO', 'FEVEREIRO', 'MARCO', 'ABRIL'] },
      { categoria: 'TEMPEROS', palavras: ['SAL', 'PIMENTA', 'ALHO', 'CEBOLA'] },
    ],
  },

  {
    titulo: 'Trilha Sonora',
    grupos: [
      { categoria: 'ÓRGÃOS DO CORPO', palavras: ['CORACAO', 'PULMAO', 'FIGADO', 'RIM'] },
      { categoria: 'INSTRUMENTOS DE MEDIÇÃO', palavras: ['BALANCA', 'TRENA', 'CRONOMETRO', 'TERMOSTATO'] },
      { categoria: 'BEBIDAS FRIAS', palavras: ['SUCO', 'REFRIGERANTE', 'AGUA', 'LIMONADA'] },
      { categoria: 'METAIS', palavras: ['FERRO', 'OURO', 'PRATA', 'COBRE'] },
    ],
  },

  {
    titulo: 'Copo Cheio',
    grupos: [
      { categoria: 'TIPOS DE MASSA', palavras: ['MACARRAO', 'LASANHA', 'NHOQUE', 'RAVIOLI'] },
      { categoria: 'ACESSÓRIOS', palavras: ['RELOGIO', 'COLAR', 'PULSEIRA', 'BRINCO'] },
      { categoria: 'METAIS', palavras: ['FERRO', 'OURO', 'PRATA', 'COBRE'] },
      { categoria: 'DIAS DA SEMANA', palavras: ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA'] },
    ],
  },

  {
    titulo: 'Prato do Dia',
    grupos: [
      { categoria: 'ANFÍBIOS', palavras: ['SAPO', 'PERERECA', 'SALAMANDRA', 'GIRINO'] },
      { categoria: 'COBERTURAS DE CABEÇA', palavras: ['BONE', 'BOINA', 'TOUCA', 'CAPACETE'] },
      { categoria: 'ANIMAIS DE FAZENDA', palavras: ['VACA', 'PORCO', 'OVELHA', 'CAVALO'] },
      { categoria: 'GÊNEROS MUSICAIS', palavras: ['ROCK', 'JAZZ', 'REGGAE', 'POP'] },
    ],
  },

  {
    titulo: 'Mesa Farta',
    grupos: [
      { categoria: 'ESPORTES COM RAQUETE OU TACO', palavras: ['TENIS', 'GOLFE', 'RUGBI', 'POLO'] },
      { categoria: 'ESTAÇÕES DO ANO', palavras: ['VERAO', 'INVERNO', 'OUTONO', 'PRIMAVERA'] },
      { categoria: 'PROFISSÕES DA SAÚDE', palavras: ['MEDICO', 'ENFERMEIRO', 'DENTISTA', 'FARMACEUTICO'] },
      { categoria: 'BEBIDAS QUENTES', palavras: ['CAFE', 'CHA', 'CHOCOLATE', 'CAPUCHINO'] },
    ],
  },

  {
    titulo: 'Tempero Especial',
    grupos: [
      { categoria: 'ELETRODOMÉSTICOS', palavras: ['GELADEIRA', 'FOGAO', 'LIQUIDIFICADOR', 'MICROONDAS'] },
      { categoria: 'PEÇAS DE XADREZ', palavras: ['REI', 'RAINHA', 'TORRE', 'BISPO'] },
      { categoria: 'INSTRUMENTOS DE SOPRO', palavras: ['FLAUTA', 'TROMPETE', 'SAXOFONE', 'CLARINETE'] },
      { categoria: 'ACESSÓRIOS', palavras: ['RELOGIO', 'COLAR', 'PULSEIRA', 'BRINCO'] },
    ],
  },

  {
    titulo: 'Sala de Aula',
    grupos: [
      { categoria: 'FERRAMENTAS', palavras: ['MARTELO', 'CHAVE', 'SERROTE', 'ALICATE'] },
      { categoria: 'CARNES', palavras: ['FRANGO', 'BOI', 'PATO', 'PEIXE'] },
      { categoria: 'ANIMAIS DA SAVANA', palavras: ['LEAO', 'ZEBRA', 'GIRAFA', 'ELEFANTE'] },
      { categoria: 'PROFISSÕES DE EMERGÊNCIA', palavras: ['BOMBEIRO', 'POLICIAL', 'PARAMEDICO', 'SALVAVIDAS'] },
    ],
  },

  {
    titulo: 'Mochila Pronta',
    grupos: [
      { categoria: 'BEBIDAS QUENTES', palavras: ['CAFE', 'CHA', 'CHOCOLATE', 'CAPUCHINO'] },
      { categoria: 'INSTRUMENTOS DE MEDIÇÃO', palavras: ['BALANCA', 'TRENA', 'CRONOMETRO', 'TERMOSTATO'] },
      { categoria: 'UNIDADES DE TEMPO', palavras: ['SEGUNDO', 'MINUTO', 'HORA', 'SEMANA'] },
      { categoria: 'ESTAÇÕES DO ANO', palavras: ['VERAO', 'INVERNO', 'OUTONO', 'PRIMAVERA'] },
    ],
  },

  {
    titulo: 'Cuidando de Todos',
    grupos: [
      { categoria: 'INSTRUMENTOS DE PERCUSSÃO', palavras: ['TAMBOR', 'BATERIA', 'PANDEIRO', 'XILOFONE'] },
      { categoria: 'DOENÇAS COMUNS', palavras: ['GRIPE', 'RESFRIADO', 'FEBRE', 'TOSSE'] },
      { categoria: 'TEMPEROS', palavras: ['SAL', 'PIMENTA', 'ALHO', 'CEBOLA'] },
      { categoria: 'INSTRUMENTOS DE SOPRO', palavras: ['FLAUTA', 'TROMPETE', 'SAXOFONE', 'CLARINETE'] },
    ],
  },

  {
    titulo: 'Emergência',
    grupos: [
      { categoria: 'ESTAÇÕES DO ANO', palavras: ['VERAO', 'INVERNO', 'OUTONO', 'PRIMAVERA'] },
      { categoria: 'CORPOS CELESTES', palavras: ['ESTRELA', 'COMETA', 'ASTEROIDE', 'GALAXIA'] },
      { categoria: 'CUIDADOS DE SAÚDE', palavras: ['XAROPE', 'CURATIVO', 'TERMOMETRO', 'VITAMINA'] },
      { categoria: 'SINAIS DE TRÂNSITO', palavras: ['SEMAFORO', 'PLACA', 'FAIXA', 'LOMBADA'] },
    ],
  },

  {
    titulo: 'Quarto Aconchegante',
    grupos: [
      { categoria: 'UNIDADES DE MEDIDA', palavras: ['METRO', 'LITRO', 'GRAMA', 'QUILO'] },
      { categoria: 'CORPOS CELESTES', palavras: ['ESTRELA', 'COMETA', 'ASTEROIDE', 'GALAXIA'] },
      { categoria: 'DIAS DA SEMANA', palavras: ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA'] },
      { categoria: 'SINAIS DE TRÂNSITO', palavras: ['SEMAFORO', 'PLACA', 'FAIXA', 'LOMBADA'] },
    ],
  },

  {
    titulo: 'Sala de Estar',
    grupos: [
      { categoria: 'BEBIDAS FRIAS', palavras: ['SUCO', 'REFRIGERANTE', 'AGUA', 'LIMONADA'] },
      { categoria: 'FIGURAS GEOMÉTRICAS', palavras: ['CIRCULO', 'QUADRADO', 'TRIANGULO', 'RETANGULO'] },
      { categoria: 'PEDRAS PRECIOSAS', palavras: ['DIAMANTE', 'RUBI', 'ESMERALDA', 'SAFIRA'] },
      { categoria: 'DIAS DA SEMANA', palavras: ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA'] },
    ],
  },

  {
    titulo: 'Estrada Afora',
    grupos: [
      { categoria: 'RÉPTEIS', palavras: ['COBRA', 'JACARE', 'LAGARTO', 'TARTARUGA'] },
      { categoria: 'PARTES DA CASA', palavras: ['SALA', 'COZINHA', 'QUARTO', 'BANHEIRO'] },
      { categoria: 'BEBIDAS FRIAS', palavras: ['SUCO', 'REFRIGERANTE', 'AGUA', 'LIMONADA'] },
      { categoria: 'DIAS DA SEMANA', palavras: ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA'] },
    ],
  },

  {
    titulo: 'Trânsito Seguro',
    grupos: [
      { categoria: 'FERRAMENTAS', palavras: ['MARTELO', 'CHAVE', 'SERROTE', 'ALICATE'] },
      { categoria: 'MÓVEIS DE QUARTO', palavras: ['CAMA', 'ARMARIO', 'TRAVESSEIRO', 'COBERTOR'] },
      { categoria: 'ESPORTES OLÍMPICOS', palavras: ['ATLETISMO', 'NATACAO', 'GINASTICA', 'JUDO'] },
      { categoria: 'UNIDADES DE MEDIDA', palavras: ['METRO', 'LITRO', 'GRAMA', 'QUILO'] },
    ],
  },

  {
    titulo: 'Guarda-Roupa',
    grupos: [
      { categoria: 'FERRAMENTAS DE ESCRITA', palavras: ['CANETA', 'LAPIS', 'GIZ', 'MARCADOR'] },
      { categoria: 'JOGOS DE TABULEIRO', palavras: ['XADREZ', 'DAMA', 'DOMINO', 'BINGO'] },
      { categoria: 'VEÍCULOS AÉREOS', palavras: ['AVIAO', 'HELICOPTERO', 'BALAO', 'FOGUETE'] },
      { categoria: 'PONTOS CARDEAIS', palavras: ['NORTE', 'SUL', 'LESTE', 'OESTE'] },
    ],
  },

  {
    titulo: 'Estilo Pessoal',
    grupos: [
      { categoria: 'ANIMAIS DA SAVANA', palavras: ['LEAO', 'ZEBRA', 'GIRAFA', 'ELEFANTE'] },
      { categoria: 'FIGURAS GEOMÉTRICAS', palavras: ['CIRCULO', 'QUADRADO', 'TRIANGULO', 'RETANGULO'] },
      { categoria: 'PONTOS CARDEAIS', palavras: ['NORTE', 'SUL', 'LESTE', 'OESTE'] },
      { categoria: 'INSTRUMENTOS DE MEDIÇÃO', palavras: ['BALANCA', 'TRENA', 'CRONOMETRO', 'TERMOSTATO'] },
    ],
  },

  {
    titulo: 'Passos Confortáveis',
    grupos: [
      { categoria: 'TIPOS DE DANÇA', palavras: ['SAMBA', 'FORRO', 'BALLET', 'TANGO'] },
      { categoria: 'PARTES DA CASA', palavras: ['SALA', 'COZINHA', 'QUARTO', 'BANHEIRO'] },
      { categoria: 'ÓRGÃOS DO CORPO', palavras: ['CORACAO', 'PULMAO', 'FIGADO', 'RIM'] },
      { categoria: 'PLANETAS', palavras: ['MERCURIO', 'VENUS', 'MARTE', 'JUPITER'] },
    ],
  },

  {
    titulo: 'Retrato Falado',
    grupos: [
      { categoria: 'MATERIAL ESCOLAR', palavras: ['CADERNO', 'BORRACHA', 'REGUA', 'MOCHILA'] },
      { categoria: 'RÉPTEIS', palavras: ['COBRA', 'JACARE', 'LAGARTO', 'TARTARUGA'] },
      { categoria: 'ANIMAIS DE FAZENDA', palavras: ['VACA', 'PORCO', 'OVELHA', 'CAVALO'] },
      { categoria: 'PARTES DO CARRO', palavras: ['VOLANTE', 'MOTOR', 'PNEU', 'FREIO'] },
    ],
  },

  {
    titulo: 'Corpo por Dentro',
    grupos: [
      { categoria: 'ELEMENTOS DA NATUREZA', palavras: ['FOGO', 'AGUA', 'TERRA', 'AR'] },
      { categoria: 'INSTRUMENTOS DE SOPRO', palavras: ['FLAUTA', 'TROMPETE', 'SAXOFONE', 'CLARINETE'] },
      { categoria: 'ESPORTES COM RAQUETE OU TACO', palavras: ['TENIS', 'GOLFE', 'RUGBI', 'POLO'] },
      { categoria: 'FERRAMENTAS', palavras: ['MARTELO', 'CHAVE', 'SERROTE', 'ALICATE'] },
    ],
  },

  {
    titulo: 'Cuidando da Saúde',
    grupos: [
      { categoria: 'GÊNEROS MUSICAIS', palavras: ['ROCK', 'JAZZ', 'REGGAE', 'POP'] },
      { categoria: 'BEBIDAS QUENTES', palavras: ['CAFE', 'CHA', 'CHOCOLATE', 'CAPUCHINO'] },
      { categoria: 'ESPORTES COM RAQUETE OU TACO', palavras: ['TENIS', 'GOLFE', 'RUGBI', 'POLO'] },
      { categoria: 'INSTRUMENTOS DE MEDIÇÃO', palavras: ['BALANCA', 'TRENA', 'CRONOMETRO', 'TERMOSTATO'] },
    ],
  },

  {
    titulo: 'Farmácia Caseira',
    grupos: [
      { categoria: 'JOGOS DE TABULEIRO', palavras: ['XADREZ', 'DAMA', 'DOMINO', 'BINGO'] },
      { categoria: 'BEBIDAS QUENTES', palavras: ['CAFE', 'CHA', 'CHOCOLATE', 'CAPUCHINO'] },
      { categoria: 'GÊNEROS MUSICAIS', palavras: ['ROCK', 'JAZZ', 'REGGAE', 'POP'] },
      { categoria: 'BEBIDAS FRIAS', palavras: ['SUCO', 'REFRIGERANTE', 'AGUA', 'LIMONADA'] },
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
    backgroundColor: GameTheme.success,
  },

  lifeDotLost: {
    backgroundColor: GameTheme.bgSoft,
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
    backgroundColor: GameTheme.accentSoft,
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
