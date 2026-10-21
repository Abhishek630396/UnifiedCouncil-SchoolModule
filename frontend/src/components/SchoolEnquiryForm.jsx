import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "@/services/apiBaseUrl";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";

const initialForm = {
  school: "",
  schoolAddress: "",
  contactPerson: "",
  designation: "",
  phone: "",
  email: "",
  city: "",
  message: "",
  sourceOfInformation: "",
};

const sanitizeLettersValue = (value, { allowAmpersand = false } = {}) => {
  const allowedPattern = allowAmpersand ? /[^A-Za-z0-9\s.,&'()/-]/g : /[^A-Za-z\s.'-]/g;
  return String(value ?? "").replace(/\s+/g, " ").replace(allowedPattern, "").trim();
};

const sanitizeDigitValue = (value, maxLength) => String(value ?? "").replace(/\D/g, "").slice(0, maxLength);
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const validateField = (name, value) => {
  const trimmed = String(value ?? "").trim();

  if (name === "school") {
    if (!trimmed) return "This field is required.";
  }

  if (name === "contactPerson") {
    if (!trimmed) return "This field is required.";
    if (!/^[A-Za-z][A-Za-z. '-]*$/i.test(trimmed)) {
      return "Please enter a valid contact person name.";
    }
  }

  if (name === "designation") {
    if (!trimmed) return "This field is required.";
  }

  if (name === "phone") {
    if (!trimmed) return "This field is required.";
    if (!/^\d{10}$/.test(trimmed)) return "Please enter a valid 10-digit phone number.";
  }

  if (name === "email") {
    if (!trimmed) return "This field is required.";
    if (!emailRegex.test(trimmed)) return "Please enter a valid email address.";
  }

  return "";
};

function FormField({ label, name, value, onChange, placeholder, testid, type = "text", error, inputMode, maxLength }) {
  return (
    <div className="min-w-0">
      <label htmlFor={testid} className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-600">{label}</label>
      <Input
        id={testid}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        className="h-11 w-full min-w-0 rounded-xl border-2 border-slate-100 text-sm focus:border-sky-300"
        data-testid={testid}
      />
      {error ? <p className="mt-1 text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

export default function SchoolEnquiryForm({
  className = "rounded-3xl border-2 border-slate-100 bg-white p-6 shadow-sm md:p-8",
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let nextValue = value;

    if (name === "school") nextValue = sanitizeLettersValue(value, { allowAmpersand: true });
    else if (name === "contactPerson" || name === "designation" || name === "city") nextValue = sanitizeLettersValue(value);
    else if (name === "phone") nextValue = sanitizeDigitValue(value, 10);

    setForm((current) => ({ ...current, [name]: nextValue }));
    setErrors((current) => ({ ...current, [name]: validateField(name, nextValue) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    ["school", "contactPerson", "designation", "phone", "email"].forEach((field) => {
      const message = validateField(field, form[field]);
      if (message) nextErrors[field] = message;
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      toast.error("Please correct the highlighted field(s).");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/enquiries`,
        {
          schoolName: form.school,
          contactPersonName: form.contactPerson,
          principalName: form.contactPerson,
          designation: form.designation,
          schoolAddress: form.schoolAddress,
          phone: form.phone,
          email: form.email,
          city: form.city,
          anythingElse: form.message,
          sourceOfInformation: form.sourceOfInformation,
        }
      );

      if (response.data?.success) {
        const enquiry = response.data?.data || {};
        navigate("/school-enquiry-success", {
          state: {
            schoolName: form.school.trim(),
            principalName: form.contactPerson.trim(),
            enquiryId: enquiry.Id ?? null,
            submittedAt: enquiry.CreatedAt || new Date().toISOString(),
          },
        });
      } else {
        toast.error(response.data?.message || "Failed to submit enquiry.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      data-testid="schools-enquiry-form"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Name of the School *" name="school" value={form.school} onChange={handleChange} placeholder="Enter your school name" testid="input-school" error={errors.school} />
        <FormField label="Contact Person Name *" name="contactPerson" value={form.contactPerson} onChange={handleChange} placeholder="Enter contact person name" testid="input-contact-person" error={errors.contactPerson} />
        <FormField label="Designation *" name="designation" value={form.designation} onChange={handleChange} placeholder="Principal / Teacher in-charge / Coordinator" testid="input-designation" error={errors.designation} />
        <FormField label="Contact Person Mobile No. *" name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" testid="input-phone" error={errors.phone} inputMode="numeric" maxLength={10} />
        <FormField label="Email ID *" name="email" value={form.email} onChange={handleChange} placeholder="school@example.com" testid="input-email" type="email" error={errors.email} />
        <FormField label="City" name="city" value={form.city} onChange={handleChange} placeholder="Enter city" testid="input-city" />
      </div>
      <div className="mt-4">
        <label htmlFor="input-school-address" className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-600">School Address</label>
        <Textarea
          id="input-school-address"
          name="schoolAddress"
          value={form.schoolAddress}
          onChange={handleChange}
          placeholder="Enter the complete school address"
          rows={2}
          className="rounded-xl border-2 border-slate-100 focus:border-sky-300"
          data-testid="input-school-address"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="input-message" className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-600">Your Message</label>
        <Textarea
          id="input-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Which Olympiads are you interested in? Preferred exam window?"
          rows={3}
          className="rounded-xl border-2 border-slate-100 focus:border-sky-300"
          data-testid="input-message"
        />
      </div>
      <fieldset className="mt-5">
        <legend className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-600">Source of Information</legend>
        <RadioGroup
          value={form.sourceOfInformation}
          onValueChange={(value) => setForm((current) => ({ ...current, sourceOfInformation: value }))}
          className="grid grid-cols-2 gap-2 sm:grid-cols-3"
          data-testid="input-source-of-information"
        >
          {["Google", "Facebook", "Instagram", "Others", "Previous School"].map((source) => (
            <label
              key={source}
              htmlFor={`source-${source.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-sky-300 hover:bg-sky-50"
            >
              <RadioGroupItem
                id={`source-${source.toLowerCase().replace(/\s+/g, "-")}`}
                value={source}
                data-testid={`source-option-${source.toLowerCase().replace(/\s+/g, "-")}`}
              />
              {source}
            </label>
          ))}
        </RadioGroup>
      </fieldset>
      <Button
        type="submit"
        disabled={submitting}
        className="mt-5 w-full rounded-full bg-slate-900 py-6 font-black text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        data-testid="submit-enquiry"
      >
        {submitting ? "Sending..." : <>Send Enquiry<ArrowRight className="ml-2 h-4 w-4" /></>}
      </Button>
      <p className="mt-3 text-center text-xs font-semibold text-slate-500">
        We respect your privacy. Your details will only be used to respond to your enquiry.
      </p>
      <p className="mt-2 text-center text-xs font-medium text-slate-500">
        For school authorities, teachers and staff members only.
      </p>
    </form>
  );
}
