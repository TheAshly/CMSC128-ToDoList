from flask import Flask, redirect, render_template, request
import sqlite3

# Database 
conn = sqlite3.connect("tasks.db")
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS tasks (       
    id          INTEGER PRIMARY KEY AUTOINCREMENT,            
    name        TEXT NOT NULL,
    priority    TEXT NOT NULL,
    date-added  TEXT NOT NULL,
    time-added  TEXT NOT NULL,
    date-due    TEXT NOT NULL,
    time-due    TEXT NOT NULL
    )
""")

# Server  
app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/add-task', method=['post'])
def add_task():
    name = request.form.get("name")
    priority = request.form.get("priority")
    date_due = request.form.get("date-due")
    time_due = request.form.get("time-due")
    print(name, priority, date_due, time_due)

if __name__ == "__main__":
    app.run(debug=True)



