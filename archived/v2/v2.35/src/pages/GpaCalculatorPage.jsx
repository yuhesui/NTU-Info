import React, { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { Trash2, Plus, Info } from 'https://esm.sh/lucide-react';
import { GRADE_POINTS } from '../constants/config.js';

const gradeOptions = Object.keys(GRADE_POINTS);

function GpaCalculatorPage() {
    const [courses, setCourses] = useState([{ id: 1, name: '', credits: '', grade: 'A+' }]);
    const [nextId, setNextId] = useState(2);
    const [gpa, setGpa] = useState('5.00');

    useEffect(() => {
        let totalPoints = 0;
        let totalCredits = 0;

        courses.forEach(course => {
            const credits = parseFloat(course.credits);
            const point = GRADE_POINTS[course.grade];
            
            if (!isNaN(credits) && credits > 0) {
                totalCredits += credits;
                totalPoints += credits * point;
            }
        });

        const calculatedGpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
        setGpa(calculatedGpa);
        
    }, [courses]);

    const handleCourseChange = (id, field, value) => {
        const updatedCourses = courses.map(course => 
            course.id === id ? { ...course, [field]: value } : course
        );
        setCourses(updatedCourses);
    };

    const addCourse = () => {
        setCourses([...courses, { id: nextId, name: '', credits: '', grade: 'A+' }]);
        setNextId(prevId => prevId + 1);
    };

    const removeCourse = (id) => {
        setCourses(courses.filter(course => course.id !== id));
    };

    const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ntu-blue focus:border-ntu-blue text-sm";
    const selectClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ntu-blue focus:border-ntu-blue text-sm";
    
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold hero-gradient-text">GPA Calculator</h1>
                <p className="text-gray-600 mt-2 text-lg">An interactive tool to calculate your Grade Point Average.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Your Calculated GPA</h2>
                        <p className="text-sm text-gray-500 mt-1">Updates automatically as you add courses.</p>
                    </div>
                    <div className="text-6xl font-extrabold text-ntu-blue mt-4 md:mt-0">
                        {gpa}
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <div className="hidden md:grid grid-cols-12 gap-4 mb-2 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-5">Course Name</div>
                    <div className="col-span-2">Credit Units (AU)</div>
                    <div className="col-span-2">Grade</div>
                    <div className="col-span-2 text-center">Points</div>
                    <div className="col-span-1 text-right">Action</div>
                </div>

                <div className="space-y-3">
                    {courses.map(course => (
                        <div key={course.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-gray-50 p-3 rounded-lg border border-gray-200/80">
                            <input
                                type="text"
                                placeholder="e.g., MH1810 Math 1"
                                value={course.name}
                                onChange={(e) => handleCourseChange(course.id, 'name', e.target.value)}
                                className={`${inputClasses} md:col-span-5`}
                            />
                            <input
                                type="number"
                                placeholder="e.g., 3"
                                value={course.credits}
                                onChange={(e) => handleCourseChange(course.id, 'credits', e.target.value)}
                                className={`${inputClasses} md:col-span-2`}
                                min="0"
                            />
                            <select
                                value={course.grade}
                                onChange={(e) => handleCourseChange(course.id, 'grade', e.target.value)}
                                className={`${selectClasses} md:col-span-2`}
                            >
                                {gradeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                            <div className="md:col-span-2 text-center font-bold text-gray-700 text-lg">
                                {GRADE_POINTS[course.grade].toFixed(1)}
                            </div>
                            <div className="flex justify-end md:col-span-1">
                                <button onClick={() => removeCourse(course.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <button onClick={addCourse} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-400 text-gray-600 rounded-md hover:bg-gray-100 hover:border-ntu-blue hover:text-ntu-blue transition-colors duration-200">
                        <Plus className="w-4 h-4" />
                        Add Another Course
                    </button>
                </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <h3 className="font-bold text-base mb-2 flex items-center gap-2"><Info className="w-5 h-5" />How GPA is Calculated</h3>
                <p>The Grade Point Average (GPA) is calculated by dividing the total grade points earned by the total number of credit units (AUs) attempted.</p>
                <p className="mt-2 font-mono bg-blue-100 p-2 rounded text-center">GPA = &Sigma; (Grade Points &times; Credit Units) / &Sigma; (Credit Units)</p>
                <p className="mt-2">Courses with no credit units assigned are not included in the calculation.</p>
            </div>
        </div>
    );
}

export default GpaCalculatorPage;
