import db from "../Database/index.js";

function AssignmentRoutes(app) {

    app.get('/api/courses/:courseId/assignments/', (req, res) => {
        const { courseId } = req.params;
        const assignments = db.assignments.filter((a) => a.course === courseId);
        res.send(assignments);
    })

    app.post('/api/courses/:courseId/assignments/', (req, res) => {
        const { courseId } = req.params;
        const assignment = {
            ...req.body,
            _id: new Date().getTime().toString(),
            course : courseId,
        }
        db.assignments.push(assignment);
        res.send(assignment);
    })

    app.delete('/api/assignments/:assignmentId', (req, res) => {
        const { assignmentId } = req.params;
        const index = db.assignments.findIndex((a) => a._id === assignmentId);
        db.assignments.splice(index, 1);
        res.sendStatus(200);
    })

    app.put('/api/assignments/:assignmentId', (req, res) => {
        const { assignmentId } = req.params;
        const index = db.assignments.findIndex((a) => a._id === assignmentId);
        db.assignments[index] = { ...req.body };
        res.sendStatus(204);
    })
}

export default AssignmentRoutes;