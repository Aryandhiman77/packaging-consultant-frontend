const servicePath = (slug) => `/packaging-services/${slug}`

export const industries = [
  {
    slug: 'food-beverage',
    title: 'Food and Beverage',
    intro: [
      'Food and Beverage Packaging begins with a deceptively simple question: what must the customer receive when the package is opened?',
      'The answer may involve freshness, flavor, texture, aroma, portion size, convenience, food safety or a combination of them. We also need to understand whether the product is dry, liquid, oily, acidic, refrigerated, frozen or shelf stable, because those conditions influence the material, barrier, seals, structure and filling process.',
    ],
    sections: [
      {
        heading: 'Product and marketplace points',
        items: [
          'What is the product, and is it ready for commercial packaging?',
          'Who is the expected customer: consumer, retailer, distributor, food-service operator or another business?',
          'Will it be sold through wholesale distribution, retail shelves, online e-commerce or all of the above?',
          'What package sizes are already familiar in the marketplace?',
          'Will the product be filled by the owner, a co-packer or the packaging manufacturer?',
          'Does the product require ambient, refrigerated or frozen distribution?',
        ],
      },
      {
        heading: 'Protection and function points',
        items: [
          'Moisture, oxygen, light, aroma, grease or flavor protection',
          'Expected unopened and opened shelf life',
          'Single-use, resealable or portion-control use',
          'Seal strength, leak resistance and handling durability',
          'Food-contact material and manufacturer documentation',
          'Retail display, storage and shipping conditions',
        ],
      },
    ],
    body: [
      'We do not choose the package by appearance alone. We match the product and sales channel to the required protection and function, then compare structures that can be filled, sealed, printed, shipped and reordered reliably.',
      'The next discussion may involve flexible or rigid packaging, trial and retail sizes, stand-up or gusseted structures, closures, labeling, impact design and production quantities.',
    ],
    links: [
      ['Explore Product Protection & Barrier Requirements', servicePath('product-protection-barrier-requirements')],
      ['Explore Packaging Structures & Dielines', servicePath('packaging-structures-dielines')],
      ['Start a Food & Beverage Project Review', '/project-review/starting-point'],
      ['Contact Us With a General Question', '/#contact'],
    ],
  },
  {
    slug: 'coffee-tea',
    title: 'Coffee and Tea',
    intro: [
      'Coffee and Tea are purchased partly by aroma, flavor and freshness—qualities the customer cannot fully inspect before opening the package.',
      'That places unusual responsibility on the package. It must protect the product while the design communicates roast, origin, blend, flavor, format, quantity and brand position clearly enough to earn the first purchase.',
    ],
    sections: [
      {
        heading: 'Product and marketplace points',
        items: [
          'Whole bean, ground coffee, pods, loose tea, tea bags or another format',
          'Retail, wholesale, food-service, subscription or e-commerce sales',
          'Trial, common retail and bulk sizes',
          'Freshly roasted product and degassing requirements',
          'Premium, everyday, private-label or specialty positioning',
          'Existing packaging used by direct competitors',
        ],
      },
      {
        heading: 'Protection and function points',
        items: [
          'Oxygen, moisture, light and aroma protection',
          'One-way degassing valve when the product and timing require it',
          'Zipper, wire tie or another reclosure system',
          'Film, foil or other barrier construction',
          'Seal integrity after filling',
          'Shelf stability through warehousing and distribution',
        ],
      },
    ],
    body: [
      'A foil coffee bag is not automatically the right answer, and a valve is not automatically required for every product. We look at roast timing, filling timing, distribution, expected shelf life, customer use and quantity before establishing the specification.',
      'Once the structure is selected, the dieline and graphic design must make roast, flavor, size and brand easy to understand on the shelf and online.',
    ],
    links: [
      ['Compare Coffee and Tea Packaging Structures', servicePath('art-templates')],
      ['Explore Barrier Requirements', servicePath('product-protection-barrier-requirements')],
      ['Explore Impact Design', servicePath('impact-design')],
      ['Start a Coffee or Tea Project Review', '/project-review/starting-point'],
    ],
  },
  {
    slug: 'bakery-snacks',
    title: 'Bakery and Snacks',
    intro: [
      'Bakery and Snack Products often look simple to package until texture, breakage, grease, crumbs, portion size and shelf life enter the discussion.',
      'A crisp product must remain crisp. A soft product must not dry out. A fragile product must survive filling, case packing, shipment and shelf handling. The package must also open and close in a way that fits how the customer actually eats the product.',
    ],
    sections: [
      {
        heading: 'Product and customer points',
        items: [
          'Cookies, crackers, chips, baked snacks, mixes or another product',
          'Crisp, soft, fragile, oily, powdered or coated product characteristics',
          'Single serving, family size, trial size or food-service quantity',
          'Retail shelf, club, wholesale, vending or e-commerce sales',
          'Immediate consumption or repeated opening and closing',
          'Product visibility through a window or full barrier protection',
        ],
      },
      {
        heading: 'Package decision points',
        items: [
          'Moisture and oxygen control',
          'Grease resistance and seal-area cleanliness',
          'Puncture and impact resistance',
          'Headspace and package dimensions',
          'Zipper or single-use opening',
          'Stand-up pouch, side-gusset bag, rollstock, tray, carton or combined structure',
        ],
      },
    ],
    body: [
      'The best package balances protection with the product experience. Too little protection shortens shelf life; too much empty space, material or structure can add cost without improving the product.',
      'We define the product and channel first, test the size and function, then develop artwork on the correct dieline for the chosen structure.',
    ],
    links: [
      ['Explore Package Size & Product Use', servicePath('packaging-development')],
      ['Compare Structures & Dielines', servicePath('packaging-structures-dielines')],
      ['Start a Bakery or Snack Project Review', '/project-review/starting-point'],
      ['Review an Existing Package', '/project-review/starting-point'],
    ],
  },
  {
    slug: 'confections-candy',
    title: 'Confections and Candy',
    intro: [
      'Confections and Candy sell through anticipation. Color, flavor, texture, gifting, indulgence and portion all influence the purchase before the package is opened.',
      'The package must protect the product from heat, moisture, oxygen, scuffing, breakage or flavor loss while giving the design enough room to make the product immediately desirable.',
    ],
    sections: [
      {
        heading: 'Product and market points',
        items: [
          'Chocolate, hard candy, gummies, coated products, caramels or specialty confections',
          'Individual, share, gift, seasonal, trial or bulk sizes',
          'Retail shelf, counter display, gift shop, online or wholesale channels',
          'Temperature and seasonal shipping exposure',
          'Product contact with film, tray, wrapper, carton or inner bag',
          'Premium, novelty, everyday or private-label position',
        ],
      },
      {
        heading: 'Protection and presentation points',
        items: [
          'Moisture, oxygen, light and aroma requirements',
          'Heat sensitivity and distribution conditions',
          'Grease, oil or product-transfer resistance',
          'Product separation, inner wrapping or trays',
          'Tamper evidence and resealability',
          'High-impact color, finish, window and print effects',
        ],
      },
    ],
    body: [
      'Confectionery packaging must make the product tempting without allowing presentation to outrun performance. A beautiful carton cannot correct an inner package that does not protect the product, and a strong barrier package will not sell if the customer cannot quickly understand what is inside.',
      'We coordinate product protection, structure and design as one project, then prepare the files and manufacturing specifications together.',
    ],
    links: [
      ['Explore Product Protection', servicePath('product-protection-barrier-requirements')],
      ['Explore Impact Design', servicePath('impact-design')],
      ['Compare U.S. and Offshore Manufacturing', servicePath('sourcing-manufacturing')],
      ['Start a Confections Project Review', '/project-review/starting-point'],
    ],
  },
  {
    slug: 'pet-food',
    title: 'Pet Food and Treats',
    intro: [
      'The pet owner makes the purchase, but the package must protect a product intended for the pet.',
      'That means the conversation includes product ingredients and characteristics, odor and flavor retention, grease resistance, feeding quantity, repeated use, storage and the confidence the owner receives from the package.',
    ],
    sections: [
      {
        heading: 'Product and marketplace points',
        items: [
          'Dry food, treats, chews, supplements, toppers or another pet product',
          'Dog, cat or other animal market',
          'Trial, retail, multi-use and bulk sizes',
          'Specialty retail, mass retail, veterinary, direct-to-consumer or e-commerce sales',
          'Premium, natural, functional, training or everyday positioning',
          'Package expectations established by competing products',
        ],
      },
      {
        heading: 'Protection and use points',
        items: [
          'Moisture, oxygen, aroma and grease protection',
          'Seal strength and puncture resistance',
          'Zipper or other reliable reclosure',
          'Stable base and convenient pouring or product access',
          'Handling through retail and parcel delivery',
          'Artwork, feeding information and required product information',
        ],
      },
    ],
    body: [
      'The structure must remain functional through repeated openings, while the design helps the owner understand the product, size and intended benefit. Large packages may need different material strength, carrying and closure decisions than small treat packages.',
      'Once the product and use pattern are clear, we can compare pouch, gusseted, quad-seal, box-bottom or other structures and develop the corresponding dieline.',
    ],
    links: [
      ['Compare Pet Packaging Structures', servicePath('art-templates')],
      ['Explore Barrier & Functional Requirements', servicePath('product-protection-barrier-requirements')],
      ['Start a Pet Product Project Review', '/project-review/starting-point'],
      ['Review an Existing Pet Package', '/project-review/starting-point'],
    ],
  },
  {
    slug: 'vitamins-supplements',
    title: 'Vitamins and Supplements',
    intro: [
      'Vitamins and Supplements require the package to communicate confidence while protecting products that may be sensitive to moisture, oxygen, light or repeated exposure after opening.',
      'The package must fit the dosage form, quantity, use period, distribution channel and applicable labeling responsibilities. Packaging development supports that process, but it does not replace the product owner’s regulatory or scientific review.',
    ],
    sections: [
      {
        heading: 'Product and market points',
        items: [
          'Capsules, tablets, powders, gummies, liquids, packets or another format',
          'Daily use, trial, travel, subscription or bulk quantity',
          'Retail, practitioner, fitness, direct-to-consumer or e-commerce channel',
          'Existing label content and responsible regulatory review',
          'Tamper-evident and child-resistant needs when applicable',
          'Premium, clinical, lifestyle or value positioning',
        ],
      },
      {
        heading: 'Protection and function points',
        items: [
          'Moisture, oxygen and light exposure',
          'Product stability after repeated opening',
          'Desiccant, induction seal or another supporting component when required',
          'Resealability and dispensing convenience',
          'Package-product compatibility',
          'Lot, expiration and variable-information areas',
        ],
      },
    ],
    body: [
      'We separate three questions: what the product requires for protection, what the customer requires for use, and what information the responsible company must present. Those answers guide the structure, closure, material and artwork layout.',
      'When label claims or regulated statements are involved, the product owner or qualified adviser supplies the approved content. We place approved information accurately on the production dieline and prepare it for print.',
    ],
    links: [
      ['Explore Protection & Function', servicePath('product-protection-barrier-requirements')],
      ['Explore Dielines, Artwork & Prepress', servicePath('prepress-printing')],
      ['Start a Vitamins or Supplements Project Review', '/project-review/starting-point'],
      ['Contact Us With a General Question', '/#contact'],
    ],
  },
  {
    slug: 'health-beauty',
    title: 'Health and Beauty',
    intro: [
      'Health and Beauty Packaging often carries two responsibilities at once: it must protect and dispense the product correctly, and it must create a visual experience consistent with the brand.',
      'A lotion, powder, wipe, cosmetic, personal-care product or grooming item may require very different compatibility, barrier, closure and decoration decisions. We begin with the product form and how the customer will use it.',
    ],
    sections: [
      {
        heading: 'Product and customer points',
        items: [
          'Liquid, cream, gel, powder, wipe, solid or another product form',
          'Single-use, daily-use, refill or professional application',
          'Retail, salon, spa, medical-adjacent, direct-to-consumer or e-commerce sales',
          'Trial, travel, retail and professional sizes',
          'Product dispensing and closure expectations',
          'Premium, natural, clinical, fashion or value positioning',
        ],
      },
      {
        heading: 'Package decision points',
        items: [
          'Material compatibility with the product',
          'Moisture, oxygen, light, aroma or leakage protection',
          'Pumps, caps, zippers, seals, applicators or other functions',
          'Tamper evidence when applicable',
          'Surface, finish, color and decoration',
          'Parcel-shipping durability and leak prevention',
        ],
      },
    ],
    body: [
      'The visual design cannot be separated from the package experience. A premium appearance loses value if the closure leaks, the product is difficult to dispense or the decoration scuffs in distribution.',
      'We coordinate function, compatibility, structure, graphics and manufacturing so the package supports the product from first impression through final use.',
    ],
    links: [
      ['Explore Packaging Function', servicePath('product-protection-barrier-requirements')],
      ['Explore Impact Design', servicePath('impact-design')],
      ['Explore Sourcing & Manufacturing', servicePath('sourcing-manufacturing')],
      ['Start a Health and Beauty Project Review', '/project-review/starting-point'],
    ],
  },
  {
    slug: 'household-products',
    title: 'Household Products',
    intro: [
      'Household-Product Packaging must communicate purpose quickly and remain dependable during storage, transport and use.',
      'The product may be a powder, tablet, liquid, concentrate, refill, wipe or accessory. Each form creates different questions about material compatibility, moisture, leakage, puncture, closure, dispensing and safe handling.',
    ],
    sections: [
      {
        heading: 'Product and market points',
        items: [
          'Cleaning, laundry, storage, maintenance, fragrance or another household use',
          'Liquid, powder, solid, wipe, concentrate or refill format',
          'Consumer retail, commercial, wholesale or e-commerce channel',
          'Single-use, refill, repeated-use or bulk quantity',
          'Storage in a cabinet, garage, vehicle, warehouse or other environment',
          'Existing marketplace package and customer expectations',
        ],
      },
      {
        heading: 'Protection and function points',
        items: [
          'Product-package compatibility',
          'Leak, puncture, moisture and vapor control',
          'Child-resistant or tamper-evident features when applicable',
          'Pouring, dispensing, measuring or resealing',
          'Clear instructions and warning-information areas supplied by the responsible company',
          'Shipping case, parcel and warehouse durability',
        ],
      },
    ],
    body: [
      'The right structure must perform through the full distribution and use cycle. A refill pouch, for example, may reduce material and shipping volume but still must pour, seal, survive drops and communicate use clearly.',
      'We define those practical conditions before comparing materials, structures, printing methods and manufacturers.',
    ],
    links: [
      ['Explore Functional Requirements', servicePath('product-protection-barrier-requirements')],
      ['Compare Structures & Dielines', servicePath('packaging-structures-dielines')],
      ['Start a Household Product Project Review', '/project-review/starting-point'],
      ['Review a Packaging Problem', '/project-review/starting-point'],
    ],
  },
  {
    slug: 'other-products',
    title: 'Other Product Category',
    intro: [
      'Your Product Does Not Have To Fit one of our listed industries before we can begin a useful packaging conversation.',
      'New products, specialty applications and products that cross several industries are often the reason a structured development process matters most. We begin with what the product is, what it must do and how it will reach the customer.',
    ],
    sections: [
      {
        heading: 'Starting points',
        items: [
          'Describe the product form, ingredients or physical characteristics relevant to packaging',
          'Identify the customer and expected use',
          'Identify wholesale, retail, e-commerce or mixed sales channels',
          'Describe storage, handling and distribution conditions',
          'Show packaging used by comparable products, if any',
          'Explain what is new, unusual or unresolved about the application',
        ],
      },
      {
        heading: 'Packaging questions we will develop',
        items: [
          'Product protection and expected shelf life',
          'Package size, opening, closure and repeated use',
          'Flexible, rigid or combined structure',
          'Dieline, artwork and required information',
          'Printing, manufacturing quantity and sourcing',
          'Quality control, shipping, receiving and launch',
        ],
      },
    ],
    body: [
      'We do not need to force the product into a familiar category. The same market-backward process still applies: product and customer first, then protection and function, then structure and design, and finally manufacturing, supply and launch.',
      'If some technical answers are not yet known, the Project Review can identify what must be tested, confirmed or supplied by another qualified specialist before packaging is finalized.',
    ],
    links: [
      ['Begin an Other Product Category Review', '/project-review/starting-point'],
      ['Explore Packaging Development', servicePath('packaging-development')],
      ['Contact Us With a General Packaging Question', '/#contact'],
    ],
  },
]

export const industriesBySlug = Object.fromEntries(
  industries.map((industry) => [industry.slug, industry]),
)
