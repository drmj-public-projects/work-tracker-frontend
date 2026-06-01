import { create } from 'zustand'

interface InvitationCodeState {
  isGenerateModalOpen: boolean
  selectedCodeId: string | null
  statusFilter: string | null

  setGenerateModalOpen: (open: boolean) => void
  setSelectedCodeId: (id: string | null) => void
  setStatusFilter: (status: string | null) => void
  reset: () => void
}

export const useInvitationCodeStore = create<InvitationCodeState>((set) => ({
  isGenerateModalOpen: false,
  selectedCodeId: null,
  statusFilter: null,

  setGenerateModalOpen: (open) => set({ isGenerateModalOpen: open }),
  setSelectedCodeId: (id) => set({ selectedCodeId: id }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  reset: () =>
    set({
      isGenerateModalOpen: false,
      selectedCodeId: null,
      statusFilter: null,
    }),
}))
