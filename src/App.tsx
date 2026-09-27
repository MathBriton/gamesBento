import { useState, type ComponentType } from 'react';
import { Avisos } from './componentes/ui';
import { ProvedorJogo } from './ganchos/useJogo';
import { TelaBatalha } from './telas/batalha/TelaBatalha';
import type { Navegar, Tela } from './telas/navegacao';
import { TelaAbertura } from './telas/TelaAbertura';
import { TelaAjustes } from './telas/TelaAjustes';
import { TelaColecao } from './telas/TelaColecao';

const TELAS: Record<Tela, ComponentType<{ navegar: Navegar }>> = {
  abertura: TelaAbertura,
  batalha: TelaBatalha,
  colecao: TelaColecao,
  ajustes: TelaAjustes,
};

export function App() {
  const [tela, setTela] = useState<Tela>('abertura');
  const Atual = TELAS[tela];

  return (
    <ProvedorJogo>
      <main className="app">
        <Atual key={tela} navegar={setTela} />
        <Avisos />
      </main>
    </ProvedorJogo>
  );
}
