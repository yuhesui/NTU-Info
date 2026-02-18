import React from 'https://esm.sh/react@18.2.0';
import GettingStartedChecklist from '../components/resources/GettingStartedChecklist.jsx';
import OfficialLinks from '../components/resources/OfficialLinks.jsx';
import FaqSection from '../components/resources/FaqSection.jsx';
import ContactForm from '../components/resources/ContactForm.jsx';

const ResourcesPage = () => {
    return (
        <main className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl hero-gradient-text">
                        Resource Hub
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Your one-stop destination for essential guides, links, and support at NTU.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 grid-cols-1 lg:grid-cols-2 lg:gap-12">
                    <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl shadow-lg transition-all hover:shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started Checklist</h2>
                        <GettingStartedChecklist />
                    </div>

                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg transition-all hover:shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Official NTU Links</h2>
                        <OfficialLinks />
                    </div>

                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg transition-all hover:shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact & Feedback</h2>
                        <ContactForm />
                    </div>

                    <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl shadow-lg transition-all hover:shadow-xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <FaqSection />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ResourcesPage;
