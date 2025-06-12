"use client"

import { useState } from "react"
import { Database, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api"

export function UpdateData() {
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      const response = await apiService.updateData()
      toast({
        title: "Data Updated Successfully",
        description: response.message || "Database has been updated with latest data",
        duration: 5000,
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update data",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Database className="h-5 w-5 text-blue-500" />
          Data Management
        </CardTitle>
        <CardDescription className="text-gray-400">
          Update the database with the latest stock market data from CSV files
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleUpdate} disabled={isUpdating} className="bg-blue-600 hover:bg-blue-700 text-white">
          {isUpdating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Updating...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Update Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
