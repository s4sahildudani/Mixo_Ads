import './globals.css';
import '../styles/components.css';

export const metadata = {
  title: 'Mixo Ads - Campaign Dashboard',
  description: 'Monitor and manage your advertising campaigns',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}