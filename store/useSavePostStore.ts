// store/useStore.ts
import {create} from 'zustand';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

interface SavedPost {
  id: string;
  postContent: string;
  created_at: string;
  post_type: string;
}

interface SavedPostsState {
  savedPosts: SavedPost[];
  totalPosts: number;
  currentPage: number;
  postsPerPage: number;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  searchTerm: string;
  loading: boolean;
  selectedPosts: string[];
  fetchSavedPosts: (
    userId: string | undefined, 
    options?: {
      postType?: string;
      dateFilter?: string;
      sortColumn?: string;
      sortDirection?: 'asc' | 'desc';
      searchTerm?: string;
      currentPage?: number;
      postsPerPage?: number;
    }
  ) => Promise<void>;
  
  setCurrentPage: (page: number) => void;
  setPostsPerPage: (count: number) => void;
  setSortColumn: (column: string) => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  setSearchTerm: (term: string) => void;
  togglePostSelection: (postId: string) => void;
  toggleSelectAll: () => void;
  deleteSelectedPosts: (user_id: any) => Promise<void>;
}

export const useSavedPostsStore = create<SavedPostsState>((set, get) => ({
  savedPosts: [],
  totalPosts: 0,
  currentPage: 1,
  postsPerPage: 10,
  sortColumn: 'postContent',
  sortDirection: 'asc',
  searchTerm: '',
  loading: false,
  selectedPosts: [],

  fetchSavedPosts: async (userId: string | undefined, options?: {
    postType?: string;
    dateFilter?: string;
    sortColumn?: string;
    sortDirection?: string;
  }) => {
    set({ loading: true });
    const { sortColumn, sortDirection, searchTerm, currentPage, postsPerPage } = get();
    const { postType, dateFilter } = options || {};
  
    try {
      let query = supabase
        .from('SavedPosts')
        .select('*', { count: 'exact' })
        .order(options?.sortColumn || sortColumn, { ascending: (options?.sortDirection || sortDirection) === 'asc' })
        .range((currentPage - 1) * postsPerPage, currentPage * postsPerPage - 1)
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
  
      if (searchTerm) {
        query = query.ilike('postContent', `%${searchTerm}%`);
      }
  
      if (postType && postType !== 'all') {
        query = query.eq('post_type', postType);
      }
  
      if (dateFilter) {
        const now = new Date();
        let startDate;
        switch (dateFilter) {
          case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          default:
            startDate = null;
        }
        if (startDate) {
          query = query.gte('created_at', startDate.toISOString());
        }
      }
  
      const { data, error, count } = await query;
  
      if (error) throw error;
  
      set({ savedPosts: data || [], totalPosts: count || 0, loading: false });
    } catch (error: any) {
      set({ loading: false });
      toast.error('No Post found');
    }
  },  

  togglePostSelection: (postId: string) => {
    const { selectedPosts } = get();
    const newSelectedPosts = selectedPosts.includes(postId)
      ? selectedPosts.filter(id => id !== postId)
      : [...selectedPosts, postId];
    set({ selectedPosts: newSelectedPosts });
  },
  toggleSelectAll: () => {
    const { savedPosts, selectedPosts } = get();
    const allPostIds = savedPosts.map(post => post.id);
    const newSelectedPosts = selectedPosts.length === savedPosts.length ? [] : allPostIds;
    set({ selectedPosts: newSelectedPosts });
  },

  deleteSelectedPosts: async (user_id: any) => {
    const { selectedPosts } = get();
    if (!selectedPosts.length) return;

    try {
      const { error } = await supabase
        .from('SavedPosts')
        .delete()
        .in('id', selectedPosts);

      if (error) throw error;

      set({ selectedPosts: [] });
      toast.success('Selected posts deleted successfully!');
      get().fetchSavedPosts(user_id);
    } catch (error: any) {
      toast.error('Error deleting selected posts:', error);
    }
  },
  
  setCurrentPage: (page) => set({ currentPage: page }),
  setPostsPerPage: (count) => set({ postsPerPage: count }),
  setSortColumn: (column) => set({ sortColumn: column }),
  setSortDirection: (direction) => set({ sortDirection: direction }),
  setSearchTerm: (term) => set({ searchTerm: term }),
}));
