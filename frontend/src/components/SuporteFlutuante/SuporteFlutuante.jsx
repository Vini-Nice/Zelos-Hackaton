import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function SuporteFlutuante() {
  return (
    <Link href="/suporte">
      <div className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg cursor-pointer flex items-center justify-center animate-bounce">
        <MessageSquare className="h-6 w-6" />
      </div>
    </Link>
  );
}
