import React from "react"
import "./badge.css"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline"
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  className, 
  variant = "default", 
  ...props 
}) => {
  return (
    <span className={`badge ${variant} ${className || ""}`} {...props}>
      {children}
    </span>
  )
}