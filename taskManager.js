class TaskManager {
  constructor() {
    this.tasks = [];
  }

  addTask(description) {
    const task = {
      id: this.tasks.length + 1,
      description,
      completed: false,
      createdAt: new Date()
    };
    this.tasks.push(task);
    return task;
  }

  getNextTask() {
    return this.tasks.find(task => !task.completed);
  }

  completeTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = true;
      task.completedAt = new Date();
    }
  }

  hasPendingTasks() {
    return this.tasks.some(task => !task.completed);
  }

  generateTasks() {
    // Example: generate some growth-related tasks
    if (!this.hasPendingTasks()) {
      this.addTask('Optimiere SEO für HQ Dashboard');
      this.addTask('Starte Twitter-Promotion-Kampagne');
      this.addTask('Verbessere Mail-Skill mit KI-gestützter Klassifikation');
    }
  }

  summarizeTasks() {
    const pending = this.tasks.filter(t => !t.completed);
    const completed = this.tasks.filter(t => t.completed);
    return { pending, completed };
  }
}

module.exports = TaskManager;
