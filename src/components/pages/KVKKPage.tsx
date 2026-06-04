"use client";

import { motion } from "framer-motion";
import ReaderView from "@/components/ReaderView";
import { useSiteData } from "@/hooks/useSiteData";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function KVKKPage() {
  const { kvkkData } = useSiteData();
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
          {kvkkData.title}
        </motion.h1>

        {kvkkData.sections.map((section, index) => (
          <motion.div key={index}>
            {index > 0 && <div className="hairline mt-8 mb-8" />}
            <h2
              className={`text-lg sm:text-xl font-bold text-[#1D1D1F] ${
                index === 0 ? "text-center mt-8" : ""
              }`}
            >
              {section.title}
            </h2>
            {section.content && (
              <p className="mt-4 text-base text-[#1D1D1F]/80 leading-[1.75]">{section.content}</p>
            )}
            {section.rights && (
              <ul className="mt-4 space-y-2">
                {section.rights.map((right, rIndex) => (
                  <li key={rIndex} className="flex items-start gap-2 text-base text-[#1D1D1F]/80 leading-[1.75]">
                    <span className="text-[#007AFF] mt-1 shrink-0">&bull;</span>
                    {right}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        ))}

        <div className="hairline mt-8 mb-8" />

        <motion.div variants={fadeUp}>
          <p className="text-base text-[#1D1D1F]/80 leading-[1.75]">
            Yukarıda yer alan haklarınızı {kvkkData.address} adresine ıslak imzalı dilekçe ile elden
            veya iadeli taahhütlü mektupla ve kimlik fotokopileriyle göndererek kullanabilirsiniz.
            Kişisel veri sahibinin kendisi dışında bir kişinin talepte bulunması için konuya ilişkin
            olarak kişisel veri sahibi tarafından başvuruda bulunacak kişi adına düzenlenmiş özel
            vekâletname bulunmalıdır.
          </p>
        </motion.div>
      </motion.div>
    </ReaderView>
  );
}
