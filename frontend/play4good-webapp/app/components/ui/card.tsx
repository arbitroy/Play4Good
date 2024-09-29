import React from "react"
import "./card.css"

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => {
    return (
        <div className={`card ${className || ""}`} {...props}>
            {children}
        </div>
    )
}

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => {
    return (
        <div className={`card-header ${className || ""}`} {...props}>
            {children}
        </div>
    )
}

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => {
    return (
        <div className={`card-content ${className || ""}`} {...props}>
            {children}
        </div>
    )
}