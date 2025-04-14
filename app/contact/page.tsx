// app/contact/page.tsx
import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Neem Contact Op</h1>
      <ContactForm />
    </div>
  );
}
