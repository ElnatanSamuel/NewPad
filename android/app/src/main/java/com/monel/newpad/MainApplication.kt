package com.monel.newpad

import android.app.Application
import android.content.Context
import android.content.Intent
import android.content.res.Configuration
import android.util.Log

import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.common.ReleaseLevel
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost

import com.google.android.play.core.assetpacks.AssetPackLocation
import com.google.android.play.core.assetpacks.AssetPackManager
import com.google.android.play.core.assetpacks.AssetPackManagerFactory
import com.google.android.play.core.assetpacks.AssetPackState
import com.google.android.play.core.assetpacks.AssetPackStateUpdateListener
import com.google.android.play.core.assetpacks.model.AssetPackStatus

import expo.modules.ApplicationLifecycleDispatcher

import java.io.File

class MainApplication : Application(), ReactApplication {

  private val assetPackManager: AssetPackManager by lazy {
    AssetPackManagerFactory.getInstance(this)
  }

  override val reactNativeHost: ReactNativeHost = object : DefaultReactNativeHost(this@MainApplication) {
    override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
    override fun getPackages(): List<com.facebook.react.ReactPackage> = PackageList(this@MainApplication).packages
    override fun getJSBundleFile(): String? {
      return getJSBundleFromAssetPack()
    }
  }

  override val reactHost: ReactHost
    get() = DefaultReactHost.getDefaultReactHost(applicationContext, reactNativeHost)

  private fun getJSBundleFromAssetPack(): String? {
    try {
      val packName = "js_assets"
      val packLocation = assetPackManager.getPackLocation(packName)
      val assetsDir = packLocation?.assetsPath()
      if (assetsDir != null) {
        val bundleFile = File(assetsDir, "pad_index.android.bundle")
        if (bundleFile.exists()) {
          Log.i("PAD", "Loading JS bundle from asset pack: ${bundleFile.absolutePath}")
          return bundleFile.absolutePath
        }
      }
    } catch (e: Exception) {
      Log.w("PAD", "Failed to load from asset pack, falling back to base APK", e)
    }
    return null
  }

  override fun onCreate() {
    super.onCreate()
    DefaultNewArchitectureEntryPoint.releaseLevel = try {
      ReleaseLevel.valueOf(BuildConfig.REACT_NATIVE_RELEASE_LEVEL.uppercase())
    } catch (e: IllegalArgumentException) {
      ReleaseLevel.STABLE
    }
    
    registerAssetPackListener()
    
    com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative(this)
    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }

  private fun registerAssetPackListener() {
    val listener = object : AssetPackStateUpdateListener {
      override fun onStateUpdate(state: AssetPackState) {
        if (state.name() == "js_assets" && state.status() == AssetPackStatus.COMPLETED) {
          Log.i("PAD", "Asset pack downloaded, restarting app to load new bundle")
          restartApp()
        }
      }
    }
    assetPackManager.registerListener(listener)
  }

  private fun restartApp() {
    val intent = packageManager.getLaunchIntentForPackage(packageName)
    if (intent != null) {
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK)
      startActivity(intent)
      android.os.Process.killProcess(android.os.Process.myPid())
    }
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
  }
}