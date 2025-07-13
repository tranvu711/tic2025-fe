import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ComboCreator from './pages/ComboCreator';
import ComboManagement from './pages/ComboManagement';
import type { Page } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('combo-creator');

  const renderPage = () => {
    switch (currentPage) {
      case 'combo-creator':
        return <ComboCreator />;
      case 'combo-management':
        return <ComboManagement />;
      default:
        return <ComboCreator />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 ml-64">
        <div className="p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;