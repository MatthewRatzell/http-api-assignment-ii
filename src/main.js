
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
//////this is here because i cannot link modules :(/////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
const template = document.createElement("template");
template.innerHTML = `
<style>  
h2,h3
{
    text-align: center;
    font-size: 2.0rem;

    margin-top: 0;
}
.card 
  {
    overflow:auto;
    padding:5%;
    background-color: #E27D60 !important;	
    height: 350px;
    width: 306px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
  }
  
.card:hover 
  {
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  }

</style>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<body>
<div class="card">

    <h2 id="title" class="has-text-centered is-size-5"></h2>
    <h2 class="has-text-centered is-size-5" id="description"></h2>
    <h2 id="dueDate" class="has-text-centered is-size-5"></h2>
    <h2 class="has-text-centered is-size-5" id="firebaseUserName"></h2>

</div>
  <body>


`;
//making sure ffavorites is set equal to the local storage
class swCard extends HTMLElement {
    constructor() {
        super();
        //attach a shadowdom treeto this instance this creasts a shadown root for us
        this.attachShadow({ mode: "open" });//allows debugging when open
        //clone template and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        /*
        this.title = this.shadowRoot.querySelector("#title");
        this.description = this.shadowRoot.querySelector("#description");
        this.dueDate = this.shadowRoot.querySelector("#dueDate");
        this.firebaserUserName = this.shadowRoot.querySelector("#firebaseUserName");
        */
    }

    connectedCallback() {
        //making sure we call our render function
        this.render();
    }

    //once we hook this favro
    disconnectedCallback() {

    }


    //updating the code
    attributeChangedCallback(attributeName, oldVal, newVal) {
        // console.log(attributeName, oldVal, newVal);
        this.render();
    }
    //telling component to observe/watch these values
    static get observedAttributes() {
        return ["data-title", "data-description", "data-dueDate", "firebaseUserName"];
    }



    render() {
        this.title = this.shadowRoot.querySelector("#title");
        this.description = this.shadowRoot.querySelector("#description");
        this.dueDate = this.shadowRoot.querySelector("#dueDate");
        this.firebaserUserName = this.shadowRoot.querySelector("#firebaseUserName");

        const title = this.getAttribute('data-title') ? this.getAttribute('data-title') : "<i>...game title...</i>";
        const description = this.getAttribute('data-description') ? this.getAttribute('data-description') : "0";
        const dueDate = this.getAttribute('data-dueDate') ? this.getAttribute('data-dueDate') : "<i>...game title...</i>";
        const firebaseUserName = this.getAttribute('data-firebaseUserName') ? this.getAttribute('data-firebaseUserName') : "0";


        this.title = `Title${title}`;
        this.description = `Title${description}`;
        this.dueDate = `Title${dueDate}`;
        this.firebaseUserName = `Title${firebaseUserName}`;

    }
}//end class
customElements.define('sw-card', swCard);
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
const handleResponse = async (response, parseResponse) => {

    //Grab the content section so that we can write to it
    const content = document.querySelector('#content');

    //Based on the status of the response, write something.
    switch (response.status) {
        case 200:
            content.innerHTML = `<b>Success</b>`;
            break;
        case 201:
            content.innerHTML = `<b>Created</b>`;
            break;
        //204 is just not a parsedResponse
        case 204:
            content.innerHTML = `<b>Updated(No Content)</b>`;
            break;
        case 400:
            content.innerHTML = `<b>Bad Request</b>`;
            break;
        case 404:
            content.innerHTML = `<b>Resource Not Found</b>`;
            break;
        default:
            content.innerHTML = `Error code not implemented by client.`;
            break;
    }

    //If we should parse a response (meaning we made a get request)
    if (parseResponse) {
        let list = document.querySelector(".card-list");
        list.innerHTML = "";
        //Parse the response to json. This is an async function, so we will await it.
        let obj = await response.json();
        //making sure we log it out to our console
        console.log(obj);
        console.log(obj.cards);

        //loop through all of our cards and call the appropiate function
        for (let j in obj.cards) {
            //console.log(obj.cards[j]);
            createCards(obj.cards[j]);
        }

        //if there is a message display it
        if (obj.message) {
            content.innerHTML = `<b>${obj.id}</b>`;
            content.innerHTML += `<p>${obj.message}</p>`
        }
    }
    //if it is a post request
    else if (response.status == 201 || response.status == 204) {

    }
    else if (response.status == 400) {
        //this exists so it doesnt enter the last elsed
    }
    //for heads
    else {
        //If we don't have a response to parse, just say we recieved metadata
        //content.innerHTML += '<p>Meta Data Received From Head Request</p>';
    }
};


