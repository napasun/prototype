const connect = require("../db/connect.js");
const projectDB = require('./db/projectDB');

function undefinedValueByDefaultValueEnter(data, def) {
    if (data == undefined)
        return def;
    else
        return data;
}

exports.ProjectController = {
    listView: (req, res) => {
        res.render("project/project/list", {menu : ["Project", "Project 목록"]});
    },
    list: (req, res) => {
        let page = req.query.page;
        let rows = req.query.rows;
         
        connect.dbOpen({"path": connect.config.db.project, "projectsParam": []})
        .then(projectDB.projectService.findByAll)
        .then(connect.dbClose)
        .then((result) => {
            if (result.err) {
                console.log(result.err);
            }

            res.send({rows : result.projects, page: page, total: 1, records: result.projects.length});
        });
    },
    formView: (req, res) => {
        let idx = req.query.idx;
        if (idx) {
            connect.dbOpen({"path": connect.config.db.project, "projectParam": [idx]})
            .then(projectDB.projectService.findByIdx)
            .then(connect.dbClose)
            .then((result) => {
                if (result.err) {
                    console.log(result.err);
                }

                res.render("project/project/form", {menu : ["프로젝트", "프로젝트 편집"], row: result.project});
            });
        } else {
            res.render("project/project/form", {menu : ["프로젝트", "프로젝트 편집"], row: null});
        }
    },
    save: (req, res) => {
        connect.dbOpen({"path": connect.config.db.project, "saveParam": [
            req.body.title,
            req.body.description,
            req.body.view_mode
        ]})
        .then(projectDB.projectService.save)
        .then(connect.dbClose)
        .then((result) => {
            res.send({result: result.err, idx: result.result});
        });
    },
    update: (req, res) => {
        console.log(req.body)
        connect.dbOpen({"path": connect.config.db.project, "updateParam": [
            req.body.title,
            req.body.description,
            req.body.view_mode,
            req.body.idx
        ]})
        .then(projectDB.projectService.update)
        .then(connect.dbClose)
        .then((result) => {
            
            res.send({result: result.err, idx: req.body.idx});
        });
    },
    delete: (req, res) => {
        connect.dbOpen({"path": connect.config.db.project, "deleteParam": [req.body.idx]})
        .then(projectDB.projectService.delete)
        .then(connect.dbClose)
        .then((result) => {
            res.send({result: result.err});
        });
    },
    readView: (req, res) => {
        connect.dbOpen({"path": connect.config.db.project, "프로젝트": [req.query.idx]})
        .then(projectDB.projectService.findByIdx)
        .then(connect.dbClose)
        .then((result) => {
            res.render("project/project/read", {menu : ["Project", ""], row: result.project});
        });
    },
}

exports.VersionController = {
    listView: (req, res) => {
        res.render("project/version/list", {menu : ["Project", "Version 목록"]})
    },
    list: (req, res) => {
        connect.dbOpen({"path": connect.config.db.project, "versionsParam": []})
        .then(projectDB.versionService.findByAll)
        .then(connect.dbClose)
        .then((result) => {
            if (result.err) {
                console.log(result.err);
            }

            res.send({rows : result.versions, page: 1, total: 1, records: result.versions.length});
        });
    },
    listByProjectIdx: (req, res) => {
        connect.dbOpen({"path": connect.config.db.project, "versionsParam": [req.query.projectIdx]})
        .then(projectDB.versionService.findByProjectIdx)
        .then(connect.dbClose)
        .then((result) => {
            if (result.err) {
                console.log(result.err);
            }
            console.log(result)
            res.send({rows : result.versions});
        });
    },
    formView: (req, res) => {
        res.render("project/version/form", {menu : ["Project", ""]});
    },
    save: (req, res) => {
        connect.dbOpen({"path": connect.config.db.project, "saveParam": [
            req.body.projectIdx,
            req.body.title,
            req.body.description,
            req.body.start_date,
            req.body.finish_date
        ]})
        .then(projectDB.versionService.save)
        .then(connect.dbClose)
        .then((result) => {
            res.send({result: result.err, idx: result.result});
        });
    },
    update: (req, res) => {
        connect.dbOpen({"path": connect.config.db.project, "updateParam": [
            req.body.projectIdx,
            req.body.title,
            req.body.description,
            req.body.start_date,
            req.body.finish_date,
            req.body.idx
        ]})
        .then(projectDB.versionService.update)
        .then(connect.dbClose)
        .then((result) => {
            res.send({result: result.err, idx: req.body.idx});
        });
    },
    delete: (req, res) => {
        connect.dbOpen({"path": connect.config.db.project, "deleteParam": [req.body.idx]})
        .then(projectDB.versionService.delete)
        .then(connect.dbClose)
        .then((result) => {
            res.send({result: result.err});
        });
    },
    readView: (req, res) => {
        connect.dbOpen({"path": connect.config.db.project, "versionParam": [req.query.idx]})
        .then(projectDB.versionService.findByIdx)
        .then(connect.dbClose)
        .then((result) => {
            res.render("project/version/read", {menu : ["Project", ""], row: result.version});
        });
    },
}

