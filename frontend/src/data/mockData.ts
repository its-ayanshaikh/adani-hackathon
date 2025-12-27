// GearGuard Mock Data

export type RequestStage = 'new' | 'in_progress' | 'repaired' | 'scrap';
export type RequestType = 'corrective' | 'preventive';

// User Authentication Data
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'technician';
  avatar: string;
  teamId?: string;
}

export const users: User[] = [
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'john@maintainx.com',
    password: 'john123',
    role: 'admin',
    avatar: 'JS',
    teamId: 'team-1',
  },
  {
    id: 'user-2',
    name: 'Mike Johnson',
    email: 'mike@maintainx.com',
    password: 'mike123',
    role: 'technician',
    avatar: 'MJ',
    teamId: 'team-1',
  },
  {
    id: 'user-3',
    name: 'Sarah Davis',
    email: 'sarah@maintainx.com',
    password: 'sarah123',
    role: 'manager',
    avatar: 'SD',
    teamId: 'team-2',
  },
  {
    id: 'user-5',
    name: 'Emily Brown',
    email: 'emily@maintainx.com',
    password: 'emily123',
    role: 'manager',
    avatar: 'EB',
    teamId: 'team-3',
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@maintainx.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'AD',
  },
];

// Helper to find user by credentials
export const findUserByCredentials = (email: string, password: string): User | undefined => {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
};

export const getUserById = (id: string): User | undefined => {
  return users.find(u => u.id === id);
};

export interface Team {
  id: string;
  name: string;
  color: string;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  category: string;
  department: string;
  location: string;
  assignedTo?: string;
  purchaseDate: string;
  warrantyExpiry: string;
  maintenanceTeamId: string;
  defaultTechnicianId?: string;
  status: 'active' | 'maintenance' | 'scrapped';
  openRequests: number;
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  description: string;
  equipmentId: string;
  type: RequestType;
  stage: RequestStage;
  priority: 'low' | 'medium' | 'high';
  scheduledDate?: string;
  dueDate?: string;
  createdAt: string;
  assignedToId?: string;
  teamId: string;
  duration?: number; // hours
  isOverdue: boolean;
}

// Teams
export const teams: Team[] = [
  {
    id: 'team-1',
    name: 'Mechanics',
    color: 'hsl(32, 95%, 52%)',
    members: [
      { id: 'user-1', name: 'John Smith', avatar: 'JS', role: 'Lead Mechanic' },
      { id: 'user-2', name: 'Mike Johnson', avatar: 'MJ', role: 'Mechanic' },
    ],
  },
  {
    id: 'team-2',
    name: 'Electricians',
    color: 'hsl(199, 89%, 48%)',
    members: [
      { id: 'user-3', name: 'Sarah Davis', avatar: 'SD', role: 'Lead Electrician' },
      { id: 'user-4', name: 'Tom Wilson', avatar: 'TW', role: 'Electrician' },
    ],
  },
  {
    id: 'team-3',
    name: 'IT Support',
    color: 'hsl(142, 76%, 36%)',
    members: [
      { id: 'user-5', name: 'Emily Brown', avatar: 'EB', role: 'IT Manager' },
      { id: 'user-6', name: 'Alex Chen', avatar: 'AC', role: 'IT Technician' },
    ],
  },
];

// Equipment categories
export const categories = [
  'CNC Machines',
  'Vehicles',
  'Computers',
  'HVAC Systems',
  'Production Lines',
  'Forklifts',
];

export const departments = [
  'Production',
  'Warehouse',
  'IT',
  'Administration',
  'Logistics',
];

// Equipment
export const equipment: Equipment[] = [
  {
    id: 'eq-1',
    name: 'CNC Machine A1',
    serialNumber: 'CNC-2023-001',
    category: 'CNC Machines',
    department: 'Production',
    location: 'Building A, Floor 1',
    purchaseDate: '2023-01-15',
    warrantyExpiry: '2026-01-15',
    maintenanceTeamId: 'team-1',
    defaultTechnicianId: 'user-1',
    status: 'active',
    openRequests: 2,
  },
  {
    id: 'eq-2',
    name: 'Delivery Truck #3',
    serialNumber: 'VEH-2022-003',
    category: 'Vehicles',
    department: 'Logistics',
    location: 'Parking Lot B',
    purchaseDate: '2022-06-20',
    warrantyExpiry: '2025-06-20',
    maintenanceTeamId: 'team-1',
    defaultTechnicianId: 'user-2',
    status: 'active',
    openRequests: 1,
  },
  {
    id: 'eq-3',
    name: 'Laptop - John Doe',
    serialNumber: 'IT-2024-045',
    category: 'Computers',
    department: 'IT',
    location: 'Office 204',
    assignedTo: 'John Doe',
    purchaseDate: '2024-02-10',
    warrantyExpiry: '2027-02-10',
    maintenanceTeamId: 'team-3',
    defaultTechnicianId: 'user-5',
    status: 'active',
    openRequests: 0,
  },
  {
    id: 'eq-4',
    name: 'HVAC Unit - Main Hall',
    serialNumber: 'HVAC-2021-012',
    category: 'HVAC Systems',
    department: 'Administration',
    location: 'Building A, Roof',
    purchaseDate: '2021-09-05',
    warrantyExpiry: '2024-09-05',
    maintenanceTeamId: 'team-2',
    defaultTechnicianId: 'user-3',
    status: 'maintenance',
    openRequests: 1,
  },
  {
    id: 'eq-5',
    name: 'Forklift FL-02',
    serialNumber: 'FL-2020-002',
    category: 'Forklifts',
    department: 'Warehouse',
    location: 'Warehouse Section C',
    purchaseDate: '2020-03-18',
    warrantyExpiry: '2023-03-18',
    maintenanceTeamId: 'team-1',
    defaultTechnicianId: 'user-1',
    status: 'active',
    openRequests: 0,
  },
  {
    id: 'eq-6',
    name: 'Assembly Line B',
    serialNumber: 'PROD-2019-002',
    category: 'Production Lines',
    department: 'Production',
    location: 'Building B, Main Floor',
    purchaseDate: '2019-11-22',
    warrantyExpiry: '2024-11-22',
    maintenanceTeamId: 'team-2',
    defaultTechnicianId: 'user-4',
    status: 'active',
    openRequests: 3,
  },
];

