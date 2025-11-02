import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { type Tables } from '@/integrations/supabase/types';

type PublicEmployee = Tables<'employees_public'>;

const fetchPublicEmployees = async () => {
  const { data, error } = await supabase
    .from('employees_public')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const usePublicEmployees = () => {
  const { data: employees = [], isLoading, error, refetch } = useQuery({
    queryKey: ['public-employees'],
    queryFn: fetchPublicEmployees,
    staleTime: 10 * 60 * 1000,
  });

  return {
    employees,
    isLoading,
    error: error ? 'Fehler beim Laden der Mitarbeiter' : null,
    refetch
  };
};
