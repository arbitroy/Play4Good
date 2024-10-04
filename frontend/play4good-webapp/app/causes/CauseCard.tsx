'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Edit, Trash } from 'lucide-react'

type Cause = {
    id: number
    name: string
    description: string | null
    goal: string
    start_date: string | null
    end_date: string | null
    status: 'active' | 'completed' | 'cancelled' | null
    image: string | null
    category: string | null
}

type CauseCardProps = {
    cause: Cause
    onDelete: () => void
}

export default function CauseCard({ cause, onDelete }: CauseCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
            <Image src={cause.image || '/cause-placeholder.svg'} alt={cause.name} width={300} height={200} className="w-full h-48 object-cover" />
            <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-2">{cause.name}</h2>
                <p className="text-gray-600 mb-4">{cause.description || 'No description available'}</p>
                <div className="flex justify-between items-center mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{cause.category || 'Uncategorized'}</span>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">{cause.status || 'Unknown'}</span>
                </div>
                <div className="mb-4">
                    <p className="text-sm text-gray-600">Goal: ${cause.goal.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">
                        {cause.start_date && `Start: ${new Date(cause.start_date).toLocaleDateString()}`}
                        {cause.end_date && ` - End: ${new Date(cause.end_date).toLocaleDateString()}`}
                    </p>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                        <button className="text-pink-500 hover:text-pink-600 transition-colors duration-300">
                            <Heart className="w-6 h-6" />
                        </button>
                        <Link href={`/causes/${cause.id}/edit`} className="text-blue-500 hover:text-blue-600 transition-colors duration-300">
                            <Edit className="w-6 h-6" />
                        </Link>
                        <button onClick={onDelete} className="text-red-500 hover:text-red-600 transition-colors duration-300">
                            <Trash className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}