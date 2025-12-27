import { Wrench } from 'lucide-react';

export function GearGuardLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo */}
        <div className="relative">
          {/* Spinning Ring */}
          <div className="absolute inset-0 w-24 h-24 border-4 border-amber-200 rounded-full animate-spin" style={{
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
          }} />
          
          {/* Logo Container */}
          <div className="relative w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
            <div className="absolute inset-3 border-2 border-white/30 rounded-lg" />
            <Wrench className="w-12 h-12 text-white animate-bounce" />
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent mb-2">
            GearGuard
          </h1>
          <p className="text-sm text-muted-foreground animate-pulse">
            Loading your maintenance dashboard...
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
