/**
 * Insert a row into public.game_results. Call only when the user is signed in.
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 * @param {string} userId
 * @param {'wordle'|'snake'|'game_2048'} gameSlug
 * @param {number|null|undefined} score Optional numeric (e.g. Wordle = number of guesses used).
 * @param {Record<string, unknown>} details
 */
export async function submitGameResult(client, userId, gameSlug, score, details) {
  const payload = {
    user_id: userId,
    game_slug: gameSlug,
    details,
  };
  if (score != null && Number.isFinite(score)) {
    payload.score = Math.round(score);
  }

  const { data, error } = await client.from('game_results').insert(payload).select('id').single();

  if (error) {
    return { error };
  }
  return { data };
}
