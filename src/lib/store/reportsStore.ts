import { createStoreFactory } from "./storeFactory";
import { ReportsState } from "@/lib/types/auth";

export const useReportsStore = createStoreFactory<ReportsState>({
  reports: null,
});


export const setReports = (data: ReportsState) =>
  useReportsStore.getState().setState({ reports: data });

// Patch/merge reports (for partial updates)
export const updateReports = (partial: Partial<ReportsState>) => {
  const { reports } = useReportsStore.getState().state;
  if (!reports) return;

  useReportsStore.getState().setState({
    reports: { ...reports, ...partial },
  });
};

// Reset / Clear reports
export const clearReports = () =>
  useReportsStore.getState().resetState();
