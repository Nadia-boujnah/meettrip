import Header from "@/components/header.jsx";
import Footer from "@/components/ui/footer.jsx";
// import Footer from "@/components/Footer"; // << tu peux commenter ça pour l'instant

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
