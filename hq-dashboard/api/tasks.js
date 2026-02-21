const tasks = [
  { id: 1, text: "Completing Twitter login automation", done: false },
  { id: 2, text: "Deploy HQ-Dashboard on Vercel", done: false },
  { id: 3, text: "Integrate GitHub Skill with token auth", done: true },
];

export default function handler(req, res) {
  res.status(200).json(tasks);
}
