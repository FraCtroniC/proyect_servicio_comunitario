import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error en la aplicación:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-mist px-4">
          <div className="max-w-md rounded-2xl border border-line bg-paper p-8 text-center shadow-card">
            <h1 className="font-display text-2xl font-semibold text-ink">Error al cargar</h1>
            <p className="mt-3 text-sm text-slate">Recargue la página. Si persiste, limpie el almacenamiento del sitio.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary mt-6 w-full"
            >
              Recargar
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
