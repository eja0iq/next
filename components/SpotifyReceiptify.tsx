"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Music,
  Clock,
  Play,
  User,
  Calendar,
  Share2,
  BarChart2,
  RefreshCw,
  Heart,
  Headphones,
  MoreVertical,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import CustomizationPanel from "./CustomizationPanel";
import LoginPage from "./LoginPage";
import * as domtoimage from "dom-to-image-more";
import {
  getUserProfile,
  getTopTracks,
  createPlaylist,
  getUserStats,
  getTopArtists,
} from "@/lib/spotifyData";

const formatDate = (date: Date): string => {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

interface Track {
  id: string;
  name: string;
  artist: string;
  duration: string;
  uri: string;
  album?: {
    images: Array<{
      url: string;
    }>;
  };
}

type TimeRange = "short_term" | "medium_term" | "long_term";

export default function SpotifyReceiptify() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [badge, setBadge] = useState("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [tracks, setTracks] = useState<Track[]>([]);
  interface GenreStats {
    name: string;
    count: number;
    percentage: number;
  }

  const [userStats, setUserStats] = useState({
    totalMinutesListened: 0,
    favoriteDayTime: "",
    topGenre: "",
    allGenres: [] as GenreStats[],
    totalLikedSongs: 0,
  });

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [displayDate, setDisplayDate] = useState<string>("");
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [customization, setCustomization] = useState({
    metric: "top_tracks",
    tracks: 10,
    period: "short_term" as TimeRange, // Add type assertion here
    mode: "dark",
    font: "sans",
  });
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    if (token) {
      setIsLoggedIn(true);
      loadUserData();
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadUserData();
    }
  }, [
    isLoggedIn,
    customization.metric,
    customization.period,
    customization.tracks,
  ]);

  useEffect(() => {
    if (lastUpdated) {
      const formattedDate = formatDate(lastUpdated);
      setDisplayDate(formattedDate);
    } else {
      setDisplayDate("Not available");
    }
  }, [lastUpdated]);

  const loadUserData = async () => {
    try {
      setIsLoadingTracks(true); // Set loading state to true when starting

      // Load user profile data
      const userProfile = await getUserProfile();
      setUserName(userProfile.display_name || "");
      setBadge(userProfile.product);
      setProfileImage(userProfile.images?.[0]?.url || "");

      // Handle different metrics
      // Always fetch user stats for the hover card
      const stats = await getUserStats(customization.period);
      setUserStats({
        ...stats,
        allGenres: stats.allGenres || [], // Ensure allGenres is always an array
      });

      switch (customization.metric) {
        case "top_tracks":
          // Load tracks data
          const topTracks = await getTopTracks(
            customization.period,
            customization.tracks
          );

          // Wait for all tracks to be processed
          const formattedTracks = await Promise.all(
            topTracks.items.map(async (track: any) => ({
              id: track.id,
              name: track.name,
              artist: track.artists
                .map((artist: any) => artist.name)
                .join(", "),
              duration: formatDuration(track.duration_ms),
              uri: track.uri,
              album: track.album,
            }))
          );

          setTracks(formattedTracks);
          break;

        case "top_artists":
          const artistsData = await getTopArtists(
            customization.period,
            customization.tracks
          );
          setTopArtists(artistsData.items);
          break;

        case "top_genres":
          break;
      }

      // Update last updated timestamp
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error loading user data:", error);
      // Handle token-related errors
      if (
        error instanceof Error &&
        (error.message.includes("token") ||
          error.message.includes("unauthorized") ||
          error.message.includes("expired"))
      ) {
        // Clear tokens and reset login state
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_refresh_token");
        localStorage.removeItem("token_expiration");
        setIsLoggedIn(false);

        toast.error("Session expired. Please login again.", {
          duration: 4000,
          position: "top-center",
        });
      } else {
        toast.error("Failed to load data. Please try again.", {
          duration: 3000,
          position: "top-center",
        });
      }
    } finally {
      setIsLoadingTracks(false); // Set loading state to false when done
    }
  };

  const handleShare = async () => {
    try {
      if (!receiptRef.current) {
        throw new Error("Receipt reference is null");
      }

      // Check if running on mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isInstagramBrowser = /Instagram/.test(navigator.userAgent);

      if (!isMobile && isInstagramBrowser) {
        toast.error("Instagram sharing is only available on mobile devices", {
          duration: 3000,
          position: "top-center",
        });
        return;
      }

      const dataUrl = await generateImage(receiptRef.current);

      // Convert data URL to Blob for sharing
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "spotify-receipt.png", {
        type: "image/png",
      });

      const canShare =
        navigator.canShare && navigator.canShare({ files: [file] });

      if (isMobile && isInstagramBrowser && canShare) {
        await navigator.share({
          files: [file],
          title: "My Spotify Receiptify",
          text: "Check out my Spotify stats!",
        });
        toast.success("Opening Instagram Stories...", {
          duration: 3000,
          position: "top-center",
        });
      } else if (canShare) {
        await navigator.share({
          files: [file],
          title: "My Spotify Receiptify",
          text: "Check out my Spotify stats!",
        });
        toast.success("Shared successfully!", {
          duration: 3000,
          position: "top-center",
        });
      } else {
        if (isMobile) {
          toast.error("Sharing not supported. Downloading instead...", {
            duration: 3000,
            position: "top-center",
          });
        }
        const link = document.createElement("a");
        link.download = "spotify-receipt.png";
        link.href = dataUrl;
        link.click();
        toast.success("Image downloaded successfully!", {
          duration: 3000,
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Failed to share. Please try again.", {
        duration: 3000,
        position: "top-center",
      });
    }
  };

  const handleCreatePlaylist = async (playlistName: string) => {
    try {
      setIsLoading(true);
      const trackUris = tracks.map((track) => track.uri);
      if (!userName) {
        throw new Error("Username not found");
      }
      await createPlaylist(userName, trackUris, playlistName);
      toast.success("Playlist created successfully!", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#1DB954",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Error creating playlist:", error);
      if (error instanceof Error && error.message.includes("token")) {
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_refresh_token");
        localStorage.removeItem("token_expiration");
        setIsLoggedIn(false);
        toast.error("Session expired. Please login again.", {
          duration: 4000,
          position: "top-center",
        });
      } else {
        toast.error("Failed to create playlist. Please try again.", {
          duration: 3000,
          position: "top-center",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("spotify_access_token");
      const expiration = localStorage.getItem("token_expiration");

      if (!token || !expiration) {
        setIsLoggedIn(false);
        return;
      }

      // Check if token is expired
      if (Date.now() > parseInt(expiration)) {
        localStorage.removeItem("spotify_access_token");
        localStorage.removeItem("spotify_refresh_token");
        localStorage.removeItem("token_expiration");
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);
      loadUserData();
    };

    checkAuth();
  }, []);

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleRefreshData = async () => {
    await loadUserData();
  };

  const handleCustomize = (newCustomization: any) => {
    setCustomization(newCustomization);
    if (
      newCustomization.period !== customization.period ||
      newCustomization.tracks !== customization.tracks
    ) {
      loadUserData();
    }
  };

  const generateImage = async (element: HTMLElement) => {
    const bg = customization.mode === "dark" ? "#181818" : "#f8fafc";

    try {
      // Make sure all images are loaded first
      const images = Array.from(element.getElementsByTagName("img"));
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = resolve; // Don't reject on error, just continue
          });
        })
      );

      // Create a clone for manipulation
      const clone = element.cloneNode(true) as HTMLElement;

      // Apply all necessary styles
      Object.assign(clone.style, {
        position: "absolute",
        left: "-9999px",
        top: "-9999px",
        width: "758px",
        height: "1384px",
        transform: "none",
        transformOrigin: "center",
        margin: "0",
        padding: "0",
        background: bg,
        display: "block",
      });

      // Append to body
      document.body.appendChild(clone);

      try {
        // Generate image with dom-to-image-more
        const dataUrl = await domtoimage.toPng(clone, {
          width: 758,
          height: 1384,
          style: {
            transform: "none",
            transformOrigin: "center",
            background: bg,
          },
          bgcolor: bg,
          quality: 1,
          filter: (node: Node) => {
            const element = node as HTMLElement;
            // Skip problematic elements
            return !(
              (
                element.classList?.contains("loading-spinner") ||
                element.classList?.contains("animate-spin") ||
                element.classList?.contains("absolute")
              ) // Skip absolutely positioned elements
            );
          },
          imagePlaceholder:
            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        });

        return dataUrl;
      } finally {
        // Clean up clone
        document.body.removeChild(clone);
      }
    } catch (error) {
      console.error("Image generation error:", error);
      throw error;
    }
  };

  const downloadAsImage = async () => {
    const toastId = toast.loading("Preparing receipt...");
    let retryCount = 0;
    const maxRetries = 3;
    let blob: Blob | null = null;

    const attemptDownload = async () => {
      try {
        if (!receiptRef.current) {
          throw new Error("Receipt reference is null");
        }

        // Clear memory
        if (blob) {
          URL.revokeObjectURL(URL.createObjectURL(blob));
          blob = null;
        }

        toast.loading("Generating image...", { id: toastId });
        const dataUrl = await generateImage(receiptRef.current);

        // Convert to blob
        const fetchResponse = await fetch(dataUrl);
        blob = await fetchResponse.blob();

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

        if (isIOS) {
          // For iOS, open in new tab
          const blobUrl = URL.createObjectURL(blob);
          window.open(blobUrl, "_blank");
          toast.dismiss(toastId);
          toast.success("Image opened in new tab. Long press to save!", {
            duration: 5000,
          });
          // Clean up blob URL after a delay
          setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
          return;
        }

        // For all other browsers, download directly
        toast.loading("Processing download...", { id: toastId });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "spotify-receipt.png";
        link.href = blobUrl;
        link.click();

        // Clean up after a short delay to ensure download starts
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
          toast.dismiss(toastId);
          toast.success("Image downloaded successfully!");
        }, 1000);
      } catch (error) {
        console.error("Error generating image:", error);

        if (retryCount < maxRetries) {
          retryCount++;
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return attemptDownload();
        }

        toast.dismiss(toastId);
        toast.error(
          "Failed to generate image. Please try again or take a screenshot.",
          {
            duration: 5000,
          }
        );
      }
    };

    await attemptDownload();
  };

  // Format minutes to hours and minutes
  const formatListeningTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const calculateTotalDuration = (tracks: Track[]) => {
    const totalSeconds = tracks.reduce((acc, track) => {
      const [minutes, seconds] = track.duration.split(":").map(Number);
      return acc + minutes * 60 + seconds;
    }, 0);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getFontClass = (font: string) => {
    switch (font) {
      case "serif":
        return "font-serif";
      case "mono":
        return "font-mono";
      default:
        return "font-sans";
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen w-full p-2 sm:p-4 md:p-8">
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-7xl mx-auto">
        <Card
          ref={receiptRef}
          className={`w-full lg:w-3/5 border-none shadow-2xl rounded-xl overflow-hidden ${
            customization.mode === "dark" ? "bg-[#181818]" : "bg-slate-50"
          } ${getFontClass(customization.font)}`}
        >
          {/* Header Section */}
          <CardHeader
            className={`border-b p-3 sm:p-6 ${
              customization.mode === "dark"
                ? "border-[#282828] bg-[#282828]"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-4">
              <CardTitle
                className={`text-2xl sm:text-4xl font-bold flex items-center ${
                  customization.mode === "dark"
                    ? "text-[#1DB954]"
                    : "text-[#1DB954]"
                }`}
              >
                <Music className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
                <span>Receiptify+</span>
              </CardTitle>

              {/* Desktop buttons */}
              <div className="hidden sm:flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-[#1DB954] border-[#1DB954] hover:bg-[#22c75c] hover:text-black"
                        onClick={handleShare}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share Receiptify</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-[#1DB954] border-[#1DB954] hover:bg-[#22c75c] hover:text-black"
                        onClick={handleRefreshData}
                        disabled={isLoading}
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${
                            isLoading ? "animate-spin" : ""
                          }`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Refresh Data</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Mobile dropdown */}
              <div className="flex sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-[#1DB954] border-[#1DB954] hover:bg-[#22c75c] hover:text-black h-8 w-8"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-[#282828] border-[#1DB954]"
                  >
                    <DropdownMenuItem
                      onClick={handleShare}
                      className="text-white hover:text-black hover:bg-[#1DB954] cursor-pointer"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Receiptify
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleRefreshData}
                      disabled={isLoading}
                      className="text-white hover:text-black hover:bg-[#1DB954] cursor-pointer"
                    >
                      <RefreshCw
                        className={`h-4 w-4 mr-2 ${
                          isLoading ? "animate-spin" : ""
                        }`}
                      />
                      Refresh Data
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* User Info Section */}
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <HoverCard>
                    <HoverCardTrigger>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          {profileImage ? (
                            <img
                              src={profileImage}
                              alt="Profile"
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <User className="w-5 h-5 text-[#1DB954]" />
                          )}
                          <span
                            className={`text-base sm:text-lg font-medium ${
                              customization.mode === "dark"
                                ? "text-white"
                                : "text-black"
                            }`}
                          >
                            {userName}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-[#1DB954] text-black hover:bg-[#22c55e] flex-shrink-0"
                        >
                          {badge}
                        </Badge>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-72 sm:w-80 bg-[#282828] border-[#1DB954]">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Headphones className="w-4 h-4 text-[#1DB954]" />
                          <span className="text-white">
                            {formatListeningTime(
                              userStats.totalMinutesListened
                            )}{" "}
                            listened
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-[#1DB954]" />
                          <span className="text-white">
                            Most active: {userStats.favoriteDayTime}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Music className="w-4 h-4 text-[#1DB954]" />
                          <span className="text-white">
                            Main genre: {userStats.topGenre}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-[#1DB954]" />
                          <span className="text-white">
                            {userStats.totalLikedSongs} liked songs
                          </span>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[#1DB954]" />
                  <span className="text-sm text-[#b3b3b3]">
                    {customization.period === "short_term"
                      ? "Last 4 weeks"
                      : customization.period === "medium_term"
                      ? "Last 6 months"
                      : "All time"}
                  </span>
                </div>
              </div>

              <div className="text-xs text-[#b3b3b3] flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Last updated: {displayDate || "Loading..."}
              </div>
            </div>
          </CardHeader>

          {/* Content Section */}
          <CardContent
            className={`p-3 sm:p-6 ${
              customization.mode === "dark"
                ? "bg-gradient-to-b from-[#181818] to-[#282828]"
                : "bg-gradient-to-b from-slate-50 to-slate-100"
            }`}
          >
            <div className="text-xl sm:text-2xl font-semibold text-[#1DB954] mb-4 sm:mb-6">
              {customization.metric === "top_tracks" && "Your Top Tracks"}
              {customization.metric === "top_artists" && "Your Top Artists"}
              {customization.metric === "stats" && "Your Stats"}
              {customization.metric === "top_genres" && "Your Top Genres"}
            </div>

            {customization.metric === "top_tracks" && tracks.length > 0 && (
              <>
                {/* Top Track Card */}
                <div
                  className={`mb-6 sm:mb-8 ${
                    customization.mode === "dark"
                      ? "bg-[#1e1e1e]"
                      : "bg-slate-100"
                  } p-4 sm:p-6 rounded-lg shadow-lg relative overflow-hidden`}
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1DB954] via-[#22c55e] to-[#1DB954]"></div>
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="flex-1">
                      <div
                        className={`text-2xl sm:text-3xl font-bold mb-2 text-center sm:text-left ${
                          customization.mode === "dark"
                            ? "text-white"
                            : "text-gray-900"
                        } ${getFontClass(customization.font)}`}
                      >
                        {tracks[0].name}
                      </div>
                      <div
                        className={`text-lg sm:text-xl text-[#1DB954] mb-4 text-center sm:text-left ${getFontClass(
                          customization.font
                        )}`}
                      >
                        {tracks[0].artist}
                      </div>
                      <div
                        className={`flex items-center justify-center sm:justify-start text-sm ${
                          customization.mode === "dark"
                            ? "text-[#b3b3b3]"
                            : "text-gray-600"
                        }`}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        {tracks[0].duration}
                      </div>
                    </div>
                    <div
                      className={`relative w-24 h-24 sm:w-32 sm:h-32 bg-[#1DB954] rounded-full flex items-center justify-center cursor-pointer ${
                        customization.mode === "dark"
                          ? "border-[#1e1e1e]"
                          : "border-gray-50"
                      } border-8 group`}
                      onClick={() => {
                        const id = tracks[0].uri.split(":")[2];
                        window.open(
                          `https://open.spotify.com/track/${id}`,
                          "_blank"
                        );
                      }}
                    >
                      {tracks[0].album?.images ? (
                        <>
                          <img
                            src={
                              tracks[0].album.images[2]?.url ||
                              tracks[0].album.images[0].url
                            }
                            alt={tracks[0].name}
                            className="w-full h-full rounded-full object-cover"
                            loading="eager"
                            fetchPriority="high"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center transition-all duration-300 rounded-full">
                            <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </>
                      ) : (
                        <div
                          className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center ${
                            customization.mode === "dark"
                              ? "bg-[#1e1e1e]"
                              : "bg-gray-100"
                          }`}
                        >
                          <Music className="w-8 h-8 sm:w-12 sm:h-12 text-[#1DB954]" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-xl sm:text-2xl font-bold text-[#1DB954]">
                      #1 Top Track
                    </div>
                    <Button
                      className="w-full sm:w-auto bg-[#1DB954] hover:bg-[#22c55e] text-black"
                      onClick={() => {
                        const id = tracks[0].uri.split(":")[2];
                        window.open(
                          `https://open.spotify.com/track/${id}`,
                          "_blank"
                        );
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Open in Spotify
                    </Button>
                  </div>
                </div>

                {/* Track List */}
                {isLoadingTracks ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1DB954]"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tracks.slice(1).map((track, index) => (
                      <div
                        key={track.id}
                        className={`flex justify-between items-center group ${
                          customization.mode === "dark"
                            ? "hover:bg-[#282828]"
                            : "hover:bg-slate-200"
                        } p-2 sm:p-3 rounded-md transition-all duration-300 ease-in-out`}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-4">
                          <span className="text-[#1DB954] w-6 text-right font-mono text-sm sm:text-base">
                            {(index + 2).toString().padStart(2, "0")}
                          </span>
                          <div
                            className="relative w-10 h-10 sm:w-12 sm:h-12 bg-[#282828] flex items-center justify-center rounded-md overflow-hidden group-hover:bg-[#1DB954] transition-colors duration-300 cursor-pointer"
                            onClick={() => {
                              const id = track.uri.split(":")[2];
                              window.open(
                                `https://open.spotify.com/track/${id}`,
                                "_blank"
                              );
                            }}
                          >
                            {track.album?.images ? (
                              <>
                                <img
                                  src={track.album.images[2]?.url}
                                  alt={track.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center transition-all duration-300">
                                  <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                              </>
                            ) : (
                              <Music className="w-5 h-5 sm:w-6 sm:h-6 text-[#b3b3b3] group-hover:text-black transition-colors duration-300" />
                            )}
                          </div>
                          <div>
                            <div
                              className={`font-medium transition-colors duration-300 text-sm sm:text-base ${
                                customization.mode === "dark"
                                  ? "text-white group-hover:text-[#1DB954]"
                                  : "text-gray-900 group-hover:text-[#1DB954]"
                              } ${getFontClass(customization.font)}`}
                            >
                              {track.name}
                            </div>
                            <div
                              className={`text-xs sm:text-sm text-[#b3b3b3] ${getFontClass(
                                customization.font
                              )}`}
                            >
                              {track.artist}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs sm:text-sm text-[#b3b3b3] font-mono">
                          {track.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
            {customization.metric === "top_artists" && (
              <div className="space-y-6">
                {/* Top Artist Card */}
                {topArtists.length > 0 && (
                  <div className="mb-6 sm:mb-8 bg-[#1e1e1e] p-4 sm:p-6 rounded-lg shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1DB954] via-[#22c55e] to-[#1DB954]"></div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                      <div className="flex-1">
                        <div className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center sm:text-left">
                          {topArtists[0].name}
                        </div>
                        <div className="text-lg sm:text-xl text-[#1DB954] mb-4 text-center sm:text-left">
                          {topArtists[0].genres.slice(0, 2).join(", ")}
                        </div>
                        <div className="flex items-center justify-center sm:justify-start text-sm text-[#b3b3b3]">
                          <User className="w-4 h-4 mr-2" />
                          {topArtists[0].followers.total.toLocaleString()}{" "}
                          followers
                        </div>
                      </div>
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-[#1DB954] rounded-full flex items-center justify-center border-8 border-[#1e1e1e]">
                        {topArtists[0].images ? (
                          <img
                            src={
                              topArtists[0].images[2]?.url ||
                              topArtists[0].images[0].url
                            }
                            alt={topArtists[0].name}
                            className="w-full h-full rounded-full object-cover"
                            loading="eager"
                            fetchPriority="high"
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#1e1e1e] rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 sm:w-12 sm:h-12 text-[#1DB954]" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="text-xl sm:text-2xl font-bold text-[#1DB954]">
                        #1 Top Artist
                      </div>
                      <Button
                        className="w-full sm:w-auto bg-[#1DB954] hover:bg-[#22c55e] text-black"
                        onClick={() =>
                          window.open(
                            topArtists[0].external_urls.spotify,
                            "_blank"
                          )
                        }
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Open in Spotify
                      </Button>
                    </div>
                  </div>
                )}

                {/* Artist List */}
                <div className="space-y-4">
                  {topArtists.slice(1).map((artist, index) => (
                    <div
                      key={artist.id}
                      className="flex justify-between items-center group hover:bg-[#282828] p-2 sm:p-3 rounded-md transition-all duration-300 ease-in-out"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-4">
                        <span className="text-[#1DB954] w-6 text-right font-mono text-sm sm:text-base">
                          {(index + 2).toString().padStart(2, "0")}
                        </span>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#282828] flex items-center justify-center rounded-md overflow-hidden group-hover:bg-[#1DB954] transition-colors duration-300">
                          {artist.images ? (
                            <img
                              src={artist.images[2]?.url}
                              alt={artist.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#b3b3b3] group-hover:text-black transition-colors duration-300" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-white group-hover:text-[#1DB954] transition-colors duration-300 text-sm sm:text-base">
                            {artist.name}
                          </div>
                          <div className="text-xs sm:text-sm text-[#b3b3b3]">
                            {artist.genres.slice(0, 2).join(", ")}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm text-[#b3b3b3]">
                        {artist.followers.total.toLocaleString()} followers
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {customization.metric === "top_genres" &&
              userStats.allGenres?.length > 0 && (
                <div className="space-y-6">
                  <div className="bg-[#1e1e1e] p-4 sm:p-6 rounded-lg shadow-lg">
                    <div className="space-y-6">
                      {userStats.allGenres.map((genre, index) => (
                        <div key={genre.name} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-[#1DB954] font-mono text-lg">
                                #{index + 1}
                              </span>
                              <span className="text-xl text-white capitalize">
                                {genre.name}
                              </span>
                            </div>
                            <span className="text-lg font-bold text-[#1DB954]">
                              {genre.percentage}%
                            </span>
                          </div>
                          <div className="h-3 bg-[#282828] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#1DB954] rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${genre.percentage}%` }}
                            />
                          </div>
                          <div className="text-[#b3b3b3] text-sm">
                            {genre.count}{" "}
                            {genre.count === 1 ? "track" : "tracks"} in this
                            genre
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            {customization.metric === "stats" && (
              <div className="space-y-6">
                {/* Overall Stats Card */}
                <div className="mb-6 sm:mb-8 bg-[#1e1e1e] p-4 sm:p-6 rounded-lg shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1DB954] via-[#22c55e] to-[#1DB954]"></div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#1DB954] rounded-full flex items-center justify-center mb-4">
                      <BarChart2 className="w-12 h-12 sm:w-16 sm:h-16 text-black" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {formatListeningTime(userStats.totalMinutesListened)}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-[#1DB954]">
                      Total Listening Time
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Favorite Time */}
                  <div className="bg-[#282828] p-4 sm:p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-semibold text-white">
                        Favorite Time
                      </div>
                      <Clock className="w-5 h-5 text-[#1DB954]" />
                    </div>
                    <div className="text-3xl font-bold text-[#1DB954]">
                      {userStats.favoriteDayTime}
                    </div>
                    <div className="text-sm text-[#b3b3b3] mt-2">
                      Most active listening period
                    </div>
                  </div>

                  {/* Top Genres */}
                  <div className="bg-[#282828] p-4 sm:p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-semibold text-white">
                        Genre Distribution
                      </div>
                      <Music className="w-5 h-5 text-[#1DB954]" />
                    </div>
                    <div className="space-y-4">
                      {userStats.allGenres?.length > 0 ? (
                        userStats.allGenres.map((genre) => (
                          <div key={genre.name} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-white capitalize">
                                {genre.name}
                              </span>
                              <span className="text-xs text-[#1DB954]">
                                {genre.percentage}%
                              </span>
                            </div>
                            <div className="h-2 bg-[#1e1e1e] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#1DB954] rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${genre.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-[#b3b3b3] text-sm text-center py-4">
                          No genre data available
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-[#b3b3b3] mt-4">
                      Based on your top artists
                    </div>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="space-y-4">
                  {/* Liked Songs */}
                  <div className="bg-[#282828] p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          Liked Songs
                        </div>
                        <div className="text-sm text-[#b3b3b3]">
                          Total saved tracks
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#1DB954]">
                      {userStats.totalLikedSongs}
                    </div>
                  </div>

                  {/* Total Minutes */}
                  <div className="bg-[#282828] p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center">
                        <Headphones className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          Total Minutes
                        </div>
                        <div className="text-sm text-[#b3b3b3]">
                          Time spent listening
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-[#1DB954]">
                      {userStats.totalMinutesListened}
                    </div>
                  </div>
                </div>

                {/* Time Distribution */}
                <div className="bg-[#282828] p-4 sm:p-6 rounded-lg">
                  <div className="text-lg font-semibold text-white mb-4">
                    Listening Time Distribution
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {["Morning", "Afternoon", "Evening", "Night"].map(
                      (time) => (
                        <div
                          key={time}
                          className={`p-3 rounded-lg text-center ${
                            time === userStats.favoriteDayTime
                              ? "bg-[#1DB954] text-black"
                              : "bg-[#1e1e1e] text-[#b3b3b3]"
                          }`}
                        >
                          <div className="text-sm font-medium">{time}</div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {/* Footer Section */}
          <Separator className="bg-[#282828]" />
          <CardFooter
            className={`flex flex-col sm:flex-row justify-between p-3 sm:p-6 ${
              customization.mode === "dark" ? "bg-[#282828]" : "bg-slate-50"
            } ${getFontClass(customization.font)}`}
          >
            <div className="flex items-center space-x-2 text-[#b3b3b3]">
              <Music className="w-4 h-4" />
              <span className="text-xs sm:text-sm">
                Total Tracks: {tracks.length}
              </span>
            </div>
            <div className="flex items-center text-neutral-400">
              <span className="text-xs sm:text-sm font-medium">
                spotify-receiptify.vercel.app
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[#b3b3b3]">
              <Clock className="w-4 h-4" />
              <span className="text-xs sm:text-sm">
                Total Time: {calculateTotalDuration(tracks)}
              </span>
            </div>
          </CardFooter>
        </Card>

        {/* Customization Panel */}
        <div className="w-full lg:w-2/5">
          <CustomizationPanel
            customization={customization}
            handleCustomize={handleCustomize}
            downloadAsImage={downloadAsImage}
            handleCreatePlaylist={handleCreatePlaylist}
            userName={userName}
            handleShare={handleShare}
          />
        </div>
      </div>
    </div>
  );
}
