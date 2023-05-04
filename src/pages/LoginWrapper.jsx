import { auth } from '../index';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'framer-motion';

export const LoginWrapper = ({ children }) => {
    const [user, loading, error] = useAuthState(auth);

    // console.log(user)
    if (user) {
    // if (user && user.email.slice(-7) === 'asu.edu') {
        return children;
    } else if (loading) {
        return (
            <motion.div className="font-openSans absolute bg-white inset-0 flex flex-col items-center justify-around">
                <motion.p className="text-black text-3xl">Authenticating user...</motion.p>
            </motion.div>
        );
    } else if (error) {
        return (
            <motion.div className="font-openSans absolute bg-white inset-0 flex flex-col items-center justify-around">
                <motion.p className="text-black text-3xl">Error signing in: {error}</motion.p>
            </motion.div>
        );
    } else {
        return (
            <motion.div className="font-openSans absolute bg-white inset-0 flex flex-col items-center justify-around">
                <motion.h1 className="text-black text-4xl">Welcome to Field Day</motion.h1>
                <motion.p className="text-black text-lg text-center">
                    Login with your ASU Google account to continue
                </motion.p>
                <motion.button
                    className="text-black border-asu-maroon text-2xl w-1/2 py-2 border-2 rounded-2xl"
                    onClick={() => signInWithRedirect(auth, new GoogleAuthProvider())}
                >
                    Login
                </motion.button>
            </motion.div>
        );
    }
};
