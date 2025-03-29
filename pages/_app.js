// pages/_app.js
import '../styles/globals.css';
import { RecipeProvider } from '../context/RecipeContext';

function MyApp({ Component, pageProps }) {
  return (
    <RecipeProvider>
      <Component {...pageProps} />
    </RecipeProvider>
  );
}

export default MyApp;