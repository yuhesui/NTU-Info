import React from 'https://esm.sh/react@18.2.0';
import { CheckSquare } from 'https://esm.sh/lucide-react';

const checklistItems = [
    "Activate your NTU Network Account",
    "Complete online matriculation",
    "Apply for your Student Pass (for international students)",
    "Register for courses via STARS",
    "Pay your tuition fees",
    "Attend your school's orientation program",
    "Collect your matriculation card",
    "Explore campus clubs and societies"
];

const GettingStartedChecklist = () => {
    return (
        <ul className="space-y-3">
            {checklistItems.map((item, index) => (
                <li key={index} className="flex items-start">
                    <CheckSquare className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{item}</span>
                </li>
            ))}
        </ul>
    );
};

export default GettingStartedChecklist;
