import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  ArrowLeft, 
  Mail, 
  Eye, 
  Target,
  Search,
  Phone,
  Globe,
  Camera,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SocialEngLab = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState('phishing');
  const [emailTemplate, setEmailTemplate] = useState('');
  const [targetInfo, setTargetInfo] = useState('');
  const [osintResults, setOsintResults] = useState<string[]>([]);

  const modules = [
    {
      id: 'phishing',
      title: 'Phishing Campaigns',
      description: 'Create and analyze phishing emails',
      icon: Mail,
      color: 'text-red-400'
    },
    {
      id: 'osint',
      title: 'OSINT Gathering',
      description: 'Open source intelligence collection',
      icon: Eye,
      color: 'text-blue-400'
    },
    {
      id: 'pretexting',
      title: 'Pretexting',
      description: 'Social engineering scenarios',
      icon: Phone,
      color: 'text-yellow-400'
    },
    {
      id: 'social-media',
      title: 'Social Media Intel',
      description: 'Information gathering from social platforms',
      icon: MessageSquare,
      color: 'text-purple-400'
    }
  ];

  const phishingTemplates = [
    {
      name: 'Banking Alert',
      subject: 'Urgent: Suspicious Activity Detected',
      content: `Dear Valued Customer,

We have detected suspicious activity on your account. Please verify your identity immediately to prevent account suspension.

Click here to verify: [MALICIOUS_LINK]

Thank you,
Security Team`
    },
    {
      name: 'IT Support',
      subject: 'Password Expiration Notice',
      content: `Hello,

Your password will expire in 24 hours. Please update it immediately to maintain access to your account.

Update Password: [MALICIOUS_LINK]

IT Support Team`
    },
    {
      name: 'Package Delivery',
      subject: 'Package Delivery Failed',
      content: `Dear Customer,

We attempted to deliver your package but no one was available. Please reschedule delivery using the link below.

Reschedule: [MALICIOUS_LINK]

Delivery Service`
    }
  ];

  const osintTools = [
    { name: 'Email Lookup', description: 'Find information about email addresses' },
    { name: 'Domain Analysis', description: 'Analyze domain registration and history' },
    { name: 'Social Media Search', description: 'Search across social media platforms' },
    { name: 'Phone Number Lookup', description: 'Gather information about phone numbers' }
  ];

  const handleOsintSearch = () => {
    const mockResults = [
      `Searching for: ${targetInfo}`,
      '---',
      'Email: john.doe@company.com',
      'LinkedIn: John Doe - Software Engineer at TechCorp',
      'Twitter: @johndoe - 1,234 followers',
      'Phone: +1-555-0123 (Mobile)',
      'Location: San Francisco, CA',
      'Company: TechCorp Inc.',
      'Position: Senior Software Engineer',
      'Education: Stanford University (2015-2019)',
      '---',
      'Potential attack vectors identified:',
      '• LinkedIn connection requests',
      '• Work-related phishing emails',
      '• Phone-based pretexting',
      '• Social media manipulation'
    ];
    setOsintResults(mockResults);
  };

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'phishing':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-green-400">Email Template Builder</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-green-300 mb-1">Quick Templates:</label>
                  <div className="grid grid-cols-1 gap-2">
                    {phishingTemplates.map((template, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start border-green-400/30 text-green-400 hover:bg-green-400/10"
                        onClick={() => setEmailTemplate(template.content)}
                      >
                        {template.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-green-300 mb-1">Email Subject:</label>
                  <Input
                    placeholder="Enter email subject..."
                    className="bg-black border-green-400/30 text-green-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-green-300 mb-1">Email Content:</label>
                  <Textarea
                    value={emailTemplate}
                    onChange={(e) => setEmailTemplate(e.target.value)}
                    placeholder="Compose your phishing email..."
                    className="bg-black border-green-400/30 text-green-400 h-48"
                  />
                </div>

                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Analyze Phishing Email
                </Button>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-400/30 rounded p-4">
              <h4 className="font-bold text-yellow-400 mb-2">⚠️ Educational Purpose Only</h4>
              <p className="text-yellow-300 text-sm">
                This tool is for educational purposes only. Never use these techniques for malicious purposes.
                Always obtain proper authorization before conducting security tests.
              </p>
            </div>
          </div>
        );

      case 'osint':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-green-400">OSINT Investigation</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-green-300 mb-1">Target Information:</label>
                  <Input
                    value={targetInfo}
                    onChange={(e) => setTargetInfo(e.target.value)}
                    placeholder="Enter email, name, or company..."
                    className="bg-black border-green-400/30 text-green-400"
                  />
                </div>

                <Button 
                  onClick={handleOsintSearch}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Start OSINT Investigation
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-green-400">Available Tools:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {osintTools.map((tool, index) => (
                    <div key={index} className="p-3 border border-green-400/30 rounded">
                      <div className="font-medium text-green-400">{tool.name}</div>
                      <div className="text-sm text-green-300/70">{tool.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-green-400">Investigation Results:</h4>
              <div className="bg-black rounded p-3 h-64 overflow-y-auto font-mono text-sm">
                {osintResults.length === 0 ? (
                  <div className="text-green-300/60">No investigation started...</div>
                ) : (
                  osintResults.map((result, index) => (
                    <div key={index} className={`${
                      result.includes('---') ? 'text-green-400 border-b border-green-400/30 my-2' :
                      result.includes('•') ? 'text-red-400' :
                      result.includes(':') ? 'text-green-300' :
                      'text-green-300/80'
                    }`}>
                      {result}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case 'pretexting':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-green-400">Pretexting Scenarios</h3>
              
              <div className="space-y-3">
                <div className="p-4 border border-green-400/30 rounded">
                  <h4 className="font-bold text-green-400 mb-2">Scenario 1: IT Support Call</h4>
                  <p className="text-green-300 text-sm mb-3">
                    You're calling as IT support to verify user credentials due to a "security incident."
                  </p>
                  <div className="space-y-2 text-sm">
                    <div><strong className="text-green-400">Opening:</strong> "Hi, this is [Name] from IT Security. We've detected unusual activity on your account."</div>
                    <div><strong className="text-green-400">Hook:</strong> "We need to verify your identity to secure your account."</div>
                    <div><strong className="text-green-400">Ask:</strong> "Can you confirm your username and password?"</div>
                  </div>
                </div>

                <div className="p-4 border border-green-400/30 rounded">
                  <h4 className="font-bold text-green-400 mb-2">Scenario 2: Vendor Verification</h4>
                  <p className="text-green-300 text-sm mb-3">
                    Calling as a trusted vendor needing to update payment information.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div><strong className="text-green-400">Opening:</strong> "Hello, I'm calling from [Vendor Company] regarding your account."</div>
                    <div><strong className="text-green-400">Hook:</strong> "We need to update our payment processing system."</div>
                    <div><strong className="text-green-400">Ask:</strong> "Can you verify the credit card on file?"</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'social-media':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-green-400">Social Media Intelligence</h3>
              
              <div className="space-y-3">
                <div className="p-4 border border-green-400/30 rounded">
                  <h4 className="font-bold text-green-400 mb-2">Information Categories</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="font-medium text-green-400">Personal Info</div>
                      <ul className="text-green-300/80 space-y-1">
                        <li>• Full name & aliases</li>
                        <li>• Location & check-ins</li>
                        <li>• Family & relationships</li>
                        <li>• Interests & hobbies</li>
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium text-green-400">Professional Info</div>
                      <ul className="text-green-300/80 space-y-1">
                        <li>• Current employer</li>
                        <li>• Job title & role</li>
                        <li>• Work colleagues</li>
                        <li>• Professional skills</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-green-400/30 rounded">
                  <h4 className="font-bold text-green-400 mb-2">Attack Vectors</h4>
                  <div className="space-y-2 text-sm">
                    <div className="text-green-300">
                      <strong>Spear Phishing:</strong> Use personal information to craft targeted emails
                    </div>
                    <div className="text-green-300">
                      <strong>Social Engineering:</strong> Leverage relationships and interests
                    </div>
                    <div className="text-green-300">
                      <strong>Pretexting:</strong> Use professional information for credibility
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a module to begin</div>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-green-400 hover:bg-green-400/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold neon-glow flex items-center">
                <Users className="w-6 h-6 mr-2" />
                Social Engineering Lab
              </h1>
              <p className="text-green-300/70">Learn psychological manipulation techniques and defenses</p>
            </div>
          </div>
          <Badge variant="outline" className="border-red-400 text-red-400">
            Educational Use Only
          </Badge>
        </div>

        {/* Main Content */}
        <ResizablePanelGroup direction="horizontal" className="min-h-[600px]">
          {/* Module Selection */}
          <ResizablePanel defaultSize={25} minSize={20}>
            <Card className="h-full bg-black/50 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-green-400">Training Modules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      activeModule === module.id 
                        ? 'border-green-400 bg-green-400/10' 
                        : 'border-green-400/30 hover:border-green-400/50'
                    }`}
                    onClick={() => setActiveModule(module.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <module.icon className={`w-5 h-5 ${module.color}`} />
                      <div>
                        <div className="font-medium text-green-400">{module.title}</div>
                        <div className="text-xs text-green-300/60">{module.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Module Content */}
          <ResizablePanel defaultSize={50} minSize={40}>
            <Card className="h-full bg-black/50 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  {modules.find(m => m.id === activeModule)?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full overflow-y-auto">
                {renderModuleContent()}
              </CardContent>
            </Card>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Information Panel */}
          <ResizablePanel defaultSize={25} minSize={20}>
            <Card className="h-full bg-black/50 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-green-400">Defense Strategies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border border-blue-400/30 rounded">
                    <h4 className="font-bold text-blue-400 mb-2">Email Security</h4>
                    <ul className="text-sm text-green-300 space-y-1">
                      <li>• Verify sender identity</li>
                      <li>• Check for urgency tactics</li>
                      <li>• Hover over links</li>
                      <li>• Use multi-factor auth</li>
                    </ul>
                  </div>

                  <div className="p-3 border border-purple-400/30 rounded">
                    <h4 className="font-bold text-purple-400 mb-2">Phone Security</h4>
                    <ul className="text-sm text-green-300 space-y-1">
                      <li>• Verify caller identity</li>
                      <li>• Never give passwords</li>
                      <li>• Call back official numbers</li>
                      <li>• Be suspicious of urgency</li>
                    </ul>
                  </div>

                  <div className="p-3 border border-yellow-400/30 rounded">
                    <h4 className="font-bold text-yellow-400 mb-2">Social Media</h4>
                    <ul className="text-sm text-green-300 space-y-1">
                      <li>• Limit personal info</li>
                      <li>• Review privacy settings</li>
                      <li>• Be careful with connections</li>
                      <li>• Think before posting</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default SocialEngLab;
