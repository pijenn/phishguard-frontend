import { useState } from "react";
import { getReportById, getResponses } from "../../services/api";
import TicketCheckingForm from "./TicketCheckingForm";
import TicketCheckingResult from "./TicketCheckingResult";

export default function TicketCheckingPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [searchedTicketId, setSearchedTicketId] = useState(null);

  const handleSearch = async (ticketId) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSearchedTicketId(ticketId);

    try {
      // Extract numeric ID from ticket format (e.g., "PH-20260531-0002" -> "2")
      let reportId = ticketId;
      
      if (ticketId.includes("-")) {
        const parts = ticketId.split("-");
        reportId = Number(parts[parts.length - 1]); // Get the last part (numeric ID)
      }

      // Fetch the report
      let reportRes = await getReportById(reportId);
      let reportData = reportRes.data || reportRes;
      
      // Ensure admin_actions is initialized
      reportData.admin_actions = reportData.admin_actions || [];

      try {
        const respRes = await getResponses({ report_id: reportId });
        const list = respRes.data || respRes;
        
        if (list && list.length > 0) {
          const adminAction = list[0];
          reportData.admin_actions = [
            {
              id: adminAction.id,
              report_id: adminAction.report_id,
              hasil_keputusan: adminAction.hasil_keputusan,
              kategori: adminAction.kategori,
              catatan: adminAction.catatan,
              created_by: adminAction.created_by,
              updated_by: adminAction.updated_by,
              created_at: adminAction.created_at,
              updated_at: adminAction.updated_at
            }
          ];
        }
      } catch (e) {
         console.warn("Gagal memuat respons admin:", e);
      }
      
      setResult(reportData);

    } catch (err) {
      setError(err.message || "Tidak dapat menemukan tiket. Silakan cek kembali nomor tiket Anda.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setSearchedTicketId(null);
  };

  return (
    <div className="flex flex-col w-full items-start relative bg-[rgba(252,245,233,1)] min-h-screen">
      <div className="w-full pt-[80px] sm:pt-[100px] lg:pt-[120px]" />

      <div className="flex flex-col items-start gap-2.5 pt-4 pb-2 px-4 relative self-stretch w-full flex-[0_0_auto]">
        {!result && !error ? (
          <TicketCheckingForm onSearch={handleSearch} loading={loading} />
        ) : (
          <TicketCheckingResult
            result={result}
            error={error}
            ticketId={searchedTicketId}
            loading={loading}
            onReset={handleReset}
          />
        )}
      </div>

      <div className="w-full pb-4 sm:pb-6" />
    </div>
  );
}
