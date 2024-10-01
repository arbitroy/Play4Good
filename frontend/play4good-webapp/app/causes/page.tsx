'use client'

import { useState } from 'react'
import { Search, Heart } from 'lucide-react'

interface Cause {
    id: number
    name: string
    description: string
    image: string
    category: string
}

const causes: Cause[] = [
    {
        id: 1,
        name: "Clean Water Initiative",
        description: "Providing clean water to communities in need",
        image: "/cause-placeholder.svg",
        category: "Environment"
    },
    {
        id: 2,
        name: "Education for All",
        description: "Supporting education in underprivileged areas",
        image: "/cause-placeholder.svg",
        category: "Education"
    },
    {
        id: 3,
        name: "Wildlife Conservation",
        description: "Protecting endangered species and their habitats",
        image: "/cause-placeholder.svg",
        category: "Environment"
    },
    {
        id: 4,
        name: "Hunger Relief",
        description: "Providing meals to those facing food insecurity",
        image: "/cause-placeholder.svg",
        category: "Humanitarian"
    },
    {
        id: 5,
        name: "Mental Health Support",
        description: "Offering resources and support for mental health",
        image: "/cause-placeholder.svg",
        category: "Health"
    },
    {
        id: 6,
        name: "Renewable Energy Project",
        description: "Promoting clean energy solutions",
        image: "/cause-placeholder.svg",
        category: "Environment"
    }
]

export default function CausesPage() {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredCauses = causes.filter(cause =>
        cause.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cause.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cause.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen  p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">Discover Causes</h1>

                <div className="relative mb-8">
                    <input
                        type="text"
                        placeholder="Search causes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-4 pl-12 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCauses.map(cause => (
                        <div key={cause.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                            <img src={cause.image} alt={cause.name} className="w-full h-48 object-contain" />
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-blue-900 mb-2">{cause.name}</h2>
                                <p className="text-gray-600 mb-4">{cause.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{cause.category}</span>
                                    <button className="text-pink-500 hover:text-pink-600 transition-colors duration-300">
                                        <Heart className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCauses.length === 0 && (
                    <p className="text-center text-gray-500 mt-8">No causes found. Try a different search term.</p>
                )}
            </div>
        </div>
    )
}