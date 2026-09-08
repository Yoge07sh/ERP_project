const Mapping=require('../models/SubjectMap')
const Subject =require('../models/Subject')
const Course =require('../models/Course')
const Branch =require('../models/Branch')


async function getSubjectsForMapping(req, res) {
  try {
    let subjects = await Subject.find(
      { subjectFullName: { $regex: new RegExp(req.query.subjectFullName, "i") } },
      {
        _id: 1,
        subjectFullName: 1,
      }
    );
    let sendSubjects=[]
    for(let i=0;i<subjects.length;i++){
        sendSubjects.push({
            value:subjects[i]._id,
            label:subjects[i].subjectFullName,
        })
    }
    res.status(200).send({success:true,data:sendSubjects})
} catch (error) {
      res.status(500).send({success:false,message:'something went wrong'})
    console.log(error);
    
  }
}
async function getCoursesForMapping(req, res) {
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

async function getBranchsForMapping(req, res) {
  try {
    let branchs = await Branch.find(
      { branchFullName: { $regex: new RegExp(req.query.branchFullName, "i") } },
      {
        _id: 1,
        branchFullName: 1,
      }
    );
    let sendBranchs=[]
    for(let i=0;i<branchs.length;i++){
        sendBranchs.push({
            value:branchs[i]._id,
            label:branchs[i].branchFullName,
        })
    }
    res.status(200).send({success:true,data:sendBranchs})
} catch (error) {
      res.status(500).send({success:false,message:'something went wrong'})
    console.log(error);
    
  }
}

async function addSubjectMapping(req,res){
try {
     let subjectmap=new Mapping(req.body)
       
        await subjectmap.save()
        console.log("data saved sucessfully....");
        
        res.status(200).send({success:true,message:'data saved successfully'})
        
    } catch (error) {
        res.status(500).send({success:false,message:'something went wrong'})
        console.log(error);        
    }

}
async function getSubjectsMapped(req, res) {
    try {
        let subjectsmap = await Mapping.find({
            course: { $regex: new RegExp(req.query.course, "i") }
        });
        res.status(200).send({ success: true, data: subjectsmap })
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'Something went wrong..!' });
    }
}


module.exports={
    getSubjectsForMapping,
    getCoursesForMapping,
    getBranchsForMapping,
    addSubjectMapping,
    getSubjectsMapped
}