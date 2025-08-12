export default function Footer() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <footer className="bg-white border border-gray-200 rounded-lg mt-8 px-6 py-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            © 2021 Themesberg, LLC. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <i className="fab fa-github"></i>
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800">
              <i className="fas fa-globe"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
