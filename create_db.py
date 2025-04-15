import sqlite3
import utils

def create_db(dane2):
    con = sqlite3.connect("db/dane2.db")
    cur = con.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS dane2(dane TEXT,DFF INTEGER);""")

    for index,row in dane2.iterrows():
        cur.execute(
        """INSERT INTO dane2('dane','DFF') Values (?,?)""",(row['DATE'],row['DFF'])

        )

    con.commit()
    con.close()

def create_db_from_api():
    con = sqlite3.connect("db/dane.db")
    cur = con.cursor()
    data2 = utils.fetch_data()
    dni = data2["Time Series (Daily)"]

    cur.execute("""
            CREATE TABLE IF NOT EXISTS dane(dane TEXT,cena_otwarcia INTEGER,cena_zamkniecia INTEGER);""")

    for klucz, info in dni.items():

        cur.execute("INSERT INTO dane(dane,cena_otwarcia,cena_zamkniecia)"
        "VALUES (?,?,?)",(klucz, float(info["1. open"]),float(info["4. close"]))

                    )

    con.commit()
    cur.close()
    con.close()


def split_db(db1_path, db2_path, output_db_path):

    output_con = sqlite3.connect(output_db_path)
    output_cur = output_con.cursor()


    output_cur.execute(f"ATTACH DATABASE '{db1_path}' AS db1;")
    output_cur.execute(f"ATTACH DATABASE '{db2_path}' AS db2;")


    output_cur.execute("""
        CREATE TABLE IF NOT EXISTS merged_data (
            dane TEXT,
            cena_otwarcia REAL,
            cena_zamkniecia REAL,
            DFF INTEGER
        );
    """)


    merged_query = """
        INSERT INTO merged_data (dane, cena_otwarcia, cena_zamkniecia, DFF)
        SELECT db1.dane.dane, db1.dane.cena_otwarcia, db1.dane.cena_zamkniecia, db2.dane2.DFF
        FROM db1.dane
        JOIN db2.dane2
        ON db1.dane.dane = db2.dane2.dane;
    """


    output_cur.execute(merged_query)


    output_con.commit()
    output_con.close()