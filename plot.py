import matplotlib
import sqlite3
import matplotlib.pyplot as plt
from datetime import datetime
import io
import base64
import numpy as np
import pandas as pd

matplotlib.use('Agg')
def korelacja_miedzy_SPX_a_stopami_bezrobocia():
    try:

        db = sqlite3.connect('db/merged_data.db')
        cursor = db.cursor()


        cursor.execute('SELECT dane FROM merged_data')
        data = cursor.fetchall()
        dates = [datetime.strptime(row[0], "%Y-%m-%d") for row in data]

        cursor.execute('SELECT DFF FROM merged_data')
        DFF = [row[0] for row in cursor.fetchall()]

        cursor.execute('SELECT cena_otwarcia FROM merged_data')
        cena_otwarcia = [row[0] for row in cursor.fetchall()]


        fig, ax1 = plt.subplots(figsize=(12, 6))
        ax2 = ax1.twinx()

        ax1.plot(dates, DFF, color='blue', label='DFF (Stopy procentowe)')
        ax1.set_ylabel('DFF (Stopy procentowe)', color='blue')
        ax1.tick_params(axis='y', labelcolor='blue')

        ax2.plot(dates, cena_otwarcia, color='red', label='Cena otwarcia (SPX)')
        ax2.set_ylabel('Cena otwarcia (SPX)', color='red')
        ax2.tick_params(axis='y', labelcolor='red')

        ax1.set_xlabel('Data')
        plt.title('Korelacja między SPX a stopami procentowymi')


        ax1.legend(loc='upper left')
        ax2.legend(loc='upper right')


        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        buf.close()

        db.close()
        return image_base64
    except Exception as e:
        return str(e)


def srednia_zmiana_ceny_przy_zmianie_DFF(dni):




    db = sqlite3.connect('db/merged_data.db')
    cursor = db.cursor()


    cursor.execute('''SELECT dane, cena_zamkniecia, DFF FROM merged_data ORDER BY dane''')
    dane = cursor.fetchall()
    cursor.close()
    db.close()

    zmiany_cen = []

    for i in range(1, len(dane) - dni):
        data_poprzednia = dane[i - 1]
        data_biezaca = dane[i]

        dff_poprzedni = data_poprzednia[2]
        dff_biezacy = data_biezaca[2]


        if dff_biezacy != dff_poprzedni:
            roznica_stopy = round(dff_biezacy - dff_poprzedni, 3)
            cena_poczatkowa = data_biezaca[1]
            cena_docelowa = dane[i + dni][1]

            zmiana_procentowa = ((cena_docelowa - cena_poczatkowa) / cena_poczatkowa) * 100

            zmiany_cen.append((roznica_stopy, zmiana_procentowa))


    grupy = {}
    for roznica, zmiana in zmiany_cen:
        if roznica not in grupy:
            grupy[roznica] = []
        grupy[roznica].append(zmiana)


    wyniki = []
    for roznica, zmiany in grupy.items():
        srednia = sum(zmiany) / len(zmiany)
        wyniki.append({
            'roznica_stopy': roznica,
            'srednia_zmiana_ceny': round(srednia, 3)
        })

    return wyniki


def zmiana_ceny_w_czasie():
    try:
        db = sqlite3.connect('db/merged_data.db')
        cursor = db.cursor()

        cursor.execute('SELECT dane, cena_zamkniecia FROM merged_data')
        data = cursor.fetchall()

        db.close()

        dates = [datetime.strptime(row[0], "%Y-%m-%d") for row in data]
        close_prices = [row[1] for row in data]

        plt.figure(figsize=(12, 6), dpi=150)
        plt.plot(dates, close_prices, label='Cena zamknięcia (SPX)', color='green')
        plt.title('Zmiana ceny zamknięcia SPX w czasie')
        plt.xlabel('Data')
        plt.ylabel('Cena zamknięcia')
        plt.legend()


        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()  # Dostosowanie do wyświetlania dat

        plt.grid(True)

        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        buf.close()

        return image_base64
    except Exception as e:
        return str(e)

def histogram_zmian_cen():
    try:
        db = sqlite3.connect('db/merged_data.db')
        cursor = db.cursor()

        cursor.execute('SELECT cena_zamkniecia FROM merged_data')
        prices = [row[0] for row in cursor.fetchall()]

        db.close()

        changes = np.diff(prices)


        mean_change = np.mean(changes)
        std_dev_change = np.std(changes)

        plt.figure(figsize=(12, 6), dpi=150)
        plt.hist(changes, bins=50, color='orange', edgecolor='black', alpha=0.7)
        plt.title('Histogram zmian cen SPX')
        plt.xlabel('Zmiana ceny')
        plt.ylabel('Częstość')


        plt.axvline(mean_change, color='red', linestyle='dashed', linewidth=2, label=f'Średnia zmiana: {mean_change:.2f}')
        plt.axvline(mean_change + std_dev_change, color='blue', linestyle='dashed', linewidth=2, label=f'Odchylenie std: {std_dev_change:.2f}')
        plt.axvline(mean_change - std_dev_change, color='blue', linestyle='dashed', linewidth=2)

        plt.legend()

        plt.grid(True)

        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        buf.close()

        return image_base64
    except Exception as e:
        return str(e)

def zmiennosc_cen_okres(dni, start_date, end_date):
    try:
        db = sqlite3.connect('db/merged_data.db')
        cursor = db.cursor()


        cursor.execute(
            'SELECT dane, cena_zamkniecia FROM merged_data WHERE dane BETWEEN ? AND ?',
            (start_date, end_date)
        )
        data = cursor.fetchall()
        db.close()

        if not data:
            raise ValueError("Brak danych w podanym zakresie dat.")

        dates = [datetime.strptime(row[0], "%Y-%m-%d") for row in data]
        close_prices = [row[1] for row in data]

        zmiennosci = [np.std(close_prices[i:i+dni]) for i in range(len(close_prices) - dni)]
        wykres_daty = dates[dni:]

        plt.figure(figsize=(12, 6), dpi=150)
        plt.plot(wykres_daty, zmiennosci, label=f'Zmienność ({dni} dni)', color='purple')
        plt.title(f'Zmienność cen zamknięcia w okresie {start_date} - {end_date}')
        plt.xlabel('Data')
        plt.ylabel('Zmienność')
        plt.legend()
        plt.grid(True)

        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        image_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
        buf.close()

        return image_base64
    except Exception as e:
        return str(e)


def generuj_wykres_sma(okres=20):

    conn = sqlite3.connect("db/merged_data.db")
    df = pd.read_sql_query("SELECT dane, cena_zamkniecia FROM merged_data ORDER BY dane", conn)
    conn.close()


    df['dane'] = pd.to_datetime(df['dane'])
    df['SMA'] = df['cena_zamkniecia'].rolling(window=okres).mean()


    plt.figure(figsize=(12, 6))
    plt.plot(df['dane'], df['cena_zamkniecia'], label='Cena zamknięcia', color='blue')
    plt.plot(df['dane'], df['SMA'], label=f'{okres}-dniowa SMA', color='orange')
    plt.title(f'Wykres ceny zamknięcia i SMA ({okres} dni)')
    plt.xlabel('Data')
    plt.ylabel('Cena')
    plt.legend()
    plt.grid(True)


    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()
    plt.close()

    print("DEBUG: Tworzę wykres SMA")
    print("Długość zakodowanego obrazu:", len(image_base64))

    return image_base64

