import { Header } from "@/components/common/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Check,
  Code,
  Globe,
  Lock,
  Shield,
  Star,
  Target,
  Terminal,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PricingPage = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );

  const pricingTiers = [
    {
      name: "Script Kiddie",
      description: "Perfect for beginners starting their cybersecurity journey",
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      features: [
        "5 Basic tutorials",
        "Community forum access",
        "Basic terminal exercises",
        "Certificate of completion",
        "Email support",
      ],
      limitations: [
        "Limited lab access",
        "No advanced modules",
        "Standard support only",
      ],
      color: "green",
      icon: Terminal,
    },
    {
      name: "White Hat",
      description: "For serious learners ready to advance their skills",
      monthlyPrice: 29,
      annualPrice: 290,
      popular: true,
      features: [
        "All Script Kiddie features",
        "50+ Advanced tutorials",
        "Live penetration testing labs",
        "Real-world vulnerability scanning",
        "Social engineering modules",
        "OSINT training",
        "Priority support",
        "Industry certifications",
        "Private Discord community",
      ],
      limitations: [],
      color: "blue",
      icon: Shield,
    },
    {
      name: "Elite Hacker",
      description: "Professional-grade training for cybersecurity experts",
      monthlyPrice: 99,
      annualPrice: 990,
      popular: false,
      features: [
        "All White Hat features",
        "Unlimited lab access",
        "Custom vulnerable environments",
        "1-on-1 mentorship sessions",
        "Red team exercises",
        "Advanced threat hunting",
        "Zero-day research training",
        "Job placement assistance",
        "White label solutions",
        "API access",
        "Custom integrations",
      ],
      limitations: [],
      color: "purple",
      icon: Zap,
    },
  ];

  const features = [
    {
      icon: Target,
      title: "Hands-on Labs",
      description: "Practice on real vulnerable systems in safe environments",
    },
    {
      icon: Code,
      title: "Interactive Learning",
      description: "Code along with expert instructors in live sessions",
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with fellow ethical hackers and mentors",
    },
    {
      icon: Globe,
      title: "Global Recognition",
      description: "Industry-recognized certifications and achievements",
    },
  ];

  const getPriceColor = (color: string) => {
    switch (color) {
      case "green":
        return "text-green-400";
      case "blue":
        return "text-blue-400";
      case "purple":
        return "text-purple-400";
      default:
        return "text-green-400";
    }
  };

  const getBorderColor = (color: string) => {
    switch (color) {
      case "green":
        return "border-green-400/30 hover:border-green-400";
      case "blue":
        return "border-blue-400/30 hover:border-blue-400";
      case "purple":
        return "border-purple-400/30 hover:border-purple-400";
      default:
        return "border-green-400/30 hover:border-green-400";
    }
  };

  const getButtonColor = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-400 text-black hover:bg-green-300";
      case "blue":
        return "bg-blue-400 text-black hover:bg-blue-300";
      case "purple":
        return "bg-purple-400 text-black hover:bg-purple-300";
      default:
        return "bg-green-400 text-black hover:bg-green-300";
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400">
      <Header navigate={navigate} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-green-400/20 text-green-400 border-green-400 mb-6">
              Pricing Plans
            </Badge>

            <h1 className="text-5xl font-bold mb-6 text-green-400">
              Choose Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                Hacking Path
              </span>
            </h1>

            <p className="text-green-300/80 text-xl mb-8 max-w-3xl mx-auto">
              From beginner to elite hacker - unlock your cybersecurity
              potential with our comprehensive training programs
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span
                className={`text-sm ${
                  billingCycle === "monthly"
                    ? "text-green-400"
                    : "text-green-300/60"
                }`}
              >
                Monthly
              </span>
              <button
                onClick={() =>
                  setBillingCycle(
                    billingCycle === "monthly" ? "annual" : "monthly"
                  )
                }
                className={`relative w-14 h-7 rounded-full border-2 transition-all ${
                  billingCycle === "annual"
                    ? "bg-green-400/20 border-green-400"
                    : "bg-gray-700 border-gray-600"
                }`}
              >
                <div
                  className={`absolute w-5 h-5 bg-green-400 rounded-full top-0.5 transition-transform ${
                    billingCycle === "annual"
                      ? "translate-x-7"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
              <span
                className={`text-sm ${
                  billingCycle === "annual"
                    ? "text-green-400"
                    : "text-green-300/60"
                }`}
              >
                Annual
                <span className="ml-1 text-green-400 font-semibold">
                  (Save 17%)
                </span>
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative bg-black/50 ${getBorderColor(
                  tier.color
                )} transition-all duration-300 group ${
                  tier.popular ? "scale-105 ring-2 ring-blue-400/50" : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-400 text-black border-blue-400">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-black border-2 ${
                      getBorderColor(tier.color).split(" ")[0]
                    } flex items-center justify-center`}
                  >
                    <tier.icon
                      className={`w-8 h-8 ${getPriceColor(tier.color)}`}
                    />
                  </div>

                  <CardTitle
                    className={`text-2xl font-bold ${getPriceColor(
                      tier.color
                    )}`}
                  >
                    {tier.name}
                  </CardTitle>

                  <p className="text-green-300/70 text-sm mb-6">
                    {tier.description}
                  </p>

                  <div className="space-y-2">
                    <div
                      className={`text-4xl font-bold ${getPriceColor(
                        tier.color
                      )}`}
                    >
                      $
                      {billingCycle === "monthly"
                        ? tier.monthlyPrice
                        : Math.round(tier.annualPrice / 12)}
                      <span className="text-lg font-normal text-green-300/60">
                        /month
                      </span>
                    </div>
                    {billingCycle === "annual" && tier.annualPrice > 0 && (
                      <div className="text-sm text-green-300/60">
                        Billed annually at ${tier.annualPrice}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Button
                    size="lg"
                    className={`w-full font-medium ${getButtonColor(
                      tier.color
                    )}`}
                    onClick={() =>
                      navigate("/signup", {
                        state: { selectedPlan: tier.name, billingCycle },
                      })
                    }
                  >
                    {tier.monthlyPrice === 0 ? "Start Free" : "Start Hacking"}
                  </Button>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-400">
                      Features included:
                    </h4>
                    {tier.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center space-x-3"
                      >
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-green-300/80 text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}

                    {tier.limitations.length > 0 && (
                      <div className="pt-3 border-t border-green-400/20">
                        <h4 className="font-semibold text-red-400 mb-2">
                          Limitations:
                        </h4>
                        {tier.limitations.map((limitation, limitIndex) => (
                          <div
                            key={limitIndex}
                            className="flex items-center space-x-3"
                          >
                            <div className="w-4 h-4 rounded-full border border-red-400/50 flex-shrink-0" />
                            <span className="text-red-300/60 text-sm">
                              {limitation}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-black/30 border-green-400/20 text-center p-6"
              >
                <feature.icon className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-400 mb-2">
                  {feature.title}
                </h3>
                <p className="text-green-300/70 text-sm">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-green-400 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="bg-black/30 border-green-400/20 text-left">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">
                    Is there a free trial?
                  </h3>
                  <p className="text-green-300/70">
                    Yes! Our Script Kiddie plan is completely free forever. You
                    can also try any paid plan for 7 days risk-free.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 border-green-400/20 text-left">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">
                    Can I upgrade anytime?
                  </h3>
                  <p className="text-green-300/70">
                    Absolutely! You can upgrade your plan at any time. Changes
                    take effect immediately and you only pay the prorated
                    difference.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 border-green-400/20 text-left">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">
                    Are labs safe to practice on?
                  </h3>
                  <p className="text-green-300/70">
                    Yes! All our labs are isolated, sandboxed environments
                    designed specifically for ethical hacking practice. Nothing
                    leaves our secure platform.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 border-green-400/20 text-left">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-2">
                    What if I need help?
                  </h3>
                  <p className="text-green-300/70">
                    Our community and support team are here to help! Get
                    assistance through our Discord, forums, or direct support
                    based on your plan.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-20">
            <h2 className="text-3xl font-bold text-green-400 mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-green-300/80 mb-8">
              Join thousands of ethical hackers who have advanced their careers
              with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-green-400 text-black hover:bg-green-300 font-medium"
                onClick={() => navigate("/signup")}
              >
                <Lock className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-green-400 text-green-400 hover:bg-green-400/10 font-medium"
                onClick={() => navigate("/courses")}
              >
                <Terminal className="w-5 h-5 mr-2" />
                View Courses
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
