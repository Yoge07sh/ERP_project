const Faculty = require("../models/Faculty");
const cloudinary = require("cloudinary").v2;
const csv=require('csvtojson');
const User = require("../models/User");
const bcrypt =require('bcrypt')

async function addFaculty(req, res) {
  try {
    let upload;
    console.log(req.body);
    console.log(req.file);
    if (req.file) {
      cloudinary.config({
        cloud_name:'ddkkn8epl',
        api_key:'759348446893726',
        api_secret:'6nL-k2epUb9uwZggWYXF6By6YkI'
      });
      upload = await cloudinary.uploader.upload(req.file.path);
    }
    let faculty = new Faculty(req.body);
    if (req.file && upload) {
      faculty.facultyImage = upload.secure_url;
    }
    await faculty.save();
    let encryptedPassword = bcrypt.hashSync('123456', 10);
    let user= new User(
      {
        firstName: faculty.firstName,
        lastName: faculty.lastName,
        email: faculty.collegeEmail,
        password:encryptedPassword,
        mobNo: faculty.mobileNo,
        userRole:'faculty',
        userImage: faculty.facultyImage || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png',
      }
    )
    await user.save()
    console.log("data saved sucessfully....");

    res.status(200).send({ success: true, message: "data saved successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: "something went wrong" });
    console.log(error);
  }
}
async function addFaculties(req, res) {
  try {
    if (!req.file) {
      return res.status(400).send({ success: false, message: 'No CSV file uploaded' });
    }

    console.log(req.file);
    console.log(req.file.path);

    // ✅ Parse CSV into JSON array
    const jsonArray = await csv().fromFile(req.file.path);

    // ✅ Process and clean up data
    const FacultyList = jsonArray.map((item) => {
      // Fix DOB format (DD-MM-YYYY → Date)
      let formattedDob = null;
      if (item.dob) {
        const [day, month, year] = item.dob.split('-');
        formattedDob = new Date(`${year}-${month}-${day}`);
      }

      return {
        collegeId: item.collegeId,
        thumbId: item.thumbId,
        firstName: item.firstName,
        lastName: item.lastName,
        collegeEmail: item.collegeEmail,
        personalEmail: item.personalEmail,
        mobileNo: item.mobileNo,
        emergencyMobileNo: item.emergencyMobileNo,
        fatherName: item.fatherName,
        motherName: item.motherName,
        gender: item.gender,
        dob: formattedDob,
        highestQualification: item.highestQualification,
        designation: item.designation,
        marriedStatus: item.marriedStatus,
        totalExperience: parseFloat(item.totalExperience) || 0,
        teachingExperience: parseFloat(item.teachingExperience) || 0,
        industryExperience: parseFloat(item.industryExperience) || 0,
        researchExperience: parseFloat(item.researchExperience) || 0,
        facultyImage: item.facultyImage || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png',
        status: item.status || 'active',
      };
    });

    // ✅ Insert into MongoDB
    await Faculty.insertMany(FacultyList);
    const userList = jsonArray.map((item) => {
      let encryptedPassword = bcrypt.hashSync('123456', 10);
      return{
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.collegeEmail,
        password:encryptedPassword,
        mobNo: item.mobileNo,
        userRole:'faculty',
        userImage: item.facultyImage || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png',
      }
    })
    await User.insertMany(userList)
    // Optional: remove uploaded file after processing
    // fs.unlinkSync(req.file.path);

    res.status(200).send({ success: true, message: 'Data added successfully' });

  } catch (error) {
    console.error('Error in addFaculties:', error);
    res.status(500).send({ success: false, message: 'Something went wrong' });
  }
}
async function getFaculties(req, res) {
    try {
      let skip=(req.query.pageNo-1)*req.query.limit
                let limit=req.query.limit
        let faculties = await Faculty.find({
            firstName: { $regex: new RegExp(req.query.firstName, "i") }
        }).skip(skip).limit(limit)
                let totalFaculty=await Faculty.countDocuments({})
        res.status(200).send({ success: true, data: faculties,totalCount:totalFaculty })
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'Something went wrong..!' });
    }
}
async function getFaculty(req, res) {
    try {
        let facultyId = req.params.id;
        let faculty = await Faculty.findOne({ _id: facultyId });
        res.status(200).send({ success: true, data: faculty })

    } catch (error) {
        res.status(500).send({ success: false, message: 'Something went wrong...' });
    }
}
async function editFaculty(req, res) {
    try {
        let facultyId = req.params.id;
        console.log(facultyId);
        console.log(req.body);

        let faculty = await Faculty.findOne({ _id: facultyId })
        Object.assign(faculty, req.body)
        await faculty.save();
        console.log("Faculty has been updated Successfully.....")

        res.status(200).send({ success: true, message: 'Faculty has been updated' })


    } catch (error) {
        res.status(500).send({ success: false, message: 'Something went wrong in updating Faculty.' })
    }
}

module.exports = {
  addFaculty,
  addFaculties,
  getFaculties,
  getFaculty,
  editFaculty,
};
