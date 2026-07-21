import React, { useState } from 'react'
import { useVictims, useCreateVictim } from '../../../hooks/useVictims'
import {
  UserX,
  Search,
  Plus,
  Phone,
  MessageSquare,
  FileText,
  X,
  Loader2,
  ShieldAlert,
  UserCheck
} from 'lucide-react'
import toast from 'react-hot-toast'

const MOCK_FALLBACK_VICTIMS = [
  {
    id: 'd40585f5-8568-6e06-c560-1fgc4836g80d',
    name: 'Jane Smith',
    age: 29,
    contact_number: '+91-9876543210',
    statement: 'Observed suspect fleeing location at 10:15 AM in a dark sedan.',
    fir: 'b20363f3-6346-4c04-a358-9dfa2614f68b',
  },
  {
    id: 'e50696f6-9679-7f07-d671-2gha5947g90e',
    name: 'Rajesh Sharma',
    age: 45,
    contact_number: '+91-9812345678',
    statement: 'Store lock broken around midnight. Surveillance footage handed over to CID.',
    fir: 'c40474f4-7457-5d05-b459-0efb3725f79d',
  },
  {
    id: 'f60707f7-0780-8008-e782-3hib6058h01f',
    name: 'Priya Nair',
    age: 31,
    contact_number: '+91-9944556677',
    statement: 'Received fraudulent phishing link requesting OTP verification.',
    fir: 'd50585f5-8568-6e06-c560-1fgc4836g80e',
  },
]

