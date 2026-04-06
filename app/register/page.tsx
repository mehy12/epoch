import MultiStepForm from "@/components/ui/multistep-form";

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen bg-[#050505] text-[#F5F5F5] py-12 sm:py-20 overflow-hidden">
      {/* Background vignette & subtle glow */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.06)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-1000 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSIvPjwvc3ZnPg==')] opacity-40 mix-blend-overlay" />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6">
        <header className="mb-10 sm:mb-12 text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#F59E0B] mb-4">
            EPOCH '26
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-[44px] font-black tracking-tight text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Register Your Team
          </h1>
          <p className="mx-auto max-w-[540px] text-[15px] sm:text-base text-zinc-400 leading-relaxed">
            Set up your team details and choose your hackathon track. Complete your onboarding in six quick steps.
          </p>
        </header>

        <MultiStepForm />
      </div>
    </main>
  );
}
