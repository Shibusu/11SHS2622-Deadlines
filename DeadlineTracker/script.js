document.addEventListener('DOMContentLoaded', function () {

    const calendar = new FullCalendar.Calendar(
        document.getElementById('calendar'),
        {
            initialView: 'dayGridMonth',

            events: function(fetchInfo, successCallback, failureCallback) {

                fetch("https://docs.google.com/spreadsheets/d/1_OZQAOVAdUXa5H_tDAU2bw7Dq_lhBlGq9yUw9yU2WWs/export?format=csv")
                    .then(response => response.text())
                    .then(csv => {

                        let rows = csv.split("\n");

                        let events = [];

                        // Skip first row (headers)
                        for (let i = 1; i < rows.length; i++) {

                            let data = rows[i].split(",");

                            if (data.length >= 3) {

                                events.push({
                                    title: data[0],
                                    extendedProps: {
                                        subject: data[1]
                                    },
                                    start: data[2]
                                });

                            }
                        }

                        successCallback(events);

                    })
                    .catch(error => {
                        console.log(error);
                        failureCallback(error);
                    });

            }
        }
    );


    calendar.render();

});