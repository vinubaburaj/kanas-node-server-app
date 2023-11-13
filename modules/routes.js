import db from "../Database/index.js";

function ModuleRoutes(app) {

    app.get('/api/courses/:cid/modules', (req, res) => {
        const { cid } = req.params;
        const modules = db.modules.filter((m) => m.course === cid);
        res.send(modules);
    });

    app.post('/api/courses/:cid/modules', (req, res) => {
        const { cid } = req.params;
        const  newModule  = {
            ...req.body,
            _id: new Date().getTime().toString(),
            course: cid,
        };
        db.modules.push(newModule);
        res.send(newModule);
    });

    app.delete('/api/modules/:moduleId', (req, res) => {
        const { mId } = req.params;
        db.modules = db.modules.filter((m) => m._id !== mId);
        res.sendStatus(200);
    });

    app.put('/api/modules/:moduleId', (req, res) => {
        const { mId } = req.params;
        const moduleIndex = db.modules.findIndex((m) => m._id === mId);
        db.modules[moduleIndex] = {
            ...req.body
        };
        res.sendStatus(204);
    })
}

export default ModuleRoutes;