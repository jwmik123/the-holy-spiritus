"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

type ContactFormData = {
  name: string;
  email: string;
  phoneNumber: string;
  subject: "Samenwerken" | "Proeverij/Rondleiding" | "Overige";
  message: string;
};

const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    subject: "Overige",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send the data to our API endpoint
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          onderwerp: formData.subject,
          message: formData.message,
          subject: formData.subject, // Keeping for backward compatibility
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          "Uw bericht is succesvol verzonden! Wij nemen zo spoedig mogelijk contact met u op."
        );
        // Reset form after successful submission
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          subject: "Overige",
          message: "",
        });
      } else {
        throw new Error(result.error || "Er is iets misgegaan");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Er is iets misgegaan. Probeer het later opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="w-full bg-primary text-white py-16 px-4 md:px-8"
      id="contact"
    >
      <div className="container mx-auto flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/3">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Neem contact op
          </h1>
          <h3 className="text-xl md:text-2xl font-light">
            Wil je iets weten, proeven of doen?
          </h3>
        </div>

        <div className="w-full md:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Naam <span className="text-red-300">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white p-2 focus:outline-none text-white placeholder-white/70"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email <span className="text-red-300">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white p-2 focus:outline-none text-white placeholder-white/70"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium mb-1"
              >
                Telefoonnummer <span className="text-red-300">*</span>
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white p-2 focus:outline-none text-white placeholder-white/70"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium mb-1"
              >
                Onderwerp <span className="text-red-300">*</span>
              </label>
              <select
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white p-2 focus:outline-none text-white"
              >
                <option value="Samenwerken" className="bg-primary">
                  Samenwerken
                </option>
                <option value="Proeverij/Rondleiding" className="bg-primary">
                  Proeverij/Rondleiding
                </option>
                <option value="Overige" className="bg-primary">
                  Overige
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium mb-1"
              >
                Bericht <span className="text-red-300">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white p-2 focus:outline-none text-white placeholder-white/70"
              />
            </div>

            <Button
              type="submit"
              className="bg-white text-primary hover:bg-white/90 px-6 py-3 font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verzenden..." : "Verstuur"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
