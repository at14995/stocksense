
export type Post = {
  id: string;
  ownerUid: string;
  username: string;
  content: string;
  tickers: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
  likeCount: number;
  commentCount: number;
  createdAt?: any;
};
export type Comment = {
  id: string;
  postId: string;
  ownerUid: string;
  username: string;
  content: string;
  createdAt?: any;
};
