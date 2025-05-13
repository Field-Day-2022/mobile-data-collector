import { useAtom } from 'jotai';
import { notificationText } from '../utils/jotai';
import { useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

export default function Notification() {
    const [notification, setNotification] = useAtom(notificationText);

    const controls = useAnimationControls();

    useEffect(() => {
        if (notification !== '') {
            controls
                .start('visible')
                .then(() => controls.start('hidden'))
                .then(() => setNotification(''));
        }
    }, [notification]);

    const containerVariant = {
        hidden: {
            scale: 0,
            y: '-100%',
            opacity: 0,
            transition: {
                delay: 1.5,
                staggerChildren: 0.03,
                delayChildren: 1,
                duration: 0.5,
            },
        },
        visible: {
            scale: 1,
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                delayChildren: 0.3,
                staggerChildren: 0.03,
            },
        },
    };

    return (
        <motion.div
            className="
        absolute
        bg-white/90
        z-50
        p-4
        rounded-2xl
        mt-1
        border-2
        border-asu-maroon
      "
            variants={containerVariant}
            animate={controls}
            initial="hidden"
        >
            <motion.p>{notification}</motion.p>
        </motion.div>
    );
}
