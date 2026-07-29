import { useState, useRef, useCallback } from "react";

export interface SpeechResult {
  transcript: string;
  isListening: boolean;
  confidence: number;
  pauseCount: number;
  supported: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  getDurationSeconds: () => number;
}

export function useSpeech(): SpeechResult {
  const [transcript, setTranscript]   = useState("");
  const [isListening, setIsListening] = useState(false);
  const [confidence, setConfidence]   = useState(0);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const startTimeRef   = useRef<number>(0);
  const pauseCountRef  = useRef(0);

  // Check browser support
  const SpeechRecognitionAPI =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const supported = !!SpeechRecognitionAPI;

  const start = useCallback(() => {
    if (!supported) return;

    const recognition: SpeechRecognition = new SpeechRecognitionAPI();
    recognition.lang            = "en-US";
    recognition.interimResults  = false; // only final results
    recognition.maxAlternatives = 1;
    recognition.continuous      = true;  // keep listening until stop()

    recognition.onstart = () => {
      setIsListening(true);
      startTimeRef.current  = Date.now();
      pauseCountRef.current = 0;
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let newText = "";
      let latestConfidence = 0;
      // resultIndex = first NEW result in this event — avoids re-processing old ones
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          newText += event.results[i][0].transcript + " ";
          latestConfidence = event.results[i][0].confidence;
        }
      }
      if (newText) {
        setTranscript((prev) => (prev ? prev + " " + newText.trim() : newText.trim()));
        setConfidence(latestConfidence);
      }
    };

    recognition.onspeechend = () => {
      // Each gap in speech counts as a pause
      pauseCountRef.current += 1;
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", e.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [supported]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    setTranscript("");
    setConfidence(0);
    pauseCountRef.current = 0;
    startTimeRef.current  = 0;
  }, [stop]);

  const getDurationSeconds = useCallback(() => {
    if (!startTimeRef.current) return 0;
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  }, []);

  return {
    transcript,
    isListening,
    confidence,
    pauseCount: pauseCountRef.current,
    supported,
    start,
    stop,
    reset,
    getDurationSeconds,
  };
}
