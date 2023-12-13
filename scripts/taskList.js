// api
const apiurl = "/api/tasks"
const toDo_list = document.getElementById("to-do")
const doing_list = document.getElementById("doing")
const done_list = document.getElementById("done")

// console.log(done_list);
// createCard("card.cardName", "card.time", done_list)

// generate lists from exist data 
axios.get(apiurl).
    then(res => {
        console.log(res);
        let parent = toDo_list
        res.data.map((list, i) => {
            // console.log(i);
            // console.log(list);

            if (i == 1) {
                parent = doing_list

            } else if (i == 2) {
                parent = done_list

            }
            list.cards.map(card => {

                createCard(card.cardName, card.time, parent)
            })

        })
    })


const cards = document.querySelectorAll(".cards-container")
cards.forEach(card => {
    card.addEventListener("drop", (event) => dropCard(event))
    card.addEventListener("dragover", (event) => allowDrop(event))
})

const deletes = document.querySelectorAll(".fa-xmark")
deletes.forEach(sy => {
    sy.addEventListener("click", (e) => {
        deleteCArd(e)
        console.log("de");
    })

})
// sections
// const secTasksLists = document.getElementById("tasksLists")


// // divs
// const divAddList = document.getElementById("IdAddListCon")
// const divdummy = document.getElementById("dummy")


// // btns
// const btnAddList = document.getElementById("btnShowAddList")
// const btnCreateList = document.getElementById("btnCreateList")
// const btnHideAddList = document.getElementById("btnHideAddList")

// // txt
const txtListName = document.getElementById("task-input-value")
const time = document.getElementById("time-input")


// // form
const frm_card = document.getElementById("task-form")



// event lisners
frm_card.addEventListener("submit", (e) => {
    e.preventDefault()
    addCArdToDatabase(txtListName.value, time.value)
    createCard(txtListName.value, time.value)
    txtListName.value = null
    time.value = null

});
// btnAddList.addEventListener("click", () => showAddOrHideelemnt(divAddList, btnAddList));
// btnHideAddList.addEventListener("click", () => showAddOrHideelemnt(btnAddList, divAddList));



// functions

// show adding new list form
// function showAddOrHideelemnt(show, hide) {
//     show.classList.remove("hidden")
//     hide.classList.add("hidden")
// }




// delete the hole list


// function deleteList(element) {
//     Swal.fire({
//         title: 'Are you sure?',
//         text: 'You won\'t be able to delete this!',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, delete it!'
//     }).then((result) => {
//         if (result.isConfirmed) {
//             const numericId1 = parseInt(element.id.replace("ListCards", ""));
//             // console.log(numericId1);
//             element.parentNode.parentNode.removeChild(element.parentNode);
//             Swal.fire('Deleted!', 'Your list has been deleted.', 'success');
//             axios.delete(apiurl + `/${numericId1}`
//             ).then(res => { console.log(res) })
//         }
//     });
// }


// create new list from the form

// function createList(lname) {

//     const newList = {
//         listName: lname

//     }
//     axios.post(apiurl, newList)
//         .then(res => {
//             buildList(lname, res.data.id)
//             hideAddList()

//         })
//         .catch(error => {
//             console.log(error);
//         })
// }



//  build the lists from exist data 
// function buildList(lname, id, cards = []) {
//     var newDiv = document.createElement("div");
//     newDiv.id = "ListContainer" + id
//     newDiv.innerHTML = divdummy.innerHTML;
//     newDiv.getElementsByClassName("ListName")[0].innerHTML = lname
//     newDiv.classList.remove("hidden");
//     let listdiv = newDiv.querySelectorAll("div")[0]
//     listdiv.id = "ListCards" + id
//     frmAddList.parentNode.parentNode.insertBefore(newDiv, frmAddList.parentNode);
//     // const del = document.getElementById("DeleteAction")
//     let del = newDiv.querySelector("#DeleteAction");

//     del.id = del.id + id
//     del.addEventListener("click", () => deleteList(listdiv))

