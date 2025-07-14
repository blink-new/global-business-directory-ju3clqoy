import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { blink } from './blink/client'
import { Toaster } from './components/ui/toaster'

// Pages
import HomePage from './pages/HomePage'
import SearchResults from './pages/SearchResults'
import BusinessDetail from './pages/BusinessDetail'
import BusinessDetailSEO from './pages/BusinessDetailSEO'
import Dashboard from './pages/Dashboard'
import AddListing from './pages/AddListing'
import AdminPanel from './pages/AdminPanel'
import CategoryPage from './pages/CategoryPage'
import LocationPage from './pages/LocationPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import FAQ from './pages/FAQ'
import CookiePolicy from './pages/CookiePolicy'

// Components
import Navbar from './components/Navbar'
import LoadingScreen from './components/LoadingScreen'
import Footer from './components/Footer'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/business/:id" element={<BusinessDetail />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/location/:type/:id" element={<LocationPage />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/add-listing" element={<AddListing user={user} />} />
            <Route path="/admin" element={<AdminPanel user={user} />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            {/* SEO-friendly business detail routes: /category/location/business-name-id */}
            <Route path="/*" element={<BusinessDetailSEO />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  )
}

export default App