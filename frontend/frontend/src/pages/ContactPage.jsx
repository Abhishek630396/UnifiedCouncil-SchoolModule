import { useState } from "react";
import { MapPin, Phone, Mail, School, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "../components/PageShell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

const ContactPage = () => {
  const [form, setForm] = useState({ firstName: "", lastName: "", school: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.phone || !form.email) {
      toast.error("Please fill in all required fields (marked *)");
      return;
    }
    if (!/^\d{10}$/.test(form.phone.replace(/[\s-]/g, ""))) {
      toast.error("Please enter a valid 10-digit contact number");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSent(true);
    toast.success("Message sent! Our team will contact you soon.");
  };

  return (
    <PageShell
      title="Contact Us"
      seoDescription="Contact Unified Council — Saleem Nagar, Malakpet, Hyderabad. Phone, WhatsApp and email support for students, parents and schools."
      testId="contact-page"
      badge={
        <div className="inline-flex items-center gap-2 bg-rose-100 border-2 border-rose-200 rounded-full px-4 py-2 mb-6">
          <MessageCircle className="w-4 h-4 text-rose-600" />
          <span className="text-sm font-black uppercase tracking-wider text-rose-700">We're Here to Help</span>
        </div>
      }
      heroTitle={
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 leading-tight">
          Get in{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500">Touch</span>
        </h1>
      }
      heroSubtitle="We'd love to hear from you — fill in the form and our team will get back to you shortly."
    >
      <section className="py-16 bg-white" data-testid="contact-section">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-10">
          {/* Contact info */}
          <div className="flex flex-col gap-5">
            <div className="bg-rose-50 border-2 border-rose-100 rounded-3xl p-6 flex gap-4" data-testid="contact-address-card">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 mb-1">Address</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Unified Council<br />#16-11-16/1/B, Saleem Nagar, Malakpet,<br />Hyderabad - 500036, Telangana, India.
                </p>
              </div>
            </div>

            <div className="bg-sky-50 border-2 border-sky-100 rounded-3xl p-6 flex gap-4" data-testid="contact-phone-card">
              <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 mb-1">Phone & WhatsApp</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Mobile: 9030007882, 6302902378, 9246336654<br />
                  Phone: 040-24557708, 24545862, 66139917<br />
                  WhatsApp: <a href="https://wa.me/919603064939" target="_blank" rel="noopener noreferrer" className="font-black text-green-600 hover:text-green-700" data-testid="contact-whatsapp-link">+91 96030 64939</a>
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-100 rounded-3xl p-6 flex gap-4" data-testid="contact-email-card">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 mb-1">E-Mail</h3>
                <p className="text-slate-600 text-sm">
                  <a href="mailto:exam@unifiedcouncil.com" className="font-black text-amber-600 hover:text-amber-700">exam@unifiedcouncil.com</a>
                </p>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-100 rounded-3xl p-6 flex gap-4" data-testid="contact-school-card">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <School className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 mb-1">Enquiry from Schools & Institutions</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Phone: +91 90300 07881 / 040-4014 7035<br />
                  E-Mail: <a href="mailto:support@unifiedcouncil.com" className="font-black text-green-600 hover:text-green-700">support@unifiedcouncil.com</a>
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-8" data-testid="contact-form-card">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16" data-testid="contact-success">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Message Sent!</h3>
                <p className="text-slate-600 mb-6">Thank you for reaching out to Unified Council.<br />Our team will contact you soon at the details you provided.</p>
                <Button variant="outline" onClick={() => { setSent(false); setForm({ firstName: "", lastName: "", school: "", phone: "", email: "", message: "" }); }} className="rounded-full font-bold border-2" data-testid="contact-send-another-btn">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="text-xl font-black text-slate-800 mb-1">Get in touch with us</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase">First Name *</label>
                    <Input value={form.firstName} onChange={update("firstName")} placeholder="First name" className="mt-1 rounded-xl border-2" data-testid="contact-first-name" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase">Last Name</label>
                    <Input value={form.lastName} onChange={update("lastName")} placeholder="Last name" className="mt-1 rounded-xl border-2" data-testid="contact-last-name" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase">School Name</label>
                  <Input value={form.school} onChange={update("school")} placeholder="Your school (optional)" className="mt-1 rounded-xl border-2" data-testid="contact-school-name" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase">Contact Number *</label>
                    <Input value={form.phone} onChange={update("phone")} placeholder="10-digit mobile" className="mt-1 rounded-xl border-2" data-testid="contact-phone" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase">Email ID *</label>
                    <Input type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" className="mt-1 rounded-xl border-2" data-testid="contact-email" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase">Message</label>
                  <Textarea value={form.message} onChange={update("message")} placeholder="How can we help?" rows={4} className="mt-1 rounded-xl border-2" data-testid="contact-message" />
                </div>
                <Button type="submit" className="rounded-full font-bold bg-rose-500 hover:bg-rose-600 py-6 text-base" data-testid="contact-submit-btn">
                  <Send className="w-4 h-4 mr-2" /> Send Message
                </Button>
                <p className="text-xs text-slate-400 text-center">Fields marked * are required.</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default ContactPage;
