import { useTasksStore } from '../hq-dashboard/stores/tasksStore';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const tasksStore = useTasksStore.getState();
    res.status(200).json({
      tasks: tasksStore.tasks,
      currentTaskId: tasksStore.currentTaskId,
    });
  } else if (req.method === 'POST') {
    const { currentTaskId } = req.body;
    const tasksStore = useTasksStore.getState();
    tasksStore.setCurrentTask(currentTaskId);
    res.status(200).json({ message: 'Current task updated' });
  } else {
    res.status(405).end();
  }
}
