'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import LuxuryButton from '@/components/LuxuryButton';

export default function AdminPage() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    category: 'real_estate',
    location: '',
    year: new Date().getFullYear(),
    cover_image_url: '',
    summary: '',
    story: '',
    scope: '',
    materials: '',
    area_sqm: '',
    client_name: '',
    is_featured: false,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProjects(data);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = editingProject 
        ? '/api/admin/projects/update' 
        : '/api/admin/projects/create';
      
      const payload = editingProject 
        ? { ...formData, id: editingProject.id }
        : formData;

      const response = await fetch(endpoint, {
        method: editingProject ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchProjects();
        resetForm();
        setShowForm(false);
      } else {
        const data = await response.json();
        alert(data.error || 'Error saving project');
      }
    } catch (error) {
      alert('Error saving project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/admin/projects/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProjects();
      } else {
        alert('Error deleting project');
      }
    } catch (error) {
      alert('Error deleting project');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      category: project.category,
      location: project.location || '',
      year: project.year || new Date().getFullYear(),
      cover_image_url: project.cover_image_url,
      summary: project.summary || '',
      story: project.story || '',
      scope: project.scope || '',
      materials: project.materials || '',
      area_sqm: project.area_sqm || '',
      client_name: project.client_name || '',
      is_featured: project.is_featured || false,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      category: 'real_estate',
      location: '',
      year: new Date().getFullYear(),
      cover_image_url: '',
      summary: '',
      story: '',
      scope: '',
      materials: '',
      area_sqm: '',
      client_name: '',
      is_featured: false,
    });
  };

  const handleLogout = () => {
    document.cookie = 'admin_auth=; Max-Age=0';
    router.push('/login');
  };

  return (
    <main className="min-h-screen pt-32 pb-20 bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-[#c6a86b] uppercase tracking-wider text-sm">Project Management</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 border border-[#c6a86b] text-[#c6a86b] hover:bg-[#c6a86b] hover:text-black transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="mb-8">
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="px-8 py-4 bg-[#c6a86b] text-black font-bold uppercase tracking-wider hover:bg-[#d4b97a] transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add New Project'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-black/50 border border-[#c6a86b]/20 p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#c6a86b] text-sm uppercase tracking-wider mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-[#c6a86b]/20 text-white focus:outline-none focus:border-[#c6a86b]"
                  />
                </div>

                <div>
                  <label className="block text-[#c6a86b] text-sm uppercase tracking-wider mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-[#c6a86b]/20 text-white focus:outline-none focus:border-[#c6a86b]"
                  >
                    <option value="real_estate">Real Estate</option>
                    <option value="architecture">Architecture</option>
                    <option value="interior_contracting">Interior & Contracting</option>
                    <option value="renovation">Renovation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#c6a86b] text-sm uppercase tracking-wider mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-[#c6a86b]/20 text-white focus:outline-none focus:border-[#c6a86b]"
                  />
                </div>

                <div>
                  <label className="block text-[#c6a86b] text-sm uppercase tracking-wider mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-[#c6a86b]/20 text-white focus:outline-none focus:border-[#c6a86b]"
                  />
                </div>

                <div>
                  <label className="block text-[#c6a86b] text-sm uppercase tracking-wider mb-2">
                    Area (SQM)
                  </label>
                  <input
                    type="number"
                    value={formData.area_sqm}
                    onChange={(e) => setFormData({ ...formData, area_sqm: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-[#c6a86b]/20 text-white focus:outline-none focus:border-[#c6a86b]"
                  />
                </div>

                <div>
                  <label className="block text-[#c6a86b] text-sm uppercase tracking-wider mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-[#c6a86b]/20 text-white focus:outline-none focus:border-[#c6a86b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#c6a86b] text-sm uppercase tracking-wider mb-2">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-[#c6a86b]/20 text-white focus:outline-none focus:border-[#c6a86b]"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-[#c6a86b] text-sm uppercase tracking-wider mb-2">
                  Summary
                </label>
                <textarea
                  rows="3"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-[#c6a86b]/20 text-white focus:outline-none focus:border-[#c6a86b] resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-[#c6a86b] text-sm uppercase tracking-wider mb-2">
                  Story
                </label>
                <textarea
                  rows="5"
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-[#c6a86b]/20 text-white focus:outline-none focus:border-[#c6a86b] resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-[#c6a86b] text-sm uppercase tracking-wider mb-2">
                  Scope
                </label>
                <textarea
                  rows="3"
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-[#c6a86b]/20 text-white focus:outline-none focus:border-[#c6a86b] resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-[#c6a86b] text-sm uppercase tracking-wider mb-2">
                  Materials & Details
                </label>
                <textarea
                  rows="3"
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-[#c6a86b]/20 text-white focus:outline-none focus:border-[#c6a86b] resize-none"
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-5 h-5 mr-3"
                />
                <label htmlFor="is_featured" className="text-white text-lg">
                  Featured Project
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 bg-[#c6a86b] text-black font-bold uppercase tracking-wider hover:bg-[#d4b97a] transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
              </button>
            </form>
          </div>
        )}

        {/* Projects List */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white mb-6">All Projects ({projects.length})</h2>
          
          {projects.map((project) => (
            <div 
              key={project.id}
              className="bg-black/50 border border-[#c6a86b]/20 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  {project.name}
                  {project.is_featured && (
                    <span className="ml-3 text-xs bg-[#c6a86b] text-black px-2 py-1">FEATURED</span>
                  )}
                </h3>
                <p className="text-[#e8e2d9]/70 text-sm">
                  {project.category.replace('_', ' ')} • {project.location} • {project.year}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(project)}
                  className="px-6 py-2 border border-[#c6a86b] text-[#c6a86b] hover:bg-[#c6a86b] hover:text-black transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="px-6 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
