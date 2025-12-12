import { useCreateZone } from "@/lib/api/servicesHooks";
import { MapPin, Save } from "lucide-react";
import { useState } from "react";





interface ZoneFormData {
  name: string;
  description: string;
}

interface AddZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchZones: () => void;
}


export const AddZoneModal: React.FC<AddZoneModalProps> = ({ isOpen, onClose, refetchZones }) => {
  const [formData, setFormData] = useState<ZoneFormData>({
    name: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);


  const createZoneMutation = useCreateZone();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Zone name is required.");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setError(null);

    createZoneMutation.mutate(
      {
        ...formData,
      },
      {
        onSuccess: () => {
          refetchZones();
          setFormData({
            name: "",
            description: "",
          });
          onClose();
        },
        onError: (err: any) => {
          setError(err.response?.data?.message || err.message || "Failed to create zone. Please try again.");
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Add New Zone
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Enter the zone details to create a new delivery zone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-4 space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                Zone Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" size={18} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., North Zone"
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-400"
                  required
                />
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="e.g., Covers Lahore North"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 px-3 text-sm outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-400"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <div className="space-y-4 sm:space-x-3 sm:space-y-0 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={createZoneMutation.isPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 sm:ml-3 sm:w-auto"
              >
                {createZoneMutation.isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Create Zone
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};