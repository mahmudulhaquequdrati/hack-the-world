import { CheckCircle, Play, Shield, Terminal, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HowItWorksPage = () => {
  const steps = [
    {
      icon: <Users className="w-8 h-8 text-green-400" />,
      title: "Sign Up & Join",
      description:
        "Create your hacker profile and join our cybersecurity academy.",
      features: [
        "Free registration",
        "Personalized dashboard",
        "Progress tracking",
      ],
    },
    {
      icon: <Terminal className="w-8 h-8 text-green-400" />,
      title: "Learn by Doing",
      description:
        "Access interactive labs, real-world simulations, and hands-on exercises.",
      features: [
        "Live terminal access",
        "Real-world scenarios",
        "Interactive challenges",
      ],
    },
    {
      icon: <Shield className="w-8 h-8 text-green-400" />,
      title: "Master Security",
      description:
        "Progress through structured courses from beginner to expert level.",
      features: [
        "Structured curriculum",
        "Expert guidance",
        "Industry certifications",
      ],
    },
  ];

  const features = [
    "Interactive terminal-based learning",
    "Real-world cybersecurity scenarios",
    "Gamified achievement system",
    "Expert-designed curriculum",
    "Community support",
    "Progress tracking & analytics",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-green-400 mb-6">
            How It <span className="text-white">Works</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Master cybersecurity through hands-on learning, real-world
            simulations, and expert-guided courses designed for hackers by
            hackers.
          </p>
          <Button
            size="lg"
            className="bg-green-400 text-black hover:bg-green-300 font-medium"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Learning Now
          </Button>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Your Learning Journey
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="bg-black/50 border-green-400/30 hover:border-green-400/60 transition-colors"
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full border-2 border-green-400 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <CardTitle className="text-green-400 text-xl">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-300 mb-6">{step.description}</p>
                  <ul className="space-y-2">
                    {step.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-gray-400 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-black/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Why Choose Our Platform?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Hacking Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of cybersecurity professionals who trust our
            platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-400 text-black hover:bg-green-300 font-medium"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-green-400 text-green-400 hover:bg-green-400/10"
            >
              View Courses
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
