import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { playSfx } from '../../audio/audio';
import { DinoSprite } from '../../components/DinoSprite';
import { EnemySprite } from '../../components/EnemySprite';
import { BigButton, Modal, ProgressBar } from '../../components/ui';
import { CONFIG } from '../../data/config';
import { DINO_IDS } from '../../data/dinosaurs';
import { ENEMIES } from '../../data/enemies';
import { EVOLUTIONS } from '../../data/evolution';
import { applyDamage, canChallengeBoss, challengeBoss, tick, type BattleEvent } from '../../game/battle/battle';
import { evolutionOf, tapDamage, teamDps } from '../../game/battle/formulas';
import type { BuyAmount } from '../../game/battle/upgrades';
import { useGame } from '../../hooks/useGame';
import type { DinoId } from '../../types';
import { formatDuration, formatNumber } from '../../utils/format';
import { defaultRng } from '../../utils/random';
import type { Navigate } from '../navigation';
import { EggsPanel } from './EggsPanel';
import { EvolutionModal } from './EvolutionModal';
import { HatchModal } from './HatchModal';
import { TeamPanel } from './TeamPanel';
import { zoneFor } from './zone';

const TICK_MS = 100;
const MAX_FLOATS = 14;

interface FloatText {
  id: number;
  x: number;
  y: number;
  text: string;
  kind: 'hit' | 'crit' | 'gold';
}

type Tab = 'team' | 'eggs';

