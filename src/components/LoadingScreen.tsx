import { Building2 } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Building2 className="h-12 w-12 text-primary animate-pulse" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Global Business Directory
        </h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}