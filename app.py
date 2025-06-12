from flask import Flask, request, jsonify, render_template, send_file
import create_db
import utils
import plot

from flask_cors import CORS

app = Flask(__name__)
CORS(app)
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/update', methods=['POST'])
def update_db():
    print("Headers:", request.headers)
    data = request.get_json()
    if data is None:
        print("No JSON received!")
        return jsonify({'error': 'No JSON data received'}), 400
    print("Received JSON:", data)
    stock = data.get('stock')
    if not stock:
        return jsonify({'error': 'Missing "stock" field in JSON'}), 400

    csv_data = utils.fetch_data_csv("db/DFF.csv")
    create_db.create_db(csv_data)

    return jsonify({'message': 'Zaaktualizowano dane w bazie!'})

@app.route('/calculate', methods=['POST'])
def calculate_changes():
    data = request.get_json()

    if not data or "days" not in data:
        return jsonify({"error": "Proszę podać liczbę dni jako parametr 'days'."}), 400

    days = data["days"]
    if not isinstance(days, int) or days <= 0:
        return jsonify({"error": "Liczba dni musi być dodatnią liczbą całkowitą."}), 400

    wyniki = plot.srednia_zmiana_ceny_przy_zmianie_DFF(days)

    if wyniki:
        avg_change = round(sum(w['srednia_zmiana_ceny'] for w in wyniki) / len(wyniki), 3)
        total_change = round(sum(w['srednia_zmiana_ceny'] for w in wyniki), 3)
    else:
        avg_change = 0.0
        total_change = 0.0

    return jsonify({
        "message": f"Średnie zmiany cen dla {days} dni obliczone.",
        "days": days,
        "average_change": avg_change,
        "total_change": total_change,
        "data": wyniki
    })

@app.route('/plot', methods=['GET'])
def get_plot():
    try:
        image_base64 = plot.korelacja_miedzy_SPX_a_stopami_bezrobocia()
        return jsonify({"image": image_base64})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/plot_close_prices', methods=['GET'])
def plot_close_prices():
    try:
        image_base64 = plot.zmiana_ceny_w_czasie()
        return jsonify({"image": image_base64})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/plot_histogram', methods=['GET'])
def plot_histogram():
    try:
        image_base64 = plot.histogram_zmian_cen()
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


        image_base64 = plot.zmiennosc_cen_okres(days, start_date, end_date)
        return jsonify({"image": image_base64})

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/plot_sma', methods=['GET'])
def get_sma_plot():
    try:
        image_base64 = plot.generuj_wykres_sma()  # <- funkcja z plot.py
        return jsonify({"image": image_base64})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

