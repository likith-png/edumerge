import * as React from "react"
import { cn } from "../../lib/utils"

const TabsContext = React.createContext<{
    value?: string
    onValueChange?: (value: string) => void
}>({})

const Tabs = ({
    defaultValue,
    value,
    onValueChange,
    children,
    className
}: {
    defaultValue?: string
    value?: string
    onValueChange?: (value: string) => void
    children: React.ReactNode
    className?: string
}) => {
    const [activeValue, setActiveValue] = React.useState(value || defaultValue)

    React.useEffect(() => {
        if (value) setActiveValue(value)
    }, [value])

    const handleValueChange = (val: string) => {
        if (!value) setActiveValue(val)
        onValueChange?.(val)
    }

    return (
        <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange }}>
            <div className={cn("w-full", className)}>{children}</div>
        </TabsContext.Provider>
    )
}

const TabsList = ({ className, children }: { className?: string; children: React.ReactNode }) => (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500", className)}>
        {children}
    </div>
)

const TabsTrigger = ({
    value,
    className,
    children
}: {
    value: string
    className?: string
    children: React.ReactNode
}) => {
    const { value: activeValue, onValueChange } = React.useContext(TabsContext)
    const isActive = activeValue === value

    return (
        <button
            onClick={() => onValueChange?.(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive ? "bg-white text-slate-950 shadow-sm" : "hover:text-slate-900",
                className
            )}
        >
            {children}
        </button>
    )
}

const TabsContent = ({
    value,
    className,
    children
}: {
    value: string
    className?: string
    children: React.ReactNode
}) => {
    const { value: activeValue } = React.useContext(TabsContext)
    if (activeValue !== value) return null

    return (
        <div className={cn("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2", className)}>
            {children}
        </div>
    )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
