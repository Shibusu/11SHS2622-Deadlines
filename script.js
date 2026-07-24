let currentFilter = "all";

let allDeadlines = [];

let calendar;


const sheetURL =
"https://docs.google.com/spreadsheets/d/1_OZQAOVAdUXa5H_tDAU2bw7Dq_lhBlGq9yUw9yU2WWs/export?format=csv";



const subjectColors = {

    "GenSci": "#3b82f6",
    "GenMath": "#ef4444",
    "FiMa": "#f97316",
    "L&CSK": "#22c55e",
    "Kasaysayan": "#ec4899",
    "MabCom": "#a855f7",
    "EffCom": "#eab308"

};





document.addEventListener("DOMContentLoaded", function(){

    loadDeadlines();

    setActiveButton("calendar");

});







function loadDeadlines(){


    fetch(sheetURL)

    .then(response => response.text())

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



            events:function(fetchInfo, successCallback){



                let events=[];


                let grouped=groupDeadlines(getFilteredDeadlines());





                Object.keys(grouped).forEach(key=>{


                    let data=key.split("|");



                    events.push({


                        title:data[1],

                        start:data[0],

                        color:subjectColors[data[1]] || "#6b7280",



                        extendedProps:{


                            deadlines:grouped[key]


                        }


                    });



                });



                successCallback(events);



            },





            eventContent:function(arg){



                let wrapper=document.createElement("div");


                let subject=arg.event.title;


                let deadlines=arg.event.extendedProps.deadlines;



                let header=document.createElement("div");


                header.className="calendar-subject";



                header.innerHTML=

                `<span class="dot ${getClass(subject)}"></span>

                ${subject} ▼`;





                let list=document.createElement("div");


                list.className="calendar-deadlines";


                list.style.display="none";





                deadlines.forEach(item=>{


                    let line=document.createElement("div");


                    line.textContent="└ "+item.title;


                    list.appendChild(line);


                });





                header.onclick=function(e){


                    e.stopPropagation();



                    if(list.style.display==="none"){


                        list.style.display="block";


                        header.innerHTML=

                        `<span class="dot ${getClass(subject)}"></span>

                        ${subject} ▲`;


                    }

                    else{


                        list.style.display="none";


                        header.innerHTML=

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



    let list=document.getElementById("deadlineList");


    list.innerHTML="";



    let filtered=getFilteredDeadlines();



    let dates={};





    // Group by DATE first

    filtered.forEach(item=>{


        if(!dates[item.date]){

            dates[item.date]={};

        }



        if(!dates[item.date][item.subject]){


            dates[item.date][item.subject]=[];


        }



        dates[item.date][item.subject].push(item);



    });







    Object.keys(dates)

    .sort()

    .forEach(date=>{



        let dateBox=document.createElement("div");



let formattedDate = new Date(date).toLocaleDateString("en-US", {

    weekday: "long",

    year: "numeric",

    month: "long",

    day: "numeric"

});



dateBox.innerHTML=`

<div class="subject-header">

    📅 ${formattedDate} ▼

</div>

<div class="date-subjects"></div>

`;



        let subjects=dateBox.querySelector(".date-subjects");


        subjects.classList.add("hidden");







        Object.keys(dates[date])

        .forEach(subject=>{



            let subjectBox=document.createElement("div");



            subjectBox.innerHTML=`


            <div class="subject-header" style="margin-left:20px">


                <span class="dot ${getClass(subject)}"></span>

                ${subject} ▼


            </div>



            <div class="subject-events hidden"

                 style="margin-left:45px">

            </div>


            `;





            let events=subjectBox.querySelector(".subject-events");





            dates[date][subject].forEach(item=>{


                let line=document.createElement("div");


                line.className="deadline-item";


                line.textContent="└ "+item.title;


                events.appendChild(line);


            });







            subjectBox.querySelector(".subject-header").onclick=function(e){


                e.stopPropagation();


                events.classList.toggle("hidden");


            };




            subjects.appendChild(subjectBox);



        });







        dateBox.querySelector(".subject-header").onclick=function(){


            subjects.classList.toggle("hidden");


        };






        list.appendChild(dateBox);



    });



}









function groupDeadlines(data){


    let grouped={};



    data.forEach(item=>{


        let key=item.date+"|"+item.subject;



        if(!grouped[key]){


            grouped[key]=[];


        }



        grouped[key].push(item);



    });



    return grouped;


}









function getFilteredDeadlines(){



    if(currentFilter==="all"){


        return allDeadlines;


    }



    return allDeadlines.filter(item=>

        item.subject===currentFilter

    );


}









function filterSubject(subject){


    currentFilter=subject;


    calendar.refetchEvents();


    createList();



}









function showCalendar(){


    document.getElementById("calendar").style.display="block";


    document.getElementById("deadlineList").style.display="none";


    setActiveButton("calendar");


}









function showList(){


    document.getElementById("calendar").style.display="none";


    document.getElementById("deadlineList").style.display="block";


    setActiveButton("list");


}









function setActiveButton(button){



    let buttons=document.querySelectorAll("#viewButtons button");



    buttons.forEach(btn=>{


        btn.classList.remove("active");


    });



    if(button==="calendar"){


        buttons[0].classList.add("active");


    }

    else{


        buttons[1].classList.add("active");


    }



}









function getClass(subject){



    const classes={


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
