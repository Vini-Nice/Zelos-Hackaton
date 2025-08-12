import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 h-12 px-10 flex items-center justify-between">
      <h1 className="text-xl text-gray-900">ZELOS</h1>
      <Avatar className="h-8 w-8">
        <AvatarImage src="/abstract-geometric-shapes.png" />
        <AvatarFallback>F</AvatarFallback>
      </Avatar>
    </header>
  );
}
