import React, { useState } from 'https://esm.sh/react@18.2.0';
import { Globe, ClipboardList, School, Plane, BookCopy, ChevronRight, Info, Map, Search, MessageCircle, Send, LogIn } from 'https://esm.sh/lucide-react';
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
            author: 'Alex Wang',
            date: '2024-01-18',
            content: 'Just returned from my exchange at UC Berkeley! The credit transfer process was smooth thanks to this guide. Highly recommend starting the course matching early.'
        },
        {
            id: 2,
            author: 'Priya S.',
            date: '2024-01-16',
            content: 'Currently applying for exchange to ETH Zurich. The step-by-step breakdown really helped me stay organized. Thanks for the comprehensive guide!'
        },
        {
            id: 3,
            author: 'David Liu',
            date: '2024-01-14',
            content: 'For anyone considering Japan, the visa process can take 2-3 months so apply early! Also, learn some basic Japanese - it really helps with daily life.'
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
                            Share your exchange experience or ask questions
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

const OverseasExchangeGuidePage = () => {
    const steps = [
        {
            icon: <Search className="w-6 h-6" />,
            title: "Research & Plan",
            description: "Explore partner universities, check your eligibility, and discuss with your academic advisor. Shortlist universities based on your course map."
        },
        {
            icon: <ClipboardList className="w-6 h-6" />,
            title: "Apply via GEM Portal",
            description: "Submit your exchange application on the NTU GEM Portal. You will need to submit your study plan and personal statement."
        },
        {
            icon: <School className="w-6 h-6" />,
            title: "Receive Nomination & Apply to Partner Uni",
            description: "Once nominated by NTU, you will receive instructions to apply directly to the partner university for official admission."
        },
        {
            icon: <Plane className="w-6 h-6" />,
            title: "Pre-Departure Preparations",
            description: "Secure your student visa, book flights and accommodation, and attend the mandatory pre-departure briefing by NTU."
        },
        {
            icon: <BookCopy className="w-6 h-6" />,
            title: "Credit Transfer & Post-Exchange",
            description: "During your exchange, finalize course matching. After returning, submit your transcript to NTU for credit transfer."
        }
    ];

    const popularDestinations = [
        { name: "University of California, USA", continent: "Americas" },
        { name: "University of Toronto, Canada", continent: "Americas" },
        { name: "University College London, UK", continent: "Europe" },
        { name: "ETH Zurich, Switzerland", continent: "Europe" },
        { name: "Seoul National University, South Korea", continent: "Asia" },
        { name: "University of Tokyo, Japan", continent: "Asia" },
    ];

    return (
        <div className="bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <header className="text-center mb-12">
                    <span className="inline-block bg-ntu-red text-white text-sm font-semibold px-4 py-1 rounded-full mb-2">Academics Guide</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Overseas Exchange Guide</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">Embark on a life-changing journey. Here's everything you need to know about NTU's overseas exchange programmes.</p>
                     <div className="flex justify-center items-center mt-4 space-x-2">
                        <span className="text-sm font-medium text-gray-500">Difficulty:</span>
                        <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                            <span className="ml-2 text-yellow-600 font-semibold">Intermediate</span>
                        </div>
                    </div>
                </header>

                <Section icon={<Globe className="w-6 h-6" />} title="5-Step Exchange Process">
                    <p>Navigating the exchange application can be complex. Follow our "Complete in 5 Steps" guide to stay on track from start to finish.</p>
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

                <Section icon={<Map className="w-6 h-6" />} title="Popular Partner Universities">
                    <p>NTU has partnerships with over 350 universities worldwide. Here are a few popular choices among students to spark your inspiration.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {popularDestinations.map((dest, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-lg flex items-center justify-between hover:bg-gray-200 transition-colors">
                                <div>
                                    <h4 className="font-bold text-gray-800">{dest.name}</h4>
                                    <p className="text-sm text-gray-600">{dest.continent}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                        ))}
                    </div>
                </Section>

                <Section icon={<BookCopy className="w-6 h-6" />} title="Academics & Credit Transfer">
                    <p>Ensuring your overseas courses count towards your NTU degree is crucial. This involves course matching and credit transfer.</p>
                    <ul>
                        <li><strong>Course Matching:</strong> Before your exchange, you must map the courses you intend to take at the partner university to equivalent courses at NTU. This requires approval from your school.</li>
                        <li><strong>Credit Transfer:</strong> Credits are typically transferred on a Pass/Fail basis. They will count towards your Academic Units (AUs) but will not affect your GPA.</li>
                        <li><strong>Workload:</strong> You are expected to take a full workload at the partner university, equivalent to the NTU requirement for the semester.</li>
                    </ul>
                     <InfoCard icon={<Info className="h-5 w-5 text-ntu-blue" aria-hidden="true" />} title="Important Note">
                        <p>The course matching process can be lengthy. Start early! Consult the official NTU GEM Portal and your school's exchange coordinator for the most accurate and up-to-date information.</p>
                    </InfoCard>
                </Section>

                <CommentsSection />

                 <div className="text-center mt-12 p-6 bg-white border border-gray-100 rounded-lg">
                    <h3 className="text-2xl font-bold text-gray-800">Ready for an adventure?</h3>
                    <p className="mt-2 text-gray-600">Start your research on the GEM Portal today and open the door to a world of opportunities.</p>
                </div>
            </div>
        </div>
    );
};

export default OverseasExchangeGuidePage;
