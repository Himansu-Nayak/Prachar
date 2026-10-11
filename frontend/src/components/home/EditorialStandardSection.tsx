import React from "react";
import Image from "next/image";

interface EditorialRow {
  number: string;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
}

const EDITORIAL_ROWS: EditorialRow[] = [
  {
    number: "01",
    title: "01. Strong art direction",
    body: "One clear visual idea per section. Oversized editorial headlines, deliberate composition, generous whitespace, and a controlled palette—not lots of decorative elements.",
    imageSrc: "/editorial/art-direction.svg",
    imageAlt: "Minimalist editorial brand art direction specimen and composition layout",
  },
  {
    number: "02",
    title: "02. Real, intentional imagery",
    body: "Use professionally photographed or carefully art-directed visuals. Avoid random AI faces, generic abstract 3D objects, fake device mockups, and repetitive stock illustrations.",
    imageSrc: "/editorial/intentional-imagery.svg",
    imageAlt: "Authentic professional architectural and local-business photography with viewfinder framing",
  },
  {
    number: "03",
    title: "03. Typography and spacing",
    body: "Use a deliberate type scale, consistent alignment, readable line lengths, and precise spacing. These details often matter more than visual effects.",
    imageSrc: "/editorial/typography-spacing.svg",
    imageAlt: "Elegant typography and grid-based layout showing type scale and baseline rulers",
  },
  {
    number: "04",
    title: "04. Restrained motion",
    body: "Smooth transitions, subtle scroll reveals, carefully timed image movement, and responsive interactions. Animation should support the content—not compete with it.",
    imageSrc: "/editorial/restrained-motion.svg",
    imageAlt: "Refined minimalist motion design composition and mathematical easing curve",
  },
];

export default function EditorialStandardSection() {
  return (
    <section
      id="editorial-standard"
      className="relative w-full bg-[#000000] text-[#EDEDED] py-24 sm:py-32 lg:py-40 px-4 sm:px-8 border-b border-white/10"
      aria-label="Editorial Standards and Design Language"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 lg:mb-20 gap-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#FFB703] block mb-3 font-mono">
              The Editorial Standard
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.04] font-display">
              The design language <br />
              <span className="text-neutral-500">of premium publicity</span>
            </h2>
          </div>

          <div className="max-w-md text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
            Four disciplined craft principles that guide every physical print edition and verified digital profile across Bhubaneswar.
          </div>
        </div>

        {/* Vertically Stacked Editorial Rows */}
        <div className="border-t border-white/10">
          {EDITORIAL_ROWS.map((row) => (
            <div
              key={row.number}
              className="group py-12 sm:py-16 lg:py-20 border-b border-white/10 transition-colors duration-200"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 lg:gap-16">
                {/* Left: Rounded Rectangular Thumbnail */}
                <div className="w-full sm:w-[280px] md:w-[340px] lg:w-[400px] xl:w-[440px] aspect-[16/10] shrink-0 rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0D] shadow-2xl relative">
                  <Image
                    src={row.imageSrc}
                    alt={row.imageAlt}
                    width={800}
                    height={500}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    unoptimized
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
                </div>

                {/* Right: Editorial Numbered Heading & Body */}
                <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight font-display">
                    {row.title}
                  </h3>

                  <p className="text-base sm:text-lg lg:text-xl text-neutral-300 font-normal leading-relaxed max-w-2xl font-sans">
                    {row.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Final Explanatory Closing Paragraph */}
        <div className="pt-14 sm:pt-20 lg:pt-24 max-w-3xl">
          <p className="text-base sm:text-lg lg:text-xl text-neutral-400 font-normal leading-relaxed">
            <span className="text-white font-medium">One important distinction:</span>{" "}
            4K resolution alone does not make a website premium. You need high-resolution source assets, excellent composition, sharp rendering, responsive layouts, and optimized loading.
          </p>
        </div>
      </div>
    </section>
  );
}
