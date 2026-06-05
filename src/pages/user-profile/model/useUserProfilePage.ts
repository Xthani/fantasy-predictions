import { useCallback, useMemo, useState } from 'react';
import {
  fetchFriendDuels,
  fetchPublicUserProfile,
  getFriendsFeatureErrorMessage,
  removeFriend,
  sendFriendRequest,
  type FriendDuelsResponse,
  type PublicUserProfile,
} from '@/features/friends';
import { useAsyncRequest } from '@/shared/hooks/useAsyncRequest';

const getLoadErrorMessage = (error: unknown) =>
  getFriendsFeatureErrorMessage(error, 'Не удалось загрузить профиль игрока');

const getActionErrorMessage = (error: unknown) =>
  getFriendsFeatureErrorMessage(error, 'Не удалось выполнить действие');

type UserProfileData = {
  profile: PublicUserProfile;
  duels: FriendDuelsResponse | null;
};

export const useUserProfilePage = (userId: string | undefined) => {
  const [optimisticProfile, setOptimisticProfile] = useState<PublicUserProfile | null>(null);
  const [actionStatus, setActionStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [actionError, setActionError] = useState<string | null>(null);

  const loadProfile = useCallback(async (): Promise<UserProfileData> => {
    if (!userId) throw new Error('Не указан пользователь');

    const profile = await fetchPublicUserProfile(userId);
    if (profile.friendshipStatus !== 'friend') {
      return { profile, duels: null };
    }

    const duels = await fetchFriendDuels(userId);
    return { profile, duels };
  }, [userId]);

  const { data, status, error, retry } = useAsyncRequest({
    request: loadProfile,
    mapError: getLoadErrorMessage,
    onSuccess: (result) => setOptimisticProfile(result.profile),
  });

  const profile = optimisticProfile ?? data?.profile;
  const duels = data?.duels ?? null;

  const sendRequest = useCallback(async () => {
    if (!profile) return;

    setActionStatus('loading');
    setActionError(null);

    try {
      await sendFriendRequest(profile.user.id);
      setOptimisticProfile({
        ...profile,
        friendshipStatus: 'outgoing',
      });
      setActionStatus('idle');
    } catch (e) {
      setActionStatus('error');
      setActionError(getActionErrorMessage(e));
    }
  }, [profile]);

  const removeCurrentFriend = useCallback(async () => {
    if (!profile) return;

    setActionStatus('loading');
    setActionError(null);

    try {
      await removeFriend(profile.user.id);
      setOptimisticProfile({
        ...profile,
        friendshipStatus: 'none',
      });
      setActionStatus('idle');
    } catch (e) {
      setActionStatus('error');
      setActionError(getActionErrorMessage(e));
    }
  }, [profile]);

  const actionLabel = useMemo(() => {
    if (!profile) return '';
    if (profile.friendshipStatus === 'self') return 'Это ты';
    if (profile.friendshipStatus === 'friend') return 'Удалить из друзей';
    if (profile.friendshipStatus === 'incoming') return 'Есть входящая заявка';
    if (profile.friendshipStatus === 'outgoing') return 'Заявка отправлена';
    return 'Добавить в друзья';
  }, [profile]);

  return {
    profile,
    duels,
    status,
    error,
    retry,
    actionStatus,
    actionError,
    actionLabel,
    sendRequest,
    removeCurrentFriend,
  };
};
