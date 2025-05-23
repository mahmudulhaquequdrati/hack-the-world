import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Terminal, 
  Shield, 
  Users, 
  Trophy, 
  Clock, 
  Target,
  BookOpen,
  Play,
  Lock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Zap,
  Eye
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const courses = [
    {
      id: 'linux-fundamentals',
      title: 'Linux Fundamentals',
      description: 'Master command-line operations and system administration',
      progress: 75,
      difficulty: 'Beginner',
      duration: '4 hours',
      icon: Terminal,
      color: 'text-green-400',
      status: 'in-progress'
    },
    {
      id: 'web-security',
      title: 'Web Application Security',
      description: 'Learn to find and exploit web vulnerabilities',
      progress: 45,
      difficulty: 'Intermediate',
      duration: '8 hours',
      icon: Shield,
      color: 'text-blue-400',
      status: 'in-progress'
    },
    {
      id: 'social-engineering',
      title: 'Social Engineering',
      description: 'Psychological manipulation and defense techniques',
      progress: 0,
      difficulty: 'Advanced',
      duration: '6 hours',
      icon: Users,
      color: 'text-red-400',
      status: 'locked'
    },
    {
      id: 'osint',
      title: 'OSINT Techniques',
      description: 'Open source intelligence gathering methods',
      progress: 100,
      difficulty: 'Intermediate',
      duration: '5 hours',
      icon: Eye,
      color: 'text-purple-400',
      status: 'completed'
    }
  ];

  const labs = [
    {
      id: 'terminal-lab',
      title: 'Linux Terminal Lab',
      description: 'Interactive command-line challenges',
      icon: Terminal,
      color: 'text-green-400',
      path: '/terminal-lab'
    },
    {
      id: 'websec-lab',
      title: 'Web Security Lab',
      description: 'Vulnerable web applications for testing',
      icon: Shield,
      color: 'text-blue-400',
      path: '/websec-lab'
    },
    {
      id: 'social-lab',
      title: 'Social Engineering Lab',
      description: 'Phishing and OSINT simulations',
      icon: Users,
      color: 'text-red-400',
      path: '/social-eng-lab'
    }
  ];

  const achievements = [
    { title: 'First Blood', description: 'Complete your first challenge', earned: true },
    { title: 'Terminal Master', description: 'Complete 50 terminal commands', earned: true },
    { title: 'Web Warrior', description: 'Find 10 web vulnerabilities', earned: false },
    { title: 'Social Engineer', description: 'Complete social engineering course', earned: false }
  ];

  const stats = [
    { label: 'Challenges Completed', value: '127', icon: Target, color: 'text-green-400' },
    { label: 'Hours Practiced', value: '89', icon: Clock, color: 'text-blue-400' },
    { label: 'Rank', value: '#342', icon: Trophy, color: 'text-yellow-400' },
    { label: 'Streak', value: '12 days', icon: Zap, color: 'text-purple-400' }
  ];

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold neon-glow">Command Center</h1>
            <p className="text-green-300/70">Welcome back, Agent. Ready for your next mission?</p>
          </div>
          <Button 
            variant="outline" 
            className="border-green-400 text-green-400 hover:bg-green-400/10"
            onClick={() => navigate('/')}
          >
            Exit System
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-black/50 border-green-400/30 hover:border-green-400 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-300/70 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-green-400">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-black/50 border border-green-400/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400">
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400">
              Courses
            </TabsTrigger>
            <TabsTrigger value="labs" className="data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400">
              Labs
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400">
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-black/50 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-green-300">Completed: SQL Injection Challenge</p>
                      <p className="text-green-300/60 text-sm">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Play className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-green-300">Started: XSS Vulnerability Lab</p>
                      <p className="text-green-300/60 text-sm">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-green-300">Earned: Terminal Master Badge</p>
                      <p className="text-green-300/60 text-sm">3 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Access Labs */}
              <Card className="bg-black/50 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Quick Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {labs.map((lab) => (
                    <Button
                      key={lab.id}
                      variant="outline"
                      className="w-full justify-start border-green-400/30 text-green-400 hover:bg-green-400/10"
                      onClick={() => navigate(lab.path)}
                    >
                      <lab.icon className={`w-5 h-5 mr-3 ${lab.color}`} />
                      <div className="text-left">
                        <div className="font-medium">{lab.title}</div>
                        <div className="text-sm text-green-300/60">{lab.description}</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="bg-black/50 border-green-400/30 hover:border-green-400 transition-all group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <course.icon className={`w-8 h-8 ${course.color}`} />
                        <div>
                          <CardTitle className="text-green-400">{course.title}</CardTitle>
                          <p className="text-green-300/70 text-sm">{course.description}</p>
                        </div>
                      </div>
                      {course.status === 'completed' && (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      )}
                      {course.status === 'locked' && (
                        <Lock className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4 text-sm">
                      <Badge variant="outline" className="border-green-400/50 text-green-400">
                        {course.difficulty}
                      </Badge>
                      <span className="text-green-300/70">{course.duration}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-300/70">Progress</span>
                        <span className="text-green-400">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2 bg-green-900/30" />
                    </div>

                    <Button 
                      className="w-full bg-green-400 text-black hover:bg-green-300"
                      disabled={course.status === 'locked'}
                      onClick={() => navigate(`/course/${course.id}`)}
                    >
                      {course.status === 'completed' ? 'Review' : 
                       course.status === 'locked' ? 'Locked' : 'Continue'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="labs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {labs.map((lab) => (
                <Card key={lab.id} className="bg-black/50 border-green-400/30 hover:border-green-400 transition-all group cursor-pointer"
                      onClick={() => navigate(lab.path)}>
                  <CardHeader className="text-center">
                    <lab.icon className={`w-16 h-16 mx-auto ${lab.color} group-hover:scale-110 transition-transform`} />
                    <CardTitle className="text-green-400">{lab.title}</CardTitle>
                    <p className="text-green-300/70">{lab.description}</p>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-green-400 text-black hover:bg-green-300">
                      Enter Lab
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <Card key={index} className={`bg-black/50 border-green-400/30 ${achievement.earned ? 'border-green-400' : 'opacity-50'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      {achievement.earned ? (
                        <Trophy className="w-8 h-8 text-yellow-400" />
                      ) : (
                        <Lock className="w-8 h-8 text-gray-500" />
                      )}
                      <div>
                        <h3 className="font-bold text-green-400">{achievement.title}</h3>
                        <p className="text-green-300/70 text-sm">{achievement.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
