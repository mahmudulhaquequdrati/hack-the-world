"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
import { Check, Star, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();

  const plans = [
    {
      name: "Basic Hacker",
      price: "Free",
      period: "Forever",
      description: "Perfect for beginners starting their cybersecurity journey",
      features: [
        "Access to 5 basic courses",
        "Community forum access",
        "Basic progress tracking",
        "Email support",
        "Certificate of completion",
      ],
      buttonText: "Start Free",
      featured: false,
      icon: <Star className="w-6 h-6" />,
    },
    {
      name: "Pro Hacker",
      price: "$29",
      period: "per month",
      description: "For serious learners who want full access to our platform",
      features: [
        "Access to all courses",
        "Interactive labs & simulations",
        "Real-world cybersecurity scenarios",
        "Priority support",
        "Advanced progress analytics",
        "1-on-1 mentorship sessions",
        "Industry certification prep",
      ],
      buttonText: "Upgrade to Pro",
      featured: true,
      icon: <Zap className="w-6 h-6" />,
    },
    {
      name: "Elite Hacker",
      price: "$99",
      period: "per month",
      description: "For professionals and organizations seeking mastery",
      features: [
        "Everything in Pro",
        "Custom learning paths",
        "Team collaboration tools",
        "Advanced CTF challenges",
        "Direct expert consultation",
        "White-label solutions",
        "Custom certification programs",
        "24/7 premium support",
      ],
      buttonText: "Go Elite",
      featured: false,
      icon: <Zap className="w-6 h-6" />,
    },
  ];


  const faqs = [
    {
      question: "Can I upgrade or downgrade anytime?",
      answer:
        "Yes, you can change your plan at any time. Changes take effect immediately and we'll prorate your billing accordingly.",
    },
    {
      question: "Is there a money-back guarantee?",
      answer:
        "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment in full.",
    },
    {
      question: "Do you offer student discounts?",
      answer:
        "Yes! Students with valid .edu email addresses receive 50% off all paid plans. Contact support to verify your student status.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and cryptocurrency payments for maximum security and convenience.",
    },
  ];

  const handlePlanSelection = (planName: string) => {
    if (planName === "Basic Hacker") {
      router.push("/signup");
    } else {
      // Navigate to signup with plan parameter
      router.push(`/signup?plan=${planName.toLowerCase().replace(" ", "-")}`);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-green-400 mb-6">
              Choose Your <span className="text-white">Path</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start your cybersecurity journey with the plan that fits your goals.
              All plans include our core learning platform and community access.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative ${
                    plan.featured
                      ? "bg-green-400/10 border-green-400 scale-105 shadow-lg shadow-green-400/20"
                      : "bg-black/50 border-green-400/30"
                  } hover:border-green-400/60 transition-all duration-300`}
                >
                  {plan.featured && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <CardHeader className="text-center pb-6">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-full border-2 border-green-400 flex items-center justify-center text-green-400">
                        {plan.icon}
                      </div>
                    </div>
                    <CardTitle className="text-green-400 text-2xl mb-2">
                      {plan.name}
                    </CardTitle>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">
                        {plan.price}
                      </span>
                      {plan.period !== "Forever" && (
                        <span className="text-gray-400 ml-2">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm">{plan.description}</p>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start space-x-3"
                        >
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${
                        plan.featured
                          ? "bg-green-400 text-black hover:bg-green-300"
                          : "border-green-400 text-green-400 hover:bg-green-400/10"
                      }`}
                      variant={plan.featured ? "default" : "outline"}
                      onClick={() => handlePlanSelection(plan.name)}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-black/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="bg-black/50 border-green-400/30">
                  <CardContent className="p-6">
                    <h3 className="text-green-400 font-semibold text-lg mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-300">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Level Up Your Skills?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join our community of ethical hackers and cybersecurity
              professionals.
            </p>
            <Button
              size="lg"
              className="bg-green-400 text-black hover:bg-green-300 font-medium"
              onClick={() => router.push("/signup")}
            >
              Start Your Free Trial
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}