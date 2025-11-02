import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, FileText, Plus, Shield, Home, Image, ClipboardList, Inbox } from "lucide-react";
import { EmployeeManager } from "./EmployeeManager";
import { CaseStudyManager } from "./CaseStudyManager";
import { UserManager } from "./UserManager";
import { HomepageManager } from "./HomepageManager";
import { ImageManager } from "./ImageManager";
import { QuestionnaireManager } from "./QuestionnaireManager";
import { CVRequestManager } from "./CVRequestManager";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("homepage");

  return (
    <div className="min-h-screen bg-background pt-20 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Startseite, Case-Studies, Berater und Umfragen verwalten</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("images")}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-12 h-12 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center hover:border-primary transition-colors">
                <Image className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="text-xs text-muted-foreground">Bilder</span>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-12 h-12 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center hover:border-primary transition-colors">
                <Shield className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="text-xs text-muted-foreground">Benutzer</span>
            </button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="homepage" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Startseite
            </TabsTrigger>
            <TabsTrigger value="casestudies" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Case-Studies
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Berater
            </TabsTrigger>
            <TabsTrigger value="questionnaires" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Umfragen
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Inbox className="w-4 h-4" />
              Anfragen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="homepage" className="space-y-6">
            <HomepageManager />
          </TabsContent>

          <TabsContent value="casestudies" className="space-y-6">
            <CaseStudyManager />
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            <EmployeeManager />
          </TabsContent>

          <TabsContent value="questionnaires" className="space-y-6">
            <QuestionnaireManager />
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <CVRequestManager />
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <ImageManager />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};