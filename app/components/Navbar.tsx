import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-neutral-900 border-b border-neutral-800 text-white p-4">
      <div className="max-w-xl mx-auto flex justify-between items-center">
        
        {/* Logo / Home Link */}
        <Link href="/" className="text-xl font-bold text-amber-500 hover:text-amber-400">
          FinanceManager
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-4 text-sm font-medium">
          <Link 
            href="/dashboard" 
            className="hover:text-amber-500 transition"
          >
            Dashboard
          </Link>
          <Link 
            href="/transactions" 
            className="hover:text-amber-500 transition"
          >
            Transactions
          </Link>
        </div>

      </div>
    </nav>
  );
}