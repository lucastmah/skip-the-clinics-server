const jwt = require('jsonwebtoken');

export function login(username, password) {
    // read from users.json file
    fs.readFile('./users/users.json', 'utf8', (err, data) => {
        if (err) {
          console.log(err);
        }
        else {
            var output = JSON.parse(data);
            console.log(output);
            output.users.forEach(user => {
                if (user.username == username) {
                    if (user.password == user.password) {
                        return jwt.sign({ userId: user._id }, 'your-secret-key', {
 expiresIn: '1h',
 });
                    }
                }
            });
            return null;
        }
    });
}