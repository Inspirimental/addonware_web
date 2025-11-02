import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { type Tables } from '@/integrations/supabase/types';

type Employee = Tables<'employees'>;

export const useProfile = () => {
  const { user, profile } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.employee_id) {
      fetchEmployeeProfile();
    } else {
      setEmployee(null);
      setLoading(false);
    }
  }, [profile?.employee_id]);

  const fetchEmployeeProfile = async () => {
    if (!profile?.employee_id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', profile.employee_id)
        .single();

      if (error) throw error;
      setEmployee(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching employee profile:', err);
      setError('Fehler beim Laden des Profils');
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (updates: Partial<Employee>) => {
    if (!employee?.id) throw new Error('Kein Mitarbeiterprofil gefunden');

    // Employees cannot update their email or name
    const restrictedFields = ['email', 'name'];
    if (!profile || profile.role !== 'admin') {
      restrictedFields.forEach(field => {
        if (field in updates) {
          delete updates[field as keyof typeof updates];
        }
      });
    }

    const { data, error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', employee.id)
      .select()
      .single();

    if (error) throw error;
    setEmployee(data);
    return data;
  };

  const linkToEmployee = async (employeeId: string) => {
    if (!user?.id) throw new Error('Nicht angemeldet');

    const { error } = await supabase
      .from('profiles')
      .update({ employee_id: employeeId })
      .eq('id', user.id);

    if (error) throw error;
    
    // Refetch profile
    return fetchEmployeeProfile();
  };

  return {
    employee,
    loading,
    error,
    updateEmployee,
    linkToEmployee,
    refetch: fetchEmployeeProfile,
  };
};