"use client"

import React, { useEffect, useState } from 'react'
import { Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useNotificationStore } from '@/store/useNotificationStore';
import { useUser } from '@clerk/nextjs';

function Notifications() {
  const user = useUser().user;
  const {
    weeklyTips,
    dailyReminder,
    setUserId,
    fetchNotificationPreferences,
    updateNotificationPreference
  } = useNotificationStore();

  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    if (user) {
      setUserId(user.id);
      fetchNotificationPreferences();
      setIsToggled(false);
    }
  }, [user, isToggled, setUserId, fetchNotificationPreferences]);

  const handleWeeklyTipsChange = (checked: boolean) => {
    updateNotificationPreference('weeklyTips', checked);
    setIsToggled(true);
  };

  const handleDailyReminderChange = (checked: boolean) => {
    updateNotificationPreference('dailyReminder', checked);
    setIsToggled(true);
  };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="weekly-tips" className="flex-1">
              Receive weekly growth insights and inspiring updates
            </Label>
            <Switch
              id="weekly-tips"
              checked={weeklyTips}
              onCheckedChange={handleWeeklyTipsChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="daily-reminder" className="flex-1">
              Get daily reminders to post on social media
            </Label>
            <Switch
              id="daily-reminder"
              checked={dailyReminder}
              onCheckedChange={handleDailyReminderChange}
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Notifications