import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches the count of captions for each category from the database.
 * Returns an object: { [category: string]: number }
 */
export async function fetchCategoryCounts(): Promise<Record<string, number>> {
  // Fetch all categories and aggregate counts in JS
  const { data, error } = await supabase
    .from('captions')
    .select('category');

  if (error) {
    console.error('Error fetching category counts:', error);
    return {};
  }

  const counts: Record<string, number> = {};
  for (const row of data || []) {
    if (row.category) {
      counts[row.category] = (counts[row.category] || 0) + 1;
    }
  }
  return counts;
}
