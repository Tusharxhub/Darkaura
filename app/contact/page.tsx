"use client";

import React, {
    useState,
    useCallback,
} from "react";
import { addToast } from "@heroui/react";
import emailjs from "@emailjs/browser";

import { ContactFormData, ContactPageState } from "@/components/contact/types";
import { PageHeader } from "@/components/page-header";
import { ContactCard } from "@/components/contact/contact-card";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactMap } from "@/components/contact/contact-map";
import { DATA } from "@/data";

const EMAIL_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
};

// Mapping for clearer missing var messages
const EMAIL_ENV_VAR_LABELS: Record<keyof typeof EMAIL_CONFIG, string> = {
  serviceId: "NEXT_PUBLIC_EMAILJS_SERVICE_ID",
  templateId: "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID",
  publicKey: "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY",
};

function validateEmailConfig(cfg: typeof EMAIL_CONFIG): string[] {
  const issues: string[] = [];

  if (!cfg.serviceId) issues.push(`${EMAIL_ENV_VAR_LABELS.serviceId} is missing`);
  if (!cfg.templateId) issues.push(`${EMAIL_ENV_VAR_LABELS.templateId} is missing`);
  if (!cfg.publicKey) issues.push(`${EMAIL_ENV_VAR_LABELS.publicKey} is missing`);

  if (cfg.serviceId && !/^service_[A-Za-z0-9]+$/.test(cfg.serviceId)) {
    issues.push(`Service ID "${cfg.serviceId}" looks invalid (expected to start with 'service_')`);
  }
  if (cfg.templateId && !/^template_[A-Za-z0-9]+$/.test(cfg.templateId)) {
    issues.push(
      `Template ID "${cfg.templateId}" looks invalid (expected to start with 'template_'). Did you accidentally add an extra 't'?`,
    );
  }
  // Public keys vary; just basic length sanity check
  if (cfg.publicKey && cfg.publicKey.length < 10) {
    issues.push(`Public key "${cfg.publicKey}" seems too short.`);
  }

  return issues;
}

const ContactPage: React.FC = () => {
  const [state, setState] = useState<ContactPageState>({
    isSubmitting: false,
    isSuccess: false,
    error: null,
  });

  const handleSubmit = useCallback(
    async (formData: ContactFormData): Promise<void> => {
      setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

      const configIssues = validateEmailConfig(EMAIL_CONFIG);
      
  if (configIssues.length > 0) {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn("Email configuration issues:", configIssues);
        }
        addToast({
          title: "Email Setup Error",
          description: configIssues[0],
          color: "danger",
        });
        setState((prev) => ({ ...prev, isSubmitting: false }));

        return;
      }

      try {
        const templateParams = {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        };

        const response = await emailjs.send(
          EMAIL_CONFIG.serviceId!,
          EMAIL_CONFIG.templateId!,
          templateParams,
          EMAIL_CONFIG.publicKey!,
        );

        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.log("EmailJS send response:", response);
        }

        setState((prev) => ({ ...prev, isSuccess: true }));
        addToast({
          title: "Message Sent Successfully",
          description:
            "Thank you for your message! I'll get back to you soon.",
          color: "success",
        });
      } catch (error: any) {
        // EmailJS errors often have 'status' & 'text'
        let errorMessage = "Failed to send message. Please try again later.";
        const status = error?.status;
        const text = error?.text || (error instanceof Error ? error.message : "");
        
  if (status === 400) {
          errorMessage =
            "Email service rejected the request (400). Check that service ID, template ID, public key, and template variable names match exactly.";
        } else if (text) {
          errorMessage = text;
        }

        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
            console.error("EmailJS error:", { status, text, raw: error });
        }

        setState((prev) => ({ ...prev, error: errorMessage }));
        addToast({
          title: "Failed to Send Message",
          description: errorMessage,
          color: "danger",
        });
      } finally {
        setState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [],
  );

  const handleReset = useCallback(() => {
    setState({
      isSubmitting: false,
      isSuccess: false,
      error: null,
    });
  }, []);

  return (
    <section className="py-20">
      <PageHeader texts={DATA.morphingTexts.contact} />
      <div className="container mx-auto px-4">
        <ContactCard heading={DATA.contact.heading}>
          <ContactMap
            provider="osm"
            src={DATA.contact.location.mapSrc}
            title={`Map location for ${DATA.contact.location.address}`}
          />
          <div className="mb-8 -mt-2 text-center text-sm text-default-500 space-y-1">
            <p className="font-medium text-default-600">{DATA.contact.location.address}</p>
            {DATA.contact.location.largerMapUrl && (
              <a
                className="underline hover:text-primary transition-colors"
                href={DATA.contact.location.largerMapUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                View larger map
              </a>
            )}
          </div>
          <ContactForm
            isSubmitting={state.isSubmitting}
            isSuccess={state.isSuccess}
            onReset={handleReset}
            onSubmit={handleSubmit}
          />
        </ContactCard>

        {state.error && (
          <div className="mt-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-danger-700 text-sm">{state.error}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactPage;