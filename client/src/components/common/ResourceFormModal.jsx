// client/src/components/common/ResourceFormModal.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Plus } from 'lucide-react'

const EMPTY_FORM = {
  name: '',
  type: 'LECTURE_HALL',
  seatingCapacity: '',
  physicalLocation: '',
  availableFrom: '08:00',
  availableTo: '17:00',
}

const ResourceFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  // Populate form with existing data when editing, or reset when creating new
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'LECTURE_HALL',
        seatingCapacity: initialData.seatingCapacity ?? '',
        physicalLocation: initialData.physicalLocation || '',
        availableFrom: initialData.availableFrom || '08:00',
        availableTo: initialData.availableTo || '17:00',
      })
    } else {
      setFormData(EMPTY_FORM)
    }
  }, [initialData, isOpen])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // Convert seatingCapacity to a number before submitting
      const submissionData = {
        ...formData,
        seatingCapacity: formData.seatingCapacity
          ? parseInt(formData.seatingCapacity, 10)
          : 0,
      }
      await onSubmit(submissionData)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 px-6 py-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {initialData ? 'Edit Resource' : 'Add New Resource'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {initialData
                    ? 'Update the details of this resource'
                    : 'Fill in the details to register a new resource'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-600 dark:hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Resource name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Main Auditorium"
                  className="input-field"
                />
              </div>

              {/* Type and capacity row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Type
                  </label>
                  <select
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="LECTURE_HALL">Lecture Hall</option>
                    <option value="LAB">Lab</option>
                    <option value="MEETING_ROOM">Meeting Room</option>
                    <option value="EQUIPMENT">Equipment</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="seatingCapacity"
                    value={formData.seatingCapacity}
                    onChange={handleChange}
                    placeholder="e.g. 150"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Physical location */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Physical Location
                </label>
                <input
                  type="text"
                  name="physicalLocation"
                  required
                  value={formData.physicalLocation}
                  onChange={handleChange}
                  placeholder="e.g. Block A, 2nd Floor"
                  className="input-field"
                />
              </div>

              {/* Available time range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Available From
                  </label>
                  <input
                    type="time"
                    name="availableFrom"
                    required
                    value={formData.availableFrom}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Available To
                  </label>
                  <input
                    type="time"
                    name="availableTo"
                    required
                    value={formData.availableTo}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary !py-2.5 !px-5 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary !py-2.5 !px-5 text-xs font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    'Saving...'
                  ) : initialData ? (
                    <>
                      <Save className="w-3.5 h-3.5" /> Update
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" /> Save
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ResourceFormModal
