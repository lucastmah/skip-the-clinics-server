export class User {
  construc
  tor(options = {}) {
    Object.assign(this, options);
  }
}

export class UserQueue {
    constructor() {
      this.list = [];
    }
  
    // Add a user to the end of the queue
    enqueue(userId) {
      if (!this.queue.includes(userId)) {
        this.queue.push(userId);
      }
    enqueue(user) {
      this.list.push(user);
    }
  
    // Remove a user from the front of the queue
    dequeue() {
      return this.list.shift();
    }
  
    // Convert the queue of users to JSON
    toJSON() {
      return JSON.stringify("{ \"users\" : [" + this.list.map(user => ({
        name: user.name,
        id: user.healthNumber,
        username: user.username,
        password: user.password,
        dateOfBirth: user.dateOfBirth
      })) + "]}");
    }
  
    // Create a UserQueue from JSON
    static fromJSON(json) {
      const data = JSON.parse(json);
      const userQueue = new UserQueue();
      data.users.forEach(userData => {
        userQueue.enqueue(new User(
          userData.name,
          userData.id,
          userData.username,
          userData.password,
          userData.dateOfBirth
        ));
      });
      return userQueue;
    }
}