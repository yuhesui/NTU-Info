import React, { useState } from 'https://esm.sh/react@18.2.0';
import { BookOpen, CheckSquare, ListChecks, ExternalLink, Search, FileText, Send, Award, Info, MessageCircle, LogIn } from 'https://esm.sh/lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

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

const CommentsSection = () => {
    const [comments, setComments] = useState([
        {
            id: 1,
            author: 'Sarah L.',
            date: '2024-01-15',
            content: 'Great guide! The step-by-step process really helped me navigate the credit transfer. Successfully transferred 6 AUs from Coursera courses.'
        },
        {
            id: 2,
            author: 'Mike Chen',
            date: '2024-01-12',
            content: 'Quick question - does the course matching approval usually take long? I submitted mine 2 weeks ago and still waiting for response.'
        }
    ]);
    const [newComment, setNewComment] = useState('');
    const { isAuthenticated, user } = useAuth();

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            const comment = {
                id: Date.now(),
                author: user?.name || 'Anonymous User',
                date: new Date().toISOString().split('T')[0],
                content: newComment.trim()
            };
            setComments(prev => [comment, ...prev]);
            setNewComment('');
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center mb-6">
                <div className="bg-ntu-blue text-white rounded-full p-3 mr-4 flex-shrink-0">
                    <MessageCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ntu-blue">Comments & Discussion</h2>
            </div>

            {isAuthenticated ? (
                <form onSubmit={handleSubmitComment} className="mb-8">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Share your experience or ask a question
                        </label>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ntu-blue focus:border-ntu-blue"
                            placeholder="Your comment..."
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-ntu-blue text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-ntu-blue focus:ring-offset-2 flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Post Comment
                    </button>
                </form>
            ) : (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center text-gray-600">
                        <LogIn className="w-5 h-5 mr-2" />
                        <span>Sign in to join the discussion</span>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    {comments.length} Comment{comments.length !== 1 ? 's' : ''}
                </h3>
                {comments.map(comment => (
                    <div key={comment.id} className="border-l-4 border-gray-200 pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">{comment.author}</span>
                            <span className="text-sm text-gray-500">{comment.date}</span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

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

                <CommentsSection />

                 <div className="text-center mt-12 p-6 bg-white border border-gray-100 rounded-lg">
                    <h3 className="text-2xl font-bold text-gray-800">Ready to expand your learning?</h3>
                    <p className="mt-2 text-gray-600">Start exploring courses today and get a head start on your degree requirements.</p>
                </div>
            </div>
        </div>
    );
};

export default MoocCreditTransferGuidePage;
