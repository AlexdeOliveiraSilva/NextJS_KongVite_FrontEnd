import { Inter } from "next/font/google";
import "@/style/globals.css";
import "@/style/components/sidebar.css";
import "@/style/components/topbar.css";
import "@/style/pages/dashboard.css";
import { GlobalProvider } from "@/context/global"
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kong Vite App",
  description: "That's a next app created for Kong Vite.",
};

export default function RootLayout({ children }) {
  return (
    <GlobalProvider>
      <html lang="pt-br">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        </head>
        <body className="flexr" style={{ alignItems: "flex-start", justifyContent: "flex-start", backgroundColor: 'var(--white-secondary)' }}>
          <Sidebar />
          <div className="flexc" style={{ width: "100%", height: "100%" }}>
            <Topbar />
            {children}
          </div>
        </body>
      </html>
    </GlobalProvider>
  );
}
