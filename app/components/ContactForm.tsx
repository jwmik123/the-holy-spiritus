"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Contact Formulier</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Naam <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium mb-1"
            >
              Telefoonnummer <span className="text-red-500">*</span>
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              Onderwerp <span className="text-red-500">*</span>
            </label>
            <select
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-primary focus:border-primary"
            >
              <option value="Samenwerken">Samenwerken</option>
              <option value="Proeverij/Rondleiding">
                Proeverij/Rondleiding
              </option>
              <option value="Overige">Overige</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Bericht <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verzenden..." : "Verstuur"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
