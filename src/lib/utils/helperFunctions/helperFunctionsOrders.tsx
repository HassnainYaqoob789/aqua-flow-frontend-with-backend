// src/utils/orderHelpers.ts
import { format } from "date-fns";

/**
 * formatItems()
 * -----------------------------
 * Converts the items array into a simple text string.
 * Used in table rows or compact UI where tags/pills are not required.
 * Example output: "Bottle (x2), Dispenser (x1)"
 */
export const formatItems = (items: any[]) =>
  !items?.length
    ? "—"
    : items
      .map((i) => `${i.product?.name || "Item"} (x${i.quantity || 1})`)
      .join(", ");

/**
 * renderItems()
 * -----------------------------
 * Renders items as styled pill components (UI tags).
 * Used in mobile cards or detailed views where visual grouping is helpful.
 * Each item shows product name + quantity in a rounded colored badge.
 */
export const renderItems = (items: any[]) =>
  !items?.length ? (
    <span className="text-gray-400">—</span>
  ) : (
    <div className="flex flex-wrap gap-2">
      {items.map((i: any, idx: number) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
        >
          {i.product?.name || "Item"}
          <span className="text-[14px] opacity-70">(x{i.quantity || 1})</span>
        </span>
      ))}
    </div>
  );



/**
* getDeliveryStatus()
* ------------------------------------------
* Returns Tailwind CSS color classes based on how close
* the delivery date is compared to today.
*
* Logic:
* - Past date  → Red
* - Today      → Yellow
* - Within 2 days → Orange
* - Future beyond 2 days → Green
*
* Purpose:
* Used for badge/tag background + text colors in both table
* and mobile views to visually communicate urgency.
*/
export const getDeliveryStatus = (deliveryDate: string) => {
  const today = new Date();
  const date = new Date(deliveryDate);

  // Normalize to midnight for accurate day comparison
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return "bg-red-100 text-red-700 border border-red-300";
  if (diffDays === 0) return "bg-yellow-100 text-yellow-700 border border-yellow-300";
  if (diffDays <= 2) return "bg-orange-100 text-orange-700 border border-orange-300";

  return "bg-green-100 text-green-700 border border-green-300";
};






/**
 * getStatusColor()
 * -------------------------------------------------------
 * Returns Tailwind CSS classes for order status badges.
 *
 * Purpose:
 * Standardizes the color theme for all order statuses
 * across tables, cards, timelines, and detail views.
 *
 * Status Mapping:
 * - pending     → Dark neutral (waiting / unprocessed)
 * - in_progress → Blue (active workflow)
 * - delivered   → Green (success / completed)
 * - cancelled   → Red (terminated / failed)
 *
 * Default:
 * Falls back to a neutral gray badge if the status
 * is unknown or missing.
 */
export const getStatusColor = (status: string) => {
  switch (status) {
    case "in_progress":
      return "bg-blue-50 text-blue-700 border border-blue-200";

    case "out_for_delivery":
      return "bg-indigo-50 text-indigo-700 border border-indigo-200";

    case "delivered":
      return "bg-green-50 text-green-700 border border-green-200";

    case "completed":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";

    case "pending":
      return "bg-gray-100 text-gray-700 border border-gray-200";

    case "cancelled":
      return "bg-red-50 text-red-700 border border-red-200";

    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
};






/**
 * getDeliveryStatusText()
 * -------------------------------------------------------
 * Returns a human-readable text label based on how close
 * the delivery date is compared to today.
 *
 * Purpose:
 * Used alongside getDeliveryStatus() to show a textual
 * explanation of urgency (e.g., on cards, tooltips, tables).
 *
 * Logic:
 * - Past date      → "Delivery overdue"
 * - Today          → "Delivering today"
 * - Within 2 days  → "Near deadline"
 * - Beyond 2 days  → "On schedule"
 *
 * This keeps both UI and reporting consistent across the app.
 */
export const getDeliveryStatusText = (deliveryDate: string) => {
  const today = new Date();
  const date = new Date(deliveryDate);

  // Normalize both dates to midnight for accurate day difference
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return "Delivery overdue";
  if (diffDays === 0) return "Delivering today";
  if (diffDays <= 2) return "Near deadline";

  return "On schedule";
};




/**
 * formatDeliveryDate()
 * -------------------------------------------------------
 * Converts a raw date string into a clean, readable format.
 *
 * Purpose:
 * Standardizes date formatting across the dashboard
 * (tables, mobile cards, detail views, etc.).
 *
 * Example output:
 *   "2025-01-12" → "Jan 12, 2025"
 *
 * Uses date-fns `format()` for reliable, locale-safe formatting.
 */
export const formatDeliveryDate = (dateString: string) =>
  format(new Date(dateString), "MMM d, yyyy");


/**
 * formatPayment()
 * -------------------------------------------------------
 * Normalizes payment method labels for UI display.
 *
 * Logic:
 * - Converts "cash_on_delivery" → "COD"
 * - For everything else, replaces underscores with spaces.
 *
 * Purpose:
 * Ensures that payment values stored in the backend
 * are transformed into user-friendly text in the UI.
 *
 * Examples:
 *   "bank_transfer" → "bank transfer"
 *   "wallet_payment" → "wallet payment"
 */
export const formatPayment = (method: string) =>
  method === "cash_on_delivery" ? "COD" : method.replace(/_/g, " ");
