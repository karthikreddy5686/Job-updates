export function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ');
}

export function formatRelativeTime(dateInput?: string | Date | null): string {
  if (!dateInput) return 'Recently';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'Recently';

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0 || diffMs < 60 * 1000) {
    return 'Just now';
  }
  const diffMins = Math.floor(diffMs / (60 * 1000));
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) {
    return 'Yesterday';
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
