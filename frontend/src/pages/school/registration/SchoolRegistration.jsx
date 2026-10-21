import SchoolHeader from "../components/SchoolHeader";
import Footer from "@/components/Footer";
import { SchoolRegistrationForm } from "./SchoolRegistrationForm";

export const SchoolRegistration = () => {

  return (
    <div className="min-h-screen bg-gradient-hero" data-testid="homepage">
      
      <SchoolHeader/>
      <main>
        <SchoolRegistrationForm />
        <Footer />
      </main>

      
    </div>
  )
}