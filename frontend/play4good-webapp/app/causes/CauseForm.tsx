'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCause, updateCause } from './actions'

type CauseFormProps = {
    cause?: {
        id: number
        name: string
        description: string
        goal: string
        start_date: string | null
        end_date: string | null
        status: 'active' | 'completed' | 'cancelled'
        image: string
        category: string
    }
}

export default function CauseForm({ cause }: CauseFormProps) {
    const router = useRouter()
    const [error, setError] = useState<Record<string, string[]> | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget);

        const result = cause
            ? await updateCause(cause.id, formData)
            : await createCause(formData)

        if (result && 'error' in result) {
            setError(result.error)
        } else {
            router.push('/causes')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={cause?.name}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {error?.name && <p className="text-red-500 text-sm mt-1">{error.name[0]}</p>}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    id="description"
                    name="description"
                    defaultValue={cause?.description}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {error?.description && <p className="text-red-500 text-sm mt-1">{error.description[0]}</p>}
            </div>

            <div>
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700">Goal</label>
                <input
                    type="text"
                    id="goal"
                    name="goal"
                    defaultValue={cause?.goal}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {error?.goal && <p className="text-red-500 text-sm mt-1">{error.goal[0]}</p>}
            </div>

            <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    defaultValue={cause?.start_date?.split('T')[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {error?.start_date && <p className="text-red-500 text-sm mt-1">{error.start_date[0]}</p>}
            </div>

            <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    defaultValue={cause?.end_date?.split('T')[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {error?.end_date && <p className="text-red-500 text-sm mt-1">{error.end_date[0]}</p>}
            </div>

            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                    id="status"
                    name="status"
                    defaultValue={cause?.status || 'active'}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                {error?.status && <p className="text-red-500 text-sm mt-1">{error.status[0]}</p>}
            </div>

            <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                    type="url"
                    id="image"
                    name="image"
                    defaultValue={cause?.image}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {error?.image && <p className="text-red-500 text-sm mt-1">{error.image[0]}</p>}
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <input
                    type="text"
                    id="category"
                    name="category"
                    defaultValue={cause?.category}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                {error?.category && <p className="text-red-500 text-sm mt-1">{error.category[0]}</p>}
            </div>

            <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {cause ? 'Update Cause' : 'Create Cause'}
            </button>
        </form>
    )
}