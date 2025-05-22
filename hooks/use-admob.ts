"use client"

import { useEffect, useState } from "react"
import {
  USE_TEST_ADS,
  TEST_BANNER_AD_UNIT_ID,
  TEST_INTERSTITIAL_AD_UNIT_ID,
  TEST_REWARDED_AD_UNIT_ID,
  BANNER_AD_UNIT_ID,
  INTERSTITIAL_AD_UNIT_ID,
  REWARDED_AD_UNIT_ID,
} from "@/lib/ad-constants"

// AdMob types
type AdMobBannerSize = "BANNER" | "LARGE_BANNER" | "MEDIUM_RECTANGLE" | "FULL_BANNER" | "LEADERBOARD" | "SMART_BANNER"

interface AdMobInitializationOptions {
  testingDevices?: string[]
  initializeForTesting?: boolean
}

interface AdMobBannerOptions {
  adId?: string
  isTesting?: boolean
  bannerSize?: AdMobBannerSize
  position?: "TOP_CENTER" | "BOTTOM_CENTER"
  margin?: number
}

interface AdMobInterstitialOptions {
  adId?: string
  isTesting?: boolean
}

interface AdMobRewardOptions extends AdMobInterstitialOptions {}

export function useAdMob() {
  const [isAdMobAvailable, setIsAdMobAvailable] = useState(false)
  const [isAdMobInitialized, setIsAdMobInitialized] = useState(false)
  const [bannerVisible, setBannerVisible] = useState(false)

  // Check if we're in a Capacitor environment
  const isCapacitorEnvironment = () => {
    return typeof window !== "undefined" && window.Capacitor !== undefined
  }

  // Initialize AdMob
  const initializeAdMob = async (options: AdMobInitializationOptions = {}) => {
    if (!isCapacitorEnvironment()) {
      console.log("AdMob is only available in Capacitor environment")
      return false
    }

    try {
      const { AdMob } = await import("@capacitor/admob")

      // Initialize AdMob
      await AdMob.initialize({
        requestTrackingAuthorization: true,
        testingDevices: options.testingDevices || [],
        initializeForTesting: options.initializeForTesting || USE_TEST_ADS,
      })

      setIsAdMobInitialized(true)
      setIsAdMobAvailable(true)

      console.log("AdMob initialized successfully")
      return true
    } catch (error) {
      console.error("Error initializing AdMob:", error)
      return false
    }
  }

  // Show banner ad
  const showBannerAd = async (options: AdMobBannerOptions = {}) => {
    if (!isAdMobAvailable || !isAdMobInitialized) {
      console.log("AdMob is not available or not initialized")
      return false
    }

    try {
      const { AdMob } = await import("@capacitor/admob")

      // Determine which ad ID to use
      const adId = options.adId || (USE_TEST_ADS ? TEST_BANNER_AD_UNIT_ID : BANNER_AD_UNIT_ID)

      // Show banner
      await AdMob.showBanner({
        adId,
        adSize: options.bannerSize || "ADAPTIVE_BANNER",
        position: options.position || "BOTTOM_CENTER",
        margin: options.margin || 0,
      })

      setBannerVisible(true)
      return true
    } catch (error) {
      console.error("Error showing banner ad:", error)
      return false
    }
  }

  // Hide banner ad
  const hideBannerAd = async () => {
    if (!isAdMobAvailable || !isAdMobInitialized || !bannerVisible) {
      return false
    }

    try {
      const { AdMob } = await import("@capacitor/admob")
      await AdMob.hideBanner()
      setBannerVisible(false)
      return true
    } catch (error) {
      console.error("Error hiding banner ad:", error)
      return false
    }
  }

  // Show interstitial ad
  const showInterstitialAd = async (options: AdMobInterstitialOptions = {}) => {
    if (!isAdMobAvailable || !isAdMobInitialized) {
      console.log("AdMob is not available or not initialized")
      return false
    }

    try {
      const { AdMob } = await import("@capacitor/admob")

      // Determine which ad ID to use
      const adId = options.adId || (USE_TEST_ADS ? TEST_INTERSTITIAL_AD_UNIT_ID : INTERSTITIAL_AD_UNIT_ID)

      // Prepare interstitial
      await AdMob.prepareInterstitial({
        adId,
      })

      // Show interstitial
      await AdMob.showInterstitial()
      return true
    } catch (error) {
      console.error("Error showing interstitial ad:", error)
      return false
    }
  }

  // Show rewarded ad
  const showRewardedAd = async (options: AdMobRewardOptions = {}) => {
    if (!isAdMobAvailable || !isAdMobInitialized) {
      console.log("AdMob is not available or not initialized")
      return false
    }

    try {
      const { AdMob } = await import("@capacitor/admob")

      // Determine which ad ID to use
      const adId = options.adId || (USE_TEST_ADS ? TEST_REWARDED_AD_UNIT_ID : REWARDED_AD_UNIT_ID)

      // Prepare rewarded ad
      await AdMob.prepareRewardVideoAd({
        adId,
      })

      // Show rewarded ad
      await AdMob.showRewardVideoAd()
      return true
    } catch (error) {
      console.error("Error showing rewarded ad:", error)
      return false
    }
  }

  // Initialize AdMob when the component mounts
  useEffect(() => {
    if (isCapacitorEnvironment() && !isAdMobInitialized) {
      initializeAdMob({
        testingDevices: ["EMULATOR"],
        initializeForTesting: USE_TEST_ADS,
      })
    }
  }, [isAdMobInitialized])

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
