import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Download, Settings, Wallet, Calendar } from "lucide-react";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { useTripStatus } from "@/hooks/useTripStatus";
import { cn } from "@/lib/utils";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

interface TripHeaderProps {
  tripTitle: string;
  baseCurrency: string;
  isLoading: boolean;
  currentTab: string;
  tripStartDate: string;
  tripEndDate: string;
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
  onTabChange,
  onRefreshRates,
  onExportData,
  onBaseCurrencyChange,
  onEditTrip,
}: TripHeaderProps) {
  const selectedCurrency = SUPPORTED_CURRENCIES.find(
    (c) => c.code === baseCurrency
  );

  const tripStatus = useTripStatus(tripStartDate, tripEndDate);

  return (
    <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Title Section */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                {tripTitle}
              </h1>
              {tripStatus && (
                <span
                  className={cn(
                    "text-sm sm:text-base font-medium flex items-center gap-1.5",
                    tripStatus.color
                  )}
                >
                  <Calendar className="size-4" />
                  {tripStatus.text}
                </span>
              )}
            </div>

            <Tabs value={currentTab} onValueChange={onTabChange}>
              <TabsList>
                <TabsTrigger value="budget" className="gap-2">
                  <Wallet className="size-4" />
                  <span>Budget</span>
                </TabsTrigger>
                <TabsTrigger value="itinerary" className="gap-2">
                  <Calendar className="size-4" />
                  <span>Itinerary</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Actions Section */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select value={baseCurrency} onValueChange={onBaseCurrencyChange}>
              <SelectTrigger className="h-9 w-full sm:w-[140px]">
                <SelectValue>
                  <span className="font-semibold">
                    {selectedCurrency?.symbol} {baseCurrency}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CURRENCIES.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    <span className="font-semibold">{curr.symbol}</span>{" "}
                    <span className="font-medium">{curr.code}</span>{" "}
                    <span className="text-muted-foreground text-sm">
                      {curr.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="default" size="sm" className="h-9 shrink-0">
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <Button
                variant="outline"
                size="sm"
                onClick={onEditTrip}
                className="h-9 gap-2 shrink-0"
              >
                <Settings className="size-4" />
                <span className="hidden xs:inline sm:hidden md:inline">
                  Edit Trip
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onExportData}
                className="h-9 gap-2 shrink-0"
              >
                <Download className="size-4" />
                <span className="hidden xs:inline sm:hidden md:inline">
                  Export
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefreshRates}
                disabled={isLoading}
                className="h-9 gap-2 shrink-0"
              >
                <RefreshCw
                  className={`size-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="hidden xs:inline sm:hidden md:inline">
                  {isLoading ? "Updating..." : "Refresh"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
