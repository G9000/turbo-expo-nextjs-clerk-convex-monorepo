import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  RefreshCw,
  Download,
  Settings,
  Wallet,
  Calendar,
  Plus,
} from "lucide-react";
import { useState, useMemo } from "react";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { useTripStatus } from "@/hooks/useTripStatus";
import { useTripParticipants } from "@/hooks/useConvexTrips";
import { cn } from "@/lib/utils";
import { TripStatusBadge } from "@/components/TripStatusBadge";
import { TripTitle } from "@/components/TripTitle";
import { ParticipantsList } from "@/components/ParticipantsList";

interface TripHeaderProps {
  tripTitle: string;
  baseCurrency: string;
  isLoading: boolean;
  currentTab: string;
  tripStartDate: string;
  tripEndDate: string;
  tripId?: string;
  onTabChange: (tab: string) => void;
  onRefreshRates: () => void;
  onExportData: () => void;
  onBaseCurrencyChange: (currency: string) => void;
  onEditTrip: () => void;
}

export function TripHeader({
  tripTitle,
  baseCurrency,
  isLoading,
  currentTab,
  tripStartDate,
  tripEndDate,
  tripId,
  onTabChange,
  onRefreshRates,
  onExportData,
  onBaseCurrencyChange,
  onEditTrip,
}: TripHeaderProps) {
  const [currencyModalOpen, setCurrencyModalOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState("");

  const { participants } = useTripParticipants(
    tripId ? (tripId as never) : undefined,
  );

  const selectedCurrency = SUPPORTED_CURRENCIES.find(
    (c) => c.code === baseCurrency,
  );

  const filteredCurrencies = useMemo(() => {
    return SUPPORTED_CURRENCIES.filter(
      (curr) =>
        curr.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
        curr.name.toLowerCase().includes(currencySearch.toLowerCase()),
    );
  }, [currencySearch]);

  const tripStatus = useTripStatus(tripStartDate, tripEndDate);

  return (
    <div className="relative overflow-hidden rounded-lg bg-background p-5 border border-border">
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <TripStatusBadge status={tripStatus?.text || null} />
            <TripTitle title={tripTitle} />
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onRefreshRates}
              disabled={isLoading}
              className="rounded-xl bg-foreground/5 hover:bg-foreground hover:text-background px-3 py-2 h-10 gap-2"
              title="Refresh Rates"
            >
              <RefreshCw
                className={cn("size-5", isLoading && "animate-spin")}
              />
              <span className="text-xs font-medium">Refresh</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => setCurrencyModalOpen(true)}
              className="rounded-xl bg-foreground/5 hover:bg-foreground hover:text-background px-3 py-2 h-10"
              title="Change Currency"
            >
              <span className="flex items-center gap-1 text-xs font-medium">
                <span className={`fi fi-${selectedCurrency?.countryCode}`} />
                <span className="opacity-70">{selectedCurrency?.symbol}</span>
                <span>{baseCurrency}</span>
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-xl bg-foreground/5 hover:bg-foreground hover:text-background px-3 py-2 h-10 gap-2"
                  title="More options"
                >
                  <span className="text-xs font-medium">Trip Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white/90 border-white/20"
              >
                <DropdownMenuItem
                  onClick={onEditTrip}
                  className="gap-2 cursor-pointer focus:bg-indigo-50 focus:text-indigo-600"
                >
                  <Settings className="size-4" />
                  <span>Edit Trip</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onExportData}
                  className="gap-2 cursor-pointer focus:bg-indigo-50 focus:text-indigo-600"
                >
                  <Download className="size-4" />
                  <span>Export Data</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
              open={currencyModalOpen}
              onOpenChange={setCurrencyModalOpen}
            >
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Select Currency</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Search currencies..."
                    value={currencySearch}
                    onChange={(e) => setCurrencySearch(e.target.value)}
                    className="w-full"
                  />
                  <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                    {filteredCurrencies.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => {
                          onBaseCurrencyChange(curr.code);
                          setCurrencyModalOpen(false);
                          setCurrencySearch("");
                        }}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          baseCurrency === curr.code
                            ? "bg-indigo-600 text-white"
                            : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                        }`}
                      >
                        <div className="font-semibold flex items-center gap-2">
                          <span className={`fi fi-${curr.countryCode}`} />
                          <span>
                            {curr.symbol} {curr.code}
                          </span>
                        </div>
                        <div className="text-xs opacity-70">{curr.name}</div>
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      // Add currency suggestion handler here
                    }}
                  >
                    <Plus className="size-4 mr-2" />
                    Request New Currency
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-white/10 border border-white/20">
          <Tabs
            value={currentTab}
            onValueChange={onTabChange}
            className="w-full xl:w-auto"
          >
            <TabsList className="bg-transparent p-0 h-auto gap-1">
              <TabsTrigger
                value="budget"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background rounded-xl px-6 py-2.5 font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-all gap-2"
              >
                <Wallet className="size-4" />
                <span>Budget</span>
              </TabsTrigger>
              <TabsTrigger
                value="itinerary"
                className="data-[state=active]:bg-foreground data-[state=active]:text-background rounded-xl px-6 py-2.5 font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-all gap-2"
              >
                <Calendar className="size-4" />
                <span>Itinerary</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <ParticipantsList participants={participants} />
        </div>
      </div>
    </div>
  );
}
