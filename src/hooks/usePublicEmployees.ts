import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type Tables } from '@/integrations/supabase/types';

type PublicEmployee = Tables<'employees_public'>;

export const usePublicEmployees = () => {
  const [employees, setEmployees] = useState<PublicEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicEmployees();
  }, []);

  const fetchPublicEmployees = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('employees_public')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching public employees:', err);
      setError('Fehler beim Laden der Mitarbeiter');
    } finally {
      setIsLoading(false);
    }
  };

  return { employees, isLoading, error, refetch: fetchPublicEmployees };
};