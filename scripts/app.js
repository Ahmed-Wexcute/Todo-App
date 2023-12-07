const divAddList = document.getElementById("IdAddListCon")
const btnAddList = document.getElementById("btnShowAddList")
btnAddList.addEventListener("click", showAddList);
function showAddList() {
    divAddList.classList.remove("hidden")
    btnAddList.classList.add("hidden")
}