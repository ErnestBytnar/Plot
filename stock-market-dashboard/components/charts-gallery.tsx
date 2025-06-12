"use client"

import type React from "react"

import { useState } from "react"
import { BarChart3, TrendingUp, PieChart, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api"

interface ChartConfig {
  id: string
  title: string
  description: string
  endpoint: string
  icon: React.ComponentType<{ className?: string }>
}

const charts: ChartConfig[] = [
  {
    id: "correlation",
    title: "SPX vs Unemployment",
    description: "Correlation between S&P 500 and unemployment rates",
    endpoint: "/plot",
    icon: BarChart3,
  },
  {
    id: "close_prices",
    title: "Price Changes Over Time",
    description: "Historical stock price movements",
    endpoint: "/plot_close_prices",
    icon: TrendingUp,
  },
  {
    id: "histogram",
    title: "Price Change Distribution",
    description: "Histogram of price changes",
    endpoint: "/plot_histogram",
    icon: PieChart,
  },
  {
    id: "sma",
    title: "Simple Moving Average",
    description: "SMA analysis and trends",
    endpoint: "/plot_sma",
    icon: Activity,
  },
]

export function ChartsGallery() {
  const [chartImages, setChartImages] = useState<Record<string, string>>({})
  const [loadingCharts, setLoadingCharts] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  const loadChart = async (chart: ChartConfig) => {
    setLoadingCharts((prev) => ({ ...prev, [chart.id]: true }))

    try {
      const imageData = await apiService.getPlotImage(chart.endpoint)
      setChartImages((prev) => ({ ...prev, [chart.id]: imageData }))
    } catch (error) {
      toast({
        title: "Failed to Load Chart",
        description: `Could not load ${chart.title}`,
        variant: "destructive",
      })
    } finally {
      setLoadingCharts((prev) => ({ ...prev, [chart.id]: false }))
    }
  }

  const loadAllCharts = async () => {
    for (const chart of charts) {
      await loadChart(chart)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Charts Gallery</h2>
          <p className="text-gray-400">Visualize stock market data with interactive charts</p>
        </div>
        <Button onClick={loadAllCharts} className="bg-blue-600 hover:bg-blue-700 text-white">
          Load All Charts
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts.map((chart) => {
          const Icon = chart.icon
          const isLoading = loadingCharts[chart.id]
          const imageData = chartImages[chart.id]

          return (
            <Card key={chart.id} className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Icon className="h-5 w-5 text-blue-500" />
                  {chart.title}
                </CardTitle>
                <CardDescription className="text-gray-400">{chart.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!imageData && !isLoading && (
                    <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700">
                      <div className="text-center">
                        <Icon className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-500">Click to load chart</p>
                      </div>
                    </div>
                  )}

                  {isLoading && (
                    <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
                        <p className="text-gray-400">Loading chart...</p>
                      </div>
                    </div>
                  )}

                  {imageData && (
                    <div className="animate-in fade-in-50 duration-500">
                      <img
                        src={`data:image/png;base64,${imageData}`}
                        alt={chart.title}
                        className="w-full h-auto rounded-lg border border-gray-700"
                      />
                    </div>
                  )}

                  <Button
                    onClick={() => loadChart(chart)}
                    disabled={isLoading}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                  >
                    {isLoading ? "Loading..." : imageData ? "Refresh Chart" : "Load Chart"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
