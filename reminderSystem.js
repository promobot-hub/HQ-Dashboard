class ReminderSystem {
  constructor() {
    this.promises = [];
  }

  addPromise(taskDescription) {
    const promise = {
      id: this.promises.length + 1,
      taskDescription,
      fulfilled: false,
      createdAt: new Date()
    };
    this.promises.push(promise);
    return promise;
  }

  fulfillPromise(id) {
    const promise = this.promises.find(p => p.id === id);
    if (promise) {
      promise.fulfilled = true;
      promise.fulfilledAt = new Date();
    }
  }

  getUnfulfilledPromises() {
    return this.promises.filter(p => !p.fulfilled);
  }

  remind() {
    const unfulfilled = this.getUnfulfilledPromises();
    if (unfulfilled.length > 0) {
      return `Erinnerung: Die folgenden Aufgaben sind noch offen:\n${unfulfilled.map(p => `- ${p.taskDescription}`).join('\n')}`;
    }
    return null;
  }
}

module.exports = ReminderSystem;
