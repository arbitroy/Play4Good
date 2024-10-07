
export type Cause = {
    id: number;
    name: string;
    description: string;
    goal: string;
    current_amount: string;
    start_date: string | null;
    end_date: string | null;
    status: 'active' | 'completed' | 'cancelled' | 'inactive';
    image: string;
    category: string;
    created_at: string | null;
    updated_at: string | null;
};