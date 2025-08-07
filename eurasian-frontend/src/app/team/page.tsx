'use client'

import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail,
  Shield,
  Brain,
  Zap,
  Users,
  Target,
  Cpu
} from 'lucide-react'

const teamMembers = [
  {
    name: "Dr. Sarah Chen",
    role: "Chief Executive Officer",
    bio: "PhD in Cybersecurity with 15+ years of experience in AI and security research. Former security lead at major tech companies.",
    avatar: "/avatars/sarah.jpg",
    social: {
      linkedin: "https://linkedin.com/in/sarahchen",
      twitter: "https://twitter.com/sarahchen",
      github: "https://github.com/sarahchen"
    },
    expertise: ["AI Security", "Leadership", "Strategic Vision"]
  },
  {
    name: "Marcus Rodriguez",
    role: "Chief Technology Officer",
    bio: "Machine learning expert with a focus on cybersecurity applications. Led AI teams at Fortune 500 companies.",
    avatar: "/avatars/marcus.jpg",
    social: {
      linkedin: "https://linkedin.com/in/marcusr",
      twitter: "https://twitter.com/marcusr",
      github: "https://github.com/marcusr"
    },
    expertise: ["Machine Learning", "System Architecture", "Security Engineering"]
  },
  {
    name: "Emily Watson",
    role: "Chief Security Officer",
    bio: "Former cybersecurity analyst with government and private sector experience. Expert in threat detection and response.",
    avatar: "/avatars/emily.jpg",
    social: {
      linkedin: "https://linkedin.com/in/emilyw",
      twitter: "https://twitter.com/emilyw"
    },
    expertise: ["Threat Intelligence", "Security Operations", "Compliance"]
  },
  {
    name: "David Kim",
    role: "Head of AI Research",
    bio: "AI researcher specializing in natural language processing and anomaly detection. Published author in top AI conferences.",
    avatar: "/avatars/david.jpg",
    social: {
      linkedin: "https://linkedin.com/in/davidkim",
      github: "https://github.com/davidkim"
    },
    expertise: ["NLP", "Deep Learning", "Research"]
  },
  {
    name: "Lisa Thompson",
    role: "Head of Product",
    bio: "Product leader with experience building security products at scale. Passionate about user experience and security.",
    avatar: "/avatars/lisa.jpg",
    social: {
      linkedin: "https://linkedin.com/in/lisathompson",
      twitter: "https://twitter.com/lisathompson"
    },
    expertise: ["Product Management", "UX Design", "Strategy"]
  },
  {
    name: "Alex Johnson",
    role: "Lead Security Engineer",
    bio: "Security engineer with expertise in cloud security and application security. Contributed to major open-source security projects.",
    avatar: "/avatars/alex.jpg",
    social: {
      linkedin: "https://linkedin.com/in/alexj",
      github: "https://github.com/alexj",
      twitter: "https://twitter.com/alexj"
    },
    expertise: ["Cloud Security", "DevSecOps", "Penetration Testing"]
  }
]

const advisors = [
  {
    name: "Dr. Michael Brown",
    role: "Security Advisor",
    bio: "Renowned cybersecurity expert and professor at MIT. Advisor to multiple security startups.",
    avatar: "/avatars/michael.jpg",
    expertise: ["Academic Research", "Security Policy", "Industry Standards"]
  },
  {
    name: "Jennifer Lee",
    role: "AI Ethics Advisor",
    bio: "Expert in AI ethics and responsible AI development. Works with leading tech companies on ethical AI frameworks.",
    avatar: "/avatars/jennifer.jpg",
    expertise: ["AI Ethics", "Responsible AI", "Policy"]
  }
]

const values = [
  {
    icon: Shield,
    title: "Security First",
    description: "We prioritize security in everything we build, ensuring your data is always protected."
  },
  {
    icon: Brain,
    title: "Innovation Driven",
    description: "We continuously push the boundaries of AI and cybersecurity to stay ahead of threats."
  },
  {
    icon: Users,
    title: "User Centric",
    description: "We build products that solve real problems for our users with intuitive experiences."
  },
  {
    icon: Target,
    title: "Mission Focused",
    description: "We're dedicated to making the digital world safer for everyone."
  }
]

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-muted/20">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Meet Our Team
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            We're a diverse team of cybersecurity experts, AI researchers, and engineers 
            united by a common mission: to make the digital world safer for everyone.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <value.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
            <p className="text-muted-foreground text-lg">
              Experienced leaders guiding our mission
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">{member.role}</Badge>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {member.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {member.expertise.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-center space-x-3">
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a
                        href={member.social.twitter}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {member.social.github && (
                      <a
                        href={member.social.github}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advisors Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Advisors</h2>
            <p className="text-muted-foreground text-lg">
              Industry experts guiding our strategic direction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {advisors.map((advisor, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={advisor.avatar} alt={advisor.name} />
                    <AvatarFallback className="text-lg">
                      {advisor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="text-lg font-semibold mb-1">{advisor.name}</h3>
                  <Badge variant="outline" className="mb-3">{advisor.role}</Badge>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {advisor.bio}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 justify-center">
                    {advisor.expertise.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
          <p className="text-muted-foreground text-lg mb-8">
            We're always looking for talented individuals who share our passion for cybersecurity and AI.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <Brain className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">AI Research</h3>
                <p className="text-sm text-muted-foreground">
                  Help us advance the state of AI in cybersecurity
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Shield className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Security Engineering</h3>
                <p className="text-sm text-muted-foreground">
                  Build secure systems that protect millions
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Cpu className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Product & Design</h3>
                <p className="text-sm text-muted-foreground">
                  Create intuitive experiences for complex security
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button size="lg">
              <Mail className="mr-2 h-4 w-4" />
              careers@eurasian.com
            </Button>
            <Button variant="outline" size="lg">
              View Open Positions
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}