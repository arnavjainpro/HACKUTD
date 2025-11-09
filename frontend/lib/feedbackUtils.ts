import feedbackData from './feedback.json';

export interface FeedbackItem {
  id: number;
  product: string;
  type: 'Technical' | 'Feedback';
  transcript: string;
  phone?: string;
  location?: string;
  timestamp: string;
}

export interface ProductHappiness {
  product: string;
  productId: number; // Maps to CHI CSV product_id
  happinessScore: number;
  totalFeedback: number;
  technicalIssues: number;
  feedbackItems: number;
  positiveCount: number;
  dailyChange: number; // Positive = improving, Negative = worsening
}

// Simple sentiment analysis based on keywords
function analyzeSentiment(transcript: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['love', 'amazing', 'excellent', 'great', 'best', 'saved'];
  const negativeWords = ['impossible', 'frustrated', 'confused', 'slow', 'drop', 'cut', 'throttle', 'spotty'];
  
  const lowerTranscript = transcript.toLowerCase();
  
  const positiveScore = positiveWords.filter(word => lowerTranscript.includes(word)).length;
  const negativeScore = negativeWords.filter(word => lowerTranscript.includes(word)).length;
  
  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
}

// Calculate happiness index for each product
export function calculateProductHappiness(): ProductHappiness[] {
  const productMap = new Map<string, FeedbackItem[]>();
  
  // Group feedback by product
  (feedbackData as unknown as FeedbackItem[]).forEach((item) => {
    if (!productMap.has(item.product)) {
      productMap.set(item.product, []);
    }
    productMap.get(item.product)!.push(item);
  });
  // Simulated "yesterday's" scores for trend calculation
  // In production, this would come from historical data
  const yesterdayScores: { [key: string]: number } = {
    '5G Home Internet': 35,
    'Magenta Max': 85,
    'T-Mobile One': 30,
    'Business Unlimited': 100,
    'Prepaid Plans': 45,
    'Mobile Hotspot': 70,
  };

  // Map product names to CHI CSV product_id
  const productIdMap: { [key: string]: number } = {
    'Mobile Hotspot': 1,
    'Magenta Max': 2,
    'Business Unlimited': 3,
    // Filler products (not in CHI CSV)
    '5G Home Internet': 4,
    'T-Mobile One': 5,
    'Prepaid Plans': 6,
  };
  
  // Calculate happiness score for each product
  const results: ProductHappiness[] = [];
  
  productMap.forEach((items, product) => {
    const total = items.length;
    const technical = items.filter(i => i.type === 'Technical').length;
    const feedback = items.filter(i => i.type === 'Feedback').length;
    
    // Count positive feedback
    const positive = items.filter(i => 
      i.type === 'Feedback' && analyzeSentiment(i.transcript) === 'positive'
    ).length;
    
    // Happiness score: (positive feedback) / (total items) * 100
    // Penalize for technical issues
    const happinessScore = Math.round(
      ((positive - (technical * 0.5)) / total) * 100
    );
    
    const finalScore = Math.max(0, Math.min(100, happinessScore));
    
    // Calculate daily change
    const yesterdayScore = yesterdayScores[product] || finalScore;
    const dailyChange = finalScore - yesterdayScore;
    
    results.push({
      product,
      productId: productIdMap[product] || 0, // Default to 0 for unmapped products
      happinessScore: finalScore,
      totalFeedback: total,
      technicalIssues: technical,
      feedbackItems: feedback,
      positiveCount: positive,
      dailyChange,
    });
  });
  
  // Sort by happiness score (lowest first - problems first!)
  return results.sort((a, b) => a.happinessScore - b.happinessScore);
}

// Get all feedback
export function getAllFeedback(): FeedbackItem[] {
  return feedbackData as unknown as FeedbackItem[];
}

// Get feedback for specific product
export function getFeedbackByProduct(productName: string): FeedbackItem[] {
  return (feedbackData as unknown as FeedbackItem[]).filter((item) => item.product === productName);
}

// Get technical issues for a product
export function getTechnicalIssues(productName: string): FeedbackItem[] {
  return (feedbackData as unknown as FeedbackItem[]).filter(
    (item) => item.product === productName && item.type === 'Technical'
  );
}

// Get feedback items for a product
export function getFeedbackOnly(productName: string): FeedbackItem[] {
  return (feedbackData as unknown as FeedbackItem[]).filter(
    (item) => item.product === productName && item.type === 'Feedback'
  );
}
