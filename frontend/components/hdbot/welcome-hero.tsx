interface WelcomeHeroProps {
  greeting: string
  title: string
  subtitle: string
}

export function WelcomeHero({ greeting, title, subtitle }: WelcomeHeroProps) {
  return (
    <div className="flex items-start justify-between rounded-xl border border-border bg-card p-6">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{greeting}</span>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        </div>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      <div className="relative ml-4">
        <RobotIllustration />
      </div>
    </div>
  )
}

function RobotIllustration() {
  return (
    <div className="relative h-32 w-40">
      {/* Robot body */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <div className="relative">
          {/* Head */}
          <div className="relative h-20 w-24 rounded-2xl bg-gradient-to-b from-white to-gray-100 border border-gray-200 shadow-sm">
            {/* Eyes */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-3">
              <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
              <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
            </div>
            {/* Mouth */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 h-1.5 w-6 rounded-full bg-gray-300" />
          </div>
          {/* Antenna */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-4 w-1 bg-gray-300 rounded-full">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-primary" />
          </div>
          {/* Arms */}
          <div className="absolute -right-6 top-12">
            <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
              <span className="text-sm">👋</span>
            </div>
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-pink-400 flex items-center justify-center">
        <span className="text-white text-xs">❤</span>
      </div>
      <div className="absolute top-8 right-10 h-3 w-3 rounded-full bg-primary" />
    </div>
  )
}
