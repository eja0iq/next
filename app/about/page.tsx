"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info, Music, Github, Twitter } from "lucide-react";
import Header from "@/components/Header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1DB954]">
      <Header />
      <div className="flex items-center justify-center p-4 h-[calc(100vh-64px)]">
        <Card className="w-full max-w-md bg-[#181818] border-none shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-[#1DB954] flex items-center justify-center">
              <Info className="w-8 h-8 mr-2" />
              About Receiptify+
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-white text-lg">
                Your Personal Spotify Statistics Generator
              </p>
              <p className="text-sm text-[#b3b3b3]">
                Receiptify+ transforms your Spotify listening history into
                beautiful, shareable receipts and provides detailed insights
                about your music taste.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#282828]"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#181818] px-2 text-[#b3b3b3]">
                    Our Story
                  </span>
                </div>
              </div>

              <p className="text-[#b3b3b3] text-sm">
                Created by music lovers for music lovers, Receiptify+ started as
                a passion project to give Spotify users a unique way to
                visualize and share their music preferences. We believe that
                music taste tells a story, and we're here to help you tell
                yours.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#282828]"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#181818] px-2 text-[#b3b3b3]">
                    Technology
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-[#b3b3b3]">⚡ React</div>
                <div className="text-[#b3b3b3]">🎵 Spotify API</div>
                <div className="text-[#b3b3b3]">🎨 Tailwind CSS</div>
                <div className="text-[#b3b3b3]">🚀 Next.js</div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <a
                href="https://github.com/your-username/receiptify-plus"
                className="text-[#b3b3b3] hover:text-[#1DB954] transition-colors duration-300"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com/receiptify_plus"
                className="text-[#b3b3b3] hover:text-[#1DB954] transition-colors duration-300"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-[#b3b3b3]">
            <p>Made with ❤️ by the Receiptify+ Team</p>
            <p className="text-xs">Version 1.0.0 | © 2024 Receiptify+</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
