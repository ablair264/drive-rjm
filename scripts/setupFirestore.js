import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICE_ACCOUNT_PATH =
  process.env.FIREBASE_SERVICE_ACCOUNT ||
  path.join(__dirname, '..', 'ServiceAccountKey.json');

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error(`❌ Service account file not found at ${SERVICE_ACCOUNT_PATH}`);
  console.error('Set FIREBASE_SERVICE_ACCOUNT or place ServiceAccountKey.json in the project root.');
  process.exit(1);
}

const serviceAccountRaw = fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8');
const serviceAccount = JSON.parse(serviceAccountRaw);

if (!serviceAccount.project_id) {
  console.error('❌ Service account JSON must include a project_id.');
  process.exit(1);
}

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
const { FieldValue, Timestamp } = admin.firestore;

function addMinutesToTimeString(timeString, minutes) {
  const [hours, mins] = timeString.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const normalizedMinutes = ((totalMinutes % (24 * 60)) + (24 * 60)) % (24 * 60);
  const normalizedHours = Math.floor(normalizedMinutes / 60);
  const remainingMins = normalizedMinutes % 60;
  return `${String(normalizedHours).padStart(2, '0')}:${String(remainingMins).padStart(2, '0')}`;
}

const today = new Date();
const sampleLessonDate = new Date(today);
sampleLessonDate.setDate(sampleLessonDate.getDate() + 1);
sampleLessonDate.setHours(9, 0, 0, 0);

const sampleStudentId = 'demo-student';
const sampleLessonId = 'demo-lesson';

const studentsToCreate = [
  {
    id: sampleStudentId,
    data: {
      name: 'Demo Student',
      email: 'demo.student@example.com',
      phone: '07123 456789',
      second_phone: '',
      postcode: 'WR6 6HU',
      licence_number: 'DOE900101A99AB',
      start_date: today.toISOString().split('T')[0],
      notes: 'Template record created by setupFirestore.js.',
      image: '',
      archived: false,
      emergency_contact: {
        name: 'Alex Demo',
        phone: '07999 000111',
        relationship: 'Parent'
      },
      lesson_history: {
        hours_taught: 2,
        theory_passed: false,
        test_booked: false,
        test_date: null
      },
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp()
    }
  }
];

const lessonsToCreate = [
  {
    id: sampleLessonId,
    data: {
      student_id: sampleStudentId,
      student_name: 'Demo Student',
      date: Timestamp.fromDate(sampleLessonDate),
      start_time: '10:00',
      end_time: addMinutesToTimeString('10:00', 60),
      duration_minutes: 60,
      start_postcode: 'WR6 6HU',
      end_postcode: 'WR6 6HU',
      status: 'scheduled',
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp()
    }
  }
];

const recentlyPassedToCreate = [
  {
    id: 'demo-pass',
    data: {
      name: 'Sophie, Worcester',
      tests: 'Passed 1st time',
      desc: 'Nervous at first, now confident in city traffic and roundabouts.',
      image: '/driving-instructor-worcester.webp',
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp()
    }
  }
];

const enquiriesToCreate = [
  {
    id: 'demo-enquiry',
    data: {
      name: 'Demo Lead',
      email: 'demo.enquiry@example.com',
      phone: '07444 222333',
      postcode: 'WR1 1AA',
      service: "I'd like a call back",
      message: 'Interested in an intensive course next month.',
      source: 'seed-script',
      status: 'new',
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp()
    }
  }
];

async function ensureDocument(collectionName, docId, data) {
  const docRef = db.collection(collectionName).doc(docId);
  const snapshot = await docRef.get();

  if (snapshot.exists) {
    console.log(`✔ ${collectionName}/${docId} already exists - skipping`);
    return;
  }

  await docRef.set(data);
  console.log(`✓ Created ${collectionName}/${docId}`);
}

async function main() {
  console.log(`🔧 Setting up Firestore for project ${serviceAccount.project_id}...`);

  for (const student of studentsToCreate) {
    await ensureDocument('students', student.id, student.data);
  }

  for (const lesson of lessonsToCreate) {
    await ensureDocument('lessons', lesson.id, lesson.data);
  }

  for (const passEntry of recentlyPassedToCreate) {
    await ensureDocument('recentlyPassed', passEntry.id, passEntry.data);
  }

  for (const enquiry of enquiriesToCreate) {
    await ensureDocument('enquiries', enquiry.id, enquiry.data);
  }

  console.log('✅ Firestore collections are ready.');
  console.log('Remember to deploy Firestore indexes with `firebase deploy --only firestore:indexes`.');
}

main().catch((error) => {
  console.error('❌ Firestore setup failed:', error);
  process.exit(1);
});
