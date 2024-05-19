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

    enqueueUser(userId) {
        this._userQueue.enqueue(userId);
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
}

module.exports = Clinic;