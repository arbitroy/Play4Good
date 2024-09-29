import React from "react"
import "./progress.css"

interface ProgressProps {
    value: number
}

export const Progress: React.FC<ProgressProps> = ({ value }) => {
    return (
        <div className="progress">
            <div className="progress-bar" style={{ width: `${value}%` }}></div>
        </div>
    )
}