import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from 'framer-motion'
import {
  Target, Package, Star, Truck, Rocket, PoundSterling, Calendar,
  GraduationCap, Phone, Mail, MapPin, Car as CarIcon, Wrench, Award,
  TrendingUp, Clock, CheckCircle, Shield, LayoutDashboard, Inbox,
  Users, ClipboardCheck, CalendarClock, ArrowLeftCircle, ArrowRightCircle
} from 'lucide-react'
import SEO from './components/SEO'
import AdminLogin from './components/admin/AdminLogin'
import AdminPage from './components/admin/AdminPage'
import { useAuth } from './contexts/AuthContext'

// Default Recently Passed entries
const defaultPassed = [
  {
    name: 'Sophie, Worcester',
    tests: 'Passed 1st time',
    desc: 'Nervous at first, now confident in city traffic and roundabouts.',
    image: '/driving-instructor-worcester.webp'
  },
  {
    name: 'Adam, Malvern',
    tests: '2 minors',
    desc: 'Focused on clutch control and hill starts around Malvern Link.',
    image: '/rowan-mccann-driving-instructor.webp'
  },
  {
    name: 'Priya, St Peters',
    tests: 'Passed 1st time',
    desc: 'Polished mirror-signal routines and complex junctions.',
    image: '/driving-instructor-worcester.webp'
  },
  {
    name: 'Lewis, WR5',
    tests: 'Passed 2nd time',
    desc: 'Confidence boost with mock tests and motorway practice.',
    image: '/rowan-mccann-driving-instructor.webp'
  }
]


// Navigation Component
const Navigation = ({ onBookNowClick }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const whatsappNumber = '447539283257'
  const whatsappMessage = 'Hi! I would like to enquire about driving lessons with Drive RJM.'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white shadow-2xl'
          : 'bg-gradient-to-b from-white via-white to-white/95 backdrop-blur-md'
      }`}
    >
      {/* Angular accent bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-learner-red via-dark to-learner-red origin-left"
        style={{ clipPath: 'polygon(0 0, 100% 0, 99% 100%, 0% 100%)' }}
      />

      {/* Diagonal accent element */}
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-learner-red/5 to-transparent"
           style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }} />

      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center py-4 sm:py-6">
          <motion.a
            href="#"
            className="flex items-center flex-shrink-0 relative group"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {/* Logo glow effect on hover */}
            <div className="absolute inset-0 bg-learner-red/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src="/drive-rjm-logo.webp"
              alt="Drive RJM - Approved Driving Instructor in Worcester and Malvern"
              className="h-11 sm:h-13 md:h-16 w-auto relative z-10 drop-shadow-sm"
            />
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {['About', 'Services', 'Pricing', 'FAQ', 'Contact'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="relative px-3 lg:px-4 py-2 text-dark font-display font-bold text-sm lg:text-base tracking-wider hover:text-learner-red transition-colors group"
              >
                {item}
                {/* Diagonal underline effect */}
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 bg-learner-red origin-left"
                  initial={{ scaleX: 0, skewX: -12 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ width: '100%' }}
                />
              </motion.a>
            ))}
            <motion.button
              onClick={onBookNowClick}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="relative ml-4 bg-learner-red text-white px-6 lg:px-8 py-3 font-display font-bold text-sm lg:text-base tracking-widest clip-angle overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Animated background shine */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
              />
              <span className="relative z-10">BOOK NOW</span>
            </motion.button>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-2 sm:gap-3">
            <motion.a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-display font-bold shadow-lg hover:bg-green-600 transition-colors min-h-[2.75rem] flex items-center justify-center clip-angle"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              WhatsApp
            </motion.a>

            <button
              className="flex flex-col gap-1.5 z-50 p-2 min-w-[2.75rem] min-h-[2.75rem] items-center justify-center"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
                className="w-6 sm:w-7 h-0.5 bg-dark block"
              />
              <motion.span
                animate={{ opacity: isOpen ? 0 : 1 }}
                className="w-6 sm:w-7 h-0.5 bg-dark block"
              />
              <motion.span
                animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
                className="w-6 sm:w-7 h-0.5 bg-dark block"
              />
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop with gradient */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-gradient-to-br from-dark via-dark/95 to-learner-red/20 md:hidden z-40"
                  onClick={() => setIsOpen(false)}
                />

                {/* Menu content */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white md:hidden flex flex-col z-50 shadow-2xl"
                  style={{ clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0% 100%)' }}
                >
                  {/* Decorative angular accent */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-learner-red to-dark"
                       style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 0% 100%)' }} />

                  {/* Close button area */}
                  <div className="p-6 flex justify-end">
                    <motion.button
                      whileTap={{ scale: 0.9, rotate: 90 }}
                      onClick={() => setIsOpen(false)}
                      className="w-10 h-10 rounded-full bg-light-grey flex items-center justify-center text-dark hover:bg-learner-red hover:text-white transition-colors"
                    >
                      ×
                    </motion.button>
                  </div>

                  {/* Menu items */}
                  <div className="flex-1 flex flex-col justify-center px-8 space-y-6">
                    {['About', 'Services', 'Pricing', 'FAQ', 'Contact'].map((item, i) => (
                      <motion.a
                        key={item}
                        href={`#${item.toLowerCase()}`}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 + 0.2, type: "spring", stiffness: 100 }}
                        onClick={() => setIsOpen(false)}
                        className="relative text-3xl font-display font-bold text-dark hover:text-learner-red transition-colors group"
                      >
                        <span className="relative inline-block">
                          {item}
                          <motion.div
                            className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-learner-red rounded-full opacity-0 group-hover:opacity-100"
                            whileHover={{ scale: [1, 1.5, 1], transition: { duration: 0.3 } }}
                          />
                        </span>
                      </motion.a>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="p-8">
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, type: "spring" }}
                      onClick={() => {
                        setIsOpen(false)
                        onBookNowClick()
                      }}
                      className="w-full relative bg-learner-red text-white px-8 py-5 font-display font-bold text-lg tracking-widest clip-angle min-h-[3.5rem] overflow-hidden group"
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Animated shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
                      />
                      <span className="relative z-10">BOOK NOW</span>
                    </motion.button>

                    {/* Decorative element */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="mt-4 h-1 bg-gradient-to-r from-transparent via-learner-red to-transparent"
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </motion.header>
  )
}

// Animated Section Header Component
const AnimatedSectionHeader = ({ children, subtitle, isDark = false, underlineColor = 'bg-learner-red' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  // Split text into words for animation
  const words = children.split(' ')

  const textColor = isDark ? 'text-white' : 'text-dark'
  const subtitleColor = isDark ? 'text-gray-400' : 'text-medium-grey'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <h2 className={`text-6xl sm:text-7xl font-display font-bold ${textColor} mb-4 relative inline-block overflow-hidden`}>
        {words.map((word, wordIndex) => (
          <motion.span
            key={wordIndex}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{
              duration: 0.5,
              delay: wordIndex * 0.1,
              ease: [0.2, 0.65, 0.3, 0.9]
            }}
            className="inline-block mr-4"
          >
            {word}
          </motion.span>
        ))}
        <motion.span
          className={`absolute -bottom-2 left-0 h-1 ${underlineColor}`}
          initial={{ width: 0 }}
          animate={isInView ? { width: '60%' } : { width: 0 }}
          transition={{ delay: words.length * 0.1 + 0.3, duration: 0.8 }}
        />
      </h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: words.length * 0.1 + 0.5, duration: 0.5 }}
          className={`text-xl ${subtitleColor} font-medium mt-6`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}

// Contact Form Component
const ContactForm = ({ onClose, isModal = false, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    postcode: '',
    service: 'I\'d like a call back',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit({
        ...formData,
        source: isModal ? 'contact-modal' : 'contact-section',
        createdAt: new Date().toISOString()
      })
    }
    if (isModal && onClose) {
      onClose()
    }
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      postcode: '',
      service: 'I\'d like a call back',
      message: ''
    })
  }

  const inputClass = "w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-learner-red focus:outline-none transition-colors font-medium"
  const labelClass = "block text-sm font-bold text-dark mb-2 tracking-wide"

  return (
    <form onSubmit={handleSubmit} className={isModal ? "space-y-4" : "grid md:grid-cols-2 gap-4"}>
      <div className={!isModal ? "md:col-span-1" : ""}>
        <label className={labelClass}>NAME *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className={inputClass}
          placeholder="Your full name"
        />
      </div>

      <div className={!isModal ? "md:col-span-1" : ""}>
        <label className={labelClass}>EMAIL *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className={inputClass}
          placeholder="your@email.com"
        />
      </div>

      <div className={!isModal ? "md:col-span-1" : ""}>
        <label className={labelClass}>PHONE *</label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className={inputClass}
          placeholder="07XXX XXXXXX"
        />
      </div>

      <div className={!isModal ? "md:col-span-1" : ""}>
        <label className={labelClass}>POSTCODE *</label>
        <input
          type="text"
          required
          value={formData.postcode}
          onChange={(e) => setFormData({...formData, postcode: e.target.value})}
          className={inputClass}
          placeholder="WR1 2XX"
        />
      </div>

      <div className={!isModal ? "md:col-span-2" : ""}>
        <label className={labelClass}>SERVICE *</label>
        <select
          required
          value={formData.service}
          onChange={(e) => setFormData({...formData, service: e.target.value})}
          className={inputClass}
        >
          <option>I'd like a call back</option>
          <option>I'd like to book lessons</option>
          <option>I need some further information</option>
        </select>
      </div>

      <div className={!isModal ? "md:col-span-2" : ""}>
        <label className={labelClass}>MESSAGE (OPTIONAL)</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className={`${inputClass} resize-none`}
          rows="4"
          placeholder="Tell us more about what you're looking for..."
        />
      </div>

      <div className={!isModal ? "md:col-span-2" : ""}>
        <button
          type="submit"
          className="w-full bg-learner-red text-white px-8 py-4 font-bold text-lg tracking-wide clip-angle hover:bg-dark transition-colors"
        >
          SEND MESSAGE
        </button>
      </div>
    </form>
  )
}

