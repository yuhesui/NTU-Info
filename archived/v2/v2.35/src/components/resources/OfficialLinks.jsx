import React from 'https://esm.sh/react@18.2.0';
import { ExternalLink } from 'https://esm.sh/lucide-react';

const officialLinks = [
    { name: "NTU Main Website", url: "https://www.ntu.edu.sg" },
    { name: "Student Intranet", url: "https://student-intranet.ntu.edu.sg" },
    { name: "NTU Library", url: "https://library.ntu.edu.sg" },
    { name: "Office of Academic Services", url: "https://www.ntu.edu.sg/oad/academic-services" },
    { name: "IT Services (CITS)", url: "https://www.ntu.edu.sg/cits" },
    { name: "Office of Campus Housing", url: "https://www.ntu.edu.sg/has" },
];

const OfficialLinks = () => {
    return (
        <div className="space-y-3">
            {officialLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-100 transition ease-in-out duration-150"
                >
                    <ExternalLink className="flex-shrink-0 h-5 w-5 text-red-600" />
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{link.name}</p>
                    </div>
                </a>
            ))}
        </div>
    );
};

export default OfficialLinks;
