const User = require('../models/User');

const seedDefaultAdmin = async () => {
  try {
    // Check if an admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('👑 Admin user already exists:', existingAdmin.email);
      return;
    }

    // Create default admin
    const adminUser = await User.create({
      name: 'TechCare Admin',
      email: 'admin@techcare.com',
      phone: '9999999999',
      password: 'Admin@123',
      role: 'admin',
    });

    console.log('👑 Default admin user created:', adminUser.email);
    console.log('   Email: admin@techcare.com');
    console.log('   Password: Admin@123');
  } catch (error) {
    console.error('❌ Error seeding admin user:', error.message);
  }
};

module.exports = seedDefaultAdmin;
