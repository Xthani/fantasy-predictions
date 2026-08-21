import { useCallback, useMemo, useState } from 'react';
import type { PublicUser } from '@/features/friends/api/friends';
import {
  acceptFriendRequest,
  declineFriendRequest,
  fetchFriendRequests,
  fetchFriends,
  removeFriend,
  searchUsers,
  sendFriendRequest,
} from '@/features/friends/api/friends';
import { getFriendsFeatureErrorMessage } from '@/features/friends/lib/friendsErrors';
import { useAsyncRequest } from '@/shared/hooks/useAsyncRequest';

const getLoadErrorMessage = (error: unknown) =>
  getFriendsFeatureErrorMessage(error, 'Не удалось загрузить друзей');

const getSearchErrorMessage = (error: unknown) =>
  getFriendsFeatureErrorMessage(error, 'Не удалось выполнить поиск');

const getActionErrorMessage = (error: unknown) =>
  getFriendsFeatureErrorMessage(error, 'Не удалось выполнить действие');

type FriendsPageData = Awaited<ReturnType<typeof loadFriendsPage>>;

const loadFriendsPage = async () => {
  const [friends, requests] = await Promise.all([fetchFriends(), fetchFriendRequests()]);
  return {
    friends: friends.friends,
    incoming: requests.incoming,
    outgoing: requests.outgoing,
  };
};

export const useFriendsPage = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PublicUser[]>([]);
  const [searchStatus, setSearchStatus] = useState<'idle' | 'loading' | 'error' | 'success'>(
    'idle',
  );
  const [searchError, setSearchError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, status, error, retry } = useAsyncRequest<FriendsPageData>({
    request: loadFriendsPage,
    mapError: getLoadErrorMessage,
  });

  const runSearch = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults([]);
      setSearchStatus('idle');
      setSearchError(null);
      return;
    }

    setSearchStatus('loading');
    setSearchError(null);

    try {
      const result = await searchUsers(trimmed);
      setSearchResults(result.users);
      setSearchStatus('success');
    } catch (e) {
      setSearchResults([]);
      setSearchStatus('error');
      setSearchError(getSearchErrorMessage(e));
    }
  }, [query]);

  const runAction = useCallback(
    async (action: () => Promise<void>) => {
      setActionStatus('loading');
      setActionError(null);
      try {
        await action();
        setActionStatus('idle');
        retry();
      } catch (e) {
        setActionStatus('error');
        setActionError(getActionErrorMessage(e));
      }
    },
    [retry],
  );

  const sendRequestToUser = useCallback(
    async (userId: string) => {
      await runAction(async () => {
        await sendFriendRequest(userId);
      });
    },
    [runAction],
  );

  const acceptRequest = useCallback(
    async (requestId: string) => {
      await runAction(async () => {
        await acceptFriendRequest(requestId);
      });
    },
    [runAction],
  );

  const declineRequest = useCallback(
    async (requestId: string) => {
      await runAction(async () => {
        await declineFriendRequest(requestId);
      });
    },
    [runAction],
  );

  const removeFriendFromUser = useCallback(
    async (userId: string) => {
      await runAction(async () => {
        await removeFriend(userId);
      });
    },
    [runAction],
  );

  const friends = useMemo(() => data?.friends ?? [], [data?.friends]);
  const incoming = useMemo(() => data?.incoming ?? [], [data?.incoming]);
  const outgoing = useMemo(() => data?.outgoing ?? [], [data?.outgoing]);

  const friendIds = useMemo(() => new Set(friends.map((u) => u.id)), [friends]);
  const outgoingToUserIds = useMemo(() => new Set(outgoing.map((r) => r.toUser.id)), [outgoing]);
  const incomingFromUserIds = useMemo(
    () => new Set(incoming.map((r) => r.fromUser.id)),
    [incoming],
  );

  return {
    // main load
    status,
    error,
    retry,
    friends,
    incoming,
    outgoing,

    // search
    query,
    setQuery,
    runSearch,
    searchResults,
    searchStatus,
    searchError,

    // actions
    actionStatus,
    actionError,
    sendRequestToUser,
    acceptRequest,
    declineRequest,
    removeFriendFromUser,

    // derived
    friendIds,
    outgoingToUserIds,
    incomingFromUserIds,
  };
};
