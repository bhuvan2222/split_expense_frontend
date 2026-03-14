import { useAppSelector } from '../store/hooks';

export const useOfflineSync = () => {
  const queue = useAppSelector((state) => state.offline.queue);
  return {
    isSyncing: false,
    pending: queue.length
  };
};
