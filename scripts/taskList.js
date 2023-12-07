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
    frmAddcard.addEventListener("submit", (e) => {
        e.preventDefault();
        var cardID = cardsContainer.querySelectorAll("h3").length + 1
        let newCard = createCard(inpCardName.value, cardID + "L" + id, cardsContainer)
        addCArdToDatabase(newCard, id)
        inpCardName.value = null
        showAddOrHideelemnt(btnAddCardShowForm, frmAddcard)
    })


}

// create new card function

function createCard(name, id, container) {
    const divcondrop = document.createElement("div")
    const divcon = document.createElement("div")
    const card = document.createElement("h3")
    const del = document.createElement("div")
    card.innerText = name
    card.id = id
    divcondrop.id = "Bcon" + id
    divcon.id = "con" + id

    divcon.draggable = true
    divcondrop.addEventListener("drop", (event) => dropCard(event))
    divcondrop.addEventListener("dragover", (event) => allowDrop(event))
    divcon.addEventListener("dragstart", (event) => drag(event))

    del.innerHTML = "<i class='fa-regular fa-circle-xmark'></i>"
    del.addEventListener("click", () => { deleteCArd(divcon, id) })

    divcondrop.appendChild(divcon)
    divcon.appendChild(card)
    divcon.appendChild(del)
    container.appendChild(divcondrop)

    return card
}
function deleteCArd(contanier, cardID) {
    contanier.parentNode.removeChild(contanier)
    deleteCardDB(cardID)
}

// database handel for card
function deleteCardDB(cardID) {
    let listID = cardID.split("L")[1]
    axios.get(apiurl + `/${listID}`).
        then(res => {
            let newCArds = res.data.cards.filter(card => card.idcard !== cardID)
            console.log(newCArds)
            axios.put(apiurl + `/${listID}`, { cards: newCArds })
                .then(res => console.log(res))
                .catch(er => console.log(er))
        })
        .catch(er => console.log(er))

    console.log();
}


function addCArdToDatabase(card, id) {
    const card1 = {
        cardName: card.innerText,
        idcard: card.id
    }

    axios.get(apiurl + `/${id}`)
        .then(
            res => {
                let newCards = [...res.data.cards, card1]

                axios.put(apiurl + `/${id}`, { cards: newCards })
                    .then(res => { console.log(res); }
                    ).catch(err => { console.log(err); })

            }
        ).catch(err => { console.log(err); })

}



// drag and drop functions 
function allowDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation()

}

function drag(ev) {
    ev.stopPropagation()
    ev.dataTransfer.setData("text", ev.target.id);
}


function dropCard(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    var data = ev.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);

    var dropTarget = ev.target;
    // console.log("do");
    if (data.includes("Lis")) {
        console.log("append");
        return;
    }
    while (!dropTarget.id.includes("con") && !dropTarget.id.includes("B")) {

        dropTarget = dropTarget.parentNode

    }
    if (dropTarget.id.includes("con")) {

        let [numericId1, numericId2] = swapElements(draggedElement, dropTarget);
        swapCArdsInDB(numericId1, numericId2)
    }
}

function drop(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    var data = ev.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    var dropTarget = ev.target;


    if (data.includes("con")) {

        return;
    }
    while (!dropTarget.id.includes("ListCards")) {
        dropTarget = dropTarget.parentNode
    }


    if (dropTarget.id.includes("ListCards")) {


        let [numericId1, numericId2] = swapElements(draggedElement, dropTarget);
        swapElementsInDB(numericId1, numericId2)

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


    return [id1, id2]
}

function swapElementsInDB(numericId1, numericId2) {
    numericId1 = parseInt(numericId1.replace("ListContainer", ""));
    numericId2 = parseInt(numericId2.replace("ListContainer", ""));

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
        .catch(er => console.log(er))
}




function swapCArdsInDB(numericId1, numericId2) {
    const el1ID = numericId1.replace("Bcon", '');
    const el2ID = numericId2.replace("Bcon", '');

    const L1ID = el1ID.split("L")[1]
    const L2ID = el2ID.split("L")[1]

    if (L2ID === L1ID) {
        axios.get(apiurl + `/${L2ID}`)
            .then(res => {
                let arr = res.data.cards
                const index1 = arr.findIndex(l1 => l1.idcard === el1ID);
                const index2 = arr.findIndex(l1 => l1.idcard === el2ID);
                [arr[index1], arr[index2]] = [arr[index2], arr[index1]];

                axios.put(apiurl + `/${L2ID}`, { cards: [...arr] })
                    .then(res => console.log(res.data.cards))
                    .catch(er => console.log(er))

            })
            .catch(er => console.log(er))
    }
    else {
        axios.get(apiurl + `/${L1ID}`)
            .then(res1 => {


                let arr1 = res1.data.cards
                console.log("arr1");
                console.log(arr1);
                // let index1 = arr1.findIndex(l1 => l1.idcard === el1ID);
                let index1 = arr1.findIndex(l1 => {
                    return l1.idcard === el1ID;
                });
                let newArr1 = arr1.filter(l1 => l1.idcard !== el1ID);
                let cid1 = arr1[index1].idcard
                console.log("newArr1");
                console.log(newArr1);




                axios.get(apiurl + `/${L2ID}`)
                    .then(res2 => {
                        let arr2 = res2.data.cards

                        let index2 = arr2.findIndex(l1 => l1.idcard === el2ID);
                        let newArr2 = arr2.filter(l1 => l1.idcard !== el2ID);





                        //   replace ids
                        let cid2 = arr2[index2].idcard
                        arr1[index1].idcard = cid2
                        arr2[index2].idcard = cid1



                        // update the DB
                        let newArray1 = []

                        if (index2 > 0) {

                            newArray1 = [...newArr2.slice(0, index2), arr1[index1], ...newArr2.slice(index2, newArr2.length)];
                        }
                        else {
                            newArray1 = [...newArr2, arr1[index1]];

                        }



                        axios.put(apiurl + `/${L2ID}`, { cards: newArray1 })
                            .then(res2 => console.log(res2.data))
                            .catch(er => console.log(er))

                        let newArray2 = []
                        if (index1 > 0) {

                            newArray2 = [...newArr1.slice(0, index1), arr2[index2], ...newArr1.slice(index1, newArr1.length)];
                        }
                        else {
                            newArray2 = [...newArr1, arr2[index2]];

                        }




                        axios.put(apiurl + `/${L1ID}`, { cards: newArray2 })
                            .then(res => console.log(res.data))
                            .catch(er => console.log(er))

                        let d1 = document.getElementById(numericId1)
                        d1.id = "Bcon" + cid2
                        let d2 = document.getElementById(numericId2)
                        d2.id = "Bcon" + cid1


                        let d3 = document.getElementById(numericId1.replace("B", ""))
                        d3.id = "con" + cid2


                        let d4 = document.getElementById(numericId2.replace("B", ""))
                        d4.id = "con" + cid1

                        document.getElementById(cid2).id = cid1
                        document.getElementById(cid1).id = cid2

                    })
                    .catch(er => console.log(er))





            })
            .catch(er => console.log(er))




    }
}



