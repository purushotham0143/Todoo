let taskContainer = document.querySelector("#container");
let taskList = document.querySelector("#taskList");
let taskName = document.querySelector("#taskName");
let add = document.querySelector("#add");

let taskArray = [];



add.addEventListener("click", () => {
  if (taskName.value == "") {
    alert("Please Enter something");
  } else {
    let obj = {};
    obj.name = taskName.value;
    obj.id = new Date().toLocaleTimeString();
    obj.status = "Pending";
    taskArray.push(obj);
    addDom(obj);
    setLocalStorage();
    taskName.value = "";
    taskCount();
    console.log("Task added:", taskArray);
  }
});

function addDom(taskObj) {
  let taskDiv = document.createElement("div");
  let taskText = document.createElement("span");
  let chk = document.createElement("input");
  let del = document.createElement("button");
  let edit = document.createElement("button");

  taskDiv.setAttribute("id", taskObj.id);
  chk.setAttribute("type", "checkbox");
  chk.setAttribute("id", "chk");
  taskText.textContent = taskObj.name;
  taskText.setAttribute("id", "task");
  del.textContent = "DEL";
  del.setAttribute("id", "Del");
  edit.textContent = "EDIT";
  edit.setAttribute("id", "Edit");

  taskDiv.appendChild(taskText);
  taskDiv.appendChild(chk);
  taskDiv.appendChild(del);
  taskDiv.appendChild(edit);

  if (taskObj.status === "Completed") {
    chk.checked = true;
    taskText.style.textDecoration = "line-through";
    taskList.appendChild(taskDiv);
  } else {
    taskText.style.textDecoration = "none";
    taskList.insertBefore(taskDiv, taskList.firstChild);
  }

  chk.addEventListener("change", () => {
    taskArray.forEach((item) => {
      if (taskDiv.getAttribute("id") == item.id) {
        item.status = chk.checked ? "Completed" : "Pending";
      }
    });
    taskText.style.textDecoration = chk.checked ? "line-through" : "none";
    taskList.removeChild(taskDiv);
    addDom(taskObj);
    setLocalStorage();
    taskCount();
    console.log("TaskArray updated:", taskArray);
  });

  del.addEventListener("click", () => {
    if (confirm(`are you sure you want to delete the task`)) {
      taskDiv.remove();
      taskArray = taskArray.filter(
        (item) => item.id != taskDiv.getAttribute("id")
      );
      console.log("TaskArray after delete:", taskArray);
      taskCount();
      setLocalStorage();
    }
  });

  edit.addEventListener("click", () => {
    taskArray.forEach((item) => {
      if (taskDiv.getAttribute("id") == item.id) {
        let newName = prompt("Enter the new updated task", item.name);
        if (newName) {
          item.name = newName;
          taskText.textContent = newName;
          setLocalStorage();
        }
      }
    });
  });
}

function search(query) {
  taskList.innerHTML = "";
  taskArray
    .filter((task) => task.name.toLowerCase().includes(query.toLowerCase()))
    .forEach((task) => addDom(task));
}
document.querySelector("#searchInput").addEventListener("input", (e) => {
  search(e.target.value);
});

function taskCount() {
  let count = 0;
  document.querySelector("#empty").style.color = "red";
  taskArray.forEach((item) => {
    if (item.status == "Pending") {
      count++;
    }
  });
  if (taskArray.length == 0) {
    taskContainer.style.display = "none";
    document.querySelector("#empty").textContent = `Your TO DO list is empty`;
  } else {
    document.querySelector(
      "#empty"
    ).textContent = `No of pending tasks are ${count}`;
    taskContainer.style.display = "block";
  }
}

function setLocalStorage() {
  localStorage.setItem("localtask", JSON.stringify(taskArray));
}

function getLocalStorage() {
  if (localStorage.getItem("localtask") != null) {
    taskArray = JSON.parse(localStorage.getItem("localtask"));
    taskArray.forEach((element) => {
      addDom(element);
    });
  }
  taskCount();
}

getLocalStorage();


let clearAllButton = document.createElement("button");
clearAllButton.setAttribute('id','clr');
clearAllButton.textContent = "Clear All";
clearAllButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    taskArray = [];
    taskList.innerHTML = "";
    setLocalStorage();
    taskCount();
  }
});
document.querySelector("#container").appendChild(clearAllButton);
