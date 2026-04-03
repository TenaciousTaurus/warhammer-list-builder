import { create } from 'zustand';
import { supabase } from '../../../shared/lib/supabase';
import type { Organisation, OrganisationMember } from '../../../shared/types/database';

interface OrgState {
  organisations: Organisation[];
  activeOrg: Organisation | null;
  members: OrganisationMember[];
  loading: boolean;
  error: string | null;

  loadMyOrganisations: (userId: string) => Promise<void>;
  loadOrganisation: (orgId: string) => Promise<void>;
  createOrganisation: (data: {
    name: string;
    description?: string;
    is_public?: boolean;
    owner_id: string;
  }) => Promise<string | null>;
  updateOrganisation: (orgId: string, updates: Partial<Organisation>) => Promise<void>;
  joinOrganisation: (shareCode: string, userId: string, displayName: string) => Promise<void>;
  leaveOrganisation: (membershipId: string) => Promise<void>;
  updateMemberRole: (membershipId: string, role: OrganisationMember['role']) => Promise<void>;
  removeMember: (membershipId: string) => Promise<void>;
  clearError: () => void;
}

export const useOrgStore = create<OrgState>()((set, get) => ({
  organisations: [],
  activeOrg: null,
  members: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  loadMyOrganisations: async (userId: string) => {
    set({ loading: true, error: null });

    // Orgs I own
    const { data: owned, error: ownedErr } = await supabase
      .from('organisations')
      .select('*')
      .eq('owner_id', userId);

    if (ownedErr) {
      set({ loading: false, error: ownedErr.message });
      return;
    }

    // Orgs I'm a member of
    const { data: memberships, error: memErr } = await supabase
      .from('organisation_members')
      .select('organisation_id')
      .eq('user_id', userId);

    if (memErr) {
      set({ loading: false, error: memErr.message });
      return;
    }

    const ownedIds = new Set((owned as Organisation[]).map((o) => o.id));
    const memberOrgIds = (memberships ?? [])
      .map((m) => m.organisation_id)
      .filter((id) => !ownedIds.has(id));

    let memberOrgs: Organisation[] = [];
    if (memberOrgIds.length > 0) {
      const { data } = await supabase
        .from('organisations')
        .select('*')
        .in('id', memberOrgIds);
      memberOrgs = (data as Organisation[]) ?? [];
    }

    const all = [...((owned as Organisation[]) ?? []), ...memberOrgs];
    all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    set({ organisations: all, loading: false });
  },

  loadOrganisation: async (orgId: string) => {
    set({ loading: true, error: null });

    const [orgRes, membersRes] = await Promise.all([
      supabase.from('organisations').select('*').eq('id', orgId).single(),
      supabase
        .from('organisation_members')
        .select('*')
        .eq('organisation_id', orgId)
        .order('joined_at', { ascending: true }),
    ]);

    if (orgRes.error) {
      set({ loading: false, error: orgRes.error.message });
      return;
    }

    set({
      activeOrg: orgRes.data as Organisation,
      members: (membersRes.data as OrganisationMember[]) ?? [],
      loading: false,
    });
  },

  createOrganisation: async (data) => {
    set({ error: null });

    const { data: created, error } = await supabase
      .from('organisations')
      .insert({
        owner_id: data.owner_id,
        name: data.name,
        description: data.description,
        is_public: data.is_public ?? false,
      })
      .select()
      .single();

    if (error || !created) {
      set({ error: error?.message ?? 'Failed to create organisation' });
      return null;
    }

    const org = created as Organisation;

    // Auto-add owner as member with 'owner' role
    await supabase.from('organisation_members').insert({
      organisation_id: org.id,
      user_id: data.owner_id,
      role: 'owner',
      display_name: 'Owner',
    });

    set((state) => ({ organisations: [org, ...state.organisations] }));
    return org.id;
  },

  updateOrganisation: async (orgId, updates) => {
    set({ error: null });

    const { error } = await supabase
      .from('organisations')
      .update(updates)
      .eq('id', orgId);

    if (error) {
      set({ error: error.message });
      return;
    }

    set((state) => ({
      organisations: state.organisations.map((o) =>
        o.id === orgId ? { ...o, ...updates } : o
      ),
      activeOrg: state.activeOrg?.id === orgId
        ? { ...state.activeOrg, ...updates }
        : state.activeOrg,
    }));
  },

  joinOrganisation: async (shareCode, userId, displayName) => {
    set({ error: null });

    const { data: org, error: findErr } = await supabase
      .from('organisations')
      .select('id')
      .eq('share_code', shareCode)
      .single();

    if (findErr || !org) {
      set({ error: 'Organisation not found with that code' });
      return;
    }

    const { error: joinErr } = await supabase
      .from('organisation_members')
      .insert({
        organisation_id: org.id,
        user_id: userId,
        display_name: displayName,
        role: 'member',
      });

    if (joinErr) {
      set({ error: joinErr.message });
      return;
    }

    await get().loadMyOrganisations(userId);
  },

  leaveOrganisation: async (membershipId) => {
    set({ error: null });

    const { error } = await supabase
      .from('organisation_members')
      .delete()
      .eq('id', membershipId);

    if (error) {
      set({ error: error.message });
      return;
    }

    set((state) => ({
      members: state.members.filter((m) => m.id !== membershipId),
    }));
  },

  updateMemberRole: async (membershipId, role) => {
    set({ error: null });

    const { error } = await supabase
      .from('organisation_members')
      .update({ role })
      .eq('id', membershipId);

    if (error) {
      set({ error: error.message });
      return;
    }

    set((state) => ({
      members: state.members.map((m) =>
        m.id === membershipId ? { ...m, role } : m
      ),
    }));
  },

  removeMember: async (membershipId) => {
    set({ error: null });

    const { error } = await supabase
      .from('organisation_members')
      .delete()
      .eq('id', membershipId);

    if (error) {
      set({ error: error.message });
      return;
    }

    set((state) => ({
      members: state.members.filter((m) => m.id !== membershipId),
    }));
  },
}));
