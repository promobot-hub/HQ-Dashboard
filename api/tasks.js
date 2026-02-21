import { getTasks, updateTaskStatus } from './taskManager';

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(getTasks());
  } else if (req.method === 'POST') {
    const { id, status } = req.body;
    if (updateTaskStatus(id, status)) {
      res.status(200).json({ message: 'Task updated' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
