"use client";

import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Users,
  CheckCircle,
} from "lucide-react";
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
  isMassCall?: boolean;
}

type CallState =
  | "mass-progress"
  | "mass-complete"
  | "incoming"
  | "connecting"
  | "active"
  | "ended";

export default function CallModal({
  isOpen,
  onClose,
  customerName = "Customer",
  customerPhone = "+1 (555) 123-4567",
  customerId = "unknown",
  product = "unknown",
  onAccept,
  onDecline,
  isMassCall = false,
}: CallModalProps) {
  const [callState, setCallState] = useState<CallState>("incoming");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isElevenLabsReady, setIsElevenLabsReady] = useState(false);
  const [massCallProgress, setMassCallProgress] = useState(0);
  const [callsSent, setCallsSent] = useState(0);
  const [demoCustomerName, setDemoCustomerName] = useState(customerName);
  const [demoCustomerPhone, setDemoCustomerPhone] = useState(customerPhone);

  const conversationRef = useRef<Conversation | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isMassCall) {
        setCallState("mass-progress");
        setMassCallProgress(0);
        setCallsSent(0);
      } else {
        setCallState("incoming");
      }
      setCallDuration(0);
      setIsMuted(false);
      setIsSpeakerOn(true);
      setIsElevenLabsReady(false);
      setDemoCustomerName(customerName);
      setDemoCustomerPhone(customerPhone);
    }
  }, [isOpen, isMassCall, customerName, customerPhone]);

  // Mass call progress animation
  useEffect(() => {
    if (callState === "mass-progress") {
      const totalCalls = 1125;
      const duration = 3000; // 3 seconds
      const steps = 60;
      const increment = totalCalls / steps;
      const interval = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const newProgress = Math.min((currentStep / steps) * 100, 100);
        const newCallsSent = Math.min(
          Math.floor(currentStep * increment),
          totalCalls
        );

        setMassCallProgress(newProgress);
        setCallsSent(newCallsSent);

        if (currentStep >= steps) {
          clearInterval(timer);
          setTimeout(() => {
            setCallState("mass-complete");
          }, 500);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [callState]);

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

  const handleTryItOut = () => {
    // Transition from mass-complete to demo call
    setCallState("incoming");
    setDemoCustomerName("T-Mobile Customer Support");
    setDemoCustomerPhone("+1 (555) 000-0000");
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

  // Show regular modal for mass call progress/complete
  if (callState === "mass-progress" || callState === "mass-complete") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          {/* Mass Call Progress Screen */}
          {callState === "mass-progress" && (
            <div className="p-8 flex flex-col items-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-gray-900 dark:text-white text-2xl font-bold">
                Sending Mass Calls
              </h2>

              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Progress
                  </span>
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">
                    {callsSent} / 1,125 calls
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
                    style={{ width: `${massCallProgress}%` }}
                  ></div>
                </div>
                <div className="text-center text-purple-600 dark:text-purple-400 text-sm font-medium">
                  {Math.round(massCallProgress)}%
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span>Connecting to customers...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                  <span>AI agents being deployed...</span>
                </div>
              </div>
            </div>
          )}

          {/* Mass Call Complete Screen */}
          {callState === "mass-complete" && (
            <div className="p-8 flex flex-col items-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-gray-900 dark:text-white text-2xl font-bold">
                  Mass Calls Sent!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Successfully sent to 1,125 customers
                </p>
              </div>

              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Calls:
                  </span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    1,125
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Success Rate:
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    100%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Avg Duration:
                  </span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    ~2 min
                  </span>
                </div>
              </div>

              <button
                onClick={handleTryItOut}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
              >
                🎧 Try It Out - Test Call
              </button>

              <button
                onClick={onClose}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show phone modal for actual calls
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
            {/* Original Call Screens */}
            <>
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
                    {demoCustomerName.charAt(0)}
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
                  {demoCustomerName}
                </h2>

                {/* Phone Number */}
                <p className="text-gray-400 text-sm">{demoCustomerPhone}</p>

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
                      <div className="text-gray-400 text-sm">
                        Call completed
                      </div>
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
            </>
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
