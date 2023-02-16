import React from "react"

declare const gtag

type ExternalPageLinkProps = {
    children: React.ReactNode
    to: string
    className?: string
    event: string
}

export const ExternalPageLink = ({ children, to, className, event }: ExternalPageLinkProps) => {
    function fire_event() {
        try {
            const url = new URL(to)
            gtag("event", event, {
                event_label: url.hostname
            })
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <a href={to} className={className} onClick={fire_event}>
            {children}
        </a>
    )
}
