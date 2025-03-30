import '../styles/globals.css';
// app/layout.js or app/page.js
import { Toaster } from 'react-hot-toast';
import Header from '../components/Header';



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

