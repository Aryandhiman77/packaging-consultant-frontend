const reviewPath = (slug) => `/project-review/${slug}`;

export const projectReviewSteps = [
  {
    slug: "starting-point",
    title: "Starting Point",
    intro: [
      "Let’s begin with where the project is today.",
      "This review will not attempt to design the package in one sitting. It gathers enough information to understand the product, identify missing decisions and prepare for a useful first response.",
    ],
    groups: [
      {
        heading: "Choose one primary starting point",
        type: "radio",
        name: "startingPoint",
        options: [
          "New product – no package yet",
          "Product exists – packaging must be developed",
          "Existing package needs review or improvement",
          "Package redesign or relaunch",
          "Sourcing or manufacturing help",
          "Packaging problem or failure",
          "Cost, supply or quality review",
          "Need guidance choosing the starting point",
        ],
      },
      {
        heading: "Brief response outline",
        type: "text",
        fields: [
          "Product or project name, if one exists",
          "Short description of the product or packaging situation",
          "What would you most like the project to accomplish?",
        ],
      },
      {
        heading: "Several objectives may apply",
        type: "checkbox",
        name: "objectives",
        options: [
          "Develop a complete new package",
          "Improve product protection or function",
          "Select a structure or package size",
          "Create a dieline or production-ready artwork",
          "Improve shelf or online impact",
          "Find or compare manufacturers",
          "Investigate a packaging problem",
          "Review cost, supply or quality",
          "Prepare packaging for launch",
        ],
      },
    ],
    body: [
      "That gives us the project’s starting condition and desired result. Next, we need to understand the product and the marketplace it must enter or continue serving.",
    ],
  },
  {
    slug: "product-marketplace",
    title: "Product & Marketplace",
    intro: [
      "Packaging development starts with your product and who will be your customer.",
      "The package must fit how that customer finds, purchases, stores and uses the product.",
    ],
    groups: [
      {
        heading: "Product to Package",
        type: "text",
        multiline: ["Describe the product"],
        fields: [
          "Describe the product",
          "Current development status",
          "Current package, if one exists",
          "Relevant product characteristics the package must accommodate",
        ],
        embeddedRadio: {
          afterField: "Describe the product",
          label: "Product form",
          name: "productForm",
          options: [
            "Dry",
            "Liquid",
            "Powder",
            "Solid",
            "Refrigerated",
            "Frozen",
            "Other",
          ],
          otherField: {
            trigger: "Other",
            name: "productFormOther",
            label: "Specify product form",
          },
        },
      },
      {
        heading: "Customer and market choices – several may apply",
        type: "checkbox",
        name: "customers",
        options: [
          "Individual consumers",
          "Retail customers",
          "Wholesale or distribution customers",
          "Food-service or commercial customers",
          "Industrial or business customers",
          "Another defined market",
        ],
      },
      {
        heading: "Sales channels – several may apply",
        type: "checkbox",
        name: "salesChannels",
        options: [
          "Wholesale Distribution",
          "Retail Shelves",
          "Online e-Commerce",
          "All of the Above",
          "Not yet determined",
        ],
      },
      {
        heading: "Marketplace initially",
        type: "text",
        fields: [
          "Where will the product initially be sold?",
          "What packaging do comparable products currently use?",
          "What should make this product or package different?",
        ],
      },
    ],
    body: [
      "The marketplace does not dictate the final package, but it establishes customer expectations, common sizes, competitive presentation and distribution demands. We can now discuss what the package must protect and how it must function.",
    ],
  },
  {
    slug: "protection-function",
    title: "Protection & Function",
    intro: ["Now we move from how the package will sell to what it must do."],
    groups: [
      {
        heading: "Storage and distribution choices – several may apply",
        type: "checkbox",
        name: "storage",
        options: [
          "Ambient or room temperature",
          "Refrigerated",
          "Frozen",
          "Retail shelf",
          "Warehouse or wholesale distribution",
          "Mail order or e-commerce parcel delivery",
          "Multiple conditions",
          "Need guidance",
        ],
      },
      {
        heading: "Protection choices – several may apply",
        type: "checkbox",
        name: "protection",
        options: [
          "Moisture control",
          "Oxygen control",
          "Light protection",
          "Flavor or aroma retention",
          "Grease or oil resistance",
          "Puncture or handling strength",
          "Leak resistance",
          "Product shelf-life protection",
          "Product-package compatibility review",
          "Need guidance",
        ],
      },
      {
        heading: "Use and function choices – several may apply",
        type: "checkbox",
        name: "functions",
        options: [
          "Single use",
          "Resealable zipper",
          "Wire-tie reclosure",
          "Pouring or dispensing feature",
          "Tamper evidence",
          "Child-resistant feature when applicable",
          "Refill or repeated use",
          "Another functional need",
          "Not yet determined",
        ],
      },
      {
        heading: "Brief response outlines",
        type: "text",
        fields: [
          "Desired unopened shelf life",
          "Expected use after opening",
          "Known product sensitivities or prior problems",
        ],
      },
    ],
    body: [
      "These answers begin defining the material and performance specification.",
    ],
  },
  {
    slug: "size-structure-design",
    title: "Size, Structure & Design",
    intro: [
      "Package size is more than net weight. The product’s density, headspace, filling method, customer use, shelf space and shipping case all influence the final dimensions.",
    ],
    groups: [
      {
        heading: "Size choices – several may apply",
        type: "checkbox",
        name: "sizes",
        options: [
          "Trial or sample size",
          "Common retail size",
          "Family or multi-use size",
          "Bulk or wholesale size",
          "Food-service or professional size",
          "Multiple coordinated sizes",
          "Not yet determined",
        ],
      },
      {
        heading: "Structure choices – several may apply",
        type: "checkbox",
        name: "structures",
        options: [
          "Stand-up pouch",
          "Stand-up zipper pouch",
          "Side-gusset bag",
          "Side-gusset bag with wire tie",
          "Quad-seal bag",
          "Box- or block-bottom bag",
          "Rollstock",
          "Rigid or combined structure",
          "Existing structure",
          "Need a structure recommendation",
        ],
      },
      {
        heading: "Artwork status – choose the closest answer",
        type: "radio",
        name: "artworkStatus",
        options: [
          "No branding or artwork yet",
          "Branding exists, but packaging artwork is needed",
          "Existing artwork must be adapted",
          "Artwork exists, but the correct dieline is needed",
          "Dieline and artwork are available",
          "Existing package needs stronger shelf or online impact",
        ],
      },
      {
        heading: "Brief response outline",
        type: "text",
        fields: [
          "Known net weight or product volume",
          "Known package dimensions, if any",
          "Number of sizes or artwork versions",
          "Special display, closure or use requirement",
        ],
      },
    ],
    body: [
      "The structure and dimensions must be confirmed before artwork is finalized on the production dieline. Once those pieces are aligned, we can consider how and where the package will be manufactured and supplied.",
    ],
  },
  {
    slug: "manufacturing-supply",
    title: "Manufacturing & Supply",
    intro: [
      "Manufacturing decisions should fit the specification, quantity, printing, timing, quality requirements and continuing supply plan.",
    ],
    groups: [
      {
        heading: "Printing choices – several may be considered",
        type: "checkbox",
        name: "printing",
        options: [
          "Digital printing",
          "Flexographic printing and plates",
          "Gravure printing and cylinders",
          "Existing printing method",
          "Need a printing recommendation",
        ],
      },
      {
        heading: "Manufacturing choices",
        type: "checkbox",
        name: "manufacturing",
        options: [
          "United States",
          "Offshore",
          "Compare U.S. and offshore",
          "Existing manufacturer",
          "Need manufacturer recommendations",
        ],
      },
      {
        heading: "Production and supply",
        type: "text",
        fields: [
          "Estimated initial quantity",
          "Estimated repeat quantity and frequency",
          "Target cost information, if established",
          "Filling location or co-packer, if known",
          "Final delivery location",
          "Desired inventory or scheduled-release plan",
        ],
      },
      {
        heading: "Additional support choices – several may apply",
        type: "checkbox",
        name: "support",
        options: [
          "Final manufacturing specification",
          "Samples, proofs or production approval",
          "Manufacturing quality-control coordination",
          "Freight and delivery planning",
          "Imported shipment coordination",
          "Receiving and incoming inspection",
          "Warehousing or scheduled releases",
          "Reorder and continuing supply planning",
        ],
      },
    ],
    body: [
      "The quantity and timing help determine whether digital, flexographic or gravure printing and U.S. or offshore manufacturing are practical. Files, samples and launch timing will help us understand how much work is complete and what must happen next.",
    ],
  },
  {
    slug: "upload-files-timing",
    title: "Upload Files & Timing",
    intro: [
      "Existing files can prevent duplicated work and reveal where specifications, artwork or quotations do not agree. Upload only what is available; a new-product client may have very little at this stage.",
    ],
    groups: [
      {
        heading: "Timing – choose one",
        type: "radio",
        name: "timing",
        options: [
          "Immediate packaging problem",
          "Needed within three months",
          "Needed within three to six months",
          "Needed in six months or longer",
          "No fixed launch date",
          "Need help developing a timeline",
        ],
      },
      {
        heading: "Available files – several may apply",
        type: "checkbox",
        name: "availableFiles",
        options: [
          "Product photographs",
          "Existing package photographs",
          "Competitor examples",
          "Artwork files",
          "Dielines",
          "Packaging specifications",
          "Manufacturer quotations",
          "Purchase orders or invoices relevant to a cost review",
          "Quality or failure photographs",
          "Inspection, complaint or production records",
          "No files yet",
        ],
      },
      { heading: "Upload available files", type: "file" },
      {
        heading: "Brief response",
        type: "text",
        fields: [
          "Desired launch or required-delivery date",
          "Important manufacturing, sales or retailer deadline",
          "Explanation of any urgent condition",
        ],
      },
    ],
    body: [
      "We now have the project story, technical direction, available documents and timing. Contact information appears last so we can connect the submission with the right person and respond in the way requested.",
    ],
  },

  {
    slug: "contact-submission",
    title: "Contact & Submission",

    intro: [
      "Now that we understand the project, tell us who should receive the response.",
    ],

    groups: [
      {
        heading: "Contact information",
        type: "contact",
        fields: [
          "Name",
          "Company, if applicable",
          "Email",
          "Telephone, if a call is requested",
          "City and State",
          "Preferred contact method",
          "Best time to contact",
        ],
      },
      {
        heading: "Required acknowledgements",
        type: "checkbox",
        name: "acknowledgements",
        required: true,
        options: [
          "I confirm that the information provided is accurate to the best of my knowledge.",
          "Packaging Consultants USA may contact me regarding this Project Review.",
          "I understand that submitting a Project Review does not create a contract or require either party to proceed.",
          "I acknowledge the Privacy Policy and Terms of Use.",
        ],
      },
      {
        heading: "Optional - unchecked by default",
        type: "checkbox",
        name: "marketingOptIn",
        options: ["Send me Packaging Times news and updates."],
      },
    ],

    finalReview: [
      "Review all responses for accuracy",
      "Return to any section to make corrections",
      "Confirm the selected filenames",
      "Complete all required fields before submission",
    ],

    finalActions: [
      "Review My Responses",
      "Submit Project Review",
      "Save and Finish Later",
    ],

    confirmation:
      "Thank you. Your Project Review has been received. Please keep your reference number for future correspondence. Additional information may be requested before services, scope, timing or fees can be discussed.",

    body: [],
  },
];

export const projectReviewBySlug = Object.fromEntries(
  projectReviewSteps.map((step) => [step.slug, step]),
);
export const firstReviewPath = reviewPath(projectReviewSteps[0].slug);
