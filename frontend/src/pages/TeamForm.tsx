import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Users, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getTeamById, addTeam, updateTeam, Team } from '@/lib/localStorage';

const colorOptions = [
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

interface TeamFormData {
  name: string;
  color: string;
}

export default function TeamForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TeamFormData>({
    name: '',
    color: colorOptions[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      const team = getTeamById(id);
      if (team) {
        setFormData({
          name: team.name,
          color: team.color,
        });
      }
    }
  }, [id, isEdit]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Team name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (isEdit && id) {
        updateTeam(id, {
          name: formData.name,
          color: formData.color,
        });
      } else {
        addTeam({
          name: formData.name,
          color: formData.color,
          members: [],
        });
      }

      toast({
        title: isEdit ? 'Team updated' : 'Team added',
        description: `${formData.name} has been ${isEdit ? 'updated' : 'created'} successfully.`,
      });

      navigate('/teams');
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

  const handleChange = (field: keyof TeamFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate('/teams')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{isEdit ? 'Edit Team' : 'Add New Team'}</h1>
            <p className="text-muted-foreground text-sm">
              {isEdit ? 'Update team information' : 'Create a new maintenance team'}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          {/* Preview Section */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 flex items-center gap-4 border-b border-border">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: formData.color + '30' }}
            >
              <Users className="w-8 h-8" style={{ color: formData.color }} />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{formData.name || 'New Team'}</h2>
              <p className="text-sm text-muted-foreground">0 members</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Team Name */}
            <div className="mb-6">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Enter team name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
            </div>

            {/* Team Color */}
            <div className="mb-8">
              <Label className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4" />
                Team Color
              </Label>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleChange('color', color)}
                    className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${
                      formData.color === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Button type="submit" disabled={isLoading} className="min-w-[140px]">
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEdit ? 'Save Changes' : 'Create Team'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/teams')}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
