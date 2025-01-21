import { useState } from 'react';
import { FaTint } from 'react-icons/fa';

const MoisturePricingCard = ({ moisturePricing }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center cursor-pointer" onClick={toggleExpand}>
                <h3 className="font-semibold text-gray-700 flex items-center">
                    <FaTint className="text-blue-500 mr-2" />
                    Moisture Pricing
                </h3>
                <button
                    className={`text-sm px-3 py-1 rounded ${isExpanded ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
                >
                    {isExpanded ? 'Collapse' : 'Expand'}
                </button>
            </div>
            {isExpanded && moisturePricing && (
                <table className="w-full border-collapse border border-gray-300 mt-4">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Moisture Type</th>
                            <th className="border border-gray-300 px-4 py-2">Value</th>
                            <th className="border border-gray-300 px-4 py-2">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Moisture A</td>
                            <td className="border border-gray-300 px-4 py-2">{moisturePricing.moisture_a}</td>
                            <td className="border border-gray-300 px-4 py-2">{moisturePricing.moisture_a_price}</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Moisture B</td>
                            <td className="border border-gray-300 px-4 py-2">{moisturePricing.moisture_b}</td>
                            <td className="border border-gray-300 px-4 py-2">{moisturePricing.moisture_b_price}</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Moisture C</td>
                            <td className="border border-gray-300 px-4 py-2">{moisturePricing.moisture_c}</td>
                            <td className="border border-gray-300 px-4 py-2">{moisturePricing.moisture_c_price}</td>
                        </tr>
                    </tbody>
                </table>
            )}
            {!moisturePricing && (
                <p className="text-gray-500 mt-4">No moisture pricing data available.</p>
            )}
        </div>
    );
};

export default MoisturePricingCard;