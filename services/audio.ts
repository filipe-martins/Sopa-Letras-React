
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
  try {
    const context = getAudioContext();
    if (context.state === 'suspended') {
        context.resume();
    }
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01);

    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.type = type;

    oscillator.start(context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + duration);
    oscillator.stop(context.currentTime + duration);
  } catch (error) {
    console.error("Could not play sound:", error);
  }
};

export const playSound = (type: 'correct' | 'win') => {
  if (type === 'correct') {
    playTone(600, 0.1, 'triangle');
  } else if (type === 'win') {
    playTone(523.25, 0.15, 'sine');
    setTimeout(() => playTone(659.25, 0.15, 'sine'), 150);
    setTimeout(() => playTone(783.99, 0.2, 'sine'), 300);
  }
};
   