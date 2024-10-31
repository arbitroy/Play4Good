import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"
import Image from 'next/image'

type CauseCardProps = {
    cause: {
        id: number
        name: string
        description: string
        goal: string
        current_amount: string
        start_date: string | null
        end_date: string | null
        status: 'active' | 'completed' | 'cancelled' | 'inactive'
        image: string
        category: string
    }
    onDelete: (id: number) => void
}

export default function CauseCard({ cause, onDelete }: CauseCardProps) {
    const progress = Math.min(
        (parseFloat(cause.current_amount) / parseFloat(cause.goal)) * 100,
        100
    )

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>{cause.name}</span>
                    <Badge variant={cause.status === 'active' ? 'default' : 'secondary'}>
                        {cause.status}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="aspect-video relative mb-4">
                    <Image
                        src={cause.image || '/cause-placeholder.svg'}
                        alt={cause.name}
                        className="object-cover w-full h-full rounded-md"
                        height={200}
                        width={200}
                    />
                </div>
                <p className="text-sm text-gray-600 mb-2">{cause.description}</p>
                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        Category: <span className="font-normal">{cause.category}</span>
                    </p>
                    <p className="text-sm font-medium">
                        Goal: <span className="font-normal">${parseFloat(cause.goal).toLocaleString()}</span>
                    </p>
                    <p className="text-sm font-medium">
                        Raised: <span className="font-normal">${parseFloat(cause.current_amount).toLocaleString()}</span>
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-sm font-medium">
                        Progress: <span className="font-normal">{progress.toFixed(2)}%</span>
                    </p>
                    {cause.start_date && (
                        <p className="text-sm font-medium">
                            Start Date: <span className="font-normal">{new Date(cause.start_date).toLocaleDateString()}</span>
                        </p>
                    )}
                    {cause.end_date && (
                        <p className="text-sm font-medium">
                            End Date: <span className="font-normal">{new Date(cause.end_date).toLocaleDateString()}</span>
                        </p>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Link href={`/causes/${cause.id}/edit`} passHref>
                    <Button variant="outline" className="w-full mr-2">
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                    </Button>
                </Link>
                <Button variant="destructive" className="w-full ml-2" onClick={() => onDelete(cause.id)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
            </CardFooter>
        </Card>
    )
}