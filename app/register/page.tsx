import MultiStepForm from "@/components/ui/multistep-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#0E0E0E] text-white py-10 sm:py-14">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <header className="mb-8 sm:mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.26em] text-zinc-500">EPOCH '26</p>
          <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#F59E0B]">
            Team Registration
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-zinc-400">
            Complete your team onboarding in six quick steps. Save accurate details for faster screening.
          </p>
        </header>

        <MultiStepForm />
      </div>
    </main>
  );
}
