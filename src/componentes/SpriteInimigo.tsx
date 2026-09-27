import { INIMIGOS } from '../dados/inimigos';
import type { TipoInimigo } from '../tipos';
import { DESENHOS_MONSTROS } from './inimigos/monstros';

interface Props {
  tipo: TipoInimigo;
  chefao?: boolean;
  className?: string;
}

/** Monstro mitológico (versão infantil); o chefão ganha coroa e olhar determinado. */
export function SpriteInimigo({ tipo, chefao = false, className }: Props) {
  const def = INIMIGOS[tipo];
  const Desenho = DESENHOS_MONSTROS[tipo];
  return (
    <svg viewBox="-4 -10 208 204" className={className} role="img" aria-label={chefao ? def.nomeChefao : def.nome}>
      <ellipse cx={100} cy={186} rx={66} ry={7} fill="rgba(0,0,0,0.2)" />
      <Desenho chefao={chefao} />
    </svg>
  );
}
