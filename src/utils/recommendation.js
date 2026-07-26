import { mattresses } from '../data/mattresses.js';

/**
 * Scores every mattress in the catalog against the customer's answers
 * and returns them sorted best-match first, each with a `score` (0-100)
 * and a list of human-readable `reasons` in Persian.
 *
 * This is a showroom heuristic, not a medical or clinical algorithm.
 */
export function recommendMattress(answers) {
  const { weight, position, backPain, neckPain, shoulderPain, budget } = answers;

  // Ideal firmness target based on weight + sleeping position (1 soft - 5 firm)
  let idealFirmness = 3;
  if (position === 'side') idealFirmness -= 1;
  if (position === 'stomach') idealFirmness += 1;
  if (weight === 'heavy') idealFirmness += 1;
  if (weight === 'light') idealFirmness -= 1;
  idealFirmness = Math.min(5, Math.max(1, idealFirmness));

  const results = mattresses.map((m) => {
    let score = 0;
    const reasons = [];

    // Firmness match (closer = better), weighted heavily
    const firmnessDelta = Math.abs(m.firmness - idealFirmness);
    score += (4 - firmnessDelta) * 15;
    if (firmnessDelta <= 1) reasons.push('سطح سفتی متناسب با وزن و حالت خواب شما');

    // Position fit
    if (m.bestFor.includes(position)) {
      score += 20;
      reasons.push('طراحی‌شده برای حمایت بهینه در حالت خواب شما');
    }

    // Pain-related boosts
    if (backPain && m.specs.support >= 90) {
      score += 15;
      reasons.push('حمایت بالا برای کاهش فشار روی کمر');
    }
    if (neckPain && m.specs.comfort >= 90) {
      score += 10;
      reasons.push('لایه راحتی نرم برای کاهش فشار روی گردن');
    }
    if (shoulderPain && m.specs.motionIsolation >= 88) {
      score += 10;
      reasons.push('توزیع فشار مناسب برای کاهش درد شانه');
    }

    // Budget fit: budget is 1 (economic) - 4 (luxury), compare to m.price
    const budgetDelta = Math.abs(m.price - Number(budget));
    score += (3 - budgetDelta) * 8;
    if (budgetDelta === 0) reasons.push('کاملاً منطبق با بودجه انتخابی شما');

    // Base quality average, small nudge
    const avgSpec =
      Object.values(m.specs).reduce((a, b) => a + b, 0) / Object.values(m.specs).length;
    score += avgSpec * 0.15;

    return { ...m, score: Math.round(Math.min(100, Math.max(0, score))), reasons: reasons.slice(0, 3) };
  });

  return results.sort((a, b) => b.score - a.score);
}
