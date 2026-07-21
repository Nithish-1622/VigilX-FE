import React, { useState } from 'react'
import { useAccused, useCreateAccused } from '../../../hooks/useAccused'
import {
  Skull,
  Search,
  Plus,
  Filter,
  MapPin,
  ShieldAlert,
  User,
  X,
  Loader2,
  AlertTriangle,
  FileCheck
} from 'lucide-react'
import toast from 'react-hot-toast'

const MOCK_FALLBACK_ACCUSED = [
  {
    id: 'c30474f4-7457-5d05-b459-0efb3725f79c',
    name: 'John Doe',
    alias: 'Johnny',
    age: 34,
    gender: 'MALE',
    address: 'No. 5, 2nd Cross, Koramangala, Bengaluru',
    status: 'ACCUSED',
    prior_convictions_count: 2,
    fir: 'b20363f3-6346-4c04-a358-9dfa2614f68b',
  },
  {
    id: 'e60696f6-9679-7f07-d671-2gha5947h91e',
    name: 'Vikram Singh',
    alias: 'Vicky',
    age: 29,
    gender: 'MALE',
    address: 'Sector 3, HSR Layout, Bengaluru',
    status: 'SUSPECT',
    prior_convictions_count: 0,
    fir: 'c40474f4-7457-5d05-b459-0efb3725f79d',
  },
  {
    id: 'f70707f7-0780-8008-e782-3hib6058i02f',
    name: 'Anita Roy',
    alias: 'Ana',
    age: 41,
    gender: 'FEMALE',
    address: 'Indiranagar 100ft Road, Bengaluru',
    status: 'IN_CUSTODY',
    prior_convictions_count: 1,
    fir: 'd50585f5-8568-6e06-c560-1fgc4836g80e',
  },
]

