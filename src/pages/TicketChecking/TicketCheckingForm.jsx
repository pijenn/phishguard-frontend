import { useState } from "react";

export default function TicketCheckingForm({ onSearch, loading = false }) {
  const [ticketId, setTicketId] = useState("");
  const [touched, setTouched] = useState(false);

  const isEmpty = ticketId.trim() === "";

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (isEmpty) return;
    if (onSearch) onSearch(ticketId);
  };

  return (
    <div className="flex flex-col items-start gap-4 p-8 sm:p-12 relative self-stretch w-full flex-[0_0_auto] rounded-[20px] overflow-hidden shadow-[0px_4px_4px_#00000040] [background:linear-gradient(0deg,rgba(249,249,249,1)_0%,rgba(249,249,249,1)_100%)]">

      <img className="absolute top-[396px] right-0 w-72 h-[373px] hidden xl:block pointer-events-none" src="img/poligon-6.svg" alt="" />
      <img className="absolute top-0 left-0 w-[461px] h-96 hidden xl:block pointer-events-none" src="img/poligon-4.svg" alt="" />

      <div className="flex flex-col items-center px-0 py-8 sm:py-[54px] relative self-stretch w-full flex-[0_0_auto] z-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-0 sm:px-3.5 py-2 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex flex-col w-16 h-16 sm:w-20 sm:h-20 items-center justify-center gap-2.5 p-4 relative rounded-[20px] aspect-[1] flex-shrink-0 [background:radial-gradient(50%_50%_at_95%_60%,rgba(119,119,119,1)_0%,rgba(74,74,74,1)_25%,rgba(28,28,28,1)_75%)]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
              <path d="M12 8V12M12 16V16.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="relative flex items-center justify-center w-fit [font-family:'Helvetica_Neue-Bold',Helvetica] font-bold text-[rgba(26,28,28,1)] text-4xl sm:text-6xl lg:text-7xl text-center tracking-[-2px] sm:tracking-[-3.60px] leading-tight sm:leading-[72px]">
            Cek Tiket
          </h1>
        </div>

        <p className="relative flex items-center justify-center w-full max-w-[724px] mt-4 [font-family:'Helvetica_Light-Regular',Helvetica] font-normal text-[rgba(26,28,28,1)] text-sm sm:text-base text-center tracking-[0] leading-[normal]">
          Masukkan nomor tiket Anda untuk melihat status dan respons dari Admin kami terkait laporan yang telah Anda kirimkan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 pt-0 pb-8 sm:pb-[54px] px-0 relative self-stretch w-full flex-[0_0_auto] z-10">
        <div className="w-full max-w-md">
          <label className="relative flex items-center w-fit [font-family:'Helvetica_Neue-Regular',Helvetica] font-normal text-[rgba(26,28,28,1)] text-sm sm:text-base tracking-[-0.35px] leading-5 mb-2">
            Nomor Tiket
          </label>
          <input
            type="text"
            placeholder="Contoh: PH-20260531-0002"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            onBlur={() => setTouched(true)}
            disabled={loading}
            className="w-full px-4 py-3 rounded-[10px] border-2 border-solid border-[rgba(200,200,200,1)] bg-white [font-family:'Helvetica_Neue-Regular',Helvetica] text-base text-[rgba(26,28,28,1)] placeholder-[rgba(150,150,150,1)] focus:border-[rgba(111,0,0,1)] focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          />
          {touched && isEmpty && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">
              Silakan masukkan nomor tiket
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isEmpty || loading}
          className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-[10px] [background:radial-gradient(50%_50%_at_95%_60%,rgba(119,119,119,1)_0%,rgba(74,74,74,1)_25%,rgba(28,28,28,1)_75%)] hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0px_4px_4px_#00000040] transition-all duration-300"
        >
          <span className="relative flex items-center justify-center [font-family:'Helvetica_Neue-Bold',Helvetica] font-bold text-[rgba(249,249,249,1)] text-base sm:text-lg text-center tracking-[-0.35px] leading-5 whitespace-nowrap">
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mencari...
              </>
            ) : (
              "Cari Tiket"
            )}
          </span>
        </button>
      </form>
    </div>
  );
}
