import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Film, Tv, Users, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 md:px-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display text-foreground mb-8">About Us</h1>

          <div className="space-y-12">
            <section>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Welcome to N4ked, your ultimate destination for streaming movies and TV shows. We're passionate about bringing you the best entertainment experience, with a vast library of content from around the world.
              </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-secondary/30 rounded-lg p-6 border border-border">
                <Film className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Vast Movie Library</h3>
                <p className="text-muted-foreground">
                  Access thousands of movies across all genres, from blockbusters to indie gems.
                </p>
              </div>

              <div className="bg-secondary/30 rounded-lg p-6 border border-border">
                <Tv className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">TV Shows</h3>
                <p className="text-muted-foreground">
                  Binge-watch your favorite series with complete seasons and new episodes.
                </p>
              </div>

              <div className="bg-secondary/30 rounded-lg p-6 border border-border">
                <Users className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Community</h3>
                <p className="text-muted-foreground">
                  Join millions of viewers who trust N4ked for their entertainment needs.
                </p>
              </div>

              <div className="bg-secondary/30 rounded-lg p-6 border border-border">
                <Globe className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Global Content</h3>
                <p className="text-muted-foreground">
                  Discover content from different cultures and languages worldwide.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                At N4ked, we believe everyone deserves access to quality entertainment. Our mission is to provide a seamless streaming experience with a diverse catalog that caters to all tastes and preferences. Whether you're in the mood for action, comedy, drama, or documentaries, we've got you covered.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-display text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground">
                Have questions or feedback? We'd love to hear from you. Reach out to us at{" "}
                <a href="mailto:support@n4ked.top" className="text-primary hover:underline">
                  support@n4ked.top
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

export default About;
