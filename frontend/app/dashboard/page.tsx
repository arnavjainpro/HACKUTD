"use client";

import { useEffect, useState } from "react";
import { usePMDashboardStore } from "@/lib/pmStore";
import { supabase } from "@/lib/supabaseClient";
import { calculateProductHappiness } from "@/lib/feedbackUtils";
import { chiApi } from "@/lib/api";
import {
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Minus,
} from "lucide-react";
import Link from "next/link";

interface CHIProduct {
  product_id: number;
  product_name: string;
  happiness_percentage: number;
  avg_sentiment: number;
  total_transcripts: number;
}

interface QuarterlyData {
  quarter: string;
  score: number;
}

export default function PMDashboardPage() {
  const { theme } = usePMDashboardStore();
  const [chiData, setCHIData] = useState<Record<number, CHIProduct>>({});
  const [quarterlyData, setQuarterlyData] = useState<
    Record<number, QuarterlyData[]>
  >({});
  const [loadingProducts, setLoadingProducts] = useState<Set<number>>(
    new Set([1, 2, 3])
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Fetch CHI happiness data and quarterly data on component mount
  useEffect(() => {
    const fetchCHIData = async () => {
      try {
        console.log("📊 Fetching CHI happiness data from backend...");
        const data = await chiApi.getHappiness();

        if (data.success) {
          console.log("✅ CHI Data loaded:", data.products);
          setCHIData(data.products);
        }

        // Fetch quarterly data for each product (1, 2, 3) - remove from loading as each completes
        const quarterlyPromises = [1, 2, 3].map(async (productId) => {
          try {
            const quarterlyResponse = await chiApi.getQuarterlyData(productId);
            if (quarterlyResponse.success) {
              // Remove this product from loading set
              setLoadingProducts((prev) => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
              });
              return { productId, data: quarterlyResponse.quarterly_data };
            }
          } catch (err) {
            console.error(
              `Error fetching quarterly data for product ${productId}:`,
              err
            );
            // Remove from loading even on error
            setLoadingProducts((prev) => {
              const newSet = new Set(prev);
              newSet.delete(productId);
              return newSet;
            });
          }
          return null;
        });

        const quarterlyResults = await Promise.all(quarterlyPromises);
        const quarterlyMap: Record<number, QuarterlyData[]> = {};
        quarterlyResults.forEach((result) => {
          if (result) {
            quarterlyMap[result.productId] = result.data;
          }
        });

        console.log("📊 Quarterly data loaded:", quarterlyMap);
        setQuarterlyData(quarterlyMap);
      } catch (error) {
        console.error("❌ Error fetching CHI data:", error);
        // Clear all loading states on error
        setLoadingProducts(new Set());
      }
    };

    fetchCHIData();
  }, []);

  // Quick Supabase connection test (optional)
  useEffect(() => {
    const testSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from("feedback")
          .select("*")
          .limit(1);
        if (error) {
          console.error("Supabase connection failed:", error);
        } else {
          console.log("Supabase connected ✅", data);
        }
      } catch (e) {
        console.error("Supabase test error", e);
      }
    };

    testSupabase();
  }, []);

  const products = calculateProductHappiness();

  // Merge CHI data with product data and quarterly data
  const productsWithCHI = products.map((product) => {
    const chiProduct = chiData[product.productId];
    const quarterly = quarterlyData[product.productId];

    // Get Q4 score and Q3 score for change calculation
    let currentScore = product.happinessScore;
    let previousScore = product.happinessScore;
    let quarterlyChange = product.quarterlyChange;

    if (quarterly && quarterly.length >= 4) {
      // Use Q4 (last quarter) as current score
      currentScore = quarterly[3].score;
      // Use Q3 (third quarter) as previous score
      previousScore = quarterly[2].score;
      // Calculate quarterly change
      quarterlyChange = currentScore - previousScore;
    }

    return {
      ...product,
      // Override happiness score with quarterly Q4 data if available
      happinessScore: currentScore,
      quarterlyChange: quarterlyChange,
      chiLoaded: !!chiProduct || !!quarterly,
    };
  });

  // Handle product click - fetch CHI data from backend
  const handleProductClick = async (productId: number, productName: string) => {
    if (productId > 0 && productId <= 3) {
      console.log(
        `🔍 Fetching CHI data for Product ID: ${productId} (${productName})`
      );

      try {
        const data = await chiApi.getProductData(productId);
        console.log("📊 CHI Response:", data);
      } catch (error) {
        console.error("❌ Error fetching CHI data:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Product Happiness Index */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Customer Happiness Index (CHI)
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Real-time product satisfaction scores based on customer feedback
            </p>
          </div>
          <TrendingDown className="w-8 h-8 text-pink-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productsWithCHI.map((product) => {
            const isUpcoming = product.productId === 0 || product.productId > 3;
            const isLoadingCHI = loadingProducts.has(product.productId);
            return (
              <Link
                key={product.product}
                href={
                  isUpcoming
                    ? "#"
                    : `/dashboard/product/${encodeURIComponent(
                        product.product
                      )}`
                }
                className="block"
                onClick={(e) => {
                  if (isUpcoming) {
                    e.preventDefault();
                    return;
                  }
                  // Fetch CHI data on click (but still navigate)
                  handleProductClick(product.productId, product.product);
                }}
              >
                <div
                  className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border-2 border-transparent transition-all ${
                    isUpcoming
                      ? "opacity-40 cursor-default"
                      : "hover:border-pink-500 cursor-pointer"
                  } group relative`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400">
                        {product.product}
                      </h3>
                      {isUpcoming && (
                        <span className="text-xs bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                          Upcoming
                        </span>
                      )}
                      {product.chiLoaded && !isUpcoming && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                          CHI
                        </span>
                      )}
                    </div>
                    {product.happinessScore >= 70 ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : product.happinessScore >= 40 ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                  </div>

                  {/* Happiness Score */}
                  <div className="mb-4">
                    <div className="flex items-end gap-2 mb-2">
                      {isLoadingCHI ? (
                        <>
                          <div className="w-10 h-10 border-3 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Calculating...
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-4xl font-bold text-gray-900 dark:text-white">
                            {product.happinessScore}%
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            happiness
                          </span>
                        </>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isLoadingCHI
                            ? "bg-gray-400 animate-pulse"
                            : product.happinessScore >= 70
                            ? "bg-green-500"
                            : product.happinessScore >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: isLoadingCHI
                            ? "30%"
                            : `${product.happinessScore}%`,
                        }}
                      />
                    </div>

                    {/* Quarterly Change Indicator */}
                    {!isLoadingCHI && (
                      <div className="flex items-center gap-1 text-xs">
                        {product.quarterlyChange > 0 ? (
                          <>
                            <TrendingUp className="w-3 h-3 text-green-600" />
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              Improved by {product.quarterlyChange}% since last
                              quarter
                            </span>
                          </>
                        ) : product.quarterlyChange < 0 ? (
                          <>
                            <TrendingDown className="w-3 h-3 text-red-600" />
                            <span className="text-red-600 dark:text-red-400 font-medium">
                              Declined by {Math.abs(product.quarterlyChange)}%
                              since last quarter
                            </span>
                          </>
                        ) : (
                          <>
                            <Minus className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-500 dark:text-gray-400 font-medium">
                              No change since last quarter
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 text-center text-sm text-pink-600 dark:text-pink-400 font-medium group-hover:underline">
                    {isUpcoming
                      ? "Coming Soon"
                      : "View Details & Take Action →"}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
