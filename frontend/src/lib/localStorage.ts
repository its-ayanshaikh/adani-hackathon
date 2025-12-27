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
