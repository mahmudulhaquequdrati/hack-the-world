import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Terminal, 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  Mail,
  Shield,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 2000);
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return 'bg-red-400';
    if (strength <= 3) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden flex items-center justify-center py-8">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="matrix-rain"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 text-green-400 hover:bg-green-400/10"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="bg-black/90 border-green-400 terminal-window">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full border border-green-400/50 bg-green-400/10">
                <Terminal className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-green-400">
              Join the Academy
            </CardTitle>
            <p className="text-green-300/70">
              Create your account to start your cybersecurity journey
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-green-400 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-black border-green-400/30 text-green-400 placeholder:text-green-400/50 focus:border-green-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-400 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-black border-green-400/30 text-green-400 placeholder:text-green-400/50 focus:border-green-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-green-400 flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="bg-black border-green-400/30 text-green-400 placeholder:text-green-400/50 focus:border-green-400 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-green-400/70 hover:text-green-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded ${
                            i < passwordStrength ? getStrengthColor(passwordStrength) : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${
                      passwordStrength <= 2 ? 'text-red-400' : 
                      passwordStrength <= 3 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      Password strength: {getStrengthText(passwordStrength)}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-green-400 flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="bg-black border-green-400/30 text-green-400 placeholder:text-green-400/50 focus:border-green-400 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-green-400/70 hover:text-green-400"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-400 text-xs">Passwords do not match</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="text-green-400 text-xs flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Passwords match
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))}
                  className="border-green-400 data-[state=checked]:bg-green-400 data-[state=checked]:text-black"
                />
                <Label htmlFor="terms" className="text-sm text-green-300/70">
                  I agree to the{' '}
                  <button type="button" className="text-green-400 hover:text-green-300 underline">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-green-400 hover:text-green-300 underline">
                    Privacy Policy
                  </button>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-400 text-black hover:bg-green-300 hacker-btn font-bold"
                disabled={isLoading || !formData.agreeToTerms || formData.password !== formData.confirmPassword}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Join the Academy
                  </>
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-green-300/70 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-green-400 hover:text-green-300 underline"
                >
                  Sign In
                </button>
              </p>
            </div>

            {/* Terminal-style footer */}
            <div className="border-t border-green-400/30 pt-4">
              <div className="font-mono text-xs text-green-400/70">
                <div>$ useradd {formData.name || 'newagent'}</div>
                <div>$ passwd {formData.name || 'newagent'}</div>
                <div>Creating secure profile...</div>
                <div className="flex items-center">
                  <span>Status: </span>
                  <span className="ml-2 text-green-400">Ready for deployment</span>
                  <span className="terminal-cursor ml-1">|</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
