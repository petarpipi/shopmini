import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { isEmail } from "../lib/commerce";
import { PageIntro } from "../components/UI";
import { usePageMeta } from "../lib/usePageMeta";
const blank = { name: "", email: "", subject: "", message: "" };
type ContactFields = typeof blank;
export function validateContact(values: ContactFields) {
  const errors: Partial<Record<keyof ContactFields, string>> = {};
  for (const key of Object.keys(values) as (keyof ContactFields)[])
    if (!values[key].trim()) errors[key] = "Please complete this field.";
  if (values.email && !isEmail(values.email))
    errors.email = "Enter a valid email address.";
  if (values.message.trim() && values.message.trim().length < 10)
    errors.message = "Please write at least 10 characters.";
  return errors;
}
export default function Contact() {
  const [values, setValues] = useState({ ...blank });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFields, string>>
  >({});
  const [done, setDone] = useState(false);
  usePageMeta("Contact");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = validateContact(values);
    setErrors(next);
    // Focus follows on-screen order, not the order errors were added.
    const first = (Object.keys(blank) as (keyof ContactFields)[]).find(
      (key) => next[key],
    );
    if (first) {
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setDone(true);
    setValues({ ...blank });
  };
  const change = (field: keyof ContactFields, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };
  return (
    <div className="container contact-page">
      <PageIntro
        eyebrow="A CONVERSATION STARTS WITH HELLO"
        title="A little note to AURA."
        text="Questions, thoughts, or a moment of curiosity. Explore how a considered contact experience can feel."
      />
      <div className="contact-layout">
        <aside>
          <MessageCircle size={30} strokeWidth={1} />
          <h2>We’re all ears.</h2>
          <p>
            This form is a portfolio demonstration. Please use sample
            information to try it.
          </p>
          <div className="contact-note">
            <span className="eyebrow">GOOD TO KNOW</span>
            <p>
              Messages stay in this page’s temporary memory. They are not
              delivered, saved, or transmitted to any service.
            </p>
          </div>
          <Link className="arrow-link" to="/about">
            A little more about AURA <ArrowRight size={17} />
          </Link>
        </aside>
        <div className="contact-form-card">
          {done ? (
            <div className="contact-success" role="status">
              <Check size={34} strokeWidth={1} />
              <h2>A note, beautifully demonstrated.</h2>
              <p>
                The form was validated successfully. This is a demo success
                state: your message was not sent, and the fields have been
                cleared.
              </p>
              <button
                className="button button-outline"
                onClick={() => setDone(false)}
              >
                Try another demo message
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={submit}>
              <span className="eyebrow">DEMONSTRATION CONTACT FORM</span>
              <p className="form-intro">
                All fields are required. Please use fictional details.
              </p>
              <div className="form-grid">
                {(["name", "email", "subject", "message"] as const).map(
                  (field) => {
                    const id = `contact-${field}`;
                    const label =
                      field === "name"
                        ? "Your name"
                        : field === "email"
                          ? "Email address"
                          : field === "subject"
                            ? "Subject"
                            : "Your message";
                    return (
                      <div
                        className={`form-field ${field === "message" || field === "subject" ? "full-width" : ""}`}
                        key={field}
                      >
                        <label htmlFor={id}>
                          {label} <span aria-hidden="true">*</span>
                        </label>
                        {field === "message" ? (
                          <textarea
                            id={id}
                            value={values[field]}
                            onChange={(event) =>
                              change(field, event.target.value)
                            }
                            rows={5}
                            maxLength={2000}
                            required
                            aria-invalid={Boolean(errors[field])}
                            aria-describedby={
                              errors[field] ? `${id}-error` : undefined
                            }
                            placeholder="A little thought, a question, a hello…"
                          />
                        ) : (
                          <input
                            id={id}
                            type={field === "email" ? "email" : "text"}
                            value={values[field]}
                            onChange={(event) =>
                              change(field, event.target.value)
                            }
                            maxLength={160}
                            required
                            autoComplete={
                              field === "name"
                                ? "name"
                                : field === "email"
                                  ? "email"
                                  : "off"
                            }
                            aria-invalid={Boolean(errors[field])}
                            aria-describedby={
                              errors[field] ? `${id}-error` : undefined
                            }
                          />
                        )}
                        {errors[field] && (
                          <p
                            className="field-error"
                            id={`${id}-error`}
                            role="alert"
                          >
                            {errors[field]}
                          </p>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
              <button className="button" type="submit">
                Preview demo message <ArrowRight size={17} />
              </button>
              <p className="fine-print">
                No message will be sent. This is a local interactive
                demonstration.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
