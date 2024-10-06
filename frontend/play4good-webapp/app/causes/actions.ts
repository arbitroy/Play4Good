'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const api_url = process.env.NEXT_PUBLIC_API_URL

type ApiCause = {
    id: number
    name: string
    description: { String: string; Valid: boolean }
    goal: { String: string; Valid: boolean }
    current_amount: { String: string; Valid: boolean }
    start_date: { Time: string; Valid: boolean }
    end_date: { Time: string; Valid: boolean }
    status: { String: string; Valid: boolean }
    created_at: { Time: string; Valid: boolean }
    updated_at: { Time: string; Valid: boolean }
    image: { String: string; Valid: boolean }
    category: { String: string; Valid: boolean }
}

// Helper function to convert date string to API expected format
function convertToAPIDateFormat(dateString: string | null): string | null {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString();
}

const CauseSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    goal: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Goal must be a valid positive number"),
    current_amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Current amount must be a valid non-negative number"),
    start_date: z.string().nullable(),
    end_date: z.string().nullable(),
    status: z.enum(['active', 'completed', 'cancelled', 'inactive']),
    image: z.string().url("Invalid image URL"),
    category: z.string().min(3, "Category must be at least 3 characters long"),
})

type CauseInput = z.infer<typeof CauseSchema> & {
    id?: number;
    created_at?: string | null;
    updated_at?: string | null;
}

export type ActionError = {
    [key: string]: string[];
} & {
    _form?: string[];
}

export type ActionResult = {
    success: boolean;
    cause?: CauseInput;
    error?: ActionError;
}

function safeParseDateString(dateString: string | null): string | null {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        console.error(`Invalid date: ${dateString}`);
        return null;
    }
    return date.toISOString().split('T')[0];
}


async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = cookies().get('token')?.value

    if (!token) {
        throw new Error('Authentication token is missing')
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
        } catch (e) {
            console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    } else {
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error('Error parsing response as JSON:', e);
            throw new Error('Unexpected response format from the server');
        }
    }
}

export async function createCause(formData: FormData): Promise<ActionResult> {
    const validatedFields = CauseSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        goal: formData.get('goal'),
        current_amount: formData.get('current_amount') || '0',
        start_date: formData.get('start_date'),
        end_date: formData.get('end_date'),
        status: formData.get('status'),
        image: formData.get('image'),
        category: formData.get('category'),
    })

    if (!validatedFields.success) {
        const error: ActionError = validatedFields.error.issues.reduce((acc, issue) => {
            const key = issue.path[0].toString();
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(issue.message);
            return acc;
        }, {} as ActionError)
        return { success: false, error }
    }

    const causeData = {
        ...validatedFields.data,
        goal: parseFloat(validatedFields.data.goal),
        current_amount: parseFloat(validatedFields.data.current_amount),
        start_date: convertToAPIDateFormat(validatedFields.data.start_date),
        end_date: convertToAPIDateFormat(validatedFields.data.end_date),
    }

    try {
        let newCause: CauseInput
        if (api_url) {
            console.log('Attempting to create cause with API URL:', api_url);
            const apiResponse = await fetchWithAuth(`${api_url}/api/causes`, {
                method: 'POST',
                body: JSON.stringify(causeData),
            })
            newCause = {
                ...causeData,
                id: apiResponse.id,
                goal: causeData.goal.toString(), // Convert back to string for client-side consistency
                current_amount: causeData.current_amount.toString(), // Convert back to string for client-side consistency
                created_at: apiResponse.created_at,
                updated_at: apiResponse.updated_at,
            }
            console.log('API response:', newCause);
        } else {
            console.log('No API URL found, simulating API call');
            await new Promise(resolve => setTimeout(resolve, 1000))
            newCause = {
                ...causeData,
                id: Math.floor(Math.random() * 1000) + 1,
                goal: causeData.goal.toString(),
                current_amount: causeData.current_amount.toString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
            console.log('Simulated created cause:', newCause)
        }

        revalidatePath('/causes')
        return { success: true, cause: newCause };
    } catch (error) {
        console.error('Failed to create cause:', error)
        return {
            success: false,
            error: { _form: [(error as Error).message || 'Failed to create cause'] }
        }
    }
}
export async function updateCause(id: number, formData: FormData) {
    const validatedFields = CauseSchema.safeParse({
        id,
        name: formData.get('name'),
        description: formData.get('description'),
        goal: formData.get('goal'),
        start_date: formData.get('start_date'),
        end_date: formData.get('end_date'),
        status: formData.get('status'),
        image: formData.get('image'),
        category: formData.get('category'),
    })

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.issues.reduce((acc, issue) => {
                const key = issue.path[0].toString();
                if (!acc[key]) {
                    acc[key] = [];
                }
                (acc[key] as string[]).push(issue.message);
                return acc;
            }, {} as ActionError)
        }
    }

    const causeData = {
        ...validatedFields.data,
        goal: parseFloat(validatedFields.data.goal),
        start_date: convertToAPIDateFormat(validatedFields.data.start_date),
        end_date: convertToAPIDateFormat(validatedFields.data.end_date),
    }

    try {
        if (api_url) {
            await fetchWithAuth(`${api_url}/api/causes/${id}`, {
                method: 'PUT',
                body: JSON.stringify(causeData),
            })
        } else {
            // Simulate API call with a delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log('Updated cause:', causeData)
        }

        revalidatePath('/causes')
        redirect('/causes')
    } catch (error) {
        console.error('Failed to update cause:', error)
        return { error: { _form: [(error as Error).message || 'Failed to update cause'] } }
    }
}

