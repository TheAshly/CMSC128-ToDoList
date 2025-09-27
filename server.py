from flask import Flask, redirect, render_template, jsonify, request
import sqlite3
from datetime import datetime
import json

# Database 
conn = sqlite3.connect("tasks.db", check_same_thread=False)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Temporary storage for the recently deleted row.
# This can still be salvaged if the user opts
# to restore it
last_deleted_row = dict()                       

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


def db_edit_task (id, name, priority, date_due, time_due):
    cursor.execute("""
    UPDATE tasks
    SET name = ?,
        priority = ?,
        date_due = ?,
        time_due = ?
    WHERE id = ? 
    """, (name, priority, date_due, time_due, id))  
    conn.commit()
    print(f"Task {name} has been edited!")


def db_del_task (id, name):        
    global last_deleted_row

    cursor.execute("SELECT * FROM tasks WHERE id = ?", (id,))
    task = cursor.fetchone()
    last_deleted_row = dict(task)

    cursor.execute("""
    DELETE FROM tasks
    WHERE id = ? """, (id,))  

    conn.commit()
    print(f"Task {name} has been deleted!")


def db_toggle_completed(id): 
    cursor.execute("SELECT * FROM tasks WHERE id = ?", (id,))
    task = cursor.fetchone()

    completed_val = 0 if task['completed'] else 1                 

    cursor.execute("UPDATE tasks SET completed = ? WHERE id = ?", (completed_val, id))
    conn.commit()

    return completed_val
     

# Helper function for removing all data in the tasks db  
def db_clear_rows(): 
    cursor.execute("""DELETE from tasks""")
    conn.commit()


def db_get_rows():
    cursor.execute("SELECT * FROM tasks")
    rows = cursor.fetchall()
    tasks = [dict(row) for row in rows]
    return tasks


def db_restore_task():
    global last_deleted_row
    task = last_deleted_row

    cursor.execute("""
    INSERT INTO tasks (name, priority, date_added, time_added, date_due, time_due, completed)
    VALUES (?, ?, ?, ? ,?, ?, ?)
    """, (task['name'], task['priority'], task['date_added'], task['time_added'], 
        task['date_due'], task['time_due'], task['completed']))
    conn.commit()

    db_clear_deleted_task()
    print(f"Task {task['name']} has been restored!")


# May be weird why we have a function that deletes
# something. Why not just do it directly? Well,
# it's just for the separation of concern of the 
# db (which handles the data) and the server (which
# handles HTTP requests requested from client)
def db_clear_deleted_task(): 
    last_deleted_row = dict()


# Server  
app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")


@app.route('/get-tasks')
def get_tasks():
    return jsonify(db_get_rows())


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

@app.route('/edit-task', methods=['post'])
def edit_task():
    id = request.form.get("id")
    name = request.form.get("name")
    priority = request.form.get("priority")
    date_due = request.form.get("date-due")
    time_due = request.form.get("time-due")

    db_edit_task(id, name, priority, date_due, time_due)
    return redirect("/")


@app.route('/delete-task', methods=['post'])
def delete_task():
    id = request.form.get("id")
    name = request.form.get("name")
    
    db_del_task(id, name)
    return redirect("/")


@app.route('/update-checkbox', methods=['post'])
def update_checkbox():
    id = request.json['id']
    completed_val = db_toggle_completed(id)
    data = { 'completed' : completed_val }
    return jsonify(data)

@app.route('/show-toast')
def show_toast():
    return jsonify(last_deleted_row)


@app.route('/restore-task', methods=['post'])
def restore_task():
    db_restore_task()
    return redirect("/")


@app.route('/clear-last-deleted-row')
def clear_deleted_task():
    db_clear_deleted_task()
    return ""


if __name__ == "__main__":
    app.run(debug=True)



