import { Award, Globe, Shield, Target, Users, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AboutPage = () => {
  const team = [
    {
      name: "Alex Chen",
      role: "Founder & CEO",
      bio: "Former NSA cybersecurity expert with 15+ years in ethical hacking and penetration testing.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      specialties: [
        "Penetration Testing",
        "Social Engineering",
        "Red Team Operations",
      ],
    },
    {
      name: "Sarah Rodriguez",
      role: "Head of Education",
      bio: "PhD in Computer Security, published researcher, and former CISO with a passion for teaching.",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face",
      specialties: [
        "Threat Intelligence",
        "Incident Response",
        "Security Architecture",
      ],
    },
    {
      name: "Marcus Johnson",
      role: "Lead Instructor",
      bio: "Certified Ethical Hacker and OSCP holder, specializing in hands-on cybersecurity training.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      specialties: ["Web Security", "Network Penetration", "Malware Analysis"],
    },
  ];

  const values = [
    {
      icon: <Shield className="w-8 h-8 text-green-400" />,
      title: "Ethical Security",
      description:
        "We believe in using hacking skills for good - protecting systems and educating defenders.",
    },
    {
      icon: <Target className="w-8 h-8 text-green-400" />,
      title: "Practical Learning",
      description:
        "Real-world scenarios and hands-on labs that prepare you for actual cybersecurity challenges.",
    },
    {
      icon: <Users className="w-8 h-8 text-green-400" />,
      title: "Community Driven",
      description:
        "A supportive community where learners and experts collaborate and share knowledge.",
    },
    {
      icon: <Globe className="w-8 h-8 text-green-400" />,
      title: "Global Impact",
      description:
        "Making cybersecurity education accessible worldwide to create a safer digital future.",
    },
  ];

  const stats = [
    { number: "50,000+", label: "Students Trained" },
    { number: "200+", label: "Security Experts" },
    { number: "95%", label: "Job Placement Rate" },
    { number: "24/7", label: "Community Support" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-green-400 mb-6">
            About <span className="text-white">Terminal Hacks</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            We're on a mission to democratize cybersecurity education and build
            the next generation of ethical hackers who will defend our digital
            world.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-gray-300 mb-6 text-lg">
                In an increasingly connected world, cybersecurity threats are
                evolving faster than ever. Traditional education can't keep pace
                with the rapidly changing landscape of digital threats.
              </p>
              <p className="text-gray-300 mb-6">
                That's why we created Terminal Hacks - to provide hands-on,
                real-world cybersecurity training that prepares students for the
                challenges they'll face in the field. Our platform combines
                cutting-edge technology with expert instruction to deliver an
                unparalleled learning experience.
              </p>
              <Button
                size="lg"
                className="bg-green-400 text-black hover:bg-green-300 font-medium"
              >
                <Zap className="w-5 h-5 mr-2" />
                Join Our Mission
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-lg p-8 border border-green-400/30">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        {stat.number}
                      </div>
                      <div className="text-gray-300 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Our Core Values
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="bg-black/50 border-green-400/30 hover:border-green-400/60 transition-colors text-center"
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full border-2 border-green-400 flex items-center justify-center">
                      {value.icon}
                    </div>
                  </div>
                  <CardTitle className="text-green-400 text-xl">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Meet Our Team
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="bg-black/50 border-green-400/30 hover:border-green-400/60 transition-colors"
              >
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-green-400">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-green-400 text-xl">
                    {member.name}
                  </CardTitle>
                  <p className="text-gray-400 font-medium">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">{member.bio}</p>
                  <div className="space-y-2">
                    <h4 className="text-green-400 font-semibold text-sm">
                      Specialties:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty, specialtyIndex) => (
                        <span
                          key={specialtyIndex}
                          className="bg-green-400/20 text-green-400 px-2 py-1 rounded text-xs"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
            Awards & Recognition
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Award className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-green-400 font-bold text-lg mb-2">
                Best EdTech Platform 2023
              </h3>
              <p className="text-gray-300 text-sm">
                Cybersecurity Excellence Awards
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-green-400 font-bold text-lg mb-2">
                Top Security Training
              </h3>
              <p className="text-gray-300 text-sm">
                InfoSec Institute Rankings
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-green-400 font-bold text-lg mb-2">
                Community Choice
              </h3>
              <p className="text-gray-300 text-sm">Hacker Community Awards</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Be part of the movement to create a more secure digital world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-400 text-black hover:bg-green-300 font-medium"
            >
              Start Learning Today
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-green-400 text-green-400 hover:bg-green-400/10"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
