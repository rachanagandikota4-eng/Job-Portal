const API = "/api/jobs";


/* DISPLAY JOBS */

async function loadJobs() {

    const jobList = document.getElementById("jobList");

    if (!jobList) return;

    try {

        const response = await fetch(API);

        const jobs = await response.json();

        displayJobs(jobs);

    } catch (error) {

        jobList.innerHTML =
            "<p>Unable to load jobs.</p>";

        console.log(error);
    }
}


function displayJobs(jobs) {

    const jobList = document.getElementById("jobList");

    jobList.innerHTML = "";

    jobs.forEach(job => {

        const card = document.createElement("div");

        card.className = "job-card";

        card.innerHTML = `

            <h3>${job.title}</h3>

            <p class="company">
                ${job.company}
            </p>

            <div class="job-info">

                <p>📍 ${job.location}</p>

                <p>💰 ₹${Number(job.salary).toLocaleString("en-IN")}</p>

                <p>📅 ${formatDate(job.interview_date)}</p>

            </div>

            <span class="skill">
                ${job.skill}
            </span>

        `;

        jobList.appendChild(card);

    });
}


function formatDate(date) {

    if (!date) return "";

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* SEARCH */

const search = document.getElementById("search");

if (search) {

    search.addEventListener("input", async function () {

        const value =
            this.value.toLowerCase();

        const response =
            await fetch(API);

        const jobs =
            await response.json();

        const filtered =
            jobs.filter(job =>

                job.title.toLowerCase().includes(value) ||

                job.company.toLowerCase().includes(value) ||

                job.location.toLowerCase().includes(value) ||

                job.skill.toLowerCase().includes(value)

            );

        displayJobs(filtered);

    });

}


/* ADD JOB */

const addForm =
    document.getElementById("addJobForm");

if (addForm) {

    addForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const job = {

            job_id:
                document.getElementById("job_id").value,

            title:
                document.getElementById("title").value,

            company:
                document.getElementById("company").value,

            location:
                document.getElementById("location").value,

            salary:
                document.getElementById("salary").value,

            skill:
                document.getElementById("skill").value,

            interview_date:
                document.getElementById("interview_date").value

        };


        const response =
            await fetch(API, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(job)

            });


        const result =
            await response.json();


        document.getElementById("message")
            .textContent = result.message || result.error;


        if (response.ok) {

            addForm.reset();

        }

    });

}


/* UPDATE JOB */

const updateForm =
    document.getElementById("updateJobForm");

if (updateForm) {

    updateForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const id =
            document.getElementById("update_id").value;


        const job = {

            title:
                document.getElementById("update_title").value,

            company:
                document.getElementById("update_company").value,

            location:
                document.getElementById("update_location").value,

            salary:
                document.getElementById("update_salary").value,

            skill:
                document.getElementById("update_skill").value,

            interview_date:
                document.getElementById("update_date").value

        };


        const response =
            await fetch(`${API}/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(job)

            });


        const result =
            await response.json();


        document.getElementById("updateMessage")
            .textContent = result.message || result.error;

    });

}


/* DELETE JOB */

const deleteForm =
    document.getElementById("deleteJobForm");

if (deleteForm) {

    deleteForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const id =
            document.getElementById("delete_id").value;


        const confirmDelete =
            confirm(
                "Are you sure you want to delete this job?"
            );


        if (!confirmDelete) return;


        const response =
            await fetch(`${API}/${id}`, {

                method: "DELETE"

            });


        const result =
            await response.json();


        document.getElementById("deleteMessage")
            .textContent =
            result.message || result.error;


        if (response.ok) {

            deleteForm.reset();

        }

    });

}


loadJobs();