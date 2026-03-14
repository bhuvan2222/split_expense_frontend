import { useAppSelector } from '../store/hooks';

export const usePremium = () => {
  const user = useAppSelector((state) => state.auth.user);
  const isPremium = Boolean(user?.isPremium);
  return {
    isPremium,
    premiumExpiresAt: user?.premiumExpiresAt ?? null
  };
};
