import React from "react"
import "./avatar.css"

interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
    src?: string
}

export const Avatar: React.FC<AvatarProps> = ({ src, children, className, ...props }) => {
    return (
        <span className={`avatar ${className || ""}`} {...props}>
            {src ? (
                <img src={src} alt="Avatar" className="avatar-image" />
            ) : (
                <span className="avatar-fallback">{children}</span>
            )}
        </span>
    )
}