// Hero Section
const Hero = ({ onBookNowClick, onPostcodeCheck, onContactClick }) => {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 120])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.6])
  const scale = useTransform(scrollY, [0, 300], [1, 1.1])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14 pb-32 sm:pt-28 sm:pb-36">
      {/* Dynamic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-light-grey/50 to-white" />

      {/* Animated angular accent shapes - wrapped so they can't cause overflow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ y, opacity, clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 70%)' }}
          className="absolute top-32 right-0 translate-x-1/4 w-64 h-64 bg-gradient-to-br from-learner-red/20 to-transparent hidden sm:block"
          animate={{ rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          style={{ y: useTransform(scrollY, [0, 500], [0, -80]), clipPath: 'polygon(0 0, 70% 0, 100% 30%, 0 100%)' }}
          className="absolute top-20 left-0 -translate-x-1/4 w-48 h-48 bg-gradient-to-tr from-dark/10 to-transparent hidden sm:block"
          animate={{ rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating decorative elements - hidden on mobile */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-1/4 w-3 h-40 bg-learner-red opacity-20 rotate-12 hidden lg:block"
      />
      <motion.div
        style={{ y: useTransform(scrollY, [0, 500], [0, -100]) }}
        className="absolute bottom-40 left-10 w-64 h-64 bg-gradient-radial from-learner-red/10 to-transparent rounded-full blur-3xl hidden sm:block"
      />

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
            >
              {/* Mobile hero image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mb-8 sm:hidden"
              >
                {/* Mobile wordmark above image */}
                <div className="text-center mb-4">
                  <div className="text-4xl font-display font-extrabold tracking-[0.22em] text-dark">
                    DRIVE <span className="text-learner-red">RJM</span>
                  </div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-medium-grey">
                    Driving lessons in Worcestershire
                  </div>
                </div>

                <div className="relative">
                  <img
                    src="/driving-instructor-worcester.webp"
                    alt="Drive RJM - Professional Manual Driving Lessons in Worcester and Malvern"
                    className="w-full rounded-2xl shadow-2xl"
                  />
                  <div className="absolute -bottom-3 -right-3 w-full h-full border-2 border-learner-red rounded-2xl -z-10"
                       style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0 95%)' }} />
                </div>
              </motion.div>

              {/* Logo with enhanced presentation */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="mb-8 relative"
              >
                <div className="hidden sm:block relative">
                  <img
                    src="/drive-rjm-logo.webp"
                    alt="Drive RJM - Professional Manual Driving Lessons"
                    className="w-full max-w-md drop-shadow-2xl"
                  />
                  {/* Accent line under logo */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                    className="absolute -bottom-4 left-0 h-1.5 bg-gradient-to-r from-learner-red via-dark to-transparent origin-left"
                    style={{ width: '60%', clipPath: 'polygon(0 0, 100% 0, 98% 100%, 0% 100%)' }}
                  />
                </div>
              </motion.div>

              {/* Tagline with premium typography */}
              <motion.p
                className="text-xl sm:text-2xl lg:text-3xl text-dark font-medium mb-3 max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Friendly, patient driving instruction in{' '}
                <span className="font-display font-bold text-learner-red">Worcester & Malvern</span>
              </motion.p>

              <motion.p
                className="text-base sm:text-lg text-medium-grey mb-10 max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Build confidence, pass your test, gain skills for life.
              </motion.p>

              {/* CTA Buttons with premium styling */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <motion.button
                  onClick={onBookNowClick}
                  className="relative bg-learner-red text-white px-10 py-5 font-display font-bold text-base lg:text-lg tracking-widest clip-angle text-center overflow-hidden group shadow-xl"
                  whileHover={{ scale: 1.03, x: 3 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    START YOUR JOURNEY
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                </motion.button>

                <motion.a
                  href="#about"
                  className="relative border-3 border-dark text-dark px-10 py-5 font-display font-bold text-base lg:text-lg tracking-widest inline-block text-center overflow-hidden group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Hover background fill */}
                  <motion.div
                    className="absolute inset-0 bg-dark"
                    initial={{ y: '100%' }}
                    whileHover={{ y: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 group-hover:text-white transition-colors">LEARN MORE</span>
                </motion.a>
              </motion.div>
            </motion.div>
          </div>

          {/* Hero Image with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, type: "spring", stiffness: 80 }}
            className="relative w-full max-w-md mx-auto sm:max-w-none sm:mx-0 mt-6 sm:mt-0 hidden sm:block"
          >
            <div className="relative">
              {/* Main image with angular frame */}
              <div className="relative aspect-[4/3] rounded-2xl shadow-2xl overflow-hidden">
                <motion.img
                  style={{ scale }}
                  src="/driving-instructor-worcester.webp"
                  alt="Rowan McCann - Professional Driving Instructor in Worcester with learner driver"
                  className="w-full h-full object-cover"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent" />

                {/* Angular accent bars */}
                <motion.div
                  className="absolute top-0 right-0 w-3 h-full bg-learner-red shadow-lg"
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 98%, 0% 100%)' }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-3 bg-dark shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                  style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 0% 100%)' }}
                />
              </div>

              {/* Angular border accent */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border-3 border-learner-red rounded-2xl -z-10"
                   style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0 95%)' }}
              />

              {/* Floating decorative elements */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-learner-red/30 to-transparent rounded-lg blur-sm"
                style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 0% 100%)' }}
              />
              <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-tr from-dark/20 to-transparent rounded-lg blur-sm"
                style={{ clipPath: 'polygon(0 20%, 80% 0, 100% 100%, 0% 100%)' }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Postcode Checker Strip */}
      <PostcodeChecker onPostcodeCheck={onPostcodeCheck} onContactClick={onContactClick} />
    </section>
  )
}

// Postcode Checker Component
const PostcodeChecker = ({ onPostcodeCheck, onContactClick }) => {
  const [postcode, setPostcode] = useState('')
  const [checkResult, setCheckResult] = useState(null)
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0)

  const coveredPostcodes = [
    'WR1', 'WR2', 'WR3', 'WR4', 'WR5', 'WR6', 'WR13', 'WR14'
  ]

  const coveredAreas = [
    'Worcester', 'Malvern', 'St John\'s', 'St Peters', 'Warndon', 'Powick',
    'Rushwick', 'Kempsey', 'Hallow', 'Ombersley', 'Holt Heath', 'Great Witley',
    'Martley', 'Broadheath', 'Bransford', 'Malvern Link', 'Great Malvern',
    'Barnards Green'
  ]

  // Mobile animation: cycle through areas
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAreaIndex((prev) => (prev + 1) % coveredAreas.length)
    }, 2000) // Change every 2 seconds

    return () => clearInterval(interval)
  }, [coveredAreas.length])

  const checkPostcode = (e) => {
    e.preventDefault()
    const cleanedPostcode = postcode.trim().toUpperCase().replace(/\s+/g, '')
    const postcodePrefix = cleanedPostcode.match(/^[A-Z]+\d+/)?.[0] || ''

    const isCovered = coveredPostcodes.some(prefix => postcodePrefix.startsWith(prefix))
    setCheckResult(isCovered)
    onPostcodeCheck(isCovered)
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20">
      {/* Solid red background */}
      <div className="absolute inset-0 bg-learner-red" />

      {/* Angular decorative elements */}
      <motion.div
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-64 h-full bg-dark/10"
        style={{ clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0% 100%)' }}
      />
      <motion.div
        animate={{ x: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-48 h-full bg-dark/10"
        style={{ clipPath: 'polygon(0 0, 100% 0, 60% 100%, 0% 100%)' }}
      />

      <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <div className="flex flex-col gap-6">
          {/* Areas List with enhanced styling */}
          {/* Desktop: Show all areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden sm:block text-center"
          >
            <div className="inline-block relative">
              <span className="text-xs sm:text-sm font-display font-bold tracking-widest text-white uppercase">
                Areas Covered
              </span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="h-px bg-gradient-to-r from-transparent via-white to-transparent mt-2"
              />
            </div>
            <div className="mt-3 text-sm text-white font-medium tracking-wide">
              {coveredAreas.slice(0, 6).join(' • ')} & More
            </div>
          </motion.div>

          {/* Mobile: Animated single area with enhanced design */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="sm:hidden text-center min-h-[3rem] flex flex-col items-center justify-center"
          >
            <span className="text-xs font-display font-bold tracking-widest text-white uppercase mb-2">
              Areas Covered
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={currentAreaIndex}
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.9 }}
                transition={{ duration: 0.4, type: "spring" }}
                className="text-lg font-bold text-white font-display"
              >
                {coveredAreas[currentAreaIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* Postcode Checker with premium styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <form onSubmit={checkPostcode} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center max-w-2xl mx-auto">
              <div className="relative flex-1 sm:max-w-xs">
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="Enter your postcode"
                  className="w-full px-5 py-3.5 bg-white/95 backdrop-blur-sm text-dark placeholder-medium-grey/60 border-2 border-white/30 focus:border-white focus:bg-white focus:outline-none transition-all font-medium text-base tracking-wide shadow-lg"
                />
                <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-learner-red/10 to-transparent pointer-events-none"
                     style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }} />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-white text-learner-red px-8 py-3.5 font-display font-bold text-base tracking-widest hover:bg-dark hover:text-white transition-all clip-angle overflow-hidden group shadow-xl"
              >
                {/* Animated background on hover */}
                <motion.div
                  className="absolute inset-0 bg-dark"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">CHECK COVERAGE</span>
              </motion.button>
            </form>
            <AnimatePresence>
              {checkResult !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mt-5 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className={`inline-block px-6 py-3 rounded-lg font-display font-bold text-base ${
                      checkResult
                        ? 'bg-green-500/20 border-2 border-green-400 text-green-100'
                        : 'bg-yellow-500/20 border-2 border-yellow-400 text-yellow-100'
                    } shadow-lg backdrop-blur-sm`}
                  >
                    {checkResult
                      ? '✓ Perfect! We cover your area.'
                      : 'We may still help - Get in touch!'}
                  </motion.div>
                  {checkResult && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onContactClick}
                      className="mt-4 sm:hidden bg-white text-learner-red px-8 py-3 font-display font-bold text-sm tracking-widest hover:bg-learner-red hover:text-white transition-colors clip-angle shadow-xl"
                    >
                      GET IN TOUCH
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// Quick Contact Section
const QuickContact = ({ postcodeCheckResult, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    postcode: '',
    service: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit({
        ...formData,
        source: 'quick-contact',
        createdAt: new Date().toISOString()
      })
    }
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      postcode: '',
      service: ''
    })
  }

  // Hide on mobile if postcode check was successful
  if (postcodeCheckResult === true) {
    return (
      <section className="bg-learner-red text-white py-6 hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-center gap-4">
          <div className="text-xl font-bold hidden lg:block whitespace-nowrap">
            GET IN TOUCH
          </div>

          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full lg:flex-1 px-4 py-3 bg-white text-dark border-none focus:outline-none focus:ring-2 focus:ring-dark"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full lg:flex-1 px-4 py-3 bg-white text-dark border-none focus:outline-none focus:ring-2 focus:ring-dark"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            className="w-full lg:flex-1 px-4 py-3 bg-white text-dark border-none focus:outline-none focus:ring-2 focus:ring-dark"
            required
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />

          <input
            type="text"
            name="postcode"
            placeholder="Postcode"
            className="w-full lg:flex-1 px-4 py-3 bg-white text-dark border-none focus:outline-none focus:ring-2 focus:ring-dark"
            required
            value={formData.postcode}
            onChange={(e) => setFormData({...formData, postcode: e.target.value})}
          />

          <select
            name="service"
            className="w-full lg:flex-1 px-4 py-3 bg-white text-dark border-none focus:outline-none focus:ring-2 focus:ring-dark"
            required
            value={formData.service}
            onChange={(e) => setFormData({...formData, service: e.target.value})}
          >
            <option value="" disabled>Please Select</option>
            <option value="call-back">I'd like a call back</option>
            <option value="book-lessons">I'd like to book lessons</option>
            <option value="information">I need some further information</option>
          </select>

          <button
            type="submit"
            className="w-full lg:w-auto px-8 py-3 bg-dark text-white font-bold tracking-wide hover:bg-white hover:text-learner-red transition-colors whitespace-nowrap clip-angle"
          >
            BOOK LESSONS
          </button>
        </form>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-learner-red text-white py-6 hidden md:block">
      <div className="max-w-7xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-center gap-4">
          <div className="text-xl font-bold hidden lg:block whitespace-nowrap">
            GET IN TOUCH
          </div>

          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full lg:flex-1 px-4 py-3 bg-white text-dark border-none focus:outline-none focus:ring-2 focus:ring-dark"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full lg:flex-1 px-4 py-3 bg-white text-dark border-none focus:outline-none focus:ring-2 focus:ring-dark"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            className="w-full lg:flex-1 px-4 py-3 bg-white text-dark border-none focus:outline-none focus:ring-2 focus:ring-dark"
            required
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />

          <input
            type="text"
            name="postcode"
            placeholder="Postcode"
            className="w-full lg:flex-1 px-4 py-3 bg-white text-dark border-none focus:outline-none focus:ring-2 focus:ring-dark"
            required
            value={formData.postcode}
            onChange={(e) => setFormData({...formData, postcode: e.target.value})}
          />

          <select
            name="service"
            className="w-full lg:flex-1 px-4 py-3 bg-white text-dark border-none focus:outline-none focus:ring-2 focus:ring-dark"
            required
            value={formData.service}
            onChange={(e) => setFormData({...formData, service: e.target.value})}
          >
            <option value="">Select a service...</option>
            <option value="callback">I'd like a call back</option>
            <option value="information">I need some further information</option>
          </select>

          <button
            type="submit"
            className="w-full lg:w-auto px-8 py-3 bg-dark text-white font-bold tracking-wide hover:bg-white hover:text-learner-red transition-colors whitespace-nowrap clip-angle"
          >
            BOOK LESSONS
          </button>
        </form>
      </div>
    </section>
  )
}

// Section container with scroll animation
const AnimatedSection = ({ children, id, className = '' }) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      className={`py-16 md:py-20 ${className}`}
    >
      {children}
    </motion.section>
  )
}

