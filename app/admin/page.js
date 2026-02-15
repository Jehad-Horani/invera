'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

export default function AdminPage() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'real_estate',
    location: '',
    year: new Date().getFullYear(),
    summary: '',
    story: '',
    scope: '',
    materials: '',
    area_sqm: '',
    client_name: '',
    is_featured: false,
  });

  // File states
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  // For edit mode: existing gallery URLs to keep
  const [existingGalleryUrls, setExistingGalleryUrls] = useState([]);
  const [existingCoverUrl, setExistingCoverUrl] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Auto-clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => { setError(''); setSuccess(''); }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  async function fetchProjects() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setProjects(data);
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Cover image must be JPEG, PNG, or WebP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Cover image must be under 5MB');
      return;
    }

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setExistingCoverUrl(null);
    setError('');
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const previews = [];

    for (const file of files) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError(`${file.name} is not a valid image type`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} is over 5MB`);
        return;
      }
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    }

    setGalleryFiles((prev) => [...prev, ...validFiles]);
    setGalleryPreviews((prev) => [...prev, ...previews]);
    setError('');

    // Reset input so same files can be selected again
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const removeGalleryFile = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingGalleryUrl = (index) => {
    setExistingGalleryUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeCoverPreview = () => {
    setCoverFile(null);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const removeExistingCover = () => {
    setExistingCoverUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate cover for create
    if (!editingProject && !coverFile) {
      setError('Cover image is required');
      setLoading(false);
      return;
    }

    // For edit: must have either existing cover or new file
    if (editingProject && !coverFile && !existingCoverUrl) {
      setError('Cover image is required');
      setLoading(false);
      return;
    }

    try {
      const body = new FormData();

      // Text fields
      body.append('name', formData.name);
      body.append('category', formData.category);
      body.append('location', formData.location);
      body.append('year', formData.year.toString());
      body.append('summary', formData.summary);
      body.append('story', formData.story);
      body.append('scope', formData.scope);
      body.append('materials', formData.materials);
      body.append('area_sqm', formData.area_sqm.toString());
      body.append('client_name', formData.client_name);
      body.append('is_featured', formData.is_featured.toString());

      // Cover file
      if (coverFile) {
        body.append('cover_image', coverFile);
      }

      // Gallery files
      for (const gf of galleryFiles) {
        body.append('gallery_images', gf);
      }

      let endpoint, method;

      if (editingProject) {
        body.append('id', editingProject.id);
        body.append('existing_gallery_urls', JSON.stringify(existingGalleryUrls));
        endpoint = '/api/admin/projects/update';
        method = 'PUT';
      } else {
        endpoint = '/api/admin/projects/create';
        method = 'POST';
      }

      const response = await fetch(endpoint, { method, body });
      const result = await response.json();

      if (response.ok) {
        setSuccess(editingProject ? 'Project updated successfully!' : 'Project created successfully!');
        await fetchProjects();
        resetForm();
        setShowForm(false);
      } else {
        setError(result.error || 'Error saving project');
      }
    } catch (err) {
      setError('Error saving project: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project? This will also delete all uploaded images.')) return;

    try {
      const response = await fetch(`/api/admin/projects/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Project deleted successfully');
        await fetchProjects();
      } else {
        const data = await response.json();
        setError(data.error || 'Error deleting project');
      }
    } catch (err) {
      setError('Error deleting project');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      category: project.category,
      location: project.location || '',
      year: project.year || new Date().getFullYear(),
      summary: project.summary || '',
      story: project.story || '',
      scope: project.scope || '',
      materials: project.materials || '',
      area_sqm: project.area_sqm || '',
      client_name: project.client_name || '',
      is_featured: project.is_featured || false,
    });

    // Set existing images
    setExistingCoverUrl(project.cover_image_url || null);
    setCoverFile(null);
    setCoverPreview(null);
    setExistingGalleryUrls(Array.isArray(project.gallery) ? [...project.gallery] : []);
    setGalleryFiles([]);
    setGalleryPreviews([]);

    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      category: 'real_estate',
      location: '',
      year: new Date().getFullYear(),
      summary: '',
      story: '',
      scope: '',
      materials: '',
      area_sqm: '',
      client_name: '',
      is_featured: false,
    });
    setCoverFile(null);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
    setExistingCoverUrl(null);
    galleryPreviews.forEach((p) => URL.revokeObjectURL(p));
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setExistingGalleryUrls([]);
    setError('');
    setSuccess('');
    if (coverInputRef.current) coverInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const handleLogout = () => {
    document.cookie = 'admin_auth=; Max-Age=0';
    router.push('/login');
  };

  const inputClass = 'w-full px-4 py-3 bg-black/50 border border-[#c6a86b]/20 text-white focus:outline-none focus:border-[#c6a86b] transition-colors';
  const labelClass = 'block text-[#c6a86b] text-sm uppercase tracking-wider mb-2 font-semibold';

  return (
    <main className="min-h-screen pt-32 pb-20 bg-[#0f0f0f]" data-testid="admin-page">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-[#c6a86b] uppercase tracking-wider text-sm">Project Management</p>
          </div>
          <button
            onClick={handleLogout}
            data-testid="logout-btn"
            className="px-6 py-3 border border-[#c6a86b] text-[#c6a86b] hover:bg-[#c6a86b] hover:text-black transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/40 text-red-300 text-sm" data-testid="admin-error-msg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-500/40 text-green-300 text-sm" data-testid="admin-success-msg">
            {success}
          </div>
        )}

        {/* Add Button */}
        <div className="mb-8">
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            data-testid="add-project-btn"
            className="px-8 py-4 bg-[#c6a86b] text-black font-bold uppercase tracking-wider hover:bg-[#d4b97a] transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add New Project'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-black/50 border border-[#c6a86b]/20 p-8 mb-12" data-testid="project-form">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Text Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Project Name *</label>
                  <input
                    type="text"
                    required
                    data-testid="input-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Category *</label>
                  <select
                    required
                    data-testid="input-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={inputClass}
                  >
                    <option value="real_estate">Real Estate</option>
                    <option value="architecture">Architecture</option>
                    <option value="interior_contracting">Interior & Contracting</option>
                    <option value="renovation">Renovation</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    type="text"
                    data-testid="input-location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Year</label>
                  <input
                    type="number"
                    data-testid="input-year"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Area (SQM)</label>
                  <input
                    type="number"
                    data-testid="input-area"
                    value={formData.area_sqm}
                    onChange={(e) => setFormData({ ...formData, area_sqm: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Client Name</label>
                  <input
                    type="text"
                    data-testid="input-client"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className={labelClass}>
                  Cover Image {!editingProject && '*'}
                </label>
                <p className="text-[#e8e2d9]/40 text-xs mb-3">JPEG, PNG, or WebP. Max 5MB.</p>

                {/* Show existing cover in edit mode */}
                {existingCoverUrl && !coverPreview && (
                  <div className="relative inline-block mb-3" data-testid="existing-cover-preview">
                    <div className="relative w-48 h-32 overflow-hidden border border-[#c6a86b]/30">
                      <Image src={existingCoverUrl} alt="Current cover" fill className="object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={removeExistingCover}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-500 transition-colors"
                      data-testid="remove-existing-cover-btn"
                    >
                      X
                    </button>
                    <p className="text-[#e8e2d9]/50 text-xs mt-1">Current cover (select new to replace)</p>
                  </div>
                )}

                {/* New cover preview */}
                {coverPreview && (
                  <div className="relative inline-block mb-3" data-testid="new-cover-preview">
                    <div className="relative w-48 h-32 overflow-hidden border border-[#c6a86b]/30">
                      <img src={coverPreview} alt="New cover" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={removeCoverPreview}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-500 transition-colors"
                      data-testid="remove-new-cover-btn"
                    >
                      X
                    </button>
                    <p className="text-green-400/70 text-xs mt-1">{coverFile?.name}</p>
                  </div>
                )}

                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCoverChange}
                  data-testid="input-cover-image"
                  className="block w-full text-sm text-[#e8e2d9]/60 file:mr-4 file:py-2.5 file:px-5 file:border file:border-[#c6a86b]/40 file:text-sm file:font-semibold file:bg-[#c6a86b]/10 file:text-[#c6a86b] hover:file:bg-[#c6a86b]/20 file:cursor-pointer file:transition-colors file:uppercase file:tracking-wider"
                />
              </div>

              {/* Gallery Images Upload */}
              <div>
                <label className={labelClass}>Gallery Images</label>
                <p className="text-[#e8e2d9]/40 text-xs mb-3">JPEG, PNG, or WebP. Max 5MB each. Select multiple files.</p>

                {/* Existing gallery images (edit mode) */}
                {existingGalleryUrls.length > 0 && (
                  <div className="mb-4" data-testid="existing-gallery-previews">
                    <p className="text-[#e8e2d9]/50 text-xs mb-2 uppercase tracking-wider">Current Gallery</p>
                    <div className="flex flex-wrap gap-3">
                      {existingGalleryUrls.map((url, index) => (
                        <div key={`existing-${index}`} className="relative">
                          <div className="relative w-28 h-20 overflow-hidden border border-[#c6a86b]/30">
                            <Image src={url} alt={`Gallery ${index + 1}`} fill className="object-cover" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExistingGalleryUrl(index)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full text-[10px] flex items-center justify-center hover:bg-red-500 transition-colors"
                            data-testid={`remove-existing-gallery-${index}`}
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New gallery previews */}
                {galleryPreviews.length > 0 && (
                  <div className="mb-4" data-testid="new-gallery-previews">
                    <p className="text-green-400/70 text-xs mb-2 uppercase tracking-wider">New Images</p>
                    <div className="flex flex-wrap gap-3">
                      {galleryPreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative">
                          <div className="relative w-28 h-20 overflow-hidden border border-green-500/30">
                            <img src={preview} alt={`New ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeGalleryFile(index)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full text-[10px] flex items-center justify-center hover:bg-red-500 transition-colors"
                            data-testid={`remove-new-gallery-${index}`}
                          >
                            X
                          </button>
                          <p className="text-[#e8e2d9]/40 text-[10px] mt-0.5 truncate w-28">{galleryFiles[index]?.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleGalleryChange}
                  data-testid="input-gallery-images"
                  className="block w-full text-sm text-[#e8e2d9]/60 file:mr-4 file:py-2.5 file:px-5 file:border file:border-[#c6a86b]/40 file:text-sm file:font-semibold file:bg-[#c6a86b]/10 file:text-[#c6a86b] hover:file:bg-[#c6a86b]/20 file:cursor-pointer file:transition-colors file:uppercase file:tracking-wider"
                />
              </div>

              {/* Text Areas */}
              <div>
                <label className={labelClass}>Summary</label>
                <textarea
                  rows="3"
                  data-testid="input-summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className={`${inputClass} resize-none`}
                ></textarea>
              </div>

              <div>
                <label className={labelClass}>Story</label>
                <textarea
                  rows="5"
                  data-testid="input-story"
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  className={`${inputClass} resize-none`}
                ></textarea>
              </div>

              <div>
                <label className={labelClass}>Scope</label>
                <textarea
                  rows="3"
                  data-testid="input-scope"
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  className={`${inputClass} resize-none`}
                ></textarea>
              </div>

              <div>
                <label className={labelClass}>Materials & Details</label>
                <textarea
                  rows="3"
                  data-testid="input-materials"
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  className={`${inputClass} resize-none`}
                ></textarea>
              </div>

              {/* Featured checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  data-testid="input-featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-5 h-5 mr-3 accent-[#c6a86b]"
                />
                <label htmlFor="is_featured" className="text-white text-lg">
                  Featured Project
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                data-testid="submit-project-btn"
                className="w-full px-8 py-4 bg-[#c6a86b] text-black font-bold uppercase tracking-wider hover:bg-[#d4b97a] transition-colors disabled:opacity-50 relative"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="inline-block w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                    {editingProject ? 'Updating...' : 'Uploading & Saving...'}
                  </span>
                ) : (
                  editingProject ? 'Update Project' : 'Create Project'
                )}
              </button>
            </form>
          </div>
        )}

        {/* Projects List */}
        <div className="space-y-4" data-testid="projects-list">
          <h2 className="text-3xl font-bold text-white mb-6">All Projects ({projects.length})</h2>

          {projects.length === 0 && (
            <p className="text-[#e8e2d9]/40 text-center py-12">No projects yet. Create your first project above.</p>
          )}

          {projects.map((project) => (
            <div
              key={project.id}
              data-testid={`project-item-${project.id}`}
              className="bg-black/50 border border-[#c6a86b]/20 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Thumbnail */}
                {project.cover_image_url && (
                  <div className="relative w-16 h-12 overflow-hidden border border-[#c6a86b]/20 shrink-0">
                    <Image
                      src={project.cover_image_url}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-white mb-1 truncate">
                    {project.name}
                    {project.is_featured && (
                      <span className="ml-3 text-xs bg-[#c6a86b] text-black px-2 py-1 align-middle">FEATURED</span>
                    )}
                  </h3>
                  <p className="text-[#e8e2d9]/70 text-sm">
                    {project.category.replace('_', ' ')} {project.location ? `\u2022 ${project.location}` : ''} {project.year ? `\u2022 ${project.year}` : ''}
                  </p>
                  {Array.isArray(project.gallery) && project.gallery.length > 0 && (
                    <p className="text-[#c6a86b]/60 text-xs mt-1">{project.gallery.length} gallery image{project.gallery.length !== 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => handleEdit(project)}
                  data-testid={`edit-btn-${project.id}`}
                  className="px-6 py-2 border border-[#c6a86b] text-[#c6a86b] hover:bg-[#c6a86b] hover:text-black transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  data-testid={`delete-btn-${project.id}`}
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
