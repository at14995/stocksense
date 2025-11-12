export type Alert = {
  id: string;
  ownerUid: string;
  symbol: string;
  exchange: string;
  condition:
    | 'price_up_dollar'
    | 'price_down_dollar'
    | 'price_reach'
    | 'percent_up'
    | 'percent_down';
  target: number;
  notificationMethod: string[];
  status: 'active' | 'triggered' | 'archived';
  createdAt?: any;
  updatedAt?: any;
  ownerWhatsapp?: string;
  ownerEmail?: string;
  ownerPhone?: string;
};
