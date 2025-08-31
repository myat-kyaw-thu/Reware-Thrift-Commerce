"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone
} from "lucide-react";

export const ContactSection = () => {
  return (
    <section id="contact" className="section-spacing relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="animate-fade-in">
            <h2 className="text-4xl font-display font-light text-foreground mb-8">
              Get in <span className="font-semibold">Touch</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Have questions about our products or need assistance with your order?
              We&apos;re here to help you find exactly what you&apos;re looking for.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 cursor-pointer">
                <div className="p-3 bg-primary/10 rounded-lg transition-all duration-300">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Email</p>
                  <p className="text-muted-foreground">support@reware.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 cursor-pointer">
                <div className="p-3 bg-primary/10 rounded-lg transition-all duration-300">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Phone</p>
                  <p className="text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 cursor-pointer">
                <div className="p-3 bg-primary/10 rounded-lg transition-all duration-300">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Address</p>
                  <p className="text-muted-foreground">123 Commerce St, City, ST 12345</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="animate-slide-up bg-card border-border/50">
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      First Name
                    </label>
                    <Input placeholder="John" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Last Name
                    </label>
                    <Input placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Email
                  </label>
                  <Input type="email" placeholder="john@example.com" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Subject
                  </label>
                  <Input placeholder="How can we help you?" />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Message
                  </label>
                  <Textarea
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-32 resize-none"
                  />
                </div>

                <Button className="w-full font-medium">
                  Send Message
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};