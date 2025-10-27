import { Button } from "@/components/ui/button";
import {
  Leaf,
  ArrowLeft,
  Users,
  Target,
  Award,
  Globe,
  Heart,
  Lightbulb,
  Shield,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Star,
  Link2,
  BarChart3,
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFontFamily } from '@/hooks/useFontFamily';

interface TeamMember {
  name: string;
  position: string;
  education: string;
  experience: string;
  role: string;
  icon: any;
}

export default function About() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getFontFamily } = useFontFamily();

  // Team members data using translation keys
  const teamMembers: TeamMember[] = [
    {
      name: t('about.team.members.ceo.name'),
      position: t('about.team.members.ceo.position'),
      education: t('about.team.members.ceo.education'),
      experience: t('about.team.members.ceo.experience'),
      role: t('about.team.members.ceo.role'),
      icon: Target,
    },
    {
      name: t('about.team.members.cto.name'),
      position: t('about.team.members.cto.position'),
      education: t('about.team.members.cto.education'),
      experience: t('about.team.members.cto.experience'),
      role: t('about.team.members.cto.role'),
      icon: Lightbulb,
    },
    {
      name: t('about.team.members.cfo.name'),
      position: t('about.team.members.cfo.position'),
      education: t('about.team.members.cfo.education'),
      experience: t('about.team.members.cfo.experience'),
      role: t('about.team.members.cfo.role'),
      icon: TrendingUp,
    },
    {
      name: t('about.team.members.cmo.name'),
      position: t('about.team.members.cmo.position'),
      education: t('about.team.members.cmo.education'),
      experience: t('about.team.members.cmo.experience'),
      role: t('about.team.members.cmo.role'),
      icon: Globe,
    },
    {
      name: t('about.team.members.coo.name'),
      position: t('about.team.members.coo.position'),
      education: t('about.team.members.coo.education'),
      experience: t('about.team.members.coo.experience'),
      role: t('about.team.members.coo.role'),
      icon: Briefcase,
    },
    {
      name: t('about.team.members.clo.name'),
      position: t('about.team.members.clo.position'),
      education: t('about.team.members.clo.education'),
      experience: t('about.team.members.clo.experience'),
      role: t('about.team.members.clo.role'),
      icon: Shield,
    },
    {
      name: t('about.team.members.chro.name'),
      position: t('about.team.members.chro.position'),
      education: t('about.team.members.chro.education'),
      experience: t('about.team.members.chro.experience'),
      role: t('about.team.members.chro.role'),
      icon: Users,
    },
    {
      name: t('about.team.members.rdLead.name'),
      position: t('about.team.members.rdLead.position'),
      education: t('about.team.members.rdLead.education'),
      experience: t('about.team.members.rdLead.experience'),
      role: t('about.team.members.rdLead.role'),
      icon: Award,
    },
    {
      name: t('about.team.members.externalLead.name'),
      position: t('about.team.members.externalLead.position'),
      education: t('about.team.members.externalLead.education'),
      experience: t('about.team.members.externalLead.experience'),
      role: t('about.team.members.externalLead.role'),
      icon: Heart,
    },
    {
      name: t('about.team.members.internationalLead.name'),
      position: t('about.team.members.internationalLead.position'),
      education: t('about.team.members.internationalLead.education'),
      experience: t('about.team.members.internationalLead.experience'),
      role: t('about.team.members.internationalLead.role'),
      icon: Globe,
    },
  ];

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
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('about.backToHome')}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
            {t('about.title')}
          </motion.h1>
          <motion.p 
            className={`text-lg sm:text-xl text-muted-foreground mb-8 ${getFontFamily('body')}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            {t('about.subtitle')}
          </motion.p>
        </motion.div>
      </section>

      {/* Company Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="bg-gradient-to-br from-agro-green-light to-agro-green/10 rounded-2xl overflow-hidden h-96 relative">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')`
                  }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-agro-green/40 via-agro-green/30 to-agro-dark/50"></div>
                </div>
                
                {/* Content */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    {/* Central Icon */}
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                      <Leaf className="w-12 h-12" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3">AgroConnect</h3>
                    <p className="text-sm opacity-90 mb-6">{t('about.mission.subtitle')}</p>
                    
                    {/* Feature Icons */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Globe className="w-3 h-3" />
                        </div>
                        <span className="text-xs">ESG</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Link2 className="w-3 h-3" />
                        </div>
                        <span className="text-xs">Blockchain</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <BarChart3 className="w-3 h-3" />
                        </div>
                        <span className="text-xs">Data</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <Users className="w-3 h-3" />
                        </div>
                        <span className="text-xs">Team</span>
                      </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-4 h-4 bg-agro-orange rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-3 h-3 bg-agro-orange/60 rounded-full"></div>
                    <div className="absolute top-1/2 right-6 w-2 h-2 bg-white/50 rounded-full"></div>
                    <div className="absolute bottom-1/3 left-6 w-1.5 h-1.5 bg-white/40 rounded-full"></div>
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

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-agro-green-light">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className={`text-3xl sm:text-4xl ${getFontFamily('heading')} font-bold text-foreground text-center mb-4`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {t('about.team.title')}
          </motion.h2>
          <motion.p 
            className={`text-center text-muted-foreground ${getFontFamily('body')} mb-12`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {t('about.team.subtitle')}
          </motion.p>

          <div className="space-y-12">
            {/* CEO - First row, centered */}
            <div className="flex justify-center">
              <motion.div
                className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 max-w-md"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-agro-green rounded-full flex items-center justify-center">
                    {(() => {
                      const IconComponent = teamMembers[0].icon;
                      return <IconComponent className="w-6 h-6 text-white" />;
                    })()}
                  </div>
                  <div>
                    <h3 className={`text-lg ${getFontFamily('heading')} font-bold text-card-foreground`}>
                      {teamMembers[0].name}
                    </h3>
                    <p className={`text-sm text-agro-green ${getFontFamily('body')} font-medium`}>
                      {teamMembers[0].position}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="w-4 h-4 text-agro-green" />
                      <span className={`text-sm ${getFontFamily('heading')} font-semibold text-card-foreground`}>
                        {t('common.education')}
                      </span>
                    </div>
                    <p className={`text-sm text-muted-foreground ${getFontFamily('body')}`}>
                      {teamMembers[0].education}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-agro-green" />
                      <span className={`text-sm ${getFontFamily('heading')} font-semibold text-card-foreground`}>
                        {t('common.experience')}
                      </span>
                    </div>
                    <p className={`text-sm text-muted-foreground ${getFontFamily('body')}`}>
                      {teamMembers[0].experience}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-agro-green" />
                      <span className={`text-sm ${getFontFamily('heading')} font-semibold text-card-foreground`}>
                        {t('common.role')}
                      </span>
                    </div>
                    <p className={`text-sm text-muted-foreground ${getFontFamily('body')}`}>
                      {teamMembers[0].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Rest of team - 3 rows of 3 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.slice(1).map((member, index) => (
                <motion.div
                  key={index + 1}
                  className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (index + 1) * 0.1, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-agro-green rounded-full flex items-center justify-center">
                      {(() => {
                        const IconComponent = member.icon;
                        return <IconComponent className="w-6 h-6 text-white" />;
                      })()}
                    </div>
                    <div>
                      <h3 className={`text-lg ${getFontFamily('heading')} font-bold text-card-foreground`}>
                        {member.name}
                      </h3>
                      <p className={`text-sm text-agro-green ${getFontFamily('body')} font-medium`}>
                        {member.position}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <GraduationCap className="w-4 h-4 text-agro-green" />
                        <span className={`text-sm ${getFontFamily('heading')} font-semibold text-card-foreground`}>
                          {t('common.education')}
                        </span>
                      </div>
                      <p className={`text-sm text-muted-foreground ${getFontFamily('body')}`}>
                        {member.education}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-agro-green" />
                        <span className={`text-sm ${getFontFamily('heading')} font-semibold text-card-foreground`}>
                          {t('common.experience')}
                        </span>
                      </div>
                      <p className={`text-sm text-muted-foreground ${getFontFamily('body')}`}>
                        {member.experience}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-agro-green" />
                        <span className={`text-sm ${getFontFamily('heading')} font-semibold text-card-foreground`}>
                          {t('common.role')}
                        </span>
                      </div>
                      <p className={`text-sm text-muted-foreground ${getFontFamily('body')}`}>
                        {member.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className={`text-3xl sm:text-4xl ${getFontFamily('heading')} font-bold text-foreground text-center mb-12`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {t('about.values.title')}
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: t('about.values.connect.title'),
                description: t('about.values.connect.description'),
              },
              {
                icon: Shield,
                title: t('about.values.honest.title'),
                description: t('about.values.honest.description'),
              },
              {
                icon: Leaf,
                title: t('about.values.sustainable.title'),
                description: t('about.values.sustainable.description'),
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-agro-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl ${getFontFamily('heading')} font-bold text-foreground mb-3`}>
                  {value.title}
                </h3>
                <p className={`text-muted-foreground ${getFontFamily('body')}`}>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-agro-green to-agro-dark">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl ${getFontFamily('heading')} font-bold mb-6`}>
            {t('cta.title')}
          </h2>
          <p className={`text-lg ${getFontFamily('body')} mb-8 opacity-90`}>
            {t('cta.subtitle')}
          </p>
          <div className="flex justify-center">
            <button className="animated-button" onClick={() => navigate('/dashboard')}>
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
    </div>
  );
}
