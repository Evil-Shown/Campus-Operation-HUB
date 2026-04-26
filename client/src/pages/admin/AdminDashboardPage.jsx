import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import * as XLSX from 'xlsx'
import {
  Package,
  CalendarClock,
  AlertCircle,
  Users,
  CheckCircle2,
  Activity,
  FileText,
  Loader2,
  RefreshCw,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getAdminDashboardData, listAdminUsers } from '../../api/admin'
import { approveBooking, rejectBooking } from '../../api/bookings'

function StatusPill({ status }) {
  const map = {
    PENDING:     'bg-amber-50 text-amber-700 border-amber-200',
    APPROVED:    'bg-emerald-50 text-emerald-700 border-emerald-200',
    CONFIRMED:   'bg-emerald-50 text-emerald-700 border-emerald-200',
    REJECTED:    'bg-red-50 text-red-700 border-red-200',
    CANCELLED:   'bg-gray-100 text-gray-500 border-gray-200',
    OPEN:        'bg-rose-50 text-rose-700 border-rose-200',
    IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
    RESOLVED:    'bg-emerald-50 text-emerald-700 border-emerald-200',
    CLOSED:      'bg-gray-100 text-gray-500 border-gray-200',
    CRITICAL:    'bg-red-50 text-red-700 border-red-200',
    HIGH:        'bg-orange-50 text-orange-700 border-orange-200',
    MEDIUM:      'bg-amber-50 text-amber-700 border-amber-200',
    LOW:         'bg-gray-100 text-gray-600 border-gray-200',
  }
  const style = map[status?.toUpperCase()] || 'bg-gray-100 text-gray-500 border-gray-200'
  return (
    <span className={`inline-flex items-center border rounded-md px-2 py-0.5 text-xs font-medium ${style}`}>
      {status}
    </span>
  )
}

