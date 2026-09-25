import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { UploadCloud, FileWarning, MapPin, AlignLeft, Type, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function ReportComplaint() {
  const [formData, setFormData] = useState({
    title: '',
    issueType: '',
    location: '',
    description: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      issueType: '',
      location: '',
      description: '',
    });
    setImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSubmitSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Auto reset after 3 seconds
      setTimeout(() => {
        handleReset();
      }, 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <PageHeader 
        title="Report an Issue" 
        description="Help us keep the city clean. Report overflowing bins, missed collections, or illegal dumping." 
      />

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header section of the card */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 md:px-8">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <FileWarning className="w-6 h-6" />
            Complaint Details
          </h2>
          <p className="text-teal-50 text-sm mt-1">Please provide accurate information for quick resolution.</p>
        </div>

        <div className="p-6 md:p-8">
          {submitSuccess && (
            <div className="mb-6 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="font-medium">Complaint submitted successfully! Thank you for your report.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="title" className="block text-sm font-semibold text-slate-700">
                  Complaint Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Type className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    placeholder="e.g. Overflowing bin at Main St."
                    value={formData.title}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-teal-500 focus:border-teal-500 text-slate-900 shadow-sm transition-colors hover:border-slate-400 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Issue Type */}
              <div className="space-y-2">
                <label htmlFor="issueType" className="block text-sm font-semibold text-slate-700">
                  Issue Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileWarning className="h-5 w-5 text-slate-400" />
                  </div>
                  <select
                    id="issueType"
                    name="issueType"
                    required
                    value={formData.issueType}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl focus:ring-teal-500 focus:border-teal-500 text-slate-900 shadow-sm appearance-none transition-colors hover:border-slate-400 bg-slate-50 focus:bg-white"
                  >
                    <option value="" disabled>Select issue type</option>
                    <option value="overflowing_bin">Overflowing Bin</option>
                    <option value="missed_collection">Missed Collection</option>
                    <option value="illegal_dumping">Illegal Dumping</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="location" className="block text-sm font-semibold text-slate-700">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    placeholder="Address or landmark"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-teal-500 focus:border-teal-500 text-slate-900 shadow-sm transition-colors hover:border-slate-400 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="description" className="block text-sm font-semibold text-slate-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <AlignLeft className="h-5 w-5 text-slate-400" />
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    placeholder="Provide additional details about the issue..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-teal-500 focus:border-teal-500 text-slate-900 shadow-sm transition-colors hover:border-slate-400 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Upload Image (Optional)
                </label>
                <div 
                  className={cn(
                    "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors",
                    isDragging ? "border-teal-500 bg-teal-50/50" : "border-slate-300 hover:border-teal-500 hover:bg-teal-50/50 bg-slate-50"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="space-y-1 text-center w-full">
                    {previewUrl ? (
                      <div className="relative inline-block">
                        <img src={previewUrl} alt="Preview" className="max-h-48 rounded-lg shadow-sm" />
                        <button
                          type="button"
                          onClick={() => {
                            setImage(null);
                            URL.revokeObjectURL(previewUrl);
                            setPreviewUrl(null);
                          }}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md text-slate-500 hover:text-red-500"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                        <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                        <div className="flex text-sm text-slate-600 justify-center mt-2">
                          <span className="relative bg-transparent rounded-md font-medium text-teal-600 hover:text-teal-500 px-1">
                            Upload a file
                          </span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 border border-slate-300 shadow-sm text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "px-6 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all flex justify-center items-center gap-2",
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                )}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Complaint"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
