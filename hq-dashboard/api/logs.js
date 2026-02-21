const logs = [
  { id: 1, timestamp: "2026-02-20 12:00 UTC", message: "GitHub Skill started" },
  {
    id: 2,
    timestamp: "2026-02-20 12:10 UTC",
    message: "Twitter Agent: Tweet posted",
  },
  {
    id: 3,
    timestamp: "2026-02-20 12:20 UTC",
    message: "Browserless Playwright connected",
  },
];

const errors = [
  {
    id: 1,
    timestamp: "2026-02-20 11:50 UTC",
    message: "Login timeout on Twitter Agent",
  },
  {
    id: 2,
    timestamp: "2026-02-20 12:15 UTC",
    message: "HTTP 401 Unauthorized on Browserless",
  },
];

export default function handler(req, res) {
  if (req.query.type === "errors") {
    res.status(200).json(errors);
  } else {
    res.status(200).json(logs);
  }
}
