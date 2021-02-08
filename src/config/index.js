const yaml = require('yaml');
const fs = require('fs');
const path = require('path');

const rootPath = path.resolve(__dirname, "../..");
const file = fs.readFileSync(`${rootPath}/config.yml`, 'utf8');
const config = yaml.parse(file);

module.exports = {
    url:          config["url"],
    token:        config["token"],
    groupName:    config["group_name"],
    branch:       config["branch"],
    stage:        config["stage"],
    projectNames: config["projects"]
};
