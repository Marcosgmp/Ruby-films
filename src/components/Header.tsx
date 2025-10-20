import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('header.title')}</h1>
        
        <nav className="flex items-center space-x-4">
          <a href="/">{t('header.home')}</a>
          <a href="/movies">{t('header.movies')}</a>
          <LanguageSelector />
          <button>{t('header.login')}</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;