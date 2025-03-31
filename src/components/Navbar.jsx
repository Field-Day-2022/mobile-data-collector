import { useAtom } from 'jotai';
import { currentPageName, currentFormName, currentSessionData } from '../utils/jotai';
import { useRef } from 'react';
import { AnimatePresence, motion, useCycle } from 'framer-motion';

export default function Navbar() {
    const [currentPage, setCurrentPage] = useAtom(currentPageName);
    const [currentForm, setCurrentForm] = useAtom(currentFormName);
    const [currentData] = useAtom(currentSessionData);

    // https://codesandbox.io/s/framer-motion-side-menu-mx2rw?from-embed=&file=/src/Example.tsx:1027-1037
    const [isOpen, toggleOpen] = useCycle(false, true);

    const containerRef = useRef(null);

    const navigationContainerVariant = {
        open: {
            opacity: 1,
        },
        closed: {
            opacity: 0,
        },
    };

    const navItemVariant = {
        open: {
            opacity: 1,
            x: 0,
        },
        closed: {
            opacity: 0,
            x: '-10%',
            transition: {
                duration: 0.1,
            },
        },
    };

    const navUlVariant = {
        open: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
        closed: {
            opacity: 0,
        },
    };

    return (
        <motion.nav
            className="text-asu-maroon relative w-screen flex flex-row items-center"
            initial={false}
            animate={isOpen ? 'open' : 'closed'}
            ref={containerRef}
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="backgroundDiv"
                        className="fixed inset-0 z-30 bg-black/80 border-0 border-green-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => toggleOpen()}
                    />
                )}
            </AnimatePresence>
            {isOpen && (
                <motion.div
                    key="navDiv"
                    className="bg-transparent rounded-tr-xl rounded-br-xl w-full absolute top-12 z-50"
                    variants={navigationContainerVariant}
                    initial="closed"
                    animate={isOpen ? 'open' : 'closed'}
                >
                    <motion.ul
                        variants={navUlVariant}
                        initial={'closed'}
                        animate={isOpen ? 'open' : 'closed'}
                    >
                        <ListItem
                            variant={navItemVariant}
                            menuLabel={'Home'}
                            activeMenuLabel={currentPage}
                            clickHandler={() => {
                                setCurrentPage('Home');
                                setCurrentForm('');
                                toggleOpen();
                            }}
                        />
                        <ListItem
                            variant={navItemVariant}
                            menuLabel={'Search'}
                            activeMenuLabel={currentPage}
                            clickHandler={() => {
                                setCurrentPage('Search');
                                setCurrentForm('');
                                toggleOpen();
                            }}
                        />
                        <ListItem
                            variant={navItemVariant}
                            menuLabel={'Collect Data'}
                            activeMenuLabel={currentPage}
                            clickHandler={() => {
                                setCurrentPage('Collect Data');
                                if (currentData.project === '') {
                                    setCurrentForm('New Data');
                                } else {
                                    setCurrentForm('New Data Entry');
                                }
                                toggleOpen();
                            }}
                        />
                        <ListItem
                            variant={navItemVariant}
                            menuLabel={'History'}
                            activeMenuLabel={currentPage}
                            clickHandler={() => {
                                setCurrentPage('History');
                                setCurrentForm('');
                                toggleOpen();
                            }}
                        />
                        <ListItem
                            variant={navItemVariant}
                            menuLabel={'About Us'}
                            activeMenuLabel={currentPage}
                            clickHandler={() => {
                                setCurrentPage('About Us');
                                setCurrentForm('');
                                toggleOpen();
                            }}
                        />
                    </motion.ul>
                </motion.div>
            )}

            <MenuToggle isOpen={isOpen} toggle={() => toggleOpen()} />

            <motion.div className="text-lg breadcrumbs text-black ml-2 overflow-hidden">
                <ul>
                    <li>{currentPage}</li>
                    <li>{currentForm || ''}</li>
                </ul>
            </motion.div>
        </motion.nav>
    );
}

const ListItem = ({ variant, menuLabel, activeMenuLabel, clickHandler }) => {
    return (
        <motion.li
            className={
                menuLabel === activeMenuLabel
                    ? 'text-2xl px-2 py-6 bg-white border-4 border-asu-gold mx-2 mb-8 shadow-asu-gold shadow-lg rounded-xl'
                    : 'text-2xl px-2 py-6 bg-white border-2 border-asu-gold mx-2 mb-8 text-black rounded-xl'
            }
            variants={variant}
            onClick={() => clickHandler()}
        >
            <p className={menuLabel === activeMenuLabel ? 'font-bold' : ''}>{menuLabel}</p>
        </motion.li>
    );
};

const Path = ({ isOpen, ...props }) => (
    <motion.path
        fill="transparent"
        strokeWidth="3"
        strokeLinecap="round"
        {...props}
        className={isOpen ? 'stroke-asu-gold' : 'stroke-asu-maroon'}
    />
);

const MenuToggle = ({ isOpen, toggle }) => (
    <button onClick={toggle} className="p-2 z-40">
        <svg width="33" height="33" viewBox="0 0 23 23">
            <Path
                isOpen={isOpen}
                variants={{
                    closed: { d: 'M 2 2.5 L 20 2.5' },
                    open: { d: 'M 3 16.5 L 17 2.5' },
                }}
            />
            <Path
                isOpen={isOpen}
                d="M 2 9.423 L 20 9.423"
                variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                }}
                transition={{ duration: 0.1 }}
            />
            <Path
                isOpen={isOpen}
                variants={{
                    closed: { d: 'M 2 16.346 L 20 16.346' },
                    open: { d: 'M 3 2.5 L 17 16.346' },
                }}
            />
        </svg>
    </button>
);
