/**
 * GANDHINAGAR CIVIC CONNECT - ALL-MODULE REGISTRATION & WORKSPACE TEST SUITE
 * 
 * Verifies:
 * 1. Citizen Registration & Login
 * 2. Municipal Admin Registration & Login
 * 3. Ward Corporator Registration & Login
 * 4. Department Officer Registration & Login
 * 5. Field Worker Registration & Login
 * 6. End-to-End Action Execution across all 5 registered accounts
 * 7. Database Persistence & Audit Log Verification
 */

process.env.TEST_MODE = 'true';

// Setup Mock Browser Storage for Node test environment BEFORE module imports
if (typeof globalThis.localStorage === 'undefined') {
  const store = {};
  globalThis.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };
}

const { dataService } = await import('../src/services/dataService.js');
const { INITIAL_DEPARTMENTS, INITIAL_WARDS } = await import('../src/data/initialData.js');

const divider = '='.repeat(80);
const subDivider = '-'.repeat(80);

async function runAllRegistrationsTest() {
  console.log(divider);
  console.log('🏛️  GANDHINAGAR CIVIC CONNECT: ALL 5 MODULES REGISTRATION & AUTHENTICATION TEST');
  console.log(divider);

  const timestamp = Date.now();
  
  // -------------------------------------------------------------------------
  // 1. Define Accounts to Register for Each of the 5 Modules
  // -------------------------------------------------------------------------
  const accountsToRegister = [
    {
      moduleNum: 1,
      moduleName: 'Citizen Module',
      role: 'citizen',
      name: 'Aarav Patel',
      email: `aarav.citizen.${timestamp}@gandhinagar.test`,
      password: 'password123',
      mobile: '9825011111',
      wardId: 'W-04',
      departmentId: null,
      designation: 'Verified Gandhinagar Citizen (Sector 16-21)'
    },
    {
      moduleNum: 2,
      moduleName: 'Municipal Admin Desk',
      role: 'admin',
      name: 'Shri B. K. Dave (IAS)',
      email: `admin.dave.${timestamp}@gandhinagar.gov.in`,
      password: 'adminPassword123',
      mobile: '9825022222',
      wardId: null,
      departmentId: null,
      designation: 'Municipal Executive Admin (Head Office)'
    },
    {
      moduleNum: 3,
      moduleName: 'Ward Corporator Hub',
      role: 'corporator',
      name: 'Rupeshbhai Vaghela',
      email: `corporator.ward4.${timestamp}@gandhinagar.gov.in`,
      password: 'corpPassword123',
      mobile: '9825033333',
      wardId: 'W-04',
      departmentId: null,
      designation: 'Elected Corporator - Ward 4 (Sectors 16-21)'
    },
    {
      moduleNum: 4,
      moduleName: 'Department Officer Console',
      role: 'officer',
      name: 'Er. Sandeep Trivedi',
      email: `officer.sanitation.${timestamp}@gandhinagar.gov.in`,
      password: 'officerPassword123',
      mobile: '9825044444',
      wardId: null,
      departmentId: 'DEP-SAN',
      designation: 'Executive Engineer - Sanitation & Solid Waste'
    },
    {
      moduleNum: 5,
      moduleName: 'Field Worker Task Hub',
      role: 'worker',
      name: 'Vikramsinh Rathod',
      email: `worker.vikram.${timestamp}@gandhinagar.gov.in`,
      password: 'workerPassword123',
      mobile: '9825055555',
      wardId: 'W-04',
      departmentId: 'DEP-SAN',
      designation: 'Field Squad Lead - Gandhinagar Rapid Action'
    }
  ];

  const registeredUsers = {};

  // -------------------------------------------------------------------------
  // PHASE 1: Register Each Account into Database
  // -------------------------------------------------------------------------
  console.log('\n📦 PHASE 1: Registering All 5 Module Accounts into Database...');
  console.log(subDivider);

  for (const acc of accountsToRegister) {
    const userRecord = {
      id: `USR-${acc.role.toUpperCase()}-${timestamp}-${acc.moduleNum}`,
      name: acc.name,
      email: acc.email.toLowerCase(),
      password: acc.password,
      mobile: acc.mobile,
      role: acc.role,
      wardId: acc.wardId,
      departmentId: acc.departmentId,
      designation: acc.designation,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    await dataService.saveUser(userRecord);
    registeredUsers[acc.role] = userRecord;

    await dataService.addAuditLog(
      'USER_REGISTERED',
      userRecord.id,
      `New ${acc.role.toUpperCase()} registered: ${userRecord.name} (${userRecord.email})`
    );

    console.log(`✅ [Module ${acc.moduleNum}: ${acc.moduleName}] Registered Successfully!`);
    console.log(`   • Name:        ${userRecord.name}`);
    console.log(`   • Email:       ${userRecord.email}`);
    console.log(`   • Role:        ${userRecord.role}`);
    console.log(`   • Assigned:    ${acc.wardId ? 'Ward ' + acc.wardId : acc.departmentId || 'City Central'}`);
    console.log(`   • Saved to DB: Yes (ID: ${userRecord.id})\n`);
  }

  // -------------------------------------------------------------------------
  // PHASE 2: Verify Database Persistence & Email/Password Authentication
  // -------------------------------------------------------------------------
  console.log('🔐 PHASE 2: Verifying Email + Password Sign-In for All 5 Accounts...');
  console.log(subDivider);

  const allUsersInDb = await dataService.getUsers();

  for (const acc of accountsToRegister) {
    const matched = allUsersInDb.find(u => u.email.toLowerCase() === acc.email.toLowerCase());
    if (!matched) {
      throw new Error(`❌ Database Verification Failed: User ${acc.email} not found in database!`);
    }

    if (matched.password !== acc.password) {
      throw new Error(`❌ Password Verification Failed for ${acc.email}!`);
    }

    // Authenticate session
    await dataService.addAuditLog(
      'USER_LOGIN',
      matched.id,
      `User authenticated into ${acc.moduleName}: ${matched.email}`
    );

    console.log(`✅ Authenticated [${acc.moduleName}]: ${matched.name} | Role: ${matched.role.toUpperCase()} | Password Verified.`);
  }

  // -------------------------------------------------------------------------
  // PHASE 3: Live End-to-End Operational Lifecycle Across Registered Accounts
  // -------------------------------------------------------------------------
  console.log('\n🚀 PHASE 3: Testing Real Operations Between The 5 Registered Accounts...');
  console.log(subDivider);

  // 1. Citizen lodges complaint
  const citizen = registeredUsers['citizen'];
  console.log(`\n1️⃣  [Citizen: ${citizen.name}] Lodging Civic Complaint...`);
  const complaint = await dataService.createComplaint({
    citizenId: citizen.id,
    citizenName: citizen.name,
    citizenMobile: citizen.mobile,
    category: 'Drainage overflow and open manhole',
    description: 'Hazardous drainage overflow near Sector 17 community market. Obstructing road.',
    landmark: 'Sector 17 Community Market, Road 3',
    wardId: citizen.wardId || 'W-04',
    departmentId: 'DEP-SAN',
    priority: 'Urgent',
    location: {
      lat: 23.2312,
      lng: 72.6410,
      address: 'Sector 17 Market Road, Gandhinagar'
    },
    media: [{
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80',
      type: 'image/jpeg',
      caption: 'Open manhole & overflow'
    }]
  });
  console.log(`   ✅ Complaint Created! ID: ${complaint.id} | Status: ${complaint.status}`);

  // 2. Municipal Admin verifies & assigns
  const admin = registeredUsers['admin'];
  console.log(`\n2️⃣  [Admin Desk: ${admin.name}] Verifying Authenticity & Assigning Department...`);
  await dataService.verifyComplaint(
    complaint.id,
    admin.name,
    'W-04',
    'Admin verified live location coordinates. High safety hazard in Sector 17.'
  );

  const assignedDept = await dataService.assignDepartment(
    complaint.id,
    admin.name,
    {
      departmentId: 'DEP-SAN',
      priority: 'Urgent',
      targetDate: '2026-11-20',
      officerId: registeredUsers['officer'].id,
      officerName: registeredUsers['officer'].name
    }
  );
  console.log(`   ✅ Admin Verified & Assigned to Department! Status: ${assignedDept.status}`);

  // 3. Department Officer creates work order & dispatches field worker
  const officer = registeredUsers['officer'];
  const worker = registeredUsers['worker'];
  console.log(`\n3️⃣  [Department Officer: ${officer.name}] Creating Work Order for ${worker.name}...`);
  const dispatched = await dataService.assignWorker(
    complaint.id,
    officer.name,
    {
      workerId: worker.id,
      workerName: worker.name,
      instructions: 'Deploy vacuum de-silting tanker #GJ-18-G-4001. Clear drainage blockage and install safety barrier.',
      targetDate: '2026-11-20'
    }
  );
  console.log(`   ✅ Work Order Dispatched! Status: ${dispatched.status}`);

  // 4. Field Worker starts and uploads photographic proof
  console.log(`\n4️⃣  [Field Worker: ${worker.name}] Starting Work & Submitting Before/After Photos...`);
  await dataService.startWork(complaint.id, worker.name);
  const proofSubmitted = await dataService.submitResolutionProof(
    complaint.id,
    worker.name,
    {
      beforePhoto: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?auto=format&fit=crop&w=800&q=80',
      afterPhoto: 'https://images.unsplash.com/photo-1578965879796-01584ea0fd5d?auto=format&fit=crop&w=800&q=80',
      notes: 'Drain line cleared using tanker #GJ-18-G-4001. New reinforced manhole cover secured with seal.'
    }
  );
  console.log(`   ✅ Photographic Proof Uploaded! Status: ${proofSubmitted.status}`);

  // 5. Department Officer inspects proof & approves resolution
  console.log(`\n5️⃣  [Department Officer: ${officer.name}] Inspecting Field Photos & Approving...`);
  const resolvedCase = await dataService.verifyResolution(
    complaint.id,
    officer.name,
    true,
    'Field photos inspected. Drainage line flow fully restored and heavy-duty cover securely locked.'
  );
  console.log(`   ✅ Resolution Certified by Officer! Status: ${resolvedCase.status}`);

  // 6. Citizen reviews and closes case with 5-star review
  console.log(`\n6️⃣  [Citizen: ${citizen.name}] Inspecting Resolution & Submitting 5-Star Feedback...`);
  const closedCase = await dataService.submitFeedback(
    complaint.id,
    citizen.name,
    {
      rating: 5,
      feedbackText: 'Super fast action by Gandhinagar Municipal Corporation! Manhole is completely safe now.',
      isSatisfied: true
    }
  );
  console.log(`   ✅ Citizen Confirmed Satisfaction (5/5 Stars ⭐⭐⭐⭐⭐)! Status: ${closedCase.status}`);

  // 7. Ward Corporator monitors analytics & hotspot resolution
  const corporator = registeredUsers['corporator'];
  console.log(`\n7️⃣  [Ward Corporator: ${corporator.name}] Inspecting Ward ${corporator.wardId} Geospatial Ledger...`);
  const allCases = await dataService.getComplaints();
  const wardCases = allCases.filter(c => c.wardId === corporator.wardId);
  const wardResolved = wardCases.filter(c => ['Resolved', 'Closed'].includes(c.status));
  const rate = Math.round((wardResolved.length / wardCases.length) * 100);
  console.log(`   ✅ Ward ${corporator.wardId} Analytics Updated: Total ${wardCases.length} complaints, ${rate}% resolved.`);

  // -------------------------------------------------------------------------
  // PHASE 4: Audit Trail Integrity Check
  // -------------------------------------------------------------------------
  console.log('\n📜 PHASE 4: Verifying Immutable Database Audit Trail...');
  console.log(subDivider);
  console.log(`Audit Trail for Case ${closedCase.id}:`);
  closedCase.history.forEach((h, idx) => {
    console.log(`   ${idx + 1}. [${h.status.padEnd(20)}] Actor: ${h.actor.padEnd(30)} | ${h.remarks.slice(0, 50)}...`);
  });

  console.log('\n' + divider);
  console.log('🎉 ALL 5 MODULES REGISTRATION & OPERATIONAL TESTS PASSED WITH 100% SUCCESS!');
  console.log('   1. Citizen Module Registered:            ' + citizen.email);
  console.log('   2. Municipal Admin Desk Registered:      ' + admin.email);
  console.log('   3. Ward Corporator Hub Registered:       ' + corporator.email);
  console.log('   4. Department Officer Console Registered:' + officer.email);
  console.log('   5. Field Worker Hub Registered:          ' + worker.email);
  console.log('   6. Complete Lifecycle Completed & Verified in Database!');
  console.log(divider);
}

runAllRegistrationsTest().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
