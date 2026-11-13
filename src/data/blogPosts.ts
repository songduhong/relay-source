export type BlogCategorySlug =
  | "sourcing-sampling"
  | "fake-vs-real"
  | "qc-inspection"
  | "logistics-ddp";

export type BlogSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  takeaway?: string;
};

export type BlogPost = {
  slug: string;
  category: BlogCategorySlug;
  title: string;
  excerpt: string;
  date: string;
  dateISO: string;
  readTime: string;
  tags: string[];
  sections: BlogSection[];
  featured?: boolean;
};

export type BlogCategory = {
  slug: BlogCategorySlug;
  name: string;
  description: string;
};

export const blogCategories: BlogCategory[] = [
  {
    slug: "sourcing-sampling",
    name: "Sourcing & Sampling",
    description: "Find the right product, pressure-test the sample and lock the approved version before it becomes inventory."
  },
  {
    slug: "fake-vs-real",
    name: "Fake vs. Real",
    description: "Counterfeit, refurbished and substituted parts hide in plain sight. We check the evidence before you commit."
  },
  {
    slug: "qc-inspection",
    name: "QC & Inspection",
    description: "AQL standards and pre-shipment checks that reduce returns, chargebacks and avoidable marketplace reviews."
  },
  {
    slug: "logistics-ddp",
    name: "Logistics & DDP",
    description: "Landed cost, duties, consolidation and door-to-door delivery, explained for smaller importers."
  }
];

