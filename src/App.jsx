import { useState } from 'react';
import LoginName from './pages/login';
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <LoginName />
    </>
  );
}

export default App;
