require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Space = require('../src/models/Space');
const Booking = require('../src/models/Booking');
const MaintenanceWindow = require('../src/models/MaintenanceWindow');
const env = require('../src/config/env');

const hash = (pw) => bcrypt.hash(pw, 12);

const futureDate = (daysFromNow) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + daysFromNow);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const toDateTime = (dateStr, time) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [h, min] = time.split(':').map(Number);
  return new Date(Date.UTC(y, m - 1, d, h, min));
};

const seed = async () => {
  await mongoose.connect(env.mongodbUri);
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany({}),
    Space.deleteMany({}),
    Booking.deleteMany({}),
    MaintenanceWindow.deleteMany({}),
  ]);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@cowork.local',
    passwordHash: await hash('Admin@123'),
    role: 'admin',
  });

  const members = await User.insertMany([
    { name: 'Alice Member', email: 'alice@cowork.local', passwordHash: await hash('Member@123'), role: 'member' },
    { name: 'Bob Member', email: 'bob@cowork.local', passwordHash: await hash('Member@123'), role: 'member' },
    { name: 'Carol Member', email: 'carol@cowork.local', passwordHash: await hash('Member@123'), role: 'member' },
  ]);

  const spaces = await Space.insertMany([
    { name: 'Desk A1', type: 'desk', capacity: 1, amenities: ['Monitor', 'Power outlet'], description: 'Window desk with natural light' },
    { name: 'Desk A2', type: 'desk', capacity: 1, amenities: ['Monitor', 'Ergonomic chair'], description: 'Quiet corner desk' },
    { name: 'Desk B1', type: 'desk', capacity: 1, amenities: ['Standing desk', 'Power outlet'], description: 'Standing desk option' },
    { name: 'Desk B2', type: 'desk', capacity: 1, amenities: ['Dual monitor'], description: 'Developer desk' },
    { name: 'Desk C1', type: 'desk', capacity: 1, amenities: ['Power outlet'], description: 'Open plan desk' },
    { name: 'Meeting Room Alpha', type: 'meeting_room', capacity: 4, amenities: ['Whiteboard', 'TV', 'Video conferencing'], description: 'Small team room' },
    { name: 'Meeting Room Beta', type: 'meeting_room', capacity: 6, amenities: ['Whiteboard', 'Projector'], description: 'Medium meeting room' },
    { name: 'Meeting Room Gamma', type: 'meeting_room', capacity: 10, amenities: ['Whiteboard', 'TV', 'Conference phone'], description: 'Large boardroom' },
  ]);

  const bookDate = futureDate(3);
  const bookDate2 = futureDate(5);

  await Booking.insertMany([
    {
      user: members[0]._id,
      space: spaces[5]._id,
      date: bookDate,
      startTime: '10:00',
      endTime: '11:00',
      startDateTime: toDateTime(bookDate, '10:00'),
      endDateTime: toDateTime(bookDate, '11:00'),
      status: 'approved',
    },
    {
      user: members[1]._id,
      space: spaces[5]._id,
      date: bookDate,
      startTime: '10:30',
      endTime: '11:30',
      startDateTime: toDateTime(bookDate, '10:30'),
      endDateTime: toDateTime(bookDate, '11:30'),
      status: 'pending',
    },
    {
      user: members[2]._id,
      space: spaces[6]._id,
      date: bookDate2,
      startTime: '14:00',
      endTime: '15:00',
      startDateTime: toDateTime(bookDate2, '14:00'),
      endDateTime: toDateTime(bookDate2, '15:00'),
      status: 'pending',
    },
  ]);

  await MaintenanceWindow.create({
    space: spaces[7]._id,
    startDateTime: toDateTime(bookDate, '14:00'),
    endDateTime: toDateTime(bookDate, '16:00'),
    reason: 'AC maintenance',
    createdBy: admin._id,
  });

  console.log('\nSeed completed!\n');
  console.log('Admin:  admin@cowork.local / Admin@123');
  console.log('Member: alice@cowork.local / Member@123');
  console.log('Member: bob@cowork.local / Member@123');
  console.log('Member: carol@cowork.local / Member@123');
  console.log('\n(Development credentials only)\n');

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
