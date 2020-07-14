const $ = document.querySelector.bind(document);

//Select the elements
const clear = $('.clear');
const dateElement = $('#date');
const list = $('#list');
const input = $('#input');

//Assign the classes name
const check = 'fa-check-circle';
const uncheck = 'fa-circle-thin';
const line_through = 'lineThrough';

//Show todays date
const today = new Date();
const options = {weekday: "long", month: "short", day: "numeric"};

dateElement.innerHTML = today.toLocaleDateString('en-US', options);

//Variables
let listItem, id;

//get item from localstorage
let data = localStorage.getItem('TODO');

//check if data is empty
if (data) {
    listItem = JSON.parse(data);
    id = listItem.length; //set the id to the last one in the list
    loadListItem(listItem);//load the list to the user interface
} else {
    //if data is empty
    listItem = [];
    id = 0;
};

//clear the local storage
clear.addEventListener('click', () => {

    localStorage.clear();
    location.reload();
});

//load items to the user's interface
function loadListItem(array) {

    array.forEach(item => {
        
        addToDo(item.name, item.id, item.done, item.trash);
    });
};

//add to do Function
function addToDo(toDo, id, done, trash) {

    if (trash) return;

    const isDone = done ? check : uncheck;
    const hasLine = done ? line_through : "";

    const item = `
    <li class="item">
        <i class="fa ${isDone} co" job="complete" id="${id}"></i>
        <p class="text ${hasLine}">${toDo}</p>
        <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
    </li>
    `

    const position = 'beforeend';
    list.insertAdjacentHTML(position, item);
}

//add an item to the list - user anter the key
document.addEventListener('keyup', (event) => {

    if (event.keyCode == 13) {
        
        const toDo = input.value;

        //if the input isn't empty
        if (toDo) {
            
            addToDo(toDo, id, false, false);

            listItem.push({
                name: toDo,
                id: id,
                done: false,
                trash: false
            });

            //add item to localstorage(this code must be added whrere the listItem array is updated)
            localStorage.setItem('TODO', JSON.stringify(listItem));

            id++;
        }

        input.value = '';
    }
});

//complete to do
function completeToDo(element) {
    
    element.classList.toggle(check);
    element.classList.toggle(uncheck);
    element.parentNode.querySelector('.text').classList.toggle(line_through);

    listItem[element.id].done = listItem[element.id].done ? false : true;
}

//remove to do
function removeTodo(element) {
    
    element.parentNode.parentNode.removeChild(element.parentNode);

    listItem[element.id].trash = true;
}

//target the items created dynamically

list.addEventListener('click', (event) => {

    const element = event.target; //return the element clicked in list
    const elementJob = element.attributes.job.value; //complete or delete

    if (elementJob == 'complete') {

        completeToDo(element);

    }else if (elementJob == 'delete') {

        removeTodo(element);
    }

    //add item to localstorage(this code must be added whrere the listItem array is updated)
    localStorage.setItem('TODO', JSON.stringify(listItem));
})
