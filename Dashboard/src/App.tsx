import { StatusDashboard } from './components/StatusDashboard';
import './styles/dashboard.css';

export default function App() {
  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-br-page from-slate-950 via-blue-950 to-slate-900 p-10">
      <StatusDashboard />
    </div>
  );
}