//     // allow drag and drop 
//     newDiv.addEventListener("drop", (event) => drop(event))
//     newDiv.addEventListener("dragover", (event) => allowDrop(event))
//     listdiv.addEventListener("dragstart", (event) => drag(event))


//     // build cards 
//     let cardsContainer = newDiv.querySelector("#cardsContainer");
//     cardsContainer.id = cardsContainer.id + id

//     // loop to create cards
//     cards.map(ca => {
//         createCard(ca.cardName, ca.idcard, cardsContainer)

//     })

//     // add card functionality
//     const btnAddCardShowForm = newDiv.querySelector("#btnAddCardShowForm")
//     btnAddCardShowForm.id = btnAddCardShowForm.id + id

//     // find form to add card
//     const frmAddcard = newDiv.querySelector("#frmAddcard")
//     frmAddcard.id = frmAddcard.id + id

//     // find btn to hide form
//     const btnHideAddCardfrm = newDiv.querySelector("#btnHideAddCardfrm")
//     btnHideAddCardfrm.id = btnHideAddCardfrm.id + id


//     // show from when btn clicked or hide 
//     btnAddCardShowForm.addEventListener("click", () => showAddOrHideelemnt(frmAddcard, btnAddCardShowForm))
//     btnHideAddCardfrm.addEventListener("click", () => showAddOrHideelemnt(btnAddCardShowForm, frmAddcard))

//     // find input card name
//     const inpCardName = newDiv.querySelector("#inpCardName")
//     inpCardName.id = inpCardName.id + id


//     // submit from 
//     frmAddcard.addEventListener("submit", (e) => {
//         e.preventDefault();
//         var cardID = cardsContainer.querySelectorAll("h3").length + 1
//         let newCard = createCard(inpCardName.value, cardID + "L" + id, cardsContainer)
//         addCArdToDatabase(newCard, id)
//         inpCardName.value = null
//         showAddOrHideelemnt(btnAddCardShowForm, frmAddcard)
//     })


// }

// create new card function


function createCard(taskname, time, parent) {
    const cardDummy = document.getElementById("dummy-card")
    const newCard = document.createElement("div")
    let list = toDo_list
    if (parent != null) {
        list = parent
        // console.log(list);
    }
    const cardsContainer = list.querySelector(".cards-container")

    newCard.innerHTML = cardDummy.innerHTML
    newCard.draggable = true
    newCard.classList.add("card")
    newCard.classList.add("flx-bt")

    // cardsContainer.addEventListener("drop", (event) => dropCard(event))
    // cardsContainer.addEventListener("dragover", (event) => allowDrop(event))
    newCard.addEventListener("dragstart", (event) => drag(event))
    // console.log(parent);
    const taskName = newCard.querySelector(".task-name")
    taskName.innerText = taskname

    const timeValue = newCard.querySelector(".time-value")

    timeValue.innerText = time


    const deletesy = newCard.querySelector(".fa-xmark")
    deletesy.addEventListener("click", (e) => {
        deleteCArd(e)
    })
    const myArray = ["yellow", "blue", "burble"];

    const randomIndex = Math.floor(Math.random() * myArray.length);

    const randomItem = myArray[randomIndex];
    const cir = newCard.querySelector(".cirlce")
    cir.classList.add(randomItem)
    cardsContainer.appendChild(newCard)
    return newCard
}

function addCArdToDatabase(name, time) {
    const card1 = {
        cardName: name,
        time: time
    }

    axios.get(apiurl + `/1`)
        .then(
            res => {
                let newCards = [...res.data.cards, card1]

                axios.put(apiurl + `/1`, { cards: newCards })
                    .then(res => { console.log(res); }
                    ).catch(err => { console.log(err); })

            }
        ).catch(err => { console.log(err); })

}


function deleteCArd(e) {
    let parent = e.target.closest('.card');
    const name = parent.querySelector('.task-name').innerText;
    const time = parent.querySelector('.time-value').innerText;
    parent.parentNode.removeChild(parent)
    deleteCardDB(name, time)

}

