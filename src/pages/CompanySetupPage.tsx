import { CompanySetupForm } from "@/components/CompanySetupForm";

export function CompanySetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Set Up Your Company</h1>
          <p className="text-slate-400 mt-2">Create your company profile</p>
        </div>
        <CompanySetupForm />
      </div>
    </div>
  );
}
