import { MenuItem, Menu, TimeRange } from './types';
import { format, isWithinInterval, parse } from 'date-fns';

export function isTimeRangeActive(timeRanges?: TimeRange[]): boolean {
  // If no time ranges specified, available all day
  if (!timeRanges || timeRanges.length === 0) return true;
  
  const now = new Date();
  const currentTime = format(now, 'HH:mm');
  
  return timeRanges.some((range) => {
    const start = parse(range.startTime, 'HH:mm', now);
    const end = parse(range.endTime, 'HH:mm', now);
    const current = parse(currentTime, 'HH:mm', now);
    
    return isWithinInterval(current, { start, end });
  });
}

export function isMenuAvailableNow(menu: Menu): boolean {
  if (!menu.isActive) return false;
  return isTimeRangeActive(menu.timeRanges);
}

export function isItemAvailableNow(item: MenuItem, menu: Menu): boolean {
  // Item must be marked as available
  if (!item.isAvailable) return false;
  
  // Item inherits time availability from its menu
  return isMenuAvailableNow(menu);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function calculateAverageRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function getTimeRangeDisplay(range: TimeRange): string {
  return `${range.startTime} - ${range.endTime}`;
}