export async function deleteCause(id: number) {
    try {
        if (api_url) {
            await fetchWithAuth(`${api_url}/api/causes/${id}`, {
                method: 'DELETE',
            })
        } else {
            // Simulate API call with a delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log('Deleted cause:', id)
        }

        revalidatePath('/causes')
    } catch (error) {
        console.error('Failed to delete cause:', error)
        throw new Error((error as Error).message || 'Failed to delete cause')
    }
}

export async function getCauses(): Promise<CauseInput[]> {
    const list = {
        limit: 100,
        offset: 0,
    }

    try {
        if (api_url) {
            const response = await fetchWithAuth(`${api_url}/api/listCauses`, {
                method: 'POST',
                body: JSON.stringify(list),
            })

            if (!Array.isArray(response)) {
                console.error('Unexpected response format:', response);
                throw new Error('Unexpected response format from the server');
            }

            return response.map((cause: ApiCause) => ({
                id: cause.id,
                name: cause.name,
                description: cause.description.Valid ? cause.description.String : '',
                goal: cause.goal.Valid ? cause.goal.String : '0',
                start_date: cause.start_date.Valid ? new Date(cause.start_date.Time).toISOString().split('T')[0] : null,
                end_date: cause.end_date.Valid ? new Date(cause.end_date.Time).toISOString().split('T')[0] : null,
                status: cause.status.Valid ? (cause.status.String as 'active' | 'completed' | 'cancelled' | 'inactive') : 'inactive',
                image: cause.image.Valid ? cause.image.String : '/cause-placeholder.svg',
                category: cause.category.Valid ? cause.category.String : 'Uncategorized',
                current_amount: cause.current_amount.Valid ? cause.current_amount.String : '0',
                created_at: cause.created_at.Valid ? new Date(cause.created_at.Time).toISOString() : null,
                updated_at: cause.updated_at.Valid ? new Date(cause.updated_at.Time).toISOString() : null,
            }))
        } else {
            // Simulate API call with a delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            return [
                {
                    id: 1,
                    name: "Clean Water Initiative",
                    description: "Providing clean water to communities in need",
                    goal: "10000",
                    current_amount: "5000",
                    start_date: "2023-07-01",
                    end_date: "2023-12-31",
                    status: "active",
                    image: "/cause-placeholder.svg",
                    category: "Environment",
                    created_at: "2023-07-01T00:00:00Z",
                    updated_at: "2023-07-01T00:00:00Z",
                },
                {
                    id: 2,
                    name: "Education for All",
                    description: "Supporting education in underprivileged areas",
                    goal: "50000",
                    current_amount: "25000",
                    start_date: "2023-08-01",
                    end_date: "2024-07-31",
                    status: "active",
                    image: "/cause-placeholder.svg",
                    category: "Education",
                    created_at: "2023-08-01T00:00:00Z",
                    updated_at: "2023-08-01T00:00:00Z",
                },
            ]
        }
    } catch (error) {
        console.error('Failed to fetch causes:', error)
        throw new Error((error as Error).message || 'Failed to fetch causes')
    }
}


export async function getCauseById(id: number): Promise<CauseInput> {
    try {
        if (api_url) {
            const cause = await fetchWithAuth(`${api_url}/api/causes/${id}`)
            return {
                ...cause,
                id: cause.id,
                goal: cause.goal.toString(),
                start_date: safeParseDateString(cause.start_date),
                end_date: safeParseDateString(cause.end_date),
            }
        } else {
            // Simulate API call with a delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            return {
                id,
                name: "Clean Water Initiative",
                description: "Providing clean water to communities in need",
                goal: "10000",
                start_date: "2023-07-01",
                current_amount: "150",
                end_date: "2023-12-31",
                status: "active",
                image: "/cause-placeholder.svg",
                category: "Environment",
                created_at: "2023-07-01",
                updated_at: "2023-07-01"
            }
        }
    } catch (error) {
        console.error('Failed to fetch cause:', error)
        throw new Error((error as Error).message || 'Failed to fetch cause')
    }
}