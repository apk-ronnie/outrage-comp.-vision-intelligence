export class SpeechService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;
  private static isSpeaking = false;
  private static isPaused = false;
  private static listeners: ((state: { isSpeaking: boolean; isPaused: boolean }) => void)[] = [];

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public static subscribe(listener: (state: { isSpeaking: boolean; isPaused: boolean }) => void): () => void {
    this.listeners.push(listener);
    listener({ isSpeaking: this.isSpeaking, isPaused: this.isPaused });
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private static notify() {
    this.listeners.forEach((l) => l({ isSpeaking: this.isSpeaking, isPaused: this.isPaused }));
  }

  public static speak(text: string, lang: 'en' | 'hi' = 'en'): void {
    if (!this.synth) return;

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95; // Clear deliberate cadence for field farmers
    utterance.pitch = 1.0;

    // Look for preferred regional voice if available
    const voices = this.synth.getVoices();
    const targetLangCode = lang === 'hi' ? 'hi' : 'en';
    const matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(targetLangCode));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      this.notify();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      this.notify();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public static pause(): void {
    if (this.synth && this.isSpeaking && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.notify();
    }
  }

  public static resume(): void {
    if (this.synth && this.isSpeaking && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notify();
    }
  }

  public static stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      this.notify();
    }
  }

  public static getState(): { isSpeaking: boolean; isPaused: boolean } {
    return { isSpeaking: this.isSpeaking, isPaused: this.isPaused };
  }
}