// Maintenance Requests
export const requests: MaintenanceRequest[] = [
  {
    id: 'req-1',
    subject: 'Leaking Oil',
    description: 'Oil leak detected near the hydraulic system. Needs immediate attention.',
    equipmentId: 'eq-1',
    type: 'corrective',
    stage: 'new',
    priority: 'high',
    dueDate: '2024-12-28',
    createdAt: '2024-12-26T09:00:00',
    teamId: 'team-1',
    isOverdue: false,
  },
  {
    id: 'req-2',
    subject: 'Routine Checkup',
    description: 'Monthly preventive maintenance for CNC Machine A1.',
    equipmentId: 'eq-1',
    type: 'preventive',
    stage: 'new',
    priority: 'medium',
    scheduledDate: '2024-12-30',
    createdAt: '2024-12-20T10:00:00',
    teamId: 'team-1',
    isOverdue: false,
  },
  {
    id: 'req-3',
    subject: 'Brake System Check',
    description: 'Driver reported unusual brake noise. Safety inspection required.',
    equipmentId: 'eq-2',
    type: 'corrective',
    stage: 'in_progress',
    priority: 'high',
    dueDate: '2024-12-27',
    createdAt: '2024-12-25T14:00:00',
    assignedToId: 'user-2',
    teamId: 'team-1',
    isOverdue: true,
  },
  {
    id: 'req-4',
    subject: 'Air Filter Replacement',
    description: 'Scheduled replacement of air filters as per maintenance plan.',
    equipmentId: 'eq-4',
    type: 'preventive',
    stage: 'in_progress',
    priority: 'low',
    scheduledDate: '2024-12-27',
    createdAt: '2024-12-22T08:00:00',
    assignedToId: 'user-3',
    teamId: 'team-2',
    isOverdue: false,
  },
  {
    id: 'req-5',
    subject: 'Motor Overheating',
    description: 'Main motor temperature exceeds normal range. Cooling system check needed.',
    equipmentId: 'eq-6',
    type: 'corrective',
    stage: 'repaired',
    priority: 'high',
    dueDate: '2024-12-24',
    createdAt: '2024-12-23T11:00:00',
    assignedToId: 'user-4',
    teamId: 'team-2',
    duration: 4,
    isOverdue: false,
  },
  {
    id: 'req-6',
    subject: 'Conveyor Belt Alignment',
    description: 'Belt misalignment causing product jams. Realignment required.',
    equipmentId: 'eq-6',
    type: 'corrective',
    stage: 'new',
    priority: 'medium',
    dueDate: '2024-12-29',
    createdAt: '2024-12-26T15:00:00',
    teamId: 'team-1',
    isOverdue: false,
  },
  {
    id: 'req-7',
    subject: 'Safety Inspection',
    description: 'Annual safety inspection for assembly line equipment.',
    equipmentId: 'eq-6',
    type: 'preventive',
    stage: 'new',
    priority: 'medium',
    scheduledDate: '2025-01-05',
    createdAt: '2024-12-20T09:00:00',
    teamId: 'team-2',
    isOverdue: false,
  },
  {
    id: 'req-8',
    subject: 'Old Printer - Beyond Repair',
    description: 'Printer has failed multiple times. Recommended for scrap.',
    equipmentId: 'eq-3',
    type: 'corrective',
    stage: 'scrap',
    priority: 'low',
    createdAt: '2024-12-15T10:00:00',
    assignedToId: 'user-5',
    teamId: 'team-3',
    duration: 2,
    isOverdue: false,
  },
];

// Helper functions
export const getTeamById = (id: string) => teams.find(t => t.id === id);
export const getEquipmentById = (id: string) => equipment.find(e => e.id === id);
export const getMemberById = (id: string) => {
  for (const team of teams) {
    const member = team.members.find(m => m.id === id);
    if (member) return member;
  }
  return undefined;
};

export const getRequestsByStage = (stage: RequestStage) => 
  requests.filter(r => r.stage === stage);

export const getRequestsByEquipment = (equipmentId: string) =>
  requests.filter(r => r.equipmentId === equipmentId);

export const getPreventiveRequests = () =>
  requests.filter(r => r.type === 'preventive');

export const stageLabels: Record<RequestStage, string> = {
  new: 'New',
  in_progress: 'In Progress',
  repaired: 'Repaired',
  scrap: 'Scrap',
};

export const stageColors: Record<RequestStage, string> = {
  new: 'bg-info',
  in_progress: 'bg-primary',
  repaired: 'bg-success',
  scrap: 'bg-muted-foreground',
};
