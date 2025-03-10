import requests
import pandas as pd
KEY = "D45CK3JCIQEI6172"
SYMBOL = "SPY"
OUTPUT = "full" #compact - 100 #full - wszystko

def fetch_data():
    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={SYMBOL}&apikey={KEY}&outputsize={OUTPUT}'
    r = requests.get(url)
    data = r.json()
    return data


def fetch_data_csv(plik):
    data_csv = pd.read_csv(plik)
    return data_csv