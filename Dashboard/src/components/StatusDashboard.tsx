import { useEffect, useState } from 'react';
import { StatusCard } from './StatusCard';
import {
  Activity,
  TrendingUp,
  Handshake,
  Calendar as CalendarIcon,
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import bwLogo from 'figma:asset/BW.png';
import {
  getBaswareDashboard,
  getBaswareStpDashboard,
  getBaswareDashboardDetails,
  getBaswareToMw,
  getBaswareToMwStp,
} from '../services/requestApis';
import { Separator } from './ui/separator';

const DateDisplay = ({
  selectedDate,
  onDateChange,
}: {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}) => {
  const [open, setOpen] = useState(false);

  const displayDate = selectedDate || new Date();

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl px-6 py-3 shadow-xl date-component cursor-pointer">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-gray-400 text-xs mb-0.5">
                {selectedDate ? 'Selected Date' : 'Current Date'}
                {selectedDate && (
                  <span
                    className="ml-2 text-blue-400 hover:text-blue-300 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDateChange(null);
                    }}
                  >
                    (Clear)
                  </span>
                )}
              </p>
              <p className="text-white text-lg">{formatDate(displayDate)}</p>
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-slate-800/95 backdrop-blur-xl border-slate-700">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            onDateChange(date);
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export function StatusDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dateForApi, setDateForApi] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [totalSuccess, setTotalSuccess] = useState(0);
  const [totalError, setTotalError] = useState(0);
  const [totalWaiting, setTotalWaiting] = useState(0);
  const [total, setTotal] = useState(0);
  const [successRate, setSuccessRate] = useState(0);

  const [statusDataStp, setStatusDataStp] = useState([]);

  const [statusDataDetails, setStatusDataDetails] = useState([]);

  const [baswareToMwTotals, setBaswareToMwTotals] = useState(null);
  const [baswareToMwStpTotals, setBaswareToMwStpTotals] = useState(null);

  const [isLoading, setLoadingStatus] = useState(true);

  const [displayDialog, setDisplayDialog] = useState(false);

  useEffect(() => {
    function fetchDashboardData(dateForApiParam) {
      getBaswareDashboard(dateForApiParam)
        .then((response) => {
          const now = new Date();
          setLastUpdated(
            now.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          );
          const data = response.data;
          const mappedStatusData = [
            {
              title: 'PO - INV & FRT',
              success: data.rcptLog[0]?.SUCCESS || 0,
              error: data.rcptLog[0]?.ERROR || 0,
              waiting: data.rcptLog[0]?.WAITING || 0,
              detail: 'rcpt_log_detail',
            },
            {
              title: 'OE - FRO',
              success: data.rcptLogOE[0]?.SUCCESS || 0,
              error: data.rcptLogOE[0]?.ERROR || 0,
              waiting: data.rcptLogOE[0]?.WAITING || 0,
              detail: 'rcpt_logoe_detail',
            },
            {
              title: 'MP - CHG',
              success: data.rcptLogMP[0]?.SUCCESS || 0,
              error: data.rcptLogMP[0]?.ERROR || 0,
              waiting: data.rcptLogMP[0]?.WAITING || 0,
              detail: 'rcpt_logmp_detail',
            },
            {
              title: 'OE - CHG',
              success: data.rcptLogSP[0]?.SUCCESS || 0,
              error: data.rcptLogSP[0]?.ERROR || 0,
              waiting: data.rcptLogSP[0]?.WAITING || 0,
              detail: 'rcpt_logsp_detail',
            },
          ];
          setStatusData(mappedStatusData);
          getBaswareStpDashboard(dateForApiParam)
            .then((response) => {
              const now = new Date();
              setLastUpdated(
                now.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })
              );
              const data = response.data;
              const mappedStatusDataStp = [
                {
                  title: 'PO - INV & FRT',
                  success: data.rcptLog[0]?.SUCCESS || 0,
                  error: data.rcptLog[0]?.ERROR || 0,
                  waiting: data.rcptLog[0]?.WAITING || 0,
                  detail: 'rcpt_log_detail_stp',
                },
                {
                  title: 'OE - FRO',
                  success: data.rcptLogOE[0]?.SUCCESS || 0,
                  error: data.rcptLogOE[0]?.ERROR || 0,
                  waiting: data.rcptLogOE[0]?.WAITING || 0,
                  detail: 'rcpt_logoe_detail_stp',
                },
                {
                  title: 'MP - CHG',
                  success: data.rcptLogMP[0]?.SUCCESS || 0,
                  error: data.rcptLogMP[0]?.ERROR || 0,
                  waiting: data.rcptLogMP[0]?.WAITING || 0,
                  detail: 'rcpt_logmp_detail_stp',
                },
                {
                  title: 'OE - CHG',
                  success: data.rcptLogSP[0]?.SUCCESS || 0,
                  error: data.rcptLogSP[0]?.ERROR || 0,
                  waiting: data.rcptLogSP[0]?.WAITING || 0,
                  detail: 'rcpt_logsp_detail_stp',
                },
              ];
              setStatusDataStp(mappedStatusDataStp);
              let totSucc = mappedStatusData.reduce(
                (sum, item) => sum + item.success,
                0
              );
              let totErr = mappedStatusData.reduce(
                (sum, item) => sum + item.error,
                0
              );
              let totWait = mappedStatusData.reduce(
                (sum, item) => sum + item.waiting,
                0
              );

              let totSuccStp = mappedStatusDataStp.reduce(
                (sum, item) => sum + item.success,
                0
              );
              let totErrStp = mappedStatusDataStp.reduce(
                (sum, item) => sum + item.error,
                0
              );
              let totWaitStp = mappedStatusDataStp.reduce(
                (sum, item) => sum + item.waiting,
                0
              );
              let tot =
                totSucc +
                totErr +
                totWait +
                totSuccStp +
                totErrStp +
                totWaitStp;

              setTotalSuccess(totSucc + totSuccStp);
              setTotalError(totErr + totErrStp);
              setTotalWaiting(totWait + totWaitStp);
              setTotal(tot);
              setSuccessRate(
                tot > 0 ? (((totSucc + totSuccStp) / tot) * 100).toFixed(1) : 0
              );

              setLoadingStatus(false);
            })
            .catch((error) => {
              console.error('Error fetching data:', error);
            });
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }

    fetchDashboardData(dateForApi); // Initial fetch
    const intervalId = setInterval(fetchDashboardData, 300000); // 5 minutes
    // const intervalId = setInterval(fetchDashboardData, 5000); // 5 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [dateForApi]);

  useEffect(() => {
    function fetchBaswareToMw(dateForApiParam) {
      getBaswareToMw(dateForApiParam)
        .then((response) => {
          setBaswareToMwTotals(response.data);
          console.log(436, response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });

      getBaswareToMwStp(dateForApiParam)
        .then((response) => {
          setBaswareToMwStpTotals(response.data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }

    fetchBaswareToMw(dateForApi);
    const intervalIdBw = setInterval(fetchBaswareToMw, 300000); // 5 minutes
    // const intervalIdBw = setInterval(fetchBaswareToMw, 5000); // 5 seconds
    return () => clearInterval(intervalIdBw); // Cleanup on unmount
  }, [dateForApi]);

  // const totalSuccess = statusData.reduce((sum, item) => sum + item.success, 0);
  // const totalError = statusData.reduce((sum, item) => sum + item.error, 0);
  // const totalWaiting = statusData.reduce((sum, item) => sum + item.waiting, 0);
  // const total = totalSuccess + totalError + totalWaiting;
  // const successRate = total > 0 ? ((totalSuccess / total) * 100).toFixed(1) : 0;

  return (
    <div className="flex">
      {/* <div className="max-w-7xl mx-auto"> */}
      <div className="flex-grow-2">
        {/* Header Section */}

        <div className="mb-10 header-animate">
          <div className="flex items-center justify-start gap-3 mb-4">
            <div className="flex items-center justify-center space-x-4 flex-1">
              <img
                src={bwLogo}
                alt="TW Metals Logo"
                className="h-nav-logo object-contain"
              />
            </div>
            <div className="flex justify-center flex-grow-2 text-center flex items-center">
              <h1 style={{ color: '#fff', fontSize: '3rem' }}>M - B</h1>
            </div>
            <div className="flex flex-col items-center justify-center mb-6">
              <DateDisplay
                selectedDate={selectedDate}
                // onDateChange={setSelectedDate}
                onDateChange={(date) => {
                  console.log('Selected date:', date);
                  if (date) {
                    setLoadingStatus(true);
                    // Format date as YYYY-MM-DD
                    const yyyy = date.getFullYear();
                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                    const dd = String(date.getDate()).padStart(2, '0');
                    const formatted = `${yyyy}-${mm}-${dd}`;
                    setDateForApi(formatted);
                    setSelectedDate(date);
                  } else {
                    setLoadingStatus(true);
                    setSelectedDate(null);
                    setDateForApi(null);
                  }
                }}
              />
              {/* {lastUpdated && (
                <span className="text-xs text-gray-400 mt-1">
                  Last Updated: {lastUpdated}
                </span>
              )} */}
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="stat-card-1 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Processes</p>
                  <p className="text-white text-3xl mt-1">{total}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="stat-card-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-green-500/30 rounded-xl p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">Success</p>
                  <p className="text-white text-3xl mt-1">{totalSuccess}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-300 text-sm">{successRate}%</span>
                </div>
              </div>
            </div>

            <div className="stat-card-3 bg-gradient-to-br from-red-500/20 to-rose-500/20 backdrop-blur-lg border border-red-500/30 rounded-xl p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-200 text-sm">Errors</p>
                  <p className="text-white text-3xl mt-1">{totalError}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border-2 border-red-500/30">
                  <span className="text-red-300 icon-pulse">!</span>
                </div>
              </div>
            </div>

            <div className="stat-card-4 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-lg border border-yellow-500/30 rounded-xl p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200 text-sm">Waiting</p>
                  <p className="text-white text-3xl mt-1">{totalWaiting}</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 pulse-dot shadow-lg shadow-yellow-400/50"></div>
              </div>
            </div>

            <div className="self-start flex-grow-2 p-4">
              <h1 style={{ color: '#fff', fontSize: '3rem' }}>B - M</h1>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="mb-2 mt-8">
              <h2 className="text-3xl font-bold text-white mb-3 pl-1 drop-shadow-lg">
                TW Metals
              </h2>
              {/* TW Metals Section */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statusData.map((data, index) => (
                  <>
                    <div key={index} className={`card-animate-${index + 1}`}>
                      <StatusCard
                        title={data.title}
                        success={data.success}
                        error={data.error}
                        waiting={data.waiting}
                        detail={data.detail}
                        // displayDialog={displayDialog}
                        // setDisplayDialog={setDisplayDialog}
                        setStatusDataDetails={setStatusDataDetails}
                        dateForApi={dateForApi}
                      />
                    </div>
                  </>
                ))}
                <div className="flex flex-col gap-6 mb-8">
                  <div className="m-cus h-cus w-2xl flex justify-center stat-card-1 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center">
                        <p className="text-gray-400 text-4xl">INV</p>
                        <p className="text-white text-4xl mt-1">
                          {baswareToMwTotals?.inv}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="m-cus h-cus w-2xl flex justify-center stat-card-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-green-500/30 rounded-xl p-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center">
                        <p className="text-green-200 text-4xl">CHG</p>
                        <p className="text-white text-4xl mt-1">
                          {baswareToMwTotals?.chg}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="m-cus h-cus w-2xl flex justify-center stat-card-3 bg-gradient-to-br from-red-500/20 to-rose-500/20 backdrop-blur-lg border border-red-500/30 rounded-xl p-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center">
                        <p className="text-red-200 text-4xl">FRT</p>
                        <p className="text-white text-4xl mt-1">
                          {baswareToMwTotals?.frt}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="m-cus h-cus w-2xl flex justify-center stat-card-4 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-lg border border-yellow-500/30 rounded-xl p-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center">
                        <p className="text-yellow-200 text-4xl">EXP</p>
                        <p className="text-white text-4xl mt-1">
                          {baswareToMwTotals?.exp}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="m-cus h-cus w-2xl flex justify-center stat-card-3 bg-gradient-to-br from-red-500/20 to-rose-500/20 backdrop-blur-lg border border-red-500/30 rounded-xl p-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-white/10">
                              <TableHead className="text-gray-300">
                                <div className="flex items-center gap-2">
                                  <Handshake className="w-4 h-4" />
                                  Vendor
                                </div>
                              </TableHead>
                              <TableHead className="text-gray-300">
                                Status
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow className="border-white/10">
                              <TableCell className="text-gray-300 text-sm">
                                {baswareToMwTotals?.ven?.VENDORS}
                              </TableCell>
                              <TableCell className="text-gray-300 text-sm">
                                {baswareToMwTotals?.ven?.STATUS}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-3 mt-2 border-t border-white/10"></div>

            <div className="mb-2 mt-8">
              <h2 className="text-3xl font-bold text-white mb-3 pl-1 drop-shadow-lg">
                STP
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statusDataStp.map((data, index) => (
                  <div key={index} className={`card-animate-${index + 1}`}>
                    <StatusCard
                      title={data.title}
                      success={data.success}
                      error={data.error}
                      waiting={data.waiting}
                      detail={data.detail}
                      // displayDialog={displayDialog}
                      // setDisplayDialog={setDisplayDialog}
                      setStatusDataDetails={setStatusDataDetails}
                      dateForApi={dateForApi}
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-6 mb-8">
                  <div className="m-cus h-cus w-2xl flex justify-center stat-card-1 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center">
                        <p className="text-gray-400 text-4xl">INV</p>
                        <p className="text-white text-4xl mt-1">
                          {baswareToMwStpTotals?.inv_stp}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="m-cus h-cus w-2xl flex justify-center stat-card-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-green-500/30 rounded-xl p-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center">
                        <p className="text-green-200 text-4xl">CHG</p>
                        <p className="text-white text-4xl mt-1">
                          {baswareToMwStpTotals?.chg_stp}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="m-cus h-cus w-2xl flex justify-center stat-card-3 bg-gradient-to-br from-red-500/20 to-rose-500/20 backdrop-blur-lg border border-red-500/30 rounded-xl p-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center">
                        <p className="text-red-200 text-4xl">FRT</p>
                        <p className="text-white text-4xl mt-1">
                          {baswareToMwStpTotals?.frt_stp}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="m-cus h-cus w-2xl flex justify-center stat-card-4 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-lg border border-yellow-500/30 rounded-xl p-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center">
                        <p className="text-yellow-200 text-4xl">EXP</p>
                        <p className="text-white text-4xl mt-1">
                          {baswareToMwStpTotals?.exp_stp}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="m-cus h-cus w-2xl flex justify-center stat-card-3 bg-gradient-to-br from-red-500/20 to-rose-500/20 backdrop-blur-lg border border-red-500/30 rounded-xl p-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-white/10">
                              <TableHead className="text-gray-300">
                                <div className="flex items-center gap-2">
                                  <Handshake className="w-4 h-4" />
                                  Vendor
                                </div>
                              </TableHead>
                              <TableHead className="text-gray-300">
                                Status
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow className="border-white/10">
                              <TableCell className="text-gray-300 text-sm">
                                {baswareToMwStpTotals?.ven_stp?.VENDORS}
                              </TableCell>
                              <TableCell className="text-gray-300 text-sm">
                                {baswareToMwStpTotals?.ven_stp?.STATUS}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {lastUpdated && (
              <div>
                <span className="text-sm text-gray-400 mt-1">
                  Last Updated: {lastUpdated}
                </span>
              </div>
            )}
          </>
        )}
      </div>
      {/* <div className="flex flex-col items-center">
        <div>
          <h1 style={{ color: '#fff', fontSize: '3rem', marginBottom: '2rem' }}>
            B - M
          </h1>
        </div>
        <div className="flex flex-col gap-6 mb-8">
          <div className="m-cus h-cus w-2xl flex justify-center stat-card-1 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <p className="text-gray-400 text-4xl">INV</p>
                <p className="text-white text-4xl mt-1">
                  {baswareToMwTotals?.inv}
                </p>
              </div>
            </div>
          </div>

          <div className="m-cus h-cus w-2xl flex justify-center stat-card-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-green-500/30 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <p className="text-green-200 text-4xl">CHG</p>
                <p className="text-white text-4xl mt-1">
                  {baswareToMwTotals?.chg}
                </p>
              </div>
            </div>
          </div>

          <div className="m-cus h-cus w-2xl flex justify-center stat-card-3 bg-gradient-to-br from-red-500/20 to-rose-500/20 backdrop-blur-lg border border-red-500/30 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <p className="text-red-200 text-4xl">FRT</p>
                <p className="text-white text-4xl mt-1">
                  {baswareToMwTotals?.frt}
                </p>
              </div>
            </div>
          </div>

          <div className="m-cus h-cus w-2xl flex justify-center stat-card-4 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-lg border border-yellow-500/30 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <p className="text-yellow-200 text-4xl">EXP</p>
                <p className="text-white text-4xl mt-1">
                  {baswareToMwTotals?.exp}
                </p>
              </div>
            </div>
          </div>

          <div className="m-cus h-cus w-2xl flex justify-center stat-card-3 bg-gradient-to-br from-red-500/20 to-rose-500/20 backdrop-blur-lg border border-red-500/30 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-gray-300">
                        <div className="flex items-center gap-2">
                          Vendor
                        </div>
                      </TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-white/10">
                      <TableCell className="text-gray-300 text-sm">
                        {baswareToMwTotals?.ven.VENDORS}
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm">
                        {baswareToMwTotals?.ven.STATUS}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div className="m-cus h-cus w-2xl flex justify-center stat-card-1 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <p className="text-gray-400 text-4xl">INV</p>
                <p className="text-white text-4xl mt-1">
                  {baswareToMwStpTotals?.inv_stp}
                </p>
              </div>
            </div>
          </div>

          <div className="m-cus h-cus w-2xl flex justify-center stat-card-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-green-500/30 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <p className="text-green-200 text-4xl">CHG</p>
                <p className="text-white text-4xl mt-1">
                  {baswareToMwStpTotals?.chg_stp}
                </p>
              </div>
            </div>
          </div>

          <div className="m-cus h-cus w-2xl flex justify-center stat-card-3 bg-gradient-to-br from-red-500/20 to-rose-500/20 backdrop-blur-lg border border-red-500/30 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <p className="text-red-200 text-4xl">FRT</p>
                <p className="text-white text-4xl mt-1">
                  {baswareToMwStpTotals?.frt_stp}
                </p>
              </div>
            </div>
          </div>

          <div className="m-cus h-cus w-2xl flex justify-center stat-card-4 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-lg border border-yellow-500/30 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <p className="text-yellow-200 text-4xl">EXP</p>
                <p className="text-white text-4xl mt-1">
                  {baswareToMwStpTotals?.exp_stp}
                </p>
              </div>
            </div>
          </div>

          <div className="m-cus h-cus w-2xl flex justify-center stat-card-3 bg-gradient-to-br from-red-500/20 to-rose-500/20 backdrop-blur-lg border border-red-500/30 rounded-xl p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <p className="text-red-200 text-4xl">VEN</p>
                <p className="text-white text-4xl mt-1">
                  {baswareToMwStpTotals?.ven_stp}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
