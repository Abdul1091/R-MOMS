import React, { useState } from 'react';
import { addSupplier } from '../../api/procurement';

const AddSupplier = () => {
    const [formData, setFormData] = useState({
        company_name: '',
        cac_number: '',
        phone_no: '',
        email: '',
        contact_person: '',
        goods_type: '',
        bank_name: '',
        account_name: '',
        account_number: '',
        sort_code: '',
        branch_name: '',
    });

    const [message, setMessage] = useState('');
    const [expandedSection, setExpandedSection] = useState('general');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addSupplier(formData);
            setMessage(response.message);
        } catch (error) {
            setMessage(error.response?.data.error || 'An error occurred.');
        }
    };

    const sections = [
        { name: 'General Info', id: 'general' },
        { name: 'Bank Details', id: 'bank-details' },
    ];

    const scrollToSection = (id) => {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
        setExpandedSection(id);
    };

    const calculateProgress = (fields) => {
        const completedFields = fields.filter(
            (field) => formData[field.name]?.toString().trim() !== ''
        ).length;
        return Math.round((completedFields / fields.length) * 100);
    };

    const renderSection = (id, sectionName, fields) => {
        const progress = calculateProgress(fields);

        return (
            <div id={id} className="bg-white shadow-lg rounded-lg p-6 mb-6">
                <div className="cursor-pointer flex justify-between items-center">
                    <h3 className="font-bold text-lg">{sectionName}</h3>
                </div>
                <div className="mt-2 mb-4">
                    <div className="relative w-full h-2 bg-gray-200 rounded-full">
                        <div
                            style={{ width: `${progress}%` }}
                            className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full"
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{progress}% Completed</p>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.map((field) => (
                        <div key={field.name} className="flex flex-col">
                            <label className="font-medium mb-2">{field.label}</label>
                            <input
                                type={field.type || 'text'}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                className="border border-gray-300 rounded-lg p-2 w-full"
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex">
            
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-100 p-4 shadow-lg h-screen sticky top-0">
                <h3 className="font-bold text-lg mb-4">Sections</h3>
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className={`cursor-pointer p-2 mb-2 rounded-lg ${
                            expandedSection === section.id ? 'bg-blue-500 text-white' : 'bg-white'
                        }`}
                        onClick={() => scrollToSection(section.id)}
                    >
                        {section.name}
                    </div>
                ))}
            </div>

            {/* Main Form */}
            <div className="w-3/4 p-6 bg-gray-100 min-h-screen">
                <h2 className="text-2xl font-bold mb-6">Add Supplier</h2>
                <form onSubmit={handleSubmit}>
                    {renderSection('general', 'General Info', [
                        { label: 'Company Name', name: 'company_name' },
                        { label: 'CAC Number', name: 'cac_number' },
                        { label: 'Phone Number', name: 'phone_no' },
                        { label: 'Email', name: 'email', type: 'email' },
                        { label: 'Contact Person', name: 'contact_person' },
                        { label: 'Goods Type', name: 'goods_type' },
                    ])}
                    {renderSection('bank-details', 'Bank Details', [
                        { label: 'Bank Name', name: 'bank_name' },
                        { label: 'Account Name', name: 'account_name' },
                        { label: 'Account Number', name: 'account_number' },
                        { label: 'Sort Code (Optional)', name: 'sort_code' },
                        { label: 'Branch Name (Optional)', name: 'branch_name' },
                    ])}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Add Supplier
                        </button>
                    </div>
                </form>
                {message && (
                    <p className={`text-center mt-4 ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default AddSupplier;