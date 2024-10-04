'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCauses, deleteCause } from './actions'
import CauseCard from './CauseCard'

export type Cause = {
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

const dummyCauses: Cause[] = [
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

export default function CausesPage() {
    const [causes, setCauses] = useState<Cause[]>(dummyCauses)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadCauses() {
            try {
                const fetchedCauses = await getCauses()
                setCauses(fetchedCauses)
            } catch (err) {
                setError('Failed to load causes. Showing dummy data.')
                console.error('Error loading causes:', err)
            } finally {
                setIsLoading(false)
            }
        }

        loadCauses()
    }, [])

    const handleDelete = async (id: number) => {
        try {
            await deleteCause(id)
            setCauses(causes.filter(cause => cause.id !== id))
        } catch (err) {
            console.error('Error deleting cause:', err)
            setError('Failed to delete cause. Please try again.')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-900">Discover Causes</h1>
                    <Link
                        href="/causes/new"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Create New Cause
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {isLoading && (
                    <div className="text-center py-4">
                        <p className="text-gray-600">Loading causes...</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {causes.map(cause => (
                        <CauseCard
                            key={cause.id}
                            cause={cause}
                            onDelete={() => handleDelete(cause.id)}
                        />
                    ))}
                </div>

                {!isLoading && causes.length === 0 && (
                    <p className="text-center text-gray-500 mt-8">No causes found. Be the first to create one!</p>
                )}
            </div>
        </div>
    )
}