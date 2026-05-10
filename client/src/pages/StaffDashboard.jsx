import { AlertTriangle, BarChart3, Bell, CheckCircle2, ClipboardList, Clock, LogOut, Menu, Settings, X, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import UpdateTaskModal from '../components/UpdateTaskModal';

// Dashboard View Component
function DashboardView({ complaints }) {
  const staffStats = [
    { label: 'Assigned to Me', value: complaints.length, icon: ClipboardList },
    { label: 'In Progress', value: complaints.filter(c => c.status === 'In Progress').length, icon: AlertTriangle },
    { label: 'Completed', value: complaints.filter(c => c.status === 'Resolved').length, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {staffStats.map((stat, idx) => {
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
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Urgent Tasks
          </h3>
          <div className="space-y-3">
            {complaints.filter(c => c.priority === 'Critical' || c.priority === 'High').map(complaint => (
              <div key={complaint._id} className="border border-slate-700 rounded-lg p-3 bg-slate-700/30">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-white text-sm">{complaint.title}</p>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    complaint.priority === 'Critical' ? 'bg-red-900/50 text-red-200' : 'bg-orange-900/50 text-orange-200'
                  }`}>
                    {complaint.priority}
                  </span>
                </div>
                <p className="text-slate-400 text-xs mb-2">{complaint.location}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Due Soon
          </h3>
          <div className="space-y-3">
            {complaints.slice(0, 2).map(complaint => (
              <div key={complaint._id} className="border border-slate-700 rounded-lg p-3 bg-slate-700/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white text-sm">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                  <span className="text-blue-300 text-xs font-mono">{complaint._id.substring(18).toUpperCase()}</span>
                </div>
                <p className="text-slate-400 text-xs">{complaint.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Tasks View Component
function TasksView({ complaints, onUpdate }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-emerald-400" />
          My Assigned Tasks
        </h2>
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-slate-400">No tasks assigned to you.</td>
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
                      complaint.status === 'In Progress'
                        ? 'bg-blue-900/50 text-blue-200'
                        : complaint.status === 'Assigned'
                        ? 'bg-purple-900/50 text-purple-200'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {complaint.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm">
                  <button 
                    onClick={() => onUpdate(complaint)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Settings View Component
function SettingsView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Your department"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-slate-300">Email Notifications</label>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-slate-300">Task Reminders</label>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-slate-300">Priority Alerts</label>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 md:col-span-2">
        <h3 className="text-lg font-bold text-white mb-4">Password & Security</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="••••••••"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [complaints, setComplaints] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/staff/assigned');
      setComplaints(data);
    } catch (error) {
      console.error('Failed to fetch assigned complaints', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

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
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">CC</span>
              </div>
              <h1 className="text-xl font-bold text-white hidden sm:block">CampusCare Staff</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-300">
              <Bell className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-white font-medium text-sm">{user?.name}</p>
              <p className="text-slate-400 text-xs capitalize bg-teal-900/50 px-2 py-1 rounded">Staff</p>
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
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Staff Menu</p>
              <button
                onClick={() => setActiveMenu('dashboard')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3 text-sm font-medium ${
                  activeMenu === 'dashboard'
                    ? 'bg-teal-600 text-white border border-teal-400'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                My Dashboard
              </button>
              <button
                onClick={() => setActiveMenu('tasks')}
                className={`w-full text-left px-4 py-2 mt-2 rounded-lg transition-colors flex items-center gap-3 text-sm font-medium ${
                  activeMenu === 'tasks'
                    ? 'bg-teal-600 text-white border border-teal-400'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}
              >
                <ClipboardList className="w-5 h-5" />
                My Tasks
              </button>
              <button
                onClick={() => setActiveMenu('settings')}
                className={`w-full text-left px-4 py-2 mt-2 rounded-lg transition-colors flex items-center gap-3 text-sm font-medium ${
                  activeMenu === 'settings'
                    ? 'bg-teal-600 text-white border border-teal-400'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}
              >
                <Settings className="w-5 h-5" />
                Settings
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Staff Info</p>
              <div className="px-4 py-3 bg-slate-700 rounded-lg">
                <p className="text-slate-300 text-sm">
                  <span className="font-semibold">{user?.name}</span>
                </p>
                <p className="text-slate-400 text-xs mt-1 capitalize">
                  Staff • {user?.department}
                </p>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Staff Dashboard 🔧</h1>
            <p className="text-slate-400 mt-2">
              {activeMenu === 'dashboard' && 'Overview of your tasks and assignments'}
              {activeMenu === 'tasks' && 'Manage all your assigned tasks'}
              {activeMenu === 'settings' && 'Manage your account and preferences'}
            </p>
          </div>

          {/* Dynamic Content */}
          {activeMenu === 'dashboard' && <DashboardView complaints={complaints} />}
          {activeMenu === 'tasks' && <TasksView complaints={complaints} onUpdate={(task) => setSelectedTask(task)} />}
          {activeMenu === 'settings' && <SettingsView />}
        </main>
      </div>

      {selectedTask && (
        <UpdateTaskModal 
          complaint={selectedTask} 
          onClose={() => setSelectedTask(null)}
          onSucceed={() => {
            setSelectedTask(null);
            fetchComplaints();
          }}
        />
      )}
    </div>
  );
}
