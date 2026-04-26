import { useEffect, useMemo, useState } from 'react'
import { Loader2, RefreshCw, Trash2, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { deleteAdminUser, listAdminUsers, updateAdminUserRole } from '../../api/admin'

const ROLE_OPTIONS = ['USER', 'TECHNICIAN', 'ADMIN']

export default function AdminUsersPage() {
  const { apiBaseUrl, token, user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await listAdminUsers({ baseUrl: apiBaseUrl, token })
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!apiBaseUrl || !token) return
    fetchUsers()
  }, [apiBaseUrl, token])

  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => a.name.localeCompare(b.name)),
    [users],
  )

  const handleRoleChange = async (id, role) => {
    try {
      setSavingId(id)
      setError('')
      const updated = await updateAdminUserRole({ baseUrl: apiBaseUrl, token, id, role })
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)))
    } catch (err) {
      setError(err.message || 'Failed to update user role.')
    } finally {
      setSavingId(null)
    }
  }

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This action cannot be undone.`)) {
      return
    }

    try {
      setDeletingId(id)
      setError('')
      await deleteAdminUser({ baseUrl: apiBaseUrl, token, id })
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      setError(err.message || 'Failed to delete user.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-sm text-gray-500 mt-1">Edit user roles and remove accounts.</p>
        </div>
        <button
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : sortedUsers.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {sortedUsers.map((u) => {
                  const isSelf = currentUser?.email?.toLowerCase() === u.email?.toLowerCase()
                  const isBusy = savingId === u.id || deletingId === u.id
                  return (
                    <tr key={u.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <select
                          value={u.role}
                          onChange={(event) => handleRoleChange(u.id, event.target.value)}
                          disabled={isBusy}
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 disabled:opacity-60"
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          disabled={isBusy || isSelf}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={isSelf ? 'You cannot delete your own account' : 'Delete user'}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
