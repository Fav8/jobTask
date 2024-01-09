import mysql from 'mysql2';

var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: 'jobScraper'
});


export const getJobQueries = () =>{
    return new Promise((resolve, reject)=>{
        pool.query(`SELECT * from jobQueries`,  (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
}

export const insertNewJobs = (jobs, hardskill, role, seniority) =>{
    return new Promise((resolve, reject)=>{
        let query = `INSERT INTO savedJobs (hardskill, url, title, seniority, role) VALUES `;
        for(let i = 0; i < jobs.length; i++){
            query += `('${hardskill}', '${jobs[i].url}', '${jobs[i].title}', '${seniority}', '${role}')`;
            if(i != jobs.length - 1){
                query += ', ';
            }
        }
        pool.query(query,  (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
}

