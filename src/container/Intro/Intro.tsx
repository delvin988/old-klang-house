import React from 'react';
import { motion, useInView } from 'framer-motion';
import { BsFillPlayFill, BsPauseFill } from 'react-icons/bs';

import { meal } from '../../constants';
import './Intro.css';

const easeSmooth = [0.65, 0, 0.35, 1] as const;

const Intro = () => {
  const [playVideo, setPlayVideo] = React.useState(false);
  const vidRef = React.useRef<HTMLVideoElement>(null);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.25 });

  // Auto-play when section is in view, pause when out of view
  React.useEffect(() => {
    const video = vidRef.current;
    if (!video) return;
    if (isInView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInView]);

  // Keep play state in sync with video when auto-play runs
  React.useEffect(() => {
    const video = vidRef.current;
    if (!video) return;
    const onPlay = () => setPlayVideo(true);
    const onPause = () => setPlayVideo(false);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, []);

  const handleCircleClick = () => {
    const video = vidRef.current;
    if (!video) return;
    setPlayVideo((prev) => !prev);
    if (playVideo) {
      video.pause();
    } else {
      video.play();
    }
  };

  return (
    <motion.div
      ref={ref}
      className="app__video"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1.2, ease: easeSmooth }}
    >
      <video
        ref={vidRef}
        src={meal}
        loop
        playsInline
        controls={false}
        muted
      />
      <div className="app__video-overlay flex__center">
        <div className="app__video-overlay_content">
          <motion.p
            className="app__video-overlay_title headtext__cormorant"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 1, ease: easeSmooth, delay: 0.2 }}
          >
            What We Believe In
          </motion.p>
          <motion.p
            className="app__video-overlay_subtitle p__opensans"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, ease: easeSmooth, delay: 0.45 }}
          >
            The art of fine dining — where every dish tells a story.
          </motion.p>
          <motion.div
            className="app__video-overlay_circle flex__center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, ease: easeSmooth, delay: 0.7 }}
            onClick={handleCircleClick}
            onKeyDown={(e) => e.key === 'Enter' && handleCircleClick()}
            role="button"
            tabIndex={0}
            aria-label={playVideo ? 'Pause video' : 'Play video'}
          >
            {playVideo ? (
              <BsPauseFill color="#fff" fontSize={30} />
            ) : (
              <BsFillPlayFill color="#fff" fontSize={30} />
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Intro;