// database handel for card
function deleteCardDB(name, time) {
    axios.get(apiurl).
        then(res => {
            let tasks = res.data;

            let newTasks = tasks.map(task => {
                task.cards = task.cards.filter(card => card.cardName !== name && card.time !== time);
                return task;
            });
            axios.put(apiurl, newTasks)
                .then(res => console.log(res))
                .catch(er => console.log(er))
        })
        .catch(er => console.log(er))

    console.log();
}





// drag and drop functions 
function allowDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation()

}

function drag(ev) {
    ev.stopPropagation()
    ev.target.id = "draged"
    ev.dataTransfer.setData("text", ev.target.id);
}


function dropCard(ev) {
    console.log("st");
    ev.preventDefault();
    ev.stopPropagation();
    console.log("e");

    var data = ev.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);

    var dropTarget = ev.target;
    console.log(data);

    if (!dropTarget.classList.contains("cards-container")) {
        dropTarget = dropTarget.closest(".cards-container");
    }

    // console.log(dropTarget);
    // console.log(draggedElement);
    dropTarget.appendChild(draggedElement)
    // moveCardToNewList()
    const cards1 = getcardsArr(toDo_list)
    const cards2 = getcardsArr(doing_list)
    const cards3 = getcardsArr(done_list)
    moveCardToNewList(cards1, cards2, cards3)
    draggedElement.id = ""
}

// function drop(ev) {
//     ev.preventDefault();
//     ev.stopPropagation();

//     var data = ev.dataTransfer.getData("text");
//     var draggedElement = document.getElementById(data);
//     var dropTarget = ev.target;


//     if (data.includes("con")) {

//         return;
//     }
//     while (!dropTarget.id.includes("ListCards")) {
//         dropTarget = dropTarget.parentNode
//     }


//     if (dropTarget.id.includes("ListCards")) {


//         let [numericId1, numericId2] = swapElements(draggedElement, dropTarget, "L");
//         swapElementsInDB(numericId1, numericId2)

//     }
// }

// function swapElements(element1, element2, typ1) {
//     var parent1 = element1.parentNode;
//     var parent2 = element2.parentNode;
//     var id1 = parent1.id
//     var id2 = parent2.id
//     parent1.id = id2
//     parent2.id = id1
//     console.log(element1);
//     console.log(element2);

//     console.log(typ1);
//     if (typ1 == "L") {

//         parent1.append(element2)
//         parent2.append(element1)
//         console.log("ch");
//     }
//     else {
//         parent2.parentNode.append(element1)
//         parent1.parentNode.removeChild(parent1)
//         console.log("rep");


//     }

//     return [id1, id2]
// }

// function swapElementsInDB(numericId1, numericId2) {
//     numericId1 = parseInt(numericId1.replace("ListContainer", ""));
//     numericId2 = parseInt(numericId2.replace("ListContainer", ""));

//     axios.get(apiurl)
//         .then(res => {
//             let arr = res.data

//             const index1 = arr.findIndex(l1 => l1.id === numericId1);
//             const index2 = arr.findIndex(l1 => l1.id === numericId2);
//             [arr[index1], arr[index2]] = [arr[index2], arr[index1]];

//             axios.put(apiurl, arr)
//                 .then(res => console.log(res))
//                 .catch(er => console.log(er))

//         })
//         .catch(er => console.log(er))
// }

function getcardsArr(parent) {
    let cardDivs = parent.querySelectorAll(".card");
    let newarr = []
    cardDivs.forEach(card => {
        const name = card.querySelector('.task-name').innerText;
        const time = card.querySelector('.time-value').innerText;
        const CardData = {
            cardName: name,
            time: time
        }
        newarr.push(CardData)
    })
    return newarr;
}


function moveCardToNewList(arr1, arr2, arr3) {

    axios.get(apiurl)
        .then(sourceListResponse => {

            const lists = sourceListResponse.data
            lists[0].cards = arr1
            lists[1].cards = arr2
            lists[2].cards = arr3
            axios.put(apiurl, lists).then(
                res => console.log(res)
            ).catch(error => console.log(error));
        })

        .catch(error => console.log(error));
}
