export default function Loading() {
    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="space-y-2">
                <div className="h-10 w-48 bg-muted animate-pulse rounded-md" />
                <div className="h-4 w-64 bg-muted animate-pulse rounded-md" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
                ))}
            </div>

            <div className="h-[400px] w-full bg-muted animate-pulse rounded-xl" />
        </div>
    )
}
