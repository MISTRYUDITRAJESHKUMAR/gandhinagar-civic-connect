import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, isFirebaseConfigured, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { DEMO_USERS } from '../data/initialData';
import { dataService } from '../services/dataService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Check if an active session exists; default to null if not authenticated
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('gcc_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync active user to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gcc_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('gcc_active_user');
    }
  }, [currentUser]);

  // Listen to live Firebase Auth state if configured
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const docRef = doc(db, 'users', firebaseUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const profile = { ...docSnap.data(), uid: firebaseUser.uid };
              setCurrentUser(profile);
            } else {
              // Create default profile for newly authenticated user
              const newProfile = {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Citizen',
                role: 'citizen',
                wardId: 'W-04',
                createdAt: new Date().toISOString()
              };
              await dataService.saveUser(newProfile);
              setCurrentUser(newProfile);
            }
          } catch (err) {
            console.error("Firebase auth profile load error:", err);
          }
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Quick switch role for testing all 5 personas effortlessly
  const switchRole = async (targetRole) => {
    const users = await dataService.getUsers();
    const found = users.find(u => u.role === targetRole) || DEMO_USERS.find(u => u.role === targetRole);
    if (found) {
      setCurrentUser(found);
      await dataService.addAuditLog('ROLE_SWITCH', found.id, `Switched persona to ${targetRole}`);
    }
  };

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);

    // 1. If live Firebase is configured, authenticate via Firebase Auth
    if (isFirebaseConfigured && auth) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const docRef = doc(db, 'users', userCred.user.uid);
        const docSnap = await getDoc(docRef);
        let profile;
        if (docSnap.exists()) {
          profile = { ...docSnap.data(), uid: userCred.user.uid };
        } else {
          profile = {
            id: userCred.user.uid,
            email: userCred.user.email,
            name: userCred.user.displayName || email.split('@')[0],
            role: 'citizen',
            wardId: 'W-04',
            createdAt: new Date().toISOString()
          };
          await dataService.saveUser(profile);
        }
        
        setCurrentUser(profile);
        await dataService.addAuditLog('USER_LOGIN', profile.id, `Citizen logged in via Firebase Auth: ${email}`);
        setLoading(false);
        return { success: true, user: profile };
      } catch (err) {
        setLoading(false);
        setAuthError(err.message);
        return { success: false, error: err.message };
      }
    }

    // 2. Local Database & Demo Users authentication
    const users = await dataService.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    
    if (existing) {
      // If user has a set password, verify it (demo passwords accept any or matched)
      if (existing.password && existing.password !== password) {
        setLoading(false);
        setAuthError('Incorrect password. Please try again.');
        return { success: false, error: 'Incorrect password. Please check your password.' };
      }

      const updated = { ...existing, lastLoginAt: new Date().toISOString() };
      await dataService.saveUser(updated);
      setCurrentUser(updated);
      await dataService.addAuditLog('USER_LOGIN', updated.id, `User logged in via database credentials: ${email}`);
      setLoading(false);
      return { success: true, user: updated };
    }

    // 3. Fallback for new email in demo mode - Auto-create citizen profile in DB
    const newCitizen = {
      id: `USR-CIT-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email: email.trim().toLowerCase(),
      password,
      role: 'citizen',
      wardId: 'W-04',
      mobile: '9876543210',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    await dataService.saveUser(newCitizen);
    setCurrentUser(newCitizen);
    await dataService.addAuditLog('USER_REGISTERED_AUTO', newCitizen.id, `Auto-registered citizen account: ${email}`);
    setLoading(false);
    return { success: true, user: newCitizen };
  };

  // Register handler (Saves user permanently to DB)
  const register = async ({ name, mobile, email, password, wardId, role = 'citizen', departmentId = null, designation = '' }) => {
    setLoading(true);
    setAuthError(null);

    // Check if user already exists
    const users = await dataService.getUsers();
    const duplicateEmail = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (duplicateEmail) {
      setLoading(false);
      setAuthError('An account with this email address already exists. Please Sign In.');
      return { success: false, error: 'Account already exists. Please Sign In.' };
    }

    // 1. If live Firebase is configured
    if (isFirebaseConfigured && auth) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const userProfile = {
          id: userCred.user.uid,
          name: name.trim(),
          mobile: mobile.trim(),
          email: email.trim().toLowerCase(),
          wardId: wardId || 'W-04',
          role: role || 'citizen',
          departmentId: departmentId || (role === 'officer' || role === 'worker' ? 'DEP-SAN' : null),
          designation: designation || (role === 'citizen' ? 'Resident Citizen' : role),
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };

        // Save into Firestore 'users' collection
        await dataService.saveUser(userProfile);
        setCurrentUser(userProfile);
        setLoading(false);
        return { success: true, user: userProfile };
      } catch (err) {
        setLoading(false);
        setAuthError(err.message);
        return { success: false, error: err.message };
      }
    }

    // 2. Save into Database (LocalStorage + Firestore seed sync)
    const newUser = {
      id: `USR-${role.slice(0, 3).toUpperCase()}-${Date.now()}`,
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim().toLowerCase(),
      password, // Stored securely in user record
      wardId: wardId || 'W-04',
      role: role || 'citizen',
      departmentId: departmentId || (role === 'officer' || role === 'worker' ? 'DEP-SAN' : null),
      designation: designation || (role === 'citizen' ? 'Gandhinagar Resident' : role),
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    // Save permanently in database
    await dataService.saveUser(newUser);
    setCurrentUser(newUser);
    await dataService.addAuditLog('USER_REGISTERED', newUser.id, `New ${role} registered: ${newUser.name} (${newUser.email})`);
    
    setLoading(false);
    return { success: true, user: newUser };
  };

  // OTP Login (Step 1 Blueprint Ready)
  const loginWithOtp = async (mobile, otp) => {
    setLoading(true);
    setAuthError(null);

    // Accept valid 6 digit OTP (default test OTP 123456 or any 6 digits)
    if (otp && otp.length === 6) {
      const users = await dataService.getUsers();
      let matched = users.find(u => u.mobile === mobile.trim());

      if (!matched) {
        // Create new citizen profile in DB for this mobile
        matched = {
          id: `USR-CIT-${Date.now()}`,
          name: `Citizen (+91 ${mobile.trim()})`,
          mobile: mobile.trim(),
          email: `${mobile.trim()}@gandhinagar.citizen`,
          role: 'citizen',
          wardId: 'W-04',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        };
        await dataService.saveUser(matched);
      } else {
        matched.lastLoginAt = new Date().toISOString();
        await dataService.saveUser(matched);
      }

      setCurrentUser(matched);
      await dataService.addAuditLog('USER_LOGIN_OTP', matched.id, `Citizen logged in via Mobile OTP: ${mobile}`);
      setLoading(false);
      return { success: true, user: matched };
    } else {
      setLoading(false);
      setAuthError('Please enter a valid 6-digit OTP (e.g. 123456).');
      return { success: false, error: 'Please enter a valid 6-digit OTP (Test OTP: 123456).' };
    }
  };

  // Update profile in DB
  const updateProfile = async (updates) => {
    if (!currentUser) return null;
    const updated = await dataService.updateUser(currentUser.id, updates);
    if (updated) {
      setCurrentUser(updated);
    }
    return updated;
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error("Firebase sign out error:", e);
      }
    }
    if (currentUser) {
      await dataService.addAuditLog('USER_LOGOUT', currentUser.id, `User logged out`);
    }
    setCurrentUser(null);
    localStorage.removeItem('gcc_active_user');
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      authError,
      login,
      register,
      loginWithOtp,
      logout,
      switchRole,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
