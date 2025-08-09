export interface ContactCardProps {
  heading: string;
  children: React.ReactNode;
}

export interface ContactMapProps {
  src: string;
  className?: string;
  /** Optional iframe title override */
  title?: string;
  /** Map provider hint for styling tweaks (e.g., 'osm', 'google') */
  provider?: 'osm' | 'google';
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  isSubmitting: boolean;
  isSuccess: boolean;
  onReset: () => void;
}

export interface UseContactFormReturn {
  formData: ContactFormData;
  errors: ContactFormErrors;
  isValid: boolean;
  handleInputChange: (field: keyof ContactFormData, value: string) => void;
  handleSubmit: (
    onSubmit: (data: ContactFormData) => Promise<void>,
  ) => Promise<void>;
  resetForm: () => void;
  validateField: (
    field: keyof ContactFormData,
    value: string,
  ) => string | undefined;
}

export interface ContactPageState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}
