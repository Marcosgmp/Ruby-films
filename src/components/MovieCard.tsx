import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MovieCardProps {
  id: string;
  title: string;
  synopsis: string;
  year: number;
  duration: number;
  director: string;
  posterUrl?: string;
}

export function MovieCard({ id, title, synopsis, year, duration, director, posterUrl }: MovieCardProps) {
  return (
    <Link to={`/movie/${id}`}>
      <Card className="group overflow-hidden bg-gradient-card border-border hover:border-primary transition-all duration-300 hover:shadow-glow hover:scale-[1.02]">
        <div className="aspect-[2/3] overflow-hidden bg-secondary">
          {posterUrl ? (
            <img 
              src={posterUrl} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Calendar className="w-16 h-16 opacity-20" />
            </div>
          )}
        </div>
        
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {synopsis}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {year}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {duration}min
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Dir: {director}
          </p>
        </div>
      </Card>
    </Link>
  );
}
