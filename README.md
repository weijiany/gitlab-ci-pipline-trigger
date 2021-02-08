# gitlab-ci-pipeline-trigger

这是一个用来自动触发所有 gitlab ci pipeline 的小工具

## 准备

安装依赖

`npm install`

## 运行

`npm run trigger`

## 配置文件

在项目根目录下，存放 config.yml

```yaml
url: https://gitlab.example.com/api/v4 # gitlab server address
token: [gitlab access token]
group_name: group name
branch: branch name
stage: stage name
projects:
  - need to trigger project
  - project1
  - project2

```