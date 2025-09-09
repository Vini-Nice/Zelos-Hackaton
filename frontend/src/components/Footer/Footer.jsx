import { Facebook, Twitter, Github, Globe } from "lucide-react";

export default function Footer() {
  return (
    <div className=" px-2 ">
      <footer className="bg-white border dark:bg-gray-900 dark:border-gray-200  border-gray-200 rounded-lg  px-6 py-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            © 2025 Zelos SENAI, LLC. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <Facebook size={18} />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <Twitter size={18} />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <Github size={18} />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <Globe size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