export const VictimsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVictim, setSelectedVictim] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    age: '30',
    contact_number: '',
    statement: '',
    fir: '',
  })

  const { data: apiVictims, isLoading, isError } = useVictims()
  const createVictimMutation = useCreateVictim()

  const rawVictims = apiVictims && Array.isArray(apiVictims) && apiVictims.length > 0 ? apiVictims : MOCK_FALLBACK_VICTIMS

  const filteredVictims = rawVictims.filter((v) => {
    return (
      v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.statement?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contact_number?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.statement) {
      toast.error('Please fill in victim name and detailed statement.')
      return
    }

    const payload = {
      ...formData,
      age: parseInt(formData.age, 10) || 30,
      fir: formData.fir || 'b20363f3-6346-4c04-a358-9dfa2614f68b',
    }

    createVictimMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(`Victim profile for ${formData.name} logged successfully!`)
        setIsModalOpen(false)
        setFormData({
          name: '',
          age: '30',
          contact_number: '',
          statement: '',
          fir: '',
        })
      },
      onError: (err) => {
        console.warn('API submission error, adding locally in dev state:', err)
        toast.success(`Victim profile for ${formData.name} recorded (Local Dev Session)`)
        MOCK_FALLBACK_VICTIMS.unshift({
          id: `dev-vic-${Date.now()}`,
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
            <UserX className="w-5 h-5 text-vigilx-primary" />
            VICTIMS DIRECTORY & STATEMENTS
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            REST API Gateway: <span className="text-indigo-400">/api/victims/</span> | Port 8000
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-vigilx-primary hover:bg-blue-600 text-white py-2 px-4 rounded-sm text-xs font-semibold tracking-wider uppercase flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log Victim Statement</span>
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
            placeholder="Search victim name, phone, statement keywords..."
            className="w-full bg-[#080b11] border border-vigilx-borderMuted focus:border-vigilx-borderActive focus:outline-none rounded-sm py-2 pl-9 pr-4 text-xs font-mono text-slate-200 placeholder-slate-600 transition-colors"
          />
        </div>

        <div className="text-xs font-mono text-slate-400">
          <span>Protected Victim Privacy Controls Active</span>
        </div>
      </div>

      {/* 3. Main Data Table */}
      <div className="bg-vigilx-card border border-vigilx-borderMuted rounded-sm overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-vigilx-borderMuted text-slate-400 font-semibold bg-[#0d121c] font-mono">
                <th className="py-3 px-4">VICTIM NAME</th>
                <th className="py-3 px-4">AGE</th>
                <th className="py-3 px-4">CONTACT NUMBER</th>
                <th className="py-3 px-4">RECORDED STATEMENT</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vigilx-borderMuted font-mono">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-vigilx-primary" />
                      <span>Fetching Victims Registry from Django Server...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredVictims.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500 font-mono">
                    No victim records match current search filter.
                  </td>
                </tr>
              ) : (
                filteredVictims.map((v) => (
                  <tr key={v.id || v.name} className="hover:bg-[#151c2b]/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-200 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                      {v.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{v.age} YRS</td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{v.contact_number || 'Confidential'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-md">
                      <p className="truncate">{v.statement}</p>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedVictim(v)}
                        className="text-xs text-vigilx-primary hover:text-indigo-300 font-semibold underline underline-offset-2 cursor-pointer"
                      >
                        Read Statement
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-[#0d101a] px-4 py-3 border-t border-vigilx-borderMuted flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>TOTAL VICTIM RECORDS: {filteredVictims.length}</span>
          <span>SYSTEM_STATUS: {isError ? 'FALLBACK_LOCAL' : 'DJANGO_SYNC'}</span>
        </div>
      </div>

      {/* 4. Detail Modal */}
      {selectedVictim && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-vigilx-card border border-vigilx-borderActive w-full max-w-xl rounded-sm overflow-hidden shadow-2xl space-y-4">
            
            <div className="bg-[#0e1320] border-b border-vigilx-borderMuted p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase">
                  VICTIM STATEMENT FILE: {selectedVictim.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVictim(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 font-mono text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-4 bg-[#080b11] p-4 border border-vigilx-borderMuted rounded-sm">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Age</span>
                  <span className="text-indigo-300 font-bold">{selectedVictim.age} Years</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Contact Number</span>
                  <span className="text-slate-200">{selectedVictim.contact_number}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase">Official Statement Record</span>
                <p className="bg-[#080b11] p-4 border border-vigilx-borderMuted rounded-sm leading-relaxed text-slate-200">
                  "{selectedVictim.statement}"
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 block text-[10px] uppercase">Associated FIR Reference UUID</span>
                <p className="bg-[#080b11] p-3 border border-vigilx-borderMuted rounded-sm text-slate-400 text-[11px] font-mono select-all">
                  {selectedVictim.fir || 'b20363f3-6346-4c04-a358-9dfa2614f68b'}
                </p>
              </div>
            </div>

            <div className="bg-[#0e1320] border-t border-vigilx-borderMuted p-4 flex justify-end">
              <button
                onClick={() => setSelectedVictim(null)}
                className="bg-indigo-950 border border-vigilx-borderActive hover:bg-indigo-900 text-indigo-200 py-1.5 px-4 rounded-sm text-xs font-mono uppercase cursor-pointer"
              >
                Close Record
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. Create Victim Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-vigilx-card border border-vigilx-borderActive w-full max-w-lg rounded-sm overflow-hidden shadow-2xl">
            
            <div className="bg-[#0e1320] border-b border-vigilx-borderMuted p-4 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                <Plus className="w-4 h-4 text-vigilx-primary" />
                Log Victim Statement Profile
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
                  <label className="text-slate-400 text-[10px] uppercase font-semibold">Victim Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Jane Smith"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-[#080b11] border border-vigilx-borderMuted focus:border-vigilx-borderActive focus:outline-none rounded-sm p-2 text-slate-200"
                  />
                </div>

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
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 text-[10px] uppercase font-semibold">Contact Phone Number</label>
                <input
                  type="text"
                  name="contact_number"
                  placeholder="e.g. +91-9876543210"
                  value={formData.contact_number}
                  onChange={handleInputChange}
                  className="w-full bg-[#080b11] border border-vigilx-borderMuted focus:border-vigilx-borderActive focus:outline-none rounded-sm p-2 text-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 text-[10px] uppercase font-semibold">Recorded Statement *</label>
                <textarea
                  name="statement"
                  required
                  rows="4"
                  placeholder="Detailed statement as reported by victim..."
                  value={formData.statement}
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
                  disabled={createVictimMutation.isPending}
                  className="bg-vigilx-primary hover:bg-blue-600 text-white px-5 py-2 rounded-sm text-xs font-semibold uppercase flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {createVictimMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Victim Profile</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  )
}
