'use client'

import { Card, CardContent } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { 
  Github, 
  Linkedin, 
  Instagram,
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
    name: "Parth Jain",
    role: "Chief Executive Officer",
    bio: "Experience in AI and security research.",
    social: {
      linkedin: "https://linkedin.com/in/parth-jain-pj",
      instagram: "https://instagram.com/parththejod",
      github: "https://github.com/parthjod"
    },
    expertise: ["AI Security", "Leadership", "Strategic Vision"]
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

      {/* Leadership Team */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
            <p className="text-muted-foreground text-lg">
              Experienced leaders guiding our mission
            </p>
          </div>

          <div className="flex justify-center">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
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
                    {member.social.instagram && (
                      <a
                        href={member.social.instagram}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram className="h-4 w-4" />
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