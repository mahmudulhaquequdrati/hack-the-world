import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Terminal, 
  Shield, 
  Users, 
  Eye, 
  Search,
  Clock,
  Star,
  Play,
  Lock,
  CheckCircle,
  Filter,
  BookOpen,
  Target,
  Code,
  Wifi,
  Database,
  Network
} from 'lucide-react';
import { Header } from '@/components/header';

const CoursesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const courses = [
    {
      id: 'linux-fundamentals',
      title: 'Linux Fundamentals',
      description: 'Master command-line operations and system administration with hands-on practice',
      category: 'System Administration',
      difficulty: 'Beginner',
      duration: '4 hours',
      lessons: 12,
      rating: 4.8,
      students: 15420,
      price: 'Free',
      icon: Terminal,
      color: 'text-green-400',
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
      skills: ['Command Line', 'File Systems', 'Process Management', 'Shell Scripting'],
      prerequisites: 'None',
      certification: true
    },
    {
      id: 'web-security',
      title: 'Web Application Security',
      description: 'Learn to find and exploit web vulnerabilities using industry-standard tools',
      category: 'Web Security',
      difficulty: 'Intermediate',
      duration: '8 hours',
      lessons: 24,
      rating: 4.9,
      students: 12850,
      price: '$49',
      icon: Shield,
      color: 'text-blue-400',
      image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
      skills: ['SQL Injection', 'XSS', 'CSRF', 'Authentication Bypass'],
      prerequisites: 'Basic web development knowledge',
      certification: true
    },
    {
      id: 'social-engineering',
      title: 'Social Engineering',
      description: 'Psychological manipulation techniques and defense strategies',
      category: 'Human Security',
      difficulty: 'Advanced',
      duration: '6 hours',
      lessons: 18,
      rating: 4.7,
      students: 8930,
      price: '$79',
      icon: Users,
      color: 'text-red-400',
      image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800',
      skills: ['Phishing', 'Pretexting', 'Baiting', 'Psychological Profiling'],
      prerequisites: 'Basic cybersecurity knowledge',
      certification: true
    },
    {
      id: 'osint-techniques',
      title: 'OSINT Techniques',
      description: 'Open source intelligence gathering and analysis methods',
      category: 'Intelligence',
      difficulty: 'Intermediate',
      duration: '5 hours',
      lessons: 15,
      rating: 4.6,
      students: 9750,
      price: '$39',
      icon: Eye,
      color: 'text-purple-400',
      image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800',
      skills: ['Information Gathering', 'Social Media Analysis', 'Domain Research', 'People Search'],
      prerequisites: 'Basic internet research skills',
      certification: true
    },
    {
      id: 'network-security',
      title: 'Network Security',
      description: 'Network protocols, scanning, and penetration testing fundamentals',
      category: 'Network Security',
      difficulty: 'Intermediate',
      duration: '7 hours',
      lessons: 21,
      rating: 4.8,
      students: 11200,
      price: '$59',
      icon: Network,
      color: 'text-cyan-400',
      image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
      skills: ['Network Scanning', 'Wireshark', 'Firewall Bypass', 'VPN Security'],
      prerequisites: 'Basic networking knowledge',
      certification: true
    },
    {
      id: 'malware-analysis',
      title: 'Malware Analysis',
      description: 'Reverse engineering and analyzing malicious software',
      category: 'Malware',
      difficulty: 'Advanced',
      duration: '10 hours',
      lessons: 30,
      rating: 4.9,
      students: 6420,
      price: '$99',
      icon: Code,
      color: 'text-orange-400',
      image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
      skills: ['Static Analysis', 'Dynamic Analysis', 'Reverse Engineering', 'Sandbox Evasion'],
      prerequisites: 'Programming experience required',
      certification: true
    }
  ];

  const categories = ['all', 'System Administration', 'Web Security', 'Human Security', 'Intelligence', 'Network Security', 'Malware'];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-400/20 text-green-400 border-green-400';
      case 'Intermediate': return 'bg-blue-400/20 text-blue-400 border-blue-400';
      case 'Advanced': return 'bg-red-400/20 text-red-400 border-red-400';
      default: return 'bg-gray-400/20 text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400">
      <Header navigate={navigate} />
      
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-green-400">Cybersecurity Courses</h1>
          <p className="text-green-300/80 text-lg max-w-2xl mx-auto">
            Master cybersecurity with our comprehensive courses designed by industry experts. 
            From beginner to advanced, we have the perfect learning path for you.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400/70 w-5 h-5" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black border-green-400/30 text-green-400 placeholder:text-green-400/50 focus:border-green-400"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">Filters:</span>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-black border border-green-400/30 text-green-400 rounded px-3 py-1 text-sm focus:border-green-400"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-black">
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-black border border-green-400/30 text-green-400 rounded px-3 py-1 text-sm focus:border-green-400"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty} className="bg-black">
                  {difficulty === 'all' ? 'All Levels' : difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="bg-black/50 border-green-400/30 hover:border-green-400 transition-all duration-300 group cursor-pointer overflow-hidden">
              <div className="relative">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={getDifficultyColor(course.difficulty)}>
                    {course.difficulty}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-black/80 text-green-400 border-green-400">
                    {course.price}
                  </Badge>
                </div>
              </div>

              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <course.icon className={`w-8 h-8 ${course.color}`} />
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-green-300 text-sm">{course.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-green-400 group-hover:text-green-300 transition-colors">
                  {course.title}
                </CardTitle>
                <p className="text-green-300/70 text-sm">{course.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-green-300/70">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-green-300/70">Skills you'll learn:</div>
                  <div className="flex flex-wrap gap-1">
                    {course.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="border-green-400/30 text-green-400 text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {course.skills.length > 3 && (
                      <Badge variant="outline" className="border-green-400/30 text-green-400 text-xs">
                        +{course.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {course.certification && (
                      <div className="flex items-center space-x-1 text-green-400 text-xs">
                        <CheckCircle className="w-3 h-3" />
                        <span>Certificate</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  className="w-full bg-green-400 text-black hover:bg-green-300 hacker-btn"
                  onClick={() => navigate(`/course/${course.id}`)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-green-400/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-400 mb-2">No courses found</h3>
            <p className="text-green-300/70">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
