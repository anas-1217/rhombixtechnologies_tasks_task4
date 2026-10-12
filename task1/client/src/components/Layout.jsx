import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="page">
      <Navbar />
      <main className="content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