export function BattleScreen({ navigate }: { navigate: Navigate }) {
  const { state, run, update, showPopup, offline, dismissOffline } = useGame();
  const [tab, setTab] = useState<Tab>('team');
  const [amount, setAmount] = useState<BuyAmount>(1);
  const [floats, setFloats] = useState<FloatText[]>([]);
  const [hatching, setHatching] = useState(false);
  const [evolved, setEvolved] = useState<{ dinoId: DinoId; stage: number } | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const enemyRef = useRef<HTMLDivElement>(null);
  const floatId = useRef(1);

  const b = state.battle;
  const zone = zoneFor(b.stage);
  const enemy = ENEMIES[b.enemyKind];
  const team = DINO_IDS.filter((id) => state.dinos[id]);

  const addFloat = (f: Omit<FloatText, 'id'>) => {
    const id = floatId.current++;
    setFloats((list) => [...list.slice(-(MAX_FLOATS - 1)), { ...f, id }]);
    window.setTimeout(() => setFloats((list) => list.filter((x) => x.id !== id)), 900);
  };

  const handleEvents = (events: BattleEvent[], fromTap: boolean) => {
    for (const e of events) {
      if (e.type === 'kill') {
        if (fromTap || e.boss) playSfx('coin');
        addFloat({ x: 50 + (Math.random() * 20 - 10), y: 30, text: `+${formatNumber(e.gold)} 💰`, kind: 'gold' });
      } else if (e.type === 'egg') {
        playSfx('success');
        showPopup('👑 +1 🥚');
      } else if (e.type === 'bossFail') {
        playSfx('fail');
        showPopup('⏱️ Tempo esgotado!');
      }
    }
  };
  // O loop usa sempre a versão mais recente do tratador de eventos.
  const handleEventsRef = useRef(handleEvents);
  handleEventsRef.current = handleEvents;

  // Loop de batalha: dano automático do time com o tempo real decorrido.
  useEffect(() => {
    let last = performance.now();
    const id = window.setInterval(() => {
      const t = performance.now();
      const dt = Math.min((t - last) / 1000, 1);
      last = t;
      // Aba escondida: pausa; o tempo fora é pago pelo cálculo offline ao voltar.
      if (document.hidden) return;
      const r = run((s) => tick(s, dt, Date.now(), defaultRng));
      if (r.events.length) handleEventsRef.current(r.events, false);
      setNow(Date.now());
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [run]);

  // Som de chefão ao entrar na fase dele.
  useEffect(() => {
    if (b.isBoss) playSfx('boss');
  }, [b.isBoss, b.stage]);

  const onTap = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const crit = defaultRng() < CONFIG.critChance;
    const dmg = tapDamage(state) * (crit ? CONFIG.critMultiplier : 1);
    const r = run((s) => applyDamage(s, dmg, Date.now(), defaultRng));
    handleEvents(r.events, true);
    playSfx(crit ? 'crit' : 'hit');
    addFloat({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      text: crit ? `CRÍTICO! ${formatNumber(dmg)}` : formatNumber(dmg),
      kind: crit ? 'crit' : 'hit',
    });
    enemyRef.current?.animate(
      [{ transform: 'translateX(0) scale(1)' }, { transform: 'translateX(6px) scale(0.94)', filter: 'brightness(1.8)' }, { transform: 'translateX(0) scale(1)' }],
      { duration: 140 },
    );
  };

  const bossLeft = b.bossEndsAt !== null ? Math.max(0, b.bossEndsAt - now) : 0;

  return (
    <div className="screen battle" style={{ background: zone.region.background }}>
      <header className="battle-top">
        <span className="resource resource--gold" title="Ouro">💰 {formatNumber(state.gold)}</span>
        <span className="resource" title="Dano por segundo do time">⚔️ {formatNumber(teamDps(state))}/s</span>
        <div className="battle-top__buttons">
          <button type="button" className="icon-btn" aria-label="Coleção" onClick={() => navigate('collection')}>📖</button>
          <button type="button" className="icon-btn" aria-label="Ajustes" onClick={() => navigate('settings')}>⚙️</button>
        </div>
      </header>

      <div className="stage-bar">
        <div className="stage-bar__title">
          {zone.region.icon} Fase {b.stage}
          {b.maxStage > b.stage && <small> (recorde {b.maxStage})</small>}
        </div>
        {b.isBoss ? (
          <div className="stage-bar__boss">👑 CHEFÃO · ⏱️ {Math.ceil(bossLeft / 1000)}s</div>
        ) : (
          <div className="stage-bar__pips" aria-label={`${b.kills} de ${CONFIG.enemiesPerStage} inimigos`}>
            {Array.from({ length: CONFIG.enemiesPerStage }, (_, i) => (
              <span key={i} className={i < b.kills ? 'pip pip--on' : 'pip'} />
            ))}
          </div>
        )}
      </div>

      <div className={`arena ${b.isBoss ? 'arena--boss' : ''}`} onPointerDown={onTap} role="button" aria-label="Atacar o inimigo">
        <div className="enemy-info">
          <div className="enemy-info__name">{b.isBoss ? `👑 ${enemy.bossName}` : enemy.name}</div>
          <div className="hp-bar" role="progressbar" aria-valuemin={0} aria-valuemax={b.enemyMaxHp} aria-valuenow={Math.ceil(b.enemyHp)}>
            <div className="hp-bar__fill" style={{ width: `${(b.enemyHp / b.enemyMaxHp) * 100}%` }} />
            <span className="hp-bar__text">{formatNumber(Math.ceil(b.enemyHp))} / {formatNumber(b.enemyMaxHp)}</span>
          </div>
          {b.isBoss && (
            <div className="boss-timer">
              <ProgressBar value={bossLeft / CONFIG.bossTimeMs} label="Tempo do chefão" />
            </div>
          )}
        </div>

        <div className="enemy" ref={enemyRef}>
          <EnemySprite
            key={`${b.stage}-${b.kills}-${b.isBoss}`}
            kind={b.enemyKind}
            color={zone.enemyColor}
            boss={b.isBoss}
            className="enemy__sprite"
          />
        </div>

        <div className="team-row">
          {team.length === 0 ? (
            <div className="team-row__empty">🥚 Choque seu primeiro ovo!</div>
          ) : (
            team.map((id, i) => {
              const evo = evolutionOf(state.dinos[id]!.level);
              return (
                <div key={id} className="team-row__dino" style={{ animationDelay: `${i * 0.23}s`, width: `${28 * EVOLUTIONS[evo].scale}%` }}>
                  <DinoSprite dinoId={id} evolution={evo} />
                </div>
              );
            })
          )}
        </div>

        {floats.map((f) => (
          <span key={f.id} className={`float float--${f.kind}`} style={{ left: `${f.x}%`, top: `${f.y}%` }}>
            {f.text}
          </span>
        ))}

        {canChallengeBoss(state) && (
          <button
            type="button"
            className="boss-btn pulse"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => update((s) => challengeBoss(s, Date.now(), defaultRng))}
          >
            👑 Enfrentar chefão
          </button>
        )}
      </div>

      <section className="panel">
        <div className="tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'team'} className={`tab ${tab === 'team' ? 'tab--on' : ''}`} onClick={() => setTab('team')}>
            🦖 Time
          </button>
          <button type="button" role="tab" aria-selected={tab === 'eggs'} className={`tab ${tab === 'eggs' ? 'tab--on' : ''}`} onClick={() => setTab('eggs')}>
            🥚 Ovos {state.eggs > 0 && <span className="badge badge--inline">{state.eggs}</span>}
          </button>
        </div>
        <div className="panel__body">
          {tab === 'team' ? (
            <TeamPanel amount={amount} onAmount={setAmount} onEvolve={(dinoId, stage) => setEvolved({ dinoId, stage })} />
          ) : (
            <EggsPanel onHatch={() => setHatching(true)} />
          )}
        </div>
      </section>

      {hatching && (
        <HatchModal
          onDone={(evo) => {
            setHatching(false);
            if (evo) setEvolved(evo);
          }}
        />
      )}
      {evolved && <EvolutionModal dinoId={evolved.dinoId} stage={evolved.stage} onClose={() => setEvolved(null)} />}
      {offline && !hatching && !evolved && (
        <Modal onClose={dismissOffline}>
          <div className="offline">
            <div className="offline__icon">🌙</div>
            <h2>Bem-vindo de volta!</h2>
            <p>Seu time lutou por <b>{formatDuration(offline.elapsedMs)}</b> enquanto você estava fora.</p>
            <div className="reward-line">+{formatNumber(offline.gold)} 💰</div>
            <BigButton icon="⚔️" label="Coletar" color="orange" onClick={dismissOffline} />
          </div>
        </Modal>
      )}
    </div>
  );
}
