'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCauses, deleteCause } from './actions'
import CauseCard from './CauseCard'
import { Button } from "../components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/Alert"
import { Loader2, PlusCircle, AlertTriangle } from "lucide-react"
import { Cause } from '../types/cause';


const dummyCauses: Cause[] = [
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
        created_at: "",
        updated_at: ""
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
        created_at: "",
        updated_at: ""
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
        <div className="min-h-screen  p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-900">Discover Causes</h1>
                    <Link href="/causes/new" passHref>
                        <Button className="w-full text-white">
                            <PlusCircle className="w-4 h-4 mr-2 co" /> Create New Cause
                        </Button>
                    </Link>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-4 bg-white text-red-500">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {isLoading ? (
                    <div className="text-center py-4">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <p className="text-gray-600 mt-2">Loading causes...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {causes.map(cause => (
                            <CauseCard
                                key={cause.id}
                                cause={cause}
                                onDelete={() => handleDelete(cause.id)}
                            />
                        ))}
                    </div>
                )}

                {!isLoading && causes.length === 0 && (
                    <p className="text-center text-gray-500 mt-8">No causes found. Be the first to create one!</p>
                )}
            </div>
        </div>
    )
}