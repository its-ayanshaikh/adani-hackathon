import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Package, Hash, Calendar, Clock, MapPin, User, Users, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  getEquipmentById,
  addEquipment,
  updateEquipment,
  getEquipmentCategories,
  getEmployees,
  getTeams,
  getTechnicians,
  EquipmentCategory,
  Employee,
  Team,
  Technician,
} from '@/lib/localStorage';

interface EquipmentFormData {
  name: string;
  serialNumber: string;
  categoryId: string;
  purchaseDate: string;
  warrantyPeriod: number;
  location: string;
  employeeId: string;
  teamId: string;
  technicianId: string;
  status: 'operational' | 'maintenance' | 'out-of-order';
}

export default function EquipmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [filteredTechnicians, setFilteredTechnicians] = useState<Technician[]>([]);

  const [formData, setFormData] = useState<EquipmentFormData>({
    name: '',
    serialNumber: '',
    categoryId: '',
    purchaseDate: '',
    warrantyPeriod: 12,
    location: '',
    employeeId: '',
    teamId: '',
    technicianId: '',
    status: 'operational',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load dropdown data
    setCategories(getEquipmentCategories());
    setEmployees(getEmployees());
    setTeams(getTeams());
    setTechnicians(getTechnicians());

    if (isEdit && id) {
      const equipment = getEquipmentById(id);
      if (equipment) {
        setFormData({
          name: equipment.name,
          serialNumber: equipment.serialNumber,
          categoryId: equipment.categoryId,
          purchaseDate: equipment.purchaseDate,
          warrantyPeriod: equipment.warrantyPeriod,
          location: equipment.location,
          employeeId: equipment.employeeId,
          teamId: equipment.teamId,
          technicianId: equipment.technicianId,
          status: equipment.status,
        });
      }
    }
  }, [id, isEdit]);

  // Filter technicians based on selected team
  useEffect(() => {
    if (formData.teamId) {
      const teamTechnicians = technicians.filter((t) => t.teamId === formData.teamId);
      setFilteredTechnicians(teamTechnicians);
      // Reset technician if not in current team
      if (!teamTechnicians.find((t) => t.id === formData.technicianId)) {
        setFormData((prev) => ({ ...prev, technicianId: '' }));
      }
    } else {
      setFilteredTechnicians([]);
      setFormData((prev) => ({ ...prev, technicianId: '' }));
    }
  }, [formData.teamId, technicians]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Equipment name is required';
    if (!formData.serialNumber.trim()) newErrors.serialNumber = 'Serial number is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.purchaseDate) newErrors.purchaseDate = 'Purchase date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const selectedCategory = categories.find((c) => c.id === formData.categoryId);
      const selectedEmployee = employees.find((e) => e.id === formData.employeeId);
      const selectedTeam = teams.find((t) => t.id === formData.teamId);
      const selectedTechnician = technicians.find((t) => t.id === formData.technicianId);

      const equipmentData = {
        name: formData.name,
        serialNumber: formData.serialNumber,
        categoryId: formData.categoryId,
        categoryName: selectedCategory?.name || '',
        purchaseDate: formData.purchaseDate,
        warrantyPeriod: formData.warrantyPeriod,
        location: formData.location,
        employeeId: formData.employeeId,
        employeeName: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : '',
        teamId: formData.teamId,
        teamName: selectedTeam?.name || '',
        technicianId: formData.technicianId,
        technicianName: selectedTechnician ? `${selectedTechnician.firstName} ${selectedTechnician.lastName}` : '',
        status: formData.status,
      };

      if (isEdit && id) {
        updateEquipment(id, equipmentData);
      } else {
        addEquipment(equipmentData);
      }

      toast({
        title: isEdit ? 'Equipment updated' : 'Equipment added',
        description: `${formData.name} has been ${isEdit ? 'updated' : 'added'} successfully.`,
      });

      navigate('/equipment/list');
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof EquipmentFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate('/equipment/list')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{isEdit ? 'Edit Equipment' : 'Add New Equipment'}</h1>
            <p className="text-muted-foreground text-sm">
              {isEdit ? 'Update equipment information' : 'Fill in the details to add new equipment'}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          {/* Preview Section */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-6 flex items-center gap-4 border-b border-border">
            <div className="w-16 h-16 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{formData.name || 'New Equipment'}</h2>
              <p className="text-sm text-muted-foreground">
                {formData.serialNumber || 'Serial Number'} • {formData.location || 'Location'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Information */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Equipment Name</Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Enter equipment name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="serialNumber"
                      placeholder="Enter serial number"
                      value={formData.serialNumber}
                      onChange={(e) => handleChange('serialNumber', e.target.value)}
                      className={`pl-10 ${errors.serialNumber ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.serialNumber && <p className="text-xs text-destructive">{errors.serialNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <Select value={formData.categoryId} onValueChange={(value) => handleChange('categoryId', value)}>
                    <SelectTrigger className={errors.categoryId ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No categories - Create one first
                        </SelectItem>
                      ) : (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Enter location"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className={`pl-10 ${errors.location ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
                </div>
              </div>
            </div>

            {/* Purchase & Warranty */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Purchase & Warranty
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => handleChange('purchaseDate', e.target.value)}
                      className={`pl-10 ${errors.purchaseDate ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.purchaseDate && <p className="text-xs text-destructive">{errors.purchaseDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warrantyPeriod">Warranty Period (Months)</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="warrantyPeriod"
                      type="number"
                      min="0"
                      placeholder="Enter warranty period"
                      value={formData.warrantyPeriod}
                      onChange={(e) => handleChange('warrantyPeriod', parseInt(e.target.value) || 0)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          Operational
                        </div>
                      </SelectItem>
                      <SelectItem value="maintenance">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-500" />
                          Maintenance
                        </div>
                      </SelectItem>
                      <SelectItem value="out-of-order">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          Out of Order
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Assignment */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Assignment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Assigned to Employee</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={formData.employeeId} onValueChange={(value) => handleChange('employeeId', value)}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Not Assigned</SelectItem>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.firstName} {emp.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamId">Maintenance Team</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={formData.teamId} onValueChange={(value) => handleChange('teamId', value)}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Team</SelectItem>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technicianId">Assigned Technician</Label>
                  <div className="relative">
                    <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select
                      value={formData.technicianId}
                      onValueChange={(value) => handleChange('technicianId', value)}
                      disabled={!formData.teamId || formData.teamId === 'none'}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder={formData.teamId && formData.teamId !== 'none' ? 'Select technician' : 'Select a team first'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Not Assigned</SelectItem>
                        {filteredTechnicians.map((tech) => (
                          <SelectItem key={tech.id} value={tech.id}>
                            {tech.firstName} {tech.lastName} - {tech.specialization}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.teamId && formData.teamId !== 'none' && filteredTechnicians.length === 0 && (
                    <p className="text-xs text-muted-foreground">No technicians in this team</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Button type="submit" disabled={isLoading} className="min-w-[140px]">
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEdit ? 'Save Changes' : 'Add Equipment'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/equipment/list')}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