export const blogPosts: BlogPost[] = [
  {
    slug: "fake-chips-refurbished-phones",
    category: "fake-vs-real",
    title: "Fake chips and refurbished phones: 9 checks that expose a bad batch",
    excerpt: "A practical evidence trail for buyers who cannot afford to discover counterfeit or renewed stock after the carton has shipped.",
    date: "Nov 10, 2026",
    dateISO: "2026-11-10",
    readTime: "10 min read",
    tags: ["counterfeit", "refurbished", "fake chips", "batch verification"],
    featured: true,
    sections: [
      {
        heading: "Separate the product claim from the evidence",
        paragraphs: [
          "A supplier saying a phone is new or a chip is original is a claim, not proof. Start by writing down the exact brand, model, condition, packaging and permitted source. That turns a vague quality conversation into a standard the batch can be tested against.",
          "Keep the approved reference sample, its label photos and the supplier's written statement together. If the bulk goods differ, you need to show exactly what changed and when."
        ]
      },
      {
        heading: "Nine checks that belong in the batch record",
        bullets: [
          "Confirm model, serial format, region and storage or power rating against the approved specification.",
          "Photograph labels, seals and packaging from the same batch, not from a marketing image.",
          "Compare weight, finish, screws, ports and internal layout where the product can be opened safely.",
          "Look for wear around charging ports, buttons, screen edges and screw heads on supposedly new devices.",
          "Check whether serial numbers, IMEI records and packaging labels agree with one another.",
          "Inspect chip markings and component placement against a known-good reference, not a search result.",
          "Test the promised functions and record any model, firmware or capacity mismatch.",
          "Ask for batch-level purchase records that can be tied to the quoted goods.",
          "Quarantine the SKU while any material inconsistency remains unresolved."
        ],
        takeaway: "The goal is not to declare a product fake on appearance alone. It is to create enough evidence to approve, reject or escalate the batch."
      },
      {
        heading: "Treat refurbished stock as a different SKU",
        paragraphs: [
          "A refurbished device can be perfectly suitable for one channel and unacceptable for another. Marketplace listings, retail shelves and warranty obligations may demand new stock, original packaging or a documented grading standard.",
          "Decide which conditions are allowed before sourcing. If renewed or repaired goods are prohibited, put that in the buying brief and inspection checklist rather than relying on a chat message."
        ]
      }
    ]
  },
  {
    slug: "huaqiangbei-first-buyer-guide",
    category: "sourcing-sampling",
    title: "A first-time buyer's guide to Huaqiangbei",
    excerpt: "What the market is actually like, where small mixed orders fit and how to prepare a buying brief before you visit or send an agent.",
    date: "Nov 8, 2026",
    dateISO: "2026-11-08",
    readTime: "7 min read",
    tags: ["Huaqiangbei", "Shenzhen market", "first order", "small-B buyers"],
    sections: [
      {
        heading: "Start with a buying brief, not a shopping list",
        paragraphs: [
          "Huaqiangbei is a dense electronics market district, not a single building or supplier directory. Two stalls can sell products with the same name but different chips, connectors, packaging, warranty terms and stock positions.",
          "Separate every item into one of three groups: confirmed specification, reference image or open question. That keeps a market run from turning into a collection of screenshots with no comparable product data."
        ],
        bullets: [
          "Include model, compatibility, target quantity and packaging format.",
          "State whether the product must be original, OEM-compatible or aftermarket.",
          "Record a target landed cost, not only the supplier unit price."
        ]
      },
      {
        heading: "Where a small mixed order fits",
        paragraphs: [
          "Small orders usually combine market stalls, local distributors and specialist factories. The right route depends on whether speed, low MOQ, consistency or replenishment matters most.",
          "For a first order, focus on a related group of SKUs. A clear list of 15–40 products produces a more reliable comparison than a catalogue of unrelated electronics."
        ]
      },
      {
        heading: "Plan the handoff before buying",
        paragraphs: [
          "Decide early how goods will be received, counted, inspected, labelled and packed. Small cartons from several suppliers become difficult to manage when the purchase record stops at the buying conversation.",
          "If the order is going to Amazon FBA or a 3PL, confirm label and carton requirements before procurement. Packaging problems found after dispatch are usually more expensive than those caught at the receiving bench."
        ],
        takeaway: "A useful market visit ends with a comparable record for every SKU, not just a phone full of product photos."
      }
    ]
  },
  {
    slug: "48-hour-sample-test",
    category: "sourcing-sampling",
    title: "The 48-hour sample test for chargers, cables and cases",
    excerpt: "A grounded sequence for checking fit, function, packaging and version consistency before a first mixed order.",
    date: "Nov 6, 2026",
    dateISO: "2026-11-06",
    readTime: "8 min read",
    tags: ["sample testing", "QC", "phone cases", "chargers", "cables"],
    sections: [
      {
        heading: "Hours 0–4: intake and identity",
        paragraphs: [
          "Log each sample against its supplier, SKU and quoted version. Photograph the product, label and included accessories before testing. A short or mismatched sample is an early supplier signal worth recording.",
          "Confirm that the item is the one that was actually quoted. Similar product names often hide different connectors, phone models or packaging."
        ]
      },
      {
        heading: "Hours 4–24: test the real use case",
        bullets: [
          "Cases: fit an actual device and test buttons, ports, camera openings and magnetic accessories.",
          "Chargers: confirm connector, plug type, markings and basic charging behaviour with a compatible device.",
          "Cables: check connector fit, charging or data function, strain relief and the approved length and rating.",
          "Packaging: confirm box, insert, language and barcode requirements if the item will be sold as a finished product."
        ],
        paragraphs: [
          "Use the customer's real setup rather than the supplier demo. A case may fit a bare phone but fail with a lens protector. A charger may power one device but still fail the buyer's plug or certification requirements."
        ]
      },
      {
        heading: "Hours 24–48: score and correct",
        paragraphs: [
          "Give every sample a clear result: pass, fixable issue or fail. Send fixable issues back with photos and a specific question. A vague complaint usually produces a vague answer.",
          "If a supplier cannot explain or correct a material difference, compare a second source before committing to bulk."
        ],
        takeaway: "A sample test is not a beauty contest. It is a documented comparison between the approved product and the version you can actually reorder."
      }
    ]
  },
  {
    slug: "compare-huaqiangbei-prices",
    category: "sourcing-sampling",
    title: "How to compare Huaqiangbei quotes without buying the wrong product",
    excerpt: "A lower quote means very little until model, accessories, warranty and quantity break are compared on the same basis.",
    date: "Nov 3, 2026",
    dateISO: "2026-11-03",
    readTime: "6 min read",
    tags: ["price comparison", "supplier quotes", "product versions", "landed cost"],
    sections: [
      {
        heading: "Normalize the quote first",
        paragraphs: [
          "The first price you see is rarely the price you can compare. One stall may quote the product alone; another may include a cable, retail box, adapter or local delivery. One may quote a current model while another is clearing an older version.",
          "Use the same fields for every supplier so assumptions are visible before anyone talks about which quote is cheaper."
        ],
        bullets: [
          "Exact model and version, with a photo of the product label.",
          "Included accessories and retail packaging.",
          "Quantity break, stock availability and lead time.",
          "Sample cost, replacement terms and warranty.",
          "Connector, plug, voltage or device compatibility."
        ]
      },
      {
        heading: "Separate price from cost",
        paragraphs: [
          "A product that costs $0.15 less may require repacking, a substitute accessory or a higher minimum order. Those costs belong in the comparison even when they occur after the supplier quote.",
          "Add estimated freight, packaging, inspection time and expected correction cost. For a first order, the cheapest quote is often the one with the fewest unresolved unknowns."
        ]
      },
      {
        heading: "Ask what changed",
        paragraphs: [
          "When a quote moves quickly, ask which input changed. A lower price may reflect a different chipset, thinner material or fewer accessories. A higher price may include a tested version, retail-ready packing or a more reliable replenishment source.",
          "Attach the answer to the SKU record. That makes later price changes easier to evaluate and prevents silent substitutions."
        ],
        takeaway: "Compare quotations line by line and assumption by assumption. Price is useful only when the underlying product and delivery scope are equivalent."
      }
    ]
  },
  {
    slug: "spot-counterfeit-chargers",
    category: "fake-vs-real",
    title: "How to spot a counterfeit charger before it reaches your customers",
    excerpt: "The checks that separate a genuine-looking sample from a verifiable product: markings, packaging, behaviour and supplier evidence.",
    date: "Oct 28, 2026",
    dateISO: "2026-10-28",
    readTime: "8 min read",
    tags: ["counterfeit", "chargers", "compliance", "product verification"],
    sections: [
      {
        heading: "Start with the marketing claim",
        paragraphs: [
          "A “genuine” charger claim is not evidence. Ask which brand, model, certification and source the product is supposed to have. Confirm the answer in writing before comparing samples.",
          "Counterfeit electronics can look convincing in a product photo. Packaging, print quality, markings and accessories can also be copied. The review needs to combine visual checks with supplier records and functional evidence."
        ]
      },
      {
        heading: "Visual and packaging red flags",
        bullets: [
          "Inconsistent brand spelling, model number or label layout.",
          "Security or certification marks that cannot be checked against the claimed source.",
          "Packaging that does not match the promised market or model.",
          "Accessories and manuals that differ between supposedly identical samples.",
          "A price far below several unrelated suppliers without a clear explanation."
        ]
      },
      {
        heading: "Verify behaviour and documentation",
        paragraphs: [
          "Where it is safe and appropriate, compare rated output, connector and basic charging behaviour against the approved specification. A visual inspection alone is not proof of electrical safety or certification.",
          "Request supplier invoices, batch-level product photos and the certification evidence the buyer needs. If documents cannot be tied to the actual item, treat the claim as unverified."
        ],
        takeaway: "Counterfeit risk is reduced by evidence, not confidence. Match the item, source and documents before approving a shipment."
      }
    ]
  },
  {
    slug: "refurbished-oem-original",
    category: "fake-vs-real",
    title: "Refurbished, OEM or original: what are you actually buying?",
    excerpt: "A buyer-friendly framework for separating product condition, manufacturing source and the language suppliers use.",
    date: "Oct 21, 2026",
    dateISO: "2026-10-21",
    readTime: "7 min read",
    tags: ["refurbished", "OEM", "original products", "supplier verification"],
    sections: [
      {
        heading: "Three different questions",
        paragraphs: [
          "“Refurbished” describes condition. “OEM” describes a manufacturing relationship. “Original” suggests the item came from the brand owner's expected supply chain. These words are often used together, but they do not mean the same thing.",
          "Ask the supplier to answer each question separately: what is the product, where did it come from, and what condition or packaging will the buyer receive?"
        ]
      },
      {
        heading: "What useful evidence looks like",
        bullets: [
          "Batch-level photos of product labels, serials or packaging where applicable.",
          "A written statement of condition, included accessories and warranty.",
          "A supplier invoice or transfer record tied to the quoted item.",
          "Consistency between the sample, expected market and retail packaging.",
          "A clear return path if the batch does not match the approved reference."
        ]
      },
      {
        heading: "Judge the risk in your sales channel",
        paragraphs: [
          "A product that is acceptable for internal testing may be inappropriate for an Amazon listing or retail shelf. The intended channel changes the evidence threshold.",
          "For customer-facing products, decide in advance whether used, refurbished or OEM-compatible goods are acceptable. If they are not, write the prohibition into the buying brief."
        ],
        takeaway: "Define the permitted condition and source before procurement. Ambiguous labels become expensive once the goods reach a marketplace or customer."
      }
    ]
  },
  {
    slug: "mixed-order-qc-checklist",
    category: "qc-inspection",
    title: "The SKU-level QC checklist for mixed supplier orders",
    excerpt: "A practical receiving and inspection sequence for orders containing several suppliers, product types and quantity breaks.",
    date: "Oct 14, 2026",
    dateISO: "2026-10-14",
    readTime: "9 min read",
    tags: ["QC checklist", "mixed orders", "SKU inspection", "supplier receipts"],
    sections: [
      {
        heading: "Receive against the purchase record",
        paragraphs: [
          "Every supplier delivery should be checked against its own purchase record before goods are mixed with the rest of the order. Record the supplier, delivery time, carton count and SKU quantities.",
          "A short or unexpected delivery is easier to resolve before the packaging is opened and the source becomes unclear."
        ]
      },
      {
        heading: "Inspect by risk, not by carton order",
        bullets: [
          "Quantity and SKU identity for every line.",
          "Model, version, connector and pairing with the intended device.",
          "Appearance, finish and visible defects.",
          "Accessories, manuals and retail packaging.",
          "Functional checks appropriate to the product category.",
          "Labels, barcodes and marketplace-specific preparation."
        ]
      },
      {
        heading: "Approve before packing",
        paragraphs: [
          "For mixed orders, the practical release point is the buyer's review of counts, exceptions and packing evidence. Once several suppliers are consolidated into one carton, correcting a small SKU issue becomes much harder.",
          "The final record should connect the purchase, inspection result and dispatch decision. That is more useful than a gallery of product photos with no order context."
        ],
        takeaway: "Mixed-order QC works when every SKU has an identity, a result and a decision. The carton should never be the first place those details meet."
      }
    ]
  },
  {
    slug: "aql-pre-shipment-inspection",
    category: "qc-inspection",
    title: "AQL for small importers: set an inspection standard you can enforce",
    excerpt: "How to choose a practical sampling level, define major and minor defects, and turn an AQL result into a clear release decision.",
    date: "Oct 7, 2026",
    dateISO: "2026-10-07",
    readTime: "8 min read",
    tags: ["AQL", "pre-shipment inspection", "defect classification", "QC standard"],
    sections: [
      {
        heading: "Agree on the standard before production",
        paragraphs: [
          "AQL, or acceptable quality limit, is a sampling framework. It does not make a product perfect or replace a product specification. Its value comes from agreeing in advance how many units will be checked and which defects are serious enough to trigger action.",
          "For a small first order, the inspection plan should reflect product risk. A cosmetic accessory and a powered electronics product should not share the same definition of a critical defect."
        ]
      },
      {
        heading: "Classify defects in plain language",
        bullets: [
          "Critical: creates a safety, legal or non-functional risk and normally requires rejection or escalation.",
          "Major: makes the product unsellable, unusable or materially different from the approved version.",
          "Minor: affects appearance or presentation without changing safe function or the customer's core use.",
          "Observational: a process concern that should be recorded even if the batch is released."
        ],
        paragraphs: [
          "Use photos and approved references for anything subjective. Words such as “scratch,” “loose” and “colour difference” need a measurable threshold if they are going to lead to a consistent decision."
        ]
      },
      {
        heading: "Turn the report into a release decision",
        paragraphs: [
          "An inspection report should show the sample size, defects found, relevant photos and the quantity affected. The buyer can then choose to release, rework, replace or re-inspect.",
          "Do not reduce the decision to a single pass or fail label. The useful question is whether the remaining risk is acceptable for this order and this sales channel."
        ],
        takeaway: "A good AQL standard is specific enough to enforce and practical enough to use. Define the defects before the factory has an incentive to interpret them."
      }
    ]
  },
  {
    slug: "read-qc-inspection-report",
    category: "qc-inspection",
    title: "How to read a pre-shipment inspection report before you approve",
    excerpt: "The four details that tell you whether an inspection actually supports a release decision, even when the headline result says passed.",
    date: "Sep 30, 2026",
    dateISO: "2026-09-30",
    readTime: "7 min read",
    tags: ["inspection report", "pre-shipment QC", "release decision", "buyer review"],
    sections: [
      {
        heading: "Check sample coverage before the result",
        paragraphs: [
          "A pass result is only meaningful if the inspector examined the right units. Confirm the order quantity, sample size, carton selection and whether the inspection covered every SKU in the shipment.",
          "For mixed orders, a detailed result for one high-value line does not tell you anything about the other cartons unless those lines were sampled too."
        ]
      },
      {
        heading: "Read the exceptions, not only the score",
        bullets: [
          "How many units were affected and who selected them?",
          "Which approved specification or reference does each defect violate?",
          "Do the photos clearly show the issue and the label tying it to a SKU?",
          "Was the supplier given a chance to correct the defect, and was the correction rechecked?"
        ]
      },
      {
        heading: "Confirm what happens next",
        paragraphs: [
          "An inspection should end with a documented action: release the lot, hold specific cartons, replace affected units, rework and re-inspect, or escalate to the buyer.",
          "Keep the report with the purchase and packing records. That preserves the evidence trail if a customer complaint or marketplace issue appears later."
        ],
        takeaway: "A useful report connects the defect to a quantity, a decision and a next step. A headline pass without those details is not enough to release inventory."
      }
    ]
  },
  {
    slug: "ddp-vs-fob-exw",
    category: "logistics-ddp",
    title: "DDP vs FOB vs EXW: landed-cost math for small importers",
    excerpt: "A worked framework for comparing incoterms after freight, duty, customs and final-mile costs have been included.",
    date: "Sep 23, 2026",
    dateISO: "2026-09-23",
    readTime: "9 min read",
    tags: ["DDP", "FOB", "EXW", "landed cost", "customs"],
    sections: [
      {
        heading: "Begin with the cost you are trying to compare",
        paragraphs: [
          "The supplier price is not the landed cost. Landed cost includes the product, freight, insurance where relevant, duties and taxes, customs handling, consolidation and delivery to the final destination.",
          "DDP, FOB and EXW place responsibility at different points in that chain. Comparing the labels without comparing the included costs can create a false saving."
        ]
      },
      {
        heading: "Use one worked-cost template",
        bullets: [
          "Product cost at the actual quantity and packaging level.",
          "Export handling, freight and insurance.",
          "Duty rate and the value used for customs assessment.",
          "Brokerage, port or airport fees and destination handling.",
          "Final-mile delivery, appointment fees and any returns reserve.",
          "Inspection, repacking, labels and financing costs."
        ],
        paragraphs: [
          "Run the same template for every quote. If a supplier cannot explain what is included in DDP, ask for a cost breakdown rather than treating the delivered price as automatically safer."
        ]
      },
      {
        heading: "Choose based on control and risk",
        paragraphs: [
          "DDP is convenient because the seller handles much of the route, but the buyer should still understand the declared value, destination charges and delivery scope. FOB or EXW can offer more control, but the buyer must have a workable customs and freight plan.",
          "For a first small order, predictability often matters more than the lowest theoretical freight rate. A slightly higher all-in quote with clear exceptions can be the better commercial choice."
        ],
        takeaway: "Compare incoterms as service scopes, not magic discounts. The right option is the one whose total cost and responsibility map are understood by both sides."
      }
    ]
  },
  {
    slug: "duties-ior-first-mile",
    category: "logistics-ddp",
    title: "Duties, IOR and first-mile freight: what small importers must decide",
    excerpt: "A plain-English guide to the customs decisions that often appear only after a supplier has quoted the product.",
    date: "Sep 16, 2026",
    dateISO: "2026-09-16",
    readTime: "8 min read",
    tags: ["import duties", "IOR", "customs clearance", "first-mile freight"],
    sections: [
      {
        heading: "Know who is responsible for import",
        paragraphs: [
          "An importer of record, or IOR, is the party legally responsible for the import entry and related obligations. Depending on the route and service model, this may be the buyer's company, a licensed intermediary or another agreed party.",
          "Do not assume that a delivered quote removes the need to understand this role. Ask who will clear the goods, whose details appear on the entry and who receives any customs question."
        ]
      },
      {
        heading: "Build a duty and tax reserve",
        bullets: [
          "Classify the product correctly; similar-looking items can carry different duty rates.",
          "Confirm the customs value and currency used in the quote.",
          "Check whether duty, import tax and brokerage are included or billed later.",
          "Plan for inspection, storage or reclassification costs if documents are incomplete.",
          "Keep commercial invoices, packing lists and product records consistent."
        ]
      },
      {
        heading: "Connect first-mile freight to the whole order",
        paragraphs: [
          "First-mile cost depends on pickup location, carton dimensions, weight, consolidation and timing. Buying from several suppliers can reduce product cost while adding collection and handling complexity.",
          "Decide early whether suppliers will deliver to one consolidation point or whether each shipment will move separately. That choice changes both the freight quote and the amount of coordination the buyer must own."
        ],
        takeaway: "Customs and first-mile decisions belong in the sourcing plan, not the final week before dispatch. Clear responsibility prevents expensive surprises."
      }
    ]
  },
  {
    slug: "consolidate-fba-3pl",
    category: "logistics-ddp",
    title: "How to consolidate purchases for FBA and 3PL receiving",
    excerpt: "Plan cartons, labels and handoffs before buying so a multi-supplier order arrives ready for the next step.",
    date: "Sep 9, 2026",
    dateISO: "2026-09-09",
    readTime: "8 min read",
    tags: ["consolidation", "Amazon FBA", "3PL", "carton planning", "packing"],
    sections: [
      {
        heading: "Confirm the receiving rules first",
        paragraphs: [
          "Amazon FBA and 3PL providers have different requirements for labels, carton weight, product packaging, poly bags and shipment documentation. Confirm the applicable rules before procurement, not after the goods are packed.",
          "A mixed order may need several shipment plans even when the products were bought as one project. Carton logic should follow destination and marketplace requirements."
        ]
      },
      {
        heading: "Build a carton map",
        bullets: [
          "Which SKUs belong to each destination or shipment plan.",
          "Units per carton and total carton weight.",
          "Which items must remain separate because of fragility or packaging.",
          "Barcode, FNSKU or 3PL label placement.",
          "Photos and count confirmation before sealing."
        ]
      },
      {
        heading: "Close the loop before dispatch",
        paragraphs: [
          "Review product counts, labels, packing photos and shipping documents against the approved plan. Confirm the recipient and shipment details before release.",
          "Keep supplier receipts linked to the relevant SKU and quantity, then create a separate packing record for the final carton. A clean handoff helps the seller, marketplace and receiving warehouse work from the same facts."
        ],
        takeaway: "Consolidation is successful when the carton, the product record and the receiving plan agree. Packing is the final proof point, not just the last task."
      }
    ]
  }
];

export function getBlogCategory(slug: BlogCategorySlug) {
  return blogCategories.find((category) => category.slug === slug);
}

export function getBlogPost(slug: string | undefined) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostSearchText(post: BlogPost) {
  const category = getBlogCategory(post.category);
  const text = [
    post.title,
    post.excerpt,
    post.tags.join(" "),
    category?.name ?? "",
    category?.description ?? "",
    ...post.sections.flatMap((section) => [
      section.heading,
      ...(section.paragraphs ?? []),
      ...(section.bullets ?? []),
      section.takeaway ?? ""
    ])
  ].join(" ").toLowerCase();

  const aliases = text
    .replace(/\bcounterfeit\b/g, "fake replica")
    .replace(/\brefurbished\b/g, "renewed used")
    .replace(/\boriginal\b/g, "genuine authentic")
    .replace(/\bquality control\b/g, "qc inspection")
    .replace(/\bconsolidat(?:e|ed|ion)\b/g, "combine merge")
    .replace(/\bduties\b/g, "tariffs taxes")
    .replace(/\biOR\b/gi, "importer of record");

  return `${text} ${aliases}`;
}
