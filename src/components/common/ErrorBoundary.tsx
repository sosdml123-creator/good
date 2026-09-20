import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[App ErrorBoundary] Uncaught runtime error:', error, errorInfo);
  }

  private handleReload = () => {
    try {
      window.location.reload();
    } catch {
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#F8F9FA] text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4 shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1.5">
            일시적인 오류가 발생했습니다
          </h2>
          <p className="text-xs text-gray-500 max-w-[280px] mb-6 leading-relaxed">
            화면을 불러오는 도중 문제가 발생했습니다.<br />
            아래 버튼을 눌러 다시 시작해 주세요.
          </p>
          <button
            onClick={this.handleReload}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>앱 다시 불러오기</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
