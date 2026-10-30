import { AuthForm } from "@/components/AuthForm";

export function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Deadline Tracker</h1>
          <p className="text-slate-400 mt-2">Create your account</p>
        </div>
        <AuthForm isLogin={false} />
      </div>
    </div>
  );
}
