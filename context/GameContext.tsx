import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type GameContextType = {
  fasesPalavraConcluidas: number[];
  fasesEmbaralhadaConcluidas: number[];
  fasesCruzadasConcluidas: number[];
  fasesCacaPalavrasConcluidas: number[];

  concluirFasePalavra: (fase: number) => Promise<boolean>;
  fasePalavraEstaConcluida: (fase: number) => boolean;

  concluirFaseEmbaralhada: (fase: number) => Promise<boolean>;
  faseEmbaralhadaEstaConcluida: (fase: number) => boolean;

  concluirFaseCruzada: (fase: number) => Promise<boolean>;
  faseCruzadaEstaConcluida: (fase: number) => boolean;

  concluirFaseCacaPalavras: (fase: number) => Promise<boolean>;
  faseCacaPalavrasEstaConcluida: (fase: number) => boolean;

  fasesSudokuConcluidas: number[];
  fasesConexoConcluidas: number[];

  concluirFaseSudoku: (fase: number) => Promise<boolean>;
  faseSudokuEstaConcluida: (fase: number) => boolean;

  concluirFaseConexo: (fase: number) => Promise<boolean>;
  faseConexoEstaConcluida: (fase: number) => boolean;

  carregarProgresso: () => Promise<void>;
};

const GameContext = createContext<GameContextType | undefined>(
  undefined
);

const STORAGE_FASES_PALAVRA =
  '@jogos_fases_palavra_oculta';

const STORAGE_FASES_EMBARALHADA =
  '@jogos_fases_palavra_embaralhada';

const STORAGE_FASES_CRUZADAS =
  '@jogos_fases_palavras_cruzadas';

const STORAGE_FASES_CACA_PALAVRAS =
  '@jogos_fases_caca_palavras';

const STORAGE_FASES_SUDOKU =
  '@jogos_fases_sudoku';

const STORAGE_FASES_CONEXO =
  '@jogos_fases_conexo';

type GameProviderProps = {
  children: ReactNode;
};

