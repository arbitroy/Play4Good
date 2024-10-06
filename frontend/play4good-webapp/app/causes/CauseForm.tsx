'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCause, updateCause, ActionError, ActionResult } from './actions'
import { Alert, AlertDescription, AlertTitle } from "../components/ui/Alert"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { CheckCircle2, AlertTriangle } from "lucide-react"

type CauseFormProps = {
    cause?: {
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
}

export default function CauseForm({ cause }: CauseFormProps) {
    const router = useRouter()
    const [error, setError] = useState<ActionError | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)
        setSuccess(null)

        const formData = new FormData(e.currentTarget)

        try {
            let result: ActionResult
            if (cause) {
                result = await updateCause(cause.id, formData)
            } else {
                result = await createCause(formData)
            }

            if (result.success && result.cause) {
                setSuccess(cause ? 'Cause updated successfully!' : 'Cause created successfully!')
                console.log('Created/Updated cause:', result.cause)
                setTimeout(() => {
                    router.push('/causes')
                }, 2000)
            } else if (!result.success && result.error) {
                setError(result.error)
            } else {
                throw new Error('Unexpected result from form submission')
            }
        } catch (err) {
            console.error('Error submitting form:', err)
            setError({ _form: ['An unexpected error occurred. Please try again.'] })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error?._form && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error._form[0]}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert variant="default" className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Success</AlertTitle>
                    <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={cause?.name}
                    required
                    aria-invalid={error?.name ? 'true' : 'false'}
                    aria-describedby={error?.name ? 'name-error' : undefined}
                />
                {error?.name && <p id="name-error" className="text-sm text-red-500">{error.name[0]}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    defaultValue={cause?.description}
                    required
                    aria-invalid={error?.description ? 'true' : 'false'}
                    aria-describedby={error?.description ? 'description-error' : undefined}
                />
                {error?.description && <p id="description-error" className="text-sm text-red-500">{error.description[0]}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="goal">Goal</Label>
                <Input
                    type="number"
                    id="goal"
                    name="goal"
                    defaultValue={cause?.goal}
                    required
                    step="0.01"
                    min="0"
                    aria-invalid={error?.goal ? 'true' : 'false'}
                    aria-describedby={error?.goal ? 'goal-error' : undefined}
                />
                {error?.goal && <p id="goal-error" className="text-sm text-red-500">{error.goal[0]}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="current_amount">Current Amount</Label>
                <Input
                    type="number"
                    id="current_amount"
                    name="current_amount"
                    defaultValue={cause?.current_amount || '0'}
                    required
                    step="0.01"
                    min="0"
                    aria-invalid={error?.current_amount ? 'true' : 'false'}
                    aria-describedby={error?.current_amount ? 'current-amount-error' : undefined}
                />
                {error?.current_amount && <p id="current-amount-error" className="text-sm text-red-500">{error.current_amount[0]}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                    type="date"
                    id="start_date"
                    name="start_date"
                    defaultValue={cause?.start_date || ''}
                    aria-invalid={error?.start_date ? 'true' : 'false'}
                    aria-describedby={error?.start_date ? 'start-date-error' : undefined}
                />
                {error?.start_date && <p id="start-date-error" className="text-sm text-red-500">{error.start_date[0]}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                    type="date"
                    id="end_date"
                    name="end_date"
                    defaultValue={cause?.end_date || ''}
                    aria-invalid={error?.end_date ? 'true' : 'false'}
                    aria-describedby={error?.end_date ? 'end-date-error' : undefined}
                />
                {error?.end_date && <p id="end-date-error" className="text-sm text-red-500">{error.end_date[0]}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={cause?.status || 'active'}>
                    <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
                {error?.status && <p className="text-sm text-red-500">{error.status[0]}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                    type="url"
                    id="image"
                    name="image"
                    defaultValue={cause?.image}
                    required
                    aria-invalid={error?.image ? 'true' : 'false'}
                    aria-describedby={error?.image ? 'image-error' : undefined}
                />
                {error?.image && <p id="image-error" className="text-sm text-red-500">{error.image[0]}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                    type="text"
                    id="category"
                    name="category"
                    defaultValue={cause?.category}
                    required
                    aria-invalid={error?.category ? 'true' : 'false'}
                    aria-describedby={error?.category ? 'category-error' : undefined}
                />
                {error?.category && <p id="category-error" className="text-sm text-red-500">{error.category[0]}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Submitting...' : (cause ? 'Update Cause' : 'Create Cause')}
            </Button>
        </form>
    )
}