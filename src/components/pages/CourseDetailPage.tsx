import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Terminal, 
  Shield, 
  Users, 
  Eye, 
  Play,
  Clock,
  Star,
  CheckCircle,
  BookOpen,
  Target,
  Code,
  ArrowLeft,
  Download,
  Share,
  Heart,
  Award,
  Lock,
  Unlock,
  FileText,
  Video,
  Laptop,
  Network
} from 'lucide-react';
import { Header } from '@/components/header';

const CourseDetailPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [enrollmentStatus, setEnrollmentStatus] = useState('not-enrolled'); // not-enrolled, enrolled, completed

  // Mock course data - in real app, this would come from API
  const courseData = {
    'linux-fundamentals': {
      title: 'Linux Fundamentals',
      description: 'Master command-line operations and system administration with hands-on practice in our interactive terminal environment.',
      category: 'System Administration',
      difficulty: 'Beginner',
      duration: '4 hours',
      lessons: 12,
      rating: 4.8,
      students: 15420,
      price: 'Free',
      icon: Terminal,
      color: 'text-green-400',
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1200',
      demoVideo: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      skills: ['Command Line', 'File Systems', 'Process Management', 'Shell Scripting', 'User Management', 'Network Configuration'],
      prerequisites: 'None - Perfect for beginners',
      certification: true,
      instructor: {
        name: 'Alex Chen',
        title: 'Senior Security Engineer',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
        experience: '8+ years in cybersecurity'
      },
      curriculum: [
        {
          title: 'Introduction to Linux',
          lessons: 3,
          duration: '45 min',
          topics: ['Linux History', 'Distributions', 'Installation'],
          completed: true
        },
        {
          title: 'Command Line Basics',
          lessons: 4,
          duration: '1h 20min',
          topics: ['Navigation', 'File Operations', 'Text Processing', 'Pipes & Redirection'],
          completed: false
        },
        {
          title: 'File System & Permissions',
          lessons: 3,
          duration: '50 min',
          topics: ['Directory Structure', 'File Permissions', 'Ownership'],
          completed: false
        },
        {
          title: 'Process Management',
          lessons: 2,
          duration: '35 min',
          topics: ['Process Control', 'Job Management'],
          completed: false
        }
      ],
      learningOutcomes: [
        'Navigate Linux file systems with confidence',
        'Execute complex command-line operations',
        'Manage users, groups, and permissions',
        'Monitor and control system processes',
        'Write basic shell scripts for automation',
        'Configure network settings and services'
      ],
      practiceEnvironments: [
        {
          name: 'Interactive Terminal',
          description: 'Full Linux environment with guided challenges',
          icon: Terminal,
          available: true
        },
        {
          name: 'Virtual Machines',
          description: 'Pre-configured VMs for advanced practice',
          icon: Laptop,
          available: true
        }
      ]
    },
    'web-security': {
      title: 'Web Application Security',
      description: 'Learn to find and exploit web vulnerabilities using industry-standard tools and techniques.',
      category: 'Web Security',
      difficulty: 'Intermediate',
      duration: '8 hours',
      lessons: 24,
      rating: 4.9,
      students: 12850,
      price: '$49',
      icon: Shield,
      color: 'text-blue-400',
      image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1200',
      demoVideo: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      skills: ['SQL Injection', 'XSS', 'CSRF', 'Authentication Bypass', 'OWASP Top 10', 'Burp Suite'],
      prerequisites: 'Basic web development knowledge (HTML, CSS, JavaScript)',
      certification: true,
      instructor: {
        name: 'Sarah Rodriguez',
        title: 'Lead Penetration Tester',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
        experience: '10+ years in web security'
      },
      curriculum: [
        {
          title: 'Web Security Fundamentals',
          lessons: 6,
          duration: '2h',
          topics: ['HTTP/HTTPS', 'Web Architecture', 'Common Vulnerabilities', 'OWASP Top 10'],
          completed: false
        },
        {
          title: 'SQL Injection Attacks',
          lessons: 6,
          duration: '2h 30min',
          topics: ['Union-based SQLi', 'Blind SQLi', 'Time-based SQLi', 'NoSQL Injection'],
          completed: false
        },
        {
          title: 'Cross-Site Scripting (XSS)',
          lessons: 5,
          duration: '1h 45min',
          topics: ['Reflected XSS', 'Stored XSS', 'DOM XSS', 'XSS Prevention'],
          completed: false
        },
        {
          title: 'Advanced Web Attacks',
          lessons: 7,
          duration: '2h 15min',
          topics: ['CSRF', 'SSRF', 'XXE', 'Deserialization', 'Authentication Bypass'],
          completed: false
        }
      ],
      learningOutcomes: [
        'Identify and exploit SQL injection vulnerabilities',
        'Perform comprehensive XSS attacks and prevention',
        'Execute CSRF and other web-based attacks',
        'Use Burp Suite for professional web testing',
        'Understand OWASP Top 10 vulnerabilities',
        'Implement secure coding practices'
      ],
      practiceEnvironments: [
        {
          name: 'Vulnerable Web Apps',
          description: 'DVWA, WebGoat, and custom vulnerable applications',
          icon: Shield,
          available: true
        },
        {
          name: 'Burp Suite Lab',
          description: 'Professional web security testing environment',
          icon: Target,
          available: true
        }
      ]
    }
  };

  const course = courseData[courseId as keyof typeof courseData];

  if (!course) {
    return (
      <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <Button onClick={() => navigate('/courses')} className="bg-green-400 text-black hover:bg-green-300">
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-400/20 text-green-400 border-green-400';
      case 'Intermediate': return 'bg-blue-400/20 text-blue-400 border-blue-400';
      case 'Advanced': return 'bg-red-400/20 text-red-400 border-red-400';
      default: return 'bg-gray-400/20 text-gray-400 border-gray-400';
    }
  };

  const handleEnrollment = () => {
    setEnrollmentStatus('enrolled');
    // Redirect to enrolled course learning environment
    navigate(`/learn/${courseId}`);
  };

  const completedLessons = course.curriculum.reduce((acc, module) => 
    acc + (module.completed ? module.lessons : 0), 0
  );
  const totalLessons = course.curriculum.reduce((acc, module) => acc + module.lessons, 0);
  const progressPercentage = (completedLessons / totalLessons) * 100;

  return (
    <div className="min-h-screen bg-black text-green-400">
      <Header navigate={navigate} />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 text-green-400 hover:bg-green-400/10"
          onClick={() => navigate('/courses')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <course.icon className={`w-12 h-12 ${course.color}`} />
                <div>
                  <h1 className="text-3xl font-bold text-green-400">{course.title}</h1>
                  <p className="text-green-300/70">{course.category}</p>
                </div>
              </div>
              
              <p className="text-lg text-green-300/80">{course.description}</p>
              
              <div className="flex flex-wrap gap-4 items-center">
                <Badge className={getDifficultyColor(course.difficulty)}>
                  {course.difficulty}
                </Badge>
                <div className="flex items-center space-x-1 text-green-300">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{course.rating}</span>
                  <span className="text-green-300/60">({course.students.toLocaleString()} students)</span>
                </div>
                <div className="flex items-center space-x-1 text-green-300">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1 text-green-300">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.lessons} lessons</span>
                </div>
              </div>
            </div>

            {/* Demo Video */}
            <Card className="bg-black/50 border-green-400/30">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-64 object-cover rounded-t"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Button 
                      size="lg"
                      className="bg-green-400 text-black hover:bg-green-300 rounded-full w-16 h-16"
                    >
                      <Play className="w-8 h-8" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-black/80 text-green-400 border-green-400">
                      <Video className="w-3 h-3 mr-1" />
                      Demo Video
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enrollment Card */}
          <div className="space-y-6">
            <Card className="bg-black/50 border-green-400/30 sticky top-6">
              <CardHeader>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-400">{course.price}</div>
                  {course.price !== 'Free' && (
                    <div className="text-green-300/60 line-through">$99</div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrollmentStatus === 'not-enrolled' ? (
                  <Button 
                    className="w-full bg-green-400 text-black hover:bg-green-300 hacker-btn font-bold"
                    onClick={handleEnrollment}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Enroll Now
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-green-400 font-bold">Enrolled!</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-300/70">Progress</span>
                        <span className="text-green-400">{Math.round(progressPercentage)}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                    </div>
                    <Button 
                      className="w-full bg-green-400 text-black hover:bg-green-300 hacker-btn"
                      onClick={() => navigate(`/learn/${courseId}`)}
                    >
                      Continue Learning
                    </Button>
                  </div>
                )}

                <div className="space-y-3 pt-4 border-t border-green-400/30">
                  <div className="flex items-center justify-between">
                    <span className="text-green-300/70 text-sm">Instructor</span>
                    <div className="flex items-center space-x-2">
                      <img 
                        src={course.instructor.avatar} 
                        alt={course.instructor.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-green-400 text-sm">{course.instructor.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-300/70 text-sm">Certificate</span>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">Included</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-300/70 text-sm">Access</span>
                    <span className="text-green-400 text-sm">Lifetime</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1 border-green-400/30 text-green-400">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-green-400/30 text-green-400">
                    <Share className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-green-400/30 text-green-400">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-black/50 border border-green-400/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400">
              Overview
            </TabsTrigger>
            <TabsTrigger value="curriculum" className="data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400">
              Curriculum
            </TabsTrigger>
            <TabsTrigger value="practice" className="data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400">
              Practice Labs
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400">
              Learning Blog
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/50 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-green-400">What You'll Learn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {course.learningOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-green-300">{outcome}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-green-400">Course Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-green-400 font-medium mb-2">Prerequisites</h4>
                    <p className="text-green-300/70">{course.prerequisites}</p>
                  </div>
                  <div>
                    <h4 className="text-green-400 font-medium mb-2">Skills You'll Gain</h4>
                    <div className="flex flex-wrap gap-2">
                      {course.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="border-green-400/30 text-green-400">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-green-400 font-medium mb-2">Instructor</h4>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={course.instructor.avatar} 
                        alt={course.instructor.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="text-green-400 font-medium">{course.instructor.name}</p>
                        <p className="text-green-300/70 text-sm">{course.instructor.title}</p>
                        <p className="text-green-300/60 text-xs">{course.instructor.experience}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="curriculum" className="space-y-4">
            {course.curriculum.map((module, index) => (
              <Card key={index} className="bg-black/50 border-green-400/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {module.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : enrollmentStatus === 'enrolled' ? (
                        <Unlock className="w-6 h-6 text-green-400" />
                      ) : (
                        <Lock className="w-6 h-6 text-green-400/50" />
                      )}
                      <div>
                        <CardTitle className="text-green-400">{module.title}</CardTitle>
                        <p className="text-green-300/70 text-sm">
                          {module.lessons} lessons • {module.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {module.topics.map((topic, topicIndex) => (
                      <Badge key={topicIndex} variant="outline" className="border-green-400/30 text-green-400 text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="practice" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {course.practiceEnvironments.map((env, index) => (
                <Card key={index} className="bg-black/50 border-green-400/30">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <env.icon className="w-8 h-8 text-green-400" />
                      <div>
                        <CardTitle className="text-green-400">{env.name}</CardTitle>
                        <p className="text-green-300/70">{env.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full bg-green-400 text-black hover:bg-green-300 hacker-btn"
                      disabled={!env.available || enrollmentStatus === 'not-enrolled'}
                    >
                      {enrollmentStatus === 'not-enrolled' ? 'Enroll to Access' : 'Launch Environment'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            <Card className="bg-black/50 border-green-400/30">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Learning Journey: {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-green max-w-none">
                <div className="space-y-6 text-green-300">
                  <section>
                    <h3 className="text-xl font-bold text-green-400 mb-3">Course Overview</h3>
                    <p className="leading-relaxed">
                      This comprehensive {course.title.toLowerCase()} course is designed to take you from a complete beginner 
                      to a confident practitioner. Through hands-on exercises, real-world scenarios, and interactive labs, 
                      you'll gain practical skills that are immediately applicable in professional environments.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-green-400 mb-3">What Makes This Course Special</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Interactive terminal environments for hands-on practice</li>
                      <li>Real-world scenarios based on actual security incidents</li>
                      <li>Industry-standard tools and techniques</li>
                      <li>Progressive difficulty that builds confidence</li>
                      <li>Community support and expert guidance</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-green-400 mb-3">Learning Methodology</h3>
                    <p className="leading-relaxed">
                      Our approach combines theoretical knowledge with practical application. Each module includes:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-green-400/10 p-4 rounded border border-green-400/30">
                        <h4 className="font-bold text-green-400 mb-2">Theory</h4>
                        <p className="text-sm">Comprehensive explanations of concepts and principles</p>
                      </div>
                      <div className="bg-green-400/10 p-4 rounded border border-green-400/30">
                        <h4 className="font-bold text-green-400 mb-2">Practice</h4>
                        <p className="text-sm">Hands-on exercises in safe, controlled environments</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-green-400 mb-3">Career Impact</h3>
                    <p className="leading-relaxed">
                      Upon completion, you'll have the skills and confidence to pursue roles in cybersecurity, 
                      system administration, or advance your current career. Our graduates have gone on to work 
                      at leading technology companies, government agencies, and security consulting firms.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-bold text-green-400 mb-3">Continuous Learning</h3>
                    <p className="leading-relaxed">
                      The cybersecurity landscape is constantly evolving. This course provides you with not just 
                      current knowledge, but the foundational understanding needed to adapt to new threats and 
                      technologies throughout your career.
                    </p>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetailPage;
