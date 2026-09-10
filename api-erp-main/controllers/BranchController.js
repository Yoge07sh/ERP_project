const Branch = require('../models/Branch')
const Course =require('../models/Course')



async function getCoursesForBranch(req, res) {
  try {
    let courses = await Course.find(
      { courseFullName: { $regex: new RegExp(req.query.courseFullName, "i") } },
      {
        _id: 1,
        courseFullName: 1,
      }
    );
    let sendCourses=[]
    for(let i=0;i<courses.length;i++){
        sendCourses.push({
            value:courses[i]._id,
            label:courses[i].courseFullName,
        })
    }
    res.status(200).send({success:true,data:sendCourses})
} catch (error) {
      res.status(500).send({success:false,message:'something went wrong'})
    console.log(error);
    
  }
}

async function addBranch(req, res) {
    try {
        let branch = new Branch(req.body);
        await branch.save();
        res.status(200).send({ success: true, message: 'Data Saved Successfully' })
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Branch code already exists' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message });
        }

        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

async function getBranches(req, res) {
    try {
        let skip = (req.query.pageNo - 1) * req.query.limit;
        let limit = req.query.limit;
        let branches = await Branch.find({
            branchFullName: { $regex: new RegExp(req.query.branchFullName, 'i') }
    }).skip(skip).limit(limit);
        let totalBranches = await Branch.countDocuments({});

        res.status(200).send({ success: true, data: branches, totalCount: totalBranches })
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'Something went wrong..!' });
    }
}

async function deleteBranch(req, res) {
    try {
        let branchId = req.params.id;
        const result = await Branch.deleteOne({ _id: branchId })

        if (result) {
            res.status(200).send({ success: true, message: 'Branch Deleted Successfull...' });
        } else {
            res.status(500).send({ success: false, message: 'Can not Delete Branch' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'Can not Delete, Something went wrong..!' });
    }
}

async function getBranch(req, res) {
    try {

        let branchId = req.params.id;
        let branch = await Branch.findOne({ _id: branchId });
        res.status(200).send({ success: true, data: branch })

    } catch (error) {
        res.status(500).send({ success: false, message: 'Something went wrong...' });
    }
}


async function editBranch(req, res) {
    try {

        let branchId = req.params.id;
        let branch = await Branch.findOne({ _id: branchId })
        Object.assign(branch, req.body)
        await branch.save();
        res.status(200).send({ success: true, message: 'Branch has been updated' })

    } catch (error) {
        res.status(500).send({ success: false, message: 'Something went wrong in updating Branch.' })
    }
}
module.exports = {
    getCoursesForBranch,
    addBranch,
    getBranches,
    getBranch,
    deleteBranch,
    editBranch
}