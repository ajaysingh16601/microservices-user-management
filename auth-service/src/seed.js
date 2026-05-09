const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Update this with your MongoDB connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/auth_test';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const dummyUsers = [
  { name: 'Admin User', email: 'admin@test.com', password: 'Password1', phone: '9999999991' },
  { name: 'User One', email: 'user1@test.com', password: 'Password1', phone: '9999999992' },
  { name: 'User Two', email: 'user2@test.com', password: 'Password1', phone: '9999999993' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    for (const userData of dummyUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.create({
        ...userData,
        password: hashedPassword,
      });
      console.log(`Created user: ${userData.email}`);
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
