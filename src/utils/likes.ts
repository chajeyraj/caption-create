import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

let likesFeatureUnavailable = false;
let likesWarningIssued = false;

const LIKES_TABLE_NAME = "likes";
const LIKES_ERROR_CODES = new Set(["PGRST205", "42P01", "42703"]);

function isLikesFeatureError(error: PostgrestError | null) {
  if (!error) return false;

  const code = error.code ?? "";
  if (LIKES_ERROR_CODES.has(code)) {
    return true;
  }

  const message = error.message?.toLowerCase() ?? "";
  return (
    message.includes(`table '${LIKES_TABLE_NAME}'`) ||
    message.includes(`relation "${LIKES_TABLE_NAME}"`) ||
    message.includes('column "likes"') ||
    message.includes("column likes")
  );
}

export function markLikesFeatureUnavailable(error: PostgrestError | null) {
  if (!error || likesFeatureUnavailable) {
    return false;
  }

  const unavailable = isLikesFeatureError(error);
  if (unavailable) {
    likesFeatureUnavailable = true;
    if (!likesWarningIssued) {
      console.warn(
        "[Likes] Supabase schema is missing likes support. Like features will be disabled until the table/column exists.",
        error,
      );
      likesWarningIssued = true;
    }
  }
  return unavailable;
}

export function areLikesSupported() {
  return !likesFeatureUnavailable;
}

/**
 * Fetches caption ids liked by the given user from Supabase.
 * Returns an empty array if the user is not logged in, captions list is empty,
 * or the likes feature is unavailable.
 */
export async function fetchUserLikedCaptionIds(userId: string | undefined, captionIds: string[]) {
  if (!userId || captionIds.length === 0 || likesFeatureUnavailable) {
    return [];
  }

  const { data, error } = await supabase
    .from(LIKES_TABLE_NAME)
    .select("caption_id")
    .eq("user_id", userId)
    .in("caption_id", captionIds);

  if (error) {
    const handled = markLikesFeatureUnavailable(error);
    if (!handled) {
      console.error("Error fetching user liked captions:", error);
    }
    return [];
  }

  return data?.map((like) => like.caption_id) ?? [];
}

export async function fetchCaptionLikeCounts(captionIds: string[]) {
  if (!captionIds || captionIds.length === 0 || likesFeatureUnavailable) {
    return {};
  }

  try {
    const CHUNK_SIZE = 100;
    const chunks: string[][] = [];

    for (let i = 0; i < captionIds.length; i += CHUNK_SIZE) {
      chunks.push(captionIds.slice(i, i + CHUNK_SIZE));
    }

    const allResults: { caption_id: string }[] = [];

    await Promise.all(chunks.map(async (chunk) => {
      const { data, error } = await supabase
        .from(LIKES_TABLE_NAME)
        .select("caption_id")
        .in("caption_id", chunk);

      if (error) {
        const handled = markLikesFeatureUnavailable(error);
        if (!handled) {
          console.error("[Likes] Error fetching like counts:", error);
        }
        return;
      }

      if (data && data.length > 0) {
        allResults.push(...data);
      }
    }));

    const counts: Record<string, number> = {};
    for (const row of allResults) {
      if (row?.caption_id) {
        counts[row.caption_id] = (counts[row.caption_id] || 0) + 1;
      }
    }

    return counts;
  } catch (error) {
    console.error("[Likes] Unexpected error in fetchCaptionLikeCounts:", error);
    return {};
  }
}
