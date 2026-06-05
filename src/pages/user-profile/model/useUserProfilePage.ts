import { useCallback, useMemo, useState } from 'react';
import {
  fetchPublicUserProfile,
  getFriendsFeatureErrorMessage,
  removeFriend,
  sendFriendRequest,
  type PublicUserProfile,
} from '@/features/friends';
import { useAsyncRequest } from '@/shared/hooks/useAsyncRequest';

const getLoadErrorMessage = (error: unknown) =>
  getFriendsFeatureErrorMessage(error, 'Не удалось загрузить профиль игрока');

const getActionErrorMessage = (error: unknown) =>
  getFriendsFeatureErrorMessage(error, 'Не удалось выполнить действие');

export const useUserProfilePage = (userId: string | undefined) => {
  const [optimisticProfile, setOptimisticProfile] = useState<PublicUserProfile | null>(null);
  const [actionStatus, setActionStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [actionError, setActionError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!userId) throw new Error('Не указан пользователь');
    return fetchPublicUserProfile(userId);
  }, [userId]);

  const { data, status, error, retry } = useAsyncRequest({
    request: loadProfile,
    mapError: getLoadErrorMessage,
    onSuccess: setOptimisticProfile,
  });

  const profile = optimisticProfile ?? data;

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

