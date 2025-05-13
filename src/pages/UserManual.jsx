import React from 'react';
import Button from '../components/Button';

export default function UserManual({ onClose }) {
    return (
        <div className="fixed inset-0 bg-white overflow-auto z-50">
            {/* Header with back button - fixed position */}
            <div className="sticky top-0 bg-white border-b shadow-sm p-4 z-10">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <Button prompt="Back" clickHandler={onClose} />
                    <h1 className="text-xl font-semibold">User Manual</h1>
                </div>
            </div>

            {/* Main content area */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="space-y-8">
                    {/* Title section */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold mb-4">
                            Field Day Wildlife Data Collection App
                        </h1>
                        <p className="text-gray-600">Complete User Guide and Documentation</p>
                    </div>

                    {/* Introduction section */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Introduction</h2>
                        <p className="text-gray-800 leading-relaxed">
                            The Field Day project is a Wildlife Data Collection and management tool
                            designed to address field researchers' challenges, particularly those in
                            biology and ecology. The project consists of:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>A Progressive Web App (PWA) for mobile devices</li>
                            <li>A web application for larger screens</li>
                        </ul>

                        <div className="bg-blue-50 rounded-lg p-6 mt-6">
                            <h3 className="text-xl font-semibold mb-4">Key features include:</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Streamlined data collection</li>
                                <li>Offline functionality with local database caching</li>
                                <li>2-factor Google authentication</li>
                                <li>
                                    Population data collection using capture mark-recapture
                                    techniques
                                </li>
                                <li>Data management, viewing, and export capabilities</li>
                            </ul>
                        </div>
                    </section>

                    {/* Getting Started section */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Getting Started</h2>
                        <div className="bg-white rounded-lg border p-6">
                            <h3 className="text-xl font-semibold mb-4">Initial Setup and Login</h3>
                            <ol className="list-decimal pl-6 space-y-4">
                                <li>
                                    Access the PWA at{' '}
                                    <a
                                        href="https://asu-field-day-pwa.web.app/"
                                        className="text-blue-600 hover:underline"
                                    >
                                        https://asu-field-day-pwa.web.app/
                                    </a>{' '}
                                    on your mobile device
                                </li>
                                <li>Enter your handler initials (2-3 characters required)</li>
                                <li>
                                    Select your project, site, and array from the dropdown menus
                                </li>
                            </ol>

                            <div className="mt-6">
                                <img
                                    src="/manualImages/home.png"
                                    alt="Initial Data Collection Setup"
                                    className="rounded-lg shadow-md mx-auto"
                                />
                                <p className="text-center text-gray-600 mt-2">
                                    Initial data collection setup screen
                                </p>
                            </div>
                        </div>
                    </section>
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Using the Search Function</h2>
                        <div className="bg-white rounded-lg border p-6">
                            <p className="mb-4">When selecting "Search" from the menu, you can:</p>
                            <ol className="list-decimal pl-6 space-y-4">
                                <li className="space-y-2">
                                    <p>Use the dropdown filters to narrow your search:</p>
                                    <ul className="list-disc pl-6">
                                        <li>Project</li>
                                        <li>Site</li>
                                        <li>Array</li>
                                    </ul>
                                </li>
                                <li className="space-y-2">
                                    <p>Enter search terms in the "Search Database" field</p>
                                    <ul className="list-disc pl-6">
                                        <li>
                                            Simply use a + between terms to search for multiple
                                            items
                                        </li>
                                        <li>
                                            Example:{' '}
                                            <code className="bg-gray-100 px-2 py-1 rounded">
                                                ASTI+A1B2
                                            </code>{' '}
                                            will find entries containing both "ASTI" and "A1B2"
                                        </li>
                                    </ul>
                                </li>
                                <li>Click the "Search" button to find matching records</li>
                            </ol>

                            <div className="bg-blue-50 rounded-lg p-4 mt-6">
                                <p className="font-semibold">Tip:</p>
                                <p>
                                    The search will return any records that contain all the terms
                                    you entered, regardless of their order or location in the
                                    record.
                                </p>
                            </div>

                            <div className="mt-6">
                                <img
                                    src="/manualImages/search.png"
                                    alt="Search Interface Example"
                                    className="rounded-lg shadow-md mx-auto"
                                />
                                <p className="text-center text-gray-600 mt-2">
                                    Search interface with filters and search field
                                </p>
                            </div>
                        </div>
                    </section>
                    {/* Data Collection Process section */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Data Collection Process</h2>

                        <div className="bg-white rounded-lg border p-6">
                            <h3 className="text-xl font-semibold mb-4">Recording New Data</h3>
                            <div className="mt-6">
                                <img
                                    src="/manualImages/newSession.png"
                                    alt="New Data Entry Screen"
                                    className="rounded-lg shadow-md mx-auto"
                                />
                                <p className="text-center  mt-2">
                                    1. Enter Recorder Initials <br></br>
                                    2. Enter Handler Initials<br></br>
                                    3. Select Project , Site ,Array:<br></br>
                                    4. No will close the session<br></br>
                                    5. Yes will take you to next screen.
                                </p>

                                <img
                                    src="/manualImages/dataentry.png"
                                    alt="New Data Entry Screen"
                                    className="rounded-lg shadow-md mx-auto"
                                />

                                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                                    <p className="font-semibold">Tip:</p>
                                    <p>
                                        {' '}
                                        To add new entries Select Form select taxa add counts.
                                        <br></br>
                                        once complete choose end session. .
                                    </p>
                                    <br></br>
                                </div>
                            </div>
                            <img
                                src="/manualImages/verify.png"
                                alt="Data Verification Screen"
                                className="rounded-lg shadow-md mx-auto"
                            />
                            <p className="text-center text-gray-600 mt-2">
                                Verification screen showing entered data before final submission
                                <br></br>
                                Verify Data is correct before submission.
                            </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4 mt-6">
                            <p className="font-semibold">Tip:</p>
                            <p>
                                Errors on the Verify screen should be resolved by using the back
                                button to make corrections.
                            </p>
                            <br></br>
                        </div>
                        <div className="bg-white rounded-lg border p-6 mt-6">
                            <h3 className="text-xl font-semibold mb-4">Species Entry Form</h3>
                            <div className="mt-6">
                                <img
                                    src="/manualImages/mammal.png"
                                    alt="Mammal Entry Form"
                                    className="rounded-lg shadow-md mx-auto"
                                />
                                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                                    <p className="font-semibold">Tip:</p>
                                    <p>
                                        {' '}
                                        Comments and dead are optional.All other entries are
                                        required.<br></br>
                                        Sex can be male female or unknown .
                                    </p>
                                    <br></br>
                                    If unable to finish verify all mandatory selections are made.
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Data Entry Guidelines section */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Data Entry Guidelines</h2>
                        <div className="bg-white rounded-lg border p-6">
                            <h3 className="text-xl font-semibold mb-4">Fields for Entry:</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Species Code</li>
                                <li>Fence Trap location</li>
                                <li>Mass (g)</li>
                                <li>Sex</li>
                                <li>"Is it dead?" status</li>
                                <li>Comments (optional)</li>
                            </ul>

                            <div className="bg-yellow-50 rounded-lg p-4 mt-6">
                                <p className="font-semibold">Important:</p>
                                <p>
                                    Always verify your entries in the confirmation screen before
                                    submitting data.
                                    <br></br>**Once submitted, modifications must be made through
                                    the History page.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Session Management section */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Session Management</h2>
                        <div className="bg-white rounded-lg border p-6">
                            <ol className="list-decimal pl-6 space-y-4">
                                <li>Select "End Session" when finished with data collection</li>
                                <li>Review the number of critters recorded</li>
                                <li>Confirm your intention to close the session</li>
                                <li>
                                    **Note that closed sessions can be accessed later through the
                                    History page to edit or add
                                </li>
                            </ol>

                            <div className="mt-6">
                                <img
                                    src="/manualImages/complete.png"
                                    alt="History Screen"
                                    className="rounded-lg shadow-md mx-auto"
                                />
                                <div className="bg-yellow-50 rounded-lg p-4 mt-6">
                                    <p className="font-semibold">Important:</p>
                                    <p>
                                        Always verify your entries in the confirmation screen before
                                        submitting data.
                                        <br></br>Once submitted, modifications must be made through
                                        the History page.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Best Practices section */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Best Practices</h2>
                        <div className="bg-white rounded-lg border p-6">
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Always double-check measurements before submission</li>
                                <li>Use the comments field to note any unusual observations</li>
                                <li>Ensure all required fields are completed</li>
                                <li>Verify your data in the confirmation screen</li>
                            </ul>

                            <div className="bg-blue-50 rounded-lg p-4 mt-6">
                                <p className="font-semibold">Remember:</p>
                                <p>
                                    Once a session is ended and confirmed, you'll need to access the
                                    History page to make any additional entries or modifications.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
