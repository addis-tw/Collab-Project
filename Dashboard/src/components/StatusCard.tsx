import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Calendar,
  User,
  FileText,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getBaswareDashboardDetails } from '../services/requestApis';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface StatusCardProps {
  title: string;
  success: number;
  error: number;
  waiting: number;
  detail: string;
  setStatusDataDetails: (data: any) => void;
  dateForApi: string;
}

type DetailType = 'success' | 'error' | 'waiting' | null;

interface ProcessDetail {
  id: string;
  timestamp: string;
  status: string;
  message: string;
  user: string;
}

export function StatusCard({
  title,
  success,
  error,
  waiting,
  detail,
  setStatusDataDetails,
  dateForApi,
}: StatusCardProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const total = success + error + waiting;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDetailType, setSelectedDetailType] = useState(
    null as DetailType
  );
  const [dialogData, setDialogData] = useState([] as ProcessDetail[]);
  const [loading, setLoading] = useState(false);

  // Fetch real data from API
  const fetchDialogData = async (type: 'success' | 'error' | 'waiting') => {
    setLoading(true);
    try {
      // status should be lowercase (e.g., "success")
      const response = await getBaswareDashboardDetails(
        detail,
        type.toLowerCase(),
        dateForApi
      );
      // Defensive: check response structure
      const items = response?.data?.result?.result || [];
      // Map API data to ProcessDetail[]
      // const mapped = items.map((item: any, idx: number) => ({
      //   id: String(item.PO),
      //   timestamp: item.DATE_ADDED,
      //   status: item.STATUS,
      //   message: item.DATA || '',
      //   user: '', // No user field in API response
      // }));
      // setDialogData(mapped);
      setDialogData(items);
    } catch (err) {
      setDialogData([]);
    }
    setLoading(false);
  };

  const handleStatusClick = (type: 'success' | 'error' | 'waiting') => {
    const counts = { success, error, waiting };
    if (counts[type] > 0) {
      setSelectedDetailType(type);
      setDialogOpen(true);
      fetchDialogData(type);
    }
  };

  const getDialogData = (): ProcessDetail[] => {
    return dialogData;
  };

  const getDialogTitle = () => {
    if (!selectedDetailType) return '';
    const typeLabels: Record<string, string> = {
      success: 'Success Details',
      error: 'Error Details',
      waiting: 'Waiting Details',
    };
    return `${title} - ${typeLabels[selectedDetailType as string]}`;
  };

  const getStatusColor = (type: DetailType) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'waiting':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusGradient = () => {
    if (error > 0) return 'from-red-500 to-rose-600';
    if (waiting > 0) return 'from-yellow-500 to-amber-600';
    return 'from-green-500 to-emerald-600';
  };

  const getGlowClass = () => {
    if (error > 0) return 'status-card-glow-red';
    if (waiting > 0) return 'status-card-glow-yellow';
    return 'status-card-glow-green';
  };

  const successPercentage = total > 0 ? (success / total) * 100 : 0;

  useEffect(() => {
    if (circleRef.current) {
      const circumference = 2 * Math.PI * 32;
      const offset = circumference * (1 - successPercentage / 100);
      circleRef.current.style.strokeDashoffset = offset.toString();
    }
  }, [successPercentage]);

  return (
    <div className={`status-card ${getGlowClass()}`}>
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden shadow-lg">
        <CardHeader className="pb-3 relative">
          <div
            className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getStatusGradient()}`}
          ></div>

          <CardTitle
            className={`shimmer-effect text-center text-white bg-gradient-to-r ${getStatusGradient()} py-4 -mx-6 -mt-6 mb-4 shadow-lg relative overflow-hidden`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              {title}
            </span>
          </CardTitle>

          {/* Progress Ring */}
          <div className="flex justify-center -mt-2 mb-2">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-white/10"
                />
                <circle
                  ref={circleRef}
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className={`progress-circle ${
                    error > 0
                      ? 'text-red-400'
                      : waiting > 0
                      ? 'text-yellow-400'
                      : 'text-green-400'
                  }`}
                  strokeDasharray="201"
                  strokeDashoffset="201"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white">
                  {Math.round(successPercentage)}%
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div
            className={`status-row relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 ${
              success > 0
                ? 'cursor-pointer hover:bg-green-500/30 transition-colors duration-200'
                : ''
            }`}
            onClick={() => handleStatusClick('success')}
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="icon-spin">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-green-100">Success</span>
              </div>
              <span className="number-scale text-white">{success}</span>
            </div>
            <div className="mt-2 h-1 bg-green-900/30 rounded-full overflow-hidden">
              <div
                className="progress-bar h-full bg-green-400 rounded-full"
                style={{
                  width: total > 0 ? `${(success / total) * 100}%` : '0%',
                }}
              ></div>
            </div>
          </div>

          <div
            className={`status-row relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/30 ${
              error > 0
                ? 'cursor-pointer hover:bg-red-500/30 transition-colors duration-200'
                : ''
            }`}
            onClick={() => handleStatusClick('error')}
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div
                  className={error > 0 ? 'icon-spin icon-pulse' : 'icon-spin'}
                >
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-red-100">Error</span>
              </div>
              <span className="number-scale text-white">{error}</span>
            </div>
            <div className="mt-2 h-1 bg-red-900/30 rounded-full overflow-hidden">
              <div
                className="progress-bar h-full bg-red-400 rounded-full"
                style={{
                  width: total > 0 ? `${(error / total) * 100}%` : '0%',
                }}
              ></div>
            </div>
          </div>

          <div
            className={`status-row relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 ${
              waiting > 0
                ? 'cursor-pointer hover:bg-yellow-500/30 transition-colors duration-200'
                : ''
            }`}
            onClick={() => handleStatusClick('waiting')}
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className={waiting > 0 ? 'icon-spin-continuous' : ''}>
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="text-yellow-100">Waiting</span>
              </div>
              <span className="number-scale text-white">{waiting}</span>
            </div>
            <div className="mt-2 h-1 bg-yellow-900/30 rounded-full overflow-hidden">
              <div
                className="progress-bar h-full bg-yellow-400 rounded-full"
                style={{
                  width: total > 0 ? `${(waiting / total) * 100}%` : '0%',
                }}
              ></div>
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Processes</span>
              <span className="total-badge text-white bg-white/10 px-3 py-1 rounded-full">
                {total}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] bg-slate-900/95 backdrop-blur-xl border-white/20">
          <DialogHeader>
            <DialogTitle
              className={`flex items-center gap-2 ${getStatusColor(
                selectedDetailType
              )}`}
            >
              {selectedDetailType === 'success' && (
                <CheckCircle2 className="w-5 h-5" />
              )}
              {selectedDetailType === 'error' && (
                <XCircle className="w-5 h-5" />
              )}
              {selectedDetailType === 'waiting' && (
                <Clock className="w-5 h-5" />
              )}
              {getDialogTitle()}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Detailed breakdown of {selectedDetailType} records for this
              process
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-auto max-h-96">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-gray-300">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {detail === 'rcpt_log_detail' ||
                      detail === 'rcpt_log_detail_stp'
                        ? 'PO'
                        : detail === 'rcpt_logoe_detail' ||
                          detail === 'rcpt_logoe_detail_stp'
                        ? 'FRO'
                        : detail === 'rcpt_logmp_detail' ||
                          detail === 'rcpt_logsp_detail' ||
                          detail === 'rcpt_logmp_detail_stp' ||
                          detail === 'rcpt_logsp_detail_stp'
                        ? 'CHG'
                        : ''}
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-300">DATA</TableHead>
                  <TableHead className="text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      DATE-ADDED
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  {/* <TableHead className="text-gray-300">Message</TableHead> */}
                  {/* <TableHead className="text-gray-300">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      User
                    </div>
                  </TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {getDialogData().map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="text-gray-200 font-mono text-sm">
                      {detail === 'rcpt_log_detail' ||
                      detail === 'rcpt_log_detail_stp'
                        ? item.PO
                        : detail === 'rcpt_logoe_detail' ||
                          detail === 'rcpt_logoe_detail_stp'
                        ? item.FRO
                        : detail === 'rcpt_logmp_detail' ||
                          detail === 'rcpt_logsp_detail' ||
                          detail === 'rcpt_logmp_detail_stp' ||
                          detail === 'rcpt_logsp_detail_stp'
                        ? item.CHG
                        : ''}
                    </TableCell>
                    <TableCell className="text-gray-300 text-sm">
                      {item.DATA}
                    </TableCell>
                    <TableCell className="text-gray-300 text-sm">
                      {item.DATE_ADDED}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          selectedDetailType === 'success'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : selectedDetailType === 'error'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}
                      >
                        {item.STATUS}
                      </span>
                    </TableCell>
                    {/* <TableCell
                        className="text-gray-300 text-sm max-w-xs truncate"
                        title={item.message}
                      >
                        {item.message}
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm">
                        {item.user}
                      </TableCell>*/}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
