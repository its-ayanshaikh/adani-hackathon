// LocalStorage utility functions for Teams, Employees, and Technicians

// Types
export interface Team {
  id: string;
  name: string;
  color: string;
  members: { id: string; name: string; role: string; avatar: string }[];
  createdAt: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

export interface Technician {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  teamId: string;
  teamName: string;
  status: 'available' | 'busy' | 'off-duty';
  completedJobs: number;
  rating: number;
  joinDate: string;
}

// Keys
const TEAMS_KEY = 'odoo_teams';
const EMPLOYEES_KEY = 'odoo_employees';
const TECHNICIANS_KEY = 'odoo_technicians';

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// ==================== TEAMS ====================

// Default teams for initial data
const defaultTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Mechanics',
    color: '#3B82F6',
    members: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'team-2',
    name: 'Electricians',
    color: '#F59E0B',
    members: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'team-3',
    name: 'HVAC Team',
    color: '#10B981',
    members: [],
    createdAt: new Date().toISOString(),
  },
];

export const getTeams = (): Team[] => {
  const data = localStorage.getItem(TEAMS_KEY);
  if (!data) {
    // Initialize with default teams
    localStorage.setItem(TEAMS_KEY, JSON.stringify(defaultTeams));
    return defaultTeams;
  }
  return JSON.parse(data);
};

export const getTeamById = (id: string): Team | undefined => {
  const teams = getTeams();
  return teams.find((t) => t.id === id);
};

export const addTeam = (team: Omit<Team, 'id' | 'createdAt'>): Team => {
  const teams = getTeams();
  const newTeam: Team = {
    ...team,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  teams.push(newTeam);
  localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
  return newTeam;
};

export const updateTeam = (id: string, updates: Partial<Team>): Team | null => {
  const teams = getTeams();
  const index = teams.findIndex((t) => t.id === id);
  if (index === -1) return null;
  teams[index] = { ...teams[index], ...updates };
  localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
  return teams[index];
};

export const deleteTeam = (id: string): boolean => {
  const teams = getTeams();
  const filtered = teams.filter((t) => t.id !== id);
  if (filtered.length === teams.length) return false;
  localStorage.setItem(TEAMS_KEY, JSON.stringify(filtered));
  return true;
};

// ==================== EMPLOYEES ====================

export const getEmployees = (): Employee[] => {
  const data = localStorage.getItem(EMPLOYEES_KEY);
  if (!data) {
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify([]));
    return [];
  }
  return JSON.parse(data);
};

export const getEmployeeById = (id: string): Employee | undefined => {
  const employees = getEmployees();
  return employees.find((e) => e.id === id);
};

export const addEmployee = (employee: Omit<Employee, 'id' | 'joinDate'>): Employee => {
  const employees = getEmployees();
  const newEmployee: Employee = {
    ...employee,
    id: generateId(),
    joinDate: new Date().toISOString().split('T')[0],
  };
  employees.push(newEmployee);
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
  return newEmployee;
};

export const updateEmployee = (id: string, updates: Partial<Employee>): Employee | null => {
  const employees = getEmployees();
  const index = employees.findIndex((e) => e.id === id);
  if (index === -1) return null;
  employees[index] = { ...employees[index], ...updates };
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
  return employees[index];
};

export const deleteEmployee = (id: string): boolean => {
  const employees = getEmployees();
  const filtered = employees.filter((e) => e.id !== id);
  if (filtered.length === employees.length) return false;
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(filtered));
  return true;
};

// ==================== TECHNICIANS ====================

export const getTechnicians = (): Technician[] => {
  const data = localStorage.getItem(TECHNICIANS_KEY);
  if (!data) {
    localStorage.setItem(TECHNICIANS_KEY, JSON.stringify([]));
    return [];
  }
  return JSON.parse(data);
};

export const getTechnicianById = (id: string): Technician | undefined => {
  const technicians = getTechnicians();
  return technicians.find((t) => t.id === id);
};

