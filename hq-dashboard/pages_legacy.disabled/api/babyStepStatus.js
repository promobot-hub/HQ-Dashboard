import { getCurrentBabyStep } from "../../../babySteps.js";

export default function handler(req, res) {
  res.status(200).json({ currentBabyStep: getCurrentBabyStep() });
}
