// ─── Open Trivia Database API ─────────────────────────────────────────────────
// Free, no API key needed — https://opentdb.com
// Used as the primary question source for the quiz.

export const CATEGORIES = [
  { id: 0,  name: '🎲 Any Category' },
  { id: 9,  name: '🌍 General Knowledge' },
  { id: 10, name: '📚 Books' },
  { id: 11, name: '🎬 Film' },
  { id: 12, name: '🎵 Music' },
  { id: 14, name: '📺 Television' },
  { id: 15, name: '🎮 Video Games' },
  { id: 17, name: '🔬 Science & Nature' },
  { id: 18, name: '💻 Computers' },
  { id: 19, name: '➗ Mathematics' },
  { id: 20, name: '🏛️ Mythology' },
  { id: 21, name: '⚽ Sports' },
  { id: 22, name: '🗺️ Geography' },
  { id: 23, name: '📜 History' },
  { id: 24, name: '🏛️ Politics' },
  { id: 25, name: '🎨 Art' },
  { id: 26, name: '⭐ Celebrities' },
  { id: 27, name: '🐾 Animals' },
  { id: 28, name: '🚗 Vehicles' },
  { id: 30, name: '🔭 Science: Gadgets' },
]

// Decode HTML entities from Open Trivia DB responses
function decode(str) {
  const txt = document.createElement('textarea')
  txt.innerHTML = str
  return txt.value
}

// Shuffle array (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Fetch questions from Open Trivia DB
 * @param {number} amount    - number of questions (1-50)
 * @param {string} difficulty - 'easy' | 'medium' | 'hard'
 * @param {number} categoryId - category id from CATEGORIES (0 = any)
 * @returns {Array} array of question objects matching our app's format
 */
export async function fetchTriviaQuestions(amount = 10, difficulty = 'medium', categoryId = 0) {
  let url = `https://opentdb.com/api.php?amount=${amount}&type=multiple&difficulty=${difficulty}`
  if (categoryId !== 0) url += `&category=${categoryId}`

  const res = await fetch(url)
  if (!res.ok) throw new Error('OpenTDB fetch failed: ' + res.status)

  const data = await res.json()

  // Response codes: 0=success, 1=no results, 2=invalid param, 5=rate limit
  if (data.response_code === 1) throw new Error('Not enough questions for this category/difficulty. Try changing settings.')
  if (data.response_code === 5) throw new Error('Too many requests. Please wait a moment and try again.')
  if (data.response_code !== 0) throw new Error('OpenTDB error code: ' + data.response_code)

  // Transform OpenTDB format → our app format
  return data.results.map(item => {
    const correct   = decode(item.correct_answer)
    const incorrect = item.incorrect_answers.map(decode)
    const allOpts   = shuffle([correct, ...incorrect])
    const ansIdx    = allOpts.indexOf(correct)

    return {
      q:    decode(item.question),
      opts: allOpts,
      ans:  ansIdx,
      diff: item.difficulty,
      exp:  `The correct answer is "${correct}". Category: ${decode(item.category)}.`,
      category: decode(item.category),
    }
  })
}