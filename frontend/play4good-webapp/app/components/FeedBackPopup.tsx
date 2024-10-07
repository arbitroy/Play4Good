import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { AlertCircle, CheckCircle } from "lucide-react"

interface FeedbackPopupProps {
    isOpen: boolean
    onClose: () => void
    title: string
    message: string
    type: 'error' | 'success'
}

export function FeedbackPopup({ isOpen, onClose, title, message, type }: FeedbackPopupProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-slate-50">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {type === 'error' ? (
                            <AlertCircle className="h-6 w-6 text-red-500" />
                        ) : (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                        )}
                        {title}
                    </DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}