import { auth, db } from '../index';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { getAnalytics, logEvent } from 'firebase/analytics';

export const LoginWrapper = ({ children }) => {
    const [user, loading, error] = useAuthState(auth);
    const analytics = getAnalytics(); // Get Analytics instance

    // Log analytics event for login
    const logAnalyticsEvent = (user) => {
        logEvent(analytics, 'login', {
            method: 'Google',
            email: user.email,
            uid: user.uid,
        });
    };

    // Check if the user is already authorized in Firestore
    const isAuthorizedUser = async (email) => {
        const authorizedUsersRef = collection(db, 'authorized_users');
        const q = query(authorizedUsersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty; // True if user exists in the collection
    };

    // Add a new user to the 'authorized_users' collection in Firestore
    const addUserToDatabase = async (email) => {
        const authorizedUsersRef = collection(db, 'authorized_users');
        await addDoc(authorizedUsersRef, { email });
    };

    // Prompt the user for a password to register them in the database
    const promptForPassword = async () => {
        const password = window.prompt('Enter the registration password:');
        return password === 'lizard'; // Replace with your desired password
    };

    // Handle login
    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (user.email.slice(-7) === 'asu.edu') {
                const isAuthorized = await isAuthorizedUser(user.email);
                if (!isAuthorized) {
                    const passwordCorrect = await promptForPassword();
                    if (passwordCorrect) {
                        await addUserToDatabase(user.email); // Register user
                        alert('Registered successfully!');
                    } else {
                        await signOut(auth);
                        alert('Invalid password. Not authorized.');
                        return;
                    }
                }
                logAnalyticsEvent(user); // Log analytics after authorization
                alert('User logged in successfully!');
            } else {
                alert('Please use your ASU email.');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed: ' + error.message);
        }
    };

    // Display appropriate UI based on user state
    if (user && user.email.endsWith('@asu.edu')) {
        return children; // Render children if the user is authenticated
    } else if (loading) {
        return (
            <motion.div className="font-openSans absolute bg-white inset-0 flex flex-col items-center justify-around">
                <motion.p className="text-black text-3xl">Authenticating user...</motion.p>
            </motion.div>
        );
    } else if (error) {
        return (
            <motion.div className="font-openSans absolute bg-white inset-0 flex flex-col items-center justify-around">
                <motion.p className="text-black text-3xl">
                    Error signing in: {error.message}
                </motion.p>
            </motion.div>
        );
    } else {
        return (
            <motion.div className="font-openSans absolute bg-white inset-0 flex flex-col items-center justify-around">
                <motion.h1 className="text-black text-4xl">Welcome to Your App</motion.h1>
                <p className="text-black text-xl text-center">
                    Logged in as {user ? user.email : 'none'}
                </p>
                <motion.p className="text-black text-lg text-center">
                    Login with your ASU Google account to continue
                </motion.p>
                <motion.button
                    className="text-black border-asu-maroon text-2xl w-1/2 py-2 border-2 rounded-2xl"
                    onClick={handleLogin} // Call handleLogin on button click
                >
                    Login
                </motion.button>
            </motion.div>
        );
    }
};

export const LogoutButton = () => {
    const handleLogout = async () => {
        try {
            await signOut(auth); // Sign out the user
            alert('You have logged out successfully!');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <motion.button
            className="text-black border-asu-maroon text-2xl w-1/2 py-2 border-2 rounded-2xl"
            onClick={handleLogout}
        >
            Logout
        </motion.button>
    );
};

// Old implementation
/*
import { auth } from '../index';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { motion } from 'framer-motion';

export const LoginWrapper = ({ children }) => {
    const [user, loading, error] = useAuthState(auth);

    if (user && user.email.slice(-7) === 'asu.edu') {
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
                <p className='text-black text-xl text-center'>Logged in as {user ? user.email : 'none'}</p>
                <motion.p className="text-black text-lg text-center">
                    Login with your ASU Google account to continue
                </motion.p>
                <motion.button
                    className="text-black border-asu-maroon text-2xl w-1/2 py-2 border-2 rounded-2xl"
                    onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
                >
                    Login
                </motion.button>
            </motion.div>
        );
    }
};

*/

/*
// Tims implementation
// Initialize Firestore
const db = getFirestore();

export class Authenticator {
    constructor() {
        this.user = null; // Will hold the current user after login
    }

    // Check if the user is already authorized in Firestore
    async isAuthorizedUser(email) {
        const authorizedUsersRef = collection(db, 'authorized_users');
        const q = query(authorizedUsersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty; // True if user exists in the collection
    }

    // Add a new user to the 'authorized_users' collection in Firestore
    async addUserToDatabase(email) {
        const authorizedUsersRef = collection(db, 'authorized_users');
        await addDoc(authorizedUsersRef, { email });
    }

    // Prompt the user for a password to register them in the database
    async promptForPassword() {
        const password = window.prompt('Enter the registration password:');
        if (password === 'lizard') {
            return true; // Password matches
        } else {
            alert('Invalid password. You are not authorized.');
            return false;
        }
    }

    // Login method with user validation
    async login() {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const result = await signInWithPopup(auth, provider);
            this.user = result.user; // Assign the logged-in user

            const email = this.user.email;
            const isAuthorized = await this.isAuthorizedUser(email);

            if (!isAuthorized) {
                const passwordCorrect = await this.promptForPassword();
                if (passwordCorrect) {
                    await this.addUserToDatabase(email); // Register the user
                    alert('You have been registered successfully!');
                } else {
                    await this.logout(); // Logout if password is incorrect
                    return false;
                }
            }

            console.log('User successfully logged in and validated:', email);
            return true; // Successful login
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    }

    // Logout function to clear cookies and local storage
    async logout() {
        try {
            await signOut(auth);
            document.cookie.split(';').forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, '')
                    .replace(/=./, '=;expires=' + new Date().toUTCString() + ';path=/');
                });
                localStorage.clear();
                window.location.href = '/login'; // Redirect to login page
            } catch (error) {
                console.error('Logout failed:', error);
            }
        }
    }

*/