export function GameProvider({
  children,
}: GameProviderProps) {
  const [
    fasesPalavraConcluidas,
    setFasesPalavraConcluidas,
  ] = useState<number[]>([]);

  const [
    fasesEmbaralhadaConcluidas,
    setFasesEmbaralhadaConcluidas,
  ] = useState<number[]>([]);

  const [
    fasesCruzadasConcluidas,
    setFasesCruzadasConcluidas,
  ] = useState<number[]>([]);

  const [
    fasesCacaPalavrasConcluidas,
    setFasesCacaPalavrasConcluidas,
  ] = useState<number[]>([]);

  const [
    fasesSudokuConcluidas,
    setFasesSudokuConcluidas,
  ] = useState<number[]>([]);

  const [
    fasesConexoConcluidas,
    setFasesConexoConcluidas,
  ] = useState<number[]>([]);

  async function carregarProgresso() {
    try {
      const valorPalavra =
        await AsyncStorage.getItem(
          STORAGE_FASES_PALAVRA
        );

      const valorEmbaralhada =
        await AsyncStorage.getItem(
          STORAGE_FASES_EMBARALHADA
        );

      const valorCruzadas =
        await AsyncStorage.getItem(
          STORAGE_FASES_CRUZADAS
        );

      const valorCacaPalavras =
        await AsyncStorage.getItem(
          STORAGE_FASES_CACA_PALAVRAS
        );

      const valorSudoku =
        await AsyncStorage.getItem(
          STORAGE_FASES_SUDOKU
        );

      const valorConexo =
        await AsyncStorage.getItem(
          STORAGE_FASES_CONEXO
        );

      if (valorPalavra !== null) {
        const fases = JSON.parse(valorPalavra);

        if (Array.isArray(fases)) {
          setFasesPalavraConcluidas(fases);
        }
      }

      if (valorEmbaralhada !== null) {
        const fases = JSON.parse(valorEmbaralhada);

        if (Array.isArray(fases)) {
          setFasesEmbaralhadaConcluidas(fases);
        }
      }

      if (valorCruzadas !== null) {
        const fases = JSON.parse(valorCruzadas);

        if (Array.isArray(fases)) {
          setFasesCruzadasConcluidas(fases);
        }
      }

      if (valorCacaPalavras !== null) {
        const fases = JSON.parse(valorCacaPalavras);

        if (Array.isArray(fases)) {
          setFasesCacaPalavrasConcluidas(fases);
        }
      }

      if (valorSudoku !== null) {
        const fases = JSON.parse(valorSudoku);

        if (Array.isArray(fases)) {
          setFasesSudokuConcluidas(fases);
        }
      }

      if (valorConexo !== null) {
        const fases = JSON.parse(valorConexo);

        if (Array.isArray(fases)) {
          setFasesConexoConcluidas(fases);
        }
      }
    } catch (erro) {
      console.log(
        'Erro ao carregar progresso:',
        erro
      );
    }
  }

  async function concluirFasePalavra(
    fase: number
  ) {
    if (
      fasesPalavraConcluidas.includes(fase)
    ) {
      return false;
    }

    try {
      const novasFases = [
        ...fasesPalavraConcluidas,
        fase,
      ].sort((a, b) => a - b);

      setFasesPalavraConcluidas(novasFases);

      await AsyncStorage.setItem(
        STORAGE_FASES_PALAVRA,
        JSON.stringify(novasFases)
      );

      return true;
    } catch (erro) {
      console.log(
        'Erro ao concluir Palavra Oculta:',
        erro
      );

      return false;
    }
  }

  function fasePalavraEstaConcluida(
    fase: number
  ) {
    return fasesPalavraConcluidas.includes(
      fase
    );
  }

  async function concluirFaseEmbaralhada(
    fase: number
  ) {
    if (
      fasesEmbaralhadaConcluidas.includes(
        fase
      )
    ) {
      return false;
    }

    try {
      const novasFases = [
        ...fasesEmbaralhadaConcluidas,
        fase,
      ].sort((a, b) => a - b);

      setFasesEmbaralhadaConcluidas(
        novasFases
      );

      await AsyncStorage.setItem(
        STORAGE_FASES_EMBARALHADA,
        JSON.stringify(novasFases)
      );

      return true;
    } catch (erro) {
      console.log(
        'Erro ao concluir Palavra Embaralhada:',
        erro
      );

      return false;
    }
  }

  function faseEmbaralhadaEstaConcluida(
    fase: number
  ) {
    return fasesEmbaralhadaConcluidas.includes(
      fase
    );
  }

  async function concluirFaseCruzada(
    fase: number
  ) {
    if (
      fasesCruzadasConcluidas.includes(
        fase
      )
    ) {
      return false;
    }

    try {
      const novasFases = [
        ...fasesCruzadasConcluidas,
        fase,
      ].sort((a, b) => a - b);

      setFasesCruzadasConcluidas(
        novasFases
      );

      await AsyncStorage.setItem(
        STORAGE_FASES_CRUZADAS,
        JSON.stringify(novasFases)
      );

      return true;
    } catch (erro) {
      console.log(
        'Erro ao concluir Palavras Cruzadas:',
        erro
      );

      return false;
    }
  }

  function faseCruzadaEstaConcluida(
    fase: number
  ) {
    return fasesCruzadasConcluidas.includes(
      fase
    );
  }

  async function concluirFaseCacaPalavras(
    fase: number
  ) {
    if (
      fasesCacaPalavrasConcluidas.includes(
        fase
      )
    ) {
      return false;
    }

    try {
      const novasFases = [
        ...fasesCacaPalavrasConcluidas,
        fase,
      ].sort((a, b) => a - b);

      setFasesCacaPalavrasConcluidas(
        novasFases
      );

      await AsyncStorage.setItem(
        STORAGE_FASES_CACA_PALAVRAS,
        JSON.stringify(novasFases)
      );

      return true;
    } catch (erro) {
      console.log(
        'Erro ao concluir Caça-Palavras:',
        erro
      );

      return false;
    }
  }

  function faseCacaPalavrasEstaConcluida(
    fase: number
  ) {
    return fasesCacaPalavrasConcluidas.includes(
      fase
    );
  }

  async function concluirFaseSudoku(
    fase: number
  ) {
    if (
      fasesSudokuConcluidas.includes(fase)
    ) {
      return false;
    }

    try {
      const novasFases = [
        ...fasesSudokuConcluidas,
        fase,
      ].sort((a, b) => a - b);

      setFasesSudokuConcluidas(novasFases);

      await AsyncStorage.setItem(
        STORAGE_FASES_SUDOKU,
        JSON.stringify(novasFases)
      );

      return true;
    } catch (erro) {
      console.log(
        'Erro ao concluir Sudoku:',
        erro
      );

      return false;
    }
  }

  function faseSudokuEstaConcluida(
    fase: number
  ) {
    return fasesSudokuConcluidas.includes(
      fase
    );
  }

  async function concluirFaseConexo(
    fase: number
  ) {
    if (
      fasesConexoConcluidas.includes(fase)
    ) {
      return false;
    }

    try {
      const novasFases = [
        ...fasesConexoConcluidas,
        fase,
      ].sort((a, b) => a - b);

      setFasesConexoConcluidas(novasFases);

      await AsyncStorage.setItem(
        STORAGE_FASES_CONEXO,
        JSON.stringify(novasFases)
      );

      return true;
    } catch (erro) {
      console.log(
        'Erro ao concluir Conexo:',
        erro
      );

      return false;
    }
  }

  function faseConexoEstaConcluida(
    fase: number
  ) {
    return fasesConexoConcluidas.includes(
      fase
    );
  }

  useEffect(() => {
    carregarProgresso();
  }, []);

  return (
    <GameContext.Provider
      value={{
        fasesPalavraConcluidas,
        fasesEmbaralhadaConcluidas,
        fasesCruzadasConcluidas,
        fasesCacaPalavrasConcluidas,

        concluirFasePalavra,
        fasePalavraEstaConcluida,

        concluirFaseEmbaralhada,
        faseEmbaralhadaEstaConcluida,

        concluirFaseCruzada,
        faseCruzadaEstaConcluida,

        concluirFaseCacaPalavras,
        faseCacaPalavrasEstaConcluida,

        fasesSudokuConcluidas,
        fasesConexoConcluidas,

        concluirFaseSudoku,
        faseSudokuEstaConcluida,

        concluirFaseConexo,
        faseConexoEstaConcluida,

        carregarProgresso,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error(
      'useGame precisa ser usado dentro de um GameProvider'
    );
  }

  return context;
}