import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// App Pages
import Dashboard from "./pages/Dashboard";
import EquipmentList from "./pages/EquipmentList";
import EquipmentDetail from "./pages/EquipmentDetail";
import RequestList from "./pages/RequestList";
import RequestDetail from "./pages/RequestDetail";
import NewRequest from "./pages/NewRequest";
import TeamsList from "./pages/TeamsList";
import TeamDetail from "./pages/TeamDetail";
import TeamForm from "./pages/TeamForm";
import CalendarView from "./pages/CalendarView";
import NotFound from "./pages/NotFound";

// User Management Pages
import EmployeeList from "./pages/users/EmployeeList";
import EmployeeForm from "./pages/users/EmployeeForm";
import TechnicianList from "./pages/users/TechnicianList";
import TechnicianForm from "./pages/users/TechnicianForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/equipment" element={<EquipmentList />} />
              <Route path="/equipment/:id" element={<EquipmentDetail />} />
              <Route path="/requests" element={<RequestList />} />
              <Route path="/requests/new" element={<NewRequest />} />
              <Route path="/requests/:id" element={<RequestDetail />} />
              <Route path="/teams" element={<TeamsList />} />
              <Route path="/teams/add" element={<TeamForm />} />
              <Route path="/teams/edit/:id" element={<TeamForm />} />
              <Route path="/teams/:id" element={<TeamDetail />} />
              <Route path="/calendar" element={<CalendarView />} />
              
              {/* User Management Routes */}
              <Route path="/users/employees" element={<EmployeeList />} />
              <Route path="/users/employees/add" element={<EmployeeForm />} />
              <Route path="/users/employees/edit/:id" element={<EmployeeForm />} />
              <Route path="/users/technicians" element={<TechnicianList />} />
              <Route path="/users/technicians/add" element={<TechnicianForm />} />
              <Route path="/users/technicians/edit/:id" element={<TechnicianForm />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
