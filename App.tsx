import React from 'react';
import Calculator from './components/Calculator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Calculator />
    </div>
  );
};

export default App;