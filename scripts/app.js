// api
const apiurl = "/api/tasks"

// generate lists from exist data 

axios.get(apiurl).
    then(res => {
        console.log(res);
        res.data.map(list => {
            buildList(list.listName)
        })
    })

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


// form
const frmAddList = document.getElementById("frmAddList")



// event lisners
btnAddList.addEventListener("click", showAddList);
btnHideAddList.addEventListener("click", hideAddList);
frmAddList.addEventListener("submit", (e) => {
    e.preventDefault()
    createList(txtListName.value)
});


// functions
function showAddList() {
    divAddList.classList.remove("hidden")
    btnAddList.classList.add("hidden")
}

function hideAddList() {
    divAddList.classList.add("hidden")
    btnAddList.classList.remove("hidden")
    txtListName.value = null
}


function createList(lname) {
    var newDiv = document.createElement("div");
    newDiv.innerHTML = divdummy.innerHTML;
    const newList = {
        listName: lname

    }
    axios.post(apiurl, newList)
        .then(res => {
            console.log(res);
            newDiv.getElementsByClassName("ListName")[0].innerHTML = lname
            newDiv.classList.remove("hidden");
            newDiv.classList.add("cardCoontainer");
            frmAddList.parentNode.parentNode.insertBefore(newDiv, frmAddList.parentNode);
            hideAddList()

        })
        .catch(error => {
            console.log(error);
        })



}



function buildList(lname) {
    var newDiv = document.createElement("div");
    newDiv.innerHTML = divdummy.innerHTML;
    newDiv.getElementsByClassName("ListName")[0].innerHTML = lname
    newDiv.classList.remove("hidden");
    newDiv.classList.add("cardCoontainer");
    frmAddList.parentNode.parentNode.insertBefore(newDiv, frmAddList.parentNode);



}

