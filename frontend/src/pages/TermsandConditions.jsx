import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import TermsAndConditionsContent from "../components/TermsAndConditionsContent";
import { Button } from "../components/ui/button";

function TermsandConditions() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo;
  const registerState = location.state?.registerState;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="https://customer-assets.emergentagent.com/job_kids-edu-new/artifacts/jpg6s12y_logo%20%281%29.png"
              alt="Unified Council Logo"
              className="h-12 w-auto object-contain"
            />
            <div>
              <h1 className="text-lg font-black text-slate-800">Unified Council</h1>
              <p className="text-xs text-slate-500">Olympiads Terms & Conditions</p>
            </div>
          </Link>
          <Button
            variant="outline"
            onClick={() =>
              navigate(returnTo || -1, {
                state: registerState
                  ? {
                      fromTerms: true,
                      ...registerState,
                    }
                  : undefined,
              })
            }
            className="rounded-full border-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 md:p-10">
          <h2 className="text-2xl font-black text-slate-900">Olympiads Terms & Conditions</h2>
          <div className="mt-8">
            <TermsAndConditionsContent />
          </div>
        </div>
      </main>
    </div>
  );
}

export default TermsandConditions;
