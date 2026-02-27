import React from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { BsInstagram, BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs';

import { SubHeading } from '../../components';
import { images } from '../../constants';
import './Gallery.css';

const easeSmooth = [0.65, 0, 0.35, 1] as const;

const GALLERY_IMAGES = [
  images.gallery01,
  images.gallery02,
  images.gallery03,
  images.gallery04,
];

const AUTO_PLAY_INTERVAL_MS = 4000;
const TRANSITION_DURATION = 0.5;

const transition = { duration: TRANSITION_DURATION, ease: easeSmooth };

// First slot (left): exits right, new image enters from right (reverse). Fade in/out.
const leftSlotVariants = {
  enter: {
    x: '100%',
    opacity: 0,
    transition,
  },
  center: {
    x: 0,
    opacity: 1,
    transition,
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition,
  },
};

// Second slot (right): exits left, new image enters from left (reverse). Fade in/out.
const rightSlotVariants = {
  enter: {
    x: '-100%',
    opacity: 0,
    transition,
  },
  center: {
    x: 0,
    opacity: 1,
    transition,
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition,
  },
};

const Gallery = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [isPaused, setIsPaused] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const n = GALLERY_IMAGES.length;
  const nextIndex = (i: number) => (i + 1) % n;
  const prevIndex = (i: number) => (i - 1 + n) % n;

  const goNext = React.useCallback(() => {
    setCurrentIndex((i) => nextIndex(i));
  }, []);

  const goPrev = React.useCallback(() => {
    setCurrentIndex((i) => prevIndex(i));
  }, []);

  React.useEffect(() => {
    const id = setInterval(() => {
      if (!isPaused) goNext();
    }, AUTO_PLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isPaused, goNext]);

  return (
    <div ref={ref} className="app__gallery flex__center">
      <motion.div
        className="app__gallery-content"
        initial={{ opacity: 0, x: -40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, ease: easeSmooth }}
      >
        <SubHeading title="Instagram" />
        <h1 className="headtext__cormorant">Photo Gallery</h1>
        <p className="p__opensans" style={{ color: '#AAAAAA', marginTop: '2rem' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Volutpat mattis ipsum turpis elit elit scelerisque egestas mu.
        </p>
        <button type="button" className="custom__button">View More</button>
      </motion.div>
      <motion.div
        className="app__gallery-images"
        initial={{ opacity: 0, x: 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, ease: easeSmooth, delay: 0.15 }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="app__gallery-slider">
          <div className="app__gallery-slots">
            {/* First slot: image slides right to disappear (fade out); new image fades in from the right */}
            <div className="app__gallery-slot app__gallery-slot--left">
              <AnimatePresence initial={false}>
                <motion.div
                  key={`left-${currentIndex}`}
                  className="app__gallery-images_card flex__center"
                  variants={leftSlotVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <img src={GALLERY_IMAGES[currentIndex]} alt="gallery" />
                  <BsInstagram className="gallery__image-icon" />
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Second slot: image slides left to disappear (fade out); new image fades in from the left */}
            <div className="app__gallery-slot app__gallery-slot--right">
              <AnimatePresence initial={false}>
                <motion.div
                  key={`right-${nextIndex(currentIndex)}`}
                  className="app__gallery-images_card flex__center"
                  variants={rightSlotVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <img src={GALLERY_IMAGES[nextIndex(currentIndex)]} alt="gallery" />
                  <BsInstagram className="gallery__image-icon" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="app__gallery-images_arrows">
          <BsArrowLeftShort className="gallery__arrow-icon" onClick={goPrev} aria-label="Previous" />
          <BsArrowRightShort className="gallery__arrow-icon" onClick={goNext} aria-label="Next" />
        </div>
      </motion.div>
    </div>
  );
};

export default Gallery;
