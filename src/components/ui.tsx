import type { ReactNode } from 'react';
import { playSfx } from '../audio/audio';
import { useGame } from '../hooks/useGame';
import { formatNumber } from '../utils/format';

interface BigButtonProps {
  icon: ReactNode;
  label?: string;
  onClick: () => void;
  color?: 'green' | 'blue' | 'orange' | 'pink' | 'purple' | 'gray';
  size?: 'md' | 'lg' | 'xl';
  disabled?: boolean;
  badge?: ReactNode;
  pulse?: boolean;
  ariaLabel?: string;
}

/** Botão grande, com ícone como informação principal e rótulo curto opcional. */
export function BigButton({ icon, label, onClick, color = 'green', size = 'lg', disabled, badge, pulse, ariaLabel }: BigButtonProps) {
  return (
    <button
      type="button"
      className={`big-btn big-btn--${color} big-btn--${size}${pulse ? ' pulse' : ''}`}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      onClick={() => {
        playSfx('tap');
        onClick();
      }}
    >
      <span className="big-btn__icon" aria-hidden>{icon}</span>
      {label && <span className="big-btn__label">{label}</span>}
      {badge !== undefined && <span className="badge">{badge}</span>}
    </button>
  );
}

export function TopBar({ onHome, title }: { onHome?: () => void; title?: ReactNode }) {
  const { state } = useGame();
  return (
    <header className="top-bar">
      {onHome ? (
        <BigButton icon="🏠" ariaLabel="Voltar" onClick={onHome} color="blue" size="md" />
      ) : (
        <span />
      )}
      {title && <div className="top-bar__title">{title}</div>}
      <div className="resources" aria-label="Recursos">
        <span className="resource" title="Ouro">💰 {formatNumber(state.gold)}</span>
        <span className="resource" title="Ovos">🥚 {state.eggs}</span>
      </div>
    </header>
  );
}

export function Modal({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {onClose && (
          <button type="button" className="modal__close" aria-label="Fechar" onClick={onClose}>
            ✖
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

export function Popups() {
  const { popups } = useGame();
  return (
    <div className="popups" aria-live="polite">
      {popups.map((p) => (
        <div key={p.id} className="popup">{p.text}</div>
      ))}
    </div>
  );
}

const CONFETTI_COLORS = ['#ff6b6b', '#ffd93d', '#6bcB77', '#4d96ff', '#c77dff'];

export function Confetti({ pieces = 30 }: { pieces?: number }) {
  return (
    <div className="confetti" aria-hidden>
      {Array.from({ length: pieces }, (_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 37) % 100}%`,
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animationDelay: `${(i % 10) * 0.08}s`,
            animationDuration: `${1.4 + (i % 5) * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)} aria-label={label}>
      <div className="progress__fill" style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  );
}
