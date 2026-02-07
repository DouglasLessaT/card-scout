import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/logo.svg';

export default function VerifyToken() {
  const [token, setToken] = useState('');
  const { verifyToken, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const isRegistering = location.state?.type === 'register';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await verifyToken(token);
    
    if (success) {
      toast({
        title: 'Código verificado!',
        description: 'Autenticação confirmada.',
      });
      
      if (isRegistering) {
        navigate('/complete-profile');
      } else {
        navigate('/dashboard');
      }
    } else {
      toast({
        title: 'Código inválido',
        description: 'O código informado está incorreto.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img src={logo} alt="OracleCards" className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl">Verificação</CardTitle>
          <CardDescription>
            Digite o código de 6 dígitos enviado para seu email/telefone
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={token}
              onChange={(value) => setToken(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || token.length !== 6}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Verificar
                </>
              )}
            </Button>
            
            <Button variant="ghost" className="text-sm">
              Reenviar código
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
