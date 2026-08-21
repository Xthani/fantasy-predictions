import { apiRequest } from '@/shared/api/httpClient';

export type PublicUser = {
  id: string;
  login: string;
  displayName?: string | null;
};

export type FriendRequest = {
  id: string;
  fromUser: PublicUser;
  toUser: PublicUser;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt?: string | null;
};

export type FriendshipStatus = 'self' | 'friend' | 'incoming' | 'outgoing' | 'none';

export type PublicUserProfile = {
  user: PublicUser;
  friendshipStatus: FriendshipStatus;
  stats: {
    predictionsCount: number;
    favoriteLeaguesCount: number;
    favoriteClubsCount: number;
    officialRating: number;
    form: number | null;
  };
};

export type FriendsListResponse = {
  friends: PublicUser[];
};

export type FriendRequestsResponse = {
  incoming: FriendRequest[];
  outgoing: FriendRequest[];
};

export type SearchUsersResponse = {
  users: PublicUser[];
};

export const searchUsers = (query: string): Promise<SearchUsersResponse> =>
  apiRequest<SearchUsersResponse>('/api/users/search', { query: { query } });

export const fetchPublicUserProfile = (userId: string): Promise<PublicUserProfile> =>
  apiRequest<PublicUserProfile>(`/api/users/${userId}`);

export const fetchFriends = (): Promise<FriendsListResponse> =>
  apiRequest<FriendsListResponse>('/api/friends');

export const fetchFriendRequests = (): Promise<FriendRequestsResponse> =>
  apiRequest<FriendRequestsResponse>('/api/friend-requests');

export const sendFriendRequest = (userId: string): Promise<FriendRequest> =>
  apiRequest<FriendRequest>('/api/friend-requests', {
    method: 'POST',
    body: { userId },
  });

export const acceptFriendRequest = (requestId: string): Promise<void> =>
  apiRequest<void>(`/api/friend-requests/${requestId}/accept`, { method: 'POST' });

export const declineFriendRequest = (requestId: string): Promise<void> =>
  apiRequest<void>(`/api/friend-requests/${requestId}`, { method: 'DELETE' });

export const removeFriend = (userId: string): Promise<void> =>
  apiRequest<void>(`/api/friends/${userId}`, { method: 'DELETE' });
