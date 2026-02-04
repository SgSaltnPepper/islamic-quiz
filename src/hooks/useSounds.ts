import { Howl } from 'howler';

// Initialize sounds outside the hook so they are cached and ready to play instantly
const sounds: Record<string, Howl> = {
  correct: new Howl({ src: ['/sounds/correct.wav'], volume: 0.5 }),
  wrong: new Howl({ src: ['/sounds/wrong.wav'], volume: 0.5 }),
  click: new Howl({ src: ['/sounds/click.wav'], volume: 0.3 }),
};

export const useSoundEffects = () => {
  const playSound = (type: 'correct' | 'wrong' | 'click') => {
    if (sounds[type]) {
      sounds[type].play();
    }
  };

  return { playSound };
};