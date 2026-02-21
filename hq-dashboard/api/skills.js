const skillsStatus = [
  { name: "Twitter Agent", active: true },
  { name: "GitHub Skill", active: true },
  { name: "Email Handler", active: false },
  { name: "Browserless Integration", active: true },
];

export default function handler(req, res) {
  res.status(200).json(skillsStatus);
}
