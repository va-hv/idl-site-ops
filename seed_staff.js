const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new DatabaseSync(dbPath);

db.exec(`DELETE FROM Employee; DELETE FROM AndonAlert; DELETE FROM OperationalLog;`);

const insertEmp = db.prepare('INSERT INTO Employee (id, employeeId, name, department, shift, status) VALUES (?, ?, ?, ?, ?, ?)');

const employees = [
  ['e1', 'IDL-88201', 'Marcus Brody', 'Inbound RME', 'Shift A (07:00 - 15:30)', 'CLOCK_IN'],
  ['e2', 'IDL-88204', 'Sarah Jenkins', 'WHS Safety', 'Shift A (07:00 - 15:30)', 'CLOCK_IN'],
  ['e3', 'IDL-88310', 'Ritesh Kumar', 'Operations Lead', 'Shift A (07:00 - 15:30)', 'CLOCK_IN'],
  ['e4', 'IDL-88412', 'Elena Rostova', 'Quality Assurance', 'Shift A (07:00 - 15:30)', 'CLOCK_IN'],
  ['e5', 'IDL-88523', 'David Chen', 'Outbound Shipping', 'Shift B (15:00 - 23:30)', 'BREAK'],
  ['e6', 'IDL-88601', 'Amara Okafor', 'Inventory Control', 'Shift A (07:00 - 15:30)', 'CLOCK_IN'],
  ['e7', 'IDL-88719', 'Liam O\'Connor', 'Facilities & ESG', 'Shift C (23:00 - 07:30)', 'OFFLINE'],
  ['e8', 'IDL-88840', 'Fatima Al-Hassan', 'Continuous Improvement', 'Shift A (07:00 - 15:30)', 'CLOCK_IN'],
  ['e9', 'IDL-88902', 'Carlos Mendez', 'IT & Device Fleet', 'Shift B (15:00 - 23:30)', 'CLOCK_IN'],
  ['e10', 'IDL-89011', 'Chloe Tremblay', 'Workforce Management', 'Shift A (07:00 - 15:30)', 'CLOCK_IN']
];

for (const emp of employees) {
  insertEmp.run(...emp);
}

const insertAndon = db.prepare('INSERT INTO AndonAlert (id, alertId, station, issue, duration, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)');
insertAndon.run('a1', 'ANDON-402', 'Zone C - Pack Station 12', 'Material Shortage (Boxes)', '4 mins', 'ACKNOWLEDGED', new Date().toISOString());
insertAndon.run('a2', 'ANDON-405', 'Zone A - Inbound Line 3', 'Jam on Roller Diverter', '9 mins', 'ACTIVE', new Date().toISOString());

console.log('✅ Real-world employee roster and live shift alerts seeded successfully!');