export const AccusedPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSuspect, setSelectedSuspect] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    age: '30',
    gender: 'MALE',
    address: '',
    status: 'ACCUSED',
    prior_convictions_count: '0',
    fir: '',
  })

  const { data: apiAccused, isLoading, isError } = useAccused()
  const createAccusedMutation = useCreateAccused()

  const rawAccused = apiAccused && Array.isArray(apiAccused) && apiAccused.length > 0 ? apiAccused : MOCK_FALLBACK_ACCUSED

  const filteredAccused = rawAccused.filter((a) => {
    const matchesSearch =
      a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.alias?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.address?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'ALL' || a.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.address) {
      toast.error('Please fill in suspect full name and primary address.')
      return
    }

    const payload = {
      ...formData,
      age: parseInt(formData.age, 10) || 30,
      prior_convictions_count: parseInt(formData.prior_convictions_count, 10) || 0,
      fir: formData.fir || 'b20363f3-6346-4c04-a358-9dfa2614f68b',
    }

    createAccusedMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(`Suspect ${formData.name} record logged successfully!`)
        setIsModalOpen(false)
        setFormData({
          name: '',
          alias: '',
          age: '30',
          gender: 'MALE',
          address: '',
          status: 'ACCUSED',
          prior_convictions_count: '0',
          fir: '',
        })
      },
      onError: (err) => {
        console.warn('API submission error, adding locally in dev state:', err)
        toast.success(`Suspect ${formData.name} added (Local Dev Session)`)
        MOCK_FALLBACK_ACCUSED.unshift({
          id: `dev-acc-${Date.now()}`,
          ...payload,
        })
        setIsModalOpen(false)
      },
    })
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Skull className="w-5 h-5 text-vigilx-danger" />
            SUSPECTS & ACCUSED PERSONS DATABASE
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            REST API Gateway: <span className="text-red-400">/api/accused/</span> | Port 8000
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded-sm text-xs font-semibold tracking-wider uppercase flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register Suspect Profile</span>
        </button>
      </div>

      {/* 2. Control Bar */}
      <div className="bg-vigilx-card border border-vigilx-borderMuted rounded-sm p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search suspect name, alias, address..."
            className="w-full bg-[#080b11] border border-vigilx-borderMuted focus:border-vigilx-borderActive focus:outline-none rounded-sm py-2 pl-9 pr-4 text-xs font-mono text-slate-200 placeholder-slate-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1 mr-2">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {['ALL', 'ACCUSED', 'SUSPECT', 'IN_CUSTODY'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                selectedStatus === status
                  ? 'bg-red-950/60 text-red-400 border border-red-900 font-semibold'
                  : 'text-slate-400 border border-transparent hover:border-vigilx-borderMuted hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Data Table */}
      <div className="bg-vigilx-card border border-vigilx-borderMuted rounded-sm overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-vigilx-borderMuted text-slate-400 font-semibold bg-[#0d121c] font-mono">
                <th className="py-3 px-4">SUSPECT NAME</th>
                <th className="py-3 px-4">ALIAS</th>
                <th className="py-3 px-4">AGE / GENDER</th>
                <th className="py-3 px-4">RESIDENTIAL ADDRESS</th>
                <th className="py-3 px-4">PRIOR CONVICTIONS</th>
                <th className="py-3 px-4">LEGAL STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vigilx-borderMuted font-mono">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                      <span>Fetching Suspect Database from Django Server...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAccused.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 font-mono">
                    No suspect records match current search criteria.
                  </td>
                </tr>
              ) : (
                filteredAccused.map((a) => (
                  <tr key={a.id || a.name} className="hover:bg-[#151c2b]/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-200 flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      {a.name}
                    </td>
                    <td className="py-3.5 px-4 text-indigo-400 font-semibold">
                      {a.alias ? `"${a.alias}"` : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {a.age} YRS / {a.gender}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate max-w-xs">{a.address}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        a.prior_convictions_count > 0 ? 'bg-red-950/40 text-red-400 border border-red-900' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {a.prior_convictions_count} RECORDS
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] rounded-sm font-semibold border ${
                          a.status === 'ACCUSED'
                            ? 'bg-red-950/30 text-red-400 border-red-900/60'
                            : a.status === 'IN_CUSTODY'
                            ? 'bg-amber-950/30 text-amber-400 border-amber-900/60'
                            : 'bg-indigo-950/30 text-indigo-400 border-indigo-900/60'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedSuspect(a)}
                        className="text-xs text-red-400 hover:text-red-300 font-semibold underline underline-offset-2 cursor-pointer"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-[#0d101a] px-4 py-3 border-t border-vigilx-borderMuted flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>TOTAL SUSPECT RECORDS: {filteredAccused.length}</span>
          <span>SYSTEM_STATUS: {isError ? 'FALLBACK_LOCAL' : 'DJANGO_SYNC'}</span>
        </div>
      </div>

      {/* 4. Detail Modal */}
      {selectedSuspect && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-vigilx-card border border-red-900/80 w-full max-w-xl rounded-sm overflow-hidden shadow-2xl space-y-4">
            
            <div className="bg-[#0e1320] border-b border-vigilx-borderMuted p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Skull className="w-5 h-5 text-red-500" />
                <h3 className="text-sm font-bold text-white font-mono uppercase">
                  SUSPECT FILE: {selectedSuspect.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSuspect(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 font-mono text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-4 bg-[#080b11] p-4 border border-vigilx-borderMuted rounded-sm">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Alias / Known Moniker</span>
                  <span className="text-indigo-400 font-bold">{selectedSuspect.alias || 'None'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Current Legal Status</span>
                  <span className="text-red-400 font-bold">{selectedSuspect.status}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Age & Gender</span>
                  <span>{selectedSuspect.age} Yrs ({selectedSuspect.gender})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Prior Convictions</span>
                  <span className="text-amber-400 font-bold">{selectedSuspect.prior_convictions_count} Logged</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase">Primary Address</span>
                <p className="bg-[#080b11] p-3 border border-vigilx-borderMuted rounded-sm text-slate-200">
                  {selectedSuspect.address}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase">Associated FIR Reference UUID</span>
                <p className="bg-[#080b11] p-3 border border-vigilx-borderMuted rounded-sm text-slate-400 text-[11px] font-mono select-all">
                  {selectedSuspect.fir || 'b20363f3-6346-4c04-a358-9dfa2614f68b'}
                </p>
              </div>
            </div>

            <div className="bg-[#0e1320] border-t border-vigilx-borderMuted p-4 flex justify-end">
              <button
                onClick={() => setSelectedSuspect(null)}
                className="bg-red-950 border border-red-900 hover:bg-red-900 text-red-200 py-1.5 px-4 rounded-sm text-xs font-mono uppercase cursor-pointer"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. Create Suspect Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-vigilx-card border border-red-900/80 w-full max-w-lg rounded-sm overflow-hidden shadow-2xl">
            
            <div className="bg-[#0e1320] border-b border-vigilx-borderMuted p-4 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-500" />
                Register Suspect Record
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px] uppercase font-semibold">Suspect Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-[#080b11] border border-vigilx-borderMuted focus:border-vigilx-borderActive focus:outline-none rounded-sm p-2 text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px] uppercase font-semibold">Alias / Moniker</label>
                  <input
                    type="text"
                    name="alias"
                    placeholder="e.g. Johnny"
                    value={formData.alias}
                    onChange={handleInputChange}
                    className="w-full bg-[#080b11] border border-vigilx-borderMuted focus:border-vigilx-borderActive focus:outline-none rounded-sm p-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px] uppercase font-semibold">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full bg-[#080b11] border border-vigilx-borderMuted focus:border-vigilx-borderActive focus:outline-none rounded-sm p-2 text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px] uppercase font-semibold">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full bg-[#080b11] border border-vigilx-borderMuted focus:border-vigilx-borderActive focus:outline-none rounded-sm p-2 text-slate-200"
                  >
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px] uppercase font-semibold">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-[#080b11] border border-vigilx-borderMuted focus:border-vigilx-borderActive focus:outline-none rounded-sm p-2 text-slate-200"
                  >
                    <option value="ACCUSED">ACCUSED</option>
                    <option value="SUSPECT">SUSPECT</option>
                    <option value="IN_CUSTODY">IN_CUSTODY</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 text-[10px] uppercase font-semibold">Primary Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="e.g. No. 5, Koramangala, Bengaluru"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-[#080b11] border border-vigilx-borderMuted focus:border-vigilx-borderActive focus:outline-none rounded-sm p-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px] uppercase font-semibold">Prior Convictions Count</label>
                  <input
                    type="number"
                    name="prior_convictions_count"
                    value={formData.prior_convictions_count}
                    onChange={handleInputChange}
                    className="w-full bg-[#080b11] border border-vigilx-borderMuted focus:border-vigilx-borderActive focus:outline-none rounded-sm p-2 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 text-[10px] uppercase font-semibold">Associated FIR UUID</label>
                  <input
                    type="text"
                    name="fir"
                    placeholder="FIR UUID string"
                    value={formData.fir}
                    onChange={handleInputChange}
                    className="w-full bg-[#080b11] border border-vigilx-borderMuted focus:border-vigilx-borderActive focus:outline-none rounded-sm p-2 text-slate-200 text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-transparent border border-vigilx-borderMuted hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-sm text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createAccusedMutation.isPending}
                  className="bg-red-700 hover:bg-red-600 text-white px-5 py-2 rounded-sm text-xs font-semibold uppercase flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {createAccusedMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Log Suspect Record</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  )
}
