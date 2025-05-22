"use client"

import { useState } from "react"

// Stub implementation for web-only version
export function useAdMob() {
  const [isAdMobAvailable, setIsAdMobAvailable] = useState(false)
  const [isAdMobInitialized, setIsAdMobInitialized] = useState(false)
  const [bannerVisible, setBannerVisible] = useState(false)

  // Check if we're in a Capacitor environment - always false in web version
  const isCapacitorEnvironment = () => false

  // Initialize AdMob - stub for web version
  const initializeAdMob = async () => {
    console.log("AdMob initialization skipped - web version only")
    return false
  }

  // Show banner ad - stub for web version
  const showBannerAd = async () => {
    console.log("Banner ad display skipped - web version only")
    return false
  }

  // Hide banner ad - stub for web version
  const hideBannerAd = async () => {
    console.log("Banner ad hide skipped - web version only")
    return false
  }

  // Show interstitial ad - stub for web version
  const showInterstitialAd = async () => {
    console.log("Interstitial ad display skipped - web version only")
    return false
  }

  // Show rewarded ad - stub for web version
  const showRewardedAd = async () => {
    console.log("Rewarded ad display skipped - web version only")
    return false
  }

  return {
    isAdMobAvailable,
    isAdMobInitialized,
    bannerVisible,
    initializeAdMob,
    showBannerAd,
    hideBannerAd,
    showInterstitialAd,
    showRewardedAd,
  }
}
