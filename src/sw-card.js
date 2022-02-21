const template = document.createElement("template");
template.innerHTML = `
<style>  
h2,h3
{
    text-align: center;
    font-size: 2.0rem;
    font-family: Roboto, sans-serif;
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

    <h2 id="title" class="has-text-centered is-size-5"></h2>>
    <h2 class="has-text-centered is-size-5" id="description"></h2>
    <h2 id="dueDate" class="has-text-centered is-size-5"></h2>>
    <h2 class="has-text-centered is-size-5" id="firebaseUserName"></h2>

</div>
  <body>


`;
//making sure ffavorites is set equal to the local storage
class swGame extends HTMLElement{
    constructor(){
        super();
      //attach a shadowdom treeto this instance this creasts a shadown root for us
      this.attachShadow({mode:"open"});//allows debugging when open
      //clone template and append it
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.title = this.shadowRoot.querySelector("#title");
      this.description = this.shadowRoot.querySelector("#description");
      this.dueDate = this.shadowRoot.querySelector("#dueDate");
      this.firebaserUserName = this.shadowRoot.querySelector("#firebaseUserName");
    }

    connectedCallback()
    {
        //making sure we call our render function
        this.render();
    }

    //once we hook this favro
    disconnectedCallback(){

    }


          //updating the code
     attributeChangedCallback(attributeName, oldVal, newVal){
       // console.log(attributeName, oldVal, newVal);
        this.render();
    }
     //telling component to observe/watch these values
    static get observedAttributes(){
        return ["data-title","data-description","data-dueDate","firebaseUserName"];}
    


     render(){
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

customElements.define('sw-card',swCard);

