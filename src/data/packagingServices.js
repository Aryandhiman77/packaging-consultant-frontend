const servicePath = (slug) => `/packaging-services/${slug}`;

export const artTemplatesPath = "/packaging-services/art-templates";
export const artTemplatesPdfPath =
  "/assets/templates/art-templates-choose-your-structure.pdf";

export const packagingServices = [
  {
    slug: "packaging-development",
    title: "Packaging Development",
    intro: [
      "“I have a product idea, but no package.”",
      "That is a perfectly good place to begin.",
      "Packaging development does not begin by immediately choosing a pouch, bag, bottle, box, film or foil. It begins with your product, the customer who may buy it, and the marketplace where the product must compete.",
      "We first talk about what the product is, how it will be used, where it will be sold and what packaging customers already recognize in that market.",
    ],
    groups: [
      {
        heading: "Explore the starting points:",
        items: [
          "Your Product",
          "Your Customer and Marketplace",
          "Wholesale Distribution",
          "Retail Shelves",
          "Online e-Commerce",
          "All of the Above",
          "Current Marketplace Packaging",
          "Package Size and Product Use",
        ],
      },
    ],
    body: [
      "These answers help us work from the marketplace backward. They begin defining the package without forcing the project into a structure too early.",
      "Once we understand the product and customer, the next conversation is about protection: what must remain inside the package and what must stay outside.",
    ],
    links: [
      [
        "Continue to Product Protection & Barrier Requirements",
        servicePath("product-protection-barrier-requirements"),
      ],
      ["Begin a Project Review", "/project-review/starting-point"],
    ],
  },
  {
    slug: "product-protection-barrier-requirements",
    title: "Product Protection & Barrier Requirements",
    intro: [
      "What does your product need from its package?",
      "A package may look attractive and still fail if it does not protect product quality, flavor, aroma, freshness or expected shelf life.",
      "This is where we discuss your “inside in and outside out” requirements: what the package must retain and what it must prevent from entering.",
    ],
    groups: [
      {
        heading: "Explore the protection topics:",
        items: [
          "Oxygen Protection",
          "Moisture Protection",
          "Light Protection",
          "Flavor and Aroma Retention",
          "Grease and Oil Resistance",
          "Puncture and Handling Strength",
          "Contamination Protection",
          "Product Shelf Life",
        ],
      },
      {
        heading:
          "We also consider how the product will be stored and distributed:",
        items: [
          "Ambient or Room Temperature",
          "Refrigerated",
          "Frozen",
          "Retail Shelf",
          "Mail Order or e-Commerce",
          "Multiple Storage Conditions",
        ],
      },
    ],
    body: [
      "More barrier is not automatically better. The appropriate protection must fit the product, expected shelf life, filling process, storage environment, distribution system and project cost.",
      "Once those requirements are understood, we can begin comparing flexible or rigid packaging structures capable of providing that protection.",
    ],
    links: [
      [
        "Continue to Packaging Structures & Dielines",
        servicePath("packaging-structures-dielines"),
      ],
      ["Return to Packaging Development", servicePath("packaging-development")],
    ],
  },
  {
    slug: "packaging-structures-dielines",
    title: "Packaging Structures & Dielines",
    intro: [
      "Now we can begin discussing the physical package.",
      "The best structure is not selected only because it looks attractive. It must fit the product, barrier requirements, filling process, package size, customer use, distribution system and manufacturing quantity.",
    ],
    groups: [
      {
        heading:
          "Explore packaging structures through individual images and short pop-up explanations:",
        items: [
          "Stand-Up Pouch",
          "Stand-Up Zipper Pouch",
          "Side-Gusset Bag",
          "Side-Gusset Foil and Paper Bag with Wire Tie",
          "Quad-Seal Bag",
          "Box- or Block-Bottom Bag",
          "Rollstock",
          "Custom Packaging Structure",
        ],
      },
    ],
    body: [
      "Each structure can be considered in film, foil or another material combination based on the protection and function required.",
      "After the structure and dimensions are established, the manufacturer’s specifications create the dieline. The dieline shows where the front, back, side panels, seals, folds, zipper and other production areas will appear.",
      "Artwork should not be finalized before the correct dieline is confirmed. The dieline becomes the production map used to position the graphic design properly.",
    ],
    links: [
      ["View Art Templates", artTemplatesPath],
      ["Continue to Impact Design", servicePath("impact-design")],
      [
        "Return to Barrier Requirements",
        servicePath("product-protection-barrier-requirements"),
      ],
    ],
  },
  {
    slug: "impact-design",
    title: "Impact Design",
    intro: [
      "Your package may be your product’s only salesperson on a retail shelf or website.",
      "The customer may see the package for only a few seconds. The design must quickly communicate what the product is, who it is for and why the customer should consider it.",
      "Impact Design begins with more than colors and decoration. It considers how the brand, product identity and purchasing message work together on the available package panels.",
    ],
    groups: [
      {
        heading: "Explore the design conversation:",
        items: [
          "Brand and Product Positioning",
          "Front-Panel Communication",
          "Product Name and Primary Message",
          "Visual Hierarchy",
          "Color and Image Direction",
          "Retail-Shelf Impact",
          "Online and e-Commerce Impact",
          "Adapting Existing Branding",
          "Package Mockups and Presentation",
        ],
      },
    ],
    body: [
      "The design must also fit the confirmed structure and dieline. Important information cannot be placed across folds, seals, gussets, zippers or areas that may be distorted during manufacturing.",
      "Once the visual direction is approved, the artwork must be converted into accurate, production-ready files.",
    ],
    links: [
      ["Continue to Prepress & Printing", servicePath("prepress-printing")],
      [
        "Return to Structures & Dielines",
        servicePath("packaging-structures-dielines"),
      ],
    ],
  },
  {
    slug: "prepress-printing",
    title: "Prepress & Printing",
    intro: [
      "A strong design must still be translated into artwork that a manufacturer can print correctly.",
      "Prepress is the bridge between creative design and manufacturing. It prepares the graphic art for the selected material, structure, printing process and production equipment.",
    ],
    groups: [
      {
        heading: "Explore the production-art topics:",
        items: [
          "Production-Ready Artwork",
          "Confirmed Dieline Placement",
          "Color Separation",
          "Image Resolution",
          "Bleeds, Seals and Print Areas",
          "Barcodes and Variable Information",
          "Proofing and Artwork Approval",
          "Artwork Version Control",
        ],
      },
      {
        heading: "The printing method must also fit the project:",
        items: [
          "Digital Printing",
          "Flexographic Printing and Plates",
          "Gravure Printing and Cylinders",
        ],
      },
    ],
    body: [
      "Digital, flexographic and gravure printing have different quantity, tooling, color, repeat-order and cost considerations. The decision should be based on the complete project—not simply the lowest initial price.",
      "Once the printing requirements and production files are confirmed, the project can move into manufacturer selection and production planning.",
    ],
    links: [
      ["Compare Printing Methods", "/projects/sourcing-manufacturing"],
      [
        "Continue to Sourcing & Manufacturing",
        servicePath("sourcing-manufacturing"),
      ],
      ["Return to Impact Design", servicePath("impact-design")],
    ],
  },
  {
    slug: "sourcing-manufacturing",
    title: "Sourcing & Manufacturing",
    intro: [
      "The manufacturer must be able to produce the package—not merely quote it.",
      "We compare manufacturing capabilities with the project’s materials, structure, printing method, quantities, quality requirements, timing and expected repeat orders.",
    ],
    groups: [
      {
        heading: "Explore the sourcing conversation:",
        items: [
          "U.S. Manufacturing",
          "Offshore Manufacturing",
          "U.S. and Offshore Comparison",
          "Manufacturer Capability",
          "Minimum Production Quantities",
          "Printing and Tooling Requirements",
          "Samples and Production Approvals",
          "Lead Times",
          "Freight and Landed Cost",
          "Ongoing Supply Requirements",
        ],
      },
    ],
    body: [
      "A low unit price can become expensive if the manufacturer cannot maintain specifications, meet delivery requirements or provide consistent repeat production.",
      "The sourcing decision should account for the complete cost and responsibility of getting approved packaging from the factory to the location where it will be filled, stored or distributed.",
      "Before manufacturing begins, the specifications, artwork, materials, dimensions and functional requirements must be confirmed.",
    ],
    links: [
      [
        "Continue to Manufacturing Quality Control",
        servicePath("manufacturing-quality-control"),
      ],
      ["Return to Prepress & Printing", servicePath("prepress-printing")],
    ],
  },
  {
    slug: "manufacturing-quality-control",
    title: "Manufacturing Quality Control",
    intro: [
      "Quality control begins before the production run—not after defective packaging arrives.",
      "The manufacturer must receive and confirm the same approved specifications used throughout package development. Materials, dimensions, printing, colors, closures and functional requirements must be clearly identified.",
    ],
    groups: [
      {
        heading: "Explore the quality-control points:",
        items: [
          "Approved Material and Barrier Specifications",
          "Package Dimensions and Structure",
          "Correct Artwork Version",
          "Printing and Color Requirements",
          "Zippers, Wire Ties and Closures",
          "Seals and Functional Performance",
          "Production Samples",
          "Inspection and Approval Procedures",
          "Carton, Case and Pallet Requirements",
          "Final Shipment Confirmation",
        ],
      },
    ],
    body: [
      "Quality control does not mean promising that a problem can never occur. It means establishing clear specifications, review points and production confirmations that reduce avoidable errors and help identify problems before the shipment is released.",
      "When production is completed, the next responsibility is moving, receiving and supplying the packaging in time for the product launch.",
    ],
    links: [
      [
        "Continue to Delivery, Fulfillment & Launch",
        servicePath("delivery-fulfillment-launch"),
      ],
      [
        "Return to Sourcing & Manufacturing",
        servicePath("sourcing-manufacturing"),
      ],
    ],
  },
  {
    slug: "delivery-fulfillment-launch",
    title: "Delivery, Fulfillment & Launch",
    intro: [
      "Packaging is not ready for use simply because manufacturing is finished.",
      "It must leave the factory, arrive at the correct destination, be received and inspected, and remain available when the product is ready to be filled and launched.",
    ],
    groups: [
      {
        heading: "Explore the supply conversation:",
        items: [
          "U.S. Factory Delivery",
          "Offshore Factory Delivery",
          "Ocean Freight",
          "Air Freight",
          "Receiving and Shipment Inspection",
          "Warehousing",
          "Scheduled Inventory Releases",
          "Delivery to a Packer or Co-Packer",
          "Initial Launch Quantity",
          "Reorder Quantity and Timing",
          "Ongoing Packaging Supply",
        ],
      },
    ],
    body: [
      "Imported packaging requires additional planning for manufacturing lead time, freight, receiving and inventory. Domestic production may shorten parts of the supply chain but still requires coordination with filling and launch schedules.",
      "The objective is not simply to receive one order. It is to establish a packaging supply process capable of supporting the initial launch and future reorders.",
      "If the product will also be introduced online, the physical package must now be presented accurately on the website.",
    ],
    links: [
      [
        "Continue to Website Product Launch",
        servicePath("website-product-launch"),
      ],
      [
        "Return to Manufacturing Quality Control",
        servicePath("manufacturing-quality-control"),
      ],
    ],
  },
  {
    slug: "website-product-launch",
    title: "Website Product Launch",
    intro: [
      "A package designed to sell on a shelf must also communicate clearly on a screen.",
      "Online customers cannot pick up the package, examine it or ask a salesperson to explain it. The website must use the package design, images and product information to help replace that physical experience.",
    ],
    groups: [
      {
        heading: "Explore the website-launch topics:",
        items: [
          "Package and Product Photography",
          "Front, Back and Side Package Views",
          "e-Commerce Product Images",
          "Product Description and Benefits",
          "Size and Quantity Information",
          "Package Features and Reclosure",
          "Consistent Branding and Colors",
          "Online Retailer Requirements",
          "Website Product Page",
          "Launch Readiness",
        ],
      },
    ],
    body: [
      "The package artwork and website presentation should tell the same product story. Colors, product names, sizes and primary claims should remain consistent from the manufactured package to the online listing.",
      "Website support is optional. It becomes part of the packaging project when the product’s online presentation is necessary for a coordinated marketplace launch.",
    ],
    links: [
      ["Continue to E-Marketing Launch", servicePath("e-marketing-launch")],
      [
        "Return to Delivery, Fulfillment & Launch",
        servicePath("delivery-fulfillment-launch"),
      ],
    ],
  },
  {
    slug: "e-marketing-launch",
    title: "E-Marketing Launch",
    intro: [
      "The product is packaged and ready. Now the marketplace must know it exists.",
      "E-Marketing connects the package, product message and launch materials across the online places where customers, distributors and retailers may encounter the new product.",
    ],
    groups: [
      {
        heading: "Explore the launch topics:",
        items: [
          "Social-Media Launch Images",
          "New-Product Announcements",
          "Email Marketing",
          "Online Advertising",
          "Retailer and Distributor Presentation",
          "Digital Sales Materials",
          "Product Demonstration Content",
          "Package Images for Multiple Platforms",
          "Launch Promotion",
          "Continuing Product Visibility",
        ],
      },
    ],
    body: [
      "The marketing presentation should remain consistent with the physical package and website. Customers should recognize the same product, design and message wherever they see it.",
      "E-Marketing support is included only when it is needed. The packaging project may end with manufacturing and supply, or it may continue through a coordinated website and digital-market launch.",
      "You do not need every answer before beginning. The Project Review gathers the available information and helps determine which packaging services are relevant.",
    ],
    links: [
      ["Begin a Project Review", "/project-review/starting-point"],
      ["Contact Us With a General Packaging Question", "/#contact"],
    ],
  },
];

export const packagingServicesBySlug = Object.fromEntries(
  packagingServices.map((service) => [service.slug, service]),
);
