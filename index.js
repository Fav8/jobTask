import axios from 'axios';
import cron from 'node-cron';
import { getJobQueries, insertNewJobs } from './db.js';


async function retrieveGoogleURLSforSearchTerm(searchTerm) {
    const response = await axios.get('https://app.scrapingbee.com/api/v1/store/google', {
        params: {
            api_key: '97SA0M2W00NTGOC8F538JFFR5BW1GO8KOY94PQVKL26WOS9JGESZ3A27LDQNSP3A06NEBXKU3TDOZOIF',
            search: searchTerm,
            nb_results:2
        },
    });
    const organicResults = response.data.organic_results;
    return organicResults
};


async function runTask() {
    console.log('running task');
    const jobQueries = await getJobQueries();
    for (const jobQuery of jobQueries) {
        try {
            const urls = await retrieveGoogleURLSforSearchTerm(formatQuery(jobQuery));
            const insertJobs = await insertNewJobs(urls, jobQuery.hardskill, jobQuery.role, jobQuery.seniority);
        } catch (error) {
            if(error.errno == 1062){
                console.log('duplicate entry');
            }
            console.log(error);
        }
        
    }
}

function formatQuery(query) {
    return `remote ${query.seniority} ${query.hardskill} ${query.role} site:https://apply.workable.com/*`;
}


cron.schedule('0 0 */3 * *', async function() {
    console.log('running a task every minute');
    try {
        await runTask();
    } catch (e) {
        console.log(e);
    }
  });

