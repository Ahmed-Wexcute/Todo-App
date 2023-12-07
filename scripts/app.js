// sections
const secTasksLists = document.getElementById("tasksLists")


// divs
const divAddList = document.getElementById("IdAddListCon")
const divdummy = document.getElementById("dummy")


// btns
const btnAddList = document.getElementById("btnShowAddList")
const btnCreateList = document.getElementById("btnCreateList")
const btnHideAddList = document.getElementById("btnHideAddList")

// txt
const txtListName = document.getElementById("txtListName")



// event lisners
btnAddList.addEventListener("click", showAddList);
btnHideAddList.addEventListener("click", hideAddList);
btnCreateList.addEventListener("click", createList);


// functions
function showAddList() {
    divAddList.classList.remove("hidden")
    btnAddList.classList.add("hidden")
}

function hideAddList() {
    divAddList.classList.add("hidden")
    btnAddList.classList.remove("hidden")
}
function createList() {
    var newDiv = document.createElement("div");
    newDiv.innerHTML = divdummy.innerHTML;


    newDiv.classList.remove("hidden");
    newDiv.classList.add("cardCoontainer");
    
    divAddList.parentNode.parentNode.insertBefore(newDiv,divAddList.parentNode);

}
