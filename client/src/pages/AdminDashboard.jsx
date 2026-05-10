import { AlertTriangle, BarChart3, CheckCircle2, ClipboardList, Edit2, LogOut, Menu, PieChart, Trash2, TrendingUp, UserPlus, Users, X, Map } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Analytics Component
function Analytics({ dashboardData }) {
  if (!dashboardData) return <div className="text-white">Loading analytics...</div>;

  const totalComplaints = dashboardData.openCount + dashboardData.resolvedCount;
  const categoryData = dashboardData.categoryBreakdown.map(cat => ({
    name: cat._id,
    count: cat.count,
    percentage: totalComplaints > 0 ? Math.round((cat.count / totalComplaints) * 100) : 0
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Complaints by Category */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Complaints by Category</h3>
          </div>
          <div className="space-y-4">
            {categoryData.length === 0 ? <p className="text-slate-400">No data available.</p> : categoryData.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-slate-300 text-sm">{item.name}</p>
                  <p className="text-white font-semibold">{item.count}</p>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <p className="text-slate-400 text-xs mt-1">{item.percentage}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            System Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-900/30 border border-blue-900 rounded-lg p-4">
              <p className="text-blue-300 text-sm mb-2">Open Issues</p>
              <p className="text-3xl font-bold text-blue-200">{dashboardData.openCount}</p>
              <p className="text-blue-400 text-xs mt-2">Needs attention</p>
            </div>
            <div className="bg-green-900/30 border border-green-900 rounded-lg p-4">
              <p className="text-green-300 text-sm mb-2">Resolved</p>
              <p className="text-3xl font-bold text-green-200">{dashboardData.resolvedCount}</p>
              <p className="text-green-400 text-xs mt-2">Successfully completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// All Complaints Component
function AllComplaints({ complaints }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-cyan-400" />
          All Campus Complaints
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Dept</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Submitted By</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-4 text-center text-slate-400">No complaints found.</td></tr>
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
                        : complaint.status === 'In Progress'
                        ? 'bg-blue-900/50 text-blue-200'
                        : complaint.status === 'Assigned'
                        ? 'bg-purple-900/50 text-purple-200'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {complaint.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{complaint.department}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{complaint.createdBy?.name || 'Unknown'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Users & Staff Component
function UsersAndStaff({ users }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          Users & Staff Management
        </h2>
        <button className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-700/50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((member) => (
              <tr
                key={member._id}
                className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-slate-300 font-medium">{member.name}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    member.role === 'admin' 
                      ? 'bg-purple-900/50 text-purple-200'
                      : member.role === 'staff'
                      ? 'bg-emerald-900/50 text-emerald-200'
                      : 'bg-blue-900/50 text-blue-200'
                  }`}>
                    {member.role.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{member.department || '-'}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{member.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Heatmap Component
function Heatmap({ heatmapData }) {
  const getMarkerColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#ef4444'; // red-500
      case 'High': return '#f97316'; // orange-500
      case 'Medium': return '#eab308'; // yellow-500
      default: return '#3b82f6'; // blue-500
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Map className="w-5 h-5 text-emerald-400" />
        Geographical Heatmap
      </h3>
      <div className="h-[400px] w-full rounded-lg overflow-hidden border border-slate-700 relative z-0">
        <MapContainer center={[20.5937, 78.9629]} zoom={4} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {heatmapData.map((point) => (
            <CircleMarker
              key={point._id}
              center={[point.latitude, point.longitude]}
              pathOptions={{ fillColor: getMarkerColor(point.priority), color: getMarkerColor(point.priority), fillOpacity: 0.7 }}
              radius={8}
            >
              <Popup>
                <div className="p-1">
                  <p className="font-bold text-sm mb-1">{point.title}</p>
                  <p className="text-xs">Category: {point.category}</p>
                  <p className="text-xs">Status: {point.status}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('analytics');

  const [dashboardData, setDashboardData] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashRes = await api.get('/admin/dashboard');
        setDashboardData(dashRes.data);
      } catch (e) {
        console.error('Dash error', e);
        setErrorMsg(prev => prev + ' Failed to load analytics.');
      }
      
      try {
        const compRes = await api.get('/complaints');
        setComplaints(compRes.data);
      } catch (e) {
        console.error('Complaints error', e);
        setErrorMsg(prev => prev + ' Failed to load complaints.');
      }

      try {
        const usersRes = await api.get('/admin/users');
        setUsers(usersRes.data);
      } catch (e) {
        console.error('Users error', e);
        setErrorMsg(prev => prev + ' Failed to load users.');
      }

      try {
        const heatRes = await api.get('/admin/heatmap');
        setHeatmapData(heatRes.data);
      } catch (e) {
        console.error('Heatmap error', e);
        setErrorMsg(prev => prev + ' Failed to load heatmap.');
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const adminStats = dashboardData ? [
    { label: 'Total Complaints', value: dashboardData.openCount + dashboardData.resolvedCount, icon: ClipboardList, color: 'from-blue-400 to-blue-600' },
    { label: 'Resolved Issues', value: dashboardData.resolvedCount, icon: CheckCircle2, color: 'from-green-400 to-green-600' },
    { label: 'Open Issues', value: dashboardData.openCount, icon: AlertTriangle, color: 'from-orange-400 to-orange-600' },
    { label: 'Total Users', value: dashboardData.usersCount, icon: Users, color: 'from-purple-400 to-purple-600' },
    { label: 'Departments', value: dashboardData.departmentsCount, icon: PieChart, color: 'from-pink-400 to-pink-600' },
  ] : [];

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
              <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">CC</span>
              </div>
              <h1 className="text-xl font-bold text-white hidden sm:block">CampusCare Admin</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-white font-medium text-sm">{user?.name}</p>
              <p className="text-slate-400 text-xs capitalize bg-purple-900/50 px-2 py-1 rounded">Admin</p>
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
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Admin Menu</p>
              <button
                onClick={() => setActiveMenu('analytics')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3 text-sm font-medium ${
                  activeMenu === 'analytics'
                    ? 'bg-purple-600 text-white border border-purple-400'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Analytics
              </button>
              <button
                onClick={() => setActiveMenu('heatmap')}
                className={`w-full text-left px-4 py-2 mt-2 rounded-lg transition-colors flex items-center gap-3 text-sm font-medium ${
                  activeMenu === 'heatmap'
                    ? 'bg-purple-600 text-white border border-purple-400'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}
              >
                <Map className="w-5 h-5" />
                Heatmap
              </button>
              <button
                onClick={() => setActiveMenu('complaints')}
                className={`w-full text-left px-4 py-2 mt-2 rounded-lg transition-colors flex items-center gap-3 text-sm font-medium ${
                  activeMenu === 'complaints'
                    ? 'bg-purple-600 text-white border border-purple-400'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}
              >
                <ClipboardList className="w-5 h-5" />
                All Complaints
              </button>
              <button
                onClick={() => setActiveMenu('users')}
                className={`w-full text-left px-4 py-2 mt-2 rounded-lg transition-colors flex items-center gap-3 text-sm font-medium ${
                  activeMenu === 'users'
                    ? 'bg-purple-600 text-white border border-purple-400'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                }`}
              >
                <Users className="w-5 h-5" />
                Users & Staff
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Admin Info</p>
              <div className="px-4 py-3 bg-slate-700 rounded-lg">
                <p className="text-slate-300 text-sm">
                  <span className="font-semibold">{user?.name}</span>
                </p>
                <p className="text-slate-400 text-xs mt-1 capitalize">
                  Admin
                </p>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard 📊</h1>
            <p className="text-slate-400 mt-2">
              {activeMenu === 'analytics' && 'View analytics and performance metrics'}
              {activeMenu === 'heatmap' && 'View geographical heatmap of complaints'}
              {activeMenu === 'complaints' && 'Monitor all campus complaints'}
              {activeMenu === 'users' && 'Manage users and staff members'}
            </p>
            {errorMsg && (
              <div className="mt-4 p-3 bg-red-900/50 border border-red-900 rounded-lg text-red-200 text-sm">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Stats Grid - Always Show */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {adminStats.map((stat, idx) => {
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
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} bg-opacity-20 rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Content */}
          {activeMenu === 'analytics' && <Analytics dashboardData={dashboardData} />}
          {activeMenu === 'heatmap' && <Heatmap heatmapData={heatmapData} />}
          {activeMenu === 'complaints' && <AllComplaints complaints={complaints} />}
          {activeMenu === 'users' && <UsersAndStaff users={users} />}
        </main>
      </div>
    </div>
  );
}
