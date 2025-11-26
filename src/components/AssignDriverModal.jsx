import { useState } from 'react';
// Assuming you have a Modal component; if not, here's a simple one using a dialog or div overlay.
// For simplicity, I'll define a basic Modal here. In production, use a library like Headless UI or custom styled one.

interface AssignDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any | null;
}
const AssignDriverModal: React.FC<AssignDriverModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;


  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);

  const handleAssign = () => {
    if (selectedDriverId) {
     
      console.log(`Assigning driver ${selectedDriverId} to order ${order.id}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Assign Driver to Order {order.orderNumberDisplay}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Select a driver for this order.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <div className="space-y-4 sm:space-x-3 sm:space-y-0 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                disabled={!selectedDriverId}
                onClick={handleAssign}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50"
              >
                Assign
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
          {/* Drivers List */}
          <div className="px-4 py-4">
            <ul className="divide-y divide-gray-200">
              {availableDrivers.map((driver) => (
                <li key={driver.id}>
                  <label className="flex items-center justify-between py-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="driver"
                        value={driver.id}
                        checked={selectedDriverId === driver.id}
                        onChange={() => setSelectedDriverId(driver.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-3 block text-sm font-medium text-gray-900">
                        {driver.name}
                      </span>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignDriverModal;