const React = window.React;
const { useState } = React;

const ConcessionCardCalculatorPage = () => {
    const AVG_FARE_PER_TRIP = 1.65;
    const MONTHLY_PASS_PRICE = 90.50;
    const WEEKS_IN_MONTH = 4.345;

    const [studentStatus, setStudentStatus] = useState('full-time');
    const [tripsPerDay, setTripsPerDay] = useState(2);
    const [travelDaysPerWeek, setTravelDaysPerWeek] = useState(5);

    const [result, setResult] = useState(null);

    const handleCalculate = () => {
        if (studentStatus !== 'full-time') {
            setResult({
                eligible: false,
                message: "Concession cards are typically available for full-time students only."
            });
            return;
        }

        const totalTripsPerMonth = tripsPerDay * travelDaysPerWeek * WEEKS_IN_MONTH;
        const costWithoutConcession = totalTripsPerMonth * AVG_FARE_PER_TRIP;
        const savings = costWithoutConcession - MONTHLY_PASS_PRICE;

        setResult({
            eligible: true,
            costWithoutConcession: costWithoutConcession.toFixed(2),
            costWithConcession: MONTHLY_PASS_PRICE.toFixed(2),
            savings: savings.toFixed(2),
            totalTripsPerMonth: Math.round(totalTripsPerMonth)
        });
    };

    const renderResult = () => {
        if (!result) return null;

        if (!result.eligible) {
            return (
                <div className="mt-8 p-6 bg-red-100 border border-red-200 rounded-lg">
                    <h3 className="text-xl font-bold text-red-800">Not Eligible</h3>
                    <p className="mt-2 text-red-700">{result.message}</p>
                </div>
            );
        }

        const isRecommended = result.savings > 0;

        return (
            <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Calculation Result</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <span className="font-semibold">Estimated Monthly Trips:</span>
                        <span className="font-bold text-lg">{result.totalTripsPerMonth}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <span className="font-semibold">Cost without Concession Pass:</span>
                        <span className="font-bold text-lg text-red-600">${result.costWithoutConcession}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <span className="font-semibold">Cost with Concession Pass:</span>
                        <span className="font-bold text-lg text-green-600">${result.costWithConcession}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-md border-l-4 border-blue-500">
                        <span className="font-semibold text-blue-800">Estimated Monthly Savings:</span>
                        <span className="font-extrabold text-2xl text-blue-800">${result.savings}</span>
                    </div>
                </div>
                <div className={`mt-6 p-4 rounded-lg ${isRecommended ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    <p className="font-bold text-lg">{isRecommended ? "Recommendation: Get the Pass!" : "Recommendation: Pay per trip"}</p>
                    <p className="mt-1">{isRecommended ? `You could save approximately $${result.savings} per month.` : `It seems more economical to pay for individual trips based on your travel frequency. You might spend $${Math.abs(result.savings).toFixed(2)} more with a pass.`}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Concession Card Calculator</h1>
                    <p className="mt-4 text-lg text-gray-600">Determine your eligibility and calculate potential savings on your monthly travel expenses.</p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Your Details</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label htmlFor="student-status" className="mb-2 font-semibold text-gray-700">Student Status</label>
                            <select id="student-status" value={studentStatus} onChange={e => setStudentStatus(e.target.value)} className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
                                <option value="full-time">Full-time NTU Student</option>
                                <option value="part-time">Part-time Student</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="trips-per-day" className="mb-2 font-semibold text-gray-700">Average Daily Trips</label>
                            <input type="number" id="trips-per-day" value={tripsPerDay} onChange={e => setTripsPerDay(Number(e.target.value))} min="1" className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="travel-days" className="mb-2 font-semibold text-gray-700">Travel Days per Week</label>
                            <input type="number" id="travel-days" value={travelDaysPerWeek} onChange={e => setTravelDaysPerWeek(Number(e.target.value))} min="1" max="7" className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <button onClick={handleCalculate} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md">
                            Calculate Savings
                        </button>
                    </div>
                </div>
                
                {renderResult()}

            </div>
        </div>
    );
};

export default ConcessionCardCalculatorPage;
