import "@/style/globals.css";
import "@/style/components/login.css";
import "@/style/components/sidebar.css";
import "@/style/components/topbar.css";
import "@/style/pages/dashboard.css";
import "@/style/pages/admin-users.css";
import "@/style/pages/clientes.css";
import { GlobalProvider } from "@/context/global"
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import FloatBar from "@/components/Floatbar";

export const metadata = {
  title: "Kong Vite App",
  description: "That's a next app created for Kong Vite.",
};

export default async function Layout({ children }) {
  return (

    <html lang="pt-br">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
      </head>
      <body className="dashBody" >
        <GlobalProvider>
          <Sidebar />
          <div className="layoutSize flexc">
            <Topbar />
            {children}
          </div>
          <FloatBar />
        </GlobalProvider>
      </body>
    </html>

  );
}
