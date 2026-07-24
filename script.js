let currentFilter = "all";

let allDeadlines = [];

let calendar;



const sheetURL =
"https://docs.google.com/spreadsheets/d/1_OZQAOVAdUXa5H_tDAU2bw7Dq_lhBlGq9yUw9yU2WWs/export?format=csv";



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


    .then(response => {


        if(!response.ok){

            throw new Error("Failed to load Google Sheet");

        }


        return response.text();


    })



    .then(csv => {



        parseCSV(csv);



        createCalendar();


        createList();



    })



    .catch(error => {


        console.log(error);


        document.getElementById("errorMessage").innerHTML =

        "⚠️ Failed to load deadlines";


    });



}









function parseCSV(csv){



    let rows = csv.split("\n");



    allDeadlines = [];





    for(let i = 1; i < rows.length; i++){



        let columns = rows[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);



        if(!columns || columns.length < 3){

            continue;

        }



        let title = columns[0].replaceAll('"',"").trim();

        let subject = columns[1].replaceAll('"',"").trim();

        let date = columns[2].replaceAll('"',"").trim();





        if(title && subject && date){



            allDeadlines.push({

                title:title,

                subject:subject,

                date:date

            });



        }



    }



}









function createCalendar(){



    let events = [];



    let filtered = getFilteredDeadlines();



    let grouped = groupDeadlines(filtered);





    Object.keys(grouped).forEach(key => {



        let data = key.split("|");



        let date = data[0];

        let subject = data[1];





        events.push({



            title:subject,

            start:date,

            color:subjectColors[subject] || "#6b7280",



            extendedProps:{


                deadlines: grouped[key]


            }



        });



    });







    let oldDate = null;



    if(calendar){

        oldDate = calendar.getDate();

        calendar.destroy();

    }







    calendar = new FullCalendar.Calendar(


        document.getElementById("calendar"),


        {



            initialView:"dayGridMonth",



            initialDate: oldDate || undefined,



            headerToolbar:{



                left:"prev,next today",


                center:"title",


                right:"dayGridMonth"



            },





            events:events,







            eventContent:function(arg){



                let wrapper = document.createElement("div");



                let subject = arg.event.title;



                let deadlines = arg.event.extendedProps.deadlines;





                let header = document.createElement("div");



                header.className = "calendar-subject";



                header.innerHTML =

                `<span class="dot ${getClass(subject)}"></span>

                ${subject} ▼`;







                let list = document.createElement("div");



                list.className = "calendar-deadlines";



                list.style.display = "none";







                deadlines.forEach(item => {



                    let line = document.createElement("div");



                    line.textContent = "└ " + item.title;



                    list.appendChild(line);



                });







                header.onclick = function(event){



                    event.stopPropagation();




                    if(list.style.display === "none"){



                        list.style.display = "block";



                        header.innerHTML =

                        `<span class="dot ${getClass(subject)}"></span>

                        ${subject} ▲`;



                    }


                    else {



                        list.style.display = "none";



                        header.innerHTML =

                        `<span class="dot ${getClass(subject)}"></span>

                        ${subject} ▼`;



                    }



                };







                wrapper.appendChild(header);


                wrapper.appendChild(list);






                return {

                    domNodes:[wrapper]

                };



            }



        }



    );





    calendar.render();



}









function createList(){



    let list = document.getElementById("deadlineList");



    list.innerHTML = "";



    let grouped = groupDeadlines(getFilteredDeadlines());





    Object.keys(grouped)

    .sort()

    .forEach(key => {



        let data = key.split("|");



        let date = data[0];

        let subject = data[1];





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



            let line = document.createElement("div");


            line.className="deadline-item";


            line.textContent = "└ " + item.title;



            events.appendChild(line);



        });







        box.querySelector(".subject-header").onclick = function(){



            events.classList.toggle("hidden");



        };







        list.appendChild(box);



    });



}









function groupDeadlines(data){



    let grouped = {};





    data.forEach(item => {



        let key = item.date + "|" + item.subject;



        if(!grouped[key]){


            grouped[key] = [];

        }



        grouped[key].push(item);



    });





    return grouped;



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



    let currentDate = null;



    if(calendar){

        currentDate = calendar.getDate();

    }



    currentFilter = subject;



    createCalendar();


    createList();





    if(currentDate && calendar){


        calendar.gotoDate(currentDate);


    }



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
