const Admin = require('./models/Admin');
const bcrypt = require('bcrypt')

async function createAdmin() {
    try {

        let adminExits = await Admin.findOne({ email: 'admin@yopmail.com' })
        if (adminExits) {
            console.log("Admin Updated...")
        } else {

            let admin = new Admin();

            admin.firstName = 'Project';
            admin.lastName = 'Admin';
            admin.email = 'admin@yopmail.com';
            let encryptedPassword = bcrypt.hashSync("123456", 10);
            admin.password = encryptedPassword;
            admin.adminType = 'admin'


            await admin.save();
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = createAdmin;