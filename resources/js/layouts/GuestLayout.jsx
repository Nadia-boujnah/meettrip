import Header from "@/components/Header";
import Footer from "../components/ui/footer";


export default function GuestLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFFCF9] text-[#1B1B18]">
      {/* Header */}
      <Header />

      {/* Contenu de la page */}
      <main className="flex-1">
        {children}
      </main>
    {/* Footer */}
    <Footer />
      
    </div>
  );
}
