"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, ChevronDown, LoaderCircle, Send } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { CONTACT_EMAIL } from "@/data/projects";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/cn";
import { TOPIC_EVENT } from "./TopicLink";

type FormText = Dictionary["contact"]["form"];
type Fields = { name: string; org: string; email: string; phone: string; type: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: "", org: "", email: "", phone: "", type: "", message: "" };
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

function validate(f: Fields, t: FormText): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = t.required;
  if (!f.email.trim()) e.email = t.required;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = t.invalidEmail;
  if (f.phone.trim() && !/^\+?[\d\s()-]{7,20}$/.test(f.phone.trim())) e.phone = t.invalidPhone;
  if (!f.type) e.type = t.required;
  if (!f.message.trim()) e.message = t.required;
  return e;
}

export function ContactForm({ t }: { t: FormText }) {
  const uid = useId();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mailto" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const typeValues = t.types.map((x) => x.value);

  // Pre-select the inquiry type from ?topic=… or from TopicLink clicks on the same page.
  useEffect(() => {
    const pick = (topic: string | null) => {
      if (topic && typeValues.includes(topic)) setFields((f) => ({ ...f, type: topic }));
    };
    pick(new URLSearchParams(window.location.search).get("topic"));
    const onTopic = (e: Event) => pick((e as CustomEvent<string>).detail);
    window.addEventListener(TOPIC_EVENT, onTopic);
    return () => window.removeEventListener(TOPIC_EVENT, onTopic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(fields, t);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const typeLabel = t.types.find((x) => x.value === fields.type)?.label ?? fields.type;
    const subject = `SOUL — ${typeLabel} — ${fields.name}`;
    const lines = [
      `${t.name}: ${fields.name}`,
      `${t.org}: ${fields.org || "—"}`,
      `${t.email}: ${fields.email}`,
      `${t.phone}: ${fields.phone || "—"}`,
      `${t.type}: ${typeLabel}`,
      "",
      fields.message,
    ];

    if (!ACCESS_KEY) {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
      setStatus("mailto");
      return;
    }

    setStatus("sending");
    try {
      const botcheck = (formRef.current?.elements.namedItem("botcheck") as HTMLInputElement | null)?.checked ?? false;
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject,
          from_name: "SOUL Website",
          replyto: fields.email,
          name: fields.name,
          organization: fields.org,
          email: fields.email,
          phone: fields.phone,
          inquiry_type: typeLabel,
          message: fields.message,
          botcheck,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (!res.ok || !data.success) throw new Error("send failed");
      setStatus("sent");
      setFields(EMPTY);
    } catch {
      setStatus("error");
    }
  }

  const field = (k: keyof Fields) => ({
    id: `${uid}-${k}`,
    name: k,
    value: fields[k],
    onChange: set(k),
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${uid}-${k}-err` : undefined,
    className: cn(
      "peer w-full rounded-xl border bg-bg/60 px-4 py-3 text-fg outline-none transition-all placeholder:text-subtle focus:border-sky focus:ring-4 focus:ring-sky/15",
      errors[k] ? "border-rose-400" : "border-line",
    ),
  });

  const label = (k: keyof Fields, text: string, optional = false) => (
    <label htmlFor={`${uid}-${k}`} className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
      {text}
      {optional ? <span className="text-xs font-normal text-subtle">({t.optional})</span> : <span className="text-accent">*</span>}
    </label>
  );

  const error = (k: keyof Fields) =>
    errors[k] ? (
      <p id={`${uid}-${k}-err`} className="mt-1.5 text-xs text-rose-500" role="alert">
        {errors[k]}
      </p>
    ) : null;

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-6 shadow-soft sm:p-9">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" || status === "mailto" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[28rem] flex-col items-center justify-center text-center"
            role="status"
          >
            <span className="relative grid size-20 place-items-center rounded-full bg-sky/15 text-accent">
              <span className="animate-pulse-ring absolute inset-0 rounded-full border border-sky" />
              <CheckCircle2 className="size-10" />
            </span>
            <h3 className="mt-6 font-display text-2xl font-semibold">{status === "sent" ? t.successTitle : t.title}</h3>
            <p className="mt-2 max-w-sm text-muted">{status === "sent" ? t.successText : t.mailFallback}</p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-8 rounded-full border border-line-strong px-5 py-2.5 text-sm font-semibold transition-colors hover:border-sky hover:text-accent"
            >
              {t.again}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-5 sm:grid-cols-2"
          >
            <h3 className="font-display text-xl font-semibold sm:col-span-2">{t.title}</h3>
            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
            <div>
              {label("name", t.name)}
              <input type="text" autoComplete="name" {...field("name")} />
              {error("name")}
            </div>
            <div>
              {label("org", t.org, true)}
              <input type="text" autoComplete="organization" {...field("org")} />
            </div>
            <div>
              {label("email", t.email)}
              <input type="email" inputMode="email" autoComplete="email" dir="ltr" {...field("email")} className={cn(field("email").className, "rtl:text-right")} />
              {error("email")}
            </div>
            <div>
              {label("phone", t.phone, true)}
              <input type="tel" inputMode="tel" autoComplete="tel" dir="ltr" {...field("phone")} className={cn(field("phone").className, "rtl:text-right")} />
              {error("phone")}
            </div>
            <div className="sm:col-span-2">
              {label("type", t.type)}
              <div className="relative">
                <select {...field("type")} className={cn(field("type").className, "appearance-none pe-10", !fields.type && "text-subtle")}>
                  <option value="" disabled>
                    {t.typePlaceholder}
                  </option>
                  {t.types.map((o) => (
                    <option key={o.value} value={o.value} className="text-fg">
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute end-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
              </div>
              {error("type")}
            </div>
            <div className="sm:col-span-2">
              {label("message", t.message)}
              <textarea rows={5} placeholder={t.messagePlaceholder} {...field("message")} className={cn(field("message").className, "resize-y")} />
              {error("message")}
            </div>
            {status === "error" && (
              <p className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-600 sm:col-span-2 dark:text-rose-300" role="alert">
                {t.error}{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline" dir="ltr">
                  {CONTACT_EMAIL}
                </a>
              </p>
            )}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-sky to-[#0a6fd6] px-8 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgb(0_174_239/0.8)] transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70 sm:w-auto"
              >
                {status === "sending" ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" /> {t.sending}
                  </>
                ) : (
                  <>
                    {t.submit}
                    <Send className="size-4 transition-transform group-hover:-translate-y-0.5 rtl:-scale-x-100" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
