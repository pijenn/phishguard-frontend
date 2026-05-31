export default function TicketCheckingResult({ result, error, ticketId, loading, onReset }) {
  if (error) {
    return (
      <div className="flex flex-col items-start gap-4 p-8 sm:p-12 relative self-stretch w-full flex-[0_0_auto] rounded-[20px] overflow-hidden shadow-[0px_4px_4px_#00000040] [background:linear-gradient(0deg,rgba(249,249,249,1)_0%,rgba(249,249,249,1)_100%)]">
        <img className="absolute top-[396px] right-0 w-72 h-[373px] hidden xl:block pointer-events-none" src="img/poligon-6.svg" alt="" />
        <img className="absolute top-0 left-0 w-[461px] h-96 hidden xl:block pointer-events-none" src="img/poligon-4.svg" alt="" />

        <div className="flex flex-col items-center px-0 py-8 sm:py-[54px] relative self-stretch w-full flex-[0_0_auto] z-10 gap-6">
          <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="#FF3B30" strokeWidth="1.5" />
              <path d="M12 7V12M12 16V16.5" stroke="#FF3B30" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          <div className="text-center">
            <h2 className="[font-family:'Helvetica_Neue-Bold',Helvetica] font-bold text-[rgba(26,28,28,1)] text-3xl sm:text-4xl tracking-[-0.35px] leading-tight mb-2">
              Tiket Tidak Ditemukan
            </h2>
            <p className="[font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-[rgba(26,28,28,1)] text-base tracking-[0] leading-[normal] max-w-md mx-auto">
              {error}
            </p>
          </div>

          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-[10px] [background:radial-gradient(50%_50%_at_95%_60%,rgba(119,119,119,1)_0%,rgba(74,74,74,1)_25%,rgba(28,28,28,1)_75%)] hover:opacity-90 hover:-translate-y-0.5 shadow-[0px_4px_4px_#00000040] transition-all duration-300"
          >
            <span className="[font-family:'Helvetica_Neue-Bold',Helvetica] font-bold text-[rgba(249,249,249,1)] text-base sm:text-lg tracking-[-0.35px]">
              Coba Lagi
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  // Get status dari admin_actions
  const getStatus = (report) => {
    if (!report || !report.admin_actions || report.admin_actions.length === 0) return "Belum Ditangani";
    const lastAction = report.admin_actions[report.admin_actions.length - 1];
    const isClosed = 
      lastAction.hasil_keputusan === "Confirm Valid Phishing" || 
      lastAction.hasil_keputusan === "False Positive" || 
      lastAction.selesaikanTiket || 
      lastAction.selesaikan_tiket;
    return isClosed ? "Selesai" : "Diproses";
  };

  const getStatusColor = (status) => {
    if (status === "Belum Ditangani") return { bg: "#FF3B30", label: "Belum Ditangani" };
    if (status === "Diproses") return { bg: "#FFCC00", label: "Diproses" };
    return { bg: "#34C759", label: "Selesai" };
  };

  const ticketNumber = result.ticket || `PH-${result.id}`;
  const reporterName = result.reporter_name || "Pengguna";
  const createdDate = new Date(result.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  const mlResult = result.ml_result || {};
  const riskScore = mlResult.risk_score || 0;
  const label = mlResult.label || "unknown";
  const isPhishing = label.toLowerCase() === "phishing";
  const adminActions = result.admin_actions || [];
  const latestAction = adminActions.length > 0 ? adminActions[adminActions.length - 1] : null;
  
  // Calculate current status
  const currentStatus = getStatus(result);
  const statusConfig = getStatusColor(currentStatus);

  return (
    <div className="flex flex-col items-start gap-6 p-8 sm:p-12 relative self-stretch w-full flex-[0_0_auto] rounded-[20px] overflow-hidden shadow-[0px_4px_4px_#00000040] [background:linear-gradient(0deg,rgba(249,249,249,1)_0%,rgba(249,249,249,1)_100%)]">
      <img className="absolute top-0 left-0 w-[461px] h-96 hidden xl:block pointer-events-none" src="img/polygon-1-dashboard.svg" alt="" />

      <div className="flex flex-col items-center gap-4 text-center relative z-10 w-full">
        <h2 className="[font-family:'Helvetica_Neue-Bold',Helvetica] font-bold text-[rgba(26,28,28,1)] text-3xl sm:text-5xl tracking-[-2px] sm:tracking-[-3.60px] leading-tight">
          Hasil Cek Tiket
        </h2>
        <p className="[font-family:'Helvetica_Light-Regular',Helvetica] font-normal text-[rgba(26,28,28,1)] text-sm sm:text-base max-w-[600px]">
          Berikut adalah detail tiket dan status respons dari Admin kami.
        </p>
      </div>

      {/* Status Banner */}
      <div className="w-full relative z-10 flex items-center gap-3 p-4 sm:p-5 rounded-[15px] transition-colors duration-300" style={{ backgroundColor: statusConfig.bg + "20", borderLeft: `4px solid ${statusConfig.bg}` }}>
        <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: statusConfig.bg }}>
          <span className="text-white text-sm font-bold">✓</span>
        </div>
        <div className="flex-grow">
          <p className="[font-family:'Helvetica_Neue-Bold',Helvetica] font-bold text-sm" style={{ color: statusConfig.bg }}>
            Status Tiket: {statusConfig.label}
          </p>
        </div>
      </div>

      {/* Ticket Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full relative z-10">
        {/* Ticket ID Card */}
        <div className="flex flex-col gap-2 p-4 sm:p-5 bg-white rounded-[15px] border border-[rgba(200,200,200,1)]">
          <p className="[font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-[rgba(26,28,28,0.7)] text-xs sm:text-sm">
            Nomor Tiket
          </p>
          <p className="[font-family:'Helvetica_Neue-Bold',Helvetica] font-bold text-[rgba(111,0,0,1)] text-lg sm:text-xl">
            {ticketNumber}
          </p>
        </div>

        {/* Reporter Name Card */}
        <div className="flex flex-col gap-2 p-4 sm:p-5 bg-white rounded-[15px] border border-[rgba(200,200,200,1)]">
          <p className="[font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-[rgba(26,28,28,0.7)] text-xs sm:text-sm">
            Nama Pelapor
          </p>
          <p className="[font-family:'Helvetica_Neue-Bold',Helvetica] font-bold text-[rgba(26,28,28,1)] text-base sm:text-lg break-words">
            {reporterName}
          </p>
        </div>

        {/* Date Created Card */}
        <div className="flex flex-col gap-2 p-4 sm:p-5 bg-white rounded-[15px] border border-[rgba(200,200,200,1)]">
          <p className="[font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-[rgba(26,28,28,0.7)] text-xs sm:text-sm">
            Tanggal Laporan
          </p>
          <p className="[font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-[rgba(26,28,28,1)] text-sm sm:text-base">
            {createdDate}
          </p>
        </div>

        {/* Risk Score Card */}
        <div className="flex flex-col gap-2 p-4 sm:p-5 bg-white rounded-[15px] border border-[rgba(200,200,200,1)]">
          <p className="[font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-[rgba(26,28,28,0.7)] text-xs sm:text-sm">
            Risk Score
          </p>
          <p className="[font-family:'Helvetica_Neue-Bold',Helvetica] font-bold text-[rgba(111,0,0,1)] text-lg sm:text-xl">
            {riskScore}%
          </p>
        </div>
      </div>

      {/* Status Section */}
      <div className="w-full relative z-10 pt-4 border-t border-[rgba(200,200,200,0.3)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: statusConfig.bg }}
            />
            <span className="[font-family:'Helvetica_Neue-Bold',Helvetica] font-bold text-[rgba(26,28,28,1)]">
              Status: {statusConfig.label}
            </span>
          </div>
          <span
            className="px-3 py-1 rounded-full text-white text-xs sm:text-sm [font-family:'Helvetica_Neue-Bold',Helvetica] font-bold w-fit"
            style={{ backgroundColor: statusConfig.bg }}
          >
            {isPhishing ? "Phishing" : "Safe"}
          </span>
        </div>
      </div>

      {/* Admin Response Section */}
      {latestAction && (
        <div className="w-full relative z-10 bg-blue-50 p-5 sm:p-6 rounded-[15px] border-l-4 border-blue-500">
          <h3 className="[font-family:'Helvetica_Neue-Bold',Helvetica] font-bold text-[rgba(26,28,28,1)] text-lg mb-3">
            Respons dari Admin
          </h3>
          <div className="space-y-3">
            <div>
              <p className="[font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-[rgba(26,28,28,0.7)] text-xs sm:text-sm">
                Keputusan:
              </p>
              <p className="[font-family:'Helvetica_Neue-Bold',Helvetica] font-bold text-[rgba(26,28,28,1)] text-base mt-1">
                {latestAction.hasil_keputusan || "Sedang Diproses"}
              </p>
            </div>
            {latestAction.catatan && (
              <div>
                <p className="[font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-[rgba(26,28,28,0.7)] text-xs sm:text-sm">
                  Catatan:
                </p>
                <p className="[font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-[rgba(26,28,28,1)] text-sm sm:text-base mt-1">
                  {latestAction.catatan}
                </p>
              </div>
            )}
            <div>
              <p className="[font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-[rgba(26,28,28,0.7)] text-xs sm:text-sm">
                Tanggal Respons:
              </p>
              <p className="[font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-[rgba(26,28,28,1)] text-sm sm:text-base mt-1">
                {new Date(latestAction.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Report Details */}
      {result.chat_text && (
        <div className="w-full relative z-10 bg-gray-50 p-5 sm:p-6 rounded-[15px]">
          <h3 className="[font-family:'Helvetica_Neue-Bold',Helvetica] font-bold text-[rgba(26,28,28,1)] text-lg mb-3">
            Pesan yang Dilaporkan
          </h3>
          <p className="[font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-[rgba(26,28,28,1)] text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {result.chat_text}
          </p>
        </div>
      )}

      {/* Back Button */}
      <div className="w-full relative z-10 flex justify-center pt-4">
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-[10px] [background:radial-gradient(50%_50%_at_95%_60%,rgba(119,119,119,1)_0%,rgba(74,74,74,1)_25%,rgba(28,28,28,1)_75%)] hover:opacity-90 hover:-translate-y-0.5 shadow-[0px_4px_4px_#00000040] transition-all duration-300"
        >
          <span className="[font-family:'Helvetica_Neue-Bold',Helvetica] font-bold text-[rgba(249,249,249,1)] text-base sm:text-lg tracking-[-0.35px]">
            Cari Tiket Lain
          </span>
        </button>
      </div>
    </div>
  );
}
