const firebaseConfig = {
  apiKey: "AIzaSyBiWsonOZd8AqVMMAtccfn6VHGZffS0qkI",
  authDomain: "to-do-list-3303a.firebaseapp.com",
  projectId: "to-do-list-3303a",
  storageBucket: "to-do-list-3303a.firebasestorage.app",
  messagingSenderId: "141852903889",
  appId: "1:141852903889:web:92250a0dd4a5462e2238f0",
  measurementId: "G-EW81HT12Y4"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const messaging = firebase.messaging();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("firebase-messaging-sw.js")
  .then((registration) => {
    console.log("Service Worker registered:", registration.scope);

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
        getFCMToken(registration);   // 👈 always pass registration
      } else {
        console.log("Notification permission denied.");
      }
    });
  })
  .catch((err) => console.error("Service Worker registration failed:", err));
};

let userFcmToken = null;

function getFCMToken(registration) {
  messaging.getToken({
    vapidKey: "BGQso8T14sVHpWsLJnI-FYsvrLqXyO-cZMnqakI6uNS0d9gVUo_Kkmvve8YrqheKNHQdThb1PrY-Tg45-0ZG0qk",
    serviceWorkerRegistration: registration 
  })
  .then((token) => {
    if (token) {
      console.log("FCM Token:", token);
      userFcmToken = token;
    }
  })
  .catch((err) => console.error("Error getting token:", err));
}
function notifyBackend(token, title, body) {
  fetch("https://todo-list-backend-7kcp.onrender.com/send-notification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, title, body })
  })
  .then(res => res.json())
  .then(data => console.log("Notification sent:", data))
  .catch(err => console.error("Error sending notification:", err));
}
messaging.onMessage((payload) => {
  console.log("Foreground message received:", payload);
}); 
enterTask = document.getElementById("entertask")
const addBtn = document.getElementById("add-btn")
const taskList = document.getElementById("task-list")
const inputError = document.getElementById("inputerror")
const tsList = document.getElementById("tslist")
const clearList = document.getElementById("clearList")
const del = document.getElementById("del")
const uncomTask = document.getElementById("uncomTask")
const comTask = document.getElementById("comTask")
const numTask= document.getElementById("numTask")
function updateCounters() {
    const allTasks = taskList.querySelectorAll(".action-btn");
    const completedTasks = taskList.querySelectorAll(".action-btn.completed");
    numTask.innerText = allTasks.length;
    comTask.innerText = completedTasks.length;
    uncomTask.innerText = allTasks.length - completedTasks.length;
}
function saveTasks() {
    const tasks = [];
  document.querySelectorAll("#task-list .action-btn").forEach((div) => {
    const li = div.querySelector("li");
    const due = li.getAttribute("data-due");
    const reminder = li.getAttribute("data-reminder");
    tasks.push({
      text: li.firstChild.textContent.trim(),
      completed: div.classList.contains("completed"),
      dueTime: due ? new Date(due).toISOString() : null,
        reminderTime: reminder ? new Date(reminder).toISOString() : null
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    storedTasks.forEach((task) => {
        createTask(
            task.text,
            task.completed,
            task.dueTime ? new Date(task.dueTime) : null,
            task.reminderTime ? new Date(task.reminderTime) : null
        );
    });
}
function createTask(text, completed = false, dueTime = null, reminderTime = null) {
    const list = document.createElement("li");
    list.role = "listitem"
    const delBtn = document.createElement("button");
    const doneBtn = document.createElement("button");
    const editBtn = document.createElement("button");
    const actionButtons = document.createElement("div");
    const anotherDiv = document.createElement("div");
    const dueCountdown = document.createElement("span");
    const reminderCountdown = document.createElement("span");
    list.innerText = text;
    doneBtn.innerText = "✓";
    delBtn.innerText = "X";
    editBtn.innerText = "Edit";
    anotherDiv.classList.add("another-div");
    actionButtons.classList.add("action-btn");
    list.classList.add("cut");
    delBtn.classList.add("del-btn");
    editBtn.classList.add("edit-btn");
    doneBtn.classList.add("done-btn");
    if (dueTime instanceof Date && !isNaN(dueTime)) {
        list.setAttribute("data-due", dueTime.toISOString());
        list.appendChild(document.createElement("br"));
        list.appendChild(dueCountdown);
        startCountdown(dueTime, dueCountdown, "Due in", editBtn, text);
    }
    if (reminderTime instanceof Date && !isNaN(reminderTime)) {
        list.setAttribute("data-reminder", reminderTime.toISOString());
        list.appendChild(document.createElement("br"));
        list.appendChild(reminderCountdown);
        startCountdown(reminderTime, reminderCountdown, "Reminder in", null, text);
    }
    taskList.appendChild(actionButtons);
    actionButtons.appendChild(list);
    actionButtons.appendChild(anotherDiv);
    anotherDiv.appendChild(editBtn);
    anotherDiv.appendChild(doneBtn);
    anotherDiv.appendChild(delBtn);
    if (completed) {
        actionButtons.classList.add("completed");
        anotherDiv.removeChild(editBtn);
        const success = document.createElement("span");
        success.innerText = "Congratulations";
        success.style.color = "#00c851";
        anotherDiv.replaceChild(success, doneBtn);
    }
    updateCounters();
    saveTasks();
    delBtn.addEventListener("click", function(){
        taskList.removeChild(actionButtons);
        updateCounters();
        saveTasks();
    });
    editBtn.addEventListener("click", function(){
        if (editBtn.innerHTML === "Edit") {
            const input = document.createElement("input");
            input.classList.add("edit-input");
            input.type = "text";
            input.value = list.firstChild.textContent.trim();
            list.replaceChild(input, list.firstChild);
            editBtn.innerText = "Save";
            input.focus();
        } else {
            const input = list.querySelector("input");
            const newText = input.value.trim();
            if(newText !== "") {
                const newTextNode = document.createTextNode(newText);
                list.replaceChild(newTextNode, input);
            }
            editBtn.innerText = "Edit";
            saveTasks(); 
        }
        if (dueTime instanceof Date && !isNaN(dueTime)) {
    list.appendChild(document.createElement("br"));
    list.appendChild(dueCountdown);
    startCountdown(dueTime, dueCountdown, "Due in", editBtn);
}
if (reminderTime instanceof Date && !isNaN(reminderTime)) { 
    list.appendChild(document.createElement("br"));
    list.appendChild(reminderCountdown);
    startCountdown(reminderTime, reminderCountdown, "Reminder in", null);
}
    });
    doneBtn.addEventListener("click", function(){
        if (list.querySelector("input")) return; 
        actionButtons.classList.add("completed");
        anotherDiv.removeChild(editBtn);
        const success = document.createElement("span");
        success.innerText = "Congratulations";
        success.style.color = "#00c851";
        anotherDiv.replaceChild(success, doneBtn);
        updateCounters();
        saveTasks();
    });
}
const radio = document.getElementById("radio")
const dueInput = document.getElementById("taskDueTime");
const reminderInput = document.getElementById("reminderTime");
const dueTimeParts = dueInput.value.split("T");
const reminderTimeParts = reminderInput.value.split("T");
radio.addEventListener("change", ()=> {
        reminderInput.disabled = !radio.checked;
})
dueInput.addEventListener("change", () => {
  reminderInput.max = dueInput.value;
});
const dueTime = new Date(dueTimeParts[0] + " " + dueTimeParts[1]);
const reminderTime = new Date(reminderTimeParts[0] + " " + reminderTimeParts[1]);
const nowStr = new Date().toISOString().slice(0,16);
dueInput.min = nowStr;
reminderInput.min = nowStr;
dueInput.addEventListener("input", () => {
    reminderInput.max = dueInput.value;
});
addBtn.addEventListener("click", function(){
    if (enterTask.value === ""){
        inputError.innerHTML = "Kindly enter a to-do action";
        inputError.classList.add("inner-error");
        return;
    }
    const dueVal = dueInput.value;
    const reminderVal = reminderInput.value;
    if (!dueVal) {
        inputError.innerHTML = "Please select both due date/time";
        inputError.classList.add("inner-error");
        return;
    }
    const dueTime = new Date(dueVal);
    const reminderTime = new Date(reminderVal);
    const now = new Date();
    if (dueTime < now) {
        inputError.innerText = "Date/time cannot be in the past!";
        inputError.classList.add("inner-error");
        return;
    }
    if (radio.checked) {
        if (!reminderVal) {
            inputError.innerHTML = "Please select a reminder date and time";
            inputError.classList.add("inner-error");
            return;
        }
        const reminderTime = new Date(reminderVal);
        if (reminderTime < now) {
            inputError.innerText = "Reminder cannot be in the past!";
            inputError.classList.add("inner-error");
            return;
        }
        if (reminderTime >= dueTime) {
            inputError.innerHTML = "Reminder cannot be after the task's due date and time!";
            inputError.classList.add("inner-error");
            return;
        }
    }
    createTask(enterTask.value, false, dueTime, reminderTime);
    enterTask.value = "";
    inputError.innerHTML = ""
});
clearList.addEventListener("click", function() {
    if (taskList.children.length === 0){
        return;
    }
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    const confirmBox = document.createElement("div");
    confirmBox.classList.add("confirm");
    const message = document.createElement("h5");
    const cancel = document.createElement("button");
    const confirmed = document.createElement("button");
    cancel.classList.add("cancel")
    confirmed.classList.add("yes")
    message.innerText = "Are you sure you want to clear the list?";
    cancel.innerText = "Cancel";
    confirmed.innerText = "Confirm";
    confirmBox.appendChild(message);
    confirmBox.appendChild(cancel);
    confirmBox.appendChild(confirmed);
    overlay.appendChild(confirmBox);
    document.body.appendChild(overlay);
    const btnRect = clearList.getBoundingClientRect();
    confirmBox.style.top = (btnRect.top - 60) + "px"; 
    confirmBox.style.left = btnRect.left + "px";
    cancel.addEventListener("click", function() {
        document.body.removeChild(overlay);
    });
    confirmed.addEventListener("click", function() {
        taskList.innerHTML = "";
        document.body.removeChild(overlay);
        comTask.innerText =0
        uncomTask.innerText = 0
        numTask.innerText = 0 
        saveTasks();
    });
});
enterTask.addEventListener("input", function(){
    inputError.innerHTML = ""
})
loadTasks();
updateCounters();
const myMarquee = document.getElementById("myMarquee")
myMarquee.addEventListener("mouseover", function(){
    myMarquee.stop()
})
myMarquee.addEventListener("mouseout", function(){
    myMarquee.start()
})
enterTask.addEventListener("keydown", function(event) {
    if (event.key === "Enter") { 
        event.preventDefault();
        addBtn.click(); 
    }
});
function updateClock() {
      const now = new Date();
      const options = { 
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      document.getElementById("clock").innerText = now.toLocaleString("en-US", options);
}
updateClock();
setInterval(updateClock, 1000);

function startCountdown(targetDate, displayElement, label, editBtn) {
    let notificationSent = false; // ⬅️ ensures notification is sent only once

    const intervalId = setInterval(update, 1000);

    function update() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            if (label === "Reminder in") {
                displayElement.innerText = "Reminder time!";

                if (!notificationSent && userFcmToken) {
                    notifyBackend(
                        userFcmToken,
                        "Task Reminder",
                        "Reminder for your task: " + displayElement.parentElement.firstChild.textContent.trim()
                    );
                    notificationSent = true; // mark as sent
                }
            } else if (label === "Due in") {
                displayElement.innerText = "Task expired!";
                if (editBtn) {
                    editBtn.disabled = true;
                    editBtn.style.opacity = "0.5";
                    editBtn.style.cursor = "not-allowed";
                }
            }

            clearInterval(intervalId); // stop the countdown loop
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        displayElement.innerText = `${label}: ${hours}h ${minutes}m ${seconds}s`;
    }

    update(); // initial call
}
