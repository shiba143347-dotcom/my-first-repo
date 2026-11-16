import React, { useState } from 'react';
import { Viewpoint, NavigationEdge, ViewpointCategory, EdgeType } from '../types/tour';
import {
  X,
  Plus,
  Trash2,
  Upload,
  Save,
  Check,
  Search,
  Eye,
  Link,
  MapPin,
  Download,
  FolderUp,
  FileImage,
  AlertTriangle
} from 'lucide-react';

interface AdminDashboardProps {
  viewpoints: Viewpoint[];
  onSaveViewpoint: (updated: Viewpoint) => void;
  onAddViewpoint: (newVp: Viewpoint) => void;
  onDeleteViewpoint: (id: string) => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  viewpoints,
  onSaveViewpoint,
  onAddViewpoint,
  onDeleteViewpoint,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVpId, setSelectedVpId] = useState<string>(viewpoints[0]?.id || '');
  const [editForm, setEditForm] = useState<Viewpoint | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Edge form state
  const [newEdgeTarget, setNewEdgeTarget] = useState<string>('');
  const [newEdgeHeading, setNewEdgeHeading] = useState<number>(0);
  const [newEdgePitch, setNewEdgePitch] = useState<number>(-15);
  const [newEdgeLabel, setNewEdgeLabel] = useState<string>('');
  const [newEdgeDistance, setNewEdgeDistance] = useState<string>('25m');
  const [newEdgeType, setNewEdgeType] = useState<EdgeType>('road');

  // Select active viewpoint to edit
  React.useEffect(() => {
    const vp = viewpoints.find((v) => v.id === selectedVpId);
    if (vp) {
      setEditForm(JSON.parse(JSON.stringify(vp))); // deep copy
      setPreviewImage(vp.panoramaUrl || null);
    }
  }, [selectedVpId, viewpoints]);

  const filteredViewpoints = viewpoints.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.buildingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.roomNumber && v.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle Panorama Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      setPreviewImage(dataUrl);
      if (editForm) {
        setEditForm({ ...editForm, panoramaUrl: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Save
  const handleSave = () => {
    if (!editForm) return;
    onSaveViewpoint(editForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Handle Add Edge
  const handleAddEdge = () => {
    if (!editForm || !newEdgeTarget || !newEdgeLabel) return;

    const edge: NavigationEdge = {
      targetId: newEdgeTarget,
      heading: Number(newEdgeHeading),
      pitch: Number(newEdgePitch),
      label: newEdgeLabel,
      distance: newEdgeDistance,
      type: newEdgeType
    };

    setEditForm({
      ...editForm,
      connections: [...editForm.connections, edge]
    });

    // Reset edge form
    setNewEdgeTarget('');
    setNewEdgeLabel('');
  };

  // Handle Remove Edge
  const handleRemoveEdge = (idx: number) => {
    if (!editForm) return;
    const updated = [...editForm.connections];
    updated.splice(idx, 1);
    setEditForm({ ...editForm, connections: updated });
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(viewpoints, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'genz_university_campus_graph.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-6xl h-[92vh] rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <span>Campus Management & 360° Panorama Admin</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit locations, upload real equirectangular captures, connect navigation arrows, and manage campus graph.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition"
              title="Export complete campus graph as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Graph</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Split: Left Viewpoints List | Right Editor */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Viewpoints Sidebar */}
          <div className="w-full md:w-80 border-r border-slate-800 flex flex-col bg-slate-950/60 shrink-0">
            {/* Search Filter */}
            <div className="p-3 border-b border-slate-800">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter 300+ viewpoints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredViewpoints.map((vp) => (
                <div
                  key={vp.id}
                  onClick={() => setSelectedVpId(vp.id)}
                  className={`p-2.5 rounded-xl cursor-pointer text-xs transition ${
                    selectedVpId === vp.id
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="truncate">{vp.name}</div>
                  <div className="text-[10px] opacity-70 truncate">
                    {vp.buildingName} • {vp.floorName} ({vp.connections.length} edges)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Editor Panel */}
          {editForm ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-900">
              {/* Basic Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Location Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Building Name</label>
                  <input
                    type="text"
                    value={editForm.buildingName}
                    onChange={(e) => setEditForm({ ...editForm, buildingName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Floor Name</label>
                  <input
                    type="text"
                    value={editForm.floorName}
                    onChange={(e) => setEditForm({ ...editForm, floorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Floor Level (0 = Ground)</label>
                  <input
                    type="number"
                    value={editForm.floorLevel}
                    onChange={(e) => setEditForm({ ...editForm, floorLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Location Description</label>
                  <textarea
                    rows={2}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Panorama Upload Section */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileImage className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-bold text-white">360° Equirectangular Panorama</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {editForm.panoramaUrl ? 'Custom Image Loaded' : `Engine Theme: ${editForm.panoramaTheme}`}
                  </span>
                </div>

                {previewImage && (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-800 bg-black">
                    <img src={previewImage} alt="Panorama preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2 text-[10px] text-white">
                      Equirectangular 2:1 Texture
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer transition flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload Real 360° Photo (JPG/PNG)</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {editForm.panoramaUrl && (
                    <button
                      onClick={() => {
                        setPreviewImage(null);
                        setEditForm({ ...editForm, panoramaUrl: undefined });
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
                    >
                      Reset to Procedural Engine
                    </button>
                  )}
                </div>
              </div>

              {/* Connected Navigation Arrows (Edges) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-bold text-white">Connected Navigation Arrows & Portals</span>
                  </div>
                  <span className="text-xs text-slate-400">{editForm.connections.length} Connections</span>
                </div>

                {/* Existing Connections */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {editForm.connections.map((edge, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{edge.label}</div>
                        <div className="text-[11px] text-slate-400">
                          Target: <span className="font-mono text-cyan-300">{edge.targetId}</span> • Heading: {edge.heading}° • Dist: {edge.distance || '20m'} • Type: {edge.type || 'road'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveEdge(idx)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Connection Form */}
                <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Destination Target Viewpoint</label>
                    <select
                      value={newEdgeTarget}
                      onChange={(e) => {
                        setNewEdgeTarget(e.target.value);
                        const dest = viewpoints.find((v) => v.id === e.target.value);
                        if (dest && !newEdgeLabel) {
                          setNewEdgeLabel(`To ${dest.name}`);
                        }
                      }}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                    >
                      <option value="">Select Target...</option>
                      {viewpoints.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.buildingName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Arrow Label</label>
                    <input
                      type="text"
                      placeholder="e.g. To Grand Fountain"
                      value={newEdgeLabel}
                      onChange={(e) => setNewEdgeLabel(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Edge Type</label>
                    <select
                      value={newEdgeType}
                      onChange={(e) => setNewEdgeType(e.target.value as EdgeType)}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                    >
                      <option value="road">Road / Pathway Chevron</option>
                      <option value="door">Door Marker</option>
                      <option value="stairs">Staircase</option>
                      <option value="elevator">Elevator</option>
                      <option value="exit">Exit Marker</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Azimuth Heading ({newEdgeHeading}°)</label>
                    <input
                      type="range"
                      min="0"
                      max="359"
                      value={newEdgeHeading}
                      onChange={(e) => setNewEdgeHeading(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Distance (e.g. 50m)</label>
                    <input
                      type="text"
                      value={newEdgeDistance}
                      onChange={(e) => setNewEdgeDistance(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleAddEdge}
                      disabled={!newEdgeTarget || !newEdgeLabel}
                      className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Connect Arrow</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Bar */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                {saveSuccess && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                    <Check className="w-4 h-4" /> Changes Saved Successfully
                  </span>
                )}
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Location Changes</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              Select a location from the left to edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

