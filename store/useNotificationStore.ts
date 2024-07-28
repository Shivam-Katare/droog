import { supabase } from '@/lib/supabaseClient';
import { create } from 'zustand';

interface NotificationState {
  weeklyTips: boolean;
  dailyReminder: boolean;
  userId: string | null;
  setUserId: (userId: string) => void;
  fetchNotificationPreferences: () => Promise<void>;
  updateNotificationPreference: (type: 'weeklyTips' | 'dailyReminder', value: boolean) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  weeklyTips: false,
  dailyReminder: false,
  userId: null,
  setUserId: (userId) => set({ userId }),
  fetchNotificationPreferences: async () => {
    const { userId } = get();
    if (!userId) return;

    const { data, error } = await supabase
      .from('user_notifications')
      .select('weekly_notifications, daily_notifications')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching notification preferences:', error);
      return;
    }

    if (data) {
      set({
        weeklyTips: data.weekly_notifications,
        dailyReminder: data.daily_notifications,
      });
    }
  },
  updateNotificationPreference: async (type, value) => {
    const { userId } = get();
    if (!userId) return;

    const column = type === 'weeklyTips' ? 'weekly_notifications' : 'daily_notifications';

    // Check if user_id exists in the database
    const { data: existingUser, error: fetchError } = await supabase
      .from('user_notifications')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: No rows found
      console.error('Error fetching user for update:', fetchError);
      return;
    }

    if (!existingUser) {
      // If user_id does not exist, insert a new row
      const { error: insertError } = await supabase
        .from('user_notifications')
        .insert({ user_id: userId, [column]: value });

      if (insertError) {
        console.error('Error inserting new user:', insertError);
        return;
      }
    } else {
      // If user_id exists, update the respective column
      const { error: updateError } = await supabase
        .from('user_notifications')
        .update({ [column]: value })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating notification preference:', updateError);
        return;
      }
    }

    // Update the state
    set({ [type]: value });
  },
}));