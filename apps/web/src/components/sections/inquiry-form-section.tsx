"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { SanityIcon } from "../elements/sanity-icon";
import { supabase } from "@/lib/supabase";

type InquiryFormSectionProps = any;

export function InquiryFormSection({
  title,
  description,
  inquiryLabel = "How can we help?",
  buttonText = "Send Inquiry",
  ctaSectionTitle = "Prefer a different way to connect?",
  buttons,
}: InquiryFormSectionProps) {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: serviceParam ? `I'm interested in: ${serviceParam}` : "",
    consent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.message
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (!formData.consent) {
      setError("Please agree to the Privacy Policy and Terms of Conditions");
      return;
    }

    setError("");

    const { error } = await supabase.from("inquiries").insert({
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      consented: formData.consent,
    });

    if (error) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ fullName: "", email: "", phone: "", message: "", consent: false });
    }, 3000);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center mb-12">
          {title && (
            <h2 className="text-balance font-semibold text-3xl leading-tight md:text-4xl lg:text-5xl text-foreground">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="rounded-2xl border border-border/30 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900/50 p-6 md:p-8 shadow-lg shadow-zinc-500/5">
            {submitted ? (
              <div className="text-center py-12">
                <h3 className="mb-2 text-xl font-semibold text-green-500">
                  Thank you for your inquiry!
                </h3>
                <p className="text-muted-foreground">
                  We&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <span className="mb-2 block text-sm font-medium">
                    Full Name
                  </span>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <span className="mb-2 block text-sm font-medium">
                    Email Address
                  </span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <span className="mb-2 block text-sm font-medium">
                    Phone Number
                  </span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <span className="mb-2 block text-sm font-medium">
                    {inquiryLabel}
                  </span>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    rows={5}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground resize-none"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => handleChange("consent", e.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 rounded border-input"
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">
  I agree to the{" "}
  
  <Link
    href="/privacy-policy"
    className="underline hover:text-foreground transition-colors"
  >
    Privacy Policy
  </Link>

  {" "}and{" "}

  <Link
    href="/terms-of-service"
    className="underline hover:text-foreground transition-colors"
  >
    Terms and Conditions
  </Link>
</span>
                </label>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full rounded-lg bg-foreground text-background px-6 py-3 font-medium hover:opacity-80 transition-all"
                >
                  {buttonText}
                </button>
                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center space-y-6">
            {ctaSectionTitle && (
              <h3 className="text-xl font-semibold text-foreground">
                {ctaSectionTitle}
              </h3>
            )}
            {buttons && buttons.length > 0 && (
              <div className="space-y-4">
                {buttons.map((button: any, index: number) => (
                  <a
                    key={index}
                    href={button.href || "#"}
                    target={button.openInNewTab ? "_blank" : undefined}
                    rel={button.openInNewTab ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4 hover:border-foreground transition-all"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-foreground/10 text-foreground">
                      {button.icon && (
                        <SanityIcon icon={button.icon} className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {button.text}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
