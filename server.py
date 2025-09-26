from flask import Flask, redirect, render_template, request
import sqlite3
from datetime import datetime
import json

# Database 
conn = sqlite3.connect("tasks.db", check_same_thread=False)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS tasks (       
    id          INTEGER PRIMARY KEY AUTOINCREMENT,            
    name        TEXT NOT NULL,
    priority    TEXT NOT NULL,
    date_added  TEXT NOT NULL,
    time_added  TEXT NOT NULL,
    date_due    TEXT NOT NULL,
    time_due    TEXT NOT NULL,
    completed   INTEGER NOT NULL
    )
""")

def db_add_task (name, priority, date_due, time_due, date_now, time_now):
    cursor.execute("""
    INSERT INTO tasks (name, priority, date_added, time_added, date_due, time_due, completed)
    VALUES (?, ?, ?, ? ,?, ?, ?)
    """, (name, priority, date_now, time_now, date_due, time_due, 0))
    conn.commit()
    print(f"Task {name} has been added!")

def db_clear_rows(): 
    cursor.execute("""DELETE from tasks""")
    conn.commit()

def db_get_rows():
    cursor.execute("SELECT * FROM tasks")
    rows = cursor.fetchall()
    tasks = [dict(row) for row in rows]
    return tasks

# Server  
app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html", tasks=db_get_rows())


@app.route('/add-task', methods=['post'])
def add_task():
    name = request.form.get("name")
    priority = request.form.get("priority")
    date_due = request.form.get("date-due")
    time_due = request.form.get("time-due")
    
    now = datetime.now()
    date_now = now.strftime("%y-%m-%d")
    time_now = now.strftime("%H:%M")

    db_add_task(name, priority, date_due, time_due, date_now, time_now)
    return redirect("/")


if __name__ == "__main__":
    app.run(debug=True)



