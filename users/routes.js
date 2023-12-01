import * as dao from "./dao.js";
// let currentUser = null;
function UserRoutes(app) {
    const createUser = async (req, res) => {
        const user = await dao.createUser(req.body);
        res.json(user);
    };

    const deleteUser = async (req, res) => {
        const status = await dao.deleteUser(req.params.userId);
        res.json(status);
    };

    const findAllUsers = async (req, res) => {
        const users = await dao.findAllUsers();
        res.json(users);

    };
    const findUserById = async (req, res) => {
        const user = await dao.findUserById(req.params.userId);
        if(!user){
            res.status(400).json({
                message: "User doesn't exist"
            });
            return;
        }
        res.json(user);
    };
    const updateUser = async (req, res) => {
        try {
            const userId = req.params.userId;

            // User whose value is to be updated
            const user = await dao.findUserById(userId);

            // Current user who is logged in the session
            const currentUser = req.session['currentUser'];

            // If user exists in the DB
            if(user){
                const status = await dao.updateUser(userId, req.body);

                // If the currentUser(ADMIN) is updating their own info
                if(user._id === currentUser._id){
                    // Updating the session value of the current user
                    req.session['currentUser'] = await dao.findUserById(userId);
                }

                res.json(status);
            }
            else{
                res.status(400).json({
                    message: "User does not exist"
                })
            }

        }
        catch(error){
            res.status(400).json({
                message: "Error updating user info"
            });
        }
    };
    const signup = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json(
                { message: "Username already taken" });
            return;
        }
       const currentUser = await dao.createUser(req.body);
        req.session['currentUser'] = currentUser;
        res.json(currentUser);
    };
    const signin = async (req, res) => {
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);
        if(!currentUser){
            res.status(400).json({message:"Invalid credentials"});
            return;
        }
        req.session['currentUser'] = currentUser;
        res.json(currentUser);
    };
    const signout = (req, res) => {
        req.session.destroy();
        res.json(200);
    };
    const account = async (req, res) => {
        res.json(req.session['currentUser']);
    };

    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/account", account);
}
export default UserRoutes;