import { Button } from "@/components/ui/button";
import {
  Leaf,
  Link2,
  Globe,
  BarChart3,
  Droplet,
  Users,
  Trophy,
  ArrowRight,
  Check,
  MapPin,
  Facebook,
  Linkedin,
  Send,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { useFontFamily } from '@/hooks/useFontFamily';

export default function Index() {
  const { t } = useTranslation();
  const { getFontFamily } = useFontFamily();
  const navigate = useNavigate();
  
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 min-h-[64px]">
            <div className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-agro-green" />
              <span className={`text-xl ${getFontFamily('heading')} font-bold text-agro-green`}>
                AgroConnect
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => handleScroll("about")}
                className="text-muted-foreground hover:text-agro-green transition-colors"
              >
                {t('nav.about')}
              </button>
              <button
                onClick={() => handleScroll("features")}
                className="text-muted-foreground hover:text-agro-green transition-colors"
              >
                {t('nav.features')}
              </button>
              <button
                onClick={() => handleScroll("pricing")}
                className="text-muted-foreground hover:text-agro-green transition-colors"
              >
                {t('nav.pricing')}
              </button>
              <button
                onClick={() => navigate('/documentation')}
                className="text-muted-foreground hover:text-agro-green transition-colors"
              >
                {t('nav.documentation')}
              </button>
              <button
                onClick={() => handleScroll("contact")}
                className="text-muted-foreground hover:text-agro-green transition-colors"
              >
                {t('nav.contact')}
              </button>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="flex items-center gap-1">
                <LanguageSwitcher />
                <ThemeSwitcher />
              </div>
              <Button
                onClick={() => navigate('/auth')}
                className="hidden sm:inline-flex bg-agro-green hover:bg-agro-dark text-white ml-2 flex-shrink-0"
              >
                {t('nav.joinNow')}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero-cta"
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-agro-green-light via-background to-background"
          style={{
            backgroundImage: `
              linear-gradient(135deg, #E8F5E9 0%, rgba(232, 245, 233, 0.5) 50%, hsl(var(--background)) 100%),
              radial-gradient(circle at 20% 50%, rgba(46, 125, 50, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 179, 0, 0.03) 0%, transparent 50%)
            `,
          }}
        >
          <div className="absolute inset-0">
            {/* Decorative network lines */}
            <svg
              className="absolute inset-0 w-full h-full opacity-5"
              viewBox="0 0 100 100"
            >
              <defs>
                <pattern
                  id="network"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="10" cy="10" r="1" fill="#2E7D32" />
                  <line x1="10" y1="10" x2="20" y2="10" stroke="#2E7D32" />
                  <line x1="10" y1="10" x2="10" y2="20" stroke="#2E7D32" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#network)" />
            </svg>
          </div>
        </div>

        <motion.div 
          className="relative max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className={`text-4xl sm:text-5xl lg:text-6xl ${getFontFamily('heading')} font-bold text-foreground mb-4 leading-tight`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p 
            className={`text-lg sm:text-xl text-muted-foreground mb-4 ${getFontFamily('body')}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {t('hero.subtitle')}
          </motion.p>
          <motion.p 
            className={`text-sm sm:text-base text-agro-green ${getFontFamily('heading')} font-semibold mb-8`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            {t('hero.tagline')}
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-agro-green hover:bg-agro-dark text-white text-base px-8 py-6 rounded-lg h-auto"
              >
                {t('auth.loginRegister')}
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                onClick={() => navigate('/features')}
                className="border-2 border-agro-green text-agro-green hover:bg-agro-green-light text-base px-8 py-6 rounded-lg h-auto"
              >
                {t('hero.exploreButton')}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* About / Mission Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="bg-gradient-to-br from-agro-green-light to-agro-green/10 rounded-2xl overflow-hidden h-96 relative">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')`
                  }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-agro-green/40 via-agro-green/30 to-agro-dark/50"></div>
                </div>
                
                {/* Content */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    {/* Central Icon */}
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                      <Leaf className="w-10 h-10" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3">{t('about.mission.title')}</h3>
                    <p className="text-sm opacity-90 mb-4">{t('about.mission.subtitle')}</p>
                    
                    {/* Decorative Icons */}
                    <div className="flex justify-center space-x-4 mb-4">
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Link2 className="w-4 h-4" />
                      </div>
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-6 right-6 w-3 h-3 bg-agro-orange rounded-full"></div>
                    <div className="absolute bottom-6 left-6 w-2 h-2 bg-agro-orange/70 rounded-full"></div>
                    <div className="absolute top-1/3 right-8 w-1 h-1 bg-white/60 rounded-full"></div>
                    <div className="absolute bottom-1/3 left-8 w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <h2 className={`text-3xl sm:text-4xl ${getFontFamily('heading')} font-bold text-foreground mb-6`}>
                {t('about.mission.title')}
              </h2>
              <p className={`text-muted-foreground ${getFontFamily('body')} text-lg mb-4`}>
                {t('about.mission.description1')}
              </p>
              <p className={`text-muted-foreground ${getFontFamily('body')} text-lg`}>
                {t('about.mission.description2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="animate-slide-up"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h2 className={`text-3xl sm:text-4xl ${getFontFamily('heading')} font-bold text-foreground mb-6`}>
                {t('aboutUs.title')}
              </h2>
              <p className={`text-muted-foreground ${getFontFamily('body')} text-lg mb-6`}>
                {t('aboutUs.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate('/about')}
                  className="bg-agro-green hover:bg-agro-dark text-white px-8 py-3"
                >
                  {t('aboutUs.learnMore')}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/about')}
                  className="border-2 border-agro-green text-agro-green hover:bg-agro-green-light px-8 py-3"
                >
                  {t('aboutUs.meetTeam')}
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="animate-slide-up" 
              style={{ animationDelay: "0.2s" }}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-agro-green-light to-agro-green/10 rounded-2xl overflow-hidden h-96 relative">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')`
                  }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-agro-green/40 via-agro-green/30 to-agro-dark/50"></div>
                </div>
                
                {/* Content */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    {/* Team Icons Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[1,2,3,4,5,6,7,8,9].map((i) => (
                        <div key={i} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Users className="w-4 h-4" />
                        </div>
                      ))}
                    </div>
                    
                    {/* Main Icon */}
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                      <Users className="w-8 h-8" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{t('aboutUs.teamCount')}</h3>
                    <p className="text-sm opacity-90">{t('aboutUs.teamDescription')}</p>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-agro-orange rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-3 h-3 bg-agro-orange/50 rounded-full"></div>
                    <div className="absolute top-1/2 left-4 w-1 h-1 bg-white/50 rounded-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-agro-green-light">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className={`text-3xl sm:text-4xl ${getFontFamily('heading')} font-bold text-foreground text-center mb-12`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {t('features.title')}
          </motion.h2>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {[
              {
                icon: Zap,
                title: t('features.app.title'),
                description: t('features.app.description'),
              },
              {
                icon: Link2,
                title: t('features.blockchain.title'),
                description: t('features.blockchain.description'),
              },
              {
                icon: Globe,
                title: t('features.esg.title'),
                description: t('features.esg.description'),
              },
              {
                icon: BarChart3,
                title: t('features.data.title'),
                description: t('features.data.description'),
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <feature.icon className="w-12 h-12 text-agro-green mb-4" />
                <h3 className={`text-xl ${getFontFamily('heading')} font-bold text-card-foreground mb-3`}>
                  {feature.title}
                </h3>
                <p className={`text-muted-foreground ${getFontFamily('body')}`}>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className={`text-3xl sm:text-4xl ${getFontFamily('heading')} font-bold text-foreground text-center mb-12`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {t('howItWorks.title')}
          </motion.h2>

          <motion.div 
            className="grid md:grid-cols-3 gap-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {[
              {
                number: 1,
                title: t('howItWorks.step1.title'),
                description: t('howItWorks.step1.description'),
              },
              {
                number: 2,
                title: t('howItWorks.step2.title'),
                description: t('howItWorks.step2.description'),
              },
              {
                number: 3,
                title: t('howItWorks.step3.title'),
                description: t('howItWorks.step3.description'),
              },
            ].map((step, index) => (
              <motion.div 
                key={index} 
                className="relative flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="flex-1"
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <div className="bg-gradient-to-br from-agro-green to-agro-dark rounded-2xl p-8 text-white text-center h-full flex flex-col justify-center min-h-[280px]">
                    <motion.div 
                      className={`text-5xl ${getFontFamily('heading')} font-bold mb-4`}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.3, type: "spring", stiffness: 200 }}
                      viewport={{ once: true }}
                    >
                      {step.number}
                    </motion.div>
                    <h3 className={`text-2xl ${getFontFamily('heading')} font-bold mb-3`}>
                      {step.title}
                    </h3>
                    <p className={`${getFontFamily('body')} flex-grow`}>{step.description}</p>
                  </div>
                </motion.div>

                {index < 2 && (
                  <motion.div 
                    className="hidden md:flex absolute -right-10 top-1/2 -translate-y-1/2 z-10"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
                    viewport={{ once: true }}
                  >
                    <ArrowRight className="w-6 h-6 text-agro-green" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Impact / Statistics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-agro-green-light">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl sm:text-4xl ${getFontFamily('heading')} font-bold text-foreground text-center mb-12`}>
            {t('impact.title')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                value: t('impact.income.value'),
                label: t('impact.income.label'),
                icon: TrendingUp,
              },
              {
                value: t('impact.consumers.value'),
                label: t('impact.consumers.label'),
                icon: Users,
              },
              {
                value: t('impact.blockchain.value'),
                label: t('impact.blockchain.label'),
                icon: Link2,
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <stat.icon className="w-12 h-12 text-agro-green mx-auto mb-4" />
                <div className={`text-4xl ${getFontFamily('heading')} font-bold text-agro-green mb-2`}>
                  {stat.value}
                </div>
                <p className={`text-muted-foreground ${getFontFamily('body')}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl sm:text-4xl ${getFontFamily('heading')} font-bold text-foreground text-center mb-12`}>
            {t('pricing.title')}
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: t('pricing.free.name'),
                price: t('pricing.free.price'),
                color: "bg-muted",
                textColor: "text-foreground",
                features: t('pricing.free.features', { returnObjects: true }) as string[],
                category: t('pricing.farmerSection'),
              },
              {
                name: t('pricing.pro.name'),
                price: t('pricing.pro.price'),
                color: "bg-agro-green-light",
                textColor: "text-agro-green",
                features: t('pricing.pro.features', { returnObjects: true }) as string[],
                featured: true,
                popular: t('pricing.pro.popular'),
                category: t('pricing.farmerSection'),
              },
              {
                name: t('pricing.enterprise.name'),
                price: t('pricing.enterprise.price'),
                color: "bg-card",
                textColor: "text-card-foreground",
                features: t('pricing.enterprise.features', { returnObjects: true }) as string[],
                category: t('pricing.businessSection'),
              },
              {
                name: t('pricing.premium.name'),
                price: t('pricing.premium.price'),
                color: "bg-agro-green-light",
                textColor: "text-agro-green",
                features: t('pricing.premium.features', { returnObjects: true }) as string[],
                category: t('pricing.businessSection'),
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`rounded-xl p-6 transition-transform hover:scale-105 animate-slide-up flex flex-col pricing-card ${
                  plan.color
                } ${plan.featured ? "ring-2 ring-agro-green transform lg:scale-105" : "border border-gray-200"}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.featured && (
                  <div className="relative mb-4">
                    <div className="popular-badge text-agro-green text-xs font-poppins font-bold px-4 py-2 rounded-full inline-block transform hover:scale-105 transition-all duration-300 border-2 border-agro-orange/20">
                      <span className="relative z-10">{plan.popular}</span>
                    </div>
                    <div className="popular-badge-dot absolute -top-1 -right-1 w-3 h-3 bg-agro-orange rounded-full"></div>
                  </div>
                )}
                <div className={`text-xs ${getFontFamily('body')} text-muted-foreground mb-2`}>
                  {plan.category}
                </div>
                <h3 className={`text-lg ${getFontFamily('heading')} font-bold ${plan.textColor} mb-2`}>
                  {plan.name}
                </h3>
                <div className={`text-2xl ${getFontFamily('heading')} font-bold text-foreground mb-1`}>
                  {plan.price}
                </div>
                <p className={`text-sm text-muted-foreground ${getFontFamily('body')} mb-6`}>{t('pricing.monthly')}</p>
                <ul className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className={`flex items-start gap-2 text-sm ${getFontFamily('body')} text-muted-foreground`}
                    >
                      <Check className="w-4 h-4 text-agro-green mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                  <Button
                    className={`w-full mt-auto pricing-button ${
                      plan.featured
                        ? "bg-agro-green hover:bg-agro-dark text-white"
                        : "border border-agro-green text-white hover:bg-agro-green-light hover:text-agro-green"
                    }`}
                  >
                    {plan.featured 
                      ? t('pricing.subscribeNow') 
                      : (index >= 2 ? t('pricing.contactUs') : t('pricing.startFree'))
                    }
                  </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-agro-green-light">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl sm:text-4xl ${getFontFamily('heading')} font-bold text-foreground text-center mb-4`}>
            {t('testimonials.title')}
          </h2>
          <p className={`text-center text-muted-foreground ${getFontFamily('body')} mb-12`}>
            {t('testimonials.subtitle')}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: t('testimonials.farmer.name'),
                role: t('testimonials.farmer.role'),
                quote: t('testimonials.farmer.quote'),
                icon: "🌾",
              },
              {
                name: t('testimonials.cooperative.name'),
                role: t('testimonials.cooperative.role'),
                quote: t('testimonials.cooperative.quote'),
                icon: "🏢",
              },
              {
                name: t('testimonials.distributor.name'),
                role: t('testimonials.distributor.role'),
                quote: t('testimonials.distributor.quote'),
                icon: "✓",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-4">{testimonial.icon}</div>
                <p className={`text-muted-foreground ${getFontFamily('body')} mb-6 italic`}>
                  "{testimonial.quote}"
                </p>
                <p className={`${getFontFamily('heading')} font-bold text-card-foreground`}>
                  {testimonial.name}
                </p>
                <p className={`text-sm text-muted-foreground ${getFontFamily('body')}`}>
                  {testimonial.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-agro-green to-agro-dark">
        <div className="max-w-3xl mx-auto text-center text-white animate-fade-in">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl ${getFontFamily('heading')} font-bold mb-6`}>
            {t('cta.title')}
          </h2>
          <p className={`text-lg ${getFontFamily('body')} mb-8 opacity-90`}>
            {t('cta.subtitle')}
          </p>
          <div className="flex justify-center">
            <button className="animated-button" onClick={() => navigate('/auth')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
              <path
                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
              ></path>
            </svg>
            <span className="text">{t('cta.button')}</span>
            <span className="circle"></span>
            <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
              <path
                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
              ></path>
            </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-agro-dark text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-6 h-6 text-agro-orange" />
                <span className="font-poppins font-bold text-lg">
                  AgroConnect
                </span>
              </div>
              <p className={`text-gray-300 ${getFontFamily('body')} text-sm`}>
                {t('footer.description')}
              </p>
            </div>

            <div>
              <h4 className={`${getFontFamily('heading')} font-bold mb-4`}>{t('footer.company')}</h4>
                  <ul className={`space-y-2 text-white ${getFontFamily('body')} text-sm`}>
                    <li>
                      <button 
                        onClick={() => navigate('/about')}
                        className="text-white hover:text-agro-orange transition-colors"
                      >
                        {t('footer.about')}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => navigate('/blog#esg-policy')}
                        className="text-white hover:text-agro-orange transition-colors"
                      >
                        {t('footer.esgPolicy')}
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => navigate('/blog#partners')}
                        className="text-white hover:text-agro-orange transition-colors"
                      >
                        {t('footer.partnerships')}
                      </button>
                    </li>
                  </ul>
            </div>

            <div>
              <h4 className={`${getFontFamily('heading')} font-bold mb-4`}>{t('footer.resources')}</h4>
              <ul className={`space-y-2 text-white ${getFontFamily('body')} text-sm`}>
                <li>
                  <button 
                    onClick={() => navigate('/documentation')}
                    className="text-white hover:text-agro-orange transition-colors"
                  >
                    {t('footer.documentation')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/blog#intro')}
                    className="text-white hover:text-agro-orange transition-colors"
                  >
                    {t('footer.blog')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/blog#other')}
                    className="text-white hover:text-agro-orange transition-colors"
                  >
                    {t('footer.support')}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className={`${getFontFamily('heading')} font-bold mb-4`}>{t('footer.contact')}</h4>
              <ul className={`space-y-2 text-white ${getFontFamily('body')} text-sm`}>
                <li>
                  <a
                    href="mailto:agro.connect@gmail.com"
                    className="text-white hover:text-agro-orange transition-colors"
                  >
                    {t('footer.email')}
                  </a>
                </li>
                <li className="flex items-center gap-2 mt-4">
                  <Facebook className="w-4 h-4 cursor-pointer text-white hover:text-agro-orange transition-colors" />
                  <Linkedin className="w-4 h-4 cursor-pointer text-white hover:text-agro-orange transition-colors" />
                  <Send className="w-4 h-4 cursor-pointer text-white hover:text-agro-orange transition-colors" />
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <p className={`text-center text-white ${getFontFamily('body')} text-sm`}>
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