export default function AdminDashboardPage() {
  const { apiBaseUrl, token } = useAuth()
  const [data, setData] = useState({ resources: [], bookings: [], tickets: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [bookingActionLoadingId, setBookingActionLoadingId] = useState(null)

  const fetchData = async ({ silent = false } = {}) => {
    try {
      if (!silent) {
        setLoading(true)
      }
      setError(null)
      const result = await getAdminDashboardData({ baseUrl: apiBaseUrl, token })
      setData(result)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }

  const handleExportReport = async () => {
    try {
      setExporting(true)

      const workbook = XLSX.utils.book_new()
      const generatedAt = new Date()
      const users = await listAdminUsers({ baseUrl: apiBaseUrl, token }).catch(() => [])
      const generatedAtText = generatedAt.toLocaleString()

      const toTitleLabel = (key = '') =>
        String(key)
          .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
          .replace(/[_-]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .replace(/\b\w/g, (char) => char.toUpperCase())

      const safeDate = (value) => {
        const date = value ? new Date(value) : null
        return date && !Number.isNaN(date.getTime()) ? date : null
      }

      const toIsoDay = (value) => {
        const date = safeDate(value)
        return date ? date.toISOString().slice(0, 10) : ''
      }

      const formatDateTime = (value) => {
        const date = safeDate(value)
        return date ? date.toLocaleString() : ''
      }

      const estimateColumnWidth = (value) => {
        if (value === null || value === undefined) return 10
        return String(value).length + 2
      }

      const setCellStyle = (sheet, cellRef, style) => {
        if (!sheet[cellRef]) return
        sheet[cellRef].s = { ...(sheet[cellRef].s || {}), ...style }
      }

      const styleHeaderRow = (sheet, rowIndex, columnCount) => {
        for (let col = 0; col < columnCount; col += 1) {
          const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: col })
          setCellStyle(sheet, cellRef, {
            font: { bold: true, color: { rgb: 'FFFFFFFF' } },
            fill: { fgColor: { rgb: '1F4E78' } },
            alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
          })
        }
      }

      const styleTitleCell = (sheet, cellRef) => {
        setCellStyle(sheet, cellRef, {
          font: { bold: true, sz: 16, color: { rgb: '1F4E78' } },
          alignment: { vertical: 'center', horizontal: 'left' },
        })
      }

      const styleTotalRow = (sheet, rowIndex, columnCount) => {
        for (let col = 0; col < columnCount; col += 1) {
          const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: col })
          setCellStyle(sheet, cellRef, {
            font: { bold: true, color: { rgb: '1F4E78' } },
            fill: { fgColor: { rgb: 'EAF2FB' } },
            border: {
              top: { style: 'thin', color: { rgb: '1F4E78' } },
            },
          })
        }
      }

      const applySheetLayout = (sheet, rows) => {
        if (!rows || rows.length === 0) return
        const headers = Object.keys(rows[0])
        sheet['!cols'] = headers.map((header) => {
          const maxValueLength = rows.reduce((max, row) => {
            const candidate = estimateColumnWidth(row[header])
            return Math.max(max, candidate)
          }, estimateColumnWidth(toTitleLabel(header)))

          return { wch: Math.min(Math.max(maxValueLength, 14), 45) }
        })
        sheet['!autofilter'] = { ref: sheet['!ref'] }
        sheet['!freeze'] = { xSplit: 0, ySplit: 1 }
        styleHeaderRow(sheet, 0, headers.length)
        sheet['!pageSetup'] = {
          orientation: 'landscape',
          fitToPage: true,
          fitToWidth: 1,
          fitToHeight: 0,
        }
      }

      const bookingHours = data.bookings.reduce((sum, booking) => {
        const start = safeDate(booking.startTime)
        const end = safeDate(booking.endTime)
        if (!start || !end) return sum
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        return sum + (hours > 0 ? hours : 0)
      }, 0)

      const bookingsByStatus = data.bookings.reduce((acc, booking) => {
        const key = booking.status || 'UNKNOWN'
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {})

      const ticketsByStatus = data.tickets.reduce((acc, ticket) => {
        const key = ticket.status || 'UNKNOWN'
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {})

      const ticketsByPriority = data.tickets.reduce((acc, ticket) => {
        const key = ticket.priority || 'UNKNOWN'
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {})

      const usersByRole = users.reduce((acc, user) => {
        const key = user.role || 'UNKNOWN'
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {})

      const bookingsByUser = data.bookings.reduce((acc, booking) => {
        const key = booking.userName || booking.user?.name || 'Unknown User'
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {})

      const bookingsByResource = data.bookings.reduce((acc, booking) => {
        const key = booking.resourceName || booking.resource?.name || 'Unknown Resource'
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {})

      const utilizationByResource = data.bookings.reduce((acc, booking) => {
        const resourceName = booking.resourceName || booking.resource?.name || 'Unknown Resource'
        const start = safeDate(booking.startTime)
        const end = safeDate(booking.endTime)
        const duration = start && end ? Math.max((end.getTime() - start.getTime()) / (1000 * 60 * 60), 0) : 0

        if (!acc[resourceName]) {
          acc[resourceName] = { bookings: 0, approved: 0, totalHours: 0 }
        }

        acc[resourceName].bookings += 1
        acc[resourceName].totalHours += duration
        if ((booking.status || '').toUpperCase() === 'APPROVED' || (booking.status || '').toUpperCase() === 'CONFIRMED') {
          acc[resourceName].approved += 1
        }

        return acc
      }, {})

      const dailyActivityMap = {}
      data.bookings.forEach((booking) => {
        const day = toIsoDay(booking.createdAt || booking.startTime)
        if (!day) return
        if (!dailyActivityMap[day]) {
          dailyActivityMap[day] = { day, bookingsCreated: 0, ticketsCreated: 0 }
        }
        dailyActivityMap[day].bookingsCreated += 1
      })
      data.tickets.forEach((ticket) => {
        const day = toIsoDay(ticket.createdAt)
        if (!day) return
        if (!dailyActivityMap[day]) {
          dailyActivityMap[day] = { day, bookingsCreated: 0, ticketsCreated: 0 }
        }
        dailyActivityMap[day].ticketsCreated += 1
      })

      const summaryRows = [
        { Section: 'Report', Metric: 'Generated At', Value: generatedAtText },
        { Section: 'Report', Metric: 'Generated By', Value: 'Admin Dashboard Export' },
        { Section: 'Users', Metric: 'Total Users', Value: users.length },
        { Section: 'Users', Metric: 'Admins', Value: usersByRole.ADMIN || 0 },
        { Section: 'Users', Metric: 'Technicians', Value: usersByRole.TECHNICIAN || 0 },
        { Section: 'Users', Metric: 'Standard Users', Value: usersByRole.USER || 0 },
        { Section: 'Resources', Metric: 'Total Resources', Value: data.resources.length },
        { Section: 'Resources', Metric: 'Active Resources', Value: data.resources.filter((r) => r.status === 'ACTIVE').length },
        { Section: 'Resources', Metric: 'Out Of Service', Value: data.resources.filter((r) => r.status === 'OUT_OF_SERVICE').length },
        { Section: 'Bookings', Metric: 'Total Bookings', Value: data.bookings.length },
        { Section: 'Bookings', Metric: 'Pending Bookings', Value: pendingBookings },
        { Section: 'Bookings', Metric: 'Approved/Confirmed', Value: (bookingsByStatus.APPROVED || 0) + (bookingsByStatus.CONFIRMED || 0) },
        { Section: 'Bookings', Metric: 'Rejected', Value: bookingsByStatus.REJECTED || 0 },
        { Section: 'Bookings', Metric: 'Total Reserved Hours', Value: Number(bookingHours.toFixed(2)) },
        { Section: 'Tickets', Metric: 'Total Tickets', Value: data.tickets.length },
        { Section: 'Tickets', Metric: 'Open Tickets', Value: openTickets },
        { Section: 'Tickets', Metric: 'Critical/High Tickets', Value: criticalTickets },
        { Section: 'Tickets', Metric: 'Resolved', Value: ticketsByStatus.RESOLVED || 0 },
      ]
      const summaryTotalsRow = { Section: 'Totals', Metric: 'Core Records (Resources + Bookings + Tickets)', Value: data.resources.length + data.bookings.length + data.tickets.length }

      const resourcesRows = data.resources.map((resource) => ({
        ResourceId: resource.id,
        Name: resource.name || '',
        Type: resource.type || '',
        Status: resource.status || '',
        Capacity: resource.seatingCapacity ?? resource.capacity ?? '',
        Location: resource.physicalLocation || resource.location || '',
      }))

      const bookingsRows = data.bookings.map((booking) => ({
        BookingId: booking.id,
        CreatedAt: formatDateTime(booking.createdAt),
        Resource: booking.resourceName || booking.resource?.name || '',
        RequestedBy: booking.userName || booking.user?.name || '',
        Status: booking.status || '',
        StartTime: formatDateTime(booking.startTime),
        EndTime: formatDateTime(booking.endTime),
        Purpose: booking.purpose || '',
        Attendees: booking.attendees ?? '',
        AdminReviewNote: booking.adminReviewNote || '',
      }))

      const ticketsRows = data.tickets.map((ticket) => ({
        TicketId: ticket.id,
        CreatedAt: formatDateTime(ticket.createdAt),
        Title: ticket.title || '',
        Description: ticket.description || '',
        Status: ticket.status || '',
        Priority: ticket.priority || '',
        AssignedTo: ticket.assignedToName || ticket.assignee?.name || '',
        Category: ticket.category || '',
        Resource: ticket.resourceName || ticket.resource?.name || '',
      }))

      const usersRows = users.map((user) => ({
        UserId: user.id,
        Name: user.name || '',
        Email: user.email || '',
        Role: user.role || '',
        AvatarUrl: user.pictureUrl || '',
      }))

      const bookingStatusRows = Object.entries(bookingsByStatus)
        .map(([status, count]) => ({ Status: status, Count: count }))
        .sort((a, b) => b.Count - a.Count)

      const ticketStatusRows = Object.entries(ticketsByStatus)
        .map(([status, count]) => ({ Status: status, Count: count }))
        .sort((a, b) => b.Count - a.Count)

      const ticketPriorityRows = Object.entries(ticketsByPriority)
        .map(([priority, count]) => ({ Priority: priority, Count: count }))
        .sort((a, b) => b.Count - a.Count)

      const topUsersRows = Object.entries(bookingsByUser)
        .map(([userName, count]) => ({ User: userName, Bookings: count }))
        .sort((a, b) => b.Bookings - a.Bookings)

      const topResourcesRows = Object.entries(bookingsByResource)
        .map(([resourceName, count]) => ({ Resource: resourceName, Bookings: count }))
        .sort((a, b) => b.Bookings - a.Bookings)

      const utilizationRows = Object.entries(utilizationByResource)
        .map(([resourceName, value]) => ({
          Resource: resourceName,
          Bookings: value.bookings,
          ApprovedOrConfirmed: value.approved,
          TotalReservedHours: Number(value.totalHours.toFixed(2)),
        }))
        .sort((a, b) => b.TotalReservedHours - a.TotalReservedHours)

      const dailyActivityRows = Object.values(dailyActivityMap).sort((a, b) => a.day.localeCompare(b.day))

      const analyticsRows = [
        ...bookingStatusRows.map((row) => ({ Category: 'Bookings By Status', Key: row.Status, Value: row.Count })),
        ...ticketStatusRows.map((row) => ({ Category: 'Tickets By Status', Key: row.Status, Value: row.Count })),
        ...ticketPriorityRows.map((row) => ({ Category: 'Tickets By Priority', Key: row.Priority, Value: row.Count })),
      ]

      const chartDataRows = [
        ...bookingStatusRows.map((row) => ({ Series: 'Bookings by Status', Label: row.Status, Value: row.Count })),
        ...ticketStatusRows.map((row) => ({ Series: 'Tickets by Status', Label: row.Status, Value: row.Count })),
        ...ticketPriorityRows.map((row) => ({ Series: 'Tickets by Priority', Label: row.Priority, Value: row.Count })),
        ...topResourcesRows.slice(0, 10).map((row) => ({ Series: 'Top Resources', Label: row.Resource, Value: row.Bookings })),
      ]

      const summarySheet = XLSX.utils.aoa_to_sheet([
        ['Campus Operation Hub - Admin Dashboard Report'],
        ['Generated At', generatedAtText],
        ['Generated By', 'Admin Dashboard Export'],
        [],
        ['Section', 'Metric', 'Value'],
      ])
      XLSX.utils.sheet_add_json(summarySheet, summaryRows, { origin: 'A6', skipHeader: true })
      XLSX.utils.sheet_add_json(summarySheet, [summaryTotalsRow], { origin: `A${summaryRows.length + 7}`, skipHeader: true })
      summarySheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }]
      summarySheet['!cols'] = [{ wch: 20 }, { wch: 34 }, { wch: 26 }]
      summarySheet['!autofilter'] = { ref: `A5:C${summaryRows.length + 7}` }
      summarySheet['!freeze'] = { xSplit: 0, ySplit: 5 }
      summarySheet['!pageSetup'] = {
        orientation: 'portrait',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
      }
      styleTitleCell(summarySheet, 'A1')
      styleHeaderRow(summarySheet, 4, 3)
      styleTotalRow(summarySheet, summaryRows.length + 6, 3)
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

      const makeDataSheet = (rows, title) => {
        if (!rows || rows.length === 0) {
          const sheet = XLSX.utils.aoa_to_sheet([
            [title],
            [],
            ['No data available for this report section'],
            ['Generated At', generatedAtText],
          ])
          sheet['!cols'] = [{ wch: 48 }, { wch: 28 }]
          sheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }]
          styleTitleCell(sheet, 'A1')
          return sheet
        }

        const headers = Object.keys(rows[0])
        const normalizedRows = rows.map((row) =>
          headers.reduce((acc, key) => {
            acc[toTitleLabel(key)] = row[key]
            return acc
          }, {}),
        )
        const sheet = XLSX.utils.json_to_sheet(normalizedRows, { origin: 'A3' })
        XLSX.utils.sheet_add_aoa(sheet, [[title], []], { origin: 'A1' })
        sheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: Math.max(headers.length - 1, 0) } }]
        styleTitleCell(sheet, 'A1')
        styleHeaderRow(sheet, 2, headers.length)
        applySheetLayout(sheet, normalizedRows)
        const totals = headers.reduce((acc, key) => {
          const normalizedKey = toTitleLabel(key)
          const numericTotal = normalizedRows.reduce((sum, row) => {
            const value = row[normalizedKey]
            return typeof value === 'number' ? sum + value : sum
          }, 0)
          acc[normalizedKey] = numericTotal > 0 ? Number(numericTotal.toFixed(2)) : ''
          return acc
        }, {})
        totals[toTitleLabel(headers[0])] = 'Totals'
        XLSX.utils.sheet_add_json(sheet, [totals], { origin: -1, skipHeader: true })
        const totalsRowIndex = XLSX.utils.decode_range(sheet['!ref']).e.r
        styleTotalRow(sheet, totalsRowIndex, headers.length)
        sheet['!freeze'] = { xSplit: 0, ySplit: 3 }
        sheet['!autofilter'] = { ref: `A3:${XLSX.utils.encode_col(headers.length - 1)}3` }
        return sheet
      }

      const instructionsSheet = XLSX.utils.aoa_to_sheet([
        ['Campus Operation Hub - Report Guide'],
        [],
        ['How to use this report'],
        ['1. Open "Summary" for executive KPIs and totals.'],
        ['2. Use the filter dropdowns in every data sheet header row.'],
        ['3. Open "Chart Data" and insert charts from grouped series (Series, Label, Value).'],
        ['4. Print each sheet in landscape mode for board-ready reports.'],
      ])
      instructionsSheet['!cols'] = [{ wch: 86 }]
      styleTitleCell(instructionsSheet, 'A1')
      styleHeaderRow(instructionsSheet, 2, 1)
      instructionsSheet['!pageSetup'] = {
        orientation: 'portrait',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
      }
      XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Report Guide')

      XLSX.utils.book_append_sheet(workbook, makeDataSheet(analyticsRows, 'KPI Analytics Overview'), 'KPI Analytics')
      XLSX.utils.book_append_sheet(workbook, makeDataSheet(chartDataRows, 'Chart Data (Use Insert -> Charts)'), 'Chart Data')
      XLSX.utils.book_append_sheet(workbook, makeDataSheet(resourcesRows, 'Resource Inventory Report'), 'Resources')
      XLSX.utils.book_append_sheet(workbook, makeDataSheet(bookingsRows, 'Bookings Operational Report'), 'Bookings')
      XLSX.utils.book_append_sheet(workbook, makeDataSheet(ticketsRows, 'Tickets Service Report'), 'Tickets')
      XLSX.utils.book_append_sheet(workbook, makeDataSheet(usersRows, 'Users and Roles Report'), 'Users')
      XLSX.utils.book_append_sheet(workbook, makeDataSheet(topUsersRows, 'Top Booking Users'), 'Top Booking Users')
      XLSX.utils.book_append_sheet(workbook, makeDataSheet(topResourcesRows, 'Top Reserved Resources'), 'Top Resources')
      XLSX.utils.book_append_sheet(workbook, makeDataSheet(utilizationRows, 'Resource Utilization by Hours'), 'Utilization')
      XLSX.utils.book_append_sheet(workbook, makeDataSheet(dailyActivityRows, 'Daily Activity Trend'), 'Daily Activity')

      const dateStamp = generatedAt.toISOString().slice(0, 10)
      XLSX.writeFile(workbook, `admin-advanced-report-${dateStamp}.xlsx`)
    } catch (exportError) {
      console.error('Failed to export report:', exportError)
      alert('Failed to export report. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [apiBaseUrl, token])

  useEffect(() => {
    if (!apiBaseUrl || !token) return undefined

    const intervalId = window.setInterval(() => {
      fetchData({ silent: true })
    }, 5000)

    return () => window.clearInterval(intervalId)
  }, [apiBaseUrl, token])

  // Calculate metrics from actual data
  const pendingBookings = data.bookings.filter(b => b.status === 'PENDING').length
  const openTickets = data.tickets.filter(t => t.status === 'OPEN').length
  const criticalTickets = data.tickets.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH').length

  const metrics = [
    {
      label: 'Total resources',
      value: data.resources.length,
      subtitle: 'in the catalogue',
      icon: Package,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      label: 'Pending bookings',
      value: pendingBookings,
      subtitle: 'awaiting your approval',
      icon: CalendarClock,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Open tickets',
      value: openTickets,
      subtitle: 'need attention',
      icon: AlertCircle,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
    },
    {
      label: 'Critical issues',
      value: criticalTickets,
      subtitle: 'high or critical priority',
      icon: Activity,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ]

  // Get recent bookings (last 5)
  const recentBookings = data.bookings
    .sort((a, b) => new Date(b.createdAt || b.startTime) - new Date(a.createdAt || a.startTime))
    .slice(0, 5)
    .map(booking => ({
      item: booking.resourceName || booking.resource?.name || 'Unknown Resource',
      user: booking.userName || booking.user?.name || 'Unknown User',
      time: booking.startTime ? new Date(booking.startTime).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'N/A',
      status: booking.status,
    }))

  const pendingApprovalBookings = data.bookings
    .filter((booking) => booking.status === 'PENDING')
    .sort((a, b) => new Date(b.createdAt || b.startTime) - new Date(a.createdAt || a.startTime))
    .slice(0, 5)
    .map((booking) => ({
      id: booking.id,
      item: booking.resourceName || booking.resource?.name || 'Unknown Resource',
      user: booking.userName || booking.user?.name || 'Unknown User',
      time: booking.startTime
        ? new Date(booking.startTime).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'N/A',
      status: booking.status,
    }))

  // Get recent tickets (last 5 open or in_progress)
  const recentTickets = data.tickets
    .filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(ticket => ({
      id: `#TK-${ticket.id.toString().padStart(3, '0')}`,
      title: ticket.title,
      status: ticket.status,
      priority: ticket.priority,
    }))

  // Calculate utilization by resource type
  const resourcesByType = data.resources.reduce((acc, r) => {
    const type = r.type || 'OTHER'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  const totalResources = data.resources.length || 1
  const utilization = Object.entries(resourcesByType)
    .map(([label, count]) => ({
      label: label.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
      value: Math.round((count / totalResources) * 100),
    }))
    .slice(0, 3)

  if (utilization.length === 0) {
    utilization.push(
      { label: 'Resources', value: 0 },
      { label: 'Utilization', value: 0 },
      { label: 'Capacity', value: 0 }
    )
  }

  const handleApproveBooking = async (id) => {
    try {
      setBookingActionLoadingId(id)
      await approveBooking({ baseUrl: apiBaseUrl, token, id })
      setData((prev) => ({
        ...prev,
        bookings: prev.bookings.map((booking) =>
          booking.id === id ? { ...booking, status: 'APPROVED' } : booking,
        ),
      }))
    } catch (err) {
      alert(err.message || 'Failed to approve booking.')
    } finally {
      setBookingActionLoadingId(null)
    }
  }

  const handleRejectBooking = async (id) => {
    const reason = window.prompt('Enter rejection reason:')
    if (reason === null || !reason.trim()) return

    try {
      setBookingActionLoadingId(id)
      await rejectBooking({ baseUrl: apiBaseUrl, token, id, reason: reason.trim() })
      setData((prev) => ({
        ...prev,
        bookings: prev.bookings.map((booking) =>
          booking.id === id ? { ...booking, status: 'REJECTED', rejectReason: reason.trim() } : booking,
        ),
      }))
    } catch (err) {
      alert(err.message || 'Failed to reject booking.')
    } finally {
      setBookingActionLoadingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-gray-500">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Failed to load data</h3>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* SECTION 1: PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh data
          </button>
          <button
            onClick={handleExportReport}
            disabled={exporting}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FileText className="h-4 w-4" />
            {exporting ? 'Exporting...' : 'Export report'}
          </button>
        </div>
      </div>

      {/* SECTION 2: METRICS ROW */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-gray-300 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <p className="text-xs text-gray-400 mt-1">{metric.subtitle}</p>
              </div>
              <div className={`${metric.iconBg} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                <metric.icon className={`h-5 w-5 ${metric.iconColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SECTION 3: MAIN GRID */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-base font-semibold text-gray-900">Recent bookings</h2>
            <Link to="/admin/bookings" className="text-sm text-indigo-600 hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Requested by</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date & time</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {recentBookings.length > 0 ? (
                  recentBookings.map((row) => (
                    <tr key={`${row.item}-${row.user}-${row.time}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.item}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.user}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{row.time}</td>
                      <td className="px-6 py-4 text-right">
                        <StatusPill status={row.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <CalendarClock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No bookings yet</p>
                      <p className="text-xs text-gray-400 mt-1">Booking requests will appear here</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resource Breakdown Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Resources by type</h2>
          <div className="space-y-6">
            {utilization.map((item, idx) => (
              <div key={item.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="h-full rounded-full bg-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-6 pt-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xl font-bold text-gray-900">{data.resources.filter(r => r.status === 'ACTIVE').length}</p>
              <p className="text-xs text-gray-400 mt-0.5">Active resources</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{data.resources.filter(r => r.status === 'OUT_OF_SERVICE').length}</p>
              <p className="text-xs text-gray-400 mt-0.5">Out of service</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: PENDING APPROVALS */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-900">Pending booking approvals</h2>
          <Link to="/admin/bookings?status=PENDING" className="text-sm text-indigo-600 hover:underline">View all pending</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Requested by</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date & time</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {pendingApprovalBookings.length > 0 ? (
                pendingApprovalBookings.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.item}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{row.user}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{row.time}</td>
                    <td className="px-6 py-4"><StatusPill status={row.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApproveBooking(row.id)}
                          disabled={bookingActionLoadingId === row.id}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectBooking(row.id)}
                          disabled={bookingActionLoadingId === row.id}
                          className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                    No pending bookings right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: BOTTOM GRID */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Open Tickets Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold text-gray-900">Open tickets</h2>
              {openTickets > 0 && (
                <span className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-2 py-0.5">
                  {openTickets} active
                </span>
              )}
            </div>
            <Link to="/admin/tickets" className="text-sm text-indigo-600 hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {recentTickets.length > 0 ? (
                  recentTickets.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-xs font-medium text-indigo-600">{row.id}</p>
                        <p className="text-sm font-medium text-gray-900 mt-0.5 truncate max-w-[220px]">{row.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusPill status={row.priority} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <StatusPill status={row.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">No open tickets</p>
                      <p className="text-xs text-gray-400 mt-1">All issues have been resolved</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Quick actions</h2>
          <div className="space-y-3">
            <Link to="/admin/bookings?status=PENDING" className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group w-full text-left">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <CalendarClock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Review pending bookings</p>
                <p className="text-xs text-gray-400 mt-0.5">{pendingBookings} requests waiting</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link to="/admin/tickets?status=OPEN" className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group w-full text-left">
              <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-4 w-4 text-rose-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Manage open tickets</p>
                <p className="text-xs text-gray-400 mt-0.5">{openTickets} tickets need attention</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link to="/admin/users" className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group w-full text-left">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Manage users</p>
                <p className="text-xs text-gray-400 mt-0.5">Edit roles and remove accounts</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
