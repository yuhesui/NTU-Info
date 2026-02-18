import React from 'https://esm.sh/react@18.2.0';
import { CheckCircle, PlaneLanding, MapPin, AlertTriangle, Ticket } from 'https://esm.sh/lucide-react';

const Section = ({ icon, title, children }) => (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center mb-4">
            <div className="bg-ntu-blue text-white rounded-full p-3 mr-4 flex-shrink-0">
                {icon}
            </div>
            <h2 className="text-2xl font-bold text-ntu-blue">{title}</h2>
        </div>
        <div className="prose prose-lg max-w-none text-gray-700 prose-li:my-1 prose-strong:text-gray-800">
            {children}
        </div>
    </div>
);

const InfoCard = ({ icon, title, children }) => (
    <div className="bg-blue-50 border-l-4 border-ntu-blue p-4 rounded-r-lg my-6">
        <div className="flex">
            <div className="flex-shrink-0">
                {icon}
            </div>
            <div className="ml-3">
                <h3 className="text-lg font-medium text-ntu-blue">{title}</h3>
                <div className="mt-2 text-md text-gray-700">
                    {children}
                </div>
            </div>
        </div>
    </div>
);


const AirportGuidePage = () => {
    return (
        <div className="bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <header className="text-center mb-12">
                    <span className="inline-block bg-ntu-red text-white text-sm font-semibold px-4 py-1 rounded-full mb-2">Travel Guide</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Singapore Airport Arrival Guide</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">Your step-by-step guide to a smooth arrival, from touchdown at Changi Airport to reaching the NTU campus.</p>
                </header>
                
                <Section icon={<CheckCircle className="w-6 h-6" />} title="1. Before You Arrive">
                    <p>Preparation is key for a hassle-free entry into Singapore. Ensure you have everything in order before your flight.</p>
                    <ul>
                        <li><strong>Student's Pass In-Principle Approval (IPA) Letter:</strong> This is your single-entry visa to Singapore. Have a printed copy ready.</li>
                        <li><strong>Passport:</strong> Must be valid for at least six months.</li>
                        <li><strong>NTU Admission Offer Letter:</strong> Keep a digital or printed copy.</li>
                        <li><strong>SG Arrival Card (SGAC):</strong> All travellers must fill this out online within 3 days before arriving in Singapore. It's free of charge on the official Immigration & Checkpoints Authority (ICA) website.</li>
                        <li><strong>Accommodation Details:</strong> Have the address of your on-campus hall or off-campus housing ready.</li>
                    </ul>
                    <InfoCard icon={<AlertTriangle className="h-5 w-5 text-ntu-blue mt-1" aria-hidden="true" />} title="Important Note on SG Arrival Card">
                        <p>Only use the official ICA website to submit your SG Arrival Card. Beware of third-party websites that may charge a fee for this free service.</p>
                    </InfoCard>
                </Section>

                <Section icon={<PlaneLanding className="w-6 h-6" />} title="2. Upon Arrival at Changi Airport">
                    <p>Welcome to Singapore! Changi Airport is known for its efficiency. Follow these steps to navigate through the arrival process.</p>
                    <ol>
                        <li><strong>Immigration Clearance:</strong> Follow the signs to the Arrival Immigration Hall. Foreign visitors can use the automated lanes for faster clearance if eligible. Present your passport and IPA letter to the officer if you use a manned counter.</li>
                        <li><strong>Baggage Claim:</strong> After clearing immigration, check the information screens for your designated baggage carousel number and collect your luggage.</li>
                        <li><strong>Customs Clearance:</strong> Proceed through the Green Channel if you have nothing to declare, or the Red Channel if you have dutiable, controlled, or prohibited items. Check Singapore Customs website for details.</li>
                    </ol>
                </Section>

                <Section icon={<MapPin className="w-6 h-6" />} title="3. Getting to NTU Campus">
                    <p>Once you've cleared customs, you have several options to get to Nanyang Technological University.</p>
                    
                    <h4>Taxi / Ride-Hailing</h4>
                    <p>The most convenient, direct way to get to NTU. The journey takes about 30-40 minutes and costs approximately S$35-S$50, depending on time and traffic.</p>
                    <ul>
                        <li>Follow signs to the official Taxi Stand at the Arrival level.</li>
                        <li>Use ride-hailing apps like Grab, Gojek, or Tada. You can use airport WiFi to book a ride. Pick-up points are clearly marked at the Arrival level.</li>
                    </ul>
                    
                    <h4>MRT (Mass Rapid Transit)</h4>
                    <p>A more affordable option, but requires a train and bus transfer. The total journey can take around 1.5 hours.</p>
                    <ol>
                        <li>From Changi Airport (CG2), take the train to Tanah Merah (EW4).</li>
                        <li>Alight and cross the platform to board the train towards Tuas Link (East-West Line).</li>
                        <li>Alight at Pioneer MRT station (EW28).</li>
                        <li>From the bus stop outside Pioneer MRT, take the NTU Campus Rider (free) or public bus 179 to go into the campus.</li>
                    </ol>
                    <InfoCard icon={<Ticket className="h-5 w-5 text-ntu-blue mt-1" aria-hidden="true" />} title="EZ-Link / Nets FlashPay Card">
                        <p>Consider purchasing a stored-value card for public transport from the Changi Airport MRT station ticket office. It makes travelling on buses and trains much more convenient.</p>
                    </InfoCard>

                </Section>

                <div className="text-center mt-12 p-6 bg-white border border-gray-100 rounded-lg">
                    <h3 className="text-2xl font-bold text-gray-800">Welcome to NTU!</h3>
                    <p className="mt-2 text-gray-600">We hope this guide helps you settle in smoothly. Your adventure in Singapore starts now!</p>
                </div>
            </div>
        </div>
    );
};

export default AirportGuidePage;
