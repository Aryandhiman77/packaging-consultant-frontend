const projectPath = (slug) => `/projects/${slug}`;
const reviewPath = (slug) => `/project-review/${slug}`;
const servicePath = (slug) => `/packaging-services/${slug}`;

export const projects = [
  {
    slug: "packaging-starts-here",
    title: "Packaging Starts Here",
    intro: [
      "Every Packaging Project has a Different Starting Point.",
      "You may have a product idea without a package, an existing package that needs improvement, a design ready for production, a supply problem or a failure that must be understood before another order is placed.",
    ],
    groups: [
      {
        heading: "Where is your project today?",
        items: [
          "New Product – New Package",
          "Existing Package Review",
          "Package Redesign",
          "Sourcing & Manufacturing",
          "Packaging Problem or Failure",
          "Cost, Supply or Quality",
        ],
      },
    ],
    body: [
      "Choosing the project type does not assume the answer. It allows us to begin with the condition that brought you here, identify what is already known, and avoid restarting work that has already been completed correctly.",
    ],
    links: [
      ["Contact Us With a General Question", "/contact-us"],
    ],
  },
  {
    slug: "product-no-packaging",
    title: "Have Product – No Packaging",
    intro: [
      "“I have a product idea, but no package.”",
      "That is a good place to begin because the package has not yet been limited by a premature material, structure or manufacturer decision.",
      "We start with the product, customer and marketplace. We then work through protection, size, use, structure, design, manufacturing and supply in the order the decisions depend on one another.",
    ],
    groups: [
      {
        heading: "What we need to understand first",
        items: [
          "What is the product, and how developed is it?",
          "Who is expected to buy or use it?",
          "Will it be sold through wholesale distribution, retail shelves, online e-commerce or all of the above?",
          "What packages are customers already seeing in the marketplace?",
          "How will the product be stored, filled, shipped and used?",
          "What launch quantity and timing are being considered?",
        ],
      },
      {
        heading: "How the project develops",
        items: [
          "Product protection and functional requirements",
          "Trial, retail and bulk package sizes",
          "Closure, dispensing and repeated-use decisions",
          "Flexible or rigid packaging structure",
          "Manufacturer dieline and impact design",
          "Production-ready artwork, prepress and printing",
          "U.S. or offshore manufacturing",
          "Quality control, shipping, receiving, supply and launch",
        ],
      },
    ],
    body: [
      "You do not need to arrive with every answer. The development process separates decisions that can be made now from specifications that require samples, testing, manufacturer input or product-owner approval.",
      "The objective is a package that can be manufactured and supplied—not simply a concept image that looks finished.",
    ],
    links: [
      ["Explore Packaging Development", servicePath("packaging-development")],
      ["Start a New Product Project Review", reviewPath("starting-point")],
      ["See What to Prepare", reviewPath("upload-files-timing")],
    ],
  },
  {
    slug: "packaging-and-product",
    title: "Have Packaging and Product",
    intro: [
      "An Existing Package Gives Us Something Valuable: Real Market Experience.",
      "Customers, production employees, packers, warehouses, retailers and shipping carriers may already have shown what works and what does not. We begin by separating visual preferences from measurable performance, supply and cost issues.",
    ],
    groups: [
      {
        heading: "Review points",
        items: [
          "Product protection and actual shelf-life performance",
          "Package size, empty space and customer use",
          "Opening, closure, dispensing and resealability",
          "Material, structure, seals and manufacturing consistency",
          "Graphic impact on shelf and online",
          "Filling, case packing, warehousing and shipping",
          "Unit price, tooling, order quantity, freight and inventory",
          "Complaints, returns, damage or recurring quality concerns",
        ],
      },
      {
        heading: "Helpful comparisons",
        items: [
          "Current package photographs and physical samples",
          "Current specifications, dielines and artwork",
          "Manufacturer quotes and recent invoices",
          "Competitor packages and customer feedback",
          "Damage, leakage, seal or print-failure photographs",
          "Sales channels and planned product changes",
        ],
      },
    ],
    body: [
      "The answer may be to keep the current structure and improve one feature. It may be to revise the specification, artwork, manufacturer or supply plan. A review prevents a redesign from changing parts of the package that are already serving the product well.",
    ],
    links: [
      ["Upload Current Package Files", reviewPath("upload-files-timing")],
      ["Explore Package Redesign", projectPath("redesign-maintaining-brand")],
    ],
  },
  {
    slug: "redesign-maintaining-brand",
    title: "Redesign Maintaining Brand",
    intro: [
      "A Redesign Should Have a Reason Beyond Making the Package Simply Look New.",
      "Perhaps the brand has changed, the product is moving into retail, the package does not communicate clearly online, a new size is needed, or the current structure no longer fits the customer’s use. We define the reason before changing familiar elements.",
    ],
    groups: [
      {
        heading: "What may need to change",
        items: [
          "Brand and product positioning",
          "Front-panel message and visual hierarchy",
          "Package size or product quantity",
          "Structure, closure or functional features",
          "Barrier or material specification",
          "Dieline and panel organization",
          "Printing process, finishes or number of colors",
          "Manufacturer, production quantity or supply plan",
        ],
      },
      {
        heading: "What may need to remain recognizable",
        items: [
          "Product name and established brand assets",
          "Colors or visual cues customers already identify",
          "Required information and approved claims",
          "Package dimensions tied to filling or shelf space",
          "Functional features customers value",
          "Existing inventory transition requirements",
        ],
      },
    ],
    body: [
      "We compare the current package with the intended future package and identify what the redesign must accomplish. The work then moves from approved direction to the correct dieline, production-ready artwork, proofing and controlled transition into manufacturing.",
    ],
    links: [
      ["Explore Impact Design", servicePath("impact-design")],
      ["Start a Package Redesign Review", reviewPath("starting-point")],
      [
        "Upload Current Artwork and Dielines",
        reviewPath("upload-files-timing"),
      ],
    ],
  },
  {
    slug: "sourcing-manufacturing",
    title: "Sourcing and Manufacturing",
    intro: [
      "Finding a Source for Manufacturer is not the same as finding a factory that can reliably produce your package.",
      "The sourcing conversation begins with a usable specification: material, structure, dimensions, printing, closures, quantity, quality requirements, delivery location and expected reorders. Without that information, quotations may look comparable while pricing different packages.",
    ],
    groups: [
      {
        heading: "Sourcing points",
        items: [
          "U.S., offshore or comparative sourcing",
          "Manufacturer equipment and actual capability",
          "Minimum order and economic production quantity",
          "Digital, flexographic or gravure printing",
          "Plates, cylinders and other tooling",
          "Samples, proofs and production approvals",
          "Manufacturing and transit lead times",
          "Freight, duty, brokerage and landed cost when applicable",
          "Communication, corrective action and repeat-order consistency",
        ],
      },

      {
        heading: "Manufacturing points",
        items: [
          "Final specification and approved artwork version",
          "Material and barrier confirmation",
          "Dimensions, seals, zipper and functional tolerances",
          "Color targets and print expectations",
          "Case, pallet and shipment requirements",
          "Inspection points and release approval",
          "Delivery, receiving and supply schedule",
        ],
      },
    ],
    body: [
      "The goal is not the lowest quotation on paper, film or foil. It is the best workable combination of capability, total cost, quality, timing, communication and continuing supply for this project.",
    ],
    links: [
      [
        "Compare U.S. and Offshore Capabilities",
        servicePath("sourcing-manufacturing"),
      ],
      ["Start a Sourcing & Manufacturing Review", reviewPath("starting-point")],
      [
        "Upload Specifications for Quotations",
        reviewPath("upload-files-timing"),
      ],
    ],
  },
  {
    slug: "packaging-problems",
    title: "Packaging Problems or Issues",
    intro: [
      "When Packaging Fails, the visible damage is not always the original cause.",
      "A leaking package may involve material compatibility, contaminated seal areas, filling temperature, sealing conditions, dimensions, handling or a combination. A scuffed print, broken zipper, delamination, odor loss or short shelf life requires the same disciplined separation of symptoms from causes.",
    ],
    groups: [
      {
        heading: "Describe what is happening",
        items: [
          "What changed, and when did the problem first appear?",
          "Does it affect every package, one production run or only some shipments?",
          "Where was the package manufactured, filled, stored and shipped?",
          "Are the current material, structure, dieline and artwork specifications available?",
          "Are physical samples, photographs, lot codes and production records available?",
          "Has the manufacturer, filler or material supplier already responded?",
        ],
      },
      {
        heading: "Areas to review",
        items: [
          "Product-package compatibility and barrier",
          "Film, foil, laminate or rigid-component construction",
          "Seals, closures, zippers and dimensions",
          "Printing, ink adhesion, scuffing and lamination",
          "Filling, sealing and production conditions",
          "Case packing, pallets, warehousing and freight",
          "Specification changes or uncontrolled substitutions",
        ],
      },
    ],
    body: [
      "We document the facts, preserve samples and identify the most likely stage of failure. Some matters can be addressed through specification, manufacturer or process changes; others require independent laboratory, engineering, regulatory or legal expertise. We will distinguish those needs rather than overstate what packaging consultation alone can determine.",
    ],
    links: [
      ["Start a Packaging Problem Review", reviewPath("starting-point")],
      [
        "Upload Failure Photographs and Records",
        reviewPath("upload-files-timing"),
      ],
      ["Contact Us About an Immediate Packaging Issue", "/contact-us"],
    ],
  },
  {
    slug: "cost-supply-quality",
    title: "Cost, Supply and Quality",
    intro: [
      "Cost, Supply and Quality Are Connected. Reducing one quoted unit price may increase tooling, freight, inventory, damage or shortage costs somewhere else.",
      "We first determine which problem is actually affecting the business: the purchase price, the total delivered cost, inconsistent quality, excessive inventory, long lead time, repeated shortages or dependence on a single source.",
    ],
    groups: [
      {
        heading: "Cost points",
        items: [
          "Unit price at comparable specifications and quantities",
          "Plates, cylinders, dies and other tooling",
          "Freight, duty, brokerage and delivery",
          "Waste, defects, rework and rejected product",
          "Inventory carrying and storage requirements",
          "Cost of shortages, delays or emergency freight",
        ],
      },
      {
        heading: "Supply and quality points",
        items: [
          "Current lead time and reorder point",
          "Minimum order and release quantities",
          "Forecast accuracy and seasonal demand",
          "Manufacturer performance and communication",
          "Specification control and approved substitutions",
          "Incoming inspection and corrective-action history",
          "Alternative or backup source feasibility",
        ],
      },
    ],
    body: [
      "The review should produce a practical priority. That may be a new quotation, revised specification, second source, different printing method, better quality-control procedure, improved forecast or a planned transition to another manufacturer.",
    ],
    links: [
      ["Start a Cost, Supply or Quality Review", reviewPath("starting-point")],
      [
        "Upload Current Quotes and Specifications",
        reviewPath("upload-files-timing"),
      ],
      [
        "Explore Sourcing & Manufacturing",
        servicePath("sourcing-manufacturing"),
      ],
    ],
  },
];

export const projectsBySlug = Object.fromEntries(
  projects.map((project) => [project.slug, project]),
);
