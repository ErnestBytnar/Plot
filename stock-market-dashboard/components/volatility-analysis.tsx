"use client"

import { useState } from "react"
import { Activity, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { apiService, type VolatilityRequest } from "@/lib/api"

export function VolatilityAnalysis() {
  const [formData, setFormData] = useState<VolatilityRequest>({
    days: 30,
    start_date: "2023-01-01",
    end_date: "2023-12-31",
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [chartImage, setChartImage] = useState<string | null>(null)
  const { toast } = useToast()

  const handleInputChange = (field: keyof VolatilityRequest, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAnalyze = async () => {
    if (!formData.start_date || !formData.end_date || formData.days <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all fields with valid values",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    try {
      const imageData = await apiService.getVolatilityPlot(formData)
      setChartImage(imageData)
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to generate volatility analysis",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Activity className="h-5 w-5 text-red-500" />
            Volatility Analysis
          </CardTitle>
          <CardDescription className="text-gray-400">
            Analyze stock price volatility over a custom date range
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="days" className="text-white">
                Days
              </Label>
              <Input
                id="days"
                type="number"
                value={formData.days}
                onChange={(e) => handleInputChange("days", Number.parseInt(e.target.value) || 0)}
                placeholder="Number of days"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-white">
                Start Date
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange("start_date", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-white">
                End Date
              </Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange("end_date", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <Button onClick={handleAnalyze} disabled={isAnalyzing} className="bg-red-600 hover:bg-red-700 text-white">
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Analyze Volatility
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {chartImage && (
        <Card className="bg-gray-900 border-gray-800 animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5 text-red-500" />
              Volatility Chart
            </CardTitle>
            <CardDescription className="text-gray-400">
              Volatility analysis for {formData.days} days from {formData.start_date} to {formData.end_date}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-in fade-in-50 duration-500">
              <img
                src={`data:image/png;base64,${chartImage}`}
                alt="Volatility Analysis Chart"
                className="w-full h-auto rounded-lg border border-gray-700"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