//function to send request. This is marked as async since we will use await.
const requestUpdate = async () => {

    //hardcodingg the method 
    const method = 'get';
    const url = '/getCards';


    //Await our fetch response. Go to the URL, use the right method, and attach the headers.
    let response = await fetch(url, {
        method,
        headers: {
            'Accept': 'application/json'
        },
    });

    //Once we have our response, send it into handle response. The second parameter is a boolean
    //that says if we should parse the response or not. We will get a response to parse on get
    //requests so we can do an inline boolean check, which will return a true or false to pass in.
    handleResponse(response, method === 'get');
};

//function to send post data back to our server
const sendPost = async (addNewCardForm) => {
    //Grab all the info from the form

    //get the action we are trying to perform
    const nameAction = addNewCardForm.getAttribute('action');
    const nameMethod = addNewCardForm.getAttribute('method');

    //get the data inside the form that we need 
    const titleField = addNewCardForm.querySelector('#title');
    const descriptionField = addNewCardForm.querySelector('#description');
    const dueDateField = addNewCardForm.querySelector('#dueDate');
    const firebaseUserNameField = addNewCardForm.querySelector('#fireBaseUserName');


    //not passing in firebaseusernamefield yet
    //Build a data string in the FORM-URLENCODED format.
    const formData = `title=${titleField.value}&description=${descriptionField.value}&dueDate=${dueDateField.value}&firebaseUserName=${firebaseUserNameField.value}`;

    //Make a fetch request and await a response. Set the method to
    //the one provided by the form (POST). Set the headers. Content-Type
    //is the type of data we are sending. Accept is the data we would like
    //in response. Then add our FORM-URLENCODED string as the body of the request.
    let response = await fetch(nameAction, {
        //nameMethod will be post
        method: nameMethod,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        },
        //body of this json object
        body: formData,
    });

    //Once we have a response, handle it.
    handleResponse(response);
};



const init = (addNewCardForm) => {
    //Grab the form
    //const addNewCardForm = document.querySelector('#addNewCardForm');
    //function to handle our get request. In this case, it also cancels the built in html form action
    //const addNewCardForm = addNewCardForm;
    const getCards = (e) => {
        e.preventDefault();
        requestUpdate(addNewCardForm);
        return false;
    }

    //function that handles adding a user to our json object
    const addUser = (e) => {
        e.preventDefault();
        sendPost(addNewCardForm);
        return false;
    }

    //Call addUser when the submit event fires on the form.
    addNewCardForm.addEventListener('submit', addUser);

    //add event listener
    addNewCardForm.addEventListener('submit', getCards);

};

//function that handles card creation
const createCards = (obj) => {
    let list = document.querySelector(".card-list");
    console.log(`Title: ${obj.title},Description: ${obj.description},Due Date: ${obj.dueDate},firebase Username: ${obj.firebaseUserName}`);

    const swCard = document.createElement("sw-card");
    
    swCard.dataset.title = obj.title ?? "";
    swCard.dataset.description = obj.description ?? "";
    swCard.dataset.dueDate = obj.dueDate ?? "";
    swCard.dataset.firebaseUserName = obj.firebaseUserName ?? "";

    
    list.appendChild(swCard);

}













































