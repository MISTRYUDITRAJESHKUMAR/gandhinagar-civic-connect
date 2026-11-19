import { db, isFirebaseConfigured } from '../config/firebase.js';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { 
  INITIAL_COMPLAINTS, 
  INITIAL_WARDS, 
  INITIAL_DEPARTMENTS, 
  INITIAL_NOTIFICATIONS, 
  DEMO_USERS 
} from '../data/initialData.js';

const LOCAL_STORAGE_KEYS = {
  COMPLAINTS: 'gcc_complaints_v1',
  USERS: 'gcc_users_v1',
  NOTIFICATIONS: 'gcc_notifications_v1',
  WARDS: 'gcc_wards_v1',
  DEPARTMENTS: 'gcc_departments_v1',
  AUDIT_LOGS: 'gcc_audit_logs_v1'
};

// Initialize Local Store if empty
const getStored = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Local storage error:", e);
    return fallback;
  }
};

const setStored = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save to local storage:", e);
  }
};

// Pre-initialize local data
export const initLocalData = () => {
  const storedComplaints = getStored(LOCAL_STORAGE_KEYS.COMPLAINTS, []);
  const hasLegacyDemo = storedComplaints.some(c => ['GCC-2026-000101', 'GCC-2026-000102', 'GCC-2026-000103', 'GCC-2026-000104', 'GCC-2026-000105'].includes(c.id));
  if (hasLegacyDemo) {
    setStored(LOCAL_STORAGE_KEYS.COMPLAINTS, []);
    setStored(LOCAL_STORAGE_KEYS.NOTIFICATIONS, []);
  } else {
    getStored(LOCAL_STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
  }
  getStored(LOCAL_STORAGE_KEYS.USERS, DEMO_USERS);
  getStored(LOCAL_STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  getStored(LOCAL_STORAGE_KEYS.WARDS, INITIAL_WARDS);
  getStored(LOCAL_STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
};

initLocalData();

export const dataService = {
  // -------------------------------------------------------------
  // Complaints API
  // -------------------------------------------------------------
  async getComplaints(filter = {}) {
    if (isFirebaseConfigured && db) {
      try {
        const complaintsRef = collection(db, 'complaints');
        const snapshot = await getDocs(complaintsRef);
        let list = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
        
        // If Firestore is empty on first run, seed it!
        if (list.length === 0) {
          console.log("🌱 Seeding Firestore with initial Gandhinagar complaints...");
          for (const item of INITIAL_COMPLAINTS) {
            await setDoc(doc(db, 'complaints', item.id), item);
          }
          list = INITIAL_COMPLAINTS;
        }

        // Apply filters
        return this.filterComplaints(list, filter);
      } catch (err) {
        console.warn("Firestore fetch error, falling back to local storage:", err);
      }
    }

    const list = getStored(LOCAL_STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
    return this.filterComplaints(list, filter);
  },

  filterComplaints(list, filter) {
    return list.filter(item => {
      if (filter.wardId && item.wardId !== filter.wardId) return false;
      if (filter.departmentId && item.departmentId !== filter.departmentId) return false;
      if (filter.status && filter.status !== 'All' && item.status !== filter.status) return false;
      if (filter.citizenId && item.citizenId !== filter.citizenId) return false;
      if (filter.assignedWorkerId && item.assignedWorkerId !== filter.assignedWorkerId) return false;
      if (filter.category && filter.category !== 'All' && item.category !== filter.category) return false;
      return true;
    }).sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  },

  async getComplaintById(id) {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'complaints', id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          return { ...snapshot.data(), id: snapshot.id };
        }
      } catch (err) {
        console.warn("Firestore get error:", err);
      }
    }
    const list = getStored(LOCAL_STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
    return list.find(c => c.id === id) || null;
  },

  async createComplaint(newComplaint) {
    const list = getStored(LOCAL_STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
    
    // Generate clean civic complaint ID: GCC-2026-000XXX
    const nextNum = list.length + 101;
    const complaintId = `GCC-2026-${String(nextNum).padStart(6, '0')}`;
    
    const timestamp = new Date().toISOString();
    const entry = {
      ...newComplaint,
      id: complaintId,
      status: 'Submitted',
      createdAt: timestamp,
      updatedAt: timestamp,
      history: [
        {
          timestamp,
          status: 'Submitted',
          actor: `${newComplaint.citizenName || 'Citizen'}`,
          remarks: 'Complaint lodged successfully via Gandhinagar Civic Connect'
        }
      ]
    };

    // Save to Firestore if available
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'complaints', complaintId), entry);
      } catch (err) {
        console.warn("Firestore create error:", err);
      }
    }

    // Always keep local updated
    const updated = [entry, ...list];
    setStored(LOCAL_STORAGE_KEYS.COMPLAINTS, updated);

    // Create notification for Municipal Admin
    await this.createNotification({
      userId: 'USR-ADM-01',
      complaintId: entry.id,
      title: 'New Civic Issue Lodged',
      message: `New complaint ${entry.id} reported in ${entry.landmark || 'Gandhinagar'}. Verification required.`
    });

    return entry;
  },

  async updateComplaintStatus(complaintId, newStatus, actorName, remarks, extra = {}) {
    const list = getStored(LOCAL_STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
    const index = list.findIndex(c => c.id === complaintId);
    if (index === -1) return null;

    const timestamp = new Date().toISOString();
    const current = list[index];
    
    const newHistory = [
      ...(current.history || []),
      {
        timestamp,
        status: newStatus,
        actor: actorName || 'System Authority',
        remarks: remarks || `Status changed to ${newStatus}`
      }
    ];

    const updatedItem = {
      ...current,
      ...extra,
      status: newStatus,
      updatedAt: timestamp,
      history: newHistory
    };

    list[index] = updatedItem;
    setStored(LOCAL_STORAGE_KEYS.COMPLAINTS, list);

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'complaints', complaintId), updatedItem);
      } catch (err) {
        console.warn("Firestore update error:", err);
      }
    }

    // Trigger notification to Citizen
    if (current.citizenId) {
      await this.createNotification({
        userId: current.citizenId,
        complaintId: current.id,
        title: `Status: ${newStatus}`,
        message: `Your complaint ${current.id} has been marked as "${newStatus}". Remarks: ${remarks || 'Updated by municipal team'}.`
      });
    }

    return updatedItem;
  },

  async verifyComplaint(complaintId, adminName, wardId, remarks) {
    return this.updateComplaintStatus(
      complaintId, 
      'Verified', 
      adminName, 
      remarks || 'Complaint verified as genuine and approved for department allocation.',
      { wardId }
    );
  },

  async rejectComplaint(complaintId, adminName, reason) {
    return this.updateComplaintStatus(
      complaintId,
      'Rejected',
      adminName,
      `Rejected by Municipal Admin: ${reason}`,
      { rejectionReason: reason }
    );
  },

  async markAsDuplicate(complaintId, adminName, originalComplaintId) {
    return this.updateComplaintStatus(
      complaintId,
      'Duplicate',
      adminName,
      `Marked as duplicate of existing complaint ${originalComplaintId}. Linked for merged action.`,
      { duplicateOf: originalComplaintId }
    );
  },

  async assignDepartment(complaintId, adminName, { departmentId, priority, targetDate, officerId, officerName }) {
    const extra = {
      departmentId,
      priority: priority || 'Medium',
      targetDate: targetDate || '',
      assignedOfficerId: officerId,
      assignedOfficerName: officerName
    };

    const res = await this.updateComplaintStatus(
      complaintId,
      'Assigned',
      adminName,
      `Assigned to department with priority [${priority}]. Target completion date: ${targetDate || 'Standard SLA'}.`,
      extra
    );

    // Notify Department Officer
    if (officerId) {
      await this.createNotification({
        userId: officerId,
        complaintId,
        title: 'New Complaint Assigned',
        message: `Complaint ${complaintId} assigned to your department. Target: ${targetDate}`
      });
    }

    return res;
  },

  async assignWorker(complaintId, officerName, { workerId, workerName, instructions, targetDate }) {
    const timestamp = new Date().toISOString();
    const workOrder = {
      instructions: instructions || 'Inspect and execute required on-site repairs/cleaning.',
      targetDate: targetDate || '',
      startedAt: null,
      beforePhoto: null,
      afterPhoto: null,
      notes: ''
    };

    const extra = {
      assignedWorkerId: workerId,
      assignedWorkerName: workerName,
      workOrder
    };

    const res = await this.updateComplaintStatus(
      complaintId,
      'In Progress',
      officerName,
      `Work order created for Field Worker ${workerName}. Instructions: ${instructions}`,
      extra
    );

    // Notify Worker
    if (workerId) {
      await this.createNotification({
        userId: workerId,
        complaintId,
        title: 'New Task Allocated',
        message: `Work Order: ${instructions}. Due: ${targetDate}`
      });
    }

    return res;
  },

  async startWork(complaintId, workerName, beforePhoto = '') {
    const list = getStored(LOCAL_STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
    const complaint = list.find(c => c.id === complaintId);
    if (!complaint) return null;

    const workOrder = {
      ...(complaint.workOrder || {}),
      startedAt: new Date().toISOString(),
      beforePhoto: beforePhoto || complaint.media?.[0]?.url || ''
    };

    return this.updateComplaintStatus(
      complaintId,
      'In Progress',
      workerName,
      'Field worker reached the location and commenced on-site work.',
      { workOrder }
    );
  },

  async submitResolutionProof(complaintId, workerName, { beforePhoto, afterPhoto, notes }) {
    const list = getStored(LOCAL_STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
    const complaint = list.find(c => c.id === complaintId);
    if (!complaint) return null;

    const workOrder = {
      ...(complaint.workOrder || {}),
      completedAt: new Date().toISOString(),
      beforePhoto: beforePhoto || complaint.workOrder?.beforePhoto || complaint.media?.[0]?.url,
      afterPhoto,
      notes
    };

    const res = await this.updateComplaintStatus(
      complaintId,
      'Resolution Submitted',
      workerName,
      `Worker completed on-ground work and submitted completion proof: ${notes}`,
      { workOrder }
    );

    // Notify Department Officer for verification
    if (complaint.assignedOfficerId) {
      await this.createNotification({
        userId: complaint.assignedOfficerId,
        complaintId,
        title: 'Work Completion Verification Needed',
        message: `Worker ${workerName} submitted resolution proof for ${complaintId}. Review and verify.`
      });
    }

    return res;
  },

  async verifyResolution(complaintId, officerName, approved, remarks) {
    if (approved) {
      return this.updateComplaintStatus(
        complaintId,
        'Resolved',
        officerName,
        remarks || 'Officer reviewed and approved on-site completion proof. Issue resolved.',
        { resolvedAt: new Date().toISOString() }
      );
    } else {
      // Send back for rework
      return this.updateComplaintStatus(
        complaintId,
        'In Progress',
        officerName,
        `Resolution rejected by officer - Rework needed: ${remarks}`,
        { reworkRequired: true, reworkRemarks: remarks }
      );
    }
  },

  async submitFeedback(complaintId, citizenName, { rating, feedbackText, isSatisfied }) {
    const feedback = {
      rating,
      feedbackText,
      isSatisfied,
      createdAt: new Date().toISOString()
    };

    const newStatus = isSatisfied ? 'Closed' : 'Reopened';
    const remarks = isSatisfied 
      ? `Citizen confirmed satisfaction (Rating: ${rating}/5). Complaint closed.`
      : `Citizen dissatisfied: ${feedbackText}`;

    return this.updateComplaintStatus(
      complaintId,
      newStatus,
      citizenName,
      remarks,
      { feedback }
    );
  },

  async reopenComplaint(complaintId, citizenName, reason, photoUrl = '') {
    const extra = {
      reopenReason: reason,
      reopenPhoto: photoUrl
    };

    return this.updateComplaintStatus(
      complaintId,
      'Reopened',
      citizenName,
      `Citizen reopened complaint: "${reason}"`,
      extra
    );
  },

  // -------------------------------------------------------------
  // Duplicate Detection Engine
  // -------------------------------------------------------------
  detectDuplicates(category, lat, lng, excludeId = null) {
    const list = getStored(LOCAL_STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
    if (!lat || !lng) return [];

    // Helper to calculate approximate distance in meters
    const getDistanceMeters = (lat1, lon1, lat2, lon2) => {
      const R = 6371e3; // Earth radius in metres
      const φ1 = lat1 * Math.PI / 180;
      const φ2 = lat2 * Math.PI / 180;
      const Δφ = (lat2 - lat1) * Math.PI / 180;
      const Δλ = (lon2 - lon1) * Math.PI / 180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    return list.filter(item => {
      if (excludeId && item.id === excludeId) return false;
      if (['Closed', 'Rejected'].includes(item.status)) return false;
      
      const sameCategory = item.category === category;
      if (!item.location?.lat || !item.location?.lng) return false;
      
      const distance = getDistanceMeters(lat, lng, item.location.lat, item.location.lng);
      // Matches if same category and within 250 meters
      return sameCategory && distance <= 250;
    });
  },

  // -------------------------------------------------------------
  // Notifications
  // -------------------------------------------------------------
  async getNotifications(userId) {
    const list = getStored(LOCAL_STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    if (!userId) return list;
    return list.filter(n => n.userId === userId || n.userId === 'ALL');
  },

  async createNotification(notif) {
    const list = getStored(LOCAL_STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif = {
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      timestamp: new Date().toISOString(),
      isRead: false,
      ...notif
    };
    const updated = [newNotif, ...list];
    setStored(LOCAL_STORAGE_KEYS.NOTIFICATIONS, updated);
    return newNotif;
  },

  async markNotificationRead(id) {
    const list = getStored(LOCAL_STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const updated = list.map(n => n.id === id ? { ...n, isRead: true } : n);
    setStored(LOCAL_STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  // -------------------------------------------------------------
  // Reference Metadata
  // -------------------------------------------------------------
  getWards() {
    return getStored(LOCAL_STORAGE_KEYS.WARDS, INITIAL_WARDS);
  },

  getDepartments() {
    return getStored(LOCAL_STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  },

  // -------------------------------------------------------------
  // Analytics
  // -------------------------------------------------------------
  async getAnalytics() {
    const complaints = await this.getComplaints();
    const wards = this.getWards();
    const departments = this.getDepartments();

    const total = complaints.length;
    const submitted = complaints.filter(c => c.status === 'Submitted').length;
    const inProgress = complaints.filter(c => ['Assigned', 'In Progress', 'Resolution Submitted'].includes(c.status)).length;
    const resolved = complaints.filter(c => ['Resolved', 'Closed'].includes(c.status)).length;
    const reopened = complaints.filter(c => c.status === 'Reopened').length;

    // Ward breakdown
    const wardStats = wards.map(w => {
      const wardComplaints = complaints.filter(c => c.wardId === w.id);
      return {
        id: w.id,
        name: w.name,
        number: w.number,
        total: wardComplaints.length,
        resolved: wardComplaints.filter(c => ['Resolved', 'Closed'].includes(c.status)).length,
        pending: wardComplaints.filter(c => !['Resolved', 'Closed', 'Rejected'].includes(c.status)).length,
        corporator: w.corporator
      };
    });

    // Department breakdown
    const deptStats = departments.map(d => {
      const deptComplaints = complaints.filter(c => c.departmentId === d.id);
      return {
        id: d.id,
        name: d.name,
        code: d.code,
        head: d.head,
        total: deptComplaints.length,
        resolved: deptComplaints.filter(c => ['Resolved', 'Closed'].includes(c.status)).length,
        pending: deptComplaints.filter(c => !['Resolved', 'Closed', 'Rejected'].includes(c.status)).length
      };
    });

    return {
      total,
      submitted,
      inProgress,
      resolved,
      reopened,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      wardStats,
      deptStats
    };
  },

  // -------------------------------------------------------------
  // User Management & Database Persistence
  // -------------------------------------------------------------
  async getUsers() {
    if (isFirebaseConfigured && db) {
      try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
        if (list.length > 0) return list;
      } catch (err) {
        console.warn("Firestore fetch users fallback:", err);
      }
    }
    return getStored(LOCAL_STORAGE_KEYS.USERS, DEMO_USERS);
  },

  async saveUser(user) {
    const list = await this.getUsers();
    const index = list.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    
    let updated;
    if (index >= 0) {
      updated = [...list];
      updated[index] = { ...list[index], ...user };
    } else {
      updated = [...list, user];
    }

    setStored(LOCAL_STORAGE_KEYS.USERS, updated);

    // Persist to Cloud Firestore if configured
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'users', user.id), user, { merge: true });
        console.log(`🔥 [Firestore] User saved successfully in 'users' collection:`, user.id);
      } catch (err) {
        console.warn("Failed saving user to Firestore:", err);
      }
    }

    // Record registration / profile audit log
    await this.addAuditLog('USER_SAVED', user.id, `User account ${user.email} (${user.role}) recorded in database`);
    return user;
  },

  async getUserByEmail(email) {
    if (!email) return null;
    const users = await this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async getUserByMobile(mobile) {
    if (!mobile) return null;
    const users = await this.getUsers();
    return users.find(u => u.mobile === mobile) || null;
  },

  async updateUser(userId, updates) {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return null;

    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    setStored(LOCAL_STORAGE_KEYS.USERS, users);

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'users', userId), updates);
      } catch (err) {
        console.warn("Firestore user update error:", err);
      }
    }

    await this.addAuditLog('USER_UPDATED', userId, `User profile updated`);
    return updatedUser;
  },

  // -------------------------------------------------------------
  // Audit Logs
  // -------------------------------------------------------------
  async addAuditLog(action, userId, details) {
    const logs = getStored(LOCAL_STORAGE_KEYS.AUDIT_LOGS, []);
    const entry = {
      id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      userId: userId || 'SYSTEM',
      details,
      timestamp: new Date().toISOString()
    };
    const updated = [entry, ...logs].slice(0, 500); // keep 500 latest
    setStored(LOCAL_STORAGE_KEYS.AUDIT_LOGS, updated);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'auditLogs', entry.id), entry);
      } catch (err) {
        console.warn("Firestore audit log error:", err);
      }
    }
    return entry;
  },

  getAuditLogs() {
    return getStored(LOCAL_STORAGE_KEYS.AUDIT_LOGS, []);
  }
};
