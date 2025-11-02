import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: Error; errorInfo?: React.ErrorInfo };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error } as State;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App crashed:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-destructive/10 p-3">
                  <AlertTriangle className="w-12 h-12 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-2xl">Ein Fehler ist aufgetreten</CardTitle>
              <CardDescription>
                Die Anwendung konnte nicht korrekt geladen werden. Bitte versuchen Sie es erneut.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.state.error && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Fehlerdetails:</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                <p>Wenn dieser Fehler weiterhin auftritt:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Leeren Sie Ihren Browser-Cache</li>
                  <li>Aktualisieren Sie die Seite</li>
                  <li>Kontaktieren Sie uns, falls das Problem bestehen bleibt</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 justify-center">
              <Button onClick={this.handleReset} variant="default">
                <RefreshCw className="w-4 h-4 mr-2" />
                Seite neu laden
              </Button>
              <Button onClick={this.handleGoHome} variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Zur Startseite
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
