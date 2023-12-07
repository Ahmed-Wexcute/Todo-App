// api
const apiurl = "/api/tasks"

// generate lists from exist data 

axios.get(apiurl).
    then(res => {
        console.log(res);

        res.data.map(list => {
            buildList(list.listName, list.id, list.cards)
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
btnAddList.addEventListener("click", () => showAddOrHideelemnt(divAddList, btnAddList));
btnHideAddList.addEventListener("click", () => showAddOrHideelemnt(btnAddList, divAddList));
frmAddList.addEventListener("submit", (e) => {
    e.preventDefault()
    createList(txtListName.value)
    txtListName.value = null

});



// functions

// show adding new list form
function showAddOrHideelemnt(show, hide) {
    show.classList.remove("hidden")
    hide.classList.add("hidden")
}




// delete the hole list
function deleteList(element) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to delete this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            const numericId1 = parseInt(element.id.replace("ListCards", ""));
            // console.log(numericId1);
            element.parentNode.parentNode.removeChild(element.parentNode);
            Swal.fire('Deleted!', 'Your list has been deleted.', 'success');
            axios.delete(apiurl + `/${numericId1}`
            ).then(res => { console.log(res) })
        }
    });
}


// create new list from the form

function createList(lname) {

    const newList = {
        listName: lname

    }
    axios.post(apiurl, newList)
        .then(res => {
            buildList(lname, res.data.id)
            hideAddList()

        })
        .catch(error => {
            console.log(error);
        })
}



//  build the lists from exist data 
function buildList(lname, id, cards = []) {
    var newDiv = document.createElement("div");
    newDiv.id = "ListContainer" + id
    newDiv.innerHTML = divdummy.innerHTML;
    newDiv.getElementsByClassName("ListName")[0].innerHTML = lname
    newDiv.classList.remove("hidden");
    let listdiv = newDiv.querySelectorAll("div")[0]
    listdiv.id = "ListCards" + id
    frmAddList.parentNode.parentNode.insertBefore(newDiv, frmAddList.parentNode);
    // const del = document.getElementById("DeleteAction")
    let del = newDiv.querySelector("#DeleteAction");

    del.id = del.id + id
    del.addEventListener("click", () => deleteList(listdiv))

    // allow drag and drop 
    newDiv.addEventListener("drop", (event) => drop(event))
    newDiv.addEventListener("dragover", (event) => allowDrop(event))
    listdiv.addEventListener("dragstart", (event) => drag(event))


    // build cards 
    let cardsContainer = newDiv.querySelector("#cardsContainer");
    cardsContainer.id = cardsContainer.id + id

    // loop to create cards
    cards.map(ca => {
        createCard(ca.cardName, ca.idcard, cardsContainer)

    })

    // add card functionality
    const btnAddCardShowForm = newDiv.querySelector("#btnAddCardShowForm")
    btnAddCardShowForm.id = btnAddCardShowForm.id + id

    // find form to add card
    const frmAddcard = newDiv.querySelector("#frmAddcard")
    frmAddcard.id = frmAddcard.id + id

    // find btn to hide form
    const btnHideAddCardfrm = newDiv.querySelector("#btnHideAddCardfrm")
    btnHideAddCardfrm.id = btnHideAddCardfrm.id + id


    // show from when btn clicked or hide 
    btnAddCardShowForm.addEventListener("click", () => showAddOrHideelemnt(frmAddcard, btnAddCardShowForm))
    btnHideAddCardfrm.addEventListener("click", () => showAddOrHideelemnt(btnAddCardShowForm, frmAddcard))

    // find input card name
    const inpCardName = newDiv.querySelector("#inpCardName")
    inpCardName.id = inpCardName.id + id


    // submit from 
    var cardID = cardsContainer.querySelectorAll("h3").length + 1
    console.log(cardID);
    frmAddcard.addEventListener("submit", (e) => {
        e.preventDefault();
        let newCard = createCard(inpCardName.value, cardID + "L" + id, cardsContainer)
        addCArdToDatabase(newCard, id, cards)
        inpCardName.value = null
        showAddOrHideelemnt(btnAddCardShowForm, frmAddcard)
    })


}

// create new card function

function createCard(name, id, container) {
    const divcon = document.createElement("div")
    const card = document.createElement("h3")
    const del = document.createElement("div")
    del.innerHTML = "<i class='fa-regular fa-circle-xmark'></i>"
    card.innerText = name
    card.id = id
    divcon.appendChild(card)
    divcon.appendChild(del)
    container.appendChild(divcon)

    del.addEventListener("click",()=>{deleteCArd(divcon,id)})
    return card
}
function deleteCArd(contanier,cardID) {
    contanier.parentNode.removeChild(contanier)
    deleteCardDB(cardID)
}

// database handel for card
function deleteCardDB(cardID) {
   let listID =cardID.split("L")[1]
    axios.get(apiurl+`/${listID}`).
    then(res=>{
        let newCArds = res.data.cards.filter(card=> card.idcard !== cardID)
        console.log(newCArds)
        axios.put(apiurl+`/${listID}`,{cards:newCArds})
        .then(res=>console.log(res))
        .catch(er=>console.log(er))
    })
    .catch(er=>console.log(er))

console.log();
}


function addCArdToDatabase(card, id, arr) {
    const card1 = {
        cardName: card.innerText,
        idcard: card.id
    }
    let newCards = [...arr, card1]
    axios.put(apiurl + `/${id}`, { cards: newCards })
        .then(res => { console.log(res); }
        ).catch(err => { console.log(err); })
}



// drag and drop functions 
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    var dropTarget = ev.target;
    while (!dropTarget.id.includes("ListCards")) {
        dropTarget = dropTarget.parentNode
    }


    if (dropTarget.id.includes("ListCards")) {


        swapElements(draggedElement, dropTarget);
    }
}

function swapElements(element1, element2) {
    var parent1 = element1.parentNode;
    var parent2 = element2.parentNode;
    var id1 = parent1.id
    var id2 = parent2.id
    parent1.id = id2
    parent2.id = id1

    parent1.append(element2)
    parent2.append(element1)

    const numericId1 = parseInt(id1.replace("ListContainer", ""));
    const numericId2 = parseInt(id2.replace("ListContainer", ""));
    axios.get(apiurl)
        .then(res => {
            let arr = res.data

            const index1 = arr.findIndex(l1 => l1.id === numericId1);
            const index2 = arr.findIndex(l1 => l1.id === numericId2);
            [arr[index1], arr[index2]] = [arr[index2], arr[index1]];

            axios.put(apiurl, arr)
                .then(res => console.log(res))
                .catch(er => console.log(er))

        })



}




