"use client";

import { motion } from "framer-motion";
import ReaderView from "@/components/ReaderView";
import { useSiteData } from "@/hooks/useSiteData";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function CookiePage() {
  const { cookieData } = useSiteData();
  return (
    <ReaderView>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.h1
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1D1D1F] text-center"
        >
          {cookieData.title}
        </motion.h1>

        {cookieData.sections.map((section, index) => (
          <motion.div key={index}>
            {index > 0 && <div className="hairline mt-8 mb-8" />}
            <h2
              className={`text-lg sm:text-xl font-bold text-[#1D1D1F] ${
                index === 0 && !section.content ? "text-center mt-8" : ""
              }`}
            >
              {section.title}
            </h2>
            {section.content && (
              <p className="mt-4 text-base text-[#1D1D1F]/80 leading-[1.75]">{section.content}</p>
            )}
            {section.types && (
              <div className="mt-4 space-y-4">
                {section.types.map((type, tIndex) => (
                  <div key={tIndex} className="bg-white rounded-2xl p-5 shadow-apple">
                    <h3 className="font-bold text-[#1D1D1F] text-sm">{type.name}</h3>
                    <p className="mt-1 text-sm text-[#86868B] leading-relaxed">{type.desc}</p>
                  </div>
                ))}
              </div>
            )}
            {section.purposes && (
              <ol className="mt-4 space-y-2">
                {section.purposes.map((purpose, pIndex) => (
                  <li key={pIndex} className="flex items-start gap-2 text-base text-[#1D1D1F]/80 leading-[1.75]">
                    <span className="text-[#007AFF] font-bold mt-0.5 shrink-0">{pIndex + 1}.</span>
                    {purpose}
                  </li>
                ))}
              </ol>
            )}
          </motion.div>
        ))}
      </motion.div>
    </ReaderView>
  );
}
