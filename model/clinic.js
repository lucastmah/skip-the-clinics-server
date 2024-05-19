const fs = require('fs');
const { UserQueue } = require('./user');

class Clinic {
    constructor(name, locationId, xCoord, yCoord) {
        this._name = name;
        this._locationId = locationId;
        this._xCoord = xCoord;
        this._yCoord = yCoord;
        this._userQueue = new UserQueue();
    }

    showList() {
        this._userQueue.show();
    }

    enqueueUser(userId) {
        this._userQueue.enqueue(userId);
        return this._userQueue.size();
        //console.log(this._userQueue);
    }

    dequeueUser() {
        return this._userQueue.dequeue();
    }

    removeUser(userId) {
        this._userQueue.remove(userId);
    }

    static fromJSON(filePath) {
        try {
            const jsonData = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(jsonData).map(clinicData => {
                return new Clinic(
                    clinicData._name,
                    clinicData._locationId,
                    clinicData._xCoord,
                    clinicData._yCoord
                );
            });
        } catch (err) {
            console.error('Error reading or parsing file:', err);
            return [];
        }
    }

    static getClinicByID(clinics, id) {
        for (const clinic of clinics) {
            if (clinic._locationId == id) {
                return clinic;
            }
        }
        return null;
    }

    static updateUserQueue(healthNumber, clinicIds) {
        var output = [];
        try {
            var data = fs.readFileSync('./users/users.json', 'utf8');
            var json = JSON.parse(data);
            json.users.forEach(user => {
                if (user.healthNumber == healthNumber) {
                    output = JSON.parse(JSON.stringify(user.queued));
                    user.queued = clinicIds;
                }
            });
            try {
                fs.writeFileSync('./users/users.json', JSON.stringify(json));
                return output;
            }
            catch(err) {
                console.log("write " + err);
            }
        }
        catch(err) {
            console.log("read " + err);
        }
      }
}

module.exports = Clinic;