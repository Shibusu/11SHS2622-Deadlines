let currentFilter = "all";


document.addEventListener('DOMContentLoaded', function () {


    const subjectColors = {

        "GenSci": "#3b82f6",

        "GenMath": "#ef4444",

        "FiMa": "#f97316",

        "L&CSK": "#22c55e",

        "Kasaysayan": "#ec4899",

        "MabCom": "#a855f7",

        "EffCom": "#eab308"

    };



    window.calendar = new FullCalendar.Calendar(

        document.getElementById('calendar'),

        {

            initialView: 'dayGridMonth',


            // NEW: collapse multiple events on the same day
            dayMaxEvents: true,


            headerToolbar: {

                left: "prev,next today",

                center: "title",

                right: "dayGridMonth,listMonth"

            },


            events: function(fetchInfo, successCallback, failureCallback) {


                fetch("https://docs.google.com/spreadsheets/d/1_OZQAOVAdUXa5H_tDAU2bw7Dq_lhBlGq9yUw9yU2WWs/export?format=csv")


                .then(response => response.text())


                .then(csv => {


                    let rows = csv.split("\n");

                    let events = [];



                    for (let i = 1; i < rows.length; i++) {


                        let data = rows[i].split(",");



                        if (data.length >= 3) {


                            let title = data[0].trim();

                            let subject = data[1].trim();

                            let date = data[2].trim();



                            if (title && date) {


                                events.push({


                                    title: `[${subject}] ${title}`,

                                    start: date,

                                    color: subjectColors[subject] || "#6b7280",


                                    extendedProps: {

                                        subject: subject

                                    }


                                });


                            }


                        }


                    }



                    // Subject filter

                    if (currentFilter !== "all") {


                        events = events.filter(event =>

                            event.extendedProps.subject === currentFilter

                        );


                    }



                    successCallback(events);



                })



                .catch(error => {


                    console.log("Error loading deadlines:", error);

                    failureCallback(error);


                });


            }

        }


    );



    calendar.render();


});





function filterSubject(subject) {


    currentFilter = subject;


    calendar.refetchEvents();


}