// About Section
const About = () => {
  return (
    <AnimatedSection id="about" className="bg-light-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader subtitle="Your dedicated driving instructor in Worcester">
          MEET ROWAN
        </AnimatedSectionHeader>

        {/* Mobile portrait */}
        <div className="sm:hidden w-full max-w-sm mx-auto mb-8">
          <div className="aspect-[3/4] rounded-lg shadow-2xl overflow-hidden relative">
            <img
              src="/rowan-mccann-driving-instructor.webp"
              alt="Rowan McCann - Qualified ADI Driving Instructor serving Worcester and Malvern"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-learner-red" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-dark leading-relaxed"
            >
              Rowan McCann is a dedicated and passionate driving instructor based in Worcester, offering manual driving lessons tailored to suit the individual needs of each pupil. With a commitment to excellence, Rowan focuses on helping students achieve their driving goals swiftly and safely.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-dark leading-relaxed"
            >
              His approach is particularly beneficial for nervous and unconfident drivers, as he recognises that everyone learns at different paces. Each lesson is designed to be both productive and enjoyable, ensuring that students feel at ease and confident behind the wheel.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-lg text-dark leading-relaxed"
            >
              Having transitioned from a successful eight-year career in used car sales, Rowan brings a wealth of experience and a genuine love for cars to his role as a driving instructor.
            </motion.p>

            {/* Highlight Cards */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              {[
                { title: 'PATIENT', desc: 'Calm, supportive approach' },
                { title: 'EXPERIENCED', desc: '8 years automotive industry' },
                { title: 'FRIENDLY', desc: 'Approachable & committed' },
                { title: 'FLEXIBLE', desc: 'Lessons to suit you' }
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ scale: 1.05, x: 5 }}
                  className="bg-white p-6 border-l-4 border-learner-red shadow-lg"
                >
                  <h3 className="text-2xl font-display font-bold text-learner-red mb-2">{item.title}</h3>
                  <p className="text-sm text-medium-grey">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative hidden sm:block"
          >
            <div className="aspect-[3/4] rounded-lg shadow-2xl overflow-hidden relative">
              <img
                src="/rowan-mccann-driving-instructor.webp"
                alt="Rowan McCann - Qualified ADI Driving Instructor serving Worcester and Malvern"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-learner-red" />
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  )
}

// Services Section
const Services = () => {
  const [selectedService, setSelectedService] = useState(null)

  const services = [
    {
      icon: 'L',
      image: '/learner-driver-training-worcester.webp',
      altText: 'Learner driver with L plates receiving professional driving instruction in Worcester',
      title: 'LEARNER DRIVER TRAINING',
      description: 'Professional instruction for beginners and partly-trained students. We work with absolute beginners, partly trained students, and those almost test-ready.',
      features: [
        'Client-centred, relaxed approach',
        'Weekly lessons or intensive courses',
        'Flexible scheduling (early morning, evening, weekends)',
        'Coverage: WR1-WR6, WR13, WR14'
      ],
      fullContent: `What we do day in, day out is train learner drivers to be safe and confident drivers. We offer driving lessons in the following postcodes: WR1, WR2, WR3, WR4, WR5, WR6, WR13, and WR14.

All of our lessons are conducted in a relaxed and friendly atmosphere, using the latest client-centred approaches. We encourage students to take responsibility for their learning and driving, with a supportive and friendly trainer by their side. No question is too silly – you're there to learn, and we're there to help!

We pride ourselves on getting you passed as quickly as possible, finding the right balance between getting you up to test standard and not dragging training out at your expense.

We're happy to work to your schedule, whether it's weekly lessons or a more intensive course to prepare for an imminent test. We work with absolute beginners who've never driven before, partly trained students, and people who are almost test-ready and just looking for a bit of finessing before the test.

We can work around your schedule, whether you need early morning, evening, or weekend lessons. We're happy to adapt around you.`
    },
    {
      icon: '+',
      image: '/confidence-building-driving-lessons.webp',
      altText: 'Confident driver after refresher driving lessons and confidence building training',
      title: 'CONFIDENCE BOOSTING',
      description: 'Refresher training for full licence holders who need to rebuild confidence or enhance their skills.',
      features: [
        'Returning to driving after a break',
        'Post-accident confidence rebuilding',
        'Motorway driving instruction',
        'Training in your car or ours'
      ],
      fullContent: `Have you got a full driving licence but for whatever reason you lack confidence or would like some additional training?

Perhaps you:

• Haven't driven for a long time
• Had an accident and now feel nervous
• Were unable to drive for a period of time for health reasons
• Have passed your test but haven't driven on the motorway before

We can help, for whatever reason it is. Just like we train provisional licence holders to drive, we can help you with any or all aspects of driving.

We're happy to provide this training in your car, or ours, whichever you prefer. The pricing for this is the same as for provisional licence holders and can be found here.`
    },
    {
      icon: 'T',
      image: '/towing-training-worcester.webp',
      altText: 'Professional towing training with trailer and caravan in Worcester and Malvern',
      title: 'TOWING TRAINING',
      description: 'Comprehensive towing instruction for trailers and caravans, taught by an instructor with B+E qualification and weekly towing experience.',
      features: [
        'Vehicle & trailer checks',
        'Hitching, loading, and safe driving',
        'Reversing and manoeuvring',
        'Half-day or full-day sessions'
      ],
      fullContent: `The law was changed in December 2021 to give every driver with a car licence (category B) the trailer entitlement too (B+E). So if you have a full car licence, you can also tow a trailer up to 3500kg subject to the towing limit of the car in question. Just because everyone is licensed to tow a trailer or caravan, it doesn't mean they are safe or confident in doing so.

Drive RJM can help! Drive RJM's owner, Rowan, passed his B+E test in 2014 and has towed a trailer on a weekly basis ever since. We can cover all aspects of towing with you to meet your needs and wishes. Because this is voluntary training with no test at the end of it, we can cover as much or as little as you'd like. If, for example, you'd like to spend a whole day just towing on the motorway, we can do that!

Topics typically covered include:

• Trailer and vehicle checks before towing
• Hitching and unhitching
• Safe loading
• Adapting driving style to towing
• Reversing
• Junctions and manoeuvring
• Motorway / faster road driving

We offer this training as either a half or full day (or multiples thereof). We would recommend a full day for someone with little or no experience of towing, or a half day for someone that has experience towing before and would like to cover specific aspects.

A half day is four hours with a comfort/coffee break in the middle, a full day is two four-hour sessions with a half-hour lunch break in the middle.

We offer this training in your tow vehicle with either your trailer/caravan or you can use our Brian James flatbed trailer for a small additional charge.`
    }
  ]

  return (
    <>
      <AnimatedSection id="services" className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSectionHeader subtitle="Comprehensive driving instruction for all levels">
            OUR SERVICES
          </AnimatedSectionHeader>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.button
                key={service.title}
                onClick={() => setSelectedService(service)}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white shadow-xl overflow-hidden group cursor-pointer text-left"
              >
                {/* Image Header */}
                <div className="w-full h-64 overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.altText}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-learner-red/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white font-display font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to learn more
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 border-t-4 border-transparent group-hover:border-learner-red transition-colors">
                  <h3 className="text-2xl font-display font-bold text-dark mb-4">{service.title}</h3>
                  <p className="text-medium-grey mb-6 leading-relaxed">{service.description}</p>

                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <span className="text-learner-red mr-2 mt-1">▸</span>
                        <span className="text-sm text-dark">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Service Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedService(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
              style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 0% 100%)' }}
            >
              {/* Header with Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={selectedService.image}
                  alt={selectedService.altText}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/50 to-transparent" />
                <h2 className="absolute bottom-8 left-8 text-5xl font-display font-bold text-white">
                  {selectedService.title}
                </h2>
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-6 right-6 w-12 h-12 bg-learner-red text-white flex items-center justify-center font-bold text-2xl hover:bg-white hover:text-learner-red transition-colors clip-angle"
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  {selectedService.fullContent.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="text-dark leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t-2 border-learner-red flex gap-4">
                  <a
                    href="#pricing"
                    onClick={() => setSelectedService(null)}
                    className="bg-learner-red text-white px-8 py-4 font-bold tracking-wide clip-angle inline-block text-center hover:bg-dark transition-colors"
                  >
                    VIEW PRICING
                  </a>
                  <a
                    href="#contact"
                    onClick={() => setSelectedService(null)}
                    className="border-2 border-dark text-dark px-8 py-4 font-bold tracking-wide inline-block text-center hover:bg-dark hover:text-white transition-colors"
                  >
                    GET IN TOUCH
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Recently Passed Carousel
const RecentlyPassed = () => {
  const people = [
    {
      name: 'Sophie, Worcester',
      tests: 'Passed 1st time',
      desc: 'Nervous at first, now confident in city traffic and roundabouts.',
      image: '/driving-instructor-worcester.webp'
    },
    {
      name: 'Adam, Malvern',
      tests: '2 minors',
      desc: 'Focused on clutch control and hill starts around Malvern Link.',
      image: '/rowan-mccann-driving-instructor.webp'
    },
    {
      name: 'Priya, St Peters',
      tests: 'Passed 1st time',
      desc: 'Polished mirror-signal routines and complex junctions.',
      image: '/driving-instructor-worcester.webp'
    },
    {
      name: 'Lewis, WR5',
      tests: 'Passed 2nd time',
      desc: 'Confidence boost with mock tests and motorway practice.',
      image: '/rowan-mccann-driving-instructor.webp'
    }
  ]

  const [index, setIndex] = useState(0)
  const safeIndex = ((index % people.length) + people.length) % people.length

  const goNext = () => setIndex((prev) => prev + 1)
  const goPrev = () => setIndex((prev) => prev - 1)

  return (
    <AnimatedSection id="recently-passed" className="bg-light-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader subtitle="Recent successes from learners across Worcester & Malvern">
          RECENTLY PASSED
        </AnimatedSectionHeader>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${safeIndex * 100}%)` }}
            >
              {people.map((person, idx) => (
                <div key={person.name} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-2">
                    <div className="relative h-64 md:h-full">
                      <img
                        src={person.image}
                        alt={`${person.name} - recent driving test pass`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                    <div className="p-6 sm:p-8 flex flex-col justify-center">
                      <div className="inline-flex items-center gap-2 bg-learner-red text-white px-3 py-2 rounded-full text-xs font-bold tracking-wide mb-4">
                        <CheckCircle className="w-4 h-4" />
                        RECENT PASS
                      </div>
                      <h3 className="text-2xl font-display font-bold text-dark mb-2">{person.name}</h3>
                      {person.tests && (
                        <p className="text-sm font-semibold text-learner-red mb-3 uppercase tracking-wide">
                          {person.tests}
                        </p>
                      )}
                      <p className="text-medium-grey text-base leading-relaxed">
                        {person.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={goPrev}
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-dark text-dark font-bold tracking-wide hover:bg-dark hover:text-white transition-colors"
            >
              <ArrowLeftCircle className="w-5 h-5" />
              Prev
            </button>
            <div className="flex items-center gap-2">
              {people.map((_, dotIndex) => (
                <div
                  key={dotIndex}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    dotIndex === safeIndex ? 'w-6 bg-learner-red' : 'w-2.5 bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={goNext}
              className="inline-flex items-center gap-2 px-4 py-2 bg-learner-red text-white font-bold tracking-wide hover:bg-dark transition-colors"
            >
              Next
              <ArrowRightCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

// Pricing Section
const Pricing = ({ onOpenBookingModal }) => {
  const [hours, setHours] = useState(2) // Default to intro offer
  const [selectedTowing, setSelectedTowing] = useState(null)
  const [useTrailer, setUseTrailer] = useState(false)
  const [showTowingModal, setShowTowingModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [isPriceBoxOpen, setIsPriceBoxOpen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false) // Track if user has selected a package

  // Keep the sticky summary from feeling heavy on small screens
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsPriceBoxOpen(false)
    }
  }, [])

  // Handler for when user selects hours - opens the sticky box and marks as interacted
  const handleHoursChange = (newHours) => {
    setHours(newHours)
    setSelectedTowing(null)
    setUseTrailer(false)
    setHasInteracted(true)
    if (window.innerWidth < 768) {
      setIsPriceBoxOpen(true)
    }
  }

  const setHoursAndRevealPriceBox = (value) => {
    setHours(value)
    setSelectedTowing(null)
    setUseTrailer(false)
    setHasInteracted(true) // Mark as interacted
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsPriceBoxOpen(true)
    }
  }

  // Handle towing selection and open sticky box on mobile
  const handleTowingSelect = (optionId) => {
    const isSelected = selectedTowing === optionId
    setSelectedTowing(isSelected ? null : optionId)
    setUseTrailer(false)
    setHasInteracted(true)
    if (!isSelected && typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsPriceBoxOpen(true)
    }
  }

  // Standard rate
  const standardRate = 35

  // Special offers with markers
  const specialOffers = [
    {
      id: 'intro',
      Icon: Target,
      name: 'Introductory Offer',
      hours: 2,
      price: 60,
      perHour: 30,
      description: 'Your first lesson with us',
      highlight: 'BEST VALUE FOR FIRST TIME',
      savings: 10
    },
    {
      id: 'block10',
      Icon: Package,
      name: 'Block Book 10 Hours',
      hours: 10,
      price: 340,
      perHour: 34,
      description: 'Five 2-hour lessons',
      highlight: 'SAVE £10',
      savings: 10
    },
    {
      id: 'block20',
      Icon: Award,
      name: 'Block Book 20 Hours',
      hours: 20,
      price: 660,
      perHour: 33,
      description: 'Ten 2-hour lessons',
      highlight: 'SAVE £40 - BEST VALUE',
      savings: 40
    }
  ]

  // Smart pricing calculator - checks for special offers
  const getSmartPricing = (hrs) => {
    const standardPrice = hrs * standardRate
    const offer = specialOffers.find(o => o.hours === hrs)

    if (offer) {
      return {
        price: offer.price,
        standardPrice,
        savings: standardPrice - offer.price,
        hasOffer: true,
        offer
      }
    }

    return {
      price: standardPrice,
      standardPrice,
      savings: 0,
      hasOffer: false,
      offer: null
    }
  }

  const pricing = getSmartPricing(hours)

  // Towing options
  const towingOptions = [
    {
      id: 'half',
      Icon: Truck,
      name: 'Half Day',
      hours: 4,
      price: 200,
      perHour: 50,
      description: 'Trailer or caravan training'
    },
    {
      id: 'full',
      Icon: Truck,
      name: 'Full Day',
      hours: 8,
      price: 350,
      perHour: 43.75,
      description: 'Comprehensive towing course',
      savings: 50
    }
  ]

  const towingPrice = selectedTowing
    ? towingOptions.find(t => t.id === selectedTowing).price + (useTrailer ? 50 : 0)
    : 0
  const selectedTowingOption = selectedTowing
    ? towingOptions.find(t => t.id === selectedTowing)
    : null

  return (
    <AnimatedSection id="pricing" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <AnimatedSectionHeader subtitle="Transparent pricing with block booking discounts">
            PRICING
          </AnimatedSectionHeader>
        </div>

        {/* Standard Hourly Rate Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-light-grey p-5 sm:p-8 rounded-2xl border border-gray-200 shadow-sm md:border-l-4 md:border-learner-red md:border-t-0 border-t-4 border-t-learner-red">
            <div className="text-center mb-5 sm:mb-6">
              <div className="inline-flex items-center gap-2 sm:gap-3 bg-learner-red text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full mb-3 sm:mb-4 text-sm sm:text-base">
                <PoundSterling className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="font-bold">STANDARD RATE: £35/HOUR</span>
              </div>
              <p className="text-medium-grey text-sm sm:text-base">Simple, fixed pricing with no hidden costs</p>
            </div>

            <div className="space-y-6">
              {/* Active Offer Badge */}
              <AnimatePresence mode="wait">
                {pricing.hasOffer && (
                  <motion.div
                    key={pricing.offer.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-green-50 border-2 border-green-500 rounded-lg p-4 text-center"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-green-600 fill-green-600" />
                      <span className="font-bold text-green-700 text-lg">{pricing.offer.highlight}</span>
                      <Star className="w-5 h-5 text-green-600 fill-green-600" />
                    </div>
                    <p className="text-green-700 font-semibold">
                      {pricing.offer.name} - Save £{pricing.savings}!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-dark mb-4 sm:mb-6">Select your package:</h3>

                {/* Offer Cards Grid - stacked on mobile, grid on larger screens */}
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-6 pt-2">
                  {/* Special Offer Cards */}
                  {specialOffers.map((offer) => {
                    const IconComponent = offer.Icon
                    const isSelected = hours === offer.hours

                    return (
                      <motion.button
                        key={offer.id}
                        onClick={() => setHoursAndRevealPriceBox(offer.hours)}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative p-5 sm:p-6 rounded-xl border-3 transition-all duration-300 text-left shadow-sm ${
                          isSelected
                            ? 'border-learner-red bg-learner-red text-white shadow-2xl ring-4 ring-learner-red ring-opacity-20'
                            : 'border-gray-200 bg-white hover:border-learner-red hover:shadow-lg'
                        }`}
                      >
                        {/* Highlight Badge */}
                        {offer.highlight && (
                          <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${
                            isSelected ? 'bg-white text-learner-red' : 'bg-learner-red text-white'
                          }`}>
                            {offer.highlight}
                          </div>
                        )}

                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all ${
                            isSelected ? 'bg-white/20' : 'bg-learner-red'
                          }`}>
                            <IconComponent
                              className={`w-7 h-7 sm:w-8 sm:h-8 transition-all ${
                                isSelected ? 'text-white' : 'text-white'
                              }`}
                              strokeWidth={2}
                            />
                          </div>
                        </div>

                        {/* Title */}
                        <div className={`text-center mb-3 font-bold ${
                          isSelected ? 'text-white' : 'text-dark'
                        }`}>
                          {offer.hours === 2 ? 'Intro Offer' : `${offer.hours} Hours`}
                        </div>

                        {/* Price */}
                        <div className="text-center">
                          <div className={`text-3xl sm:text-4xl font-display font-bold mb-1 ${
                            isSelected ? 'text-white' : 'text-learner-red'
                          }`}>
                            £{offer.price}
                          </div>
                          <div className={`text-sm ${
                            isSelected ? 'text-white/80' : 'text-medium-grey'
                          }`}>
                            {offer.hours} hours
                          </div>
                          <div className={`text-xs font-semibold mt-1 sm:mt-2 ${
                            isSelected ? 'text-white' : 'text-green-600'
                          }`}>
                            Save £{offer.savings}
                          </div>
                        </div>

                        {/* Selected Checkmark */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4"
                          >
                            <CheckCircle className="w-6 h-6 text-red fill-red" />
                          </motion.div>
                        )}
                      </motion.button>
                    )
                  })}

                  {/* Custom Hours Card */}
                  <motion.button
                    onClick={() => {
                      // Don't reset if already custom (no offer)
                      if (pricing.hasOffer) {
                        // Just clicking the card doesn't change hours, user needs to input
                        // But we can't automatically set to a non-offer value without user input
                        // So let's set to a value that will show as custom
                        setHoursAndRevealPriceBox(1)
                      }
                    }}
                    type="button"
                    whileHover={{ y: -4 }}
                    className={`relative p-5 sm:p-6 rounded-xl border-3 transition-all duration-300 w-full text-left shadow-sm ${
                      !pricing.hasOffer
                        ? 'border-learner-red bg-learner-red text-white shadow-2xl ring-4 ring-learner-red ring-opacity-20'
                        : 'border-gray-200 bg-white hover:border-learner-red hover:shadow-lg'
                    }`}
                  >
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all ${
                        !pricing.hasOffer ? 'bg-white/20' : 'bg-medium-grey'
                      }`}>
                        <TrendingUp
                          className={`w-7 h-7 sm:w-8 sm:h-8 ${
                            !pricing.hasOffer ? 'text-white' : 'text-white'
                          }`}
                          strokeWidth={2}
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <div className={`text-center mb-3 font-bold ${
                      !pricing.hasOffer ? 'text-white' : 'text-dark'
                    }`}>
                      Custom Hours
                    </div>

                    {/* Input */}
                    <div className="space-y-3">
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={hours}
                        onChange={(e) => setHoursAndRevealPriceBox(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                        className={`w-full px-4 py-3 text-center text-2xl font-display font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-learner-red ${
                          !pricing.hasOffer
                            ? 'bg-white/20 text-white placeholder-white/60'
                            : 'bg-gray-100 text-learner-red'
                        }`}
                      />
                      <div className={`text-center text-sm ${
                        !pricing.hasOffer ? 'text-white/80' : 'text-medium-grey'
                      }`}>
                        £35 per hour
                      </div>
                    </div>

                    {/* Selected Checkmark */}
                    {!pricing.hasOffer && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4"
                      >
                        <CheckCircle className="w-6 h-6 text-white fill-white" />
                      </motion.div>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Price Display - Desktop inline, Mobile sticky bottom */}

              {/* Desktop View - Inline */}
              <div className="hidden md:block bg-white p-6 rounded-lg border-2 border-gray-200">
                {pricing.hasOffer && (
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-medium-grey">Standard Price:</span>
                      <span className="text-medium-grey line-through">£{pricing.standardPrice}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="font-semibold text-green-600">Special Offer Savings:</span>
                      <span className="font-semibold text-green-600">-£{pricing.savings}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-dark">Total Cost:</span>
                  <div className="text-right">
                    <div className="text-5xl font-display font-bold text-learner-red">
                      £{pricing.price}
                    </div>
                    <div className="text-sm text-medium-grey">
                      {hours} hours @ £{(pricing.price / hours).toFixed(2)}/hour
                    </div>
                  </div>
                </div>

                {!pricing.hasOffer && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                    💡 <strong>Tip:</strong> Select 2, 10, or 20 hours for special offer pricing!
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <motion.button
                    onClick={() => onOpenBookingModal(hours)}
                    className="flex-1 bg-learner-red text-white text-center px-8 py-4 font-bold text-lg tracking-wide clip-angle min-h-[3.5rem]"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    BOOK {hours} {hours === 1 ? 'HOUR' : 'HOURS'}
                  </motion.button>
                  <motion.a
                    href="tel:07539283257"
                    className="flex-1 border-2 border-dark text-dark text-center px-8 py-4 font-bold text-lg tracking-wide hover:bg-dark hover:text-white transition-colors min-h-[3.5rem] flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    CALL TO DISCUSS
                  </motion.a>
                </div>
              </div>

              {/* Mobile View - Sticky Bottom with spacing for fixed element */}
              <div className="md:hidden h-24"></div>
            </div>
          </div>
        </motion.div>

        {/* Towing Training */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-3xl sm:text-4xl font-display font-bold text-dark text-center mb-8">
            TOWING TRAINING
          </h3>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {towingOptions.map((option, i) => {
              const IconComponent = option.Icon
              const isSelected = selectedTowing === option.id
              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleTowingSelect(option.id)}
                  className={`relative p-6 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-learner-red bg-learner-red text-white shadow-xl'
                      : 'border-gray-200 bg-white text-dark hover:border-learner-red'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-white/20' : 'bg-learner-red'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-white'}`} strokeWidth={2} />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-2xl font-display font-bold mb-1">{option.name}</h4>
                      <p className={`text-sm mb-3 ${isSelected ? 'text-white/90' : 'text-medium-grey'}`}>
                        {option.description}
                      </p>
                      <div className="text-3xl font-display font-bold mb-1">£{option.price}</div>
                      <div className={`text-sm ${isSelected ? 'text-white/80' : 'text-medium-grey'}`}>
                        {option.hours} hours (£{option.perHour}/hr)
                      </div>
                      {option.savings && (
                        <div className={`text-xs font-semibold mt-2 ${isSelected ? 'text-white' : 'text-green-600'}`}>
                          Save £{option.savings} vs standard rate
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>

          {selectedTowing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-4xl mx-auto mt-6"
            >
              <div className="bg-light-grey p-6 rounded-lg border-l-4 border-learner-red">
                <label className="flex items-center gap-3 cursor-pointer group mb-6">
                  <input
                    type="checkbox"
                    checked={useTrailer}
                    onChange={(e) => setUseTrailer(e.target.checked)}
                    className="w-6 h-6 accent-learner-red"
                  />
                  <div>
                    <span className="text-lg font-semibold text-dark group-hover:text-learner-red transition-colors">
                      Use our trailer (+£50)
                    </span>
                    <p className="text-sm text-medium-grey">Brian James flatbed trailer available for training</p>
                  </div>
                </label>

                <div className="bg-white p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-dark">Total Cost:</span>
                    <div className="text-right">
                      <div className="text-4xl font-display font-bold text-learner-red">
                        £{towingPrice}
                      </div>
                      <div className="text-sm text-medium-grey">
                        {useTrailer && '+ trailer use'}
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => setShowTowingModal(true)}
                    className="block w-full bg-learner-red text-white text-center px-8 py-4 font-bold text-lg tracking-wide clip-angle"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    BOOK TOWING TRAINING
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Intensive Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="bg-dark text-white p-8 rounded-lg text-center">
            <div className="flex justify-center mb-4">
              <Rocket className="w-12 h-12 text-learner-red" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-3">Intensive Courses Available</h3>
            <p className="text-lg mb-4">
              Need to pass your test quickly? We offer tailored intensive training courses to meet your timeline.
            </p>
            <button
              onClick={() => setShowContactModal(true)}
              className="inline-block bg-learner-red text-white px-8 py-3 font-bold tracking-wide hover:bg-white hover:text-learner-red transition-colors"
            >
              CONTACT FOR CUSTOM QUOTE
            </button>
          </div>
        </motion.div>

        {/* Price Guarantees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          {[
            { Icon: Shield, title: 'No Hidden Fees', desc: 'All prices are transparent and inclusive' },
            { Icon: Calendar, title: 'Flexible Scheduling', desc: 'Book lessons at times that suit you' },
            { Icon: GraduationCap, title: 'Quality Training', desc: 'Professional instruction every lesson' }
          ].map((item, i) => {
            const IconComponent = item.Icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-light-grey p-6 rounded-lg text-center border-t-4 border-learner-red"
              >
                <div className="flex justify-center mb-3">
                  <IconComponent className="w-10 h-10 text-learner-red" strokeWidth={1.5} />
                </div>
                <h4 className="font-display font-bold text-xl mb-2">{item.title}</h4>
                <p className="text-medium-grey">{item.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Towing Booking Modal */}
      <AnimatePresence>
        {showTowingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTowingModal(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
              style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 0% 100%)' }}
            >
              <div className="bg-learner-red p-8">
                <h2 className="text-4xl font-display font-bold text-white">
                  BOOK TOWING TRAINING
                </h2>
                <p className="text-white/90 mt-2">
                  Complete the form below to book your towing training
                </p>
                <button
                  onClick={() => setShowTowingModal(false)}
                  className="absolute top-4 right-6 w-12 h-12 bg-white text-learner-red flex items-center justify-center font-bold text-2xl hover:bg-dark hover:text-white transition-colors clip-angle"
                >
                  ×
                </button>
              </div>

              <div className="p-8">
                <TowingBookingForm
                  selectedTowing={selectedTowing}
                  useTrailer={useTrailer}
                  towingPrice={towingPrice}
                  onClose={() => setShowTowingModal(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowContactModal(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
              style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 0% 100%)' }}
            >
              <div className="bg-learner-red p-8">
                <h2 className="text-4xl font-display font-bold text-white">
                  GET IN TOUCH
                </h2>
                <p className="text-white/90 mt-2">
                  Request a custom quote for intensive courses or other inquiries
                </p>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="absolute top-4 right-6 w-12 h-12 bg-white text-learner-red flex items-center justify-center font-bold text-2xl hover:bg-dark hover:text-white transition-colors clip-angle"
                >
                  ×
                </button>
              </div>

              <div className="p-8">
                <ContactForm
                  isModal={true}
                  onClose={() => setShowContactModal(false)}
                  onSubmit={handleAddEnquiry}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Price Box */}
      <AnimatePresence>
        {hasInteracted && isPriceBoxOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white shadow-2xl border-t-4 border-learner-red"
          >
            {/* Close/Toggle Button */}
            <button
              onClick={() => setIsPriceBoxOpen(false)}
              className={`absolute -top-11 right-4 w-11 h-11 ${selectedTowing ? 'bg-dark' : 'bg-learner-red'} text-white rounded-t-lg flex items-center justify-center font-bold text-xl shadow-lg hover:bg-dark transition-colors`}
              aria-label="Close price summary"
            >
              ×
            </button>

            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {selectedTowing ? (
                <div className="max-w-4xl mx-auto mt-0">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-sm text-medium-grey font-semibold">Towing Package</div>
                        <div className="text-base font-bold text-dark">
                          {selectedTowingOption?.name} - {selectedTowingOption?.hours} Hours
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-display font-bold text-learner-red">
                          £{towingPrice}
                        </div>
                        <div className="text-xs text-medium-grey">
                          £{selectedTowingOption ? (towingPrice / selectedTowingOption.hours).toFixed(2) : '0.00'}/hour{useTrailer ? ' incl. trailer' : ''}
                        </div>
                      </div>
                    </div>

                    {selectedTowingOption?.savings && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded text-xs">
                        <Star className="w-4 h-4 text-green-600 fill-green-600 flex-shrink-0" />
                        <span className="font-semibold text-green-700">
                          Save £{selectedTowingOption.savings} vs standard rate
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-light-grey p-6 rounded-lg border border-gray-200">
                    <label className="flex items-center gap-3 cursor-pointer group mb-4">
                      <input
                        type="checkbox"
                        checked={useTrailer}
                        onChange={(e) => setUseTrailer(e.target.checked)}
                        className="w-6 h-6 accent-learner-red"
                      />
                      <div>
                        <span className="text-lg font-semibold text-dark group-hover:text-learner-red transition-colors">
                          Use our trailer (+£50)
                        </span>
                        <p className="text-sm text-medium-grey">Brian James flatbed trailer available for training</p>
                      </div>
                    </label>

                    <div className="flex flex-col gap-3">
                      <motion.button
                        onClick={() => setShowTowingModal(true)}
                        className="w-full bg-learner-red text-white text-center px-6 py-4 font-bold text-base tracking-wide clip-angle min-h-[3.5rem]"
                        whileTap={{ scale: 0.97 }}
                      >
                        BOOK TOWING TRAINING
                      </motion.button>
                      <motion.a
                        href="tel:07539283257"
                        className="w-full border-2 border-dark text-dark text-center px-6 py-3 font-bold text-sm tracking-wide hover:bg-dark hover:text-white transition-colors min-h-[3rem] flex items-center justify-center"
                        whileTap={{ scale: 0.97 }}
                      >
                        CALL TO DISCUSS
                      </motion.a>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Compact Price Summary */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-sm text-medium-grey font-semibold">Selected Package</div>
                        <div className="text-base font-bold text-dark">
                          {hours} {hours === 1 ? 'Hour' : 'Hours'}
                          {pricing.hasOffer && ` - ${pricing.offer.name}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-display font-bold text-learner-red">
                          £{pricing.price}
                        </div>
                        <div className="text-xs text-medium-grey">
                          £{(pricing.price / hours).toFixed(2)}/hour
                        </div>
                      </div>
                    </div>

                    {pricing.hasOffer && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded text-xs">
                        <Star className="w-4 h-4 text-green-600 fill-green-600 flex-shrink-0" />
                        <span className="font-semibold text-green-700">
                          Save £{pricing.savings} with this offer!
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <motion.button
                      onClick={() => onOpenBookingModal(hours)}
                      className="w-full bg-learner-red text-white text-center px-6 py-4 font-bold text-base tracking-wide clip-angle min-h-[3.5rem]"
                      whileTap={{ scale: 0.97 }}
                    >
                      BOOK {hours} {hours === 1 ? 'HOUR' : 'HOURS'}
                    </motion.button>
                    <motion.a
                      href="tel:07539283257"
                      className="w-full border-2 border-dark text-dark text-center px-6 py-3 font-bold text-sm tracking-wide hover:bg-dark hover:text-white transition-colors min-h-[3rem] flex items-center justify-center"
                      whileTap={{ scale: 0.97 }}
                    >
                      CALL TO DISCUSS
                    </motion.a>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reopen button when closed */}
      <AnimatePresence>
        {hasInteracted && !isPriceBoxOpen && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setIsPriceBoxOpen(true)}
            className={`md:hidden fixed bottom-4 right-4 z-40 ${selectedTowing ? 'bg-dark' : 'bg-learner-red'} text-white px-6 py-4 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 min-h-[3.5rem]`}
          >
            <PoundSterling className="w-5 h-5" />
            {selectedTowing ? `£${towingPrice}` : `£${pricing.price}`}
          </motion.button>
        )}
      </AnimatePresence>
    </AnimatedSection>
  )
}

// Towing Booking Form Component
const TowingBookingForm = ({ selectedTowing, useTrailer, towingPrice, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    postcode: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Towing booking submitted:', { ...formData, selectedTowing, useTrailer, towingPrice })
    if (onClose) {
      onClose()
    }
  }

  const inputClass = "w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-learner-red focus:outline-none transition-colors font-medium"
  const labelClass = "block text-sm font-bold text-dark mb-2 tracking-wide"

  // Find the selected towing option name
  const towingOptions = [
    { id: 'half', name: 'Half Day (4 Hours)' },
    { id: 'full', name: 'Full Day (8 Hours)' }
  ]
  const selectedOption = towingOptions.find(opt => opt.id === selectedTowing)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Booking Summary */}
      <div className="bg-light-grey p-4 rounded-lg mb-6">
        <h3 className="font-bold text-dark mb-2">Booking Summary</h3>
        <div className="text-sm space-y-1">
          <p><strong>Training:</strong> {selectedOption?.name}</p>
          <p><strong>Use Trailer:</strong> {useTrailer ? 'Yes (+£50)' : 'No'}</p>
          <p className="text-lg font-bold text-learner-red mt-2">Total: £{towingPrice}</p>
        </div>
      </div>

      <div>
        <label className={labelClass}>NAME *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className={inputClass}
          placeholder="Your full name"
        />
      </div>

      <div>
        <label className={labelClass}>EMAIL *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className={inputClass}
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className={labelClass}>PHONE *</label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className={inputClass}
          placeholder="07XXX XXXXXX"
        />
      </div>

      <div>
        <label className={labelClass}>POSTCODE *</label>
        <input
          type="text"
          required
          value={formData.postcode}
          onChange={(e) => setFormData({...formData, postcode: e.target.value})}
          className={inputClass}
          placeholder="WR1 2XX"
        />
      </div>

      <div>
        <label className={labelClass}>MESSAGE (OPTIONAL)</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className={`${inputClass} resize-none`}
          rows="4"
          placeholder="Any additional information or questions..."
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-learner-red text-white px-8 py-4 font-bold text-lg tracking-wide clip-angle hover:bg-dark transition-colors"
        >
          CONFIRM TOWING BOOKING
        </button>
      </div>
    </form>
  )
}

// WhatsApp Button Component
const WhatsAppButton = () => {
  const phoneNumber = '447539283257' // Rowan's phone number in international format
  const message = 'Hi! I would like to enquire about driving lessons with Drive RJM.'

  return (
    <motion.a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden md:flex fixed bottom-6 right-6 z-50 w-16 h-16 bg-green-500 rounded-full items-center justify-center shadow-2xl hover:bg-green-600 transition-colors group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
    >
      <svg
        className="w-8 h-8 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-learner-red rounded-full animate-ping" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-learner-red rounded-full" />
    </motion.a>
  )
}

// Booking Form Component
const BookingForm = ({ initialHours, onClose }) => {
  // Check if initialHours matches a special offer (2, 10, or 20)
  const isSpecialOffer = [2, 10, 20].includes(initialHours)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    postcode: '',
    bookingHours: isSpecialOffer ? initialHours.toString() : 'custom',
    customHours: isSpecialOffer ? '' : initialHours.toString(),
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Booking submitted:', formData)
    if (onClose) {
      onClose()
    }
  }

  const inputClass = "w-full px-4 py-3 bg-white border-2 border-gray-200 focus:border-learner-red focus:outline-none transition-colors font-medium"
  const labelClass = "block text-sm font-bold text-dark mb-2 tracking-wide"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>NAME *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className={inputClass}
          placeholder="Your full name"
        />
      </div>

      <div>
        <label className={labelClass}>EMAIL *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className={inputClass}
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className={labelClass}>PHONE *</label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className={inputClass}
          placeholder="07XXX XXXXXX"
        />
      </div>

      <div>
        <label className={labelClass}>POSTCODE *</label>
        <input
          type="text"
          required
          value={formData.postcode}
          onChange={(e) => setFormData({...formData, postcode: e.target.value})}
          className={inputClass}
          placeholder="WR1 2XX"
        />
      </div>

      <div>
        <label className={labelClass}>BOOKING HOURS *</label>
        <select
          required
          value={formData.bookingHours}
          onChange={(e) => setFormData({...formData, bookingHours: e.target.value})}
          className={inputClass}
        >
          <option value="2">Intro Offer (2 Hours) - £60</option>
          <option value="10">10 Hours - £340</option>
          <option value="20">20 Hours - £670</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {formData.bookingHours === 'custom' && (
        <div>
          <label className={labelClass}>CUSTOM HOURS *</label>
          <input
            type="number"
            min="1"
            max="50"
            required
            value={formData.customHours}
            onChange={(e) => setFormData({...formData, customHours: e.target.value})}
            className={inputClass}
            placeholder="Enter number of hours"
          />
        </div>
      )}

      <div>
        <label className={labelClass}>MESSAGE (OPTIONAL)</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className={`${inputClass} resize-none`}
          rows="4"
          placeholder="Any additional information or questions..."
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full bg-learner-red text-white px-8 py-4 font-bold text-lg tracking-wide clip-angle hover:bg-dark transition-colors"
        >
          CONFIRM BOOKING
        </button>
      </div>
    </form>
  )
}

// Car Section
const Car = () => {
  const features = [
    { title: 'EASY TO DRIVE', desc: 'Excellent all-around visibility and manageable size' },
    { title: 'MODERN COMFORT', desc: 'Air conditioning for year-round comfort' },
    { title: 'PARKING SENSORS', desc: 'Front and rear sensors aid manoeuvring' },
    { title: 'ELECTRIC HANDBRAKE', desc: 'Makes hill starts easier to master' },
    { title: 'SAFETY FIRST', desc: 'Dual controls, airbags, and dashcam fitted' },
    { title: 'SIMPLICITY', desc: 'No distracting aids - focus on driving skills' }
  ]

  return (
    <AnimatedSection id="car" className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader isDark subtitle="SEAT Leon 1.5 Petrol Manual - Chosen for comfort, safety, and simplicity">
          YOUR LEARNING VEHICLE
        </AnimatedSectionHeader>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[16/10] rounded-lg shadow-2xl overflow-hidden relative">
              <video
                src="/seat-leon-driving-lesson-car.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                aria-label="SEAT Leon 1.5 Petrol Manual - the official Drive RJM tuition vehicle"
              />
              <div className="absolute top-0 right-0 w-2 h-full bg-learner-red" />
            </div>
          </motion.div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                className="bg-white/10 p-6 border-l-4 border-learner-red backdrop-blur-sm"
              >
                <h4 className="text-xl font-display font-bold text-learner-red mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}

// Manual Section
const Manual = () => {
  const scenarios = [
    {
      Icon: Wrench,
      title: 'Garage Courtesy Cars',
      description: 'Your car goes into a garage for work - they only have manual courtesy cars'
    },
    {
      Icon: CarIcon,
      title: 'Emergency Borrowing',
      description: 'You need to borrow a family or friend\'s car in an emergency - but it\'s a manual'
    },
    {
      Icon: Truck,
      title: 'Van Hire',
      description: 'You want to hire a van to move house - most vans are manual'
    }
  ]

  const statsData = [
    {
      label: 'All Cars on Autotrader',
      total: '478,000',
      automatic: { count: '278,000', percent: 58 },
      manual: { count: '200,000', percent: 42 }
    },
    {
      label: 'Under £5,000 Budget',
      total: '72,000',
      automatic: { count: '14,000', percent: 19 },
      manual: { count: '58,000', percent: 81 }
    },
    {
      label: 'Under £5k + Max 1.4L Engine',
      total: '32,000',
      automatic: { count: '3,000', percent: 9 },
      manual: { count: '29,000', percent: 91 }
    }
  ]

  return (
    <AnimatedSection id="manual" className="bg-learner-red text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 80px)'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <AnimatedSectionHeader isDark underlineColor="bg-white">
            WHY MANUAL NOT AUTOMATIC?
          </AnimatedSectionHeader>
        </div>

        {/* Short Answer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="bg-white/15 backdrop-blur-md border-2 border-white/30 p-8 rounded-lg max-w-4xl mx-auto">
            <h3 className="text-3xl font-display font-bold mb-4">THE SHORT ANSWER</h3>
            <p className="text-xl leading-relaxed">
              <strong>Flexibility for your future.</strong> With a manual licence, you can drive both manual and automatic cars.
            </p>
          </div>
        </motion.div>

        {/* Longer Answer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-16 max-w-5xl mx-auto"
        >
          <h3 className="text-4xl font-display font-bold mb-6 text-center">THE LONGER ANSWER</h3>
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg space-y-6 text-lg leading-relaxed">
            <p>
              While it might be slightly quicker and easier to learn to drive an automatic car, <strong>this is a skill to last you for the rest of your life.</strong> Do you want to take the short term gain and risk the long term pain, ending up regretting it?
            </p>
            <p>
              Rowan is a big believer that anyone who has struggled to drive a manual car has simply not had good instruction. Consider these scenarios:
            </p>
          </div>
        </motion.div>

        {/* Real-World Scenarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-3 gap-6">
            {scenarios.map((scenario, i) => {
              const IconComponent = scenario.Icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/15 backdrop-blur-md p-6 rounded-lg border border-white/20 text-center"
                >
                  <div className="flex justify-center mb-4">
                    <IconComponent className="w-12 h-12 text-white" strokeWidth={1.5} />
                  </div>
                  <h4 className="text-xl font-display font-bold mb-3">{scenario.title}</h4>
                  <p className="text-white/90">{scenario.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Clarification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mb-16 max-w-5xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg text-center">
            <p className="text-lg leading-relaxed">
              The above is <strong>absolutely nothing against automatic transmissions</strong> - the majority of the (many) cars Rowan has had over the years have been automatic. This is purely about the <strong>flexibility and options it gives you for the rest of your life.</strong>
            </p>
          </div>
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h3 className="text-4xl font-display font-bold mb-6 text-center">ONE FINAL POINT IF YOU'RE STILL NOT CONVINCED...</h3>

          <div className="space-y-8">
            {statsData.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="bg-white/15 backdrop-blur-md p-6 rounded-lg border border-white/20"
              >
                <div className="mb-4">
                  <h4 className="text-2xl font-display font-bold mb-2">{stat.label}</h4>
                  <p className="text-3xl font-bold text-white/90">
                    {stat.total} <span className="text-lg font-normal">cars to choose from</span>
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Automatic */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Automatic:</span>
                      <span className="text-xl font-bold">{stat.automatic.count}</span>
                    </div>
                    <div className="relative h-8 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${stat.automatic.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 + i * 0.1, duration: 1 }}
                        className="absolute top-0 left-0 h-full bg-white/60 flex items-center justify-center font-bold text-sm text-dark"
                      >
                        {stat.automatic.percent}%
                      </motion.div>
                    </div>
                  </div>

                  {/* Manual */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Manual:</span>
                      <span className="text-xl font-bold">{stat.manual.count}</span>
                    </div>
                    <div className="relative h-8 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${stat.manual.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 + i * 0.1, duration: 1 }}
                        className="absolute top-0 left-0 h-full bg-white flex items-center justify-center font-bold text-sm text-learner-red"
                      >
                        {stat.manual.percent}%
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Impact Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
          className="max-w-5xl mx-auto mb-12"
        >
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg space-y-6 text-lg leading-relaxed">
            <p>
              Yes, 3,000 may sound like a lot to choose from, but that's <strong>nationally</strong>. Reduce that to less than 30 or 40 miles from where you live, factor in your desired make, fuel type, maximum mileage, colour, features etc., and <strong>you're down to a handful to choose from.</strong>
            </p>
            <p>
              By limiting yourself to an automatic car, you're <strong>significantly limiting your options when buying a car.</strong> From Rowan's years of experience selling cars, by far the most sought after cars are small automatics and they typically sell for a <strong>high price premium</strong> over a comparable manual car.
            </p>
            <p>
              They're typically <strong>less reliable, use more fuel, and cost more to tax</strong> each year. This is set to change with more and more new cars being sold as automatic, and so over the next 5 to 10 years the proportion of automatic vehicles available will increase.
            </p>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="text-center text-sm text-white/70"
        >
          <p>(Figures last updated: May 2025)</p>
        </motion.div>
      </div>
    </AnimatedSection>
  )
}

// FAQ Section
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'How many lessons will I need?',
      answer: 'Typically 25-50 hours of professional instruction. Some need more, some less. We can give you our opinion after an initial 2-hour lesson. Practice between lessons with a friend or family member can help reduce this.'
    },
    {
      question: 'What\'s the quickest way to pass my test?',
      answer: 'Apply for your provisional licence before your 17th birthday. Study for and book your theory test for on or shortly after your birthday. Start driving lessons immediately. Once you pass theory, book your practical test. With current wait times, getting to this point quickly is essential.'
    },
    {
      question: 'How often should I take lessons?',
      answer: 'We recommend a minimum of two hours per week. Less than this and you risk making little real progress. As you approach your test, increase frequency to ensure you\'re at test standard. There\'s no upper limit beyond scheduling constraints!'
    },
    {
      question: 'Should I practice between lessons?',
      answer: 'Yes and no. Complete at least 10 hours with an instructor before practicing with friends or family. After that, gain as much experience as you can. Bad habits learned early are hard to break. As you approach your test, increase lesson frequency.'
    },
    {
      question: 'What are your pass rates?',
      answer: 'The UK average is 45-50%, while Worcester sits around 50-55%. Approximately 50% of people pass on their first attempt. Our focus is getting you test-ready with the skills you need for life, not rushing you through.'
    },
    {
      question: 'Can I start before I\'ve done my theory test?',
      answer: 'Absolutely! Having lessons actually helps with your theory. Learning both in parallel is recommended. However, you can\'t book your practical test until you\'ve passed theory, so get it done as soon as possible.'
    },
    {
      question: 'I\'m struggling - I don\'t think I can pass',
      answer: 'It sounds like you need a different instructor. Perhaps your current instructor isn\'t adapting their coaching style to meet your needs. Give us a try - we promise you\'ll feel like you\'ve made progress in your first lesson!'
    },
    {
      question: 'What times are you available?',
      answer: 'We offer maximum flexibility with early morning, daytime, evening, and weekend lessons available to suit your schedule.'
    }
  ]

  return (
    <AnimatedSection id="faq" className="bg-light-grey">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSectionHeader subtitle="Everything you need to know before you start">
          COMMON QUESTIONS
        </AnimatedSectionHeader>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white shadow-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-6 flex justify-between items-center text-left border-l-4 border-transparent hover:border-learner-red transition-colors group"
              >
                <span className="text-xl font-display font-semibold text-dark group-hover:text-learner-red transition-colors">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 45 : 0 }}
                  className="text-3xl text-learner-red font-bold"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-medium-grey leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}

// Contact Section
const Contact = ({ onBookLessonClick }) => {
  const contacts = [
    {
      Icon: Phone,
      title: 'CALL',
      value: '07539 283257',
      href: 'tel:07539283257'
    },
    {
      Icon: Mail,
      title: 'EMAIL',
      value: 'rowan@driverjm.co.uk',
      href: 'mailto:rowan@driverjm.co.uk'
    },
    {
      Icon: MapPin,
      title: 'LOCATION',
      value: 'Orchard House, Orchard Farm\nWorcester Road, Great Witley\nWR6 6HU',
      href: null
    }
  ]

  return (
    <AnimatedSection id="contact" className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSectionHeader isDark subtitle="Ready to start your driving journey?">
          GET IN TOUCH
        </AnimatedSectionHeader>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {contacts.map((contact, i) => {
            const IconComponent = contact.Icon
            return (
              <motion.div
                key={contact.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-sm p-8 border-t-4 border-learner-red"
              >
                <div className="flex justify-center mb-4">
                  <IconComponent className="w-12 h-12 text-learner-red" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">{contact.title}</h3>
                {contact.href ? (
                  <a
                    href={contact.href}
                    className="text-lg text-white hover:text-learner-red transition-colors whitespace-pre-line"
                  >
                    {contact.value}
                  </a>
                ) : (
                  <p className="text-lg text-white whitespace-pre-line">{contact.value}</p>
                )}
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={onBookLessonClick}
            className="inline-block bg-learner-red text-white px-12 py-5 font-bold text-xl tracking-wide clip-angle"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            BOOK YOUR FIRST LESSON
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-gray-500 text-sm"
        >
          Looking for a car? Rowan also sells quality used vehicles.
          Visit{' '}
          <a
            href="https://www.orchardhousecars.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-learner-red hover:underline"
          >
            orchardhousecars.co.uk
          </a>
        </motion.p>
      </div>
    </AnimatedSection>
  )
}

// Footer
const Footer = () => {
  return (
    <footer className="bg-dark/95 text-gray-400 py-12 border-t-2 border-learner-red">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="mb-4">&copy; 2025 Drive RJM Ltd. All rights reserved.</p>
        <p className="text-sm">
          Registered Address: Orchard House, Orchard Farm, Worcester Road, Great Witley, WR6 6HU
        </p>
        <div className="mt-4">
          <a
            href="/admin"
            className="text-sm font-semibold text-learner-red hover:text-white transition-colors underline"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  )
}


  const LessonModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-display font-bold text-dark">Create Lesson</h3>
          <button onClick={closeLessonModal} className="text-learner-red text-xl font-bold">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-dark mb-1">Student</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-learner-red focus:outline-none"
              value={lessonForm.student}
              onChange={(e) => setLessonForm({ ...lessonForm, student: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-dark mb-1">Date</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-learner-red focus:outline-none"
                value={lessonForm.date}
                onChange={(e) => setLessonForm({ ...lessonForm, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-1">Duration (mins)</label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-learner-red focus:outline-none"
                value={lessonForm.duration}
                onChange={(e) => setLessonForm({ ...lessonForm, duration: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-dark mb-1">Start postcode</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-learner-red focus:outline-none"
                value={lessonForm.startPostcode}
                onChange={(e) => setLessonForm({ ...lessonForm, startPostcode: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-1">End postcode</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-learner-red focus:outline-none"
                value={lessonForm.endPostcode}
                onChange={(e) => setLessonForm({ ...lessonForm, endPostcode: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-dark mb-1">Miles</label>
              <input
                type="number"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-learner-red focus:outline-none"
                value={lessonForm.miles}
                onChange={(e) => setLessonForm({ ...lessonForm, miles: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-1">Slot</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-learner-red focus:outline-none"
                placeholder="HH:MM-HH:MM"
                value={lessonForm.slot}
                onChange={(e) => setLessonForm({ ...lessonForm, slot: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-medium-grey">
              Recommended slot: {computeRecommendedSlot()} • Fuel est: {fuelEstimate().litresUsed}L
            </p>
            <button
              onClick={handleLessonModalSubmit}
              className="bg-learner-red text-white px-5 py-2 rounded-lg font-semibold tracking-wide shadow"
            >
              Save lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const EnquiryModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-display font-bold text-dark">New Enquiry</h3>
          <button onClick={closeEnquiryModal} className="text-learner-red text-xl font-bold">×</button>
        </div>
        <form onSubmit={handleEnquiryModalSubmit} className="p-6 space-y-4">
          {['name', 'email', 'phone', 'postcode', 'service'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-dark mb-1 capitalize">{field}</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-learner-red focus:outline-none"
                value={enquiryModalData[field]}
                onChange={(e) => setEnquiryModalData({ ...enquiryModalData, [field]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-dark mb-1">Message (optional)</label>
            <textarea
              rows="3"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:border-learner-red focus:outline-none"
              value={enquiryModalData.message}
              onChange={(e) => setEnquiryModalData({ ...enquiryModalData, message: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeEnquiryModal}
              className="border border-gray-300 px-4 py-2 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-learner-red text-white px-4 py-2 rounded-lg font-semibold"
            >
              Add enquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  )


  return (
    <div className="min-h-screen bg-light-grey flex">
      <aside className="w-72 bg-white border-r-2 border-learner-red shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-light-grey/50" />
        <div className="relative p-6 flex items-center gap-3">
          <div className="h-12 w-12 bg-learner-red text-white font-display font-bold flex items-center justify-center clip-angle shadow-lg">
            RJM
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-medium-grey">Drive RJM</div>
            <div className="text-xl font-display font-bold text-dark">Admin</div>
          </div>
        </div>

        <nav className="relative px-4 space-y-2 mt-4">
          {navItems.map(({ label, Icon }) => {
            const isActive = active === label
            return (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-semibold transition-all ${
                  isActive
                    ? 'bg-learner-red text-white shadow-lg'
                    : 'text-dark hover:bg-light-grey'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            )
          })}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-semibold text-dark hover:bg-light-grey mt-6"
          >
            Logout
          </button>
        </nav>
      </aside>

      <div className="flex-1 p-6 md:p-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-dark">Admin Dashboard</h1>
            <p className="text-medium-grey mt-1">Manage enquiries, lessons, customers, and test outcomes.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={openEnquiryModal}
              className="bg-learner-red text-white px-5 py-3 font-bold tracking-wide clip-angle shadow-lg hover:bg-dark transition-colors"
            >
              New Enquiry
            </button>
            <button
              onClick={openLessonModal}
              className="border-2 border-dark text-dark px-5 py-3 font-bold tracking-wide hover:bg-dark hover:text-white transition-colors"
            >
              Create Lesson
            </button>
          </div>
        </div>
        {renderContent()}
      </div>
      {isLessonModalOpen && <LessonModal />}
      {isEnquiryModalOpen && <EnquiryModal />}
    </div>
  )
}

// Main App Component
function App() {
  const [showContactModal, setShowContactModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingHours, setBookingHours] = useState(2)
  const [postcodeCheckResult, setPostcodeCheckResult] = useState(null)
  const [recentlyPassed, setRecentlyPassed] = useState(defaultPassed)
  const [enquiries, setEnquiries] = useState([])

  const { isAdminAuthed, loading } = useAuth()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recentlyPassed')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            setRecentlyPassed(parsed)
          }
        } catch (e) {
          // ignore parse errors
        }
      }
      const storedEnquiries = localStorage.getItem('enquiries')
      if (storedEnquiries) {
        try {
          const parsedEnquiries = JSON.parse(storedEnquiries)
          if (Array.isArray(parsedEnquiries)) {
            setEnquiries(parsedEnquiries)
          }
        } catch (e) {
          // ignore parse errors
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentlyPassed', JSON.stringify(recentlyPassed))
    }
  }, [recentlyPassed])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('enquiries', JSON.stringify(enquiries))
    }
  }, [enquiries])

  const handleAddPassed = (entry, editIndex = null, isDelete = false) => {
    setRecentlyPassed((prev) => {
      if (isDelete && editIndex !== null) {
        return prev.filter((_, idx) => idx !== editIndex)
      }
      if (entry && editIndex !== null) {
        return prev.map((item, idx) => (idx === editIndex ? entry : item))
      }
      if (entry) {
        return [entry, ...prev]
      }
      return prev
    })
  }

  const handleAddEnquiry = (entry) => {
    setEnquiries((prev) => [entry, ...prev])
  }

  const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')

  if (isAdmin) {
    if (loading) {
      return <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }

    if (!isAdminAuthed) {
      return <AdminLogin />
    }

    return <AdminPage />
  }

  return (
    <div className="relative overflow-x-hidden">
      <SEO />
      <Navigation onBookNowClick={() => setShowContactModal(true)} />
      <main>
        <Hero
          onBookNowClick={() => setShowContactModal(true)}
          onPostcodeCheck={setPostcodeCheckResult}
          onContactClick={() => setShowContactModal(true)}
        />
        <QuickContact postcodeCheckResult={postcodeCheckResult} onSubmit={handleAddEnquiry} />
        <About />
        <Services />
        <RecentlyPassed entries={recentlyPassed} />
        <Pricing onOpenBookingModal={(hours) => {
          setBookingHours(hours)
          setShowBookingModal(true)
        }} />
        <Car />
        <Manual />
        <FAQ />
        <Contact onBookLessonClick={() => {
          setBookingHours(2)
          setShowBookingModal(true)
        }} />
      </main>
      <Footer />
      <WhatsAppButton />

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowContactModal(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
              style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 0% 100%)' }}
            >
              <div className="bg-learner-red p-8">
                <h2 className="text-4xl font-display font-bold text-white">
                  GET IN TOUCH
                </h2>
                <p className="text-white/90 mt-2">
                  Fill in the form below and we'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="absolute top-4 right-6 w-12 h-12 bg-white text-learner-red flex items-center justify-center font-bold text-2xl hover:bg-dark hover:text-white transition-colors clip-angle"
                >
                  ×
                </button>
              </div>

              <div className="p-8">
                <ContactForm
                  onClose={() => setShowContactModal(false)}
                  isModal={true}
                  onSubmit={handleAddEnquiry}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBookingModal(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
              style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 0% 100%)' }}
            >
              <div className="bg-learner-red p-8">
                <h2 className="text-4xl font-display font-bold text-white">
                  BOOK YOUR LESSONS
                </h2>
                <p className="text-white/90 mt-2">
                  Complete the form below to book your driving lessons
                </p>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="absolute top-4 right-6 w-12 h-12 bg-white text-learner-red flex items-center justify-center font-bold text-2xl hover:bg-dark hover:text-white transition-colors clip-angle"
                >
                  ×
                </button>
              </div>

              <div className="p-8">
                <BookingForm initialHours={bookingHours} onClose={() => setShowBookingModal(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
