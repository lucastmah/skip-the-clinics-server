class User {
    constructor(name, id, username, password, dateOfBirth) {
      this._name = name;
      this._id = id;
      this._username = username;
      this._password = password;
      this._dateOfBirth = dateOfBirth;
    }

    // Encode the instance to JSON
  toJSON() {
    return JSON.stringify({
      name: this._name,
      id: this._id,
      username: this._username,
      password: this._password,
      dateOfBirth: this._dateOfBirth
    });
  }

  // Decode JSON to an instance of User
  static fromJSON(json) {
    const data = JSON.parse(json);
    return new User(data.name, data.id, data.username, data.password, data.dateOfBirth);
  }
}

class UserQueue {
    constructor() {
      this.queue = [];
    }
  
    // Add a user to the end of the queue
    enqueue(user) {
      this.queue.push(user);
    }
  
    // Remove a user from the front of the queue
    dequeue() {
      return this.queue.shift();
    }
  
    // Convert the queue of users to JSON
    toJSON() {
      return JSON.stringify(this.queue.map(user => ({
        name: user.getName(),
        id: user.getId(),
        username: user.getUsername(),
        password: user.getPassword(),
        dateOfBirth: user.getDateOfBirth()
      })));
    }
  
    // Create a UserQueue from JSON
    static fromJSON(json) {
      const data = JSON.parse(json);
      const userQueue = new UserQueue();
      data.forEach(userData => {
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