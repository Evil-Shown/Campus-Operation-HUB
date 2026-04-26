import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  Users,
  MapPin,
  Search,
  Filter,
  ArrowUpRight,
  Zap,
  Package,
  Plus,
  Trash2,
  Edit3,
  Loader2,
  AlertTriangle,
  Clock,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { searchResources, deleteResource, createResource, updateResource } from '../../api/resources'
import ResourceFormModal from '../../components/common/ResourceFormModal'

// Gradient palette for resource cards based on type
const TYPE_GRADIENTS = {
  LECTURE_HALL: 'from-primary-500 to-indigo-600',
  LAB: 'from-emerald-500 to-teal-600',
  MEETING_ROOM: 'from-amber-500 to-orange-600',
  EQUIPMENT: 'from-cyan-500 to-blue-600',
}

const DEFAULT_GRADIENT = 'from-slate-500 to-slate-700'

function StatusPill({ status }) {
  const styles = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    OUT_OF_SERVICE: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    MAINTENANCE: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  }
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${styles[status] || styles.ACTIVE}`}
    >
      {(status || 'ACTIVE').replace(/_/g, ' ')}
    </span>
  )
}

export default function ResourceListPage() {
  const { user, token, apiBaseUrl } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Check if the current user is an admin
  const isAdmin = user?.role === 'ADMIN'

  const [resources, setResources] = useState([])
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    location: '',
    minCapacity: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingResource, setEditingResource] = useState(null)

  // Fetch resources from the backend
  const fetchResources = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Remove empty filter values before sending
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      )
      const data = await searchResources({
        baseUrl: apiBaseUrl,
        token,
        ...activeFilters,
      })
      setResources(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch resources', err)
      setError(err.message || 'Failed to load resources')
      setResources([])
    } finally {
      setLoading(false)
    }
  }, [filters, apiBaseUrl, token])

  // Fetch data when the page loads and when filters change
  useEffect(() => {
    fetchResources()
  }, [fetchResources])

  // Keep `type` filter in sync with URL query so dashboard category links prefilter this page.
  useEffect(() => {
    const typeFromUrl = searchParams.get('type') || ''
    setFilters((prev) => (prev.type === typeFromUrl ? prev : { ...prev, type: typeFromUrl }))
  }, [searchParams])

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))

    if (name === 'type') {
      const nextParams = new URLSearchParams(searchParams)
      if (value) nextParams.set('type', value)
      else nextParams.delete('type')
      setSearchParams(nextParams)
    }
  }

  // Handle resource deletion (Soft Delete)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to disable this resource?')) {
      return
    }
    try {
      await deleteResource({ baseUrl: apiBaseUrl, token, id })
      // Refresh the list after deletion
      fetchResources()
    } catch (err) {
      console.error('Failed to delete', err)
      alert('Failed to delete resource: ' + (err.message || 'Unknown error'))
    }
  }

  // Called when Save/Update is pressed inside the modal
  const handleFormSubmit = async (formData) => {
    try {
      if (editingResource) {
        // Update existing resource
        await updateResource({ baseUrl: apiBaseUrl, token, id: editingResource.id, data: formData })
      } else {
        // Create a new resource
        await createResource({ baseUrl: apiBaseUrl, token, data: formData })
      }
      setIsModalOpen(false)
      setEditingResource(null)
      // Refresh the list with the latest data
      fetchResources()
    } catch (err) {
      console.error('Error saving resource:', err)
      alert('Failed to save resource: ' + (err.message || 'Please try again.'))
    }
  }

  // Open the modal in "create" mode
  const openCreateModal = () => {
    setEditingResource(null)
    setIsModalOpen(true)
  }

  // Open the modal in "edit" mode with existing resource data
  const openEditModal = (resource) => {
    setEditingResource(resource)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-2 gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-primary-600/10 border border-primary-500/20 shadow-lg shadow-primary-500/5">
            <Package className="h-8 w-8 text-primary-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3.5 h-3.5 text-primary-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary-500">
                Asset Management Module
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Facilities &amp; Assets Catalogue
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Inventory of academic and technical spaces across the institution.
            </p>
          </div>
        </div>

        {/* Admin: Add New Resource button */}
        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCreateModal}
            className="btn-primary !py-3 !px-6 text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary-500/20"
          >
            <Plus className="w-4 h-4" /> Add New Resource
          </motion.button>
        )}
      </section>

      {/* Search & Filter Bar */}
      <div className="glass-card !bg-white dark:!bg-slate-900 !p-3 flex flex-wrap gap-3 items-center">
        {/* Location search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            name="location"
            placeholder="Search by location..."
            value={filters.location}
            onChange={handleFilterChange}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:border-primary-500 outline-none transition-all placeholder:font-normal"
          />
        </div>

        <div className="flex gap-2">
          {/* Resource type filter */}
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 outline-none focus:border-primary-500"
          >
            <option value="">All Types</option>
            <option value="LECTURE_HALL">Lecture Hall</option>
            <option value="LAB">Lab</option>
            <option value="MEETING_ROOM">Meeting Room</option>
            <option value="EQUIPMENT">Equipment</option>
          </select>

          {/* Minimum capacity filter */}
          <input
            type="number"
            name="minCapacity"
            placeholder="Min Cap."
            value={filters.minCapacity}
            onChange={handleFilterChange}
            className="w-28 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-black text-slate-600 dark:text-slate-300 outline-none focus:border-primary-500 placeholder:font-normal placeholder:normal-case"
          />

          <button
            onClick={fetchResources}
            className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-primary-500 hover:text-white transition-all shadow-sm"
            title="Refresh results"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl bg-rose-500/10 border border-rose-500/20 px-5 py-4 text-sm font-semibold text-rose-600 dark:text-rose-400"
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-sm font-semibold">Loading resources...</span>
        </div>
      )}

      {/* Resources Grid */}
      {!loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {resources.map((resource, idx) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.07 }}
                whileHover={{ y: -5 }}
                className="glass-card group !p-0 overflow-hidden border-white/5 dark:!bg-slate-900 shadow-xl"
              >
                {/* Card Header with gradient */}
                <div
                  className={`h-32 bg-gradient-to-br ${TYPE_GRADIENTS[resource.type] || DEFAULT_GRADIENT} relative p-6`}
                >
                  <div className="absolute top-0 right-0 p-4">
                    <StatusPill status={resource.status} />
                  </div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/70">
                      Ref: ASST-{String(resource.id).padStart(3, '0')}
                    </p>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">
                      {resource.name}
                    </h2>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Building2 className="w-3 h-3" /> Classification
                      </p>
                      <p className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase">
                        {(resource.type || '').replace(/_/g, ' ')}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Users className="w-3 h-3" /> Occupancy
                      </p>
                      <p className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase">
                        {resource.seatingCapacity ?? resource.capacity ?? '—'} Personnel
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> Location
                    </p>
                    <p className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase">
                      {resource.physicalLocation || resource.location || '—'}
                    </p>
                  </div>

                  {/* Available time range (if present) */}
                  {(resource.availableFrom || resource.availableTo) && (
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Availability
                      </p>
                      <p className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase">
                        {resource.availableFrom || '—'} to {resource.availableTo || '—'}
                      </p>
                    </div>
                  )}

                  {/* Card Footer */}
                  <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    {/* Admin Controls: Edit & Delete */}
                    {isAdmin ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(resource)}
                          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(resource.id)}
                          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1 w-4 rounded-full ${i <= 4 ? 'bg-primary-500' : 'bg-slate-200 dark:bg-white/10'}`}
                          />
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => navigate(`/resources/${resource.id}`)}
                      className="btn-primary !py-2.5 !px-5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:scale-105 transition-all shadow-lg shadow-primary-500/20"
                    >
                      Initiate Booking <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty state when no resources found */}
          {resources.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 gap-3"
            >
              <Package className="w-12 h-12 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold">No resources found matching your criteria.</p>
              <p className="text-xs text-slate-400">Try adjusting your filters or search terms.</p>
            </motion.div>
          )}
        </div>
      )}

      {/* Add/Edit Resource Modal */}
      <ResourceFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingResource(null) }}
        onSubmit={handleFormSubmit}
        initialData={editingResource}
      />
    </div>
  )
}
