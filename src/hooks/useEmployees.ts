import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type Tables } from '@/integrations/supabase/types';

type Employee = Tables<'employees'>;

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setEmployees(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Fehler beim Laden der Mitarbeiter');
    } finally {
      setIsLoading(false);
    }
  };

  return { employees, isLoading, error, refetch: fetchEmployees };
};