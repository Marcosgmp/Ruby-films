import LanguageSelector from './LanguageSelector';
import { Link, useNavigate } from 'react-router-dom';
import { Gem, User, LogOut, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-gradient-hero backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Gem className="w-8 h-8 text-red-500" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {t('header.title')}
              </span>
            </Link>

            <nav className="flex items-center gap-4">
              <LanguageSelector />
              
              {isAuthenticated ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/add-movie')}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {t('movies.add_movie')}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/profile')}
                    className="gap-2"
                  >
                    <User className="w-4 h-4" />
                    {user?.name}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('header.logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/login')}
                  >
                    {t('header.login')}
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate('/register')}
                  >
                    {t('header.register')}
                  </Button>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 {t('header.title')}. {t('movies.title')}.</p>
        </div>
      </footer>
    </div>
  );
}