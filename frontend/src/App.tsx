import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { AuthProvider } from './contexts/AuthContext'
import { HomePage } from '@/pages/HomePage'
import { DraftPage } from '@/pages/DraftPage'
import { TeamsPage } from '@/pages/TeamsPage'
import { TeamProfilePage } from '@/pages/TeamProfilePage'
import { TournamentsPage } from '@/pages/TournamentsPage'
import CastersPage from '@/pages/CastersPage'
import CasterProfilePage from '@/pages/CasterProfilePage'
import NewsPage from '@/pages/NewsPage'
import NewsDetailPage from '@/pages/NewsDetailPage'
import { TournamentDetailPage } from '@/pages/TournamentDetailPage'
import { LeagueDetailPage } from '@/pages/LeagueDetailPage'
import AboutPage from '@/pages/AboutPage'
import TeamPage from '@/pages/TeamPage'
import StoryPage from '@/pages/StoryPage'
import ValuesPage from '@/pages/ValuesPage'
import FaqPage from './pages/FaqPage'
import LegalSupportPage from './pages/LegalSupportPage'
import ReportProblemPage from './pages/ReportProblemPage'
import ContactPage from './pages/ContactPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminPage from './pages/AdminPage'
import ResultsPage from './pages/ResultsPage'

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/draft" element={<DraftPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/teams/:id" element={<TeamProfilePage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
          <Route path="/leagues/:id" element={<LeagueDetailPage />} />
          <Route path="/casters" element={<CastersPage />} />
          <Route path="/casters/:id" element={<CasterProfilePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/results" element={<ResultsPage />} />
          
          {/* Sobre Nós */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/values" element={<ValuesPage />} />

          {/* Suporte */}
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/legal-support" element={<LegalSupportPage />} />
          <Route path="/report-problem" element={<ReportProblemPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Legal */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Autenticação */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App 