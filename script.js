body {
    font-family: Arial, sans-serif;
    margin: 20px;
    background: #f8fafc;
}


h1 {
    text-align: center;
    margin-bottom: 20px;
}


/* Filter buttons */

#filters {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: 20px;
}


#filters button {

    background: white;

    border: 1px solid #d1d5db;

    border-radius: 8px;

    padding: 8px 14px;

    cursor: pointer;

    font-size: 14px;

    display: flex;

    align-items: center;

}


#filters button:hover {

    background: #f1f5f9;

}



/* Subject dots */

.dot {

    display: inline-block;

    width: 10px;

    height: 10px;

    border-radius: 50%;

    margin-right: 7px;

}


.gensci {
    background: #3b82f6;
}


.genmath {
    background: #ef4444;
}


.fima {
    background: #f97316;
}


.lcsk {
    background: #22c55e;
}


.kasaysayan {
    background: #ec4899;
}


.mabcom {
    background: #a855f7;
}


.effcom {
    background: #eab308;
}



/* Calendar */

#calendar {

    max-width: 1100px;

    margin: auto;

    background: white;

    padding: 20px;

    border-radius: 12px;

    box-shadow: 0 4px 12px rgba(0,0,0,0.08);

}



/* Custom grouped list */

#deadlineList {

    max-width: 1100px;

    margin: 20px auto;

    background: white;

    padding: 20px;

    border-radius: 12px;

    box-shadow: 0 4px 12px rgba(0,0,0,0.08);

}



.list-date {

    font-size: 20px;

    font-weight: bold;

    margin-top: 20px;

    margin-bottom: 10px;

}



.subject-group {

    margin-bottom: 10px;

}



.subject-header {

    cursor: pointer;

    font-weight: bold;

    padding: 10px;

    border-radius: 8px;

    background: #f1f5f9;

    display: flex;

    align-items: center;

}



.subject-header:hover {

    background: #e2e8f0;

}



.subject-events {

    margin-left: 30px;

    margin-top: 8px;

}



.deadline-item {

    padding: 6px 0;

}



/* Mobile */

@media (max-width: 600px) {

    body {
        margin: 10px;
    }


    #calendar,
    #deadlineList {

        padding: 10px;

    }


    #filters button {

        font-size: 12px;

    }

}
