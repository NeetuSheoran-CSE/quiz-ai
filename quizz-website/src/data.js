export const FALLBACK_QUESTIONS = [
  {
    q: 'What is the primary function of mitochondria?',
    opts: ['Energy production (ATP)', 'Protein synthesis', 'DNA replication', 'Cell division'],
    ans: 0, diff: 'medium',
    exp: "Mitochondria produce ATP via cellular respiration — hence 'powerhouse of the cell'.",
  },
  {
    q: 'Which law states energy cannot be created or destroyed?',
    opts: ["Newton's First Law", 'Law of Conservation of Energy', "Faraday's Law", "Boyle's Law"],
    ans: 1, diff: 'easy',
    exp: 'The First Law of Thermodynamics — total energy in a closed system is constant.',
  },
  {
    q: 'Time complexity of binary search?',
    opts: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
    ans: 2, diff: 'hard',
    exp: 'Binary search halves the search space each step → O(log n).',
  },
  {
    q: 'In which year was the World Wide Web invented?',
    opts: ['1983', '1989', '1995', '2001'],
    ans: 1, diff: 'easy',
    exp: 'Tim Berners-Lee invented the WWW in 1989 at CERN.',
  },
  {
    q: 'What does DNA stand for?',
    opts: ['Deoxyribonucleic Acid', 'Dinitrogen Amino Acid', 'Dynamic Neural Architecture', 'Digital Nucleotide Array'],
    ans: 0, diff: 'easy',
    exp: 'DNA = Deoxyribonucleic Acid — the genetic blueprint of life.',
  },
  {
    q: 'Which planet is called the Red Planet?',
    opts: ['Venus', 'Jupiter', 'Saturn', 'Mars'],
    ans: 3, diff: 'easy',
    exp: 'Mars looks red due to iron oxide (rust) on its surface.',
  },
  {
    q: 'Speed of light in vacuum?',
    opts: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'],
    ans: 1, diff: 'hard',
    exp: 'Light travels at ≈299,792,458 m/s, roughly 3×10⁸ m/s.',
  },
]

export const TOPICS = [
  'All Topics', 'Definitions', 'Key Concepts',
  'Cause & Effect', 'Comparisons', 'Examples',
  'Formulas', 'Dates & Facts', 'Applications',
]

export const LETTERS = ['A', 'B', 'C', 'D']

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}






