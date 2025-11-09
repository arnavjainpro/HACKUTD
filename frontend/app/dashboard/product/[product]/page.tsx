"use client";

import { useEffect, useState } from "react";
import { usePMDashboardStore } from "@/lib/pmStore";
import { getFeedbackByProduct } from "@/lib/feedbackUtils";
import {
  ArrowLeft,
  Phone,
  Loader2,
  Sparkles,
  Gift,
  Wrench,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import type { FeedbackItem } from "@/lib/feedbackUtils";
import CallModal from "@/components/CallModal";
import EmailModal from "@/components/EmailModal";

interface GeminiRecommendation {
  action: string;
  header: string;
  color: string;
  points: string[];
}

interface EmailData {
  subject: string;
  body: string;
}

interface CHIRecommendationResponse {
  success: boolean;
  product_id: number;
  product_name: string;
  chi_percentage: number;
  total_transcripts: number;
  recommendation: GeminiRecommendation;
}

export default function ProductDetailPage({
  params,
}: {
  params: { product: string };
}) {
  const productName = decodeURIComponent(params.product);
  const { theme, isEscalating, isCalling, setIsEscalating, setIsCalling } =
    usePMDashboardStore();

  const [allFeedback, setAllFeedback] = useState<FeedbackItem[]>([]);
  const [escalationResult, setEscalationResult] = useState<string | null>(null);
  const [callResult, setCallResult] = useState<string | null>(null);
  const [promotionResult, setPromotionResult] = useState<string | null>(null);
  const [isGeneratingPromotion, setIsGeneratingPromotion] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [geminiRecommendation, setGeminiRecommendation] =
    useState<GeminiRecommendation | null>(null);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [currentCHI, setCurrentCHI] = useState(0);
  const [quarterlyData, setQuarterlyData] = useState<
    Array<{ quarter: string; score: number }>
  >([]);

  // Email modal states
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailModalType, setEmailModalType] = useState<"tech" | "promotion">(
    "tech"
  );
  const [techEmail, setTechEmail] = useState<EmailData | null>(null);
  const [promotionEmail, setPromotionEmail] = useState<EmailData | null>(null);

  // Map product names to product IDs
  const productIdMap: { [key: string]: number } = {
    "Mobile Hotspot": 1,
    "Magenta Max": 2,
    "Business Unlimited": 3,
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    setAllFeedback(getFeedbackByProduct(productName));

    // Fetch Gemini recommendation and quarterly CHI data from backend
    const productId = productIdMap[productName];
    console.log("🔍 Product:", productName, "-> ID:", productId);

    if (productId) {
      // Fetch Gemini recommendation
      setIsLoadingRecommendation(true);
      fetch(`http://localhost:8000/api/chi/recommendation/${productId}`)
        .then((res) => res.json())
        .then((data: CHIRecommendationResponse) => {
          if (data.success) {
            setGeminiRecommendation(data.recommendation);
            console.log(
              "✅ Gemini Recommendation loaded:",
              data.recommendation,
              "CHI:",
              data.chi_percentage
            );
          }
        })
        .catch((err) => console.error("❌ Error loading recommendation:", err))
        .finally(() => setIsLoadingRecommendation(false));

      // Fetch quarterly CHI data
      console.log("📊 Fetching quarterly data for product ID:", productId);
      fetch(`http://localhost:8000/api/chi/quarterly/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("📊 Quarterly response:", data);
          if (data.success) {
            setQuarterlyData(data.quarterly_data);
            const q4Score =
              data.quarterly_data[data.quarterly_data.length - 1].score;
            setCurrentCHI(q4Score);
            console.log(
              "✅ Quarterly CHI loaded:",
              data.quarterly_data,
              "Q4 Score:",
              q4Score
            );
          }
        })
        .catch((err) => console.error("❌ Error loading quarterly data:", err));
    } else {
      console.warn("⚠️ No product ID found for:", productName);
    }
  }, [theme, productName]);

  const handleEscalateTech = async () => {
    setIsEscalating(true);
    setEscalationResult(null);

    try {
      const productId = productIdMap[productName];

      // Fetch transcripts from backend
      const transcriptsResponse = await fetch(
        `http://localhost:8000/api/chi/product/${productId}`
      );
      const transcriptsData = await transcriptsResponse.json();

      // Check if the API call was successful and has data
      if (!transcriptsData.success || !transcriptsData.rows) {
        throw new Error("Failed to fetch transcripts data");
      }

      const transcripts = transcriptsData.rows.map((t: any) => t.transcript);

      const response = await fetch(
        "http://localhost:8000/api/generate-emails",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_name: productName,
            product_id: productId,
            transcripts: transcripts,
            email_type: "tech_ticket",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Store tech email data
        setTechEmail({
          subject: data.tech_ticket.subject,
          body: data.tech_ticket.body,
        });

        // Open modal with tech email
        setEmailModalType("tech");
        setIsEmailModalOpen(true);

        console.log("✅ Tech email generated:", data.tech_ticket);
      } else {
        setEscalationResult("Error: Failed to generate email");
      }
    } catch (error) {
      console.error("Email generation failed:", error);
      setEscalationResult("Error: Failed to generate email");
    } finally {
      setIsEscalating(false);
    }
  };

  const handleGeneratePromotion = async () => {
    setIsGeneratingPromotion(true);
    setPromotionResult(null);

    try {
      const productId = productIdMap[productName];

      // Fetch transcripts from backend
      const transcriptsResponse = await fetch(
        `http://localhost:8000/api/chi/product/${productId}`
      );
      const transcriptsData = await transcriptsResponse.json();

      // Check if the API call was successful and has data
      if (!transcriptsData.success || !transcriptsData.rows) {
        throw new Error("Failed to fetch transcripts data");
      }

      const transcripts = transcriptsData.rows.map((t: any) => t.transcript);

      const response = await fetch(
        "http://localhost:8000/api/generate-emails",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_name: productName,
            product_id: productId,
            transcripts: transcripts,
            email_type: "loyalty_promotion",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Store promotion email data
        setPromotionEmail({
          subject: data.loyalty_promotion.subject,
          body: data.loyalty_promotion.body,
        });

        // Open modal with promotion email
        setEmailModalType("promotion");
        setIsEmailModalOpen(true);

        console.log("✅ Promotion email generated:", data.loyalty_promotion);
      } else {
        setPromotionResult("Error: Failed to generate email");
      }
    } catch (error) {
      console.error("Promotion generation failed:", error);
      setPromotionResult("Error: Failed to generate promotion");
    } finally {
      setIsGeneratingPromotion(false);
    }
  };

  const handleMassCall = async () => {
    // Open the call modal first
    setIsCallModalOpen(true);
  };

  const handleSendEmail = () => {
    // Close modal and show confirmation
    setIsEmailModalOpen(false);

    if (emailModalType === "tech") {
      setEscalationResult(
        `✅ Tech support email sent to chithra.sathish.akilan@gmail.com\n\nSubject: ${techEmail?.subject}\n\n${techEmail?.body}`
      );
    } else {
      setPromotionResult(
        `✅ Promotion email sent to customers@gmail.com\n\nSubject: ${promotionEmail?.subject}\n\n${promotionEmail?.body}`
      );
    }

    console.log(
      `📧 Email sent - Type: ${emailModalType}, Recipient: ${
        emailModalType === "tech"
          ? "chithra.sathish.akilan@gmail.com"
          : "customers@gmail.com"
      }`
    );
  };

  const handleCloseEmailModal = () => {
    setIsEmailModalOpen(false);
  };

  const handleAcceptCall = async () => {
    // Start the actual calling process
    setIsCalling(true);
    setCallResult(null);

    const feedbackItems = allFeedback.filter(
      (f) => f.type === "Feedback" && f.phone
    );

    try {
      // Use the first customer for the demo call
      const firstCustomer = feedbackItems[0];

      // Generate a customer name from location or use generic name
      const customerName = firstCustomer?.location
        ? `Customer from ${firstCustomer.location.split(",")[0]}`
        : "T-Mobile Customer";

      const response = await fetch("/api/feedback-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: firstCustomer?.id || 0,
          customerName,
          transcript:
            firstCustomer?.transcript ||
            feedbackItems.map((f) => f.transcript).join("\n"),
          phone:
            firstCustomer?.phone ||
            feedbackItems.map((f) => f.phone).join(", "),
        }),
      });

      const data = await response.json();
      setCallResult(data.memo);
    } catch (error) {
      console.error("Call failed:", error);
      setCallResult("Error: Failed to complete calls");
    } finally {
      setIsCalling(false);
      // Don't close modal here - let the CallModal component handle it
      // User needs to manually end the call via the End Call button
    }
  };

  const handleDeclineCall = () => {
    setIsCallModalOpen(false);
  };

  const technicalCount = allFeedback.filter(
    (f) => f.type === "Technical"
  ).length;
  const feedbackCount = allFeedback.filter((f) => f.type === "Feedback").length;
  // currentCHI is now managed by state and updated from backend

  // Determine which recommendation to show based on product state (fallback)
  const getRecommendation = () => {
    // If CHI is very low or there are many technical issues, show Fix
    if (currentCHI < 40 || technicalCount > feedbackCount) {
      return {
        action: "Fix",
        header: "Critical Issues Detected",
        color: "red",
        points: [
          "Critical technical issues affecting user experience",
          "Multiple reports of connectivity and performance problems",
          "Immediate escalation needed to prevent churn",
        ],
      };
    }
    // If CHI is high, show Reward
    else if (currentCHI >= 70) {
      return {
        action: "Reward",
        header: "High Customer Satisfaction",
        color: "green",
        points: [
          "Loyal customers show high satisfaction with current features",
          "Opportunity to increase retention through targeted promotions",
          "Personalized offers can boost customer lifetime value",
        ],
      };
    }
    // Otherwise show Engage
    else {
      return {
        action: "Engage",
        header: "Gather Deeper Insights",
        color: "purple",
        points: [
          "Direct customer outreach can gather deeper insights",
          "Voice feedback provides richer context than text",
          "Build stronger relationships through personal contact",
        ],
      };
    }
  };

  // Use Gemini recommendation if available, otherwise fallback to logic
  const recommendation = geminiRecommendation || getRecommendation();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-pink-600 dark:text-pink-400 hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {productName}
        </h1>
      </div>

      {/* CHI Graph */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-pink-600" />
              Customer Happiness Index (CHI) Trend
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Quarterly performance breakdown (Q1 - Q4)
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              {currentCHI}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Current CHI (Q4)
            </div>
          </div>
        </div>

        {/* Graph */}
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end justify-between gap-2">
            {quarterlyData.length > 0
              ? quarterlyData.map((data, index) => {
                  const height = `${data.score}%`;
                  const isLast = index === quarterlyData.length - 1;
                  return (
                    <div
                      key={data.quarter}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t relative group">
                        <div
                          className={`w-full rounded-t transition-all ${
                            data.score >= 70
                              ? "bg-green-500"
                              : data.score >= 40
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          } ${isLast ? "ring-2 ring-pink-600" : ""}`}
                          style={{ height }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {data.score}%
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {data.quarter}
                      </div>
                    </div>
                  );
                })
              : // Loading skeleton
                [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t h-32 animate-pulse" />
                    <div className="text-xs font-medium text-gray-400">
                      Q{i}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* T-Agent Recommendation */}
      {isLoadingRecommendation ? (
        <div className="rounded-xl p-8 border-2 shadow-lg bg-gray-50 dark:bg-gray-900/10 border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Analyzing...
              </h2>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mt-1">
                Gemini AI is analyzing product data and customer feedback
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`rounded-xl p-8 border-2 shadow-lg ${
            recommendation.color === "green"
              ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
              : recommendation.color === "red"
              ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
              : "bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Sparkles
              className={`w-8 h-8 ${
                recommendation.color === "green"
                  ? "text-green-600 dark:text-green-400"
                  : recommendation.color === "red"
                  ? "text-red-600 dark:text-red-400"
                  : "text-purple-600 dark:text-purple-400"
              }`}
            />
            <div>
              <h2
                className={`text-3xl font-bold ${
                  recommendation.color === "green"
                    ? "text-green-600 dark:text-green-400"
                    : recommendation.color === "red"
                    ? "text-red-600 dark:text-red-400"
                    : "text-purple-600 dark:text-purple-400"
                }`}
              >
                {recommendation.action}
              </h2>
              <p
                className={`text-lg font-medium mt-1 ${
                  recommendation.color === "green"
                    ? "text-green-700 dark:text-green-300"
                    : recommendation.color === "red"
                    ? "text-red-700 dark:text-red-300"
                    : "text-purple-700 dark:text-purple-300"
                }`}
              >
                {recommendation.header}
              </p>
            </div>
          </div>

          <ul className="space-y-3">
            {recommendation.points.map((point, idx) => (
              <li
                key={idx}
                className="text-base text-gray-700 dark:text-gray-300 flex items-start gap-3"
              >
                <span
                  className={`inline-block w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    recommendation.color === "green"
                      ? "bg-green-600"
                      : recommendation.color === "red"
                      ? "bg-red-600"
                      : "bg-purple-600"
                  }`}
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 3 Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Button 1: Generate Loyalty Promotions */}
        <button
          onClick={handleGeneratePromotion}
          disabled={isGeneratingPromotion}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
        >
          <div className="flex flex-col items-center gap-2">
            {isGeneratingPromotion ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm">Generating...</span>
              </>
            ) : (
              <>
                <Gift className="w-8 h-8" />
                <span className="text-lg">Generate Loyalty Promotions</span>
                <span className="text-xs opacity-80">
                  Gemini AI-powered offers
                </span>
              </>
            )}
          </div>
        </button>

        {/* Button 2: Raise Tech Support Ticket */}
        <button
          onClick={handleEscalateTech}
          disabled={isEscalating}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
        >
          <div className="flex flex-col items-center gap-2">
            {isEscalating ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm">Creating Ticket...</span>
              </>
            ) : (
              <>
                <Wrench className="w-8 h-8" />
                <span className="text-lg">Raise Tech Support Ticket</span>
                <span className="text-xs opacity-80">
                  Gemini AI ticket generation
                </span>
              </>
            )}
          </div>
        </button>

        {/* Button 3: Send Feedback Calls */}
        <button
          onClick={handleMassCall}
          disabled={isCalling}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-4 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
        >
          <div className="flex flex-col items-center gap-2">
            {isCalling ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm">Calling...</span>
              </>
            ) : (
              <>
                <Phone className="w-8 h-8" />
                <span className="text-lg">Send Feedback Calls</span>
                <span className="text-xs opacity-80">
                  ElevenLabs automated calls
                </span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Results Section */}
      {(promotionResult || escalationResult || callResult) && (
        <div className="space-y-4">
          {promotionResult && (
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
              <h3 className="font-bold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5" />
                AI-Generated Loyalty Promotions:
              </h3>
              <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                {promotionResult}
              </pre>
            </div>
          )}

          {escalationResult && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
              <h3 className="font-bold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5" />
                AI-Generated Tech Support Ticket:
              </h3>
              <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                {escalationResult}
              </pre>
            </div>
          )}

          {callResult && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-6">
              <h3 className="font-bold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5" />
                Call Campaign Summary:
              </h3>
              <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                {callResult}
              </pre>
            </div>
          )}
        </div>
      )}

      <CallModal
        isOpen={isCallModalOpen}
        onClose={handleDeclineCall}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
        isMassCall={true}
        customerName={(() => {
          const firstFeedbackWithPhone = allFeedback.filter(
            (f) => f.type === "Feedback" && f.phone
          )[0];
          return firstFeedbackWithPhone?.location
            ? `Customer from ${firstFeedbackWithPhone.location.split(",")[0]}`
            : "T-Mobile Customer";
        })()}
        customerPhone={
          allFeedback.filter((f) => f.type === "Feedback" && f.phone)[0]
            ?.phone || "+1 (555) 123-4567"
        }
        customerId={
          allFeedback
            .filter((f) => f.type === "Feedback" && f.phone)[0]
            ?.id.toString() || "unknown"
        }
        product={productName}
      />

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={handleCloseEmailModal}
        emailType={emailModalType}
        subject={
          emailModalType === "tech"
            ? techEmail?.subject || ""
            : promotionEmail?.subject || ""
        }
        body={
          emailModalType === "tech"
            ? techEmail?.body || ""
            : promotionEmail?.body || ""
        }
        recipient={
          emailModalType === "tech"
            ? "chithra.sathish.akilan@gmail.com"
            : "customers@gmail.com"
        }
        onSend={handleSendEmail}
      />
    </div>
  );
}
