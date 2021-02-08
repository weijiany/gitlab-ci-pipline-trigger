const axios = require('axios');

const { token, url } = require('../config');

axios.defaults.baseURL = url;
axios.defaults.headers.common['PRIVATE-TOKEN'] = token;

const tryWrapper = async (func) => {
    try {
        let resp = await func;
        return resp.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
}
const _get = (url, params) => tryWrapper(axios.get(url, {params}));
const _post = (url, body) => tryWrapper(axios.post(url, body));

const getGroup =  groupName => _get('/groups', {search: groupName});

const getProjects = (groupId, page) => _get(`/groups/${groupId}/projects`, {page});

const getPipelineOfProject = (projectId, ref) => _get(`/projects/${projectId}/pipelines`, {
    ref,
    order: 'desc'
});

const getJobsOfPipeline = (projectId, pipelineId) => _get(`/projects/${projectId}/pipelines/${pipelineId}/jobs`);

const triggerJob = (projectId, job) => {
    let jobId = job['id'];
    let action = job['status'] === 'manual' ? 'play' : 'retry';
    return _post(`/projects/${projectId}/jobs/${jobId}/${action}`);
}

module.exports = {
    getGroup,
    getProjects,
    getPipelineOfProject,
    getJobsOfPipeline,
    triggerJob
}
