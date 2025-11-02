import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type Tables } from '@/integrations/supabase/types';

type CaseStudyDB = Tables<'case_studies'>;

export const useCaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudyDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: false });

      if (error) throw error;
      setCaseStudies(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching case studies:', err);
      setError('Fehler beim Laden der Use-Cases');
    } finally {
      setIsLoading(false);
    }
  };

  return { caseStudies, isLoading, error, refetch: fetchCaseStudies };
};