
import React from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { SubHeading } from "../../components";
import { images } from "../../constants";

import "./Heritage.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const easeSmooth = [0.65, 0, 0.35, 1] as const;

const translations = {
  en: {
    subtitle: "Our Heritage",
    title: "A Family Recipe\nA Legacy to Share",
    description:
      "Discover more about Old Klang House, our family heritage, the story behind our recipe, and our journey from Klang to Indonesia and beyond in our company profile.",
    button: "View Company Profile",
    close: "Close company profile",
  },
  id: {
    subtitle: "Warisan Kami",
    title: "Resep Keluarga\nWarisan untuk Dibagikan",
    description:
      "Kenali lebih jauh Old Klang House, warisan keluarga kami, kisah di balik resep, serta perjalanan kami dari Klang ke Indonesia dan sekitarnya melalui profil perusahaan kami.",
    button: "Lihat Profil Perusahaan",
    close: "Tutup profil perusahaan",
  },
};

type Props = {
  language: "en" | "id";
};

const Heritage: React.FC<Props> = ({ language }) => {
  const ref = React.useRef<HTMLElement | null>(null);
  const pdfContainerRef = React.useRef<HTMLDivElement | null>(null);

  const isInView = useInView(ref, {
    once: true,
    amount: 0.2,
  });

  const t = translations[language];

  const [showProfile, setShowProfile] = React.useState(false);
  const [numPages, setNumPages] = React.useState(0);
  const [pdfWidth, setPdfWidth] = React.useState(700);

  React.useEffect(() => {
    if (!showProfile) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowProfile(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const container = pdfContainerRef.current;

    let observer: ResizeObserver | undefined;

    if (container) {
      const updateWidth = (width: number) => {
        setPdfWidth(Math.max(200, Math.floor(width)));
      };

      updateWidth(container.clientWidth);

      observer = new ResizeObserver(([entry]) => {
        if (entry) {
          updateWidth(entry.contentRect.width);
        }
      });

      observer.observe(container);
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      observer?.disconnect();
    };
  }, [showProfile]);

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  return (
    <section
      ref={ref}
      className="app__heritage app__bg section__padding"
      id="heritage"
    >
      <div className="app__heritage-container">
        <motion.div
          className="app__heritage-content"
          initial={{ opacity: 0, x: -48 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: easeSmooth }}
        >
          <SubHeading title={t.subtitle} />

          <h2
            className="app__heritage-title"
            style={{ whiteSpace: "pre-line" }}
          >
            {t.title}
          </h2>

          <p className="p__opensans app__heritage-description">
            {t.description}
          </p>

          <button
            type="button"
            className="custom__button app__heritage-button"
            onClick={() => setShowProfile(true)}
          >
            <span aria-hidden="true">▤</span>
            {t.button}
          </button>
        </motion.div>

        <motion.div
          className="app__heritage-visual"
          initial={{ opacity: 0, x: 48 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{
            duration: 1,
            ease: easeSmooth,
            delay: 0.12,
          }}
        >
          <img
            src={images.profileOkh}
            alt="Old Klang House Company Profile"
            className="app__heritage-image"
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {showProfile && (
          <motion.div
            className="heritage__pdf-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseProfile}
          >
            <motion.div
              className="heritage__pdf-popup"
              initial={{
                opacity: 0,
                scale: 0.92,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.92,
                y: 30,
              }}
              transition={{
                duration: 0.35,
                ease: easeSmooth,
              }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Old Klang House Company Profile"
            >
              <button
                type="button"
                className="heritage__pdf-close"
                onClick={handleCloseProfile}
                aria-label={t.close}
              >
                ×
              </button>

              <div
                className="heritage__pdf-viewer"
                ref={pdfContainerRef}
              >
                <Document
                  file={images.companyProfile}
                  onLoadSuccess={({ numPages: totalPages }) => {
                    setNumPages(totalPages);
                  }}
                  onLoadError={(error) => {
                    console.error(
                      "Failed to load company profile PDF:",
                      error
                    );
                  }}
                  loading={
                    <p className="heritage__pdf-status">
                      Loading company profile...
                    </p>
                  }
                  error={
                    <p className="heritage__pdf-status">
                      Unable to load the PDF. Please try again.
                    </p>
                  }
                  noData={
                    <p className="heritage__pdf-status">
                      Company profile PDF is unavailable.
                    </p>
                  }
                >
                  {Array.from(
                    { length: numPages },
                    (_, index) => (
                      <Page
                        key={`company-profile-page-${index + 1}`}
                        pageNumber={index + 1}
                        width={pdfWidth}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="heritage__pdf-page"
                      />
                    )
                  )}
                </Document>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Heritage;
