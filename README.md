# Kalkulator Zmian Cen i Wykresy SMA

Aplikacja umożliwia obliczanie średnich zmian cen na podstawie procentowych zmian stóp procentowych (DFF) oraz generowanie wykresów, w tym wykresów SMA (Simple Moving Average). Użytkownicy mogą obliczyć średnią zmianę ceny na podstawie danych oraz generować wykresy takich danych jak korelacja, zmiana ceny zamknięcia czy zmienność cen w czasie.

## Wymagania

Aby uruchomić aplikację, wymagane są następujące komponenty:

- Python 3.x
- Flask (do uruchomienia backendu)
- Matplotlib (do generowania wykresów)
- Pandas (do analizy danych)
- NumPy (do obliczeń numerycznych)
- Jinja2 (do renderowania szablonów HTML)

## Instalacja

1. **Sklonuj repozytorium:**

    ```bash
    git clone https://github.com/twoje-repozytorium.git
    cd twoje-repozytorium
    ```

2. **Zainstaluj wymagane biblioteki:**

    Jeśli masz zainstalowany `pip` (Python package manager), zainstaluj wszystkie zależności:

    ```bash
    pip install -r requirements.txt
    ```

    Jeśli nie masz pliku `requirements.txt`, zainstaluj wymagane biblioteki ręcznie:

    ```bash
    pip install flask matplotlib pandas numpy
    ```

## Uruchomienie aplikacji

1. Uruchom serwer Flask:

    ```bash
    python app.py
    ```

2. Aplikacja będzie działać pod adresem: [http://127.0.0.1:5000](http://127.0.0.1:5000).

## Funkcjonalności

### Kalkulator średniej zmiany ceny
- **Opis**: Użytkownik może podać liczbę dni, po których aplikacja obliczy średnią zmianę ceny na podstawie danych o stopach procentowych (DFF) oraz cenach.
- **Endpoint**: `/calculate`
- **Metoda**: `POST`
- **Dane wejściowe**: Liczba dni do obliczenia średniej zmiany ceny.
- **Odpowiedź**: Tabela z wynikami obliczeń (stopa procentowa, średnia zmiana ceny).

### Wykres SMA (Simple Moving Average)
- **Opis**: Generowanie wykresu z prostą średnią ruchomą (SMA) na podstawie danych cen.
- **Endpoint**: `/plot_sma`
- **Metoda**: `GET`
- **Odpowiedź**: Obraz wykresu w formacie base64, który jest wyświetlany na stronie.

### Generowanie wykresów korelacji i zmienności
- **Opis**: Możliwość generowania wykresów związanych z korelacją między danymi oraz zmiennością cen w wybranym przedziale czasowym.
- **Endpoints**:
  - `/plot` – Wykres korelacji między zmiennymi.
  - `/plot_close_prices` – Wykres zmiany ceny zamknięcia.
  - `/plot_histogram` – Histogram zmian cen.
  - `/plot_volatility` – Wykres zmienności cen w określonym zakresie dat.
