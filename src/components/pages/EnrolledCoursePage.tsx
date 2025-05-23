import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { 
  Terminal, 
  Shield, 
  Users, 
  Eye, 
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  SkipBack,
  SkipForward,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Lock,
  Code,
  Database,
  Mail,
  Search,
  Globe,
  FileText,
  MessageSquare,
  Zap,
  Target,
  Clock
} from 'lucide-react';
import { Header } from '@/components/header';

const EnrolledCoursePage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activePlayground, setActivePlayground] = useState('terminal');
  const [videoProgress, setVideoProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<boolean[]>([true, false, false, false, false]);

  // Mock course data with video content
  const courseData = {
    'linux-fundamentals': {
      title: 'Linux Fundamentals',
      instructor: 'Alex Chen',
      lessons: [
        {
          id: 1,
          title: 'Introduction to Linux',
          duration: '15:30',
          videoUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg',
          description: 'Welcome to Linux! In this lesson, we\'ll explore the history and philosophy of Linux.',
          transcript: `Welcome to Linux Fundamentals! I'm Alex Chen, and I'll be your guide through this comprehensive journey into the world of Linux. 

Linux is more than just an operating system - it's a philosophy of open-source computing that has revolutionized the technology industry. Born from the vision of Linus Torvalds in 1991, Linux has grown to power everything from smartphones to supercomputers.

In this course, you'll learn not just the commands, but the thinking behind Linux. We'll start with the basics and gradually build your expertise until you're comfortable navigating any Linux system with confidence.

Key topics we'll cover:
- Understanding the Linux filesystem hierarchy
- Mastering essential command-line tools
- Managing users, groups, and permissions
- Process management and system monitoring
- Shell scripting for automation
- Network configuration and security

By the end of this course, you'll have the skills to pursue roles in system administration, DevOps, cybersecurity, and more. Linux knowledge is fundamental to modern technology careers.

Let's begin this exciting journey together!`
        },
        {
          id: 2,
          title: 'File System Navigation',
          duration: '22:45',
          videoUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg',
          description: 'Master the Linux file system structure and navigation commands.',
          transcript: `Now let's dive into the Linux file system - the foundation of everything you'll do in Linux.

Unlike Windows with its drive letters, Linux uses a unified directory tree starting from the root directory (/). This hierarchical structure is both elegant and powerful.

Essential directories you need to know:
- /home - User home directories
- /etc - System configuration files
- /var - Variable data like logs
- /usr - User programs and utilities
- /bin - Essential system binaries
- /tmp - Temporary files

Navigation commands we'll practice:
- pwd (print working directory)
- ls (list directory contents)
- cd (change directory)
- find (search for files)
- locate (quick file location)

The beauty of Linux is its consistency. Once you understand these patterns, you can navigate any Linux system efficiently.`
        },
        {
          id: 3,
          title: 'File Operations',
          duration: '28:15',
          videoUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg',
          description: 'Learn to create, copy, move, and delete files and directories.',
          transcript: `File operations are the bread and butter of Linux administration. Let's master the essential commands that you'll use every day.

Creating and managing files:
- touch - Create empty files or update timestamps
- mkdir - Create directories
- cp - Copy files and directories
- mv - Move or rename files
- rm - Remove files (be careful!)
- rmdir - Remove empty directories

Advanced operations:
- rsync - Efficient file synchronization
- tar - Archive and compress files
- chmod - Change file permissions
- chown - Change file ownership

Safety tips:
- Always use -i flag for interactive confirmation
- Test commands with -n (dry run) when available
- Keep backups of important files
- Understand the difference between hard and soft links

Practice makes perfect - we'll work through real-world scenarios in the terminal playground.`
        },
        {
          id: 4,
          title: 'Text Processing',
          duration: '25:30',
          videoUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg',
          description: 'Master powerful text processing tools like grep, sed, and awk.',
          transcript: `Text processing is where Linux truly shines. The command-line tools available for manipulating text are incredibly powerful and efficient.

Essential text tools:
- cat - Display file contents
- less/more - Page through files
- head/tail - Show beginning/end of files
- grep - Search text patterns
- sed - Stream editor for filtering and transforming text
- awk - Pattern scanning and processing language

Real-world applications:
- Log file analysis
- Configuration file editing
- Data extraction and reporting
- System monitoring and alerting

These tools can be combined using pipes (|) to create powerful one-liners that would require complex programs in other environments.

Example: grep "ERROR" /var/log/syslog | awk '{print $1, $2, $3}' | sort | uniq -c

This single line finds all errors in the system log, extracts the timestamp, sorts them, and counts occurrences. That's the power of Linux text processing!`
        },
        {
          id: 5,
          title: 'Process Management',
          duration: '20:45',
          videoUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg',
          description: 'Understand processes, jobs, and system monitoring.',
          transcript: `Process management is crucial for system administration and troubleshooting. Let's explore how Linux handles running programs.

Key concepts:
- Process ID (PID) - Unique identifier for each process
- Parent Process ID (PPID) - Process hierarchy
- Process states - Running, sleeping, stopped, zombie
- Process priority and nice values

Essential commands:
- ps - Display running processes
- top/htop - Real-time process monitoring
- kill - Terminate processes
- killall - Kill processes by name
- jobs - Show active jobs
- nohup - Run commands immune to hangups

Background and foreground jobs:
- & - Run command in background
- Ctrl+Z - Suspend current job
- fg - Bring job to foreground
- bg - Send job to background

System monitoring:
- uptime - System load and uptime
- free - Memory usage
- df - Disk space usage
- iostat - I/O statistics

Understanding process management helps you troubleshoot performance issues and manage system resources effectively.`
        }
      ],
      playgrounds: [
        {
          id: 'terminal',
          name: 'Linux Terminal',
          icon: Terminal,
          description: 'Interactive Linux command line environment'
        },
        {
          id: 'file-explorer',
          name: 'File Explorer',
          icon: FileText,
          description: 'Visual file system browser'
        }
      ]
    },
    'web-security': {
      title: 'Web Application Security',
      instructor: 'Sarah Rodriguez',
      lessons: [
        {
          id: 1,
          title: 'Web Security Fundamentals',
          duration: '18:20',
          videoUrl: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
          description: 'Introduction to web application security concepts and threat landscape.',
          transcript: `Welcome to Web Application Security! I'm Sarah Rodriguez, and I'll guide you through the fascinating world of web security testing.

Web applications are everywhere, and they're constantly under attack. As a security professional, your job is to find vulnerabilities before the bad guys do.

The modern threat landscape:
- OWASP Top 10 vulnerabilities
- Advanced persistent threats
- Zero-day exploits
- Social engineering attacks
- Supply chain attacks

Core security principles:
- Confidentiality - Protecting sensitive data
- Integrity - Ensuring data accuracy
- Availability - Maintaining system uptime
- Authentication - Verifying user identity
- Authorization - Controlling access rights

We'll use industry-standard tools like Burp Suite, OWASP ZAP, and custom scripts to identify and exploit vulnerabilities in controlled environments.

Remember: We're the good guys. Everything we learn here is for defensive purposes and authorized testing only.`
        },
        {
          id: 2,
          title: 'SQL Injection Attacks',
          duration: '32:15',
          videoUrl: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
          description: 'Learn to identify and exploit SQL injection vulnerabilities.',
          transcript: `SQL injection remains one of the most critical web application vulnerabilities. Let's understand how it works and how to exploit it ethically.

What is SQL injection?
SQL injection occurs when user input is improperly sanitized and directly concatenated into SQL queries, allowing attackers to manipulate database operations.

Types of SQL injection:
- Union-based SQLi - Extracting data using UNION statements
- Boolean-based blind SQLi - Inferring data through true/false responses
- Time-based blind SQLi - Using delays to extract information
- Error-based SQLi - Leveraging database errors for information disclosure

Common injection points:
- Login forms
- Search functionality
- URL parameters
- HTTP headers
- Cookies

Detection techniques:
- Manual testing with special characters
- Automated scanning tools
- Code review
- Error message analysis

We'll practice on vulnerable applications like DVWA and SQLi Labs, learning to extract usernames, passwords, and sensitive data while understanding the impact on real systems.

Prevention methods:
- Parameterized queries
- Input validation
- Least privilege database access
- Web application firewalls`
        },
        {
          id: 3,
          title: 'Cross-Site Scripting (XSS)',
          duration: '28:40',
          videoUrl: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
          description: 'Understand different types of XSS attacks and prevention methods.',
          transcript: `Cross-Site Scripting (XSS) is a client-side vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users.

Types of XSS:
- Reflected XSS - Script reflected off web server
- Stored XSS - Script permanently stored on target server
- DOM-based XSS - Vulnerability in client-side code

Attack vectors:
- Form inputs
- URL parameters
- HTTP headers
- File uploads
- WebSocket messages

Payload examples:
- <script>alert('XSS')</script>
- <img src=x onerror=alert('XSS')>
- javascript:alert('XSS')

Advanced techniques:
- Filter bypass methods
- Encoding and obfuscation
- Polyglot payloads
- BeEF framework usage

Real-world impact:
- Session hijacking
- Credential theft
- Defacement
- Malware distribution
- Phishing attacks

We'll use tools like XSSHunter and practice on vulnerable applications to understand the full impact of XSS vulnerabilities.

Defense strategies:
- Input validation and sanitization
- Output encoding
- Content Security Policy (CSP)
- HttpOnly cookies
- X-XSS-Protection headers`
        }
      ],
      playgrounds: [
        {
          id: 'sql-lab',
          name: 'SQL Injection Lab',
          icon: Database,
          description: 'Practice SQL injection techniques safely'
        },
        {
          id: 'xss-lab',
          name: 'XSS Testing Lab',
          icon: Code,
          description: 'Cross-site scripting vulnerability testing'
        },
        {
          id: 'burp-suite',
          name: 'Burp Suite',
          icon: Target,
          description: 'Professional web security testing platform'
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

  const currentLessonData = course.lessons[currentLesson];
  const progress = (completedLessons.filter(Boolean).length / course.lessons.length) * 100;

  const markLessonComplete = () => {
    const newCompleted = [...completedLessons];
    newCompleted[currentLesson] = true;
    setCompletedLessons(newCompleted);
  };

  const renderPlayground = () => {
    switch (activePlayground) {
      case 'terminal':
        return (
          <div className="h-full bg-black rounded border border-green-400/30 p-4 font-mono">
            <div className="text-green-400 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Terminal className="w-4 h-4" />
                <span>Linux Terminal - Interactive Environment</span>
              </div>
              <div className="text-xs text-green-300/70">
                Practice the commands from the video lesson
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="text-green-400">user@cybersec:~$ ls -la</div>
              <div className="text-green-300">total 24</div>
              <div className="text-green-300">drwxr-xr-x 3 user user 4096 Dec 15 10:30 .</div>
              <div className="text-green-300">drwxr-xr-x 5 user user 4096 Dec 15 10:25 ..</div>
              <div className="text-green-300">-rw-r--r-- 1 user user  220 Dec 15 10:25 .bash_logout</div>
              <div className="text-green-300">-rw-r--r-- 1 user user 3771 Dec 15 10:25 .bashrc</div>
              <div className="text-green-300">drwxr-xr-x 2 user user 4096 Dec 15 10:30 Documents</div>
              <div className="text-green-400 flex items-center">
                user@cybersec:~$ <span className="terminal-cursor ml-1">|</span>
              </div>
            </div>
            <div className="mt-6 p-3 bg-green-400/10 rounded border border-green-400/30">
              <div className="text-green-400 font-bold mb-2">Challenge:</div>
              <div className="text-green-300 text-sm">
                Navigate to the Documents directory and create a new file called "practice.txt"
              </div>
            </div>
          </div>
        );
      
      case 'sql-lab':
        return (
          <div className="h-full bg-black rounded border border-blue-400/30 p-4">
            <div className="text-blue-400 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Database className="w-4 h-4" />
                <span>SQL Injection Testing Lab</span>
              </div>
              <div className="text-xs text-blue-300/70">
                Practice SQL injection techniques in a safe environment
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-400/10 p-3 rounded border border-blue-400/30">
                <div className="text-blue-400 font-bold mb-2">Vulnerable Login Form</div>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Username" 
                    className="w-full p-2 bg-black border border-blue-400/30 text-blue-400 rounded"
                  />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full p-2 bg-black border border-blue-400/30 text-blue-400 rounded"
                  />
                  <Button className="w-full bg-blue-400 text-black hover:bg-blue-300">
                    Login
                  </Button>
                </div>
              </div>
              <div className="bg-red-400/10 p-3 rounded border border-red-400/30">
                <div className="text-red-400 font-bold mb-2">SQL Query Debug:</div>
                <div className="font-mono text-xs text-red-300">
                  SELECT * FROM users WHERE username='[INPUT]' AND password='[INPUT]'
                </div>
              </div>
              <div className="bg-green-400/10 p-3 rounded border border-green-400/30">
                <div className="text-green-400 font-bold mb-2">Hint:</div>
                <div className="text-green-300 text-sm">
                  Try entering: admin' OR '1'='1' -- in the username field
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'xss-lab':
        return (
          <div className="h-full bg-black rounded border border-orange-400/30 p-4">
            <div className="text-orange-400 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Code className="w-4 h-4" />
                <span>XSS Testing Environment</span>
              </div>
              <div className="text-xs text-orange-300/70">
                Test cross-site scripting vulnerabilities safely
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-orange-400/10 p-3 rounded border border-orange-400/30">
                <div className="text-orange-400 font-bold mb-2">Comment Form</div>
                <textarea 
                  placeholder="Enter your comment..." 
                  className="w-full p-2 bg-black border border-orange-400/30 text-orange-400 rounded h-20"
                />
                <Button className="mt-2 bg-orange-400 text-black hover:bg-orange-300">
                  Submit Comment
                </Button>
              </div>
              <div className="bg-purple-400/10 p-3 rounded border border-purple-400/30">
                <div className="text-purple-400 font-bold mb-2">Payload Examples:</div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="text-purple-300"><script>alert('XSS')</script></div>
                  <div className="text-purple-300"><img src=x onerror=alert('XSS')></div>
                  <div className="text-purple-300"><svg onload=alert('XSS')></div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="h-full bg-black rounded border border-green-400/30 p-4 flex items-center justify-center">
            <div className="text-center text-green-400">
              <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a playground environment</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400">
      <Header navigate={navigate} />
      
      <div className="max-w-full mx-auto p-6">
        {/* Course Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-green-400 hover:bg-green-400/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-green-400">{course.title}</h1>
              <p className="text-green-300/70">with {course.instructor}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-300/70">Course Progress</div>
            <div className="text-lg font-bold text-green-400">{Math.round(progress)}%</div>
          </div>
        </div>

        {/* Main Learning Interface */}
        <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-200px)]">
          {/* Video Player */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <Card className="h-full bg-black/50 border-green-400/30">
              <CardContent className="p-0 h-full">
                <div className="relative h-full">
                  {/* Video Container */}
                  <div className="relative h-2/3 bg-black rounded-t">
                    <img 
                      src={currentLessonData.videoUrl} 
                      alt={currentLessonData.title}
                      className="w-full h-full object-cover rounded-t"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Button 
                        size="lg"
                        className="bg-green-400 text-black hover:bg-green-300 rounded-full w-16 h-16"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                      </Button>
                    </div>
                    
                    {/* Video Controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4">
                      <div className="flex items-center space-x-4">
                        <Button size="sm" variant="ghost" className="text-green-400">
                          <SkipBack className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-green-400"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" className="text-green-400">
                          <SkipForward className="w-4 h-4" />
                        </Button>
                        <div className="flex-1">
                          <Progress value={videoProgress} className="h-1" />
                        </div>
                        <span className="text-green-400 text-sm">{currentLessonData.duration}</span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-green-400"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                        <Button size="sm" variant="ghost" className="text-green-400">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-green-400">
                          <Maximize className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Lesson Info */}
                  <div className="p-4 h-1/3 overflow-y-auto">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-green-400">{currentLessonData.title}</h3>
                        <p className="text-green-300/70 text-sm">{currentLessonData.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-green-400" />
                          <span className="text-green-300 text-sm">{currentLessonData.duration}</span>
                        </div>
                        <Button 
                          size="sm"
                          className="bg-green-400 text-black hover:bg-green-300"
                          onClick={markLessonComplete}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Complete
                        </Button>
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          disabled={currentLesson === 0}
                          onClick={() => setCurrentLesson(currentLesson - 1)}
                          className="border-green-400/30 text-green-400 hover:bg-green-400/10"
                        >
                          Previous
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          disabled={currentLesson === course.lessons.length - 1}
                          onClick={() => setCurrentLesson(currentLesson + 1)}
                          className="border-green-400/30 text-green-400 hover:bg-green-400/10"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Playground */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <Card className="h-full bg-black/50 border-green-400/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-green-400">Practice Environment</CardTitle>
                  <div className="flex space-x-2">
                    {course.playgrounds.map((playground) => (
                      <Button
                        key={playground.id}
                        size="sm"
                        variant={activePlayground === playground.id ? "default" : "outline"}
                        className={activePlayground === playground.id 
                          ? "bg-green-400 text-black" 
                          : "border-green-400/30 text-green-400 hover:bg-green-400/10"
                        }
                        onClick={() => setActivePlayground(playground.id)}
                      >
                        <playground.icon className="w-4 h-4 mr-2" />
                        {playground.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100%-80px)]">
                {renderPlayground()}
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Lesson List & Transcript */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lesson List */}
          <Card className="bg-black/50 border-green-400/30">
            <CardHeader>
              <CardTitle className="text-green-400">Course Lessons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {course.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    index === currentLesson 
                      ? 'border-green-400 bg-green-400/10' 
                      : 'border-green-400/30 hover:border-green-400/50'
                  }`}
                  onClick={() => setCurrentLesson(index)}
                >
                  <div className="flex items-center space-x-3">
                    {completedLessons[index] ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : index <= currentLesson ? (
                      <Play className="w-5 h-5 text-green-400" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-500" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-green-400 text-sm">{lesson.title}</div>
                      <div className="text-xs text-green-300/60">{lesson.duration}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Video Transcript */}
          <Card className="lg:col-span-2 bg-black/50 border-green-400/30">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Video Transcript & Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="prose prose-green max-w-none">
                <div className="text-green-300 leading-relaxed whitespace-pre-line">
                  {currentLessonData.transcript}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCoursePage;
