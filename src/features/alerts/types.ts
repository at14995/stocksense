export type Alert = {
  id: string;
  ownerUid: string;
  symbol: string;
  condition: 'above' | 'below';
  target: number;
  status: 'active' | 'triggered' | 'archived';
  createdAt?: any;
  updatedAt?: any;
};
