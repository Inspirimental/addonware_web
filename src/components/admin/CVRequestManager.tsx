import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Download, Mail, Building2, Calendar, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface ContactRequest {
  id: string;
  employee_id: string;
  requester_name: string;
  requester_email: string;
  requester_organization: string;
  message: string;
  request_type: 'cv_download' | 'contact';
  created_at: string;
  employee?: {
    name: string;
    title: string;
  };
}

export const CVRequestManager = () => {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .select(`
          *,
          employee:employees_public(name, title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching contact requests:', error);
      toast({
        title: "Fehler",
        description: "Anfragen konnten nicht geladen werden",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRequestTypeInfo = (type: 'cv_download' | 'contact') => {
    if (type === 'cv_download') {
      return {
        icon: Download,
        label: 'CV-Download',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      };
    }
    return {
      icon: MessageSquare,
      label: 'Kontaktanfrage',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    };
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">Laden...</div>
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Anfragen</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Noch keine Anfragen vorhanden.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Anfragen ({requests.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => {
            const typeInfo = getRequestTypeInfo(request.request_type);
            const TypeIcon = typeInfo.icon;

            return (
              <div
                key={request.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <TypeIcon className="w-5 h-5 text-primary" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">
                            {request.employee?.name || 'Unbekannter Berater'}
                          </span>
                          <Badge variant="outline" className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                        </div>
                        {request.employee?.title && (
                          <span className="text-sm text-muted-foreground">
                            {request.employee.title}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium">{request.requester_name}</span>
                        <span className="text-muted-foreground"> • </span>
                        <a
                          href={`mailto:${request.requester_email}`}
                          className="text-primary hover:underline"
                        >
                          {request.requester_email}
                        </a>
                      </div>
                    </div>

                    {request.requester_organization && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span>{request.requester_organization}</span>
                      </div>
                    )}
                  </div>

                  {request.message && request.request_type === 'contact' && (
                    <div className="bg-muted/50 rounded-md p-3">
                      <p className="text-sm text-muted-foreground font-medium mb-1">Nachricht:</p>
                      <p className="text-sm whitespace-pre-wrap">{request.message}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(request.created_at), 'dd. MMMM yyyy, HH:mm', {
                        locale: de,
                      })} Uhr
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