exports.TaskController = {
    listView: (req, res) => {
        res.render("project/task/list", {menu : ["프로젝트", "일감목록"]})
    },
    list: (req, res) => {
        let page = undefinedValueByDefaultValueEnter(req.query.page, 1);
        let rows = undefinedValueByDefaultValueEnter(req.query.rows, 10);
        let start = parseInt((page-1)*rows);
        let finish = parseInt(page*rows)
        connect.dbOpen({"path": connect.config.db.project, "tasksParam": [start, finish]})
        .then(projectDB.taskService.findByAll)
        .then(projectDB.taskService.count)
        .then(connect.dbClose)
        .then((result) => {
            if (result.err) {
                console.log(result.err);
            }
            res.send({rows : result.tasks, page: page, total: parseInt((result.count.total - 1) / rows) + 1, records: result.tasks.length});
        });
    },
    formView: (req, res) => {
        let idx = req.query.idx;
        if (idx) {
            connect.dbOpen({"path": connect.config.db.project, "taskParam": [idx]})
            .then(projectDB.taskService.findByIdx)
            .then(connect.dbClose)
            .then((result) => {
                if (result.err) {
                    console.log(result.err);
                }

                res.render("project/task/form", {menu : ["Project", "일감 편집"], row: result.task});
            });
        } else {
            res.render("project/task/form", {menu : ["Project", "일감 편집"], row: null});
        }
    },
    save: (req, res) => {
        connect.dbOpen({"path": connect.config.db.project, "saveParam": [
            req.body.parentIdx,
            req.body.projectIdx,
            req.body.title,
            req.body.description,
            req.body.type,
            req.body.status,
            req.body.start_time,
            req.body.finish_time,
            req.body.priority,
            req.body.manager,
            req.body.progress,
            req.body.versionIdx
        ]})
        .then(projectDB.taskService.save)
        .then(connect.dbClose)
        .then((result) => {
            if (result.err) {
                //TODO 에러 처리
                console.log(result.err)
            } else {
                res.redirect("/project/task");
            }
            //res.send({result: result.err, idx: result.result});
        });
    },
    update: (req, res) => {
        connect.dbOpen({"path": connect.config.db.project, "updateParam": [
            req.body.parentIdx,
            req.body.projectIdx,
            req.body.title,
            req.body.description,
            req.body.type,
            req.body.status,
            req.body.start_time,
            req.body.finish_time,
            req.body.priority,
            req.body.manager,
            req.body.progress,
            req.body.versionIdx,
            req.body.idx
        ]})
        .then(projectDB.taskService.update)
        .then(connect.dbClose)
        .then((result) => {
            res.send({result: result.err, idx: req.body.idx});
        });
    },
    delete: (req, res) => {
        connect.dbOpen({"path": connect.config.db.project, "deleteParam": [req.body.idx]})
        .then(projectDB.taskService.delete)
        .then(connect.dbClose)
        .then((result) => {
            res.send({result: result.err});
        });
    },
    readView: (req, res) => {
        let idx = req.query.idx;

        connect.dbOpen({"path": connect.config.db.project, "findByIdxParam": [idx]})
        .then(projectDB.taskService.findByIdx)
        .then(connect.dbClose)
        .then((result) => {
            res.render("project/task/read", {menu : ["Project", ""], row: result.task});
        });
    },
}

exports.SettingController = {

}