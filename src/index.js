const R = require('ramda');
const { getGroup, getProjects, getPipelineOfProject, getJobsOfPipeline, triggerJob } = require('./gitlab');
const { groupName, branch, stage, projectNames } = require("./config");

const first = R.prop(0);
const id = R.prop('id');
const arrayWrapper = o => Array.isArray(o) ? o : [o];
const idOfFirst = R.compose(id, first, arrayWrapper);
const filterJobByStage = R.filter(job => job['stage'] === stage);

const recursionGetGroup = async (groupId) => {
    let result = [];
    let projects = [];
    let page = 1;
    do {
        projects = (await getProjects(groupId, page))
            .map(project => ({
                "id": project["id"],
                "name": project["name"]
            }));
        page ++;
        result.push(...projects);
    } while (projects.length !== 0)
    return result.filter(p => projectNames.indexOf(p["name"]) >= 0)
}

const main = async () => {
    console.log(`get projects of group: ${groupName}`)
    let groupId = idOfFirst(await getGroup(groupName))
    let projects = await recursionGetGroup(groupId);

    for (const project of projects) {
        console.log('-----------------------------')
        console.log(`start process [project: ${project['name']}], [branch: ${branch}], [stage: ${stage}]`)
        let projectId = project['id'];
        console.log(`project id: ${projectId}`)
        let pipelineId = idOfFirst(await getPipelineOfProject(projectId, branch))
        console.log(`pipeline id: ${pipelineId}`)
        if (pipelineId === undefined){
            console.log(`*** the [project: ${project['name']}] on [branch: ${branch}] does not have any pipeline`)
            continue;
        }

        let job = first(filterJobByStage(await getJobsOfPipeline(projectId, pipelineId)));
        console.log(`job id: ${(id(job))}`)
        await triggerJob(projectId, job);
        console.log(`end process [project: ${project['name']}], [branch: ${branch}], [stage: ${stage}]`)
    }
}

main();
