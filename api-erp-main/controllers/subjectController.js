const Subject = require('../models/Subject')

async function addSubject(req, res) {
    try {
        let subject = new Subject(req.body)

        await subject.save()
        console.log("data saved sucessfully....");

        res.status(200).send({ success: true, message: 'data saved successfully' })

    } catch (error) {
        res.status(500).send({ success: false, message: 'something went wrong' })
        console.log(error);
    }

}
async function getSubjects(req, res) {
    try {
        let subjects = await Subject.find({
            subjectFullName: { $regex: new RegExp(req.query.subjectFullName, "i") }
        });
        res.status(200).send({ success: true, data: subjects })
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'Something went wrong..!' });
    }
}


async function getSubject(req, res) {
    try {
        let subjectId = req.params.id;
        let subject = await Subject.findOne({ _id: subjectId })
        console.log("Sahil "+subject);
        
        res.status(200).send({ success: true, data: subject })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Something went wrong...' });
    }
}

async function editSubject(req, res) {
    try {
        let subjectId = req.params.id;
        let subject = await Subject.findOne({ _id: subjectId })
        Object.assign(subject, req.body)
        await subject.save();
        res.status(200).send({ success: true, message: 'Subject has been updated' })

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: 'Something went wrong in updating Subject.' })
    }
}

module.exports = {
    addSubject,
    getSubjects,
    getSubject,
    editSubject
}