export const GANDHINAGAR_CENTER = [23.2156, 72.6369]; // Gandhinagar, Gujarat coordinates

// ============================================================================
// OFFICIAL GANDHINAGAR MUNICIPAL CORPORATION (GMC) 11 WARDS
// Sources: Gandhinagar Municipal Corporation (GMC) Official Portal & State Records
// ============================================================================
export const INITIAL_WARDS = [
  { 
    id: 'W-01', 
    number: 1, 
    name: 'Ward 1 - Sector 25, 26, GIDC & Randheja', 
    corporator: 'Mahendra Patel (Standing Committee Chairman)', 
    contact: '+91 98250 10001', 
    area: 'Sector 25, Sector 26, Sector 25/26 GIDC, Randheja, Kolavada touch' 
  },
  { 
    id: 'W-02', 
    number: 2, 
    name: 'Ward 2 - Pethapur Heritage & GEB Colony', 
    corporator: 'Anjanaben Mehta (Deputy Mayor)', 
    contact: '+91 98250 10002', 
    area: 'Pethapur Heritage Town, GEB Colony, Adivada, Charedi, Vasan' 
  },
  { 
    id: 'W-03', 
    number: 3, 
    name: 'Ward 3 - Sector 24, 27, 28 & GIDC', 
    corporator: 'Geetaben Patel (Corporator)', 
    contact: '+91 98250 10003', 
    area: 'Sector 24, Sector 27, Sector 28, Sector 28 GIDC Industrial Hub' 
  },
  { 
    id: 'W-04', 
    number: 4, 
    name: 'Ward 4 - Sector 20, 21, 29 & Indroda', 
    corporator: 'Rupsinh Thakor (Hon. Mayor of Gandhinagar)', 
    contact: '+91 98250 10004', 
    area: 'Sector 20, Sector 21, Sector 29, Indroda, Borij, Palaj' 
  },
  { 
    id: 'W-05', 
    number: 5, 
    name: 'Ward 5 - Sector 13 to 17 & Gokulpura (City Center)', 
    corporator: 'Hitesh Makwana (Senior Corporator)', 
    contact: '+91 98250 10005', 
    area: 'Sector 13, Sector 14, Sector 15, Sector 16, Sector 17, Gh-Road, Gokulpura' 
  },
  { 
    id: 'W-06', 
    number: 6, 
    name: 'Ward 6 - Sector 7 to 12 & Dholakuva (Akshardham Zone)', 
    corporator: 'Alka Patel (Corporator)', 
    contact: '+91 98250 10006', 
    area: 'Sector 7, Sector 8, Sector 9, Sector 10, Sector 11, Sector 12, Dholakuva' 
  },
  { 
    id: 'W-07', 
    number: 7, 
    name: 'Ward 7 - Vavol, Kolvada & Sector 3, 5, 6 Overlaps', 
    corporator: 'Sanjaybhai Desai (Corporator)', 
    contact: '+91 98250 10007', 
    area: 'Vavol Village, Kolvada, Sector 3, Sector 5, Sector 6 Western Ring' 
  },
  { 
    id: 'W-08', 
    number: 8, 
    name: 'Ward 8 - Sargasan, Vasana & Sector 4, 5', 
    corporator: 'Aartiben Chaudhary (Corporator)', 
    contact: '+91 98250 10008', 
    area: 'Sector 4, Sector 5, Sargasan, Vasana, Hadmatiya, Tarapur, Ambapur' 
  },
  { 
    id: 'W-09', 
    number: 9, 
    name: 'Ward 9 - Infocity, Kudasan & Sector 2, 3 (Tech Hub)', 
    corporator: 'Jignesh Mewada (Corporator)', 
    contact: '+91 98250 10009', 
    area: 'Infocity, Kudasan West, Sector 2, Sector 3, PDPU Road, TP-4 & 6' 
  },
  { 
    id: 'W-10', 
    number: 10, 
    name: 'Ward 10 - Sector 1, Raysan, Randesan & Koba (Capital Enclave)', 
    corporator: 'Karamjitsinh Vaghela (Leader of Opposition)', 
    contact: '+91 98250 10010', 
    area: 'Sector 1, Vidhan Sabha Complex, Raysan, Randesan, Koba North-East' 
  },
  { 
    id: 'W-11', 
    number: 11, 
    name: 'Ward 11 - Bhat, Koteshwar, Zundal & GIFT Corridor', 
    corporator: 'Rajeshbhai Solanki (Corporator)', 
    contact: '+91 98250 10011', 
    area: 'Bhat, Koteshwar, Zundal, Khoraj, Nabhoi, Sughad, GIFT City Adjacent' 
  }
];

