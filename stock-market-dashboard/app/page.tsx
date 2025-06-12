"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UpdateData } from "@/components/update-data"
import { CalculateChanges } from "@/components/calculate-changes"
import { ChartsGallery } from "@/components/charts-gallery"
import { VolatilityAnalysis } from "@/components/volatility-analysis"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, BarChart3, Activity, Calculator } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview")

  const renderContent = () => {
    switch (activeSection) {
      case "calculate":
        return <CalculateChanges />
      case "charts":
        return <ChartsGallery />
      case "volatility":
        return <VolatilityAnalysis />
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="text-center py-8">
              <h1 className="text-4xl font-bold text-white mb-4">Stock Market Data Visualizations</h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Analyze stock market trends, calculate price changes, and visualize financial data with our
                comprehensive dashboard
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm font-medium">Market Analysis</p>
                      <p className="text-2xl font-bold text-white">Real-time</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-900 to-green-800 border-green-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-200 text-sm font-medium">Price Calculator</p>
                      <p className="text-2xl font-bold text-white">Advanced</p>
                    </div>
                    <Calculator className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-200 text-sm font-medium">Chart Gallery</p>
                      <p className="text-2xl font-bold text-white">4 Charts</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-900 to-red-800 border-red-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-200 text-sm font-medium">Volatility</p>
                      <p className="text-2xl font-bold text-white">Analysis</p>
                    </div>
                    <Activity className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Update Data Section */}
            <UpdateData />

            {/* Features Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Key Features</CardTitle>
                  <CardDescription className="text-gray-400">
                    Comprehensive tools for stock market analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <div>
                      <h4 className="text-white font-medium">Real-time Data Updates</h4>
                      <p className="text-gray-400 text-sm">Keep your data current with CSV imports</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div>
                      <h4 className="text-white font-medium">Price Change Calculator</h4>
                      <p className="text-gray-400 text-sm">Calculate changes over custom time periods</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <div>
                      <h4 className="text-white font-medium">Interactive Charts</h4>
                      <p className="text-gray-400 text-sm">Visualize trends with multiple chart types</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                    <div>
                      <h4 className="text-white font-medium">Volatility Analysis</h4>
                      <p className="text-gray-400 text-sm">Analyze market volatility patterns</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Getting Started</CardTitle>
                  <CardDescription className="text-gray-400">Quick guide to using the dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Update Your Data</h4>
                      <p className="text-gray-400 text-sm">Start by updating the database with latest data</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Calculate Changes</h4>
                      <p className="text-gray-400 text-sm">Use the calculator to analyze price movements</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Explore Charts</h4>
                      <p className="text-gray-400 text-sm">View various visualizations in the charts gallery</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Analyze Volatility</h4>
                      <p className="text-gray-400 text-sm">Perform detailed volatility analysis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
    }
  }

  return (
    <>
      <DashboardLayout activeSection={activeSection} onSectionChange={setActiveSection}>
        {renderContent()}
      </DashboardLayout>
      <Toaster />
    </>
  )
}
