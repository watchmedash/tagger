import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is N4ked?",
    answer: "N4ked is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want."
  },
  {
    question: "How much does N4ked cost?",
    answer: "Watch N4ked on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from $6.99 to $22.99 a month. No extra costs, no contracts."
  },
  {
    question: "Where can I watch?",
    answer: "Watch anywhere, anytime. Sign in with your N4ked account to watch instantly on the web at n4ked.top from your personal computer or on any internet-connected device that offers the N4ked app, including smart TVs, smartphones, tablets, streaming media players and game consoles."
  },
  {
    question: "How do I cancel?",
    answer: "N4ked is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime."
  },
  {
    question: "What can I watch on N4ked?",
    answer: "N4ked has an extensive library of feature films, documentaries, TV shows, anime, award-winning originals, and more. Watch as much as you want, anytime you want."
  },
  {
    question: "Is N4ked good for kids?",
    answer: "The N4ked Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and movies in their own space. Kids profiles come with PIN-protected parental controls that let you restrict the maturity rating of content kids can watch and block specific titles you don't want kids to see."
  }
];

const FAQSection = () => {
  return (
    <section className="py-12 px-4 lg:px-12">
      <h2 className="text-2xl lg:text-3xl font-display tracking-wide text-foreground mb-8 text-center">
        Frequently Asked Questions
      </h2>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card/50 border border-border/50 rounded-lg px-4 overflow-hidden"
            >
              <AccordionTrigger className="text-left text-base lg:text-lg font-medium hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm lg:text-base pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
