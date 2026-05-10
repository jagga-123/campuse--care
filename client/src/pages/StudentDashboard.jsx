import { AlertTriangle, BarChart3, CheckCircle2, ClipboardList, LogOut, Menu, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import RaiseComplaintForm from '../components/RaiseComplaintForm';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/complaints/mine');
      setComplaints(data);
    } catch (error) {
      console.error('Failed to fetch complaints', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const stats = [
    { label: 'My Complaints', value: complaints.length, icon: ClipboardList },
    { label: 'Resolved', value: complaints.filter(c => c.status === 'Resolved').length, icon: CheckCircle2 },
    { label: 'Pending', value: complaints.filter(c => c.status !== 'Resolved').length, icon: AlertTriangle },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">CC</span>
              </div>
              <h1 className="text-xl font-bold text-white hidden sm:block">CampusCare</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-white font-medium text-sm">{user?.name}</p>
              <p className="text-slate-400 text-xs capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-slate-800 border-r border-slate-700 transition-all duration-300 overflow-hidden lg:block`}
        >
          <nav className="p-6 space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Menu</p>
              <button className="w-full text-left px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-3 text-sm font-medium">
                <BarChart3 className="w-5 h-5" />
                My Dashboard
              </button>
              <button 
                onClick={() => setShowForm(true)}
                className="w-full text-left px-4 py-2 mt-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-3 text-sm font-medium"
              >
                <Plus className="w-5 h-5" />
                Raise Complaint
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Profile</p>
              <div className="px-4 py-3 bg-slate-700 rounded-lg">
                <p className="text-slate-300 text-sm">
                  <span className="font-semibold">{user?.name}</span>
                </p>
                <p className="text-slate-400 text-xs mt-1 capitalize">
                  {user?.role} • {user?.department}
                </p>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Welcome, {user?.name}! 👋</h1>
            <p className="text-slate-400 mt-2">Track your complaints and stay updated on their progress</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* My Complaints */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-cyan-400" />
                My Complaints
              </h2>
              <button 
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                New
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-700/50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-slate-400">Loading complaints...</td>
                    </tr>
                  ) : complaints.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-slate-400">No complaints found. Raise a new one!</td>
                    </tr>
                  ) : complaints.map((complaint) => (
                    <tr
                      key={complaint._id}
                      className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-300 font-mono">{complaint._id.substring(18).toUpperCase()}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        <p className="font-medium">{complaint.title}</p>
                        <p className="text-slate-400 text-xs mt-1">{complaint.location}</p>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            complaint.priority === 'Critical'
                              ? 'bg-red-900/50 text-red-200'
                              : complaint.priority === 'High'
                              ? 'bg-orange-900/50 text-orange-200'
                              : 'bg-yellow-900/50 text-yellow-200'
                          }`}
                        >
                          {complaint.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            complaint.status === 'Resolved'
                              ? 'bg-green-900/50 text-green-200'
                              : 'bg-blue-900/50 text-blue-200'
                          }`}
                        >
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {showForm && (
        <RaiseComplaintForm 
          onClose={() => setShowForm(false)} 
          onSucceed={() => {
            setShowForm(false);
            fetchComplaints();
          }} 
        />
      )}
    </div>
  );
}
