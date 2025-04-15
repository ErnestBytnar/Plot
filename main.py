from app import app
import plot

if __name__ == "__main__":
    print(plot.srednia_zmiana_ceny_przy_zmianie_DFF(6))
    app.run(debug=True)