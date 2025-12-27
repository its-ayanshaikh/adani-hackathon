import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, User, Mail, Phone, Wrench, Users } from 'lucide-react';
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
import { Avatar } from '@/components/Avatar';
import { getTeams, getTechnicianById, addTechnician, updateTechnician, Team } from '@/lib/localStorage';

interface TechnicianFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  teamId: string;
  status: 'available' | 'busy' | 'off-duty';
}

const specializations = ['Electrical', 'Mechanical', 'HVAC', 'Plumbing', 'IT Support', 'General'];

export default function TechnicianForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [formData, setFormData] = useState<TechnicianFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    teamId: '',
    status: 'available',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load teams from localStorage
    const loadedTeams = getTeams();
    setTeams(loadedTeams);

    if (isEdit && id) {
      const technician = getTechnicianById(id);
      if (technician) {
        setFormData({
          firstName: technician.firstName,
          lastName: technician.lastName,
          email: technician.email,
          phone: technician.phone,
          specialization: technician.specialization,
          teamId: technician.teamId,
          status: technician.status,
        });
      }
    }
  }, [id, isEdit]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }
    if (!formData.specialization) newErrors.specialization = 'Specialization is required';
    if (!formData.teamId) newErrors.teamId = 'Team is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const selectedTeam = teams.find((t) => t.id === formData.teamId);
      const teamName = selectedTeam?.name || '';

      if (isEdit && id) {
        updateTechnician(id, {
          ...formData,
          teamName,
        });
      } else {
        addTechnician({
          ...formData,
          teamName,
        });
      }

      toast({
        title: isEdit ? 'Technician updated' : 'Technician added',
        description: `${formData.firstName} ${formData.lastName} has been ${isEdit ? 'updated' : 'added'} successfully.`,
      });

      navigate('/users/technicians');
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

  const handleChange = (field: keyof TechnicianFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const getInitials = () => {
    const first = formData.firstName?.[0] || '';
    const last = formData.lastName?.[0] || '';
    return (first + last).toUpperCase() || 'TC';
  };

  const getTeamName = () => {
    return teams.find((t) => t.id === formData.teamId)?.name || 'Team';
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'available':
        return { color: 'bg-green-500', label: 'Available' };
      case 'busy':
        return { color: 'bg-orange-500', label: 'Busy' };
      case 'off-duty':
        return { color: 'bg-gray-400', label: 'Off Duty' };
      default:
        return { color: 'bg-gray-400', label: status };
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate('/users/technicians')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{isEdit ? 'Edit Technician' : 'Add New Technician'}</h1>
            <p className="text-muted-foreground text-sm">
              {isEdit ? 'Update technician information' : 'Fill in the details to add a new technician'}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          {/* Avatar Section */}
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-6 flex items-center gap-4 border-b border-border">
            <Avatar initials={getInitials()} size="lg" className="w-16 h-16 text-xl" />
            <div>
              <h2 className="font-semibold text-lg">
                {formData.firstName || formData.lastName
                  ? `${formData.firstName} ${formData.lastName}`
                  : 'New Technician'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {formData.specialization || 'Specialization'} • {getTeamName()}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className={`pl-10 ${errors.firstName ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className={`pl-10 ${errors.lastName ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@company.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="+1 234 567 890"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className={`pl-10 ${errors.phone ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Work Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <div className="relative">
                    <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select
                      value={formData.specialization}
                      onValueChange={(value) => handleChange('specialization', value)}
                    >
                      <SelectTrigger className={`pl-10 ${errors.specialization ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializations.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.specialization && (
                    <p className="text-xs text-destructive">{errors.specialization}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamId">Team</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select value={formData.teamId} onValueChange={(value) => handleChange('teamId', value)}>
                      <SelectTrigger className={`pl-10 ${errors.teamId ? 'border-destructive' : ''}`}>
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.teamId && <p className="text-xs text-destructive">{errors.teamId}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleChange('status', value as 'available' | 'busy' | 'off-duty')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['available', 'busy', 'off-duty'].map((status) => {
                        const config = getStatusConfig(status);
                        return (
                          <SelectItem key={status} value={status}>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${config.color}`} />
                              {config.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Button type="submit" disabled={isLoading} className="min-w-[140px]">
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEdit ? 'Save Changes' : 'Add Technician'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/users/technicians')}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
