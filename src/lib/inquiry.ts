// Submits the project-inquiry form to the Supabase `submit-inquiry` edge function
// and exposes a tiny global event so any CTA on the site can open the modal.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export type InquiryInput = {
  name: string;
  email: string;
  company?: string;
  project_type?: string;
  /** General variant qualifier. */
  budget_range?: string;
  /** Founding variant: link to current site / social. */
  website?: string;
  /** Founding variant: how soon they can start. */
  timeline?: string;
  /** Founding variant: acknowledged the testimonial + case-study exchange. */
  case_study_consent?: boolean;
  message: string;
  /** Honeypot — must stay empty for real users. */
  company_website?: string;
};

export async function submitInquiry(input: InquiryInput): Promise<void> {
  if (!SUPABASE_URL || !ANON_KEY) {
    throw new Error("Form is not configured yet. Please email hello@vixlify.com.");
  }

  const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-inquiry`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({ ...input, source: window.location.pathname || "vixlify.com" }),
  });

  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    throw new Error(data?.error || "Something went wrong. Please try again.");
  }
}

/** Custom event used to open the InquiryModal from anywhere. */
export const OPEN_INQUIRY_EVENT = "vixlify:open-inquiry";

/** Call from any CTA to open the inquiry modal. */
export function openInquiry(): void {
  window.dispatchEvent(new CustomEvent(OPEN_INQUIRY_EVENT));
}
