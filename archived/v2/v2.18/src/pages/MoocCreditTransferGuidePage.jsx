import React from 'https://esm.sh/react@18.2.0';
import { BookOpen, CheckSquare, ListChecks, ExternalLink, Search, FileText, Send, Award, Info } from 'https://esm.sh/lucide-react';

const Section = ({ icon, title, children }) => (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center mb-4">
            <div className="bg-ntu-blue text-white rounded-full p-3 mr-4 flex-shrink-0">
                {icon}
            </div>
            <h2 className="text-2xl font-bold text-ntu-blue">{title}</h2>
        </div>
        <div className="prose prose-lg max-w-none text-gray-700 prose-li:my-1.5 prose-strong:text-gray-800">
            {children}
        </div>
    </div>
);

const InfoCard = ({ icon, title, children }) => (
    <div className="bg-blue-50 border-l-4 border-ntu-blue p-4 rounded-r-lg my-6">
        <div className="flex">
            <div className="flex-shrink-0 pt-1">
                {icon}
            </div>
            <div className="ml-3">
                <h3 className="text-lg font-medium text-ntu-blue">{title}</h3>
                <div className="mt-2 text-md text-gray-700 space-y-2">
                    {children}
                </div>
            </div>
        </div>
    </div>
);

const MoocCreditTransferGuidePage = () => {
    const steps = [
        {
            icon: <Search className="w-6 h-6" />,
            title: "Find Eligible Courses",
            description: "Explore courses on approved MOOC platforms. Ensure the course is on NTU's list of pre-approved courses for credit transfer."
        },
        {
            icon: <FileText className="w-6 h-6" />,
            title: "Submit Application",
            description: "Before starting the course, submit a 'Course Matching' request via the StudentLink portal. Approval is required before you can claim credits."
        },
        {
            icon: <Send className="w-6 h-6" />,
            title: "Complete the MOOC",
            description: "Once approved, enroll and complete the course. You must achieve the minimum grade and obtain a verified certificate."
        },
        {
            icon: <Award className="w-6 h-6" />,
            title: "Claim Your Credits",
            description: "After completion, submit the 'Credit Transfer' application on StudentLink with your verified certificate and proof of completion."
        }
    ];

    return (
        <div className="bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <header className="text-center mb-12">
                    <span className="inline-block bg-ntu-red text-white text-sm font-semibold px-4 py-1 rounded-full mb-2">Academics Guide</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">MOOC Credit Transfer Guide</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">Learn how to earn academic units (AUs) by completing Massive Open Online Courses (MOOCs).</p>
                </header>

                <Section icon={<CheckSquare className="w-6 h-6" />} title="Eligibility & Key Requirements">
                    <p>To be eligible for MOOC credit transfer, you must be a full-time undergraduate student at NTU. Key requirements include:</p>
                    <ul>
                        <li>The MOOC must be on NTU's list of pre-approved courses.</li>
                        <li>You must obtain prior approval from your school before starting the course.</li>
                        <li>The course must be completed with a verified certificate and meet the minimum passing grade.</li>
                        <li>Credits are transferred on a Pass/Fail basis and will not be factored into your GPA calculation.</li>
                        <li>A maximum of 12 AUs from MOOCs can be used to fulfill graduation requirements.</li>
                    </ul>
                </Section>

                <Section icon={<ListChecks className="w-6 h-6" />} title="4-Step Credit Transfer Process">
                    <p>Follow this step-by-step process to ensure a successful credit transfer. A visual progress indicator helps track your journey.</p>
                     <div className="relative mt-8">
                        <div className="absolute left-6 top-6 h-full border-l-2 border-dashed border-gray-300" style={{height: 'calc(100% - 4rem)'}}></div>
                        {steps.map((step, index) => (
                             <div key={index} className="flex items-start my-6 relative z-10">
                                <div className="flex flex-col items-center mr-6">
                                    <div className="flex-shrink-0 bg-ntu-blue text-white rounded-full h-12 w-12 flex items-center justify-center">
                                        {step.icon}
                                    </div>
                                </div>
                                <div className="pt-1.5 w-full">
                                    <h3 className="text-xl font-bold text-gray-800">Step {index + 1}: {step.title}</h3>
                                    <p className="mt-1 text-gray-600">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
                
                <Section icon={<BookOpen className="w-6 h-6" />} title="Approved MOOC Platforms">
                    <p>NTU has partnered with leading MOOC providers. Check these platforms for pre-approved courses:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <a href="https://www.coursera.org" target="_blank" rel="noopener noreferrer" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border">
                            <h3 className="text-xl font-bold text-blue-600 flex items-center">Coursera <ExternalLink className="w-4 h-4 ml-2" /></h3>
                            <p className="mt-2 text-gray-600">Offers a wide range of courses and specializations from top universities and companies.</p>
                        </a>
                        <a href="https://www.edx.org" target="_blank" rel="noopener noreferrer" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border">
                             <h3 className="text-xl font-bold text-red-600 flex items-center">edX <ExternalLink className="w-4 h-4 ml-2" /></h3>
                            <p className="mt-2 text-gray-600">Founded by Harvard and MIT, edX provides high-quality courses from the world's best institutions.</p>
                        </a>
                    </div>
                     <InfoCard icon={<Info className="h-5 w-5 text-ntu-blue" aria-hidden="true" />} title="Finding Approved Courses">
                        <p>The definitive list of pre-approved courses and their matching NTU course codes is maintained on the NTU Academic Services website. Always refer to the official list before applying.</p>
                    </InfoCard>
                </Section>
                 <div className="text-center mt-12 p-6 bg-white border border-gray-100 rounded-lg">
                    <h3 className="text-2xl font-bold text-gray-800">Ready to expand your learning?</h3>
                    <p className="mt-2 text-gray-600">Start exploring courses today and get a head start on your degree requirements.</p>
                </div>
            </div>
        </div>
    );
};

export default MoocCreditTransferGuidePage;
