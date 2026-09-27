import { unlockAudio } from '../audio/audio';
import { Egg } from '../components/Egg';
import type { Navigate } from './navigation';

export function SplashScreen({ navigate }: { navigate: Navigate }) {
  const start = () => {
    unlockAudio();
    navigate('battle');
  };
  return (
    <button type="button" className="screen splash" onClick={start} aria-label="Começar">
      <h1 className="logo">
        <span>Ilha dos</span>
        <span className="logo__big">Dinossauros</span>
      </h1>
      <Egg className="splash__egg wobble" />
      <span className="splash__play" aria-hidden>▶</span>
    </button>
  );
}
