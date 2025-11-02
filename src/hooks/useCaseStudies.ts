import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { type Tables } from '@/integrations/supabase/types';

type CaseStudyDB = Tables<'case_studies'>;

const fetchCaseStudies = async () => {
  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('is_active', true)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const useCaseStudies = () => {
  const { data: caseStudies = [], isLoading, error, refetch } = useQuery({
    queryKey: ['case-studies'],
    queryFn: fetchCaseStudies,
    staleTime: 10 * 60 * 1000,
  });

  return {
    caseStudies,
    isLoading,
    error: error ? 'Fehler beim Laden der Use-Cases' : null,
    refetch
  };
};
