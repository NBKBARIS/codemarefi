'use client';
import { useEffect } from 'react';
import { startActivityTracking, stopActivityTracking, recordUserActivity } from '../lib/activityTracker';

export default function ActivityTracker() {
  useEffect(() => {
    // Aktiflik takibini başlat
    startActivityTracking();

    // Mouse ve klavye hareketlerini dinle
    const handleActivity = () => recordUserActivity();
    
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // Cleanup
    return () => {
      stopActivityTracking();
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, []);

  return null; // Bu component görünmez
}
