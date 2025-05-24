import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle, 
  Search,
  Code,
  Database,
  Globe,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WebSecLab = () => {
  const navigate = useNavigate();
  const [activeVuln, setActiveVuln] = useState('sql-injection');
  const [testInput, setTestInput] = useState('');
  const [testResults, setTestResults] = useState<string[]>([]);
  const [foundVulns, setFoundVulns] = useState<string[]>([]);

  const vulnerabilities = [
    {
      id: 'sql-injection',
      title: 'SQL Injection',
      description: 'Learn to identify and exploit SQL injection vulnerabilities',
      difficulty: 'Intermediate',
      icon: Database,
      color: 'text-red-400',
      payload: "' OR '1'='1",
      vulnerable: true
    },
    {
      id: 'xss',
      title: 'Cross-Site Scripting (XSS)',
      description: 'Practice finding and exploiting XSS vulnerabilities',
      difficulty: 'Beginner',
      icon: Code,
      color: 'text-yellow-400',
      payload: '<script>alert("XSS")</script>',
      vulnerable: true
    },
    {
      id: 'csrf',
      title: 'Cross-Site Request Forgery',
      description: 'Understand CSRF attacks and prevention methods',
      difficulty: 'Advanced',
      icon: Globe,
      color: 'text-purple-400',
      payload: '<img src="http://evil.com/transfer?amount=1000">',
      vulnerable: false
    },
    {
      id: 'auth-bypass',
      title: 'Authentication Bypass',
      description: 'Learn techniques to bypass authentication mechanisms',
      difficulty: 'Advanced',
      icon: Lock,
      color: 'text-blue-400',
      payload: 'admin\' --',
      vulnerable: true
    }
  ];

  const handleTest = () => {
    const vuln = vulnerabilities.find(v => v.id === activeVuln);
    if (!vuln) return;

    const newResults = [...testResults];
    
    if (testInput.includes(vuln.payload) && vuln.vulnerable) {
      newResults.push(`✓ VULNERABILITY FOUND: ${vuln.title}`);
      newResults.push(`Payload: ${testInput}`);
      newResults.push(`Impact: High - Potential data breach`);
      
      if (!foundVulns.includes(vuln.id)) {
        setFoundVulns([...foundVulns, vuln.id]);
      }
    } else if (vuln.vulnerable) {
      newResults.push(`✗ Test failed. Try a different payload.`);
      newResults.push(`Hint: Try using: ${vuln.payload}`);
    } else {
      newResults.push(`✓ No vulnerability found - Application is secure`);
    }
    
    newResults.push('---');
    setTestResults(newResults);
  };

  const renderVulnerableApp = () => {
    const vuln = vulnerabilities.find(v => v.id === activeVuln);
    
    switch (activeVuln) {
      case 'sql-injection':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-green-400">Vulnerable Login Form</h3>
            <div className="bg-gray-900 p-4 rounded border">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-green-300 mb-1">Username:</label>
                  <Input 
                    placeholder="Enter username"
                    className="bg-black border-green-400/30 text-green-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-green-300 mb-1">Password:</label>
                  <Input 
                    type="password"
                    placeholder="Enter password"
                    className="bg-black border-green-400/30 text-green-400"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Login</Button>
              </div>
            </div>
            <div className="text-sm text-green-300/70">
              SQL Query: SELECT * FROM users WHERE username='[INPUT]' AND password='[INPUT]'
            </div>
          </div>
        );
      
      case 'xss':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-green-400">Comment System</h3>
            <div className="bg-gray-900 p-4 rounded border">
              <div className="space-y-3">
                <Textarea 
                  placeholder="Leave a comment..."
                  className="bg-black border-green-400/30 text-green-400"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">Post Comment</Button>
              </div>
              <div className="mt-4 p-3 bg-black rounded">
                <div className="text-sm text-green-300">Previous comments will appear here...</div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-green-400">{vuln?.title} Test Environment</h3>
            <div className="bg-gray-900 p-4 rounded border">
              <div className="text-green-300">
                Test environment for {vuln?.title} vulnerability
              </div>
            </div>
          </div>
        );
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
                <Shield className="w-6 h-6 mr-2" />
                Web Security Lab
              </h1>
              <p className="text-green-300/70">Practice ethical hacking on vulnerable web applications</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-300/70">Vulnerabilities Found</div>
            <div className="text-lg font-bold text-green-400">{foundVulns.length}/{vulnerabilities.filter(v => v.vulnerable).length}</div>
          </div>
        </div>

        {/* Main Content */}
        <ResizablePanelGroup direction="horizontal" className="min-h-[600px]">
          {/* Vulnerability Selection */}
          <ResizablePanel defaultSize={25} minSize={20}>
            <Card className="h-full bg-black/50 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-green-400">Vulnerabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {vulnerabilities.map((vuln) => (
                  <div
                    key={vuln.id}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      activeVuln === vuln.id 
                        ? 'border-green-400 bg-green-400/10' 
                        : 'border-green-400/30 hover:border-green-400/50'
                    }`}
                    onClick={() => setActiveVuln(vuln.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <vuln.icon className={`w-5 h-5 ${vuln.color}`} />
                      <div className="flex-1">
                        <div className="font-medium text-green-400">{vuln.title}</div>
                        <div className="text-xs text-green-300/60">{vuln.difficulty}</div>
                      </div>
                      {foundVulns.includes(vuln.id) && vuln.vulnerable && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Vulnerable Application */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <Card className="h-full bg-black/50 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Target Application
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderVulnerableApp()}
              </CardContent>
            </Card>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Testing Panel */}
          <ResizablePanel defaultSize={35} minSize={25}>
            <Card className="h-full bg-black/50 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Security Testing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="bg-black/50 border border-green-400/30">
                    <TabsTrigger value="manual" className="data-[state=active]:bg-green-400/20">
                      Manual Testing
                    </TabsTrigger>
                    <TabsTrigger value="automated" className="data-[state=active]:bg-green-400/20">
                      Automated
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="manual" className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-green-300 mb-1">Test Payload:</label>
                        <Input
                          value={testInput}
                          onChange={(e) => setTestInput(e.target.value)}
                          placeholder="Enter your payload here..."
                          className="bg-black border-green-400/30 text-green-400"
                        />
                      </div>
                      <Button 
                        onClick={handleTest}
                        className="w-full bg-green-400 text-black hover:bg-green-300"
                      >
                        Test Payload
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-green-400">Vulnerability Info:</h4>
                      <div className="bg-green-900/20 border border-green-400/30 rounded p-3 text-sm">
                        <div className="font-medium text-green-400 mb-1">
                          {vulnerabilities.find(v => v.id === activeVuln)?.title}
                        </div>
                        <div className="text-green-300/80">
                          {vulnerabilities.find(v => v.id === activeVuln)?.description}
                        </div>
                        <div className="mt-2">
                          <Badge variant="outline" className="border-green-400/50 text-green-400">
                            {vulnerabilities.find(v => v.id === activeVuln)?.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="automated" className="space-y-4">
                    <div className="space-y-3">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Run Automated Scan
                      </Button>
                      <div className="text-sm text-green-300/70">
                        Automated tools will scan for common vulnerabilities
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Results */}
                <div className="space-y-2">
                  <h4 className="font-bold text-green-400">Test Results:</h4>
                  <div className="bg-black rounded p-3 h-48 overflow-y-auto font-mono text-sm">
                    {testResults.length === 0 ? (
                      <div className="text-green-300/60">No tests run yet...</div>
                    ) : (
                      testResults.map((result, index) => (
                        <div key={index} className={`${
                          result.includes('✓ VULNERABILITY') ? 'text-red-400' :
                          result.includes('✓') ? 'text-green-400' :
                          result.includes('✗') ? 'text-yellow-400' :
                          'text-green-300'
                        }`}>
                          {result}
                        </div>
                      ))
                    )}
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

export default WebSecLab;
