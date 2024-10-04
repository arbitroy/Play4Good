'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { cookies } from 'next/headers'

const api_url = process.env.NEXT_PUBLIC_API_URL

const CauseSchema = z.object({
    id: z.number(),
    name: z.string().min(3, "Name must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    goal: z.string().refine((val) => !isNaN(Number(val)), "Goal must be a valid number"),
    start_date: z.string().nullable(),
    end_date: z.string().nullable(),
    status: z.enum(['active', 'completed', 'cancelled']),
    image: z.string().url("Invalid image URL"),
    category: z.string().min(3, "Category must be at least 3 characters long"),
})

type CauseInput = z.infer<typeof CauseSchema>

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
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
}

export async function createCause(formData: FormData) {
    const validatedFields = CauseSchema.omit({ id: true }).safeParse({
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
        return { error: validatedFields.error.flatten().fieldErrors }
    }
    
    const causeData = validatedFields.data

    try {
        let newCause: CauseInput
        if (api_url) {
            newCause = await fetchWithAuth(`${api_url}/api/causes`, {
                method: 'POST',
                body: JSON.stringify(causeData),
            })
        } else {
            // Simulate API call with a delay
            await new Promise(resolve => setTimeout(resolve, 1000))
            newCause = {
                ...causeData,
                id: Math.floor(Math.random() * 1000) + 1, // Generate a random id for simulation
            }
            console.log('Created cause:', newCause)
        }

        revalidatePath('/causes')
        redirect('/causes')
    } catch (error) {
        console.error('Failed to create cause:', error)
        return { error: { _form: ['Failed to create cause'] } }
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
        return { error: validatedFields.error.flatten().fieldErrors }
    }

    const causeData = validatedFields.data

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
        return { error: { _form: ['Failed to update cause'] } }
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
        throw new Error('Failed to delete cause')
    }
}

export async function getCauses(): Promise<CauseInput[]> {
    try {
        if (api_url) {
            const causes = await fetchWithAuth(`${api_url}/api/causes`)
            return causes.map((cause: CauseInput) => ({
                ...cause,
                id: cause.id,
                goal: cause.goal.toString(),
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
                    start_date: "2023-07-01",
                    end_date: "2023-12-31",
                    status: "active",
                    image: "/placeholder.svg?height=200&width=300",
                    category: "Environment"
                },
                {
                    id: 2,
                    name: "Education for All",
                    description: "Supporting education in underprivileged areas",
                    goal: "50000",
                    start_date: "2023-08-01",
                    end_date: "2024-07-31",
                    status: "active",
                    image: "/placeholder.svg?height=200&width=300",
                    category: "Education"
                },
            ]
        }
    } catch (error) {
        console.error('Failed to fetch causes:', error)
        throw new Error('Failed to fetch causes')
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
                end_date: "2023-12-31",
                status: "active",
                image: "/placeholder.svg?height=200&width=300",
                category: "Environment"
            }
        }
    } catch (error) {
        console.error('Failed to fetch cause:', error)
        throw new Error('Failed to fetch cause')
    }
}