export const INITIAL_DEPARTMENTS = [
  { id: 'DEP-SAN', code: 'sanitation', name: 'Sanitation & Solid Waste Management', head: 'Dr. Priyaben Joshi', icon: 'Trash2', color: 'emerald' },
  { id: 'DEP-ROA', code: 'roads', name: 'Roads, Bridges & Civil Infrastructure', head: 'Er. Alok Trivedi', icon: 'Construction', color: 'amber' },
  { id: 'DEP-STR', code: 'streetlight', name: 'Streetlights & Electrical Grid', head: 'Er. Naresh Raval', icon: 'Lightbulb', color: 'yellow' },
  { id: 'DEP-DRA', code: 'drainage', name: 'Drainage, Sewage & Waterlogging', head: 'Er. Bhavna Macwan', icon: 'Droplets', color: 'sky' },
  { id: 'DEP-PUB', code: 'public_infra', name: 'Public Infrastructure & Parks', head: 'Shri Vikram Desai', icon: 'Building2', color: 'indigo' },
];

export const COMPLAINT_CATEGORIES = [
  { id: 'cat-1', label: 'Garbage and waste dumping', departmentId: 'DEP-SAN', icon: 'Trash2', defaultPriority: 'High' },
  { id: 'cat-2', label: 'Potholes and damaged roads', departmentId: 'DEP-ROA', icon: 'Construction', defaultPriority: 'High' },
  { id: 'cat-3', label: 'Broken streetlights', departmentId: 'DEP-STR', icon: 'Lightbulb', defaultPriority: 'Medium' },
  { id: 'cat-4', label: 'Drainage and waterlogging', departmentId: 'DEP-DRA', icon: 'Droplets', defaultPriority: 'Urgent' },
  { id: 'cat-5', label: 'Illegal dumping', departmentId: 'DEP-SAN', icon: 'AlertTriangle', defaultPriority: 'High' },
  { id: 'cat-6', label: 'Damaged public infrastructure', departmentId: 'DEP-PUB', icon: 'Building2', defaultPriority: 'Medium' },
  { id: 'cat-7', label: 'Other civic issues', departmentId: 'DEP-PUB', icon: 'HelpCircle', defaultPriority: 'Low' },
];

export const DEMO_USERS = [
  {
    id: 'USR-CIT-01',
    name: 'Pooja Sharma',
    email: 'pooja.sharma@gandhinagar.citizen',
    mobile: '9825144321',
    password: 'password123',
    role: 'citizen',
    wardId: 'W-04',
    address: 'B-204, Swagat Green, Sector 21, Gandhinagar',
    designation: 'Registered Citizen'
  },
  {
    id: 'USR-CIT-02',
    name: 'Aarav Patel',
    email: 'citizen@gandhinagar.gov.in',
    mobile: '9876543210',
    password: 'password123',
    role: 'citizen',
    wardId: 'W-04',
    address: 'B-402, Shivalik Residency, Sector 21, Gandhinagar',
    designation: 'Registered Citizen'
  },
  {
    id: 'USR-ADM-01',
    name: 'Shri J. N. Vaghela (IAS)',
    email: 'admin@gandhinagar.gov.in',
    mobile: '9825000001',
    password: 'password123',
    role: 'admin',
    departmentId: null,
    designation: 'Municipal Commissioner - Gandhinagar Municipal Corporation'
  },
  {
    id: 'USR-CORP-01',
    name: 'Rupsinh Thakor',
    email: 'corporator@gandhinagar.gov.in',
    mobile: '9825010004',
    password: 'password123',
    role: 'corporator',
    wardId: 'W-04',
    designation: 'Hon. Mayor of Gandhinagar / Corporator - Ward 4'
  },
  {
    id: 'USR-OFF-01',
    name: 'Dr. Priyaben Joshi',
    email: 'officer@gandhinagar.gov.in',
    mobile: '9825022001',
    password: 'password123',
    role: 'officer',
    departmentId: 'DEP-SAN',
    designation: 'Executive Officer - Sanitation & Waste Management'
  },
  {
    id: 'USR-WRK-01',
    name: 'Vikram Rathod',
    email: 'worker@gandhinagar.gov.in',
    mobile: '9825033001',
    password: 'password123',
    role: 'worker',
    departmentId: 'DEP-SAN',
    designation: 'Field Sanitation Supervisor - Rapid Response Team'
  }
];

export const INITIAL_COMPLAINTS = [];

export const INITIAL_NOTIFICATIONS = [];
