import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Gamepad2, Trophy, Star, Crown, CheckCircle, XCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Componente de confete
const Confetti = ({ delay, duration, x, y, color }: any) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full"
    style={{ backgroundColor: color }}
    animate={{
      x: [x, x + Math.random() * 200 - 100],
      y: [y, y + 300],
      rotate: [0, 360],
      scale: [1, 0],
    }}
    transition={{
      duration: duration,
      delay: delay,
      ease: "easeOut"
    }}
  />
);

// Componente de progresso da password
const PasswordStrength = ({ password }: { password: string }) => {
  const getStrength = () => {
    if (password.length === 0) return { score: 0, color: 'bg-gray-500', text: '' };
    if (password.length < 6) return { score: 1, color: 'bg-red-500', text: 'Muito fraca 😰' };
    if (password.length < 8) return { score: 2, color: 'bg-orange-500', text: 'Fraca 😕' };
    if (password.length < 10) return { score: 3, color: 'bg-yellow-500', text: 'Média 😊' };
    if (password.length < 12) return { score: 4, color: 'bg-blue-500', text: 'Forte 💪' };
    return { score: 5, color: 'bg-green-500', text: 'Muito forte! 🔥' };
  };

  const strength = getStrength();
  const percentage = (strength.score / 5) * 100;

  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">Força da password:</span>
        <span className={strength.color.replace('bg-', 'text-')}>{strength.text}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${strength.color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: 'pt',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const success = await register(formData.username, formData.email, formData.password);
      if (success) {
        setSuccess(true);
        setShowConfetti(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError('Este email já está registado. Tenta outro email.');
      }
    } catch (err) {
      setError('Erro ao criar conta. Tenta novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const confettiColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#2d1b69] to-[#0a0a0a] relative overflow-hidden">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <Confetti
                key={i}
                delay={i * 0.1}
                duration={3}
                x={Math.random() * window.innerWidth}
                y={Math.random() * window.innerHeight}
                color={confettiColors[Math.floor(Math.random() * confettiColors.length)]}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Background gradients animados */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 20,
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
          className="w-full max-w-lg"
        >
          {/* Header animado */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl"
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
            >
              <Crown className="w-12 h-12 text-white" />
            </motion.div>
            <motion.h1
              className="text-5xl font-orbitron font-bold gradient-text mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Junta-te à Elite! 👑
            </motion.h1>
            <motion.p
              className="text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Vamos criar a tua lenda na scene ibérica! 🚀
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
                <span className="text-green-400 text-sm">Conta criada com sucesso! A redirecionar...</span>
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
            {/* Campo Username */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome de Utilizador
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                  placeholder="O teu nome de guerra"
                  required
                />
              </div>
            </motion.div>

            {/* Campo Email */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                  placeholder="teu@email.com"
                  required
                />
              </div>
            </motion.div>

            {/* Campo Password */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
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
              <PasswordStrength password={formData.password} />
            </motion.div>

            {/* Campo Confirmar Password */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                      : formData.confirmPassword && formData.password === formData.confirmPassword
                      ? 'border-green-400 focus:border-green-400 focus:ring-green-400/20'
                      : 'border-white/20 focus:border-purple-400 focus:ring-purple-400/20'
                  }`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {formData.confirmPassword && (
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                    {formData.password === formData.confirmPassword ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Campo País */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                País
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
              >
                <option value="pt">🇵🇹 Portugal</option>
                <option value="es">🇪🇸 Espanha</option>
              </select>
            </motion.div>

            {/* Checkbox Termos */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 }}
            >
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  className="w-5 h-5 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-400 focus:ring-2"
                />
                <span className="text-sm text-gray-300">
                  Aceito os{' '}
                  <Link to="/terms" className="text-purple-400 hover:text-purple-300">
                    Termos e Condições
                  </Link>{' '}
                  e a{' '}
                  <Link to="/privacy" className="text-purple-400 hover:text-purple-300">
                    Política de Privacidade
                  </Link>
                </span>
              </label>
            </motion.div>

            {/* Botão de Registo */}
            <motion.button
              type="submit"
              disabled={isLoading || !formData.acceptTerms || formData.password !== formData.confirmPassword}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden ${
                isLoading || !formData.acceptTerms || formData.password !== formData.confirmPassword
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25'
              }`}
              whileHover={!isLoading && formData.acceptTerms && formData.password === formData.confirmPassword ? { scale: 1.05 } : {}}
              whileTap={!isLoading && formData.acceptTerms && formData.password === formData.confirmPassword ? { scale: 0.95 } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
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
                    Criando a tua lenda...
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Crown className="w-5 h-5" />
                    Criar Conta
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Links adicionais */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}
            >
              <div className="text-sm text-gray-500">
                Já tens conta?{' '}
                <Link
                  to="/login"
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                >
                  Entra na arena! ⚔️
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
              onClick={triggerConfetti}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              🎉 Clique aqui para uma surpresa! 🎉
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default RegisterPage; 