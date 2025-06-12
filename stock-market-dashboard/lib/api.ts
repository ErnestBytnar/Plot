const API_BASE_URL = "http://localhost:5000"

export interface CalculateResponse {
  days: number
  price_changes: number[]
  average_change: number
  total_change: number
}

export interface VolatilityRequest {
  days: number
  start_date: string
  end_date: string
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

 async updateData(): Promise<{ message: string }> {
  return this.request("/update", {
    method: "POST",
    body: JSON.stringify({}),
  })
}


  async calculate(days: number): Promise<CalculateResponse> {
    return this.request("/calculate", {
      method: "POST",
      body: JSON.stringify({ days }),
    })
  }

  async getPlotImage(endpoint: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch plot: ${response.statusText}`)
    }
    const data = await response.json()
    return data.image || data.plot // Handle different response formats
  }

  async getVolatilityPlot(params: VolatilityRequest): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/plot_volatility`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch volatility plot: ${response.statusText}`)
    }

    const data = await response.json()
    return data.image || data.plot
  }
}

export const apiService = new ApiService()
