const User = require('../models/User');

const seedDefaultAdmin = async () => {
  try {
    // Check if an admin user already exists
    let adminUser = await User.findOne({ role: 'admin' });

    if (adminUser) {
      if (adminUser.phone !== '0785645789') {
        await User.updateOne({ _id: adminUser._id }, { phone: '0785645789' });
        console.log('👑 Admin user phone number updated to 0785645789');
      } else {
        console.log('👑 Admin user exists with phone 0785645789:', adminUser.email);
      }
      return;
    }

    // Create default admin
    adminUser = await User.create({
      name: 'TechCare Admin',
      email: 'admin@techcare.com',
      phone: '0785645789',
      password: 'Admin@123',
      role: 'admin',
    });

    console.log('👑 Default admin user created:', adminUser.email);
    console.log('   Email: admin@techcare.com');
    console.log('   Phone: 0785645789');
    console.log('   Password: Admin@123');
  } catch (error) {
    console.error('❌ Error seeding admin user:', error.message);
  }
};

module.exports = seedDefaultAdmin;
