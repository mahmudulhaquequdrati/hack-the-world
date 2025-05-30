import { Header } from "@/components/common/Header";
import Footer from "@/components/landing/Footer";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const Layout = ({
  children,
  showHeader = true,
  showFooter = true,
}: LayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-green-400 flex flex-col">
      {showHeader && <Header navigate={navigate} />}

      <main className="flex-1">{children}</main>

      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
