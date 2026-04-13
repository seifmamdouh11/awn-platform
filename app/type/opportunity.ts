export type OpportunityStatus =
  | "draft"
  | "open"
  | "closed"
  | "completed"
  | "cancelled";

export type OpportunityType = "volunteer" | "paid";

export type Opportunity = {
  id: number;
  company_id: number;
  title: string;
  title_ar?: string | null;
  title_en?: string | null;
  category_id: number;
  description: string;
  description_ar?: string | null;
  description_en?: string | null;
  address: string;
  capacity: number;
  event_type: OpportunityType;
  status: OpportunityStatus;
  start_time: string;
  end_time: string;
  is_deleted: number;
  company_name?: string;
  company_rating?: number;
  reward?: number;
};