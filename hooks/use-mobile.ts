import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Hook to detect if the current device is mobile based on a breakpoint.
 * Uses matchMedia for efficient listener updates.
 */
export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

    React.useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        }

        // Initial check
        setIsMobile(mql.matches)

        // Listen for changes
        mql.addEventListener("change", onChange)
        return () => mql.removeEventListener("change", onChange)
    }, [])

    return !!isMobile
}
