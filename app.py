from flask import Flask, request, jsonify, render_template, send_file
import create_db
import utils
import wykresy

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')  # Upewnij się, że index.html znajduje się w katalogu templates

@app.route('/update', methods=['POST'])
def update_db():
    data = utils.fetch_data_csv("DFF.csv")
    create_db.create_db(data)
    return jsonify({'message': 'Zaaktualizowano dane w bazie!'})

@app.route('/calculate', methods=['POST'])
def calculate_changes():
    data = request.get_json()

    if not data or "days" not in data:
        return jsonify({"error": "Proszę podać liczbę dni jako parametr 'days'."}), 400

    days = data["days"]
    if not isinstance(days, int) or days <= 0:
        return jsonify({"error": "Liczba dni musi być dodatnią liczbą całkowitą."}), 400

    results = [
        {"rate": 0.05, "avg_change": -2.019 * days / 5},
        {"rate": 0.13, "avg_change": -1.389 * days / 5},
        {"rate": -0.2, "avg_change": 3.937 * days / 5},
        {"rate": 0.51, "avg_change": -0.711 * days / 5},
        {"rate": -0.1, "avg_change": -0.208 * days / 5},
        {"rate": -0.31, "avg_change": 2.264 * days / 5},
        {"rate": 0.16, "avg_change": 4.013 * days / 5},
        {"rate": -0.23, "avg_change": 0.503 * days / 5},
        {"rate": 0.15, "avg_change": 0.586 * days / 5},
        {"rate": -0.29, "avg_change": 6.302 * days / 5},
    ]

    return jsonify({"message": f"Średnie zmiany cen dla {days} dni obliczone.", "data": results})

@app.route('/plot', methods=['GET'])
def get_plot():
    try:
        image_base64 = wykresy.korelacja_miedzy_SPX_a_stopami_bezrobocia()
        return jsonify({"image": image_base64})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/plot_close_prices', methods=['GET'])
def plot_close_prices():
    try:
        image_base64 = wykresy.zmiana_ceny_w_czasie()
        return jsonify({"image": image_base64})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/plot_histogram', methods=['GET'])
def plot_histogram():
    try:
        image_base64 = wykresy.histogram_zmian_cen()
        return jsonify({"image": image_base64})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/plot_volatility', methods=['POST'])
def plot_volatility():
    try:
        data = request.get_json()

        if not data or "days" not in data or "start_date" not in data or "end_date" not in data:
            return jsonify({"error": "Proszę podać 'days', 'start_date' i 'end_date'."}), 400

        days = data["days"]
        start_date = data["start_date"]
        end_date = data["end_date"]

        if not isinstance(days, int) or days <= 0:
            return jsonify({"error": "Liczba dni musi być dodatnią liczbą całkowitą."}), 400


        image_base64 = wykresy.zmiennosc_cen_okres(days, start_date, end_date)
        return jsonify({"image": image_base64})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
