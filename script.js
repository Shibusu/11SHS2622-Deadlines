let currentFilter = "all";

let allDeadlines = [];

let calendar;


const sheetURL = "https://docs.google.com/spreadsheets/d/1_OZQAOVAdUXa5H_tDAU2bw7Dq_lhBlGq9yUw9yU2WWs/export?format=csv";


const subjectColors = {

    "GenSci": "#3b82f6",
    "GenMath": "#ef4444",
    "FiMa": "#f97316",
    "L&CSK": "#22c55c",
    "Kasaysayan": "#ec4899",
    "MabCom": "#a855f7",
    "EffCom": "#eab308"

};



document.addEventListener("DOMContentLoaded", function(){

    loadDeadlines();

});





function loadDeadlines(){


    fetch(sheetURL)

    .then(response => response.text())

    .then(csv => {


        let rows = csv.split("\n");


        allDeadlines = [];



        for(let i = 1; i < rows.length; i++){


            let data = rows[i].split(",");



            if(data.length >= 3){


                let title = data[0].trim();

                let subject = data[1].trim();

                let date = data[2].trim();



                if(title && subject && date){


                    allDeadlines.push({

                        title:title,

                        subject:subject,

                        date:date

                    });


                }

            }


        }



        createCalendar();

        createList();


    });



}








function createCalendar(){


    let events = [];


    let filtered = getFilteredDeadlines();



    let grouped = {};




    filtered.forEach(item => {



        let key = item.date + "|" + item.subject;



        if(!grouped[key]){

            grouped[key] = [];

        }



        grouped[key].push(item);



    });





    Object.keys(grouped).forEach(key => {



        let parts = key.split("|");


        events.push({


            title: parts[1],


            start: parts[0],


            color: subjectColors[parts[1]],



            extendedProps:{


                deadlines: grouped[key]


            }


        });



    });







    if(calendar){

        calendar.destroy();

    }







    calendar = new FullCalendar.Calendar(

        document.getElementById("calendar"),


        {


            initialView:"dayGridMonth",



            headerToolbar:{


                left:"prev,next today",

                center:"title",

                right:"dayGridMonth"

            },




            events:events,





            eventContent:function(arg){



                let deadlines = arg.event.extendedProps.deadlines;



                let container = document.createElement("div");



                container.className = "calendar-group";



                let header = document.createElement("div");


                header.className = "calendar-subject";



                header.innerHTML =

                `<span class="dot ${getClass(arg.event.title)}"></span>

                ${arg.event.title} ▼`;





                let list = document.createElement("div");



                list.className = "calendar-deadlines";



                list.style.display = "none";





                deadlines.forEach(item => {



                    let deadline = document.createElement("div");



                    deadline.textContent = "└ " + item.title;



                    list.appendChild(deadline);



                });







                header.onclick = function(e){


                    e.stopPropagation();



                    if(list.style.display === "none"){


                        list.style.display = "block";


                        header.innerHTML =

                        `<span class="dot ${getClass(arg.event.title)}"></span>

                        ${arg.event.title} ▲`;


                    }

                    else{


                        list.style.display = "none";


                        header.innerHTML =

                        `<span class="dot ${getClass(arg.event.title)}"></span>

                        ${arg.event.title} ▼`;


                    }


                };







                container.appendChild(header);


                container.appendChild(list);





                return {

                    domNodes:[container]

                };



            }




        }



    );





    calendar.render();



}









function createList(){


    let list = document.getElementById("deadlineList");


    list.innerHTML = "";



    let filtered = getFilteredDeadlines();



    let grouped = {};





    filtered.forEach(item => {



        let key = item.date + "|" + item.subject;



        if(!grouped[key]){


            grouped[key] = [];


        }



        grouped[key].push(item);



    });





    Object.keys(grouped)

    .sort()

    .forEach(key => {



        let parts = key.split("|");


        let date = parts[0];

        let subject = parts[1];



        let box = document.createElement("div");



        box.innerHTML = `


        <div class="list-date">

            ${date}

        </div>



        <div class="subject-header">

            <span class="dot ${getClass(subject)}"></span>

            ${subject} ▼

        </div>



        <div class="subject-events hidden"></div>


        `;






        let events = box.querySelector(".subject-events");





        grouped[key].forEach(item => {



            let div = document.createElement("div");


            div.className = "deadline-item";


            div.textContent = "└ " + item.title;



            events.appendChild(div);



        });





        box.querySelector(".subject-header").onclick = function(){


            events.classList.toggle("hidden");


        };



        list.appendChild(box);



    });



}










function getFilteredDeadlines(){



    if(currentFilter === "all"){


        return allDeadlines;


    }



    return allDeadlines.filter(item =>

        item.subject === currentFilter

    );


}









function filterSubject(subject){



    currentFilter = subject;



    createCalendar();

    createList();



}








function showCalendar(){



    document.getElementById("calendar").style.display="block";


    document.getElementById("deadlineList").style.display="none";


}








function showList(){



    document.getElementById("calendar").style.display="none";


    document.getElementById("deadlineList").style.display="block";


}








function getClass(subject){



    const classes = {


        "GenSci":"gensci",

        "GenMath":"genmath",

        "FiMa":"fima",

        "L&CSK":"lcsk",

        "Kasaysayan":"kasaysayan",

        "MabCom":"mabcom",

        "EffCom":"effcom"


    };



    return classes[subject] || "";

}