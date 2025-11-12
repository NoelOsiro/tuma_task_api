export interface ITaskItem {
  id: string;
  title: string;
  description?: string | null;
  status?: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | string | null;
  location?: any | null; // jsonb in DB — keep as any, adapt later with a Location type if needed
  reward?: number | null; // numeric(10,2)
  created_by?: string | null; // uuid
  assigned_to?: string | null; // uuid
  created_at?: string | null; // ISO timestamp
  updated_at?: string | null; // ISO timestamp
}

export type ITaskCreatePayload = Partial<ITaskItem> & { title: string };

export default ITaskItem;

export type ITaskFilters = {
  status?: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | string | null;
};
