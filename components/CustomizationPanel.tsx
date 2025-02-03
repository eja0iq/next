import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  BarChart2,
  Music,
  Calendar,
  Type,
  PaintBucket,
  Download,
  PlayCircle,
  Instagram,
} from "lucide-react";
import { CreatePlaylistDialog } from "./CreatePlaylistDialog";

interface CustomizationPanelProps {
  customization: {
    metric: string;
    tracks: number;
    period: string;
    mode: string;
    font: string;
  };
  handleCustomize: (newCustomization: any) => void;
  downloadAsImage: () => void;
  handleCreatePlaylist?: (playlistName: string) => Promise<void>;
  userName: string;
  handleShare: () => void;
}

export default function CustomizationPanel({
  customization,
  handleCustomize,
  downloadAsImage,
  handleCreatePlaylist,
  userName,
  handleShare,
}: CustomizationPanelProps) {
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [tempTrackValue, setTempTrackValue] = useState(customization.tracks);

  const updateCustomization = (key: string, value: any) => {
    handleCustomize({
      ...customization,
      [key]: value,
    });
  };

  const onCreatePlaylist = async (playlistName: string) => {
    if (handleCreatePlaylist) {
      setIsCreatingPlaylist(true);
      try {
        await handleCreatePlaylist(playlistName);
        setShowPlaylistDialog(false);
        // You could add a success toast here
      } catch (error) {
        // You could add an error toast here
        console.error("Error creating playlist:", error);
      } finally {
        setIsCreatingPlaylist(false);
      }
    }
  };

  const handleCreatePlaylistClick = () => {
    setShowPlaylistDialog(true);
  };

  return (
    <Card className="w-full bg-[#181818] border-none shadow-2xl rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-[0_0_30px_rgba(29,185,84,0.1)]">
      <CardHeader className="border-b border-[#282828] bg-gradient-to-r from-[#1e1e1e] via-[#202020] to-[#282828] p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center group">
          <BarChart2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#1DB954] transform transition-transform duration-300 group-hover:scale-110" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#1DB954]">
            Customize Receipt
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Grid layout for mobile optimization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Metric Selection */}
          <div className="space-y-2">
            <Label
              htmlFor="metric"
              className="text-white flex items-center text-sm sm:text-base"
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              Metric
            </Label>
            <Select
              value={customization.metric}
              onValueChange={(value) => updateCustomization("metric", value)}
            >
              <SelectTrigger
                id="metric"
                className="w-full bg-[#282828] border border-transparent text-white text-sm sm:text-base h-9 sm:h-10 hover:bg-[#323232] hover:border-[#1DB954] transition-all duration-300 focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]"
              >
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent className="bg-[#282828] text-sm sm:text-base border border-[#1DB954]/20 animate-in fade-in-80 zoom-in-95">
                <SelectItem
                  value="top_tracks"
                  className="text-white hover:bg-[#1DB954] hover:text-black transition-colors"
                >
                  Top Tracks
                </SelectItem>
                <SelectItem
                  value="top_artists"
                  className="text-white hover:bg-[#1DB954] hover:text-black transition-colors"
                >
                  Top Artists
                </SelectItem>
                <SelectItem
                  value="top_genres"
                  className="text-white hover:bg-[#1DB954] hover:text-black transition-colors"
                >
                  Top Genres
                </SelectItem>
                <SelectItem
                  value="stats"
                  className="text-white hover:bg-[#1DB954] hover:text-black transition-colors"
                >
                  Stats
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Period Selection */}
          <div className="space-y-2">
            <Label
              htmlFor="period"
              className="text-white flex items-center text-sm sm:text-base"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Time Period
            </Label>
            <Select
              value={customization.period}
              onValueChange={(value) => updateCustomization("period", value)}
            >
              <SelectTrigger
                id="period"
                className="w-full bg-[#282828] border-none text-white text-sm sm:text-base h-9 sm:h-10 hover:bg-[#323232] transition-colors duration-200"
              >
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent className="bg-[#282828] text-sm sm:text-base border border-[#1DB954]/20 animate-in fade-in-80 zoom-in-95">
                <SelectItem
                  value="short_term"
                  className="text-white hover:bg-[#1DB954] hover:text-black transition-colors"
                >
                  Last 4 weeks
                </SelectItem>
                <SelectItem
                  value="medium_term"
                  className="text-white hover:bg-[#1DB954] hover:text-black transition-colors"
                >
                  Last 6 months
                </SelectItem>
                <SelectItem
                  value="long_term"
                  className="text-white hover:bg-[#1DB954] hover:text-black transition-colors"
                >
                  All time
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tracks Slider */}
        <div className="space-y-3 pt-2">
          <Label
            htmlFor="tracks"
            className="text-white flex items-center text-sm sm:text-base group"
          >
            <Music className="w-4 h-4 mr-2 transform transition-transform duration-300 group-hover:scale-110 text-[#1DB954]" />
            <span className="group-hover:text-[#1DB954] transition-colors duration-300">
              Top Tracks
            </span>
          </Label>
          <Slider
            id="tracks"
            min={5}
            max={50}
            step={5}
            value={[tempTrackValue]}
            onValueChange={(value) => {
              setTempTrackValue(value[0]);
              setIsSliding(true);
            }}
            onValueCommit={(value) => {
              setIsSliding(false);
              updateCustomization("tracks", value[0]);
            }}
            className="[&_.bg-primary/20]:bg-[#282828] [&_.bg-primary]:bg-[#1DB954] [&_.bg-primary]:hover:bg-[#22c55e] [&_[data-radix-slider-thumb]]:bg-[#1DB954] [&_[data-radix-slider-thumb]]:hover:bg-[#22c55e] [&_[data-radix-slider-thumb]]:hover:scale-110 [&_[data-radix-slider-thumb]]:border-[#1DB954] [&_[data-radix-slider-thumb]]:transition-all [&_[data-radix-slider-thumb]]:duration-300 transition-colors duration-200"
          />
          <div className="text-[#b3b3b3] text-xs sm:text-sm flex items-center justify-between">
            <span>
              Number of tracks:{" "}
              <span className="text-[#1DB954] font-medium">
                {tempTrackValue}
              </span>
            </span>
            {isSliding && (
              <span className="text-[#1DB954] animate-pulse">
                Release to update
              </span>
            )}
          </div>
        </div>

        {/* Grid layout for Mode and Font */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Mode Toggle */}
          <div className="space-y-2">
            <Label
              htmlFor="mode"
              className="text-white flex items-center text-sm sm:text-base"
            >
              <PaintBucket className="w-4 h-4 mr-2" />
              Mode
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="mode"
                checked={customization.mode === "dark"}
                onCheckedChange={(checked) =>
                  updateCustomization("mode", checked ? "dark" : "light")
                }
              />
              <Label
                htmlFor="mode"
                className="text-[#b3b3b3] text-sm sm:text-base"
              >
                Dark Mode
              </Label>
            </div>
          </div>

          {/* Font Selection */}
          <div className="space-y-2">
            <Label
              htmlFor="font"
              className="text-white flex items-center text-sm sm:text-base"
            >
              <Type className="w-4 h-4 mr-2" />
              Font
            </Label>
            <Select
              value={customization.font}
              onValueChange={(value) => updateCustomization("font", value)}
            >
              <SelectTrigger
                id="font"
                className="w-full bg-[#282828] border-none text-white text-sm sm:text-base h-9 sm:h-10 hover:bg-[#323232] transition-colors duration-200"
              >
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent className="bg-[#282828] text-sm sm:text-base border border-[#1DB954]/20 animate-in fade-in-80 zoom-in-95">
                <SelectItem
                  value="sans"
                  className="text-white hover:bg-[#1DB954] hover:text-black transition-colors"
                >
                  Sans-serif
                </SelectItem>
                <SelectItem
                  value="serif"
                  className="text-white hover:bg-[#1DB954] hover:text-black transition-colors"
                >
                  Serif
                </SelectItem>
                <SelectItem
                  value="mono"
                  className="text-white hover:bg-[#1DB954] hover:text-black transition-colors"
                >
                  Monospace
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            className="w-full bg-gradient-to-r from-[#1DB954] to-[#22c55e] text-black hover:shadow-lg hover:shadow-[#1DB954]/20 transform hover:-translate-y-0.5 transition-all duration-300 h-10 text-sm sm:text-base font-semibold"
            onClick={downloadAsImage}
          >
            <Download className="w-4 h-4 mr-2 animate-bounce" />
            Download Images
          </Button>

          {/* Create Playlist Button - Only shown when metric is top_tracks */}
          {customization.metric === "top_tracks" && (
            <Button
              className="w-full bg-gradient-to-r from-[#1DB954] to-[#22c55e] text-black hover:shadow-lg hover:shadow-[#1DB954]/20 transform hover:-translate-y-0.5 transition-all duration-300 h-10 text-sm sm:text-base font-semibold disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
              onClick={handleCreatePlaylistClick}
              disabled={isCreatingPlaylist}
            >
              {isCreatingPlaylist ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Create Playlist
                </>
              )}
            </Button>
          )}

          <CreatePlaylistDialog
            isOpen={showPlaylistDialog}
            onClose={() => setShowPlaylistDialog(false)}
            onConfirm={onCreatePlaylist}
            userName={userName}
          />

          {/* Share Section */}
          <div className="bg-gradient-to-br from-[#323232] to-[#1e1e1e] p-4 rounded-lg space-y-4 border border-[#1DB954]/20 hover:border-[#1DB954] shadow-lg transition-all duration-300 group">
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-semibold text-white flex items-center group-hover:text-[#1DB954] transition-colors duration-300">
                <span className="transform transition-transform duration-300 group-hover:scale-105">
                  Share Your Receiptify
                </span>
                <span className="ml-2 inline-block animate-pulse text-[#1DB954]">
                  ✨
                </span>
              </h3>
            </div>
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
              Download your personalized Spotify Receiptify and share it on
              <span className="text-[#1DB954] font-medium"> Instagram </span>
              to showcase your music taste!
            </p>
            <Button
              className="w-full bg-gradient-to-r from-[#405DE6] via-[#5851DB] to-[#833AB4] text-white hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-0.5 transition-all duration-300 h-10 text-sm sm:text-base font-medium"
              onClick={handleShare}
            >
              <Instagram className="w-4 h-4 mr-2 group-hover:animate-spin-slow" />
              {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
                ? "Share to Instagram Story"
                : "Share on Instagram"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
