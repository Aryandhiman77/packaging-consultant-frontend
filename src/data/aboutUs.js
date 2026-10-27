const page = (slug, title, data) => ({ slug, title, ...data });

export const aboutUsPages = [
  page("consulting-approach", "Our Consulting Approach", {
    lead: "Good packaging consultation begins by listening before recommending.",
    intro: [
      "We want to understand your product, your customer, the marketplace and the condition that brought you to us. A startup developing its first package does not need the same opening conversation as an established company facing a seal failure, artwork transition or offshore supply problem.",
    ],
    callout: "Packaging decisions from the market backward",
    sections: [
      {
        heading: "Our normal decision path is:",
        items: [
          "Product, customer and competitive marketplace",
          "Wholesale, retail, e-commerce or combined sales channels",
          "Storage, distribution and customer use",
          "Product protection, barrier and functional requirements",
          "Package size, structure, closure and material",
          "Dieline, impact design and production-ready artwork",
          "Prepress, printing and tooling",
          "Sourcing, manufacturing and quality control",
          "Shipping, receiving, continuing supply and launch",
        ],
      },
      {
        heading: "How the conversation works",
        items: [
          "We introduce one issue at a time instead of presenting an overwhelming technical questionnaire.",
          "We explain why a decision matters before asking the client to choose.",
          "We separate known facts from items that still require testing, samples or specialist review.",
          "We preserve useful existing work rather than automatically starting over.",
          "We compare total project consequences, not only the first quoted unit price.",
          "We document decisions so artwork, specifications and manufacturing remain aligned.",
        ],
      },
    ],
    closingLead: "The project may use every stage of the process or only one.",
    closing: [
      "Consultation should expand only as the work requires. A client needing an existing-package review may not need a complete brand redesign; a client with approved artwork may need only prepress, manufacturing and quality-control support.",
      "Our role is to help define the correct next decision and keep that decision connected to what comes before and after it.",
    ],
    links: [
      ["Meet Our President and CEO", "/about-us/president-ceo"],
      ["Review Packaging Experience", "/about-us/packaging-experience"],
      ["Begin a Project Review", "/project-review/starting-point"],
      ["Contact Us With a General Question", "/#contact"],
    ],
  }),
  page("president-ceo", "Our President and CEO", {
    lead: "I’m Jay L. Cramblit, President and CEO of Packaging Consultants USA.",
    intro: [
      "My role is to lead the client conversation and keep packaging decisions connected from the marketplace through manufacturing, supply and launch.",
      "I do not approach a project as a catalog salesperson trying to fit every product into whatever package happens to be available.",
    ],
    callout: "A business owner’s view of packaging",
    sections: [
      {
        paragraphs: [
          "My background includes more than 29 years of packaging experience involving distribution, package development, import management, offshore production and U.S. packaging-company operations.",
          "Earlier business experience also shaped the way I look at packaging. I operated a gourmet cookie business in Miami and experienced the disruption that followed Hurricane Andrew.",
          "That experience made supply, production continuity, timing and the practical consequences of interrupted operations more than abstract business terms.",
          "Earlier in my career, I also worked in the securities industry as an Investment Banker/Stockbroker licensed as a Series 7, 24, 27 and 4 registrations. That financial and supervisory background contributes to the way I compare cost, risk, working capital, inventory and business consequences, although Packaging Consultants USA does not provide investment advice.",
        ],
      },
      {
        heading: "What I bring to the client conversation",
        items: [
          "Direct discussion with a lead consultant",
          "Experience connecting design decisions with production realities",
          "U.S. and offshore sourcing perspective",
          "Understanding of quantities, tooling, freight, inventory and supply",
          "A willingness to identify what is not yet known",
          "Coordination with specialized resources when the project requires them",
        ],
      },
    ],
    closing: [
      "The purpose of sharing this background is not to turn the page into a resume. It is to help you understand the perspective behind the consultation: packaging must protect and present the product, but it must also be manufacturable, financeable, deliverable and available when the business needs it.",
    ],
    links: [
      ["Review Our Consulting Approach", "/about-us/consulting-approach"],
      ["Review Packaging Experience", "/about-us/packaging-experience"],
      ["Start a Conversation About Your Project", "/project-review/starting-point"],
    ],
  }),
  page("packaging-experience", "Packaging Experience", {
    lead:
      "Packaging experience becomes useful when it helps answer the next practical question in your project.",
    intro: [
      "The question may be whether a film or foil structure can provide the required barrier, whether a zipper belongs in the seal area, whether digital printing fits the quantity, whether an offshore quotation includes the full delivered cost, or whether a recurring defect begins with the specification or the manufacturing process.",
    ],
    sections: [
      {
        heading: "Areas of packaging experience",
        items: [
          "Flexible packaging distribution and development",
          "Film and foil barrier structures",
          "Stand-up, side-gusset, quad-seal and box- or block-bottom packages",
          "Package dimensions, closures and functional requirements",
          "Manufacturer dielines and artwork coordination",
          "Graphic development, prepress and production readiness",
          "Digital, flexographic and gravure printing considerations",
          "Plates, cylinders and production tooling",
          "U.S. and offshore sourcing and import management",
          "Manufacturing approvals and quality-control coordination",
          "Shipping, receiving, inventory and continuing supply",
          "Packaging problems, specification reviews and corrective direction",
        ],
      },
      {
        heading: "How experience is applied",
        paragraphs: [
          "We do not begin by placing every capability in front of the client. We introduce the experience relevant to the present decision.",
          "If the product has no package, we begin with market and protection. If the artwork does not fit the structure, we begin with the correct dieline. If a shipment failed, we begin with facts, samples and records. If the price appears high, we compare equivalent specifications, quantities, tooling, freight, quality and inventory.",
        ],
      },
    ],
    closingLead: "No consultant should claim to replace every technical discipline.",
    closing: [
      "Food science, product formulation, regulatory approval, laboratory testing, engineering, legal review and specialized logistics may require qualified professionals in those fields. Packaging consultation helps identify and coordinate those needs while maintaining the packaging-development path.",
    ],
    links: [
      ["Explore U.S. / Offshore Capabilities", "/about-us/us-offshore-capabilities"],
      ["Explore Packaging Services", "/packaging-services/packaging-development"],
      ["Begin a Project Review", "/project-review/starting-point"],
    ],
  }),
  page("us-offshore-capabilities", "U.S. / Offshore Capabilities", {
    lead: "Should this package be manufactured in the United States or offshore?",
    intro: [
      "There is no responsible one-word answer. The correct comparison depends on specification, quantity, tooling, print quality, lead time, freight, working inventory, communication, quality control and the cost of interruption.",
    ],
    sections: [
      {
        heading: "U.S. manufacturing considerations",
        items: [
          "Potentially shorter production and transit times",
          "Easier shipment, communication and plant coordination",
          "Lower freight complexity for some projects",
          "Possible smaller economic quantities, depending on process",
          "Domestic tooling and printing capabilities",
          "Faster response when specifications or demand change",
        ],
      },
      {
        heading: "Offshore manufacturing considerations",
        items: [
          "Access to particular equipment, structures or high-volume economics",
          "Longer production, ocean transit and customs timelines",
          "Freight, duty, brokerage and inland delivery",
          "Larger minimums or inventory commitments in some cases",
          "Time-zone, language and documentation requirements",
          "Pre-shipment approval and quality-control planning",
        ],
      },
      {
        heading: "The comparison points",
        items: [
          "Are both manufacturers quoting the same material, barrier, dimensions and print?",
          "Are plates, cylinders, dies and other tooling included?",
          "What is the complete landed cost at the delivery location?",
          "How much inventory and working capital does each option require?",
          "What happens if the forecast changes or a shipment is delayed?",
          "How will repeat-order quality be controlled?",
        ],
      },
    ],
    closingLead:
      "Offshore is not automatically cheaper, and domestic is not automatically faster or better.",
    closing: [
      "We compare the complete supply decision for the specific project.",
      "A first production run may favor one source while mature repeat volume favors another. Some clients may also consider a primary and secondary supply strategy when specifications, quantities and tooling permit it.",
    ],
    links: [
      ["Start a Sourcing & Manufacturing Review", "/packaging-services/sourcing-manufacturing"],
      ["Explore Manufacturing Quality Control", "/packaging-services/manufacturing-quality-control"],
    ],
  }),
];

export const aboutUsBySlug = Object.fromEntries(
  aboutUsPages.map((item) => [item.slug, item]),
);
