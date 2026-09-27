export type Screen = 'splash' | 'battle' | 'collection' | 'settings';

export type Navigate = (screen: Screen) => void;
