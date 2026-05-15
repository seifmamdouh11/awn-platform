export interface SubscriptionPlan {
  id: number;
  name: string;
  tier: 'SILVER' | 'GOLD' | 'PRO' | 'ELITE';
  user_type: 'volunteer' | 'company';
  description: string;
  price: number;
  duration_days: number;
  benefits: {
    withdrawal_fee?: number;
    priority?: boolean;
    commission_rate?: number;
    featured_posts?: number;
    [key: string]: any;
  };
  is_active: boolean;
}

export interface UserSubscription {
  id: number;
  user_id: number;
  user_type: 'volunteer' | 'company';
  plan_id: number;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  plan_name: string;
  tier: string;
  benefits: any;
}
