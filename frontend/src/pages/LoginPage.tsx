import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, Gamepad2, Zap, Sparkles, Rocket, CheckCircle, XCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Componente de partículas flutuantes
const FloatingParticle = ({ delay, duration, x, y }: any) => (
  <motion.div
    className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
    animate={{
      x: [x, x + 100, x],
      y: [y, y - 100, y],
      scale: [1, 1.5, 1],
      opacity: [0.3, 1, 0.3],
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
  />
);

// Componente de ícone flutuante
const FloatingIcon = ({ icon: Icon, delay, duration, x, y, color }: any) => (
  <motion.div
    className="absolute"
    style={{ left: x, top: y }}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
  >
    <Icon className={`w-6 h-6 ${color}`} />
  </motion.div>
);

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login(email, password);
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError('Email ou password incorretos. Tenta novamente.');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tenta novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerShake = () => {
    setError('💡 Dica: Tenta fazer login com "admin@cs2hub.pt" e password "admin123" 😉');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] relative overflow-hidden">
      {/* Partículas flutuantes */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.2}
            duration={3 + Math.random() * 2}
            x={Math.random() * window.innerWidth}
            y={Math.random() * window.innerHeight}
          />
        ))}
      </div>

      {/* Ícones flutuantes */}
      <FloatingIcon icon={Gamepad2} delay={0} duration={4} x="10%" y="20%" color="text-cyan-400" />
      <FloatingIcon icon={Zap} delay={1} duration={3} x="85%" y="30%" color="text-purple-400" />
      <FloatingIcon icon={Sparkles} delay={2} duration={5} x="15%" y="70%" color="text-yellow-400" />
      <FloatingIcon icon={Rocket} delay={0.5} duration={4} x="80%" y="80%" color="text-pink-400" />

      {/* Background gradients animados */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Header animado */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Gamepad2 className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h1
              className="text-4xl font-orbitron font-bold gradient-text mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Bem-vindo de volta!
            </motion.h1>
            <motion.p
              className="text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Pronto para dominar a scene ibérica? 🚀
            </motion.p>
          </motion.div>

          {/* Mensagens de erro/sucesso */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
              >
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-400 text-sm">{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-green-400 text-sm">Login realizado com sucesso! A redirecionar...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Formulário */}
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Campo Email */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  placeholder="teu@email.com"
                  required
                />
              </div>
            </motion.div>

            {/* Campo Password */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* Botão de Login */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden ${
                isLoading
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25'
              }`}
              whileHover={!isLoading ? { scale: 1.05 } : {}}
              whileTap={!isLoading ? { scale: 0.95 } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Entrando na arena...
                  </motion.div>
                ) : (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Rocket className="w-5 h-5" />
                    Entrar na Arena
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Links adicionais */}
            <motion.div
              className="mt-6 text-center space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              <Link
                to="/forgot-password"
                className="block text-sm text-gray-400 hover:text-cyan-400 transition-colors"
              >
                Esqueceste a password? 😅
              </Link>
              <div className="text-sm text-gray-500">
                Ainda não tens conta?{' '}
                <Link
                  to="/register"
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  Junta-te à comunidade! 🎮
                </Link>
              </div>
            </motion.div>
          </motion.form>

          {/* Easter egg */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <button
              onClick={triggerShake}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              {error}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage; 