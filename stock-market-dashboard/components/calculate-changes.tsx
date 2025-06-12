"use client"

import { useState } from "react"
import { Calculator, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { apiService, type CalculateResponse } from "@/lib/api"

export function CalculateChanges() {
  const [days, setDays] = useState<string>("30")
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<CalculateResponse | null>(null)
  const { toast } = useToast()

  const handleCalculate = async () => {
    const daysNum = Number.parseInt(days)
    if (!daysNum || daysNum <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number of days",
        variant: "destructive",
      })
      return
    }

    setIsCalculating(true)
    try {
      const response = await apiService.calculate(daysNum)
      setResult(response)
    } catch (error) {
      toast({
        title: "Calculation Failed",
        description: error instanceof Error ? error.message : "Failed to calculate changes",
        variant: "destructive",
      })
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Calculator className="h-5 w-5 text-green-500" />
            Calculate Price Changes
          </CardTitle>
          <CardDescription className="text-gray-400">
            Calculate stock price changes over a specified number of days
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="days" className="text-white">
              Number of Days
            </Label>
            <Input
              id="days"
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="Enter number of days"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <Button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isCalculating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="bg-gray-900 border-gray-800 animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle className="text-white">Calculation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-400">Days Analyzed</span>
                </div>
                <p className="text-2xl font-bold text-white mt-2">{result.days}</p>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  {result.average_change >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-gray-400">Average Change</span>
                </div>
                <p
                  className={`text-2xl font-bold mt-2 ${
                    typeof result.average_change === "number" && result.average_change >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {typeof result.average_change === "number"
                    ? result.average_change.toFixed(2) + "%"
                    : "Brak danych"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-white font-semibold mb-2">Tabela danych</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-300 border border-gray-700">
                  <thead className="bg-gray-800 text-gray-400">
                    <tr>
                      <th className="px-4 py-2 border-b border-gray-700">Różnica stopy</th>
                      <th className="px-4 py-2 border-b border-gray-700">Średnia zmiana ceny</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.data.map((row, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                      >
                        <td className="px-4 py-2 border-b border-gray-700">
                          {row.roznica_stopy.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 border-b border-gray-700">
                          {row.srednia_zmiana_ceny.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
