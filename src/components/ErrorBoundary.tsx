import React from "react";

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: any };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error } as State;
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("App crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h1>Ein Fehler ist aufgetreten</h1>
          <p>Die Anwendung konnte nicht geladen werden. Details stehen in der Konsole.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
