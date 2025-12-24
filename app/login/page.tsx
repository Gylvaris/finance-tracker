import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md space-y-8 p-8 bg-neutral-900 rounded-xl border border-neutral-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-amber-500">Welcome Back</h2>
          <p className="mt-2 text-gray-400">Sign in to manage your finances</p>
        </div>

        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* The Login Button */}
            <button
              formAction={login}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Sign in
            </button>

            {/* The Signup Button */}
            <button
              formAction={signup}
              className="w-full flex justify-center py-2 px-4 border border-neutral-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-neutral-800 focus:outline-none"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
