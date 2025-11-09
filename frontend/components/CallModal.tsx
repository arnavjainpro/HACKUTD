"use client";

import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Conversation } from "@elevenlabs/client";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName?: string;
  customerPhone?: string;
  customerId?: string;
  product?: string;
  onAccept: () => void;
  onDecline: () => void;
}

type CallState = "incoming" | "connecting" | "active" | "ended";

export default function CallModal({
  isOpen,
  onClose,
  customerName = "Customer",
  customerPhone = "+1 (555) 123-4567",
  customerId = "unknown",
  product = "unknown",
  onAccept,
  onDecline,
}: CallModalProps) {
  const [callState, setCallState] = useState<CallState>("incoming");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isElevenLabsReady, setIsElevenLabsReady] = useState(false);

  const conversationRef = useRef<Conversation | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCallState("incoming");
      setCallDuration(0);
      setIsMuted(false);
      setIsSpeakerOn(true);
      setIsElevenLabsReady(false);
    }
  }, [isOpen]);

  // Call duration timer
  useEffect(() => {
    if (callState === "active") {
      const timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [callState]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startElevenLabsCall = async () => {
    let knowledgeInjected = false;

    try {
      setCallState("connecting");

      console.log("📚 Injecting customer knowledge into agent...");

      // STEP 1: Update agent prompt with customer knowledge
      const kbResponse = await fetch("/api/elevenlabs-knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, product }),
      });

      if (kbResponse.ok) {
        const kbData = await kbResponse.json();
        knowledgeInjected = true;
        console.log("✅ Agent prompt updated with customer knowledge");
      } else {
        console.warn(
          "⚠️ Failed to inject knowledge, proceeding with default agent"
        );
      }

      // STEP 2: Get signed URL from our API
      const initResponse = await fetch("/api/elevenlabs-init", {
        method: "POST",
      });

      if (!initResponse.ok) {
        throw new Error("Failed to initialize ElevenLabs session");
      }

      const { signedUrl } = await initResponse.json();

      // STEP 3: Initialize ElevenLabs Conversation (agent has updated prompt)
      const conversation = await Conversation.startSession({
        signedUrl,
        onConnect: () => {
          console.log("🎙️ Connected to ElevenLabs agent");
          setCallState("active");
          setIsElevenLabsReady(true);
          if (knowledgeInjected) {
            console.log("✅ Agent has customer knowledge in prompt");
          }
        },
        onDisconnect: () => {
          console.log("📞 Disconnected from agent");
          // Don't auto-end - let user control when to close
        },
        onError: (error) => {
          console.error("❌ ElevenLabs error:", error);
        },
        onMessage: (message) => {
          console.log("💬 Agent said:", message);
        },
      });

      conversationRef.current = conversation;

      // Mark that knowledge was injected for cleanup
      if (knowledgeInjected) {
        (conversation as any)._knowledgeInjected = true;
      }
    } catch (error) {
      console.error("Failed to start ElevenLabs call:", error);
      setCallState("ended");
    }
  };

  const handleAccept = () => {
    onAccept();
    startElevenLabsCall();
  };

  const handleDecline = () => {
    setCallState("ended");
    onDecline();
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleEndCall = async () => {
    if (conversationRef.current) {
      // Reset agent prompt if knowledge was injected
      const knowledgeInjected = (conversationRef.current as any)
        ._knowledgeInjected;
      if (knowledgeInjected) {
        console.log("� Resetting agent prompt...");
        fetch("/api/elevenlabs-knowledge", {
          method: "DELETE",
        }).catch((err) => console.error("Failed to reset agent:", err));
      }

      await conversationRef.current.endSession();
      conversationRef.current = null;
    }
    setCallState("ended");
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const toggleMute = async () => {
    if (conversationRef.current) {
      await conversationRef.current.setVolume({ volume: isMuted ? 1.0 : 0.0 });
    }
    setIsMuted(!isMuted);
  };

  // Cleanup conversation on unmount
  useEffect(() => {
    return () => {
      if (conversationRef.current) {
        conversationRef.current.endSession();
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Phone Modal */}
      <div className="relative w-full max-w-sm mx-4">
        {/* Phone Container */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-900">
          {/* Notch */}
          <div className="h-8 bg-gray-900 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl"></div>
          </div>

          {/* Screen Content */}
          <div className="px-8 py-12 min-h-[600px] flex flex-col items-center justify-between">
            {/* Call Status Header */}
            <div className="text-center space-y-2">
              <div className="text-gray-400 text-sm font-medium tracking-wide">
                {callState === "incoming" && "Incoming Call"}
                {callState === "connecting" && "Connecting..."}
                {callState === "active" && "Call in Progress"}
                {callState === "ended" && "Call Ended"}
              </div>

              {callState === "active" && (
                <div className="text-white text-lg font-semibold">
                  {formatDuration(callDuration)}
                </div>
              )}
            </div>

            {/* Caller Info */}
            <div className="text-center space-y-4 flex-1 flex flex-col justify-center">
              {/* Avatar */}
              <div className="mx-auto">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {customerName.charAt(0)}
                </div>
                {/* Pulsing ring for incoming call */}
                {callState === "incoming" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-purple-500/30 animate-ping"></div>
                  </div>
                )}
              </div>

              {/* Name */}
              <h2 className="text-white text-2xl font-semibold">
                {customerName}
              </h2>

              {/* Phone Number */}
              <p className="text-gray-400 text-sm">{customerPhone}</p>

              {/* ElevenLabs Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-purple-300 text-xs font-medium">
                  AI-Powered Call
                </span>
              </div>

              {/* Call State Messages */}
              {callState === "connecting" && (
                <div className="flex items-center gap-2 text-purple-400 text-sm animate-pulse">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Establishing connection...</span>
                </div>
              )}

              {callState === "active" && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Connected</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-6">
              {/* Active Call Controls */}
              {callState === "active" && (
                <div className="flex items-center justify-center gap-8 mb-6">
                  {/* Mute */}
                  <button
                    onClick={toggleMute}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      isMuted
                        ? "bg-red-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {isMuted ? (
                      <MicOff className="w-6 h-6" />
                    ) : (
                      <Mic className="w-6 h-6" />
                    )}
                  </button>

                  {/* Speaker */}
                  <button
                    onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      isSpeakerOn
                        ? "bg-purple-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {isSpeakerOn ? (
                      <Volume2 className="w-6 h-6" />
                    ) : (
                      <VolumeX className="w-6 h-6" />
                    )}
                  </button>
                </div>
              )}

              {/* Main Call Buttons */}
              <div className="flex items-center justify-center gap-4">
                {callState === "incoming" && (
                  <>
                    {/* Decline */}
                    <button
                      onClick={handleDecline}
                      className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg hover:shadow-red-500/50 transition-all transform hover:scale-105"
                    >
                      <PhoneOff className="w-7 h-7 text-white" />
                    </button>

                    {/* Accept */}
                    <button
                      onClick={handleAccept}
                      className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg hover:shadow-green-500/50 transition-all transform hover:scale-105 animate-pulse"
                    >
                      <Phone className="w-7 h-7 text-white" />
                    </button>
                  </>
                )}

                {(callState === "active" || callState === "connecting") && (
                  <button
                    onClick={handleEndCall}
                    className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg hover:shadow-red-500/50 transition-all transform hover:scale-105"
                  >
                    <PhoneOff className="w-7 h-7 text-white" />
                  </button>
                )}

                {callState === "ended" && (
                  <div className="text-center">
                    <div className="text-gray-400 text-sm">Call completed</div>
                    <button
                      onClick={onClose}
                      className="mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full text-sm transition-all"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Home Indicator */}
          <div className="h-6 bg-gray-900 flex items-center justify-center">
            <div className="w-32 h-1 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
