import React, { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface VoiceInterfaceProps {
    onCommand: (command: string) => void;
    isSpeaking: boolean;
    onToggleSpeech: (enabled: boolean) => void;
    speechEnabled: boolean;
}

export function VoiceInterface({ onCommand, isSpeaking, onToggleSpeech, speechEnabled }: VoiceInterfaceProps) {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && ("ScaleSpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            const rec = new SpeechRecognition();
            rec.continuous = false;
            rec.interimResults = false;
            rec.lang = "en-US";

            rec.onresult = (event: any) => {
                const command = event.results[0][0].transcript;
                console.log("Voice Command:", command);
                onCommand(command);
                setIsListening(false);
            };

            rec.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
            };

            rec.onend = () => {
                setIsListening(false);
            };

            setRecognition(rec);
        }
    }, [onCommand]);

    const toggleListening = () => {
        if (isListening) {
            recognition?.stop();
        } else {
            recognition?.start();
            setIsListening(true);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={toggleListening}
                className={`p-2 rounded-full border transition-all ${isListening
                        ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                        : "bg-black/20 border-white/10 text-muted-foreground hover:bg-white/5 hover:text-white"
                    }`}
                title={isListening ? "Stop Listening" : "Voice Command"}
            >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
                onClick={() => onToggleSpeech(!speechEnabled)}
                className={`p-2 rounded-full border transition-all ${speechEnabled
                        ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                        : "bg-black/20 border-white/10 text-muted-foreground hover:bg-white/5 hover:text-white"
                    }`}
                title={speechEnabled ? "Mute Assistant" : "Unmute Assistant"}
            >
                {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {isSpeaking && (
                <div className="flex items-center gap-1 ml-2">
                    <div className="w-1 h-3 bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1 h-5 bg-primary animate-bounce" style={{ animationDelay: "100ms" }} />
                    <div className="w-1 h-4 bg-primary animate-bounce" style={{ animationDelay: "200ms" }} />
                </div>
            )}
        </div>
    );
}
