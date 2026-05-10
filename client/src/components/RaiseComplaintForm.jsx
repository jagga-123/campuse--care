import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { X, Upload, MapPin, AlertTriangle } from 'lucide-react';
import api from '../utils/axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position} />;
}

export default function RaiseComplaintForm({ onClose, onSucceed }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    locationDesc: '',
    emergency: false,
    nearbyIssue: false,
  });
  const [image, setImage] = useState(null);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('location', formData.locationDesc);
      data.append('emergency', formData.emergency);
      data.append('nearbyIssue', formData.nearbyIssue);
      
      if (position) {
        data.append('latitude', position.lat);
        data.append('longitude', position.lng);
      }
      
      if (image) {
        data.append('image', image);
      }

      await api.post('/complaints', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      onSucceed();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] overflow-y-auto">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Raise a Complaint</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-900 rounded-lg flex items-center gap-3 text-red-200">
              <AlertTriangle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                placeholder="Brief title of the issue"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                required
                rows="3"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                placeholder="Provide detailed information..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Location Description</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. Block A, Room 204"
                    value={formData.locationDesc}
                    onChange={e => setFormData({...formData, locationDesc: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Photo Evidence</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    id="file-upload"
                    className="hidden"
                    onChange={e => setImage(e.target.files[0])}
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center gap-2 w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-400 hover:text-white cursor-pointer transition-colors"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="truncate">{image ? image.name : 'Upload an image'}</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Pin Exact Location on Map</label>
              <div className="h-48 rounded-lg overflow-hidden border border-slate-700 relative z-0">
                <MapContainer center={[20.5937, 78.9629]} zoom={4} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <LocationPicker position={position} setPosition={setPosition} />
                </MapContainer>
              </div>
              <p className="text-xs text-slate-500 mt-2">Click on the map to drop a pin.</p>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                  checked={formData.emergency}
                  onChange={e => setFormData({...formData, emergency: e.target.checked})}
                />
                <span className="text-sm font-medium text-red-400">Emergency Issue</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                  checked={formData.nearbyIssue}
                  onChange={e => setFormData({...formData, nearbyIssue: e.target.checked})}
                />
                <span className="text-sm text-slate-300">Reporting for someone else / nearby</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
