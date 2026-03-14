import { format } from 'date-fns';

export const formatDate = (date: Date | string) => {
  const value = typeof date === 'string' ? new Date(date) : date;
  return format(value, 'dd MMM yyyy');
};
