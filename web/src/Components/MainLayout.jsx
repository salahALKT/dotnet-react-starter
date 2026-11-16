import { Outlet } from 'react-router'
import { useAuth } from '../Contexts/AuthContext'

const MainLayout = () => {
  const { logout, user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">My Todo App</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.email}</span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-md mt-auto">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-gray-600">© 2025 My Todo App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout