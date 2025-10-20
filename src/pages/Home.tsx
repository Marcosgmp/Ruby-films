import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MovieCard } from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Movie {
  id: string;
  title: string;
  synopsis: string;
  year: number;
  duration: number;
  director: string;
  poster_url?: string;
}

// Categorias traduzíveis
const CATEGORIES = ['action', 'drama', 'romance', 'sci_fi', 'comedy'];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [mostSearchedMovies, setMostSearchedMovies] = useState<Movie[]>([]);
  const [moviesByCategory, setMoviesByCategory] = useState<Record<string, Movie[]>>({});
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  
  const { t } = useTranslation(); // ✅ Hook de tradução

  useEffect(() => {
    loadHomeData();
  }, []);

  async function loadHomeData() {
    setIsLoading(true);
    try {
      const [recentRes, mostSearchedRes, ...categoryRes] = await Promise.all([
        api.getRecentMovies(10),
        api.getMostSearchedMovies(10),
        ...CATEGORIES.map(cat => api.getMoviesByCategory(cat, 10))
      ]);

      if (recentRes.data) setRecentMovies(recentRes.data as Movie[]);
      if (mostSearchedRes.data) setMostSearchedMovies(mostSearchedRes.data as Movie[]);

      const categoriesData: Record<string, Movie[]> = {};
      CATEGORIES.forEach((cat, index) => {
        if (categoryRes[index]?.data) {
          categoriesData[cat] = categoryRes[index].data as Movie[];
        }
      });
      setMoviesByCategory(categoriesData);
    } catch (error) {
      toast.error(t('errors.network_error')); // ✅ Traduzido
    }
    setIsLoading(false);
  }

  async function handleSearch() {
    if (!searchQuery && !selectedCategory) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const response = await api.searchMovies(searchQuery, selectedCategory);
    
    if (response.data) {
      setSearchResults(response.data as Movie[]);
    } else {
      toast.error(t('home.search_error')); // ✅ Traduzido
    }
    setIsSearching(false);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSearchResults([]);
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {t('header.title')} {/* ✅ Traduzido */}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t('home.hero_description')} {/* ✅ Traduzido */}
        </p>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('home.search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder={t('home.category_filter')} /> {/* ✅ Traduzido */}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">{t('home.all_categories')}</SelectItem> {/* ✅ Traduzido */}
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {t(`categories.${cat}`)} {/* ✅ Traduzido */}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={isSearching}>
              {t('common.search')} {/* ✅ Traduzido */}
            </Button>
          </div>
          {(searchQuery || selectedCategory) && (
            <Button variant="ghost" size="sm" onClick={clearSearch}>
              {t('home.clear_search')} {/* ✅ Traduzido */}
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] bg-secondary rounded-t-lg" />
              <div className="p-4 bg-card rounded-b-lg space-y-2">
                <div className="h-6 bg-secondary rounded" />
                <div className="h-4 bg-secondary rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : searchResults.length > 0 || searchQuery || selectedCategory ? (
        <section>
          <h2 className="text-3xl font-bold mb-6 text-primary">
            {t('home.search_results')} {/* ✅ Traduzido */}
          </h2>
          {searchResults.length === 0 ? (
            <p className="text-muted-foreground text-center py-10">
              {t('movies.no_movies_found')} {/* ✅ Traduzido */}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {searchResults.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  synopsis={movie.synopsis}
                  year={movie.year}
                  duration={movie.duration}
                  director={movie.director}
                  posterUrl={movie.poster_url}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Recent Movies */}
          {recentMovies.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-6 text-secondary">
                {t('home.recently_added')} {/* ✅ Traduzido */}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {recentMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    synopsis={movie.synopsis}
                    year={movie.year}
                    duration={movie.duration}
                    director={movie.director}
                    posterUrl={movie.poster_url}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Most Searched */}
          {mostSearchedMovies.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-6 text-primary">
                {t('home.most_searched')} {/* ✅ Traduzido */}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {mostSearchedMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    synopsis={movie.synopsis}
                    year={movie.year}
                    duration={movie.duration}
                    director={movie.director}
                    posterUrl={movie.poster_url}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Categories */}
          {CATEGORIES.map(category => (
            moviesByCategory[category]?.length > 0 && (
              <section key={category}>
                <h2 className="text-3xl font-bold mb-6 capitalize">
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    {t(`categories.${category}`)} {/* ✅ Traduzido */}
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {moviesByCategory[category].map((movie) => (
                    <MovieCard
                      key={movie.id}
                      id={movie.id}
                      title={movie.title}
                      synopsis={movie.synopsis}
                      year={movie.year}
                      duration={movie.duration}
                      director={movie.director}
                      posterUrl={movie.poster_url}
                    />
                  ))}
                </div>
              </section>
            )
          ))}

          {recentMovies.length === 0 && mostSearchedMovies.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                {t('home.no_movies_message')} {/* ✅ Traduzido */}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}