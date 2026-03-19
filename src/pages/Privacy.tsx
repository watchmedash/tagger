import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display text-foreground mb-8">Privacy Policy</h1>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg">
              Last Updated: December 2024
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, update your profile, or contact us for support. This may include your name, email address, and viewing preferences.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services, personalize your experience, and communicate with you about updates and promotions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">3. Information Sharing</h2>
              <p>
                We do not sell or rent your personal information to third parties. We may share your information only in the following circumstances: with your consent, to comply with legal obligations, or to protect our rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">4. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">5. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can manage your cookie preferences through your browser settings.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">6. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information. You can update your account settings or contact us to exercise these rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">7. Children's Privacy</h2>
              <p>
                Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13 without parental consent.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">8. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">9. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy, please contact us at{" "}
                <a href="mailto:privacy@n4ked.top" className="text-primary hover:underline">
                  privacy@n4ked.top
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