export const addTechnician = (technician: Omit<Technician, 'id' | 'completedJobs' | 'rating' | 'joinDate'>): Technician => {
  const technicians = getTechnicians();
  const newTechnician: Technician = {
    ...technician,
    id: generateId(),
    completedJobs: 0,
    rating: 0,
    joinDate: new Date().toISOString().split('T')[0],
  };
  technicians.push(newTechnician);
  localStorage.setItem(TECHNICIANS_KEY, JSON.stringify(technicians));
  return newTechnician;
};

export const updateTechnician = (id: string, updates: Partial<Technician>): Technician | null => {
  const technicians = getTechnicians();
  const index = technicians.findIndex((t) => t.id === id);
  if (index === -1) return null;
  technicians[index] = { ...technicians[index], ...updates };
  localStorage.setItem(TECHNICIANS_KEY, JSON.stringify(technicians));
  return technicians[index];
};

export const deleteTechnician = (id: string): boolean => {
  const technicians = getTechnicians();
  const filtered = technicians.filter((t) => t.id !== id);
  if (filtered.length === technicians.length) return false;
  localStorage.setItem(TECHNICIANS_KEY, JSON.stringify(filtered));
  return true;
};

// ==================== EQUIPMENT CATEGORIES ====================

export interface EquipmentCategory {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const EQUIPMENT_CATEGORIES_KEY = 'odoo_equipment_categories';

export const getEquipmentCategories = (): EquipmentCategory[] => {
  const data = localStorage.getItem(EQUIPMENT_CATEGORIES_KEY);
  if (!data) {
    localStorage.setItem(EQUIPMENT_CATEGORIES_KEY, JSON.stringify([]));
    return [];
  }
  return JSON.parse(data);
};

export const getEquipmentCategoryById = (id: string): EquipmentCategory | undefined => {
  const categories = getEquipmentCategories();
  return categories.find((c) => c.id === id);
};

export const addEquipmentCategory = (category: Omit<EquipmentCategory, 'id' | 'createdAt'>): EquipmentCategory => {
  const categories = getEquipmentCategories();
  const newCategory: EquipmentCategory = {
    ...category,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  categories.push(newCategory);
  localStorage.setItem(EQUIPMENT_CATEGORIES_KEY, JSON.stringify(categories));
  return newCategory;
};

export const updateEquipmentCategory = (id: string, updates: Partial<EquipmentCategory>): EquipmentCategory | null => {
  const categories = getEquipmentCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  categories[index] = { ...categories[index], ...updates };
  localStorage.setItem(EQUIPMENT_CATEGORIES_KEY, JSON.stringify(categories));
  return categories[index];
};

export const deleteEquipmentCategory = (id: string): boolean => {
  const categories = getEquipmentCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) return false;
  localStorage.setItem(EQUIPMENT_CATEGORIES_KEY, JSON.stringify(filtered));
  return true;
};

// ==================== EQUIPMENT ====================

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  categoryId: string;
  categoryName: string;
  purchaseDate: string;
  warrantyPeriod: number; // in months
  location: string;
  employeeId: string;
  employeeName: string;
  teamId: string;
  teamName: string;
  technicianId: string;
  technicianName: string;
  status: 'operational' | 'maintenance' | 'out-of-order';
  createdAt: string;
}

const EQUIPMENT_KEY = 'odoo_equipment';

export const getEquipmentList = (): Equipment[] => {
  const data = localStorage.getItem(EQUIPMENT_KEY);
  if (!data) {
    localStorage.setItem(EQUIPMENT_KEY, JSON.stringify([]));
    return [];
  }
  return JSON.parse(data);
};

export const getEquipmentById = (id: string): Equipment | undefined => {
  const equipment = getEquipmentList();
  return equipment.find((e) => e.id === id);
};

export const addEquipment = (equipment: Omit<Equipment, 'id' | 'createdAt'>): Equipment => {
  const equipmentList = getEquipmentList();
  const newEquipment: Equipment = {
    ...equipment,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  equipmentList.push(newEquipment);
  localStorage.setItem(EQUIPMENT_KEY, JSON.stringify(equipmentList));
  return newEquipment;
};

export const updateEquipment = (id: string, updates: Partial<Equipment>): Equipment | null => {
  const equipmentList = getEquipmentList();
  const index = equipmentList.findIndex((e) => e.id === id);
  if (index === -1) return null;
  equipmentList[index] = { ...equipmentList[index], ...updates };
  localStorage.setItem(EQUIPMENT_KEY, JSON.stringify(equipmentList));
  return equipmentList[index];
};

export const deleteEquipment = (id: string): boolean => {
  const equipmentList = getEquipmentList();
  const filtered = equipmentList.filter((e) => e.id !== id);
  if (filtered.length === equipmentList.length) return false;
  localStorage.setItem(EQUIPMENT_KEY, JSON.stringify(filtered));
  return true;
};

// ==================== MAINTENANCE REQUESTS ====================

export type RequestStage = 'submitted' | 'in_progress' | 'repaired' | 'scrap';
export type RequestType = 'corrective' | 'preventive';
export type RequestPriority = 'low' | 'medium' | 'high';

export interface MaintenanceRequest {
  id: string;
  subject: string;
  description: string;
  equipmentId: string;
  equipmentName: string;
  type: RequestType;
  priority: RequestPriority;
  stage: RequestStage;
  teamId: string;
  teamName: string;
  technicianId: string;
  technicianName: string;
  scheduledDate?: string; // For preventive maintenance
  duration?: number; // Hours spent on repair
  completedAt?: string; // When repair was completed
  scrapNote?: string; // Note when equipment is scrapped
  createdAt: string;
  updatedAt: string;
}

const REQUESTS_KEY = 'odoo_requests';

export const stageLabels: Record<RequestStage, string> = {
  submitted: 'Submitted',
  in_progress: 'In Progress',
  repaired: 'Repaired',
  scrap: 'Scrapped',
};

export const getRequests = (): MaintenanceRequest[] => {
  const data = localStorage.getItem(REQUESTS_KEY);
  if (!data) {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify([]));
    return [];
  }
  return JSON.parse(data);
};

export const getRequestById = (id: string): MaintenanceRequest | undefined => {
  const requests = getRequests();
  return requests.find((r) => r.id === id);
};

export const addRequest = (request: Omit<MaintenanceRequest, 'id' | 'stage' | 'createdAt' | 'updatedAt'>): MaintenanceRequest => {
  const requests = getRequests();
  const newRequest: MaintenanceRequest = {
    ...request,
    id: generateId(),
    stage: 'submitted', // Default status
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  requests.push(newRequest);
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  
  // Update equipment status to maintenance
  if (request.equipmentId) {
    updateEquipment(request.equipmentId, { status: 'maintenance' });
  }
  
  return newRequest;
};

export const updateRequest = (id: string, updates: Partial<MaintenanceRequest>): MaintenanceRequest | null => {
  const requests = getRequests();
  const index = requests.findIndex((r) => r.id === id);
  if (index === -1) return null;
  
  const oldRequest = requests[index];
  
  // Add completedAt timestamp when moving to repaired
  if (updates.stage === 'repaired' && !updates.completedAt) {
    updates.completedAt = new Date().toISOString();
  }
  
  requests[index] = { 
    ...requests[index], 
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  
  // Update equipment status based on request stage
  if (updates.stage && oldRequest.equipmentId) {
    let equipmentStatus: Equipment['status'] = 'maintenance';
    
    if (updates.stage === 'repaired') {
      equipmentStatus = 'operational';
    } else if (updates.stage === 'scrap') {
      equipmentStatus = 'out-of-order';
    } else {
      equipmentStatus = 'maintenance';
    }
    
    updateEquipment(oldRequest.equipmentId, { status: equipmentStatus });
  }
  
  return requests[index];
};

export const deleteRequest = (id: string): boolean => {
  const requests = getRequests();
  const filtered = requests.filter((r) => r.id !== id);
  if (filtered.length === requests.length) return false;
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(filtered));
  return true;
};

export const updateRequestStage = (id: string, stage: RequestStage): MaintenanceRequest | null => {
  return updateRequest(id, { stage });
};

