import { useState, type ComponentType } from 'react';
import { Popups } from './components/ui';
import { GameProvider } from './hooks/useGame';
import { BattleScreen } from './screens/battle/BattleScreen';
import { CollectionScreen } from './screens/CollectionScreen';
import type { Navigate, Screen } from './screens/navigation';
import { SettingsScreen } from './screens/SettingsScreen';
import { SplashScreen } from './screens/SplashScreen';

const SCREENS: Record<Screen, ComponentType<{ navigate: Navigate }>> = {
  splash: SplashScreen,
  battle: BattleScreen,
  collection: CollectionScreen,
  settings: SettingsScreen,
};

export function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const Current = SCREENS[screen];

  return (
    <GameProvider>
      <main className="app">
        <Current key={screen} navigate={setScreen} />
        <Popups />
      </main>
    </GameProvider>
  );
}
