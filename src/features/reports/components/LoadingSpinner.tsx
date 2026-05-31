export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      {label && <span className="ml-3 text-muted-foreground">{label}</span>}
    </div>
  )
}
