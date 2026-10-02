const Faculty = require("../models/Faculty");
const Leave = require("../models/Leave");

async function getFaculty(req, res) {
    try {
        let id = req.params.id;
        
        let faculty = await Faculty.findOne({
            $or: [ { _id: id }, { userId: id } ]
        });

        if (!faculty) {
            return res.status(404).send({ success: false, message: 'Faculty not found' });
        }

        res.status(200).send({ success: true, data: faculty });
    } catch(err) {
        res.status(400).send({ success: false, message: 'Something went wrong...' });
    }
}

async function addLeave(req, res) {
    try {
        const leave = new Leave(req.body);
        await leave.save();
        res.status(200).send({ message: "Leave successfully added..." });
    } catch(err) {
        res.status(400).send({ message: "leave cannot be added"});
    }
}
async function getFacultyLeaves(req, res) {
    try {
        const facultyId = req.params.facultyId;
        const leaves = await Leave.find({ facultyId: facultyId }).sort({ createdAt: -1 });
        res.status(200).send({ success: true, data: leaves });
    } catch (err) {
        res.status(400).send({message: "Could not fetch leaves" });
    }
}
module.exports = { 
    getFaculty, 
    addLeave,
    getFacultyLeaves
};