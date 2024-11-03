import './App.css'
import Canvas from './Canvas'
import { useEffect } from 'react'
import { authenticateUser, onAuthChange } from './authService'

function App() {
  useEffect(() => {
    const initialiseAuth = async () => {
      const user = await authenticateUser();
      if (user) {
        console.log('User authenticated with UID:', user.uid);
      }
    };

    onAuthChange((user) => {
      if (user) {
        console.log('User signed in:', user.uid);
      } else {
        console.log('User signed out');
      }
    });

    initialiseAuth();
  }, []);

  return (
    <>
      <div>
        <h1>Pixel Art Editor</h1>
        <Canvas />
      </div>
    </>
  )
}

export default App