import { CONTORNO } from './Cel';

/**
 * Moeda do jogo em SVG (cartoon, contorno forte). Usada no lugar de emoji porque o emoji de
 * moeda (🪙) não aparece em sistemas mais antigos, como o Windows 10.
 */
export function IconeMoeda({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={`icone-moeda ${className ?? ''}`} role="img" aria-label="moedas">
      <ellipse cx={16} cy={18} rx={13} ry={12} fill="#d49000" stroke={CONTORNO} strokeWidth={2.5} />
      <ellipse cx={16} cy={15} rx={13} ry={12} fill="#ffcc33" stroke={CONTORNO} strokeWidth={2.5} />
      <ellipse cx={16} cy={15} rx={8.5} ry={7.8} fill="none" stroke="#e0a400" strokeWidth={2} />
      <path d="M16 9.5 L17.6 13 L21.3 13.3 L18.5 15.7 L19.4 19.3 L16 17.4 L12.6 19.3 L13.5 15.7 L10.7 13.3 L14.4 13 Z" fill="#fff3b0" stroke="#c98a00" strokeWidth={1} strokeLinejoin="round" />
      <ellipse cx={10} cy={9.5} rx={3} ry={1.8} fill="#fff" opacity={0.7} transform="rotate(-30 10 9.5)" />
    </svg>
  );
}
