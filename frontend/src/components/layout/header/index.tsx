import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, UserPlus, Shield, LogOut, User } from 'lucide-react'
import { Button } from '../../ui/Button'
import { useAuth } from '../../../contexts/AuthContext'

const navigation = [
  { name: 'Início', href: '/' },
  { name: 'Draft', href: '/draft', highlight: '🔥' },
  { name: 'Equipas', href: '/teams' },
  { name: 'Torneios', href: '/tournaments' },
  { name: 'Resultados', href: '/results', highlight: '🏆' },
  { name: 'Casters', href: '/casters' },
  { name: 'Notícias', href: '/news' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
      <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-orbitron font-bold text-sm">CS</span>
            </div>
            <span className="text-xl font-orbitron font-bold gradient-text">CS2Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-base font-medium transition-colors relative group ${
                  location.pathname === item.href
                    ? 'text-cyan-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.highlight && <span className="mr-1">{item.highlight}</span>}
                {item.name}
                <span
                  className={`absolute left-0 -bottom-0.5 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full ${
                    location.pathname === item.href ? 'w-full' : 'w-0'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* User Access & Mobile menu button */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-white">{user?.username}</span>
                  {isAdmin && (
                    <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                      <Shield className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-400 border-red-500/30 hover:bg-red-500/10">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Registar
                    <UserPlus className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-300 hover:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-white/10"
          >
            <div className="flex flex-col space-y-4 mb-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-base font-medium transition-colors block px-2 py-2 rounded-md ${
                    location.pathname === item.href
                      ? 'bg-cyan-500/10 text-cyan-300'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.highlight && <span className="mr-2">{item.highlight}</span>}
                  {item.name}
                </Link>
              ))}
            </div>
            {isAuthenticated ? (
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-white">{user?.username}</span>
                  {isAdmin && (
                    <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button variant="outline" className="w-full text-red-400 border-red-500/30 hover:bg-red-500/10" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">
                    Registar
                    <UserPlus className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </nav>
    </header>
  )
} 