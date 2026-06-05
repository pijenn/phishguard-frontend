import { useState } from "react";
import { getReports, getReportById, getResponses, getResponseById } from "../../services/api";
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
      // 1. Fetch semua report untuk menemukan ID database yang sebenarnya dari string tiket ini
      let reportsRes = await getReports();
      let allReports = reportsRes.data || reportsRes;
      
      let matchedReport = allReports.find(r => r.ticket === ticketId);
      if (!matchedReport) {
        throw new Error("Tidak dapat menemukan tiket. Silakan cek kembali nomor tiket Anda.");
      }
      
      const trueReportId = matchedReport.id; // e.g., 35
      
      // Ambil data spesifik report by ID nya
      let reportRes = await getReportById(trueReportId);
      let reportData = reportRes.data || reportRes;
      reportData.admin_actions = reportData.admin_actions || [];

      // 2. Cari ID respons untuk report ini
      try {
        const respListRes = await getResponses({ report_id: trueReportId });
        const list = respListRes.data || respListRes;
        
        if (list && list.length > 0) {
          const responsId = list[0].id; // e.g., 3
          
          // "mengecek ticket itu id nya berapa baru dia menjadi params di linknya"
          // Fetch respons by ID (API /respons/{id})
          const singleRespRes = await getResponseById(responsId);
          const adminAction = singleRespRes.data || singleRespRes;
          
          if (adminAction && adminAction.id) {
            // Gunakan data report dari respons jika ada, agar sinkron
            if (adminAction.report) {
              reportData = adminAction.report;
            }
            
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
