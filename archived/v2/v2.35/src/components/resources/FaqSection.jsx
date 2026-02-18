import React, { useState } from 'https://esm.sh/react@18.2.0';
import { ChevronDown } from 'https://esm.sh/lucide-react';

const faqData = [
    {
        question: "How do I connect to the campus WiFi?",
        answer: "You can connect to the 'NTU_Wireless' network using your student network account credentials. For detailed instructions, visit the CITS website."
    },
    {
        question: "Where can I find my exam schedule?",
        answer: "Your personalized exam schedule is available on the Student Intranet under the 'Academic Matters' section. Schedules are typically released mid-semester."
    },
    {
        question: "How does the GPA system work?",
        answer: "The Grade Point Average (GPA) is calculated based on the grades you receive for your courses and their corresponding academic units (AUs). A+ is 5.0, A is 5.0, A- is 4.5, and so on. You can use our GPA calculator tool to estimate your GPA."
    },
    {
        question: "Can I apply for a student concession card?",
        answer: "Yes, full-time matriculated students are eligible for a student concession card for public transport. You can apply via the TransitLink website. Our concession card calculator can help you decide if it's worth it."
    }
];

const FaqItem = ({ item, isOpen, onClick }) => (
    <div className="border-b border-gray-200 py-4">
        <button
            onClick={onClick}
            className="w-full flex justify-between items-center text-left text-gray-800 focus:outline-none"
        >
            <span className="font-medium">{item.question}</span>
            <ChevronDown className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}
        >
            <p className="text-gray-600">
                {item.answer}
            </p>
        </div>
    </div>
);

const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full">
            {faqData.map((item, index) => (
                <FaqItem
                    key={index}
                    item={item}
                    isOpen={openIndex === index}
                    onClick={() => handleToggle(index)}
                />
            ))}
        </div>
    );
};

export default FaqSection